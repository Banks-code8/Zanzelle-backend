// src/workers/payment.worker.js

import { Worker } from "bullmq";

import { redisConnection } from "../config/redis.js";

import Payment from "../models/payment.model.js";
import WebhookEvent from "../models/webhookEvent.model.js";

import { processSuccessfulPayment } from "../services/payment-processing.service.js";

const QUEUE_NAME = "zanzelle-payments";
const MAX_ATTEMPTS = 5;

const paymentWorker = new Worker(
  QUEUE_NAME,
  async (job) => {
    const { webhookEventId, event, data } = job.data;

    if (!webhookEventId || !event || !data?.reference) {
      throw new Error("Invalid payment webhook job payload");
    }

    // Load the persisted webhook event.
    const webhookEvent = await WebhookEvent.findById(webhookEventId);

    if (!webhookEvent) {
      throw new Error(`Webhook event ${webhookEventId} not found`);
    }

    // Idempotency: do not process an already completed event again.
    if (
      webhookEvent.processed ||
      webhookEvent.processingStatus === "processed"
    ) {
      return { skipped: true, reason: "Already processed" };
    }

    webhookEvent.processingStatus = "processing";
    webhookEvent.attempts += 1;
    webhookEvent.processingError = null;
    await webhookEvent.save();

    try {
      const payment = await Payment.findOne({
        reference: data.reference,
        provider: "paystack",
      });

      if (!payment) {
        throw new Error(`Payment ${data.reference} not found`);
      }

      // Ignore events that this worker does not handle.
      if (!["charge.success", "charge.failed"].includes(event)) {
        webhookEvent.processed = true;
        webhookEvent.processingStatus = "processed";
        webhookEvent.processedAt = new Date();
        await webhookEvent.save();

        return { skipped: true, reason: `Unhandled event: ${event}` };
      }

      // Confirm that the event's transaction matches our payment.
      if (
        data.reference !== payment.reference ||
        Number(data.amount) !== Math.round(payment.amount * 100) ||
        data.currency !== payment.currency
      ) {
        throw new Error(
          `Payment validation failed for reference ${payment.reference}`,
        );
      }

      if (event === "charge.success") {
        if (data.status !== "success") {
          throw new Error("Paystack success event has a non-success status");
        }

        // Never downgrade a previously successful payment.
        if (payment.status === "failed") {
          throw new Error(
            `Payment ${payment.reference} is already marked failed; investigate before changing it`,
          );
        }

        if (payment.status !== "success") {
          // This service MUST apply the wallet credit or bill-purchase
          // fulfillment idempotently before returning successfully.
          await processSuccessfulPayment(payment, data);

          payment.status = "success";
          payment.gatewayResponse = data;
          await payment.save();
        }
      }

      if (event === "charge.failed") {
        // A late failure event must not overwrite a successful payment.
        if (payment.status !== "success" && payment.status !== "failed") {
          payment.status = "failed";
          payment.gatewayResponse = data;
          await payment.save();
        }
      }

      webhookEvent.processed = true;
      webhookEvent.processingStatus = "processed";
      webhookEvent.processingError = null;
      webhookEvent.processedAt = new Date();
      await webhookEvent.save();

      return {
        success: true,
        reference: payment.reference,
        event,
      };
    } catch (error) {
      webhookEvent.processingStatus =
        job.attemptsMade + 1 >= MAX_ATTEMPTS ? "failed" : "pending";

      webhookEvent.processingError = error.message;
      await webhookEvent.save();

      console.error(
        `Zanzelle payment processing failed for ${data.reference}:`,
        error,
      );

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
  },
);

paymentWorker.on("ready", () => {
  console.log("Zanzelle payment worker is ready");
});

paymentWorker.on("completed", (job, result) => {
  console.log(`Payment job ${job.id} completed`, result);
});

paymentWorker.on("failed", (job, error) => {
  console.error(`Payment job ${job?.id} failed:`, error.message);
});

paymentWorker.on("error", (error) => {
  console.error("Zanzelle payment worker error:", error);
});

export default paymentWorker;

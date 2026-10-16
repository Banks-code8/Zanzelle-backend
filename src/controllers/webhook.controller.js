// // src/controllers/webhook.controller.js

// import crypto from "crypto";
// import { paymentQueue } from "../queues/reservation.queue.js";
// import WebhookEvent from "../models/webhookEvent.model.js";

// export const paystackWebhook = async (req, res) => {
//   try {
//     const secret = process.env.PAYSTACK_SECRET;

//     const hash = crypto
//       .createHmac("sha512", secret)
//       .update(req.body)
//       .digest("hex");

//     const signature = req.headers["Marketplace-paystack-signature"];

//     if (hash !== signature) {
//       return res.status(401).send("Unauthorized");
//     }

//     const event = JSON.parse(req.body);

//     const reference = event.data.reference;

//     // 1. LOG EVENT (AUDIT TRAIL)
//     await WebhookEvent.create({
//       provider: "paystack",
//       event: event.event,
//       reference,
//       payload: event.data,
//     });

//     // 2. PUSH TO QUEUE
//     await paymentQueue.add("process-payment", {
//       event: event.event,
//       data: event.data,
//     });

//     return res.status(200).send("Webhook queued");
//   } catch (error) {
//     console.error(error);
//     return res.status(500).send("Server error");
//   }
// };

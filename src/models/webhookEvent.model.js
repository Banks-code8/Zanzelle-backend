// src/models/webhookEvent.model.js

import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    provider: {
      type: String,
      enum: ["paystack", "stripe"],
      required: true,
      index: true,
    },

    event: {
      type: String,
      required: true,
      trim: true,
    },

    reference: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },

    // Stable provider event ID, or a deterministic webhook deduplication key.
    eventId: {
      type: String,
      default: null,
      trim: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },

    processed: {
      type: Boolean,
      default: false,
      index: true,
    },

    processingStatus: {
      type: String,
      enum: ["pending", "processing", "processed", "failed"],
      default: "pending",
      index: true,
    },

    processingError: {
      type: String,
      default: null,
    },

    attempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate webhook records for the same provider and event ID.
webhookEventSchema.index(
  { provider: 1, eventId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      eventId: { $type: "string" },
    },
  },
);

const WebhookEvent =
  mongoose.models.WebhookEvent ||
  mongoose.model("WebhookEvent", webhookEventSchema);

export default WebhookEvent;

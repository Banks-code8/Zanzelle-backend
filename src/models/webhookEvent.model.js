// // src/models/webhookEvent.model.js

// import mongoose from "mongoose";

// const webhookEventSchema = new mongoose.Schema(
//   {
//     provider: {
//       type: String,
//       enum: ["paystack", "stripe"],
//       required: true,
//     },

//     event: String,

//     reference: String,

//     payload: {
//       type: Object,
//       default: {},
//     },

//     processed: {
//       type: Boolean,
//       default: false,
//     },

//     processingError: {
//       type: String,
//       default: null,
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("WebhookEvent", webhookEventSchema);

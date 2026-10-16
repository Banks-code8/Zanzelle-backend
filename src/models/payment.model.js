// // src/models/payment.model.js

// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     orderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Order",
//       required: true,
//     },

//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     provider: {
//       type: String,
//       enum: ["paystack", "stripe"],
//       required: true,
//     },

//     amount: {
//       type: Number,
//       required: true,
//     },

//     currency: {
//       type: String,
//       default: "NGN",
//     },

//     reference: {
//       type: String,
//       required: true,
//       unique: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "success", "failed"],
//       default: "pending",
//     },

//     gatewayResponse: {
//       type: Object,
//       default: {},
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("Payment", paymentSchema);

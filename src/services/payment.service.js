// // src/services/payment.service.js

// import * as paymentRepo from "../repository/payment.repository.js";
// import * as paystack from "../config/paystack.js";
// import Order from "../models/order.model.js";
// import { v4 as uuidv4 } from "uuid";
// import User from "../models/user.model.js";

// // ======================
// // INITIALIZE PAYMENT
// // ======================

// export const initializePaymentService = async (orderId, user) => {
//   const order = await Order.findById(orderId);

//   if (!order) {
//     throw new Error("Order not found");
//   }

//   const dbUser = await User.findById(user.id);

//   if (!dbUser) {
//     throw new Error("User not found");
//   }

//   // Validate order total
//   if (!order.totalPrice || order.totalPrice <= 0) {
//     throw new Error(`Invalid order total: ${order.totalPrice}`);
//   }

//   const reference = `PAY-${uuidv4()}`;

//   // Paystack expects amount in the smallest currency unit.
//   // Example: ₦10,000 -> 1,000,000 kobo
//   const amountInKobo = Math.round(order.totalPrice * 100);

//   const paymentData = await paystack.initializePaystackPayment({
//     email: dbUser.email,
//     amount: amountInKobo,
//     reference,
//   });

//   await paymentRepo.createPaymentRepo({
//     orderId,
//     userId: dbUser._id,
//     provider: "paystack",
//     amount: order.totalPrice,
//     reference,
//   });

//   return {
//     ...paymentData,
//     reference,
//   };
// };

// // ======================
// // VERIFY PAYMENT
// // ======================

// export const verifyPaymentService = async (reference) => {
//   const payment = await paymentRepo.findByReferenceRepo(reference);

//   if (!payment) {
//     throw new Error("Payment not found");
//   }

//   const verification = await paystack.verifyPaystackPayment(reference);

//   if (verification.status !== "success") {
//     await paymentRepo.updatePaymentRepo(reference, {
//       status: "failed",
//       gatewayResponse: verification,
//     });

//     throw new Error("Payment failed");
//   }

//   // Mark payment successful
//   await paymentRepo.updatePaymentRepo(reference, {
//     status: "success",
//     gatewayResponse: verification,
//   });

//   // Update order
//   await Order.findByIdAndUpdate(payment.orderId, {
//     paymentStatus: "paid",
//     orderStatus: "processing",
//   });

//   return {
//     success: true,
//     message: "Payment verified successfully",
//   };
// };

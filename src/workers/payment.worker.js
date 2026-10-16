// // src/workers/payment.worker.js

// import { Worker } from "bullmq";

// import { redis } from "../../payment/src/config/redis.js";

// import Cart from "../models/cart.model.js";
// import Order from "../models/order.model.js";
// import Payment from "../models/payment.model.js";

// import {
//   confirmStockService,
//   releaseStockService,
// } from "../services/inventory.service.js";

// const paymentWorker = new Worker(
//   "payment-events",
//   async (job) => {
//     const { event, data } = job.data;

//     try {
//       const payment = await Payment.findOne({
//         reference: data.reference,
//       });

//       if (!payment) {
//         console.log(`Payment ${data.reference} not found.`);
//         return;
//       }

//       const order = await Order.findById(payment.orderId);

//       if (!order) {
//         console.log(`Order ${payment.orderId} not found.`);
//         return;
//       }

//       switch (event) {
//         case "charge.success": {
//           payment.status = "success";
//           payment.gatewayResponse = data;
//           await payment.save();

//           order.paymentStatus = "paid";
//           order.orderStatus = "processing";
//           await order.save();

//           // Confirm reserved stock
//           await Promise.all(
//             order.items.map((item) =>
//               confirmStockService(item.productId, item.quantity),
//             ),
//           );

//           // Clear user's cart
//           await Cart.findOneAndUpdate(
//             { userId: order.userId },
//             {
//               items: [],
//               totalItems: 0,
//               totalPrice: 0,
//             },
//           );

//           console.log(`✅ Payment successful: ${payment.reference}`);

//           break;
//         }

//         case "charge.failed": {
//           payment.status = "failed";
//           payment.gatewayResponse = data;
//           await payment.save();

//           order.paymentStatus = "failed";
//           order.orderStatus = "cancelled";
//           await order.save();

//           // Release reserved stock
//           await Promise.all(
//             order.items.map((item) =>
//               releaseStockService(item.productId, item.quantity),
//             ),
//           );

//           console.log(`❌ Payment failed: ${payment.reference}`);

//           break;
//         }

//         default:
//           console.log(`⚠️ Unhandled payment event: ${event}`);
//       }
//     } catch (error) {
//       console.error("Payment Worker Error:", error);
//       throw error;
//     }
//   },
//   {
//     connection: redis,
//   },
// );

// paymentWorker.on("ready", () => {
//   console.log("✅ Payment Worker is ready");
// });

// paymentWorker.on("completed", (job) => {
//   console.log(`✅ Payment Job ${job.id} completed`);
// });

// paymentWorker.on("failed", (job, err) => {
//   console.error(`❌ Payment Job ${job?.id} failed`, err);
// });

// paymentWorker.on("error", (err) => {
//   console.error("❌ Payment Worker Error:", err);
// });

// export default paymentWorker;

// // src/workers/reservation.worker.js
// {
//   /*reserve authentication worker */
// }
// import { Worker } from "bullmq";
// import { redis } from "../config/redis.js";

// import Order from "../models/order.model.js";
// import { releaseStockService } from "../services/inventory.service.js";

// const reservationWorker = new Worker(
//   "reservation-expiry",
//   async (job) => {
//     const { orderId } = job.data;

//     const order = await Order.findById(orderId);

//     if (!order) {
//       console.log(`Order ${orderId} not found.`);
//       return;
//     }

//     // Already paid
//     if (order.paymentStatus === "paid") {
//       console.log(`Order ${order._id} already paid.`);
//       return;
//     }

//     // Release reserved stock
//     for (const item of order.items) {
//       await releaseStockService(item.productId, item.quantity);
//     }

//     order.paymentStatus = "failed";
//     order.orderStatus = "cancelled";

//     await order.save();

//     console.log(`⌛ Reservation expired: ${order._id}`);
//   },
//   {
//     connection: redis,
//   },
// );

// reservationWorker.on("completed", (job) => {
//   console.log(`✅ Reservation Job ${job.id} completed`);
// });

// reservationWorker.on("failed", (job, err) => {
//   console.error(`❌ Reservation Job ${job?.id} failed`, err);
// });

// export default reservationWorker;

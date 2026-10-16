// src/queues/queue.js

import { Queue } from "bullmq";
import { redis } from "../../payment/src/config/redis.js";

// Release reserved stock if payment isn't completed
export const reservationQueue = new Queue("reservation-expiry", {
  connection: redis,
});

// // Process payment-related jobs
// export const paymentQueue = new Queue("payment-events", {
//   connection: redis,
// });

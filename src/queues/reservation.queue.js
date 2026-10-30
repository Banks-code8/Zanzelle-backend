import { Queue } from "bullmq";
import { redisConnection } from "../config/redis.js";

export const paymentQueue = new Queue("zanzelle-payments", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: false,
    removeOnFail: false,
  },
});

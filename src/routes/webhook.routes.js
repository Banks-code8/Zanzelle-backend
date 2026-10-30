// // src/routes/webhook.routes.js

// import express from "express";
// import { paystackWebhook } from "../controllers/webhook.controller.js";

// const router = express.Router();

// // raw body required (IMPORTANT)
// router.post(
//   "/paystack",
//   express.raw({ type: "application/json" }),
//   paystackWebhook,
// );

// export default router;

import express from "express";
import { paystackWebhook } from "./controllers/webhook.controller.js";

const app = express();

// Register this route before express.json().
app.post(
  "/api/webhooks/paystack",
  express.raw({ type: "application/json" }),
  paystackWebhook,
);

// Parse JSON for your other API routes.
app.use(express.json());

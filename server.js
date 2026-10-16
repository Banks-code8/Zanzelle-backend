import express from "express";
import cors from "cors";
import "./src/config/env.js";
// import "./payment/src/config/redis.js";

// Database
import connectDB from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import oauthRoutes from "./src/routes/oauth.routes.js";

// import paymentRoutes from "./src/routes/payment.routes.js";
// import webhookRoutes from "./src/routes/webhook.routes.js";

// // Workers
// import "./src/workers/payment.worker.js";
// import "./payment/src/workers/reservation.worker.js";

// Middleware
import { errorHandler } from "./src/middleware/error.middleware.js";

const app = express();

/* ---------------CORS----------------- */

const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

/* --------------PAYSTACK WEBHOOK------------------ */
/* Must come BEFORE express.json() */

// app.use(
//   "/api/webhooks/paystack",
//   express.raw({ type: "application/json" }),
//   webhookRoutes,
// );

/* --------------GLOBAL MIDDLEWARE------------------ */

app.use(express.json());

/* -------------HEALTH CHECK------------------- */

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Zanzelle payment API is running 🚀",
  });
});

/* --------------API ROUTES------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/oauth", oauthRoutes);

// app.use("/api/payments", paymentRoutes);

/* --------------ERROR HANDLER------------------ */

app.use(errorHandler);

/* ---------------START SERVER----------------- */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log("✅ MongoDB Connected");
      console.log("✅ Redis Connected");
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server");
    console.error(error);
    process.exit(1);
  }
};

startServer();

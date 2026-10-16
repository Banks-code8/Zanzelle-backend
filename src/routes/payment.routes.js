// // src/routes/payment.routes.js

// import express from "express";

// import {
//   initializePayment,
//   verifyPayment,
// } from "../controllers/payment.controller.js";

// import { authProtect } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.use(authProtect);

// // Start payment
// router.post("/initialize", initializePayment);

// // Verify payment
// router.get("/verify/:reference", verifyPayment);

// export default router;

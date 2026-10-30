import express from "express";

import {
  wallet,
  purchasePayment,
  verifyPayment,
  transactionHistory,
  reciept,
  interTransfer,
  outerTransfer,
  withdrawal,
} from "../controllers/payment.controller.js";

import { authProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authProtect);

router.post("/wallet", wallet);
router.post("/purchase", purchasePayment);

router.get("/verify/:reference", verifyPayment);
router.get("/transactions", transactionHistory);
router.get("/receipt/:reference", reciept);

router.post("/transfers/internal", interTransfer);
router.post("/transfers/external", outerTransfer);
router.post("/withdrawals", withdrawal);

export default router;

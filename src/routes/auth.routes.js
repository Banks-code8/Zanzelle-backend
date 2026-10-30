// // auth.routes.js
// import express from "express";
// import {
//   register,
//   login,
//   getMe,
//   logout,
//   verification,
//   forgetPassword,
// } from "./../controllers/auth.controller.js";
// import { authProtect } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/verification", verification);
// router.post("/login", login);
// router.patch("/forgetPassword", forgetPassword);
// router.get("/getMe", authProtect, getMe);
// router.post("/logout", logout);
// export default router;

import express from "express";

import {
  register,
  login,
  getMe,
  logout,
  verification,
  resendVerification,
  forgetPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { authProtect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Registration and email verification
router.post("/register", register);
router.post("/verification", verification);
router.post("/resend-verification", resendVerification);

// Login and profile
router.post("/login", login);
router.get("/getMe", authProtect, getMe);
router.post("/logout", logout);

// Password recovery
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);

export default router;

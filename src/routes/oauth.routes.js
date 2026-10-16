import express from "express";
import passport from "passport";
import { oauthSuccess } from "../controllers/oauth.controller.js";

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  oauthSuccess,
);

export default router;

import jwt from "jsonwebtoken";

export const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

export const VerificationToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresAt: Date.now() + 15 * 60 * 10,
  });

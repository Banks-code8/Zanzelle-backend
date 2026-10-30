import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Generate a secure random token for email verification and password reset
export const generateRandomToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

// Hash tokens before storing them in the database
export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Generate a six-digit email verification code
export const generateOTP = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// Create a short-lived JWT verification token if needed
export const VerificationToken = (payload) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "10m",
  });
};

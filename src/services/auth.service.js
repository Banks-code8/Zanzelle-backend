import User from "../models/user.model.js";

import { hashPassword, comparePassword } from "../utils/hash.js";

import {
  generateToken,
  generateRandomToken,
  generateOTP,
  hashToken,
} from "../utils/generateToken.js";

import { sendEmail } from "../utils/sendEmail.js";

// ======================
// REGISTER
// ======================
export const register = async ({ fullName, email, password }) => {
  if (!fullName?.trim() || !email?.trim() || !password) {
    throw new Error("Full name, email and password are required");
  }

  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  email = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const otp = generateOTP();

  const user = await User.create({
    fullName: fullName.trim(),
    email,
    password: hashedPassword,
    role: "user",
    isEmailVerified: false,
    verificationTokenHash: hashToken(otp),
    verificationTokenExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  try {
    await sendEmail({
      to: email,
      subject: "Verify your Zanzelle email",
      html: `
      <h2>Zanzelle email verification</h2>
      <p>Hello ${fullName},</p>
      <p>Your verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
      text: `Hello ${fullName}, your Zanzelle verification code is ${otp}. It expires in 10 minutes.`,
    });
  } catch (error) {
    console.error("OTP email failed:", error.message);
    throw new Error(
      "Account created, but verification email failed. Please request a new code.",
    );
  }

  return {
    message: "Account created. Check your email for the verification code.",
    userId: user._id,
  };
};

// ======================
// VERIFY EMAIL
// ======================
export const verification = async ({ email, otp }) => {
  if (!email || !otp) {
    throw new Error("Email and verification code are required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+verificationTokenHash +verificationTokenExpiresAt");

  if (!user || user.isEmailVerified) {
    throw new Error("Invalid or expired verification code");
  }

  const isMatch =
    user.verificationTokenHash === hashToken(String(otp)) &&
    user.verificationTokenExpiresAt &&
    user.verificationTokenExpiresAt.getTime() > Date.now();

  if (!isMatch) {
    throw new Error("Invalid or expired verification code");
  }

  user.isEmailVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationTokenExpiresAt = undefined;

  await user.save();

  return {
    message: "Email verified successfully. You can now log in.",
  };
};

// ======================
// RESEND VERIFICATION
// ======================
export const resendVerification = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+verificationTokenHash +verificationTokenExpiresAt");

  const response = {
    message: "If the account requires verification, a new code will be sent.",
  };

  if (!user || user.isEmailVerified) {
    return response;
  }

  const otp = generateOTP();

  user.verificationTokenHash = hashToken(otp);
  user.verificationTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await user.save();

  await sendEmail({
    to: user.email,
    subject: "Your new verification code",
    html: `
      <h2>Email Verification</h2>
      <p>Your new verification code is:</p>
      <h1>${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });

  return response;
};

// ======================
// LOGIN
// ======================
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+password");

  if (!user || !(await comparePassword(password, user.password))) {
    throw new Error("Invalid email or password");
  }

  if (!user.isEmailVerified) {
    throw new Error("Please verify your email before logging in");
  }

  const accessToken = generateToken({
    id: user._id.toString(),
    role: user.role,
  });

  const safeUser = user.toObject();
  delete safeUser.password;
  delete safeUser.verificationTokenHash;
  delete safeUser.verificationTokenExpiresAt;
  delete safeUser.passwordResetTokenHash;
  delete safeUser.passwordResetTokenExpiresAt;

  return {
    accessToken,
    user: safeUser,
  };
};

// ======================
// FORGOT PASSWORD
// ======================
export const forgetPassword = async ({ email }) => {
  if (!email) {
    throw new Error("Email is required");
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  }).select("+passwordResetTokenHash +passwordResetTokenExpiresAt");

  const response = {
    message: "If the account exists, password reset instructions will be sent.",
  };

  if (!user) {
    return response;
  }

  const resetToken = generateRandomToken();

  user.passwordResetTokenHash = hashToken(resetToken);
  user.passwordResetTokenExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h2>Password Reset</h2>
        <p>Click below to reset your password.</p>
        <a href="${resetUrl}">Reset Password</a>
        <p>This link expires in 15 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });
  } catch (error) {
    user.passwordResetTokenHash = undefined;
    user.passwordResetTokenExpiresAt = undefined;
    await user.save();

    throw new Error("Could not send password reset email");
  }

  return response;
};

// ======================
// RESET PASSWORD
// ======================
export const resetPassword = async ({ token, newPassword }) => {
  if (!token || !newPassword) {
    throw new Error("Reset token and new password are required");
  }

  if (newPassword.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }

  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetTokenExpiresAt: { $gt: new Date() },
  }).select("+password +passwordResetTokenHash +passwordResetTokenExpiresAt");

  if (!user) {
    throw new Error("Invalid or expired password reset link");
  }

  user.password = await hashPassword(newPassword);
  user.passwordResetTokenHash = undefined;
  user.passwordResetTokenExpiresAt = undefined;

  await user.save();

  return {
    message: "Password reset successfully. Please log in.",
  };
};

// ======================
// LOGOUT
// ======================
export const logout = async () => {
  return {
    message: "Logged out successfully",
  };
};

// ======================
// PROFILE / GET ME
// ======================
export const profile = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  const safeUser = user.toObject();

  delete safeUser.password;
  delete safeUser.verificationTokenHash;
  delete safeUser.verificationTokenExpiresAt;
  delete safeUser.passwordResetTokenHash;
  delete safeUser.passwordResetTokenExpiresAt;

  return safeUser;
};

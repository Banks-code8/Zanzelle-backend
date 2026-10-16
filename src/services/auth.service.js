// auth.service.js

import {
  createUser,
  findUserByEmail,
  findUserByEmailWithPassword,
  getUserById,
} from "../repository/user.repository.js";

import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken, VerificationToken } from "../utils/generateToken.js";

// ======================
// REGISTER
// ======================
export const register = async ({
  fullName,
  // phoneNumber,
  email,
  password,
  role = "user",
}) => {
  const existing = await findUserByEmail(email);

  if (existing) {
    throw new Error("User already exists");
  }

  const hashed = await hashPassword(password);

  const user = await createUser({
    fullName,
    // phoneNumber,
    email,
    password: hashed,
    role,
  });
  // // ----------email verification Token------------//
  // const rawToken = crypto.randomBytes(32).toString("hex");
  // const tokenHash = crypto.createHash("sha256").update(rawToken).digest(hex);
  // await VerificationToken.create({
  //   id: user._id,
  //   tokenHash,
  //   expiresAt: Date.now() + 15 * 60 * 1000,
  // });
  // const link = `process.env.CLIENT_URL/verify-email?token=${rawToken}`;
  // await sendEmail(email, link);
  // return res
  //   .status(201)
  //   .json({ suceess: true, message: "Accout created. Cheack email" });
  // // --------------------------------------------//
  user.password = undefined;

  return user;
};

// ======================
// LOGIN
// ======================
export const login = async ({ email, password }) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = generateToken({
    id: user._id,
    role: user.role,
  });

  user.password = undefined;

  return {
    accessToken,
    user,
  };
};

// ======================
// PROFILE
// ======================
export const profile = async (userId) => {
  const user = await getUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  user.password = undefined;

  return user;
};

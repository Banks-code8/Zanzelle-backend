import User from "../models/user.model.js";

// normal user lookup
export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

// login lookup (includes password)
export const findUserByEmailWithPassword = async (email) => {
  return User.findOne({ email }).select("+password");
};

// create user (normal register)
export const createUser = async (data) => {
  return User.create(data);
};

// OAuth user (FIXED: use fullName consistently)
export const findOrCreateOAuthUser = async (profile) => {
  const email = profile.emails?.[0]?.value;

  let user = await User.findOne({ email });

  if (!user) {
    user = await User.create({
      fullName: profile.displayName, // ✅ FIXED (was "name")
      email,
      googleId: profile.id,
      authProvider: "google",
    });
  }

  return user;
};

// get user by id (FIXED: remove password always)
export const getUserById = async (id) => {
  return User.findById(id).select("-password");
};

import { findOrCreateOAuthUser } from "../repository/user.repository.js";
import { generateToken } from "../utils/generateToken.js";

export const handleGoogleLogin = async (profile) => {
  const user = await findOrCreateOAuthUser({
    fullName: profile.displayName,
    email: profile.emails?.[0]?.value,
    provider: "google",
    googleId: profile.id,
  });

  const token = generateToken({
    id: user._id,
    role: user.role,
  });

  return { user, token }; // 🔥 IMPORTANT
};

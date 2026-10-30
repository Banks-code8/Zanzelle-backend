import * as authService from "../services/auth.service.js";

// ======================
// COOKIE OPTIONS
// ======================
const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
});

// ======================
// ERROR HANDLER
// ======================
const handleError = (res, error) => {
  const message = error.message || "Something went wrong";

  let statusCode = 500;

  if (message === "User already exists") {
    statusCode = 409;
  } else if (
    message.includes("Invalid") ||
    message.includes("expired") ||
    message.includes("verify your email") ||
    message.includes("already verified")
  ) {
    statusCode = 400;
  } else if (message.includes("required") || message.includes("at least")) {
    statusCode = 400;
  }

  return res.status(statusCode).json({
    success: false,
    message,
  });
};

// ======================
// REGISTER
// ======================
export const register = async (req, res) => {
  try {
    const data = await authService.register(req.body);

    return res.status(201).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// VERIFY EMAIL
// ======================
export const verification = async (req, res) => {
  try {
    const data = await authService.verification(req.body);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// RESEND VERIFICATION
// ======================
export const resendVerification = async (req, res) => {
  try {
    const data = await authService.resendVerification(req.body);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// LOGIN
// ======================
export const login = async (req, res) => {
  try {
    const { accessToken, user } = await authService.login(req.body);

    res.cookie("accessToken", accessToken, cookieOptions());

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// FORGOT PASSWORD
// ======================
export const forgetPassword = async (req, res) => {
  try {
    const data = await authService.forgetPassword(req.body);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// RESET PASSWORD
// ======================
export const resetPassword = async (req, res) => {
  try {
    const data = await authService.resetPassword(req.body);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// GET ME / PROFILE
// ======================
export const getMe = async (req, res) => {
  try {
    const user = await authService.profile(req.user.id);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return handleError(res, error);
  }
};

// ======================
// LOGOUT
// ======================
export const logout = async (req, res) => {
  try {
    await authService.logout();

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("LOGOUT ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
    });
  }
};

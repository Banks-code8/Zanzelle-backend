// //------------production middleware---------//
// import jwt from "jsonwebtoken";

// export const authProtect = (req, res, next) => {
//   console.log("Cookies received by Render:", req.cookies);

//   const token = req.cookies.accessToken;

//   console.log("Access token received:", !!token);

//   if (!token) {
//     return res.status(401).json({
//       message: "Unauthorized",
//     });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);

//     console.log("Decoded JWT:", decoded);

//     req.user = decoded;

//     next();
//   } catch (error) {
//     console.error("JWT verification error:", error);

//     return res.status(401).json({
//       message: "Invalid token",
//     });
//   }
// };

import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authProtect = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token",
    });
  }
};

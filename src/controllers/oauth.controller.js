import { generateToken } from "../utils/generateToken.js";
import { sendCookie } from "../utils/cookie.js";

export const oauthSuccess = (req, res) => {
  try {
    const user = req.user;

    const token = generateToken({
      id: user._id,
      role: user.role,
    });

    sendCookie(res, token);

    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (error) {
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

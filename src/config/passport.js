import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { handleGoogleLogin } from "../services/oauth.service.js";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await handleGoogleLogin(profile);
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

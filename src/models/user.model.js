import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    // fullName: {
    //   firstName: { type: String, required: true, trim: true },
    //   lastName: { type: String, required: true, trim: true },
    // },
    // phoneNumber: {
    //   type: String,
    //   required: true,
    //   unique: true,
    //   trim: true,
    //   index: true,
    // },
    // phoneNumber: {
    //   e164: { type: String, required: true, unique: true, trim: true, index:true },
    //   countryIso: { type: String, required: true },
    //   countryCode: { type: String, required: true },
    //   isVerified: { type: Boolean, default: false },
    //   verrifiedAt: { type: Date },
    // },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);

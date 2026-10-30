import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // User information
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must contain at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    // User role
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // Email verification
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerifiedAt: {
      type: Date,
      default: null,
    },

    verificationTokenHash: {
      type: String,
      select: false,
      default: undefined,
    },

    verificationTokenExpiresAt: {
      type: Date,
      select: false,
      default: undefined,
    },

    // Password reset
    passwordResetTokenHash: {
      type: String,
      select: false,
      default: undefined,
    },

    passwordResetTokenExpiresAt: {
      type: Date,
      select: false,
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);

// Normalize email before saving
userSchema.pre("save", function () {
  if (this.isModified("email")) {
    this.email = this.email.trim().toLowerCase();
  }

  return;
});

const User = mongoose.model("User", userSchema);

export default User;

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userschema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
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
    accountVerified: {
      type: Boolean,
      default: true,
    },

    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Book",
        },
        bookTitle: {
          type: String,
        },
        returned: {
          type: Boolean,
          default: false,
        },
        borrowedAt: {
          type: Date,
        },
        returnDate: {
          type: Date,
        },
      },
    ],
    

    avatar: {
      public_id: String,
      url: String,
    },

    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userschema.methods.generateToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

userschema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    this.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    
    return resetToken;
};

const User = mongoose.model("User", userschema);
export default User;

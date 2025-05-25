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
      default: false,
    },

    borrowedBooks: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Borrow",
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

    verificationCode: Number,
    verificationCodeExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
  }
);

userschema.methods.generateVerificationCode = function () {
  function generateRandomFiveDigitNumber() {
    const firstDigit = Math.floor(1 + Math.random() * 9);
    const remainingDigits = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return parseInt(firstDigit + remainingDigits);
  }
  const verificationCode = generateRandomFiveDigitNumber();
  this.verificationCode = verificationCode;
  this.verificationCodeExpires = Date.now() + 10 * 60 * 1000;
  return verificationCode;
};

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

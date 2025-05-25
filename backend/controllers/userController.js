import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find({ accountVerified: true });
  res.status(200).json({
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncError(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin avatar is required.", 400));
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  const isRegistered = await User.findOne({
    email,
    accountVerified: true,
  });
  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }
  if (password.length < 6) {
    return next(
      new ErrorHandler("Password must be atleast 6 digits long.", 400)
    );
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp", "image/jpg"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format is not supported.", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath,
    {
      folder: "LIBRARY_MANAGEMENT_ADMIN_SYSTEM_AVATARS",
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error (
      "cloudinary error",
      cloudinaryResponse.error || "Unknown error"
    );

    return next(
      new ErrorHandler("Failed to upload avatar image to cloudinry", 500)
    );
  }
  const admin = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    accountVerified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin,
  });
});

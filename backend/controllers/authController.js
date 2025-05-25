import catchAsyncError from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplate.js";
import crypto from "crypto";



export const Register = catchAsyncError(async (req, res, next) => {
  
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("Please enter all fields", 400));
    }

    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
      return next(new ErrorHandler("User already registered", 400));
    }

    const registrationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });

    if (registrationAttemptsByUser.length > 5) {
      return next(
        new ErrorHandler(
          "you have exceeded the number of login attempts, try after some time",
          400
        )
      );
    }

    if (password.length < 6) {
      return next(
        new ErrorHandler("Password must be at least 6 characters long", 400)
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const verificationCode = await user.generateVerificationCode();
    await user.save({ validateBeforeSave: false });
    sendVerificationCode(verificationCode, email, res);
  } catch (error) {
    next(error);
  }
});

export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("email or otp missing", 400));
  }

  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries.length) {
      return next(new ErrorHandler("User not found", 404));
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    if (user.verificationCode !== Number(otp)) {
      return next(new ErrorHandler("Invalid OTP", 400));
    }
    const currentTime = Date.now();

    const verificationCodeExpires = new Date(
      user.verificationCodeExpires
    ).getTime();

    if (currentTime > verificationCodeExpires) {
      return next(new ErrorHandler("OTP expired", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save({ validateBeforeSave: true });

    sendToken(user, 200, "Account Verified!", res);
  } catch (error) {
    return next(new ErrorHandler("Internal server error.", 500));
  }
});

export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  sendToken(user, 200, "user Login successful", res);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncError(async (req, res, next) => {
  
  if(!req.body.email){
    return next(new ErrorHandler("Email is requires !",400));
  }
  
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return next(new ErrorHandler("Invalid email.", 400));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "bookworm email for password recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully`,
    })
  } catch (error) {
    user.getResetPasswordToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false});
    return next(new ErrorHandler(error.message,500));
  }
});

export const resetPassword = catchAsyncError(async (req, res, next) => {
  const {token} = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Invalid token or expired token", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password and confirm password do not match.", 400));
  }
  if (req.body.password.length < 6 || req.body.confirmPassword.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters long", 400));
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  sendToken(user, 200, "Password reset successful", res);
});

export const updatepassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  
  const { currentPassword,newPassword,confirmNewPassword } = req.body;
  if(!currentPassword || !newPassword || !confirmNewPassword){
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Password is incorrect", 400));
  }
  if (newPassword.length < 6 || confirmNewPassword.length < 6) {
    return next(new ErrorHandler("Password must be at least 6 characters long", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("Password and confirm password do not match.", 400));
  }

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
}
);
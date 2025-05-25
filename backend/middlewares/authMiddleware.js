
import jwt from "jsonwebtoken";
import catchAsyncError from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddlewares.js";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const {token} = req.cookies;

  if (!token) {
    return next(new ErrorHandler("User is not Authinticated.", 400));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await User.findById(decoded.id);
  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `(${req.user.role}) is not authorized to access this route`,
          403
        )
      );
    }
    next();
  };
}
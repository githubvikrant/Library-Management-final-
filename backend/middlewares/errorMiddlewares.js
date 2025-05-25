class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddlewares = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    const statusCode = 400;
    const message = "Duplicate Field Value Enter";
    err = new ErrorHandler(message, statusCode);
  }

  if (err.name === "jsonWebTockenError") {
    const statusCode = 401;
    const message = "Json Web Token is invalid, try again!!!";
    err = new ErrorHandler( message,statusCode);
  }

  if (err.name === "TokenExpiredError") {
    const statusCode = 401;
    const message = "Json Web Token is expired, try again!!!";
    err = new ErrorHandler(message,statusCode);
  }

  if (err.name === "CastError") {
    const statusCode = 400;
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message,statusCode);
  }

  const errorMesaage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMesaage,
  });
};

export default ErrorHandler;

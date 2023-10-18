const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);
const handleJWTExpiredError = () =>
  new AppError("Expired token. Please log in again.", 401);

const sendErrorDev = (err, req, res) => {
  // -- API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  // -- RENDERED WEBSITE
  console.error("💥 ERROR 💥", err);
  return res.status(err.statusCode).render("errorTemplate", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendErrorProd = (err, req, res) => {
  // -- API
  if (req.originalUrl.startsWith("/api")) {
    // A) Operational errors: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or unknown errors: don't leak error details
    console.error("💥 ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }

  // -- RENDERED WEBSITE
  // A) Operational errors: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).render("errorTemplate", {
      title: "Something went wrong!",
      msg: err.message,
    });
  }
  // B) Programming or unknown errors: don't leak error details
  console.error("💥 ERROR 💥", err);
  return res.status(500).render("errorTemplate", {
    title: "Something went wrong!",
    msg: "Please try again later.",
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err, name: err.name };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError");
    error = handleJWTError();
    if (error.name === "TokenExpiredError");
    error = handleJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};

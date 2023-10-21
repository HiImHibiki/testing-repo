const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  console.log(err);

  // 404 Not found
  if (err.name === "CastError") {
    const message = "Data not found";
    error = new ErrorResponse(message, 404);
  }

  // Duplicate data
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Unauthorized
  if (err.name === "JsonWebTokenError") {
    const message = "Unauthorized";
    error = new ErrorResponse(message, 401);
  }

  if (!res.headerSent) {
    res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      error: error.message || "Server Error",
    });
  }
};

module.exports = errorHandler;

const jwt = require("jsonwebtoken");
const asyncFunc = require("./async");
const User = require("../models").User;
const ErrorResponse = require("../utils/ErrorResponse");

exports.protect = asyncFunc(async (req, res, next) => {
  let token;

  // Set token from bearer token in header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Authorization: "Bearer saledfhklah213c12cgiu21gcui"
    // [0] = Bearer
    // [1] = saledfhklah213c12cgiu21gcui
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  // Verify Token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return next(new ErrorResponse("Unauthorized", 401));
  }

  // Get user id from the decoded token
  req.user = await User.findByPk(decoded.id);
  if (!req.user) {
    return next(new ErrorResponse("Unauthorized", 401));
  }
  next();
});

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;

// user req -> endpoint -> route -> middleware -> controller
// middleware -> auth
// middleware -> error
// middleware -> async

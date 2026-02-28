const errorResponse = require("../utils/errorResponse");

const notFound = (req, res, next) => {
  const message = "Page not found";
  const error = new errorResponse(message, 415);
  res
    .status(error.statusCode || 404)
    .json({ success: false, error: error.message });
};
module.exports = notFound;

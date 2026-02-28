const jwt = require("jsonwebtoken");
const errorResponse = require("../utils/errorResponse");
const verifyToken = (req, res, next) => {
  let token;
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  } else {
    return next(
      new errorResponse("No token provided, authorization denied", 401)
    );
  }
  if (!token) {
    return next(
      new errorResponse("No token provided, authorization denied", 401)
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    console.log("Decoded JWT", decoded);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new errorResponse("Token expired", 401));
    } else {
      return next(new errorResponse("Invalid token", 403));
    }
  }
};
module.exports = verifyToken;

const User = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");
exports.sendToken = (user, statusCode, res) => {
  const token = user.getSignedToken(res);
  res.status(statusCode).json({
    success: true,
    token,
    user,
  });
};

// REGISTER USER
exports.registerUser = async (req, res, next) => {
  console.log("body", req.body);

  try {
    const { name, email, password, phoneNumber } = req.body;

    if (!name || !email || !password || !phoneNumber) {
      return next(new errorResponse("All fields are required", 400));
    }
    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return next(new errorResponse("Email already exist", 409));
    }
    const user = await User.create({ name, email, password, phoneNumber });
    this.sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// LOGIN USER
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new errorResponse("Please provide email and password", 400));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(new errorResponse("Enter registered email id", 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new errorResponse("Enter valid credentials", 401));
    }
    user.password = undefined;
    this.sendToken(user, 201, res);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// LOGOUT USER
exports.logoutUser = async (req, res) => {
  res.clearCookie("refreshToken");
  return res.status(201).json({ success: true, message: "Logout successful" });
};

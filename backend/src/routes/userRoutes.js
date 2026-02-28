const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/authMiddleware");

userRouter.get("/users", verifyToken, userController.getAllUsers);
module.exports = userRouter;

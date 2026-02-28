const express = require("express");
const messageRouter = express.Router();
const messageController = require("../controllers/messageController");
const verifyToken = require("../middleware/authMiddleware");

messageRouter.post("/", verifyToken, messageController.sendMessage);
messageRouter.get("/:chatId", verifyToken, messageController.allMessages);

module.exports = messageRouter;

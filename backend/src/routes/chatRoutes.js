const express = require("express");
const chatRouter = express.Router();
const chatController = require("../controllers/chatsController");
const verifyToken = require("../middleware/authMiddleware");

chatRouter.post("/", verifyToken, chatController.accessChat);
chatRouter.get("/", verifyToken, chatController.fetchAllChats);
chatRouter.post("/create-group", verifyToken, chatController.createGroup);
chatRouter.put("/rename-group", verifyToken, chatController.renameGroup);
chatRouter.delete("/delete-group", verifyToken, chatController.deleteGroup);
chatRouter.put("/add-user", verifyToken, chatController.addUserToGroup);
chatRouter.put("/remove-user", verifyToken, chatController.removeUserFromGroup);
chatRouter.put("/add-admin", verifyToken, chatController.addGroupAdmin);
module.exports = chatRouter;

const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const errorResponse = require("../utils/errorResponse");

exports.sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return next(new errorResponse("Invalid request", 400));
  }
  const newMessage = {
    sender: req.user.id,
    content,
    chat: chatId,
  };
  try {
    var message = await Message.create(newMessage);
    const populatedMessage = await Message.findById(message._id)
      .populate("sender")
      .populate({
        path: "chat",
        populate: {
          path: "users groupAdmin",
          select: "name displayPicture email phoneNumber",
        },
      })
      .lean();

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    return res.status(200).json({ success: true, populatedMessage });
  } catch (error) {
    const errMess = error.message;
    return next(new errorResponse(errMess, 500));
  }
};
exports.allMessages = async (req, res, next) => {
  console.log(req.params);
  const id = req.params.chatId;
  try {
    if (!id) {
      return next(new errorResponse("Invalid request", 401));
    }
    const allMessages = await Message.find({ chat: req.params.chatId })
      .populate("sender")
      .populate("chat");

    return res.status(201).json({ success: true, allMessages });
  } catch (error) {
    return next(new errorResponse(error.message, 500));
  }
};

const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const errorResponse = require("../utils/errorResponse");

// Create or Access Chat with a particular user
exports.accessChat = async (req, res, next) => {
  const userId = req.body.userId;

  if (!userId) {
    return next(new errorResponse("No users provided", 400));
  }

  try {
    let chat = await Chat.findOne({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user.id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");

    if (chat) {
      chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name email phoneNumber displayPicture _id",
      });

      return res.status(200).json({ success: true, chat });
    }

    // Create chat if not exists
    const createChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [req.user.id, userId],
    });

    let fullChat = await Chat.findById(createChat._id).populate(
      "users",
      "-password"
    );

    return res.status(201).json({ success: true, chat: fullChat });
  } catch (err) {
    return next(new errorResponse(err.message, 400));
  }
};

// Get all chats of the logged in user
exports.fetchAllChats = async (req, res, next) => {
  try {
    var allChats = await Chat.find({
      users: { $elemMatch: { $eq: req.user.id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ createdAt: -1 });

    allChats = await User.populate(allChats, {
      path: "latestMessage.sender",
      select: "name email phoneNumber displayPicture",
    });
    return res.status(200).json({ success: true, allChats });
  } catch (error) {
    const errMess = error.message;
    return next(new errorResponse(errMess, 501));
  }
};

// Create Group
exports.createGroup = async (req, res, next) => {
  console.log("body", req.body);

  if (!req.body.users || !req.body.name) {
    return next(new errorResponse("Both fields are required", 400));
  }
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return next(new errorResponse("More than 2 users are required", 400));
  }
  users.push(req.user.id);
  console.log("group users", users);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      isGroupChat: true,
      users: users,
      groupAdmin: req.user.id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(201).json({ success: true, fullGroupChat });
  } catch (error) {
    const errMess = error.message;
    return next(new errorResponse(errMess, 501));
  }
};

// Rename Group
exports.renameGroup = async (req, res, next) => {
  const chatId = req.body.chatId;
  const chatName = req.body.chatName;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedChat) {
      return next(new errorResponse("Enter valid id", 400));
    } else {
      return res.status(201).json({ success: true, updatedChat });
    }
  } catch (error) {
    return next(new errorResponse(error.message, 501));
  }
};

// Delete Group
exports.deleteGroup = async (req, res, next) => {
  const groupId = req.body.groupId;
  try {
    const deletedGroup = await Chat.findByIdAndDelete(groupId);
    if (!deletedGroup) {
      return next(new errorResponse("Group not found", 400));
    } else {
      return res.status(201).json({ success: true, deletedGroup });
    }
  } catch (error) {
    return next(new errorResponse(error.message, 501));
  }
};

// Add user to group
exports.addUserToGroup = async (req, res, next) => {
  const chatId = req.body.chatId;
  const userId = req.body.userId;

  try {
    const isAdded = await Chat.find({
      _id: chatId,
      users: userId,
    });
    if (isAdded.length > 0) {
      return next(new errorResponse("User already added", 401));
    }
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!updatedGroup) {
      return next(new errorResponse("Group not found", 400));
    } else {
      return res.status(201).json({
        success: true,
        updatedGroup,
      });
    }
  } catch (error) {
    return next(new errorResponse(error.message, 500));
  }
};

// Remove user from group
exports.removeUserFromGroup = async (req, res, next) => {
  const chatId = req.body.chatId;
  const userId = req.body.userId;
  try {
    const isNotInGroup = await Chat.find({ _id: chatId, users: userId });
    if (isNotInGroup.length <= 0) {
      return next(new errorResponse("User is not in group", 400));
    }
    const removeUser = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!removeUser) {
      return next(new errorResponse("Group not found", 400));
    } else {
      if (removeUser.users.length <= 0) {
        await Chat.findByIdAndDelete(removeUser._id);
        return res.status(201).json({
          success: true,
          message: "Deleted group after last member left the group",
        });
      } else {
        return res.status(201).json({
          success: true,
          removeUser,
        });
      }
    }
  } catch (error) {
    return next(new errorResponse(error.message, 500));
  }
};

// Add group admin
exports.addGroupAdmin = async (req, res, next) => {
  const chatId = req.body.chatId;
  const userId = req.body.userId;
  try {
    const isUserAdded = await Chat.findOne({ _id: chatId, users: userId });
    console.log(isUserAdded);
    if (!isUserAdded) {
      return next(
        new errorResponse("User should be in the group to make him admin", 400)
      );
    }
    const isAdmin = await Chat.findOne({ _id: chatId, groupAdmin: userId });
    console.log(isAdmin);
    if (isAdmin) {
      return next(new errorResponse("User is already admin", 400));
    }
    const updateGrp = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { groupAdmin: userId },
      },
      { new: true }
    );
    if (!updateGrp) {
      return next(new errorResponse("Group doesn't exist", 400));
    } else {
      return res.status(201).json({ success: true, updateGrp });
    }
  } catch (error) {
    return next(new errorResponse(error.message, 500));
  }
};

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/dbConnect");

// ROUTES PATH
const authRouter = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");
const notFound = require("./middleware/notFoundError");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const messageRouter = require("./routes/messageRoutes");
// DOTENV
dotenv.config();

// MONGODB CONNECTION
connectDB();

// REST OBJECT
const app = express();

// MIDDLEWARE
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API ROUTES
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use(notFound);
app.use(errorHandler);

// SERVER LISTENING
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT} `);
});

const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: { origin: process.env.FRONTEND_URL },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log("User ID", userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("Room joined", room);
  });

  socket.on("new message", (message) => {
    var chat = message.chat;
    if (!chat.users) return console.log("No users");
    chat.users.forEach((user) => {
      if (user._id == message.sender._id) return;
      socket.in(user._id).emit("new message recieved", message);
    });
  });

});

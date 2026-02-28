import { useContext, useEffect } from "react";
import { ChatContext } from "../context/ChatsContext";
import { FaRegUser } from "react-icons/fa";
import { getSender, getSenderFull } from "../utils/getSender";
import { AuthContext } from "../context/AuthContext";
import MyLoader from "./Loaders/Loader";

const AllChatsList = () => {
  const { user, authLoading } = useContext(AuthContext);
  const { chats, selectedChat, setSelectedChat } = useContext(ChatContext);

  if (authLoading || !user || !chats) {
    return <MyLoader />;
  }
  return (
    <div className="mt-3 flex flex-col gap-1 md:gap-3">
      {chats.map((chat) => {
        const sender = !chat.isGroupChat
          ? getSenderFull(user, chat.users)
          : null;

        return (
          <div
            key={chat._id}
            className={`flex items-center gap-3 md:gap-5 md:p-4 px-2 py-2 rounded-xl cursor-pointer transition-all duration-200  ${
              selectedChat?._id === chat._id
                ? " bg-thistle-300 hover:bg-thistle-400 text-white"
                : "bg-transparent"
            }`}
            onClick={() => setSelectedChat(chat)}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-thistle-200 to-thistle-600 flex items-center justify-center text-white font-semibold shadow-md">
                {chat.isGroupChat === false ? (
                  <img
                    src={sender?.displayPicture}
                    alt="dp"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <FaRegUser />
                )}
              </div>
              {/* {chat.unread > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-light-apricot-100 border border-light-apricot-900 rounded-full flex items-center justify-center text-xs text-light-apricot-950 font-bold">
                  {chat.unread}
                </div>
              )} */}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3
                  className={`font-semibold  truncate flex items-center gap-2${
                    selectedChat?._id === chat._id
                      ? " text-white"
                      : "text-gray-900"
                  }`}
                >
                  {!chat.isGroupChat
                    ? getSender(user, chat.users)
                    : chat.chatName}
                </h3>
              </div>
              <p
                className={`text-sm truncate ${
                  chat.unread > 0
                    ? "text-gray-900 font-medium"
                    : "text-gray-500"
                } ${
                  selectedChat?._id === chat._id
                    ? " text-white"
                    : "text-gray-900"
                }`}
              >
                {chat?.latestMessage?.content || "This is latest message"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AllChatsList;

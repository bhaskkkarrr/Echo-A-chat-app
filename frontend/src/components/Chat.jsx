import { useContext, useState } from "react";
import { ChatContext } from "../context/ChatsContext";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FiSend } from "react-icons/fi";
import { getSenderFull } from "../utils/getSender";
import { AuthContext } from "../context/AuthContext";
import ChatUserSidebar from "./Modals/ChatModal";
import { MessageContext } from "../context/MessageContext";
import AllMessages from "./AllMessages";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaUser } from "react-icons/fa";

const Chat = () => {
  const { selectedChat, setSelectedChat, setShowRightSideBar } =
    useContext(ChatContext);
  const { sendMessage, loading, messages, error } = useContext(MessageContext);
  const { user } = useContext(AuthContext);
  const [newMessage, setNewMessage] = useState("");
  const sender = getSenderFull(user, selectedChat.users);
  const handleSubmit = async () => {
    const res = await sendMessage(newMessage);
    if (res?.success) {
      setNewMessage("");
    }
  };
  const handleMessage = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="h-dvh flex flex-col">
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 md:px-5 py-3 bg-thistle-400 text-white ">
        <div className="flex items-center gap-3 cursor-pointer min-w-0">
          <div className="md:hidden" onClick={() => setSelectedChat(null)}>
            <IoMdArrowRoundBack />
          </div>
          {selectedChat.isGroupChat === false ? (
            <img
              src={sender?.displayPicture}
              alt="dp"
              className="w-10 h-10 md:w-11 md:h-11 rounded-full object-cover shrink-0"
            />
          ) : (
            <FaUser size={35} className="border p-1 rounded-full" />
          )}
          <div className="truncate">
            <h2
              className="font-semibold md:font-bold text-base md:text-lg cursor-pointer text-dark-wine-900 truncate"
              onClick={() => setShowRightSideBar(true)}
            >
              {selectedChat.isGroupChat ? selectedChat.chatName : sender?.name}
            </h2>
            {/* <p className="text-xs text-white/90">Online</p> */}
          </div>
        </div>

        <button className="hover:bg-white/40 p-2 rounded-full">
          <BsThreeDotsVertical size={20} />
        </button>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 min-h-0">
        <AllMessages key={selectedChat?._id} messages={messages} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="flex items-center  gap-2 px-2 md:px-4 py-3 bg-thistle-100 "
      >
        <div class="flex items-center md:h-12 h-11 w-full  text-sm text-gray-500 bg-white border border-thistle-300 shadow-xl rounded-xl">
          <button type="button" class="h-full px-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleMessage}
            className="flex-1 rounded-full outline-none bg-white text-sm md:text-base"
          />
          <button type="submit" className="h-full text-thistle-700 w-12">
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.375 22.5v-18l21.375 9zm2.25-3.375L18.956 13.5 5.625 7.875v3.938l6.75 1.687-6.75 1.688zm0 0V7.875z"
                fill="currentColor"
                fill-opacity=".7"
              />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;

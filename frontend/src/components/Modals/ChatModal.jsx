import { useContext, useMemo, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { AuthContext } from "../../context/AuthContext";
import { getSenderFull } from "../../utils/getSender";
import { ChatContext } from "../../context/ChatsContext";

const ChatUserSidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const { selectedChat } = useContext(ChatContext);
  console.log("selected userrrr", selectedChat);
  if (!isOpen) return null;

  const isGroupChat = selectedChat?.isGroupChat;

  const sender = useMemo(() => {
    if (!selectedChat?.users || !user) return null;
    return getSenderFull(user, selectedChat.users);
  }, [user, selectedChat]);

  const chatTitle = isGroupChat ? selectedChat?.chatName : sender?.name;

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div className="w-full h-full bg-light-apricot-600 shadow-xl p-6 transform transition-transform duration-300 translate-x-0">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-black"
      >
        <IoClose size={26} />
      </button>

      {/* Content */}
      <div className="flex flex-col items-center gap-3 mt-6">
        {/* Avatar */}
        {isGroupChat ? (
          <FaUser
            size={90}
            className="text-white bg-dark-coffee-900 p-4 rounded-full"
          />
        ) : (
          <img
            src={sender?.displayPicture}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}

        {/* Title */}
        <h2 className="text-3xl text-light-apricot-900 font-bold">
          {chatTitle}
        </h2>

        {/* Users label */}
        {isGroupChat && (
          <h2 className="text-xl text-white font-bold mt-3">Users:</h2>
        )}

        {/* Users list / Email */}
        <div className="flex gap-3 flex-wrap justify-center text-lg text-white font-semibold mt-2">
          {isGroupChat ? (
            selectedChat?.users?.map((u) => {
              const isAdmin = selectedChat?.groupAdmin?.some(
                (admin) => admin?._id === u?._id
              );

              return (
                <div
                  key={u?._id}
                  className="bg-light-apricot-100 rounded-2xl px-2 py-1 text-lg text-light-apricot-950 relative"
                >
                  {isAdmin && (
                    <div className="absolute -top-4 -right-1">
                      <RiAdminFill
                        size={28}
                        className="bg-light-apricot-50 rounded-full p-1.5"
                      />
                    </div>
                  )}
                  {u?.name}
                </div>
              );
            })
          ) : (
            <span className="underline">{sender?.email}</span>
          )}
        </div>

        {/* Phone number */}
        {!isGroupChat && (
          <div className="text-lg font-semibold text-white underline mt-2">
            {sender?.phoneNumber}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUserSidebar;

import { useContext, useMemo, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatsContext";
import { getSenderFull } from "../../utils/getSender";

const ChatDetailsModal = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const { selectedChat } = useContext(ChatContext);

  const isGroupChat = selectedChat?.isGroupChat;

  const sender = useMemo(() => {
    if (!selectedChat?.users || !user) return null;
    return getSenderFull(user, selectedChat.users);
  }, [user, selectedChat]);

  const chatTitle = isGroupChat ? selectedChat?.chatName : sender?.name;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // ✅ Now safe to return conditionally
  if (!isOpen || !selectedChat) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex md:justify-end justify-center items-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="
          w-full md:w-105 h-full md:h-full 
          bg-thistle-400
          shadow-2xl
          p-6
          relative
          transform transition-all duration-300
          md:rounded-none rounded-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-black transition"
        >
          <IoClose size={26} />
        </button>

        {/* Header Section */}
        <div className="flex flex-col items-center gap-4 mt-6">
          {/* Avatar */}
          {isGroupChat ? (
            <FaUser
              size={100}
              className="text-white bg-dark-coffee-900 p-6 rounded-full"
            />
          ) : sender?.displayPicture ? (
            <img
              src={sender.displayPicture}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover shadow-lg"
            />
          ) : (
            <FaUser
              size={100}
              className="text-white bg-dark-coffee-900 p-6 rounded-full"
            />
          )}

          {/* Name */}
          <h2 className="text-3xl font-bold text-light-apricot-900 text-center">
            {chatTitle}
          </h2>

          {/* Single User Details */}
          {!isGroupChat && (
            <div className="text-center space-y-2 mt-2">
              <p className="text-white underline">{sender?.email}</p>
              <p className="text-white underline">{sender?.phoneNumber}</p>
            </div>
          )}
        </div>

        {/* Group Members */}
        {isGroupChat && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-white mb-4 text-center">
              Members
            </h3>

            <div className="flex flex-wrap gap-3 justify-center">
              {selectedChat?.users?.map((u) => {
                const isAdmin = selectedChat?.groupAdmin?.some(
                  (admin) => admin?._id === u?._id,
                );

                return (
                  <div
                    key={u?._id}
                    className="
                      bg-light-apricot-100 
                      px-3 py-2 
                      rounded-xl 
                      text-light-apricot-950 
                      font-semibold 
                      relative
                      shadow-md
                    "
                  >
                    {isAdmin && (
                      <RiAdminFill
                        size={20}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1"
                      />
                    )}
                    {u?.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatDetailsModal;

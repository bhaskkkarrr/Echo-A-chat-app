import { useContext, useState } from "react";
import LeftSideBar from "../components/LeftSideBar";
import RightChatArea from "../components/RightChatArea";
import { ChatContext } from "../context/ChatsContext";
import ChatDetailsModal from "../components/Modals/ChatDetailsModal";
import UserDetailsModal from "../components/Modals/UserDetailsModal";

const ChatPage = () => {
  const {
    selectedChat,
    showRightSideBar,
    setShowRightSideBar,
    showUserModal,
    setShowUserModal,
  } = useContext(ChatContext);
  return (
    <div className="flex ">
      <div
        className={`${selectedChat ? "hidden md:block md:w-1/3 " : "w-full md:w-1/3"} `}
      >
        <LeftSideBar />
      </div>
      <div
        className={`${selectedChat ? "w-full md:w-2/3" : "hidden md:block md:w-2/3"}`}
      >
        <RightChatArea />
      </div>
      {showRightSideBar && (
        <div className=" transition-all">
          <ChatDetailsModal
            isOpen={showRightSideBar}
            onClose={() => setShowRightSideBar(false)}
          />
        </div>
      )}

      {showUserModal && (
        <div className=" transition-all">
          <UserDetailsModal
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;

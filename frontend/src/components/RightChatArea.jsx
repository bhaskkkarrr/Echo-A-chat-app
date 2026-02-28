import { useContext } from "react";
import { IoChatbubbles } from "react-icons/io5";
import { ChatContext } from "../context/ChatsContext";
import Chat from "./Chat";

const RightChatArea = () => {
  const { selectedChat } = useContext(ChatContext);
  return (
    <>
      {selectedChat ? (
        <>
          <Chat />
        </>
      ) : (
        <div className="bg-thistle-100 min-h-screen flex justify-center items-center text-2xl gap-3">
          <IoChatbubbles />
          Start a Chat
        </div>
      )}
    </>
  );
};

export default RightChatArea;

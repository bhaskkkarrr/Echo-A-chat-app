import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import axios from "axios";
import { ChatContext } from "./ChatsContext";
import getErrorMessage from "../utils/getErrorMessage";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useRef } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ENDPOINT = import.meta.env.VITE_API_BASE_URL;
var selectedChatCompare;
export const MessageContext = createContext();
export const MessageProvider = ({ children }) => {
  const { token, user } = useContext(AuthContext);
  const { selectedChat } = useContext(ChatContext);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [notification, setNotification] = useState([]);
  const socketRef = useRef();
  useEffect(() => {
    if (!user) return;
    socketRef.current = io(ENDPOINT);
    socketRef.current.emit("setup", user);
    socketRef.current.on("connected", () => {
      setSocketConnected(true);
    });
  }, [user]);

  const sendMessage = async (message) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/message/`,
        { content: message, chatId: selectedChat._id },
        config,
      );
      socketRef.current.emit("new message", data.populatedMessage);
      setMessages([...messages, data.populatedMessage]);
      return { success: true };
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const fetchMessage = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(
        `${BASE_URL}/api/message/${selectedChat._id}`,
        config,
      );
      setMessages(data.allMessages);
      socketRef.current.emit("join chat", selectedChat._id);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessage();
      selectedChatCompare = selectedChat;
    }
  }, [selectedChat]);

  useEffect(() => {
    if (!socketRef.current) return;
    socketRef.current.on("new message recieved", (message) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== message.chat._id
      ) {
        if (!notification.includes(message)) {
          setNotification([message, ...notification]);
        }
      } else {
        setMessages([...messages, message]);
      }
    });
  });
  return (
    <MessageContext.Provider
      value={{
        sendMessage,
        loading,
        messages,
        error,
        notification,
        setNotification,
        
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

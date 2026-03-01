import { createContext, useContext, useEffect, useState } from "react";
import getErrorMessage from "../utils/getErrorMessage";
import axios from "axios";
import { AuthContext } from "./AuthContext";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const ChatContext = createContext();
export const ChatProvider = ({ children }) => {
  const [showRightSideBar, setShowRightSideBar] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  const { token } = useContext(AuthContext);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [error, setError] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [groupChatLoading, setGroupChatLoading] = useState(false);

  const handleSearch = async (val) => {
    try {
      setSearchLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(
        `${BASE_URL}/api/user/users?search=${val}`,
        config,
      );
      setSearchResult(data?.users || []);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setSearchLoading(false);
    }
  };

  const fetchAllChats = async () => {
    try {
      setLoading(true);
      setError("");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const { data } = await axios.get(`${BASE_URL}/api/chat/`, config);
      setChats((prev) => {
        // preserve reference if same chat exists
        if (!selectedChat) return data.allChats;

        const updated = data.allChats.map((chat) =>
          chat._id === selectedChat._id ? selectedChat : chat,
        );

        return updated;
      });
      console.log("Chats", data.allChats);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) fetchAllChats();
  }, [token]);

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.post(
        `${BASE_URL}/api/chat/`,
        { userId },
        config,
      );
      console.log("access", data);
      setChats((prev) => {
        if (prev.some((c) => c._id === data.chat._id)) return prev;
        return [data.chat, ...prev];
      });

      setSelectedChat(data.chat);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const createGroupChat = async (name, users) => {
    console.log("token", token);
    try {
      setGroupChatLoading(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const body = { name, users };
      const { data } = await axios.post(
        `${BASE_URL}/api/chat/create-group`,
        body,
        config,
      );
      setChats((prev) => {
        if (prev.some((c) => c._id === data.fullGroupChat._id)) return prev;
        return [data.fullGroupChat, ...prev];
      });
      return data;
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setGroupChatLoading(false);
    }
  };
  const removeUser = async (id) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/remove-user`,
        { chatId: selectedChat._id, userId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
    }
  };

  const makeAdmin = async (id) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/add-admin`,
        { chatId: selectedChat._id, userId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      console.log("DAta", data);
      return data;
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const renameGroup = async (name) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/rename-group`,
        { chatName: name, chatId: selectedChat._id },
        config,
      );
      return data;
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  const addToGroup = async (id) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/add-user`,
        { chatId: selectedChat._id, userId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };
  const removeAdmin = async (id) => {
    try {
      const { data } = await axios.put(
        `${BASE_URL}/api/chat/remove-admin`,
        { chatId: selectedChat._id, userId: id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return data;
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };
  return (
    <ChatContext.Provider
      value={{
        chats,
        loading,
        error,
        searchResult,
        searchLoading,
        groupChatLoading,
        selectedChat,
        showRightSideBar,
        showUserModal,
        removeUser,
        makeAdmin,
        addToGroup,
        removeAdmin,
        renameGroup,
        setShowUserModal,
        setShowRightSideBar,
        setSelectedChat,
        setGroupChatLoading,
        createGroupChat,
        setSearchLoading,
        setSearchResult,
        setChats,
        setLoading,
        setError,
        handleSearch,
        accessChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

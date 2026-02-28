import { useContext, useRef, useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { ChatContext } from "../../context/ChatsContext";
import SearchLoader from "../Loaders/SearchLoader";
import SearchedUsersList from "../SearchedUsersList";
import axios from "axios";
import getErrorMessage from "../../utils/getErrorMessage";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthContext";
import { warningToast } from "../WarningToast";
import { IoMdClose } from "react-icons/io";
import MyLoader from "../Loaders/Loader";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CreateGroup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  const { token } = useContext(AuthContext);
  const { createGroupChat, groupChatLoading, setGroupChatLoading } =
    useContext(ChatContext);
  const [name, setName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [localResults, setLocalResults] = useState([]);
  const [localLoading, setLocalLoading] = useState(false);

  const debounceRef = useRef(null);

  const handleSearchLocal = async (value) => {
    const query = value.trim();
    if (!query) {
      setLocalResults([]);
      return;
    }

    try {
      setLocalLoading(true);

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const { data } = await axios.get(
        `${BASE_URL}/api/user/users?search=${query}`,
        config,
      );

      setLocalResults(data?.users.slice(0, 4) || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLocalLoading(false);
    }
  };

  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);
  console.log("Selected Users ", selectedUsers);

  const handleGroupUsers = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      warningToast("User already added");
      return;
    }
    setSelectedUsers((prev) => {
      const updated = [...prev, user];
      return updated;
    });
  };
  const handleRemoveUser = (user) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
  };

  const handleCreateGroup = async (name, users) => {
    console.log("Users", users);
    if (!name) {
      toast.error("Name is required");
      return;
    }
    if (users.length < 2) {
      toast.error("Minimum 2 users are required");
      return;
    }
    const userIds = JSON.stringify(users.map((u) => u._id));
    const res = await createGroupChat(name, userIds);
    if (res.success) {
      setName("");
      setSelectedUsers([]);
      setSearch("");
      setLocalResults([]);
      toast.success("Group created");
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className="bg-thistle-500 w-[90%] max-w-md rounded-xl shadow-lg p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white hover:text-black"
        >
          <IoClose size={24} />
        </button>

        <div className="text-4xl text-white font-bold text-center pb-4">
          Create Group
        </div>

        <form
          className="flex flex-col gap-4 items-center"
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateGroup(name, selectedUsers);
            console.log("Group created", name, selectedUsers);
          }}
        >
          <input
            type="text"
            placeholder="Enter group name"
            className="bg-baby-pink-400 w-full rounded-xl text-white outline-none text-lg px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Search users..."
            className="bg-baby-pink-400 w-full rounded-xl text-white outline-none text-lg px-3 py-2"
            value={search}
            onChange={(e) => {
              const value = e.target.value;
              setSearch(value);
              clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                handleSearchLocal(value);
              }, 300);
            }}
          />

          {/* SelectedUsers */}
          {selectedUsers.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {selectedUsers.map((user, i) => {
                return (
                  <span
                    className="inline-flex items-center bg-thistle-600 border-2 text-white text-xs font-medium ps-1.5 pe-0.5 py-0.5 rounded-lg gap-1"
                    key={i}
                  >
                    <span className="font-bold">{user.name}</span>
                    <button
                      type="button"
                      className="inline-flex items-center p-0.5 text-sm bg-transparent rounded-lg hover:bg-success-medium cursor-pointer"
                      onClick={() => handleRemoveUser(user)}
                    >
                      <IoMdClose />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {/* All Users List */}
          <div className="w-full">
            {localLoading ? (
              <SearchLoader />
            ) : (
              <SearchedUsersList
                users={localResults}
                width={"full"}
                handleFunction={handleGroupUsers}
              />
            )}
          </div>

          <button
            type="submit"
            disabled={groupChatLoading}
            className="bg-thistle-700 w-full hover:bg-thistle-800 px-3 py-2 text-xl text-white rounded-xl disabled:opacity-60"
          >
            {groupChatLoading ? <MyLoader /> : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;

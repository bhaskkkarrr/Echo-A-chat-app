import { FiSearch } from "react-icons/fi";
import { useContext, useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa6";
import SearchLoader from "./Loaders/SearchLoader";
import { ChatContext } from "../context/ChatsContext";
import ErrorModal from "./Modals/ErrorModal";
import AllChatLoader from "./Loaders/AllChatLoader";
import AllChatsList from "./AllChatsList";
import SearchedUsersList from "./SearchedUsersList";
import { MessageContext } from "../context/MessageContext";
import { MdGroupAdd } from "react-icons/md";
import { AuthContext } from "../context/AuthContext";
import { FaUser } from "react-icons/fa6";
import CreateGroup from "./Modals/CreateGroup";
import ChatDetailsModal from "./Modals/ChatDetailsModal";
import UserDetailsModal from "./Modals/UserDetailsModal";
const LeftSideBar = () => {
  const {
    loading,
    error,
    searchResult,
    accessChat,
    searchLoading,
    setShowUserModal,
    setSearchResult,
    setLoading,
    setError,
    handleSearch,
  } = useContext(ChatContext);
  const { user } = useContext(AuthContext);
  const { notification, setNotification } = useContext(MessageContext);
  const [search, setSearch] = useState("");
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const debounceRef = useRef(null);
  const handleOnChangeSearch = async (value) => {
    const query = value.trim();
    if (!query) {
      setSearchResult([]);
      setLoading(false);
      return;
    }
    await handleSearch(query);
  };
  const handleOnClickSearch = async () => {
    const query = search.trim();
    if (!query) {
      return null;
    }
    await handleSearch(search);
  };
  useEffect(() => {
    return () => clearTimeout(debounceRef.current);
  }, []);
  const handleAccessChat = async (user) => {
    await accessChat(user._id);
    setSearchResult([]);
    setSearch("");
  };
  return (
    <div>
      <div className="h-screen overflow-y-auto bg-white border-r-2">
        <div className="relative px-2 py-3 ">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl px-5 font-bold">Echo</h1>
            <div className="flex items-center gap-3">
              {/* Notification */}
              <div className="flex">
                <span className="hover:bg-thistle-50 cursor-pointer text-thistle-600 rounded-full p-2">
                  <FaBell size={28} />
                  {/* {!notification.length && "No notifications"} */}
                </span>
              </div>

              {/* DP */}
              <div className="">
                {user?.displayPicture ? (
                  <button
                    type="button"
                    className="flex items-center text-body rounded-base text-white"
                    onClick={() => setShowUserModal(true)}
                  >
                    <img
                      src={user.displayPicture}
                      alt="User"
                      className="object-cover w-10 h-10 rounded-full hover:ring-2 hover:ring-white/40 transition"
                    />
                  </button>
                ) : (
                  <div className="flex items-center text-body rounded-base text-black">
                    <FaUser
                      size={35}
                      className="hover:bg-white/30 p-1 border rounded-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <form
              className="flex w-full md:px-2 md:py-1 items-center overflow-hidden rounded-full border border-gray-500/30 bg-white"
              onSubmit={(e) => {
                e.preventDefault();
                handleOnClickSearch();
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={search}
                className="h-full bg-transparent w-full pl-4 text-sm placeholder-dark-coffee-400 outline-none"
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);
                  clearTimeout(debounceRef.current);
                  if (!value.trim) {
                    setSearchResult([]);
                  }
                  debounceRef.current = setTimeout(
                    () => handleOnChangeSearch(value),
                    300,
                  );
                }}
              />
              <button
                type="submit"
                className="hidden md:block rounded-full p-2 bg-thistle-600  text-sm text-white transition active:scale-95"
              >
                <FiSearch size={20} />
              </button>
            </form>
            {/* Create Group */}
            <div
              className="flex items-center text-body rounded-base text-thistle-600 hover:bg-thistle-50 p-2 rounded-full"
              onClick={() => setShowAddGroupModal(!showAddGroupModal)}
            >
              <MdGroupAdd size={30} />
            </div>
          </div>

          {/* Searching */}
          <div className="absolute left-6 z-40">
            {searchLoading ? (
              <SearchLoader width="fit" count={10} />
            ) : (
              <SearchedUsersList
                users={searchResult}
                setSearch={setSearch}
                width={"fit"}
                handleFunction={handleAccessChat}
              />
            )}
          </div>
          {/* All Chats */}
          {loading ? <AllChatLoader /> : <AllChatsList />}

          {/* Error */}
          <ErrorModal
            isOpen={!!error}
            onClose={() => setError("")}
            error={error}
          />
          {showAddGroupModal && (
            <CreateGroup
              isOpen={showAddGroupModal}
              onClose={() => setShowAddGroupModal(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;

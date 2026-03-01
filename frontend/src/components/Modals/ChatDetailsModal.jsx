import { useContext, useMemo, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { FaUser, FaUsers } from "react-icons/fa";
import { RiAdminFill } from "react-icons/ri";
import {
  MdEmail,
  MdPhone,
  MdOutlineAdminPanelSettings,
  MdEdit,
  MdCheck,
  MdClose,
} from "react-icons/md";
import { HiUserRemove } from "react-icons/hi";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import { TbShieldOff } from "react-icons/tb";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatsContext";
import { getSenderFull } from "../../utils/getSender";
import axios from "axios";
import toast from "react-hot-toast";
import getErrorMessage from "../../utils/getErrorMessage";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ChatDetailsModal = ({ isOpen, onClose }) => {
  const { user, token } = useContext(AuthContext);
  const {
    selectedChat,
    setSelectedChat,
    setChats,
    removeUser,
    makeAdmin,
    removeAdmin,
    renameGroup,
    addToGroup,
  } = useContext(ChatContext);

  const navigate = useNavigate();

  // ── Loading states ──
  const [removingUser, setRemovingUser] = useState(null); // userId
  const [makingAdmin, setMakingAdmin] = useState(null); // userId
  const [removingAdmin, setRemovingAdmin] = useState(null); // userId
  const [leavingGroup, setLeavingGroup] = useState(false);

  // ── Rename ──
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameSaving, setRenameSaving] = useState(false);
  const renameInputRef = useRef(null);

  // ── Add user ──
  const [showAddUser, setShowAddUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [addingUser, setAddingUser] = useState(null); // userId
  const searchDebounceRef = useRef(null);

  const isGroupChat = selectedChat?.isGroupChat;
  const currentUserIsAdmin = selectedChat?.groupAdmin?.some(
    (admin) => admin?._id === user?._id,
  );

  const sender = useMemo(() => {
    if (!selectedChat?.users || !user) return null;
    return getSenderFull(user, selectedChat.users);
  }, [user, selectedChat]);

  const chatTitle = isGroupChat ? selectedChat?.chatName : sender?.name;

  // Focus rename input when editing starts
  useEffect(() => {
    if (isRenaming) {
      setRenameValue(selectedChat?.chatName || "");
      setTimeout(() => renameInputRef.current?.focus(), 50);
    }
  }, [isRenaming]);

  // Debounced user search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/api/user/users?search=${searchQuery}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // Filter out members already in the group
        const existingIds = new Set(selectedChat?.users?.map((u) => u._id));
        setSearchResults(data.users.filter((u) => !existingIds.has(u._id)));
      } catch (e) {
        console.log(e);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
    return () => clearTimeout(searchDebounceRef.current);
  }, [searchQuery]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen || !selectedChat) return null;

  // ── Rename group — available to ALL members ──
  const handleRename = async () => {
    const trimmed = renameValue.trim();
    if (!trimmed || trimmed === selectedChat.chatName) {
      setIsRenaming(false);
      return;
    }
    try {
      setRenameSaving(true);
      const res = await renameGroup(trimmed);
      if (res.success) {
        setSelectedChat(res.updatedChat);
        setChats((prev) =>
          prev.map((c) =>
            c._id === res.updatedChat._id ? res.updatedChat : c,
          ),
        );
        toast.success("Group renamed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRenameSaving(false);
      setIsRenaming(false);
    }
  };

  // ── Remove member — admin only ──
  const handleRemoveMember = async (memberId) => {
    try {
      setRemovingUser(memberId);
      const res = await removeUser(memberId);
      if (res.success) {
        setSelectedChat(res.removeUser);
        setChats((prev) =>
          prev.map((c) => (c._id === res.removeUser._id ? res.removeUser : c)),
        );
        toast.success("Member removed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRemovingUser(null);
    }
  };

  // ── Make admin — admin only ──
  const handleMakeAdmin = async (memberId) => {
    try {
      setMakingAdmin(memberId);
      const res = await makeAdmin(memberId);
      if (res.success) {
        setSelectedChat(res.updateGrp);
        setChats((prev) =>
          prev.map((c) => (c._id === res.updateGrp._id ? res.updateGrp : c)),
        );
        toast.success("Member is now an admin");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setMakingAdmin(null);
    }
  };

  // ── Remove admin — admin only ──
  const handleRemoveAdmin = async (memberId) => {
    try {
      setRemovingAdmin(memberId);
      const res = await removeAdmin(memberId);
      if (res.success) {
        setSelectedChat(res.updateGrp);
        setChats((prev) =>
          prev.map((c) => (c._id === res.updateGrp._id ? res.updateGrp : c)),
        );
        toast.success("Admin privileges removed");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRemovingAdmin(null);
    }
  };

  // ── Add user — available to ALL members ──
  const handleAddUser = async (newUser) => {
    try {
      setAddingUser(newUser._id);
      const res = await addToGroup(newUser._id);
      if (res.success) {
        setSelectedChat(res.updatedChat);
        setChats((prev) =>
          prev.map((c) =>
            c._id === res.updatedChat._id ? res.updatedChat : c,
          ),
        );
        setSearchResults((prev) => prev.filter((u) => u._id !== newUser._id));
        toast.success(`${newUser.name} added to group`);
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAddingUser(null);
    }
  };

  // ── Leave group — any member ──
  const handleLeaveGroup = async () => {
    try {
      setLeavingGroup(true);
      await removeUser(user._id);
      setSelectedChat(null);
      setChats((prev) => prev.filter((c) => c._id !== selectedChat._id));
      toast.success("You left the group");
      onClose();
      navigate("/chats");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLeavingGroup(false);
    }
  };

  const anyLoading =
    !!removingUser ||
    !!makingAdmin ||
    !!removingAdmin ||
    leavingGroup ||
    !!addingUser ||
    renameSaving;

  const Spinner = ({ color = "border-thistle-200" }) => (
    <span
      className={`w-3 h-3 border ${color} border-t-transparent rounded-full animate-spin inline-block`}
    />
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full md:w-80 lg:w-96 h-full bg-app-secondary flex flex-col  md:rounded-none overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-thistle-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* ── Header Bar ── */}
        <div className="flex items-center justify-between px-5 pt-5 relative z-10 shrink-0">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-thistle-50">
            {isGroupChat ? "Group Info" : "Contact Info"}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-thistle-50 border-2 border-thistle-600 flex items-center justify-center text-thistle-600 hover:text-thistle-800 hover:bg-thistle-200 transition-all duration-200"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* ── Hero Section ── */}
        <div className="flex flex-col items-center px-6 pt-8 pb-6 relative z-10 shrink-0">
          <div className="relative mb-5">
            <div className="absolute -inset-2 rounded-full bg-linear-to-br from-thistle-400 via-baby-pink-400 to-thistle-600 blur-md" />
            {isGroupChat ? (
              <div className="w-24 h-24 rounded-full bg-thistle-700 flex items-center justify-center relative z-10 border-2 border-thistle-50 text-baby-pink-400">
                <FaUsers size={38} />
              </div>
            ) : sender?.displayPicture ? (
              <img
                src={sender.displayPicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover relative z-10 border-2 border-thistle-50"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-thistle-700 flex items-center justify-center relative z-10 border-2 border-thistle-50 text-baby-pink-400">
                <FaUser size={34} />
              </div>
            )}
            {!isGroupChat && (
              <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-thistle-50 z-20" />
            )}
          </div>

          {/* Group name — editable by ANY member */}
          {isGroupChat && isRenaming ? (
            <div className="flex items-center  gap-2 w-full max-w-55 mb-2">
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename();
                  if (e.key === "Escape") setIsRenaming(false);
                }}
                className="flex-1 bg-thistle-700/40 border border-thistle-500 rounded-xl px-3 py-1.5 text-white text-sm font-semibold text-center outline-none focus:border-thistle-300 transition-colors"
                maxLength={50}
              />
              <button
                onClick={handleRename}
                disabled={renameSaving}
                className="w-7 h-7 rounded-lg bg-thistle-600/50 border border-thistle-500 flex items-center justify-center text-white hover:bg-thistle-500 transition-all disabled:opacity-50"
              >
                {renameSaving ? <Spinner /> : <MdCheck size={14} />}
              </button>
              <button
                onClick={() => setIsRenaming(false)}
                className="w-7 h-7 rounded-lg bg-thistle-700/40 border border-thistle-600 flex items-center justify-center text-thistle-300 hover:text-white transition-all"
              >
                <MdClose size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-xl font-extrabold text-thistle-700 tracking-tight text-center">
                {chatTitle}
              </h2>
              {/* Rename pencil — visible to ALL group members */}
              {isGroupChat && (
                <button
                  onClick={() => setIsRenaming(true)}
                  title="Rename group"
                  className="w-6 h-6 rounded-md bg-thistle-600/30 border border-thistle-500/40 flex items-center justify-center text-thistle-400 hover:text-white hover:bg-thistle-500/50 transition-all"
                >
                  <MdEdit size={12} />
                </button>
              )}
            </div>
          )}

          {isGroupChat ? (
            <span className="inline-flex items-center gap-1.5 bg-thistle-600/50 border border-thistle-700 text-white text-[11px] font-medium rounded-full px-3 py-1">
              <FaUsers size={10} />
              {selectedChat?.users?.length} Members
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-thistle-600/50 border border-thistle-700 text-white text-[11px] font-medium rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Online
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="mx-6 h-px bg-thistle-600/40 shrink-0" />

        {/* ── Single Chat: Contact Info ── */}
        {!isGroupChat && (
          <div className="flex flex-col gap-3 px-5 py-6 flex-1 relative z-10 overflow-y-auto">
            <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-thistle-700 pl-1 mb-1">
              Contact Info
            </p>
            <div className="flex items-center gap-3 bg-thistle-700/30 border border-thistle-700 rounded-2xl px-4 py-3.5 hover:bg-thistle-700/50 transition-colors duration-200 cursor-default">
              <div className="w-9 h-9 rounded-xl bg-thistle-600/30 flex items-center justify-center text-thistle-700 shrink-0">
                <MdEmail size={17} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] text-thistle-50/70 font-medium tracking-wider uppercase">
                  Email
                </span>
                <span className="text-sm text-white truncate">
                  {sender?.email}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-thistle-700/30 border border-thistle-700 rounded-2xl px-4 py-3.5 hover:bg-thistle-700/50 transition-colors duration-200 cursor-default">
              <div className="w-9 h-9 rounded-xl bg-thistle-600/30 flex items-center justify-center text-thistle-700 shrink-0">
                <MdPhone size={17} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-[10px] text-thistle-50/70 font-medium tracking-wider uppercase">
                  Phone
                </span>
                <span className="text-sm text-white truncate">
                  {sender?.phoneNumber}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Group Chat ── */}
        {isGroupChat && (
          <>
            {/* Add Member — available to ALL members */}
            <div className="px-5 py-2 shrink-0 relative z-10">
              <button
                onClick={() => {
                  setShowAddUser((v) => !v);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-thistle-600/30 border border-thistle-600 text-thistle-100 text-sm font-medium hover:bg-thistle-600/50 transition-all duration-200"
              >
                <FiUserPlus size={15} />
                {showAddUser ? "Close" : "Add Member"}
              </button>

              {showAddUser && (
                <div className="mt-3 mb-1">
                  <div className="relative">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name or email…"
                      className="w-full bg-thistle-700/40 border border-thistle-600 rounded-xl px-3 py-2.5 text-sm text-white placeholder-thistle-400 outline-none focus:border-thistle-400 transition-colors pr-8"
                    />
                    {searchLoading && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border border-thistle-300 border-t-transparent rounded-full animate-spin" />
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 flex flex-col gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {searchResults.map((u) => (
                        <div
                          key={u._id}
                          className="flex items-center gap-2.5 bg-thistle-700/30 border border-thistle-700 rounded-xl px-3 py-2"
                        >
                          <div className="w-7 h-7 rounded-full bg-thistle-600/50 border border-thistle-500 flex items-center justify-center text-thistle-100 shrink-0 overflow-hidden">
                            {u.displayPicture ? (
                              <img
                                src={u.displayPicture}
                                alt={u.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FaUser size={11} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white font-medium truncate">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-thistle-300/70 truncate">
                              {u.email}
                            </p>
                          </div>
                          <button
                            onClick={() => handleAddUser(u)}
                            disabled={addingUser === u._id}
                            className="w-7 h-7 rounded-lg bg-thistle-600/50 border border-thistle-500 flex items-center justify-center text-white hover:bg-thistle-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            {addingUser === u._id ? (
                              <Spinner />
                            ) : (
                              <FiUserPlus size={12} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchQuery.trim() &&
                    !searchLoading &&
                    searchResults.length === 0 && (
                      <p className="text-center text-thistle-400 text-xs mt-3">
                        No users found
                      </p>
                    )}
                </div>
              )}
            </div>

            {/* Members List */}
            <div className="flex flex-col px-5 py-4 flex-1 relative z-10 overflow-y-auto">
              <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-thistle-700 pl-1 mb-3">
                Members · {selectedChat?.users?.length}
              </p>

              <div className="flex flex-col gap-2">
                {selectedChat?.users?.map((u, i) => {
                  console.log(selectedChat);
                  const isMemberAdmin = selectedChat?.groupAdmin?.some(
                    (admin) => admin?._id === u?._id,
                  );
                  const isCurrentUser = u?._id === user?._id;
                  const isDoingRemove = removingUser === u._id;
                  const isDoingMkAdmin = makingAdmin === u._id;
                  const isDoingRmAdmin = removingAdmin === u._id;

                  return (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-thistle-700/30 border border-thistle-700 rounded-2xl px-3 py-3 hover:bg-thistle-700/50 transition-colors duration-200"
                    >
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-thistle-600/50 border border-thistle-500 flex items-center justify-center text-thistle-100 shrink-0 overflow-hidden">
                        {u?.displayPicture ? (
                          <img
                            src={u.displayPicture}
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FaUser size={14} />
                        )}
                      </div>

                      {/* Name + role */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-white font-medium truncate">
                            {u?.name}
                          </span>
                          {isCurrentUser && (
                            <span className="text-[9px] text-thistle-700 font-medium shrink-0">
                              (you)
                            </span>
                          )}
                        </div>
                        {isMemberAdmin && (
                          <span className="inline-flex items-center gap-0.5 text-[9px] text-thistle-700 font-semibold uppercase tracking-wider">
                            <RiAdminFill size={9} /> Admin
                          </span>
                        )}
                      </div>

                      {/* Action buttons */}
                      {!isCurrentUser && (
                        <div className="flex items-center gap-1 shrink-0">
                          {isMemberAdmin
                            ? /* Remove admin — admin only */
                              currentUserIsAdmin && (
                                <button
                                  onClick={() => handleRemoveAdmin(u._id)}
                                  disabled={anyLoading}
                                  title="Remove admin"
                                  className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 hover:bg-amber-500/25 hover:border-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  {isDoingRmAdmin ? (
                                    <Spinner color="border-amber-400" />
                                  ) : (
                                    <TbShieldOff size={14} />
                                  )}
                                </button>
                              )
                            : /* Make admin — admin only */
                              currentUserIsAdmin && (
                                <button
                                  onClick={() => handleMakeAdmin(u._id)}
                                  disabled={anyLoading}
                                  title="Make admin"
                                  className="w-7 h-7 rounded-lg bg-thistle-600/40 border border-thistle-500/50 flex items-center justify-center text-thistle-200 hover:bg-thistle-500/60 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  {isDoingMkAdmin ? (
                                    <Spinner />
                                  ) : (
                                    <MdOutlineAdminPanelSettings size={14} />
                                  )}
                                </button>
                              )}

                          {/* Remove member — admin only */}
                          {currentUserIsAdmin && (
                            <button
                              onClick={() => handleRemoveMember(u._id)}
                              disabled={anyLoading}
                              title="Remove from group"
                              className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 hover:bg-red-500/25 hover:border-red-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              {isDoingRemove ? (
                                <Spinner color="border-red-400" />
                              ) : (
                                <HiUserRemove size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Leave Group footer */}
            <div className="px-5 pb-6 pt-2 relative z-10 shrink-0">
              <div className="mb-4 h-px bg-thistle-600/40" />
              <button
                onClick={handleLeaveGroup}
                disabled={anyLoading}
                className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-red-500/8 border border-red-500 text-red-500 text-sm font-medium hover:bg-red-500/18 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {leavingGroup ? (
                  <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiLogOut size={15} />
                )}
                Leave Group
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatDetailsModal;

import { useContext, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { MdEmail, MdPhone } from "react-icons/md";
import toast from "react-hot-toast";
import getErrorMessage from "../../utils/getErrorMessage";

const UserDetailsModal = ({ isOpen, onClose }) => {
  const { user, logoutUser } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (!isOpen || !user) return null;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center md:items-stretch md:justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full md:w-80 lg:w-96 h-[88vh] md:h-full bg-app-secondary flex flex-col rounded-t-3xl md:rounded-none overflow-hidden relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-thistle-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 pt-5 relative z-10">
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-thistle-50">
            Profile
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-thistle-50 border-2 border-thistle-600 flex items-center justify-center text-thistle-600 hover:text-thistle-800 hover:bg-thistle-200  transition-all duration-200"
          >
            <IoClose size={20} />
          </button>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center px-6 pt-8 pb-7 relative z-10">
          {/* Avatar with gradient ring */}
          <div className="relative mb-5">
            <div className="absolute -inset-2 rounded-full bg-linear-to-br from-thistle-400 via-baby-pink-400 to-thistle-600 blur-md" />
            {/* <div className="absolute -inset-0.75 rounded-full bg-linear-to-br from-thistle-700 via-baby-pink-700 to-baby-pink-300" /> */}
            {user?.displayPicture ? (
              <img
                src={user.displayPicture}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover relative z-10 border-2 border-thistle-50"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-thistle-700 flex items-center justify-center relative z-10 border-2 border-thistle-50 text-baby-pink-400">
                <FaUser size={34} />
              </div>
            )}
            {/* Online dot */}
            <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-thistle-50 z-20" />
          </div>

          {/* Name */}
          <h2 className="text-xl font-extrabold text-thistle-700 tracking-tight text-center mb-2">
            {user.name}
          </h2>

          {/* Online badge */}
          <span className="inline-flex items-center gap-1.5 bg-thistle-600/50 border border-thistle-700 text-white text-[11px] font-medium rounded-full px-3 py-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Online
          </span>
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-3 px-5 py-6 flex-1 relative z-10">
          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-thistle-700 pl-1 mb-1">
            Contact Info
          </p>

          {/* Email Card */}
          <div className="flex items-center gap-3 bg-thistle-700/30 border border-thistle-700 rounded-2xl px-4 py-3.5 hover:bg-thistle-700/50 transition-colors duration-200 cursor-default">
            <div className="w-9 h-9 rounded-xl bg-thistle-600/30 flex items-center justify-center text-thistle-700 shrink-0">
              <MdEmail size={17} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] text-thistle-50/70 font-medium tracking-wider uppercase">
                Email
              </span>
              <span className="text-sm text-white truncate">
                {user.email}
              </span>
            </div>
          </div>

          {/* Phone Card */}
          <div className="flex items-center gap-3 bg-thistle-700/30 border border-thistle-700 rounded-2xl px-4 py-3.5 hover:bg-thistle-700/50 transition-colors duration-200 cursor-default">
            <div className="w-9 h-9 rounded-xl bg-thistle-600/30 flex items-center justify-center text-thistle-700 shrink-0">
              <MdPhone size={17} />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[10px] text-thistle-50/70 font-medium tracking-wider uppercase">
                Phone
              </span>
              <span className="text-sm text-white truncate">
                {user.phoneNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Footer — Logout */}
        <div className="px-5 pb-8 relative z-10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-2xl bg-red-500/8 border border-red-500 text-red-500 text-sm font-medium hover:bg-red-500/20 hover:border-red-500 active:scale-[0.98] transition-all duration-200"
          >
            <FiLogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

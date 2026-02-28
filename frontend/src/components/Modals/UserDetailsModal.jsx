import { useContext, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { FiLogOut } from "react-icons/fi";
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

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

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
          {user?.displayPicture ? (
            <img
              src={user.displayPicture}
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
            {user.name}
          </h2>
          <div className="text-center space-y-2 mt-2">
            <p className="text-white underline">{user?.email}</p>
            <p className="text-white underline">{user?.phoneNumber}</p>
          </div>
        </div>
        <div
          className="flex justify-center items-center "
          onClick={handleLogout}
        >
          <FiLogOut size={40} className="bg-white rounded-full p-2" />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;

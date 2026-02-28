import { IoChatboxEllipses } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { MdGroupAdd } from "react-icons/md";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CgLogOut } from "react-icons/cg";
import UserModal from "./Modals/UserModal";
import CreateGroup from "./Modals/CreateGroup";
const SideBar = () => {
  const { logoutUser, user } = useContext(AuthContext);
  const [showAddGroupModal, setShowAddGroupModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res?.success) {
        toast.success("Logout success");
        navigate("/");
      }
    } catch (error) {
      toast.error("Logout failed");
    }
  };
  return (
    <div className="relative">
      <aside className="hidden md:flex flex-col min-h-screen justify-between h-full  bg-light-apricot-800 items-center">
        <div className="h-full  py-2 overflow-y-auto">
          <ul className="space-y-1 font-medium">
            <li>
              <div className="flex items-center text-body rounded-base text-white hover:bg-white/30 p-2 rounded-full">
                <IoChatboxEllipses size={35} />
              </div>
            </li>
            <li>
              <div
                className="flex items-center text-body rounded-base text-white hover:bg-white/30 p-2 rounded-full"
                onClick={() => setShowAddGroupModal(!showAddGroupModal)}
              >
                <MdGroupAdd size={35} />
              </div>
            </li>
          </ul>
        </div>
        <div className="py-3">
          <ul className="space-y-1 font-medium">
            <li>
              {user?.displayPicture ? (
                <button
                  type="button"
                  className="flex items-center text-body rounded-base text-white"
                  onClick={() => setShowUserModal(true)}
                >
                  <img
                    src={user.displayPicture}
                    alt="User"
                    className="object-cover w-12 h-12 rounded-full hover:ring-2 hover:ring-white/40 transition"
                  />
                </button>
              ) : (
                <div className="flex items-center text-body rounded-base text-white">
                  <FaUser
                    size={50}
                    className="hover:bg-white/30 p-2 rounded-full"
                  />
                </div>
              )}
            </li>

            <li>
              <div
                className="flex items-center text-body rounded-base text-white hover:bg-white/30 p-2 rounded-full cursor-pointer"
                onClick={handleLogout}
              >
                <CgLogOut size={35} />
              </div>
            </li>
          </ul>
        </div>
      </aside>
      {showUserModal && (
        <div className="absolute bottom-3 0 left-20 z-50">
          <UserModal
            isOpen={showUserModal}
            onClose={() => setShowUserModal(false)}
            user={user}
          />
        </div>
      )}
      {showAddGroupModal && (
        <div className="">
          <CreateGroup
            isOpen={showAddGroupModal}
            onClose={() => setShowAddGroupModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default SideBar;

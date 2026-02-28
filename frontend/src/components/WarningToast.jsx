import toast from "react-hot-toast";
import { FaExclamationTriangle } from "react-icons/fa";

export const warningToast = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } bg-yellow-100 text-yellow-800 px-4 py-2 flex justify-center items-center gap-3 rounded-lg shadow-md border border-yellow-300`}
    >
      <FaExclamationTriangle /> {message}
    </div>
  ));
};

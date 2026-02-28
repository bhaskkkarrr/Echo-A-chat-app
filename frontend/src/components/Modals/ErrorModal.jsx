import React from "react";
import { IoClose } from "react-icons/io5";
import { CiCircleAlert } from "react-icons/ci";

const ErrorModal = ({ error, isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-linear-to-r from-red-500 to-rose-600 p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-all duration-200"
            aria-label="Close modal"
          >
            <IoClose size={20} />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <CiCircleAlert className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white">Error</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 text-base leading-relaxed">{error}</p>

          {/* Action button */}
          <button
            onClick={onClose}
            className="mt-6 w-full bg-linear-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;

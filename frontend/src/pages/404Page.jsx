import React from "react";
import { useNavigate } from "react-router-dom";

const Page404 = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center text-sm max-md:px-4 min-h-screen bg-camel-600">
      <h1 className="text-8xl md:text-9xl font-bold text-white">404</h1>
      <div className="h-1 w-16 rounded bg-white md:my-7"></div>
      <p className="text-2xl md:text-3xl font-bold text-white">
        Page Not Found
      </p>
      <p className="text-sm md:text-base mt-4 text-white max-w-md text-center">
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="flex items-center gap-4 mt-6">
        <div
          onClick={() => navigate(-1)}
          className="bg-light-apricot-500 hover:bg-light-apricot-600 px-7 py-2.5 text-white border  rounded-md active:scale-95 transition-all"
        >
          Return Home
        </div>
        <a
          href="#"
          className="border border-gray-300 px-7 py-2.5 text-white rounded-md active:scale-95 transition-all"
        >
          Contact support
        </a>
      </div>
    </div>
  );
};

export default Page404;

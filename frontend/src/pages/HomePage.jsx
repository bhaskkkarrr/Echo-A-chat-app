import { useState } from "react";
import ImageComp from "../components/ImageComp";
import Login from "./Login";
import Register from "./Register";
import bg from "../assets/bg.jpg";

const HomePage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative flex flex-col"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-1 flex-col">
        {/* LOGO */}
        <div className="text-center text-baby-pink-400 py-6 text-5xl font-bold">
          <a href="/">Echo</a>
        </div>

        {/* CENTERED SECTION */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="flex w-full max-w-6xl flex-col md:flex-row items-center justify-center gap-6">
            {/* IMAGE (Hidden on small screens) */}
            <div className="hidden md:flex w-2/3 justify-center">
              <ImageComp />
            </div>

            {/* LOGIN / REGISTER */}
            <div className="w-full md:w-1/3 flex justify-center">
              {isLogin ? (
                <Login switchToSignUp={() => setIsLogin(false)} />
              ) : (
                <Register switchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { NavLink, useNavigate } from "react-router-dom";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import getErrorMessage from "../utils/getErrorMessage";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMail } from "react-icons/io5";
import MyLoader from "../components/Loaders/Loader";

const Login = ({ switchToSignUp }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const handlePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await loginUser(email, password);
      if (res?.success) {
        toast.success("Login successful!");
        navigate("/chats");
      }
    } catch (error) {
      toast.error("Login failed. Please try again.");
      const errMess = getErrorMessage(error);
      setError(errMess);
    } finally {
      setLoading(false);
    }
    setTimeout(() => {
      setError("");
    }, 5000);
  };
  return (
    <div className="flex ">
      <form
        className="bg-baby-pink-200 text-white max-w-85 w-full mx-4 md:p-6 p-4 md:py-8 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
        onSubmit={handleLogin}
      >
        <h2 className="text-2xl font-bold md:mb-9 mb-3 text-center text-white">
          Welcome Back
        </h2>
        {error && (
          <div className="bg-red-100 text-red-700 p-2 mb-4 border-2 border-red-700 rounded-xl">
            {error}
          </div>
        )}
        {/* EMAIL */}
        <div className="flex items-center my-2 bg-white text-thistle-600 rounded gap-1 pl-2">
          <IoMail size={22} />
          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center mt-2 mb-4  bg-white  text-thistle-600 rounded gap-1 pl-2">
          <RiLockPasswordFill size={22} />

          <input
            className="w-full outline-none bg-transparent py-2.5"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="px-3">
            {showPassword ? (
              <BiSolidHide
                size={16}
                className="text-thistle-600"
                onClick={handlePassword}
              />
            ) : (
              <BiSolidShow
                size={16}
                className="text-thistle-600"
                onClick={handlePassword}
              />
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mb-3 bg-thistle-600 hover:bg-thistle-700 transition py-2.5 rounded text-white font-medium"
        >
          {loading ? <MyLoader /> : "Log In"}
        </button>
        <p className="text-center">
          Don't have an account?{" "}
          <NavLink to={"/"} onClick={switchToSignUp}>
            <span className="text-thistle-600 font-bold">Signup</span>
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;

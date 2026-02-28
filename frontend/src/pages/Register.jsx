import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BiSolidHide, BiSolidShow } from "react-icons/bi";
import { AuthContext } from "../context/AuthContext";
import { FaPhone, FaUser } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { RiLockPasswordFill } from "react-icons/ri";

import getErrorMessage from "../utils/getErrorMessage";
import MyLoader from "../components/Loaders/Loader";
const Register = ({ switchToLogin }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errror, setError] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const handlePassword = () => setShowPassword(!showPassword);
  const [loading, setLoading] = useState(false);
  const { registerUser } = useContext(AuthContext);
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => {
      setError("");
    }, 5000);
  };
  const isValidNumber = (num) => {
    const phoneRegex = /^(\+91[\-\s]?)?[0-9]{10}$/;
    return phoneRegex.test(num);
  };
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !name || !email || !phoneNumber) {
      showError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      showError("Password doesn't match");
      return;
    }
    if (!isValidNumber(phoneNumber)) {
      showError("Enter a valid phone number");
      return;
    }
    if (!isValidEmail(email)) {
      showError("Enter a valid email");
      return;
    }
    try {
      setLoading(true);
      const res = await registerUser(email, name, password, phoneNumber);
      if (res === null) {
        toast.error("Registration Failed");
      }
      if (res?.success) {
        toast.success("Registration Successful");
        switchToLogin();
      }
    } catch (error) {
      const errMess = getErrorMessage(error);
      showError(errMess);
      toast.error("Registration Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex ">
      <form
        className="bg-baby-pink-200 text-white max-w-85 w-full mx-4 md:p-6 p-4 md:py-8 text-sm rounded-lg shadow-[0px_0px_10px_0px] flex flex-col gap-2 shadow-black/10"
        onSubmit={handleSubmit}
      >
        {errror && (
          <div className="bg-red-100 text-red-700 px-4 py-2 mb-4 rounded">
            {errror}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-3 text-center text-white">
          Sign Up
        </h2>

        {/* USERNAME */}
        <div className="flex items-center bg-white text-thistle-600 rounded gap-1 pl-2">
          <FaUser size={18} />

          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        {/* EMAIL */}
        <div className="flex items-center bg-white text-thistle-600 rounded gap-1 pl-2">
          <IoMail size={22} />

          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>

        {/* PHONE NUMBER */}
        <div className="flex items-center bg-white text-thistle-600 rounded gap-1 pl-2">
          <FaPhone size={18} />

          <input
            className="w-full outline-none bg-transparent py-2.5"
            type="tel"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
            }}
          />
        </div>

        {/* PASSWORD */}
        <div className="flex items-center bg-white text-thistle-600 rounded gap-1 pl-2">
          <RiLockPasswordFill size={22} />

          <input
            className="w-full bg-white text-thistle-600 outline-none py-2.5"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
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

        {/* CONFIRM PASSWORD */}
        <div className="flex items-center bg-white text-thistle-600 rounded gap-1 pl-2">
          <RiLockPasswordFill size={22} />

          <input
            className="w-full text-dark-coffee-900 outline-none bg-transparent py-2.5"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          <div className="px-3">
            {showPassword ? (
              <BiSolidHide
                size={16}
                className="text-dark-coffee-800"
                onClick={handlePassword}
              />
            ) : (
              <BiSolidShow
                size={16}
                className="text-dark-coffee-800"
                onClick={handlePassword}
              />
            )}
          </div>
        </div>
        <button
          className="w-full bg-thistle-600 hover:bg-thistle-700 transition-all active:scale-95 py-2.5 rounded text-white font-medium"
          disabled={loading}
        >
          {" "}
          {loading ? <MyLoader /> : "Create Account"}
        </button>
        <p className="text-center text-white">
          Already have an account?{" "}
          <NavLink
            to={"/"}
            onClick={switchToLogin}
            className=" font-bold text-thistle-600"
          >
            Log In
          </NavLink>
        </p>
      </form>
    </div>
  );
};

export default Register;

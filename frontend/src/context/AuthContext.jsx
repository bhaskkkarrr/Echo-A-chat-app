import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const BASE_API = import.meta.env.VITE_API_BASE_URL;
export const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const config = {
    headers: { "Content-type": "application/json" },
  };
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const registerUser = async (email, name, password, phoneNumber) => {
    const res = await axios.post(
      `${BASE_API}/api/auth/register`,
      { email, name, password, phoneNumber },
      config,
    );
    return res.data;
  };
  // ✅ Utility to check if JWT is expired
  const isTokenExpired = (token) => {
    try {
      const { exp } = JSON.parse(atob(token.split(".")[1]));
      if (Date.now() >= exp * 1000) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Invalid token:", err);
      return true;
    }
  };
  // ✅ Restore session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedToken) {
      if (isTokenExpired(storedToken)) {
        logoutUser();
        navigate("/");
      } else {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
        setAuthenticated(true);
      }
    }
    setAuthLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      setLoggingIn(true);
      const res = await axios.post(
        `${BASE_API}/api/auth/login`,
        { email, password },
        config,
      );

      setToken(res.data.token);
      setUser(res.data.user); // 🔥 IMPORTANT FIX
      setAuthenticated(true);

      localStorage.setItem("authToken", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/chats");
      return res.data;
    } finally {
      setLoggingIn(false);
    }
  };
  const logoutUser = async () => {
    const res = await axios.post(`${BASE_API}/api/auth/logout`);
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setAuthenticated(false);
    return res.data;
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        authenticated,
        authLoading,
        loggingIn,
        setLoggingIn,
        registerUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

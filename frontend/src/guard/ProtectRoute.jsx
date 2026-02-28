import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { LoaderIcon } from "react-hot-toast";

export default function ({ children }) {
  const { authLoading, authenticated } = useContext(AuthContext);
  // ✅ wait until auth is checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <LoaderIcon />
      </div>
    );
  }
  if (!authenticated) {
    return <Navigate to={"/"} replace />;
  }
  return children;
}

import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage";
import Page404 from "./pages/404Page";
import { AuthProvider } from "./context/AuthContext";
import ProtectRoute from "./guard/ProtectRoute";
import { ChatProvider } from "./context/ChatsContext";
import { MessageProvider } from "./context/MessageContext";

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <MessageProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/chats"
              element={
                <ProtectRoute>
                  <ChatPage />
                </ProtectRoute>
              }
            ></Route>
            <Route path="*" element={<Page404 />}></Route>
          </Routes>
        </MessageProvider>
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;

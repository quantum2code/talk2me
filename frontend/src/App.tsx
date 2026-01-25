// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login.tsx";
import Signup from "./pages/SignUp.tsx";
import Profile from "./pages/Profile.tsx";
import AIStats from "./pages/AIStats.tsx";
import Recording from "./pages/Recording.tsx";
import ChatPage from "./pages/ChatPage.tsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* GOOGLE AUTH */}
        {/* pages elements */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
<<<<<<< HEAD
        <Route path="/c/:convId?" element={<Recording />} />
=======
        <Route path="/chat/" element={<Recording />} />
        <Route path="/c/:convId" element={<ChatPage />} />
>>>>>>> working
        <Route path="/profile" element={<Profile />} />
        <Route path="/aistats" element={<AIStats />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

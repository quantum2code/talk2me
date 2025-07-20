// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import AIStats from './pages/AIStats';
import ChatHistory from './pages/chathistory';
import Recording from './pages/Recording'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-stats" element={<AIStats />} />
        <Route path="/chathistory" element={<ChatHistory />} />
        <Route path="/recording" element={<Recording />} /> 
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

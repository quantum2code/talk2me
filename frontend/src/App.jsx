// src/App.jsx
import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';


import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import Profile from './pages/Profile';
import AIStats from './pages/AIStats';
import ChatHistory from './pages/chathistory';
import Recording from './pages/Recording';
// Component Imports
import Contact from './components/Contact.jsx';
import Features from './components/Features.jsx';
import Roadmap from './components/Roadmap.jsx';
import Services from './components/Services.jsx';

function App() {
  return (
    <Router>
      <Routes>

{/* pages elements */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ai-stats" element={<AIStats />} />
        <Route path="/chathistory" element={<ChatHistory />} />
        <Route path="/recording" element={<Recording />} /> 
{/* components elements */}
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/services" element={<Services />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

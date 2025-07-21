import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';

function Login() {
  const navigate = useNavigate();
  // For GOOGLE Login Handeling
  const googleLogin = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log('Access Token:', tokenResponse.access_token)
      navigate('/main') // Redirect after login
    },
    onError: error => {
      console.error('Google Login Error:', error)
    }
  })

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();

    // Dummy login 
    if (email === 'user@example.com' && password === '123456') {
      navigate('/main');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e0033] to-black px-4 relative text-white">

      {/* back  */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-4 hover:opacity-80 transition"
      >
        <img src="/assets/back-arrow.png" alt="Back" className="h-8 w-8 sm:h-10 sm:w-10" />
      </button>

      {/* Logo */}
      <div className="absolute top-6 left-14 flex items-center gap-2 font-bold text-xl animate-bounce">
        <img src="/talk2melogo.png" alt="Talk2Me Logo" className="h-20 w-auto" />
        <span className="text-2xl">Talk2Me</span>
      </div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a0030] text-white rounded-2xl p-8 w-full max-w-md shadow-xl">
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back 👋</h2>
        <p className="text-sm text-gray-400 mb-6 text-center">Log in to continue your speech journey</p>

        {error && <p className="text-red-500 mb-4 text-center text-sm">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#2c1a47] text-sm rounded-lg outline-none border border-gray-600"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 pr-10 bg-[#2c1a47] text-sm rounded-lg outline-none border border-gray-600"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-[#a996ff] hover:bg-[#bcb0ff] text-black font-semibold py-2 rounded-lg"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center text-gray-500 gap-4 text-sm my-4">
          <hr className="flex-grow border-gray-600" />
          <span>or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Login don't change it without discussing- Saikat*/}

        <button
          type="button"
          onClick={() => googleLogin()} // Google Login Function...
          className="w-full border border-gray-700 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-3"
        >
          <img
            src="https://icon2.cleanpng.com/20240216/fty/transparent-google-logo-flat-google-logo-with-blue-green-red-1710875585155.webp"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>


        {/* Signup Link */}
        <p className="text-center text-sm mt-6 text-gray-400">
          Don’t have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

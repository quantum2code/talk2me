import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = (e) => {
    e.preventDefault();
    // VALIDATE USER
    navigate('/main'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e0033] to-black px-4 relative text-white">

      {/* Back Btn */}
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

      {/* Signup Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#1a0030] text-white rounded-2xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account 👤</h2>
        <p className="text-sm text-gray-400 mb-6 text-center">Join Talk2Me and improve your speech</p>

        <form onSubmit={handleSignup} className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 bg-[#2c1a47] text-sm rounded-lg outline-none border border-gray-600"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 bg-[#2c1a47] text-sm rounded-lg outline-none border border-gray-600"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create Password"
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

          {/* Checkbox */}
          <label className="flex items-center gap-2 text-sm text-gray-400">
            <input type="checkbox" required />
            I agree to the terms & conditions
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#a996ff] hover:bg-[#bcb0ff] text-black font-semibold py-2 rounded-lg"
          >
            Sign Up
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center text-gray-500 gap-4 text-sm my-4">
          <hr className="flex-grow border-gray-600" />
          <span>or</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        {/* Google Signup */}
        <button
          type="button"
          className="w-full border border-gray-700 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-3"
        >
          <img
            src="https://icon2.cleanpng.com/20240216/fty/transparent-google-logo-flat-google-logo-with-blue-green-red-1710875585155.webp"
            alt="Google"
            className="w-5 h-5"
          />
          Sign Up with Google
        </button>

        {/* Link to Login */}
        <p className="text-center text-sm mt-6 text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;

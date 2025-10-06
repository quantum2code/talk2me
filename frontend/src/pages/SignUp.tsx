import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LogoSVG from "@/components/LogoSVG";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/hooks/useAuth";

function Signup() {
  const navigate = useNavigate();
  // For GOOGLE Login Handeling But using Firebase don't change the code without discussing - Saikat...

  const [showPassword, setShowPassword] = useState(false);

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "http://localhost:5173/chat/",
    });
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1e0033] to-black px-4 relative text-white">
      {/* Back Btn */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-4 hover:opacity-80 transition"
      >
        {/* <img
          src="/assets/back-arrow.png"
          alt="Back"
          className="h-8 w-8 sm:h-10 sm:w-10"
        /> */}
      </button>

      {/* Logo */}
      <div className="absolute top-6 left-14 flex items-center gap-2 font-bold text-xl ">
        <LogoSVG classname="w-6 h-6" />
        <span className="text-2xl">Talk2Me</span>
      </div>

      {/* Signup Form Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a0030] text-white rounded-4xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">Create Account</h2>
        <p className="text-sm text-white/40 mb-6 text-center">
          Join Talk2Me and improve your speech
        </p>

        <form className="space-y-4">
          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            required
            className="w-full p-3 bg-[#2c1a47] text-sm rounded-lg outline-none border border-white/10"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            required
            className="w-full p-3 bg-[#2c1a47] text-sm rounded-lg outline-none border border-white/10"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create Password"
              required
              className="w-full p-3 pr-10 bg-[#2c1a47] text-sm rounded-lg outline-none border border-white/10"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-0 translate-y-[50%] scale-80 text-gray-400 cursor-pointer"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </div>

          {/* Checkbox */}
          <label className="flex items-center gap-2 text-sm text-white/40 ml-2">
            <input type="checkbox" required />
            <span>I agree to the terms & conditions</span>
          </label>

          {/* Submit */}
          <Button
            type="submit"
            variant={"cta"}
            size={"lg"}
            className="border-2 w-full"
          >
            Sign Up
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center text-white/20 gap-4 text-sm my-4 mx-2">
          <hr className="flex-grow border-white/20" />
          <span>or</span>
          <hr className="flex-grow border-white/20" />
        </div>

        <button
          type="button"
          //yet to implement
          className="w-full border border-white/10 hover:border-white/20 bg-black text-white py-2 rounded-lg flex items-center justify-center gap-3"
          onClick={signIn}
        >
          <FaGoogle />
          Continue with Google
        </button>

        {/* Link to Login */}
        <p className="text-center text-sm mt-6 text-white/40">
          Already have an account?
          <Link to="/login" className="text-accent hover:underline ml-1">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Signup;

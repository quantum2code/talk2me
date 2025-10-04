import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import LogoSVG from "@/components/LogoSVG";
import { FaGoogle } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

function Login() {
  const navigate = useNavigate();
  // For GOOGLE Login Handeling

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();

    // Dummy login
    if (email === "user@example.com" && password === "123456") {
      navigate("/main");
    } else {
      setError("Invalid email or password");
    }
    return e;
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#1e0033] to-black px-4 relative text-white">
      {/* back  */}
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

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-[#1a0030] text-white rounded-4xl p-8 w-full max-w-md shadow-xl"
      >
        <h2 className="text-3xl font-bold mb-2 text-center">Welcome Back 👋</h2>
        <p className="text-sm text-white/40 mb-6 text-center">
          Log in to continue your speech journey
        </p>

        {error && (
          <p className="text-red-500 mb-4 text-center text-sm">{error}</p>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 bg-[#2c1a47] text-sm rounded-lg outline-none border border-white/10"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
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

          {/* Login Button */}
          <Button
            type="submit"
            variant={"cta"}
            size={"lg"}
            className="border-2 w-full"
          >
            Log in
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
        >
          <FaGoogle />
          Continue with Google
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm mt-6 text-white/40">
          Already have an account?
          <Link to="/signup" className="text-accent hover:underline ml-1">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;

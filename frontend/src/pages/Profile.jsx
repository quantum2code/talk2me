import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, ArrowRight, User, MessageSquare, Settings, Zap } from "lucide-react";

export default function ProfileSettings() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] text-white flex">
      {/* Blurred blobs */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600 opacity-20 rounded-full blur-[250px] top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute w-[400px] h-[400px] bg-blue-500 opacity-20 rounded-full blur-[200px] top-10 left-10 z-0" />

      {/* Sidebar */}
      <aside className="relative z-10 w-64 min-h-screen bg-gradient-to-b from-[#1E1E1E] to-[#121212] p-6 flex flex-col justify-between shadow-lg">
        <div>
          <div className="flex items-center gap-2 mb-8">
            <Zap className="text-purple-500" />
            <h1 className="text-lg font-semibold">Talk2Me</h1>
          </div>

          <nav className="flex flex-col gap-4">
            <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-xl font-semibold">
              <MessageSquare size={18} /> Chat
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white">
              <MessageSquare size={18} /> Chat History
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white">
              <User size={18} /> AI Personalities
            </button>
            <button className="flex items-center gap-2 text-gray-400 hover:text-white">
              <Settings size={18} /> Settings
            </button>
          </nav>
        </div>

        <div className="bg-purple-700 rounded-2xl p-4 text-center">
          <p className="text-sm mb-2 font-medium">Upgrade to Pro</p>
          <p className="text-xs mb-4 opacity-80">Unlock powerful features with pro upgrade today!</p>
          <button className="bg-white text-purple-700 px-4 py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-1 mx-auto">
            Upgrade now <ArrowRight size={16} />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex flex-col px-12 py-10">
        {/* Top Tabs */}
        <div className="flex gap-6 border-b border-white/10 mb-10">
          {['Profile Details', 'Preferences', 'Usage', 'Plan and Billing', 'Team', 'Integrations', 'API Dashboard'].map((tab, i) => (
            <div
              key={i}
              className={`pb-3 cursor-pointer text-sm font-medium ${i === 0 ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-gradient-to-br from-[#181818] to-[#101010] p-8 rounded-2xl shadow-2xl border border-white/10 max-w-4xl mx-auto">
          {/* Profile pic */}
          <div className="flex items-center mb-8">
            <div className="relative w-20 h-20">
              <img
                src="https://randomuser.me/api/portraits/men/32.jpg"
                alt="avatar"
                className="rounded-full w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-white text-black rounded-full p-1 cursor-pointer">
                ✎
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-2">Your fullname*</label>
              <Input type="text" defaultValue="Happy Singh" className="bg-[#1e1e1e] text-white" />
            </div>
            <div>
              <label className="block text-sm mb-2">Your email*</label>
              <Input type="email" defaultValue="happysingh@gmail.com" className="bg-[#1e1e1e] text-white" />
            </div>
            <div>
              <label className="block text-sm mb-2">Password*</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  defaultValue="password123"
                  className="bg-[#1e1e1e] text-white pr-10"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2">Confirm Password*</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  defaultValue="password123"
                  className="bg-[#1e1e1e] text-white pr-10"
                />
                <div
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 text-white flex items-center gap-2">
              Update <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from '../signUpFirebase';

export default function AIStats() {

  // MAPPING FOR NAVIGATION
  const navigation = [
    { name: 'Profile Details', href: '#', current: false },
    { name: 'Preferrances', href: '#', current: false },
    { name: 'Usage', href: '#', current: true },
    { name: 'Plan & Billing', href: '#', current: false },
    { name: 'Team', href: '#', current: false },
    { name: 'Integrations', href: '#', current: false },
    { name: 'API Dashboard', href: '#', current: false },
  ]

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  const navigate = useNavigate();
  // Fetching the data from Google Account
  const user = auth.currentUser
  const avatarURL = user?.photoURL || '/assets/girl-avatar.png'
  const displayName = user?.displayName || 'Guest'

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1e0033] to-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0030] p-5 flex flex-col justify-between fixed top-0 left-0 h-full z-20 rounded-tr-2xl rounded-br-2xl">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-2 mb-10">
            <img src="talk2melogo.png" alt="Talk2Me Logo" className="h-20 w-15" />
            <span className="text-xl font-semibold">Talk2Me</span>
          </div>

          {/* Navigation */}
          <nav className="space-y-3 text-sm text-gray-400">
            <button onClick={() => navigate("/main")} className="block hover:text-white transition">Chat</button>
            <button onClick={() => navigate("/chathistory")} className="block hover:text-white transition">Chat History</button>
            <button onClick={() => navigate("/ai-stats")} className="w-full text-left px-4 py-2 rounded-lg bg-[#6d48ff] text-white font-semibold">
              AI Generated Stats
            </button>
            <button onClick={() => navigate("/settings")} className="block hover:text-white transition">Settings</button>
          </nav>
        </div>

        {/* Upgrade Card */}
        <div className="bg-[#6d48ff] text-white p-4 rounded-xl text-center mt-10">
          <h2 className="text-sm font-bold mb-1">Upgrade to Pro</h2>
          <p className="text-xs mb-3">Unlock powerful features with our pro upgrade today!</p>
          <button className="bg-white text-[#6d48ff] px-4 py-1.5 rounded-full text-xs font-semibold">Upgrade now →</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="h-16 border-b border-white/10 px-10 flex items-center justify-between">
          <div className="hidden sm:flex space-x-10">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                aria-current={item.current ? 'page' : undefined}
                className={classNames(
                  item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-white/5 hover:text-white',
                  'rounded-md px-3 py-2 text-sm font-medium'
                )}
              >
                {item.name}
              </a>
            ))}
          </div>
        </header>

        {/* Body Content */}
        <section className="p-10 overflow-y-auto">
          <div className="bg-[#2a004f] p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Activity Overview</h2>
            <p className="text-gray-300 text-sm mb-4">Here you can see the analytics and stats of your AI chats.</p>

            {/* Example Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#3a0066] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Total Messages</h3>
                <p className="text-2xl font-bold">1,245</p>
              </div>
              <div className="bg-[#3a0066] p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Average Response Time</h3>
                <p className="text-2xl font-bold">1.8s</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>

  );
}

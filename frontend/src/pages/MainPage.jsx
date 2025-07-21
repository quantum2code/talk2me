import React, { useState } from "react";
import { FaMicrophone } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { auth } from '../signUpFirebase';

export default function MainPage() {
  const navigate = useNavigate();
  // Fetching the data from Google Account
  const user = auth.currentUser
  const avatarURL = user?.photoURL || '/assets/girl-avatar.png'
  const displayName = user?.displayName || 'Guest'

  const [showPopup, setShowPopup] = useState(false);
  const [popupStep, setPopupStep] = useState(1);
  const [feedbackStyle, setFeedbackStyle] = useState([]);
  const [speakingGoal, setSpeakingGoal] = useState([]);

  const handleMicClick = () => {
    setShowPopup(true);
    setPopupStep(1);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupStep(1);
    setFeedbackStyle([]);
    setSpeakingGoal([]);
  };

  const handleCheckboxChange = (value, currentState, setState) => {
    if (currentState.includes(value)) {
      setState(currentState.filter((v) => v !== value));
    } else {
      setState([...currentState, value]);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-[#1e0033] to-black text-white font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a0030] p-5 flex flex-col justify-between rounded-tr-2xl rounded-br-2xl z-20 relative">
        <div>
          <div className="flex items-center gap-2 mb-10">
            <img src="talk2melogo.png" alt="Talk2Me Logo" className="h-20 w-15" />
            <span className="text-xl font-semibold">Talk2Me</span>
          </div>
          <nav className="space-y-3">
            <button className="w-full text-left px-4 py-2 rounded-lg bg-[#6d48ff] text-white font-semibold">Chat</button>
            <div className="mt-4 ml-2 text-sm text-gray-400 space-y-1">
              <p onClick={() => navigate("/chathistory")} className="cursor-pointer hover:text-white transition">Chat History</p>
              <p onClick={() => navigate("/ai-stats")} className="cursor-pointer hover:text-white transition">AI Generated Stats</p>
            </div>
            <div className="mt-4 ml-2 text-sm text-gray-400"><p>Settings</p></div>
          </nav>
        </div>
        <div className="bg-[#6d48ff] text-white p-4 rounded-xl text-center">
          <h2 className="text-sm font-bold mb-1">Upgrade to Pro</h2>
          <p className="text-xs mb-3">Unlock powerful features with our pro upgrade today!</p>
          <button className="bg-white text-[#6d48ff] px-4 py-1.5 rounded-full text-xs font-semibold">Upgrade now →</button>
        </div>
      </aside>

      {/* MainN C00ntent */}
      <main className="relative flex-1 flex flex-col items-center justify-between px-4 pt-10 pb-8 overflow-visible">
        {/* Top Right */}
        <div className="absolute top-6 right-6 flex items-center gap-4 z-30">
          <button className="text-white text-lg">💬</button>
          <img src={avatarURL} alt="Profile" className="w-9 h-9 rounded-full object-cover cursor-pointer" onClick={() => navigate("/profile")} />
        </div>

        {/* Avatar */}
        <div className="mt-4 mb-6 z-30">
          <img src={avatarURL} alt="AI Avatar" className="w-28 h-28 rounded-full object-cover" />
        </div>

        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center z-30">
          <p className="text-sm mt-2 text-white font-medium">
            Welcome, {displayName.split(" ")[0]} 👋
          </p>
          What would you like to practice today?
        </h2>

        {/* Practice */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 z-30">
          {[
            "Talk about your weekend",
            "Tell me about your city",
            "Job interview: Tell me about your strengths",
            "Casual greetings practice",
          ].map((text, idx) => (
            <div key={idx} className="bg-[#1e1e2f] text-white p-4 rounded-xl text-center w-52 cursor-pointer hover:bg-[#292943] transition">
              {text}
            </div>
          ))}
        </div>

        {/* MicE Button */}
        <div className="relative flex flex-col items-center justify-center mt-auto mb-4 w-40 h-40 z-30">
          <img
            src="/assets/wave.png"
            alt="Wave background"
            className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2 z-0 pointer-events-none select-none object-cover"
            style={{ width: "1600px", height: "300px", opacity: 0.5 }}
          />
          <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 shadow-[0_0_60px_#d47dff] animate-pulse flex items-center justify-center relative z-10">
            <button
              onClick={handleMicClick}
              className="w-20 h-20 rounded-full bg-black flex items-center justify-center shadow-inner border-4 border-[#6d48ff] hover:scale-105 transition relative z-20"
            >
              <FaMicrophone className="text-white text-3xl" />
            </button>
          </div>
          <p className="text-sm text-gray-300 mt-4 z-30">Tap the mic to begin speaking</p>
        </div>

        {/* Pop-up */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-[#1a0030] p-8 rounded-2xl w-[90%] max-w-lg text-left relative shadow-2xl border border-[#6d48ff]">
              <button
                className="absolute top-3 right-4 text-white text-xl"
                onClick={closePopup}
              >
                &times;
              </button>

              {popupStep === 1 && (
                <>
                  <h2 className="text-2xl font-bold mb-2 text-white">How would you like your AI speech feedback?</h2>
                  <p className="text-sm text-gray-400 mb-4">Choose a style that suits you best. You can change this anytime in settings.</p>
                  <div className="space-y-2">
                    {[
                      "Casual and Friendly",
                      "Professional and Formal",
                      "Informative and Detailed",
                      "Quick and to the Point",
                      "Creative and Playful",
                    ].map((option) => (
                      <label key={option} className="block text-white">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={feedbackStyle.includes(option)}
                          onChange={() => handleCheckboxChange(option, feedbackStyle, setFeedbackStyle)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button onClick={closePopup} className="text-gray-400 hover:text-white">Skip</button>
                    <button onClick={() => setPopupStep(2)} className="bg-[#6d48ff] text-white px-4 py-2 rounded-full hover:bg-[#7b5fff]">Next</button>
                  </div>
                </>
              )}

              {popupStep === 2 && (
                <>
                  <h2 className="text-2xl font-bold mb-2 text-white">What’s your speaking goal?</h2>
                  <p className="text-sm text-gray-400 mb-4">Help us tailor your practice session to match your goals.</p>
                  <div className="space-y-2">
                    {[
                      "Everyday Conversation",
                      "Interview",
                      "Exams",
                      "Presentation",
                    ].map((option) => (
                      <label key={option} className="block text-white">
                        <input
                          type="checkbox"
                          className="mr-2"
                          checked={speakingGoal.includes(option)}
                          onChange={() => handleCheckboxChange(option, speakingGoal, setSpeakingGoal)}
                        />
                        {option}
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6">
                    <button onClick={closePopup} className="text-gray-400 hover:text-white">Skip</button>
                    <button
                      onClick={() => {
                        closePopup();
                        navigate("/recording");
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600"
                    >
                      Get Started
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

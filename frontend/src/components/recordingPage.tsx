import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mic, MessageSquare, Shield, User } from "lucide-react";
import userAvatar from "../assets/user-profile.png"

interface PracticePageProps {
  onMicClick: () => void;
  isRecording: boolean;
  stream: MediaStream | null;
}

export default function PracticePage({
  onMicClick,
  isRecording,
  stream,
}: PracticePageProps) {
  const [volume, setVolume] = useState(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    if (stream) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512; // more detail for smaller sounds
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      source.connect(analyser);
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      const updateVolume = () => {
        analyser.getByteFrequencyData(dataArray);
        // Increase sensitivity: use square and scale up the average
        const avg =
          (dataArray.reduce((a, b) => a + b, 0) / dataArray.length / 255) ** 1.5;
        setVolume(Math.min(avg * 3.5, 1)); // boosted for soft voices
        requestAnimationFrame(updateVolume);
      };

      updateVolume();
    }
  }, [stream]);

  // React more visibly even for small sound changes
  const waveSize = 160 + volume * 800;

  const options = [
    { text: "Talk about your weekend", emoji: "🌅" },
    { text: "Tell me about your city", emoji: "🏙️" },
    { text: "Job interview: Tell me about your strengths", emoji: "💼" },
    { text: "Casual greetings practice", emoji: "👋" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#030007] via-[#070012] to-[#05000b] flex flex-col items-center justify-center text-white relative overflow-hidden px-4">
      {/* Top icons
      <div className="absolute top-6 right-6 flex items-center gap-4">
        <MessageSquare className="w-5 h-5 opacity-80 cursor-pointer" />
        <Shield className="w-5 h-5 opacity-80 cursor-pointer" />
        <User className="w-8 h-8 rounded-full border border-gray-600 p-[2px] cursor-pointer" />
      </div> */}

      {/* Profile Avatar */}
      <div className="flex flex-col items-center mb-8 mt-12">
        <img
          src={userAvatar}
          alt="Avatar"
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-2 border-gray-700 shadow-lg"
        />
      </div>

      {/* Heading */}
      <h1 className="text-lg sm:text-xl font-medium mb-10 text-center px-4">
        What would you like to practice today?
      </h1>

      {/* Options Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-20 w-full max-w-5xl px-4">
        {options.map((opt, i) => (
          <div
            key={i}
            className="bg-[#111111] hover:bg-[#1a1a1a] aspect-square flex flex-col items-center justify-center rounded-xl text-center cursor-pointer shadow-md border border-gray-800 transition duration-300 text-sm sm:text-base"
          >
            <span className="text-3xl mb-2">{opt.emoji}</span>
            <p className="px-3 leading-snug">{opt.text}</p>
          </div>
        ))}
      </div>

      {/* Mic Section */}
      <div className="flex flex-col items-center justify-center relative">
        {/* Glowing Layers */}
        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-fuchsia-700/50 via-purple-700/50 to-pink-600/50 blur-3xl"
          animate={{
            width: waveSize,
            height: waveSize,
            opacity: 0.5 + volume * 0.7,
          }}
          transition={{ duration: 0.1 }}
        />

        <motion.div
          className="absolute rounded-full bg-gradient-to-r from-purple-900/40 via-fuchsia-800/40 to-pink-700/40 blur-3xl"
          animate={{
            width: waveSize * 1.8,
            height: waveSize * 1.8,
            opacity: 0.3 + volume * 0.4,
          }}
          transition={{ duration: 0.15 }}
        />

        {/* Microphone Button */}
        <motion.button
          onClick={onMicClick}
          className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center shadow-2xl border-2 border-pink-600/40 
            ${
              isRecording
                ? "bg-gradient-to-r from-pink-600 to-purple-700 shadow-pink-500/50"
                : "bg-gradient-to-r from-gray-800 to-gray-900 shadow-gray-600/20"
            } transition duration-300`}
          whileTap={{ scale: 0.9 }}
        >
          <Mic className="w-10 h-10 sm:w-12 sm:h-12" />
        </motion.button>

        <p className="text-gray-400 mt-6 text-sm sm:text-base">
          {isRecording ? "Listening..." : "Tap the mic to begin speaking"}
        </p>
      </div>
    </div>
  );
}

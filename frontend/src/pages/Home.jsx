import { FaGithub, FaGlobe, FaTwitter } from 'react-icons/fa';
import { useNavigate, Link, Links, Route } from 'react-router-dom';
// import { Link } from 'react-router-dom';


// Including the Route Paths

import Contact from '../components/Contact.jsx';

<Route path="/contact" element={<Contact />} />



function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section
        id="home"
        className="min-h-screen bg-gradient-to-br from-[#0d011b] to-[#090013] text-white overflow-hidden relative"
      >
        {/* Navbar */}
        <nav className="w-full flex justify-between items-center py-6 px-4 sm:px-10 z-30">
          <div className="flex items-center gap-2">
            <img src="/talk2melogo.png" alt="Talk2Me Logo" className="h-12 w-12 sm:h-16 sm:w-16" />
            <span className="text-lg sm:text-xl font-bold">Talk2Me</span>
          </div>

          <ul className="hidden md:flex gap-6 text-sm font-medium">
            <li><a href="#home" className="hover:text-pink-400 transition">Home</a></li>
            <li><a href="#services" className="hover:text-pink-400 transition">Services</a></li>
            <li><a href="#features" className="hover:text-pink-400 transition">Features</a></li>
            <li><a href="#roadmap" className="hover:text-pink-400 transition">Roadmap</a></li>
            <li><Link to="/contact" className="hover:text-pink-400 transition">Contact</Link></li>
          </ul>

          <div className="flex gap-4 text-xl">
            <FaGithub className="hover:text-gray-300 cursor-pointer" />
            <FaGlobe className="hover:text-gray-300 cursor-pointer" />
            <FaTwitter className="hover:text-gray-300 cursor-pointer" />
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center px-4 pt-6 sm:pt-10 md:pt-14 lg:pt-18 relative z-20 pb-64">
          <h1 className="uppercase text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent leading-tight mb-6">
            TALK BETTER, EVERY DAY
          </h1>
          <p className="italic text-sm sm:text-base md:text-lg text-gray-200 mb-3">
            AI-powered speech practice to boost your confidence and fluency
          </p>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mb-10">
            Your personal AI speech coach offering real-time feedback on your spoken English — from grammar to pacing, helping you speak smarter, faster.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mb-24">
            <button
              onClick={() => navigate('/signup')}
              className="border-2 border-pink-500 text-white px-5 py-2 rounded-full hover:bg-pink-600 transition text-sm sm:text-base"
            >
              Get started
            </button>
            <button className="border border-white px-5 py-2 rounded-full hover:bg-white hover:text-black transition text-sm sm:text-base">
              Learn More
            </button>
          </div>
        </div>

        {/* Girl + Wave */}
        <div className="absolute bottom-0 sm:bottom-6 left-0 right-0 flex items-end justify-between px-4 sm:px-8 z-10">
          <img
            src="/assets/girl.png"
            alt="Girl with phone"
            className="w-[140px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[360px] object-contain"
          />
          <img
            src="/assets/waveform.png"
            alt="Waveform"
            className="w-[84%] sm:w-[88%] md:w-[92%] lg:w-[96%] object-contain animate-pulse opacity-95"
            style={{
              filter: 'drop-shadow(0 0 25px #dd99ff) brightness(2.0) saturate(2)',
            }}
          />
        </div>
      </section>

      <footer className="h-40 sm:h-44 bg-[#090013] w-full"></footer>
    </>
  );
}

export default Home;

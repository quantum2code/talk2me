import { FaGithub, FaGlobe, FaTwitter } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
// import { Link } from 'react-router-dom';

// Including the Route Paths

import LogoSVG from "@/components/LogoSVG";
import { Button } from "@/components/ui/button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-[calc(100vw-15px)] overflow-hidden flex flex-col bg-black">
      <section id="home" className=" text-white overflow-hidden relative mb-20">
        {/* Navbar */}
        <nav className="w-full flex fixed justify-between items-center py-6 px-10 sm:px-10 z-30">
          <div className="flex items-center gap-2">
            <LogoSVG classname="w-6 h-6" />
            <span className="text-lg sm:text-xl font-bold">Talk2Me</span>
          </div>

          <ul className="hidden md:flex gap-6 text-sm font-medium text-gray-300 backdrop-blur-xl px-7 p-4 rounded-full">
            <li>
              <a href="#home" className="hover:text-pink-400 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-pink-400 transition">
                Services
              </a>
            </li>
            <li>
              <a href="#features" className="hover:text-pink-400 transition">
                Features
              </a>
            </li>
            <li>
              <Link to="/contact" className="hover:text-pink-400 transition">
                Contact
              </Link>
            </li>
          </ul>

          <div className="flex gap-4 text-xl">
            <FaGithub className="hover:text-gray-300 cursor-pointer" />
            <FaGlobe className="hover:text-gray-300 cursor-pointer" />
            <FaTwitter className="hover:text-gray-300 cursor-pointer" />
          </div>
        </nav>

        {/* Hero Content */}
        <div className="text-center px-4 pt-6 sm:pt-10 md:pt-14 lg:pt-18 relative z-20 mt-20">
          <h1 className="uppercase text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent leading-tight mb-3">
            TALK BETTER, EVERY DAY
          </h1>
          <p className="italic text-[16px] text-gray-400 mb-8">
            AI-powered speech practice to boost your confidence and fluency.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size={"cta"}
              variant={"cta"}
              className="rounded-full"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </Button>
            <Button variant={"sec_cta"} size={"cta"} className="rounded-full">
              Learn more
            </Button>
          </div>
        </div>

        {/* Girl + Wave */}
        {/* <div className="absolute bottom-0 sm:bottom-6 left-0 right-0 flex items-end justify-between px-4 sm:px-8 z-10">
          <img
            src="/girl.png"
            alt="Girl with phone"
            className="w-[140px] sm:w-[200px] md:w-[260px] lg:w-[320px] xl:w-[360px] object-contain"
          />
        </div> */}
      </section>

      <div className="relative w-full h-[40rem] flex items-center">
        {/* Mask layer that blurs */}
        <div className="absolute bottom-0 w-full h-full z-40 flex backdrop-blur-2xl"></div>
        <div className="absolute bottom-0 w-full h-full z-50 flex">
          <div
            className="flex-1 h-full  backdrop-blur-2xl 
  [mask-image:linear-gradient(to_right,black,#00000066)] 
  [mask-repeat:repeat-x] [mask-size:80px_100%]"
          ></div>
        </div>

        {/* Purple background */}
        <div className="bg-purple-500 rounded-[100%] w-full h-[25rem] animate-pulse"></div>
      </div>
    </div>
  );
}

export default Home;

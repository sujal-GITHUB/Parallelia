import React from 'react';
import ToggleSwitch from '../components/ToggleButton/ToggleSwitch';

const Landing: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row font-inter min-h-screen overflow-y-auto">
      {/* Left Section with Background Video */}
      <div className="w-full lg:w-1/2 min-h-screen relative order-1 lg:order-1 hidden sm:flex">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* Text over the video */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 text-center text-white z-10 p-4">
          <p className="text-xl font-pressstart font-normal drop-shadow-lg">
            "Parallelia is where reality and imagination converge, creating a limitless world where anything is possible."
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 min-h-screen text-white bg-[#581dbd] flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 py-6 order-2 lg:order-2">
        <div className="flex flex-col items-center justify-center bg-[#15072d] border border-[#8239ff] py-5 rounded-lg w-full sm:w-[400px] md:w-[500px]">
          <img src="/logo.png" alt="Parallelia Logo" className="w-[100px] sm:w-[100px] mb-2" />
          <h1 className="text-xl font-semibold mb-5 font-inter text-center">Welcome to Parallelia</h1>
          <ToggleSwitch />
        </div>
        <h3 className="mt-7 font-inter text-white text-center text-sm sm:text-base">
          By signing up you agree to the <b>Privacy Policy.</b>
        </h3>
      </div>
    </div>
  );
};

export default Landing;

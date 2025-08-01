import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import videoBg from '../assets/video.mp4';

const Home = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleStartDigitalJourney = () => {
    navigate('/startdigitaljourney'); // Navigate to the bookconsultation route
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src={videoBg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="w-full md:w-1/2 lg:w-2/5">
            {/* Small heading */}
            <p className="text-red-500 font-medium text-sm mb-2">
              10+ Years Experience
            </p>
            
            {/* Big heading */}
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Digital Hospital Management<br />at one place
            </h1>
            
            {/* Subheading */}
            <p className="text-xl text-white text-opacity-90 mb-8">
              Next-Gen Hospital Solutions: Drive Innovation, Deliver Quality Healthcare
            </p>
            
            {/* CTA Button with enhanced hover effect */}
            <button
              onClick={handleStartDigitalJourney} // Add onClick handler
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 cursor-pointer px-6 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              Start Your Digital journey
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
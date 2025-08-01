import React, { useState } from 'react';
import { FaMoon, FaSun, FaUserCircle, FaChevronDown, FaSignOutAlt } from 'react-icons/fa';
import logo from '../../../assets/logo.jpg';

const DoctorNavbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [doctor] = useState({
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    email: 'sarah.johnson@hospital.com'
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-3 px-6 flex items-center justify-between z-30">
      {/* Logo on the left */}
      <div className="flex items-center ml-8">
        <img src={logo} alt="Hospital Logo" className="h-10 mr-3" />
        <span className="text-xl font-bold text-gray-800">ClinicPro</span>
      </div>

      {/* Right side controls */}
      <div className="flex items-center space-x-4">
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <FaSun className="text-yellow-400 text-xl" />
          ) : (
            <FaMoon className="text-gray-600 text-xl" />
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <FaUserCircle className="text-gray-600 text-2xl" />
            <span className="text-gray-700 font-medium hidden md:inline">
              {doctor.name}
            </span>
            <FaChevronDown
              className={`text-gray-500 transition-transform ${
                profileOpen ? 'transform rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {doctor.name}
                </p>
                <p className="text-xs text-gray-500">
                  {doctor.specialty}
                </p>
              </div>
              <div className="px-4 py-3">
                <p className="text-xs text-gray-500">
                  {doctor.email}
                </p>
              </div>
              <div className="border-t border-gray-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <FaSignOutAlt className="mr-2" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUserCircle, FaChevronDown, FaSignOutAlt, FaBell, FaIdCard } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from '../../../assets/logo.jpg';

const PatientNavbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [smartCardOpen, setSmartCardOpen] = useState(false);
  const navigate = useNavigate();
  
  const [patient] = useState({
    name: 'John Smith',
    memberSince: '2023-01-15',
    email: 'john.smith@example.com',
    notifications: [
      { id: 1, message: 'Your appointment is confirmed', time: '2 hours ago', read: false },
      { id: 2, message: 'New prescription available', time: '1 day ago', read: true },
      { id: 3, message: 'Lab results are ready', time: '3 days ago', read: false }
    ]
  });

  const [doctorDetails, setDoctorDetails] = useState({
    name: 'Dr. Emily Carter',
    specialty: 'Cardiology',
    licenseNumber: 'LIC-789012',
    contact: 'emily.carter@clinicpro.com',
    verified: true
  });

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSmartCardClick = (e) => {
    e.preventDefault();
    setSmartCardOpen(true);
  };

  const handleScanQR = () => {
    toast.info('QR Code Scanner Initiated', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  const handleVerifyDoctor = () => {
    setDoctorDetails(prev => {
      const newVerifiedStatus = !prev.verified;
      toast.success(newVerifiedStatus ? 'Doctor Verified' : 'Verification Revoked', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return {
        ...prev,
        verified: newVerifiedStatus
      };
    });
  };

  const unreadNotifications = patient.notifications.filter(n => !n.read).length;

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md py-3 px-6 flex items-center justify-between z-30">
        {/* Logo on the left */}
        <div className="flex items-center ml-8">
          <img src={logo} alt="Hospital Logo" className="h-10 mr-3" />
          <Link to="/patient" className="text-xl font-bold text-gray-800">
            ClinicPro
          </Link>
        </div>

        {/* Right side controls */}
        <div className="flex items-center space-x-4">
          {/* Patient Smart Card */}
          <button 
            onClick={handleSmartCardClick}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
            aria-label="Patient Smart Card"
          >
            <FaIdCard className="text-gray-600 text-xl" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
              aria-label="Notifications"
            >
              <FaBell className="text-gray-600 text-xl" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-200 font-medium">
                  Notifications
                </div>
                {patient.notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`px-4 py-3 border-b border-gray-200 ${!notification.read ? 'bg-blue-50' : ''}`}
                  >
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                ))}
                <div className="px-4 py-2 text-center text-sm text-blue-600 hover:bg-gray-100">
                  <Link to="/patient/notifications" onClick={() => setNotificationsOpen(false)}>
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

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
                {patient.name}
              </span>
              <FaChevronDown
                className={`text-gray-500 transition-transform ${
                  profileOpen ? 'transform rotate-180' : ''
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900">
                    {patient.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Member since {new Date(patient.memberSince).toLocaleDateString()}
                  </p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs text-gray-500">
                    {patient.email}
                  </p>
                </div>
                <div className="border-t border-gray-200">
                  <Link
                    to="/patient/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile Settings
                  </Link>
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

      {/* Smart Card Modal */}
      {smartCardOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Doctor Smart Card</h2>
              <button
                onClick={() => setSmartCardOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700">Name</p>
                <p className="text-lg text-gray-900">{doctorDetails.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Specialty</p>
                <p className="text-lg text-gray-900">{doctorDetails.specialty}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">License Number</p>
                <p className="text-lg text-gray-900">{doctorDetails.licenseNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Contact</p>
                <p className="text-lg text-gray-900">{doctorDetails.contact}</p>
              </div>
              <div className="flex items-center">
                <p className="text-sm font-medium text-gray-700">Verification Status</p>
                <span className={`ml-2 px-2 py-1 text-xs rounded ${doctorDetails.verified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {doctorDetails.verified ? 'Verified' : 'Not Verified'}
                </span>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleScanQR}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  Scan QR Code
                </button>
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleVerifyDoctor}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  {doctorDetails.verified ? 'Revoke Verification' : 'Verify Doctor'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <ToastContainer />
    </>
  );
};

export default PatientNavbar;
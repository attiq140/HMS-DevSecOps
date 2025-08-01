import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MdDashboard, MdMenu, MdClose, MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FaCalendarCheck, FaUserInjured, FaPrescriptionBottleAlt, FaComments, FaUserMd } from 'react-icons/fa';
import { AiFillFolderOpen, AiOutlineCalendar } from 'react-icons/ai';
import { HiOutlineDocumentReport } from 'react-icons/hi';
import { FiSettings, FiLogOut } from 'react-icons/fi';

const DoctorSidebar = ({ onCollapse, initiallyCollapsed }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(initiallyCollapsed);
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const menuItems = [
    { path: '/doctor/appointments', name: 'Appointments', icon: <FaCalendarCheck className="text-xl" /> },
    { path: '/doctor/patients', name: 'My Patients', icon: <FaUserInjured className="text-xl" /> },
    { path: '/doctor/records', name: 'Medical Records', icon: <AiFillFolderOpen className="text-xl" /> },
    { path: '/doctor/prescriptions', name: 'Prescriptions', icon: <FaPrescriptionBottleAlt className="text-xl" /> },
    { path: '/doctor/messages', name: 'Messages', icon: <FaComments className="text-xl" /> },
    { path: '/doctor/schedule', name: 'My Schedule', icon: <AiOutlineCalendar className="text-xl" /> },
    { path: '/doctor/reports', name: 'Reports', icon: <HiOutlineDocumentReport className="text-xl" /> },
    { path: '/doctor/profile', name: 'My Profile', icon: <FaUserMd className="text-xl" /> },
    { path: '/doctor/settings', name: 'Settings', icon: <FiSettings className="text-xl" /> },
    { path: '/doctor/logout', name: 'Logout', icon: <FiLogOut className="text-xl" /> },
  ];

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onCollapse(newState);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On mobile, always show full sidebar (not collapsed) when open
  const showCollapsed = isMobile ? false : isCollapsed;

  return (
    <>
      {/* Mobile Hamburger Button */}
      {isMobile && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md bg-white shadow-md text-gray-700"
          >
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white shadow-lg z-20 transform ${
          isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out ${
          showCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Collapse Button (Desktop only) */}
          {!isMobile && (
            <div className="flex justify-end p-2">
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-full hover:bg-gray-100"
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <MdChevronRight size={20} /> : <MdChevronLeft size={20} />}
              </button>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!showCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Doctor Profile Footer */}
          {!showCollapsed && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FaUserMd className="h-10 w-10 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">Dr. Sarah Johnson</p>
                  <p className="text-xs text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
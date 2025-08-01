import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.jpg';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isFeaturesActive = () => {
    const featurePaths = [
      '/working-hours',
      '/terms',
      '/privacy'
    ];
    return featurePaths.some(path => location.pathname === path);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleFeatures = () => {
    setIsFeaturesOpen(!isFeaturesOpen);
  };

  const handleDashboardClick = () => {
    // Redirect to login page when dashboard is clicked
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled || !isHomePage ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center cursor-pointer">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden ${
                isScrolled || !isHomePage ? 'bg-white' : 'bg-white bg-opacity-90'
              }`}>
                <img 
                  src={logo} 
                  alt="HealthPlus Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className={`ml-3 text-xl font-semibold hidden sm:block ${
                isScrolled || !isHomePage ? 'text-gray-800' : 'text-white'
              }`}>ClinicPro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`relative font-medium text-sm transition-colors duration-200 cursor-pointer ${
                isActive('/') ? (isScrolled || !isHomePage ? 'text-red-500' : 'text-white') : 
                (isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white text-opacity-80 hover:text-opacity-100')
              }`}
            >
              Home
              {(isActive('/') && (isScrolled || !isHomePage)) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
              )}
            </Link>
            <Link 
              to="/contact" 
              className={`relative font-medium text-sm transition-colors duration-200 cursor-pointer ${
                isActive('/contact') ? (isScrolled || !isHomePage ? 'text-red-500' : 'text-white') : 
                (isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white text-opacity-80 hover:text-opacity-100')
              }`}
            >
              Contact
              {(isActive('/contact') && (isScrolled || !isHomePage)) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
              )}
            </Link>
            <Link 
              to="/services" 
              className={`relative font-medium text-sm transition-colors duration-200 cursor-pointer ${
                isActive('/services') ? (isScrolled || !isHomePage ? 'text-red-500' : 'text-white') : 
                (isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white text-opacity-80 hover:text-opacity-100')
              }`}
            >
              Services
              {(isActive('/services') && (isScrolled || !isHomePage)) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
              )}
            </Link>
            <Link 
              to="/doctors" 
              className={`relative font-medium text-sm transition-colors duration-200 cursor-pointer ${
                isActive('/doctors') ? (isScrolled || !isHomePage ? 'text-red-500' : 'text-white') : 
                (isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white text-opacity-80 hover:text-opacity-100')
              }`}
            >
              Specialists
              {(isActive('/doctors') && (isScrolled || !isHomePage)) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
              )}
            </Link>
            <Link 
              to="/about" 
              className={`relative font-medium text-sm transition-colors duration-200 cursor-pointer ${
                isActive('/about') ? (isScrolled || !isHomePage ? 'text-red-500' : 'text-white') : 
                (isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white text-opacity-80 hover:text-opacity-100')
              }`}
            >
              About Us
              {(isActive('/about') && (isScrolled || !isHomePage)) && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
              )}
            </Link>

            {/* Features Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleFeatures}
                className={`relative font-medium text-sm transition-colors duration-200 flex items-center space-x-1 cursor-pointer ${
                  isFeaturesActive() ? (isScrolled || !isHomePage ? 'text-red-500' : 'text-white') : 
                  (isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white text-opacity-80 hover:text-opacity-100')
                }`}
              >
                <span>Support & Policies</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                {(isFeaturesActive() && (isScrolled || !isHomePage)) && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500"></span>
                )}
              </button>
              {isFeaturesOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <Link 
                    to="/working-hours" 
                    onClick={() => setIsFeaturesOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      isActive('/working-hours') ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                    }`}
                  >
                    Working Hours
                  </Link>
                  <Link 
                    to="/terms" 
                    onClick={() => setIsFeaturesOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      isActive('/terms') ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                    }`}
                  >
                    Terms of Service
                  </Link>
                  <Link 
                    to="/privacy" 
                    onClick={() => setIsFeaturesOpen(false)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer ${
                      isActive('/privacy') ? 'text-red-500' : 'text-gray-700 hover:text-red-500'
                    }`}
                  >
                    Privacy Policy
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Actions - Desktop */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <select className={`appearance-none bg-transparent border-0 text-sm font-medium focus:outline-none cursor-pointer pr-6 ${
                isScrolled || !isHomePage ? 'text-gray-800 hover:text-gray-700' : 'text-white hover:text-gray-200'
              }`}>
                <option>English</option>
                <option>Español</option>
                <option>Français</option>
              </select>
              <ChevronDown className={`absolute right-1 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none ${
                isScrolled || !isHomePage ? 'text-gray-400' : 'text-white text-opacity-80'
              }`} />
            </div>
            <button 
              onClick={handleDashboardClick}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 cursor-pointer ${
                isScrolled || !isHomePage ? 'bg-slate-700 hover:bg-slate-800 text-white' : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => handleNavigation('/book-appointment')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 cursor-pointer"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className={`focus:outline-none transition-colors duration-200 cursor-pointer ${
                isScrolled || !isHomePage ? 'text-gray-500 hover:text-red-500' : 'text-white hover:text-opacity-80'
              }`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 pt-2 pb-3 space-y-1">
            <Link 
              to="/" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                isActive('/') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                isActive('/contact') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              Contact
            </Link>
            <Link 
              to="/services" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                isActive('/services') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              Services
            </Link>
            <Link 
              to="/doctors" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                isActive('/doctors') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              Specialists
            </Link>
            <Link 
              to="/about" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className={`block px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                isActive('/about') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
              }`}
            >
              About Us
            </Link>
            
            {/* Mobile Features Dropdown */}
            <div className="pt-2">
              <button 
                onClick={toggleFeatures}
                className={`flex items-center justify-between w-full px-3 py-2 font-medium text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                  isFeaturesActive() ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                }`}
              >
                <span>Support & Policies</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              {isFeaturesOpen && (
                <div className="pl-4 mt-1 space-y-1">
                  <Link 
                    to="/working-hours" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsFeaturesOpen(false);
                    }}
                    className={`block px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                      isActive('/working-hours') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    Working Hours
                  </Link>
                  <Link 
                    to="/terms" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsFeaturesOpen(false);
                    }}
                    className={`block px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                      isActive('/terms') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    Terms
                  </Link>
                  <Link 
                    to="/privacy" 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsFeaturesOpen(false);
                    }}
                    className={`block px-3 py-2 text-sm rounded-md hover:bg-gray-50 cursor-pointer ${
                      isActive('/privacy') ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    Privacy
                  </Link>
                </div>
              )}
            </div>

            <div className="pt-3 space-y-2">
              <button 
                onClick={handleDashboardClick}
                className="w-full bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 cursor-pointer"
              >
                Login
              </button>
              <button 
                onClick={() => handleNavigation('/book-appointment')}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors duration-200 cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-blue-900 text-gray-300 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Unit Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">Unit</h3>
            <p className="text-gray-400">
              Combining years of experience and skills to deliver scalable healthcare solutions using modern technology.
            </p>
          </div>

          {/* Useful Links */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">Useful Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition">Services</Link></li>
              <li><Link to="/doctors" className="hover:text-white transition">Doctors</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">Contact Information</h3>
            <div className="space-y-2 text-gray-400">
              <p><span className="font-semibold text-white">Timings:</span><br />8:00 AM – 6:00 PM</p>
              <p><span className="font-semibold text-white">Address:</span><br />C-ZSD, Atlanta Shopping Mall,<br />Susham Chunk, MGM Yaroshita,<br />Surat, Gujarat 524101</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} All Rights Reserved by <span className="text-orange-500 font-semibold">ClinicPro</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

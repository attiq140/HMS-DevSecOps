import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Doctors from '../assets/Doctors.png';
import Doctor1 from '../assets/Doctor1.png';
import Doctor2 from '../assets/Doctor2.png';
import Doctor3 from '../assets/Doctor3.avif';
import Doctor4 from '../assets/Doctor4.avif';
import Doctor5 from '../assets/Doctor5.avif';

const Healthcare = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Memoize doctors data
  const doctors = useMemo(() => [
    {
      id: 1,
      name: "Dr. Harish Mohan",
      qualification: "MBBS, MD (Cardiology)",
      specialty: "Cardiologist",
      experience: "12 years",
      image: Doctor1,
      borderColor: "border-blue-100"
    },
    {
      id: 2,
      name: "Dr. Ali Sahil",
      qualification: "MBBS, MS (Orthopedics)",
      specialty: "Orthopedic Surgeon",
      experience: "8 years",
      image: Doctor2,
      borderColor: "border-red-100"
    },
    {
      id: 3,
      name: "Dr. Atendra Kumar",
      qualification: "MBBS, DNB (Neurology)",
      specialty: "Neurologist",
      experience: "10 years",
      image: Doctor3,
      borderColor: "border-green-100"
    },
    {
      id: 4,
      name: "Dr. Satyavati AL",
      qualification: "MD (Pediatrics)",
      specialty: "Pediatrician",
      experience: "15 years",
      image: Doctor4,
      borderColor: "border-orange-100"
    },
    {
      id: 5,
      name: "Dr. Priya Sharma",
      qualification: "MBBS, MS (Gynecology)",
      specialty: "Gynecologist",
      experience: "9 years",
      image: Doctor5,
      borderColor: "border-purple-100"
    },
    {
      id: 6,
      name: "Dr. Rajesh Patel",
      qualification: "MBBS, MD (Dermatology)",
      specialty: "Dermatologist",
      experience: "11 years",
      initials: "RP",
      borderColor: "border-teal-100",
      bgColor: "bg-teal-400"
    }
  ], []);

  const handleBookAppointment = (doctorId = null) => {
    if (doctorId) {
      navigate('/book-appointment', { state: { doctorId } });
    } else {
      navigate('/book-appointment');
    }
  };

  const getCurrentDoctors = () => {
    const start = currentSlide * 4;
    return doctors.slice(start, start + 4);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      {/* Quality Healthcare Section */}
      <div className="max-w-6xl mx-auto mb-20">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-red-500 text-sm font-medium mb-4">Quality Healthcare</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6 leading-tight">
              Have Certified and High Quality Doctor For You
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Our medical center provides comprehensive care with a team of board-certified physicians 
              and specialists. We combine advanced medical technology with personalized attention to 
              deliver exceptional healthcare services for you and your family.
            </p>
            <button 
              onClick={() => handleBookAppointment()}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Book Appointment
            </button>
          </motion.div>

          {/* Right Illustration */}
          <motion.div 
            className="lg:w-1/2 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img 
              src={Doctors} 
              alt="Quality Healthcare Illustration" 
              className="w-full h-auto lg:h-96 object-cover rounded-xl shadow-xl"
            />
            
            {/* Overlay Card */}
            <div className="absolute -bottom-6 left-6 bg-blue-900 text-white p-5 rounded-xl shadow-2xl max-w-xs">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg">★</span>
                </div>
                <div>
                  <span className="font-semibold text-sm">Certified Doctors</span>
                  <p className="text-xs text-gray-300 mt-1">
                    Board-certified specialists with extensive experience
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Professional Doctors Section */}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-red-500 text-sm font-medium mb-4">Professional Doctors</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 leading-tight mb-4">
            Meet Our Specialist Team
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our team of experienced healthcare professionals is dedicated to providing exceptional care
          </p>
        </div>

        {/* Doctors Carousel */}
        <div className="relative overflow-hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {getCurrentDoctors().map((doctor) => (
              <motion.div 
                key={doctor.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5 }}
              >
                <div className="p-6 text-center">
                  <div className="relative mb-6">
                    {doctor.image ? (
                      <img 
                        src={doctor.image}
                        alt={doctor.name}
                        className={`w-32 h-32 rounded-full mx-auto object-cover border-4 ${doctor.borderColor}`}
                      />
                    ) : (
                      <div className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center ${doctor.bgColor || 'bg-blue-500'} border-4 ${doctor.borderColor}`}>
                        <span className="text-white text-4xl font-bold">{doctor.initials}</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{doctor.name}</h3>
                  <p className="text-blue-600 font-medium text-sm mb-1">{doctor.specialty}</p>
                  <p className="text-gray-500 text-sm mb-3">{doctor.qualification}</p>
                  <p className="text-gray-400 text-xs mb-4">{doctor.experience} experience</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-16 space-x-4">
          {Array.from({ length: Math.ceil(doctors.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-12 h-2 rounded-full transition-colors cursor-pointer ${currentSlide === index ? 'bg-red-500' : 'bg-gray-300'}`}
              aria-label={`View doctors ${index * 4 + 1} to ${Math.min((index + 1) * 4, doctors.length)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Healthcare;
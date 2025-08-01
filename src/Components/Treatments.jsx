import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Rossy from '../assets/Rossy.png';
import Doctor3 from '../assets/Doctor3.avif';
import Nurse1 from '../assets/Nurse1.avif';
import Doctor4 from '../assets/Doctor4.avif';
import Doctor5 from '../assets/Doctor5.avif';

const Treatments = () => {
  // Diverse testimonial data
  const testimonials = [
    {
      id: 1,
      name: "Rossy",
      role: "Cardiac Patient",
      image: Rossy,
      type: "patient",
      quote: "The cardiac care I received was exceptional. The doctors were knowledgeable and the staff was very caring."
    },
    {
      id: 2,
      name: "Dr. Sharma",
      role: "Chief Cardiologist",
      image: Doctor3,
      type: "doctor",
      quote: "Our team is dedicated to providing the highest quality care. Seeing patients recover is our greatest reward."
    },
    {
      id: 3,
      name: "Nurse Priya",
      role: "Senior Nurse",
      image: Nurse1,
      type: "staff",
      quote: "Working here has been incredibly rewarding. We prioritize patient comfort and holistic healing."
    },
    {
      id: 4,
      name: "Michael",
      role: "Orthopedic Patient",
      image: Doctor4,
      type: "patient",
      quote: "After my knee replacement, the rehabilitation program got me back to hiking within 3 months!"
    },
    {
      id: 5,
      name: "Sarah",
      role: "New Mother",
      image: Doctor5,
      type: "patient",
      quote: "The maternity ward staff made my delivery experience calm and comfortable. Truly exceptional care."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]); // Reset interval when currentIndex changes

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToTestimonial = (index) => {
    setCurrentIndex(index);
  };

  // Get badge color based on testimonial type
  const getBadgeColor = (type) => {
    switch(type) {
      case 'doctor': return 'bg-blue-500';
      case 'staff': return 'bg-green-500';
      default: return 'bg-orange-500';
    }
  };

  return (
    <div className="bg-white py-16 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Section Title */}
        <p className="text-red-500 text-sm font-medium mb-2">Testimonials</p>
        <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-12">
          Voices From Our Healthcare Community
        </h2>

        {/* Testimonial Card */}
        <motion.div 
          key={testimonials[currentIndex].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg relative">
              <img
                src={testimonials[currentIndex].image}
                alt={`${testimonials[currentIndex].name} - ${testimonials[currentIndex].role}`}
                className="w-full h-full object-cover"
              />
              {/* Type badge */}
              <div className={`absolute -right-2 -bottom-2 ${getBadgeColor(testimonials[currentIndex].type)} text-white text-xs px-2 py-1 rounded-full`}>
                {testimonials[currentIndex].type.toUpperCase()}
              </div>
            </div>
            <div className="absolute -right-2 -top-2 bg-red-500 text-white text-2xl w-8 h-8 rounded-full flex items-center justify-center shadow-md">
              “
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold text-blue-900 mt-2">
              {testimonials[currentIndex].name}
            </h4>
            <p className="text-gray-500 text-sm">
              {testimonials[currentIndex].role}
            </p>
          </div>
          
          <p className="text-gray-600 max-w-xl italic">
            "{testimonials[currentIndex].quote}"
          </p>

          {/* Carousel Navigation */}
          <div className="flex items-center justify-center mt-6 w-full max-w-xs mx-auto">
            <button 
              onClick={prevTestimonial}
              className="w-10 h-10 rounded-full bg-red-500 cursor-pointer text-white hover:bg-red-600 transition flex items-center justify-center mr-auto"
              aria-label="Previous testimonial"
            >
              &larr;
            </button>
            
            <div className="flex space-x-2 mx-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors cursor-pointer ${currentIndex === index ? 'bg-red-500' : 'bg-red-200'}`}
                  aria-label={`View ${testimonials[index].type} testimonial from ${testimonials[index].name}`}
                />
              ))}
            </div>
            
            <button 
              onClick={nextTestimonial}
              className="w-10 h-10 rounded-full cursor-pointer bg-red-500 text-white hover:bg-red-600 transition flex items-center justify-center ml-auto"
              aria-label="Next testimonial"
            >
              &rarr;
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Treatments;
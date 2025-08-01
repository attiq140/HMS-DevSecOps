import React, { useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedCard = ({ children, direction, delay = 0 }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false // Triggers every time element comes into view
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const variants = {
    hidden: { 
      opacity: 0, 
      x: direction === 'left' ? -100 : 100,
      y: 20,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: delay,
        duration: 0.8
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      whileHover={{
        y: -10,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const cardData = [
    {
      id: 1,
      title: "Qualified Doctors",
      description: "Access to top medical specialists with verified credentials.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgColor: "bg-blue-50",
      borderColor: "border-blue-100",
      textColor: "text-blue-600",
      shadowColor: "rgba(59, 130, 246, 0.2)",
      direction: "left"
    },
    {
      id: 2,
      title: "Digital Consultation",
      description: "Secure video consultations from the comfort of your home.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      bgColor: "bg-purple-50",
      borderColor: "border-purple-100",
      textColor: "text-purple-600",
      shadowColor: "rgba(168, 85, 247, 0.2)",
      direction: "left"
    },
    {
      id: 3,
      title: "Personalized Care",
      description: "Treatment plans tailored to your unique health needs.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      bgColor: "bg-orange-50",
      borderColor: "border-orange-100",
      textColor: "text-orange-600",
      shadowColor: "rgba(249, 115, 22, 0.2)",
      direction: "right"
    },
    {
      id: 4,
      title: "Advanced Treatment",
      description: "Cutting-edge medical solutions for optimal recovery.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      bgColor: "bg-green-50",
      borderColor: "border-green-100",
      textColor: "text-green-600",
      shadowColor: "rgba(16, 185, 129, 0.2)",
      direction: "right"
    }
  ];

  return (
    <div className="bg-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto text-center">
        {/* Small heading */}
        <motion.p 
          className="text-blue-500 font-medium text-lg mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          4 Easy Steps to World-Class Healthcare
        </motion.p>
        
        {/* Main heading */}
        <motion.h1 
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Your Path to Better Health
        </motion.h1>
        
        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {cardData.map((card, index) => (
            <AnimatedCard 
              key={card.id} 
              direction={card.direction}
              delay={index * 0.1}
            >
              <div className={`${card.bgColor} p-8 rounded-xl border ${card.borderColor} shadow-sm transition-all h-full flex flex-col`}>
                <div className={`${card.bgColor.replace('50', '100')} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-5 mx-auto`}>
                  {card.icon}
                </div>
                <h3 className={`text-xl font-semibold ${card.textColor} mb-3`}>{card.title}</h3>
                <p className="text-gray-600 flex-grow">{card.description}</p>
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
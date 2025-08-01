import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Bone, Heart, Brain, Eye, Activity, Stethoscope } from 'lucide-react';

const services = [
  {
    title: "Cardiology",
    description: "Comprehensive diagnosis and treatment of heart disorders with advanced technology and compassionate care.",
    icon: <Heart className="w-8 h-8 text-rose-600 group-hover:text-rose-800 transition-all duration-300" />,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
    hoverBg: "bg-rose-100",
    iconBg: "bg-rose-100",
    circleColor: "bg-rose-200",
    delay: 0.1
  },
  {
    title: "Orthopedics",
    description: "Specialized care for your musculoskeletal system including bones, joints, ligaments, tendons, muscles and nerves.",
    icon: <Bone className="w-8 h-8 text-blue-600 group-hover:text-blue-800 transition-all duration-300" />,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    hoverBg: "bg-blue-100",
    iconBg: "bg-blue-100",
    circleColor: "bg-blue-200",
    delay: 0.2
  },
  {
    title: "Neurology",
    description: "Expert care for disorders of the nervous system including the brain, spinal cord, and peripheral nerves.",
    icon: <Brain className="w-8 h-8 text-violet-600 group-hover:text-violet-800 transition-all duration-300" />,
    bgColor: "bg-violet-50",
    borderColor: "border-violet-200",
    hoverBg: "bg-violet-100",
    iconBg: "bg-violet-100",
    circleColor: "bg-violet-200",
    delay: 0.3
  },
  {
    title: "Ophthalmology",
    description: "Comprehensive eye care including vision services and treatment for eye diseases and conditions.",
    icon: <Eye className="w-8 h-8 text-amber-600 group-hover:text-amber-800 transition-all duration-300" />,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    hoverBg: "bg-amber-100",
    iconBg: "bg-amber-100",
    circleColor: "bg-amber-200",
    delay: 0.4
  },
  {
    title: "Endocrinology",
    description: "Specialized care for hormonal imbalances and disorders of the endocrine system.",
    icon: <Activity className="w-8 h-8 text-emerald-600 group-hover:text-emerald-800 transition-all duration-300" />,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    hoverBg: "bg-emerald-100",
    iconBg: "bg-emerald-100",
    circleColor: "bg-emerald-200",
    delay: 0.5
  },
  {
    title: "General Medicine",
    description: "Primary care for adults focusing on prevention, diagnosis, and treatment of a wide range of conditions.",
    icon: <Stethoscope className="w-8 h-8 text-teal-600 group-hover:text-teal-800 transition-all duration-300" />,
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    hoverBg: "bg-teal-100",
    iconBg: "bg-teal-100",
    circleColor: "bg-teal-200",
    delay: 0.6
  },
];

const ServiceCard = ({ service, index }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
        delay: service.delay
      }
    },
    hover: {
      y: -8,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  const iconContainerVariants = {
    hover: {
      scale: 1.1,
      rotate: [0, -5, 5, 0],
      backgroundColor: "rgba(255,255,255,0.5)",
      transition: {
        duration: 0.6
      }
    }
  };

  const circleVariants = {
    hover: {
      scale: 1.5,
      opacity: 0.3,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={cardVariants}
      whileHover="hover"
      className={`group relative ${service.bgColor} border ${service.borderColor} rounded-xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:${service.hoverBg}`}
    >
      {/* Icon Container */}
      <motion.div 
        variants={iconContainerVariants}
        className={`inline-flex items-center justify-center w-16 h-16 ${service.iconBg} rounded-xl mb-6 transition-all duration-500 group-hover:bg-white/50`}
      >
        {service.icon}
      </motion.div>
      
      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        {service.title}
      </h3>
      
      <p className="text-gray-700">
        {service.description}
      </p>
      
      {/* Decorative Element */}
      <motion.div 
        variants={circleVariants}
        className={`absolute -bottom-2 -right-2 w-16 h-16 ${service.circleColor} rounded-full opacity-20 group-hover:opacity-30 transition-all duration-500`}
      />
    </motion.div>
  );
};

const OurServices = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.05,
    triggerOnce: true
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
      }
    }
  };

  return (
    <section className="py-16 px-4 bg-gray-50" id="services">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.header 
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={headerVariants}
          className="text-center mb-16"
        >
          <p className="text-rose-500 text-sm font-medium tracking-wide uppercase mb-2">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            We Offer Different Services To <br /> Improve Your Health
          </h2>
        </motion.header>
        
        {/* Services Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default OurServices;
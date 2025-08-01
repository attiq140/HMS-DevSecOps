import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FaClinicMedical, FaCalendarAlt, FaUserInjured, FaFileInvoiceDollar, 
  FaCloud, FaChartLine, FaShieldAlt, FaGlobe, FaUserMd, 
  FaFlask, FaUserNurse, FaQuoteLeft, FaArrowRight 
} from 'react-icons/fa';

// Enhanced Counter component with dynamic effects
const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) {
        clearInterval(timer);
        controls.start({
          scale: [1, 1.1, 1],
          transition: { duration: 0.5 }
        });
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration, controls]);

  return (
    <motion.span 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.span animate={controls}>
        {count}
      </motion.span>
    </motion.span>
  );
};

const Aboutus = () => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [activeTimeline, setActiveTimeline] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Data for different sections
  const timeline = [
    { year: "2015", title: "Founded", description: "ClinicPro was established with a vision to revolutionize healthcare management." },
    { year: "2017", title: "First Major Client", description: "Partnered with City General Hospital to implement our system." },
    { year: "2019", title: "Cloud Launch", description: "Launched our cloud-based solution for remote access." },
    { year: "2021", title: "International Expansion", description: "Expanded services to 5 new countries." },
    { year: "2023", title: "AI Integration", description: "Implemented AI-powered analytics and diagnostics." }
  ];

  const servedGroups = [
    { icon: <FaUserMd className="text-red-500 text-3xl" />, title: "Doctors", description: "Simplify patient management" },
    { icon: <FaClinicMedical className="text-red-600 text-3xl" />, title: "Clinics", description: "Streamline operations" },
    { icon: <FaFlask className="text-red-700 text-3xl" />, title: "Labs", description: "Integrate test results" },
    { icon: <FaUserNurse className="text-red-800 text-3xl" />, title: "Staff", description: "Improve workflows" }
  ];

  const differentiators = [
    { icon: <FaShieldAlt className="text-red-400" />, title: "Military-grade Security", description: "HIPAA compliant with end-to-end encryption" },
    { icon: <FaCloud className="text-red-500" />, title: "Cloud-native", description: "Access from anywhere, anytime" },
    { icon: <FaChartLine className="text-red-600" />, title: "Smart Analytics", description: "AI-powered insights for better decisions" },
    { icon: <FaUserInjured className="text-red-700" />, title: "Patient-centric", description: "Designed around patient experience" },
    { icon: <FaFileInvoiceDollar className="text-red-800" />, title: "Cost-effective", description: "Reduce operational costs by 30%" },
    { icon: <FaCalendarAlt className="text-red-900" />, title: "24/7 Support", description: "Dedicated support team always available" }
  ];

  const countries = ["USA", "UK", "Canada", "Australia", "India", "UAE", "Germany", "Singapore"];

  const securityFeatures = [
    "End-to-end encryption", "HIPAA Compliance", "Regular Security Audits", 
    "Two-factor Authentication", "Role-based Access Control", "Data Backup & Recovery"
  ];

  const testimonials = [
    { quote: "ClinicPro reduced our admin work by 40%, allowing more time for patient care.", author: "Dr. Sarah Johnson, Boston" },
    { quote: "The analytics dashboard helped us identify inefficiencies we didn't know existed.", author: "Nurse Manager, Toronto" },
    { quote: "Implementation was seamless and the support team is exceptional.", author: "Clinic Director, London" }
  ];

  const team = [
    { name: "Dr. Michael Chen", role: "CEO & Founder", img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya Patel", role: "CTO", img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "James Wilson", role: "Head of Product", img: "https://randomuser.me/api/portraits/men/22.jpg" },
    { name: "Maria Garcia", role: "Customer Success", img: "https://randomuser.me/api/portraits/women/63.jpg" }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Blurred Background */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center filter blur-sm opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Section */}
        <motion.div 
          ref={ref}
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Column */}
            <motion.div
              className="h-full min-h-[400px] bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-8"
              initial={{ x: -50, opacity: 0 }}
              animate={inView ? { 
                x: 0, 
                opacity: 1,
                transition: { 
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }
              } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.img 
                src="https://img.freepik.com/free-vector/medical-team-concept-illustration_114360-6683.jpg" 
                alt="ClinicPro Dashboard" 
                className="w-full h-full object-contain"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>

            {/* Content Column */}
            <motion.div 
              className="p-8 sm:p-12"
              initial={{ x: 50, opacity: 0 }}
              animate={inView ? { 
                x: 0, 
                opacity: 1,
                transition: {
                  type: "spring",
                  stiffness: 100,
                  damping: 10
                }
              } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="flex items-center mb-6">
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 1, repeat: Infinity, repeatDelay: 3 }
                  }}
                >
                  <FaClinicMedical className="text-4xl text-red-600 mr-4" />
                </motion.div>
                <motion.h2 
                  className="text-3xl sm:text-4xl font-bold text-gray-800"
                  initial={{ opacity: 0 }}
                  animate={inView ? { 
                    opacity: 1,
                    transition: { delay: 0.6 }
                  } : {}}
                >
                  About ClinicPro
                </motion.h2>
              </div>
              
              <motion.p 
                className="text-gray-600 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={inView ? { 
                  opacity: 1,
                  transition: { delay: 0.8 }
                } : {}}
              >
                ClinicPro is a comprehensive Hospital Management System designed to streamline healthcare operations. 
                Our platform integrates all aspects of clinic management into one intuitive solution, enhancing 
                efficiency, patient care, and financial performance for medical practices of all sizes.
              </motion.p>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Key Features</h3>
                <motion.ul 
                  className="space-y-3"
                  variants={container}
                  initial="hidden"
                  animate={inView ? "visible" : {}}
                >
                  {differentiators.slice(0, 5).map((feature, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-start"
                      variants={item}
                      whileHover={{ x: 5 }}
                    >
                      <motion.span 
                        className="mr-3 mt-1"
                        whileHover={{ scale: 1.2 }}
                      >
                        {feature.icon}
                      </motion.span>
                      <span className="text-gray-700">{feature.title}: {feature.description}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>
              
              <motion.div
                className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border border-red-200"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 1.2 }
                } : {}}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Our Vision</h4>
                <p className="text-gray-600">
                  "To revolutionize healthcare management through technology that empowers medical professionals 
                  to deliver exceptional patient care while optimizing operational efficiency."
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Our Story Timeline */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { 
            opacity: 1, 
            y: 0,
            transition: { 
              type: "spring",
              stiffness: 100
            }
          } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { delay: 0.2 }
            } : {}}
          >
            Our Story
          </motion.h2>
          <div className="relative">
            <motion.div 
              className="absolute left-4 sm:left-1/2 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"
              initial={{ scaleY: 0 }}
              animate={inView ? { 
                scaleY: 1,
                transition: { duration: 1 }
              } : {}}
            />
            {timeline.map((item, index) => (
              <motion.div 
                key={index}
                className={`relative mb-8 ${index % 2 === 0 ? 'sm:pr-8 sm:text-right' : 'sm:pl-8 sm:text-left'} sm:w-1/2 sm:mx-auto ${index % 2 === 0 ? 'sm:mr-auto' : 'sm:ml-auto'}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={inView ? { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    delay: index * 0.2,
                    type: "spring",
                    stiffness: 100
                  }
                } : {}}
              >
                <motion.div 
                  className={`p-6 rounded-lg shadow-md cursor-pointer transition-all duration-300 ${activeTimeline === index ? 'bg-red-50 border-l-4 border-red-500' : 'bg-white'}`}
                  onClick={() => setActiveTimeline(index)}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)"
                  }}
                >
                  <motion.div 
                    className="absolute -left-4 sm:left-0 sm:right-0 w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white font-bold transform -translate-x-1/2 sm:translate-x-0 sm:mx-auto"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item.year}
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Who We Serve */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { 
            opacity: 1,
            transition: { 
              delay: 0.3 
            }
          } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { 
              opacity: 1, 
              y: 0,
              transition: { delay: 0.5 }
            } : {}}
          >
            Who We Serve
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : {}}
          >
            {servedGroups.map((group, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
                variants={item}
                whileHover={{ 
                  y: -10,
                  scale: 1.03,
                  backgroundColor: "rgba(254, 226, 226, 0.5)"
                }}
              >
                <motion.div 
                  className="flex justify-center mb-4"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {group.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{group.title}</h3>
                <p className="text-gray-600">{group.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* What Makes Us Different */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { delay: 0.2 }
            } : {}}
          >
            What Makes Us Different
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : {}}
          >
            {differentiators.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-100 hover:border-red-200 transition-all"
                variants={item}
                whileHover={{ 
                  scale: 1.05,
                  borderColor: "#ef4444",
                  boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)"
                }}
              >
                <div className="flex items-center mb-4">
                  <motion.div 
                    className="mr-4 text-2xl"
                    whileHover={{ scale: 1.2 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                </div>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Global Presence */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { delay: 0.2 }
            } : {}}
          >
            Global Presence
          </motion.h2>
          <div className="flex flex-col lg:flex-row gap-12 items-center">
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              animate={inView ? { 
                opacity: 1, 
                x: 0,
                transition: { 
                  type: "spring",
                  stiffness: 100
                }
              } : {}}
            >
              <motion.div
                className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-8 h-full flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  animate={{
                    rotate: 360,
                    transition: { 
                      duration: 30,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  <FaGlobe className="text-8xl text-red-400 opacity-30" />
                </motion.div>
                <div className="absolute text-center">
                  <span className="text-4xl font-bold text-red-600">
                    <Counter value={8} duration={2} />
                  </span>
                  <p className="text-gray-600 mt-2">Countries</p>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="w-full lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { 
                opacity: 1, 
                x: 0,
                transition: { 
                  type: "spring",
                  stiffness: 100,
                  delay: 0.3
                }
              } : {}}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">We operate in:</h3>
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={container}
                initial="hidden"
                animate={inView ? "visible" : {}}
              >
                {countries.map((country, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center"
                    variants={item}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-2 h-2 rounded-full bg-red-500 mr-3"
                      whileHover={{ scale: 1.5 }}
                    />
                    <span className="text-gray-700">{country}</span>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="mt-8 bg-red-50 p-4 rounded-lg"
                initial={{ opacity: 0 }}
                animate={inView ? { 
                  opacity: 1,
                  transition: { delay: 0.8 }
                } : {}}
                whileHover={{ scale: 1.01 }}
              >
                <p className="text-red-700">
                  <span className="font-bold">New in 2024:</span> Expanding to 3 more countries in Q3
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Data Privacy & Security */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="w-full md:w-1/3 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={inView ? { 
                opacity: 1, 
                scale: 1,
                transition: { 
                  type: "spring",
                  stiffness: 100
                }
              } : {}}
            >
              <motion.div 
                className="bg-red-100 p-8 rounded-full"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 2, repeat: Infinity }
                  }}
                >
                  <FaShieldAlt className="text-6xl text-red-600" />
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="w-full md:w-2/3"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { 
                opacity: 1, 
                x: 0,
                transition: { 
                  type: "spring",
                  stiffness: 100,
                  delay: 0.3
                }
              } : {}}
            >
              <motion.h2 
                className="text-3xl font-bold text-gray-800 mb-6"
                initial={{ opacity: 0 }}
                animate={inView ? { 
                  opacity: 1,
                  transition: { delay: 0.5 }
                } : {}}
              >
                Data Privacy & Security
              </motion.h2>
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0 }}
                animate={inView ? { 
                  opacity: 1,
                  transition: { delay: 0.7 }
                } : {}}
              >
                We take the security of your patient data extremely seriously. Our platform is built with multiple layers of protection to ensure compliance with global healthcare regulations.
              </motion.p>
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                variants={container}
                initial="hidden"
                animate={inView ? "visible" : {}}
              >
                {securityFeatures.map((feature, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    variants={item}
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="mr-3 mt-1 text-red-500"
                      whileHover={{ scale: 1.3 }}
                    >
                      <FaShieldAlt />
                    </motion.div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Our Growth in Numbers */}
        <motion.section 
          className="bg-gradient-to-r from-red-600 to-red-800 rounded-xl shadow-xl p-8 sm:p-12 text-white"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { delay: 0.2 }
            } : {}}
          >
            Our Growth in Numbers
          </motion.h2>
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : {}}
          >
            <motion.div 
              className="text-center"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold mb-2">
                <Counter value={1250} duration={3} />
              </div>
              <p className="text-red-100">Healthcare Providers</p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold mb-2">
                <Counter value={850000} duration={3} />
              </div>
              <p className="text-red-100">Patient Records</p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold mb-2">
                <Counter value={8} duration={2} />
              </div>
              <p className="text-red-100">Countries</p>
            </motion.div>
            <motion.div 
              className="text-center"
              variants={item}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl font-bold mb-2">
                <Counter value={99} duration={2} />
              </div>
              <p className="text-red-100">% Uptime</p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Testimonials */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { delay: 0.2 }
            } : {}}
          >
            What Our Users Say
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : {}}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
                variants={item}
                whileHover={{ 
                  y: -5,
                  borderColor: "#ef4444"
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    transition: { duration: 2, repeat: Infinity, repeatDelay: 5 }
                  }}
                >
                  <FaQuoteLeft className="text-gray-300 text-2xl mb-4" />
                </motion.div>
                <p className="text-gray-700 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-500 font-medium">— {testimonial.author}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Meet the Team */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-3xl font-bold text-gray-800 mb-12 text-center"
            initial={{ opacity: 0 }}
            animate={inView ? { 
              opacity: 1,
              transition: { delay: 0.2 }
            } : {}}
          >
            Meet the Team
          </motion.h2>
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={container}
            initial="hidden"
            animate={inView ? "visible" : {}}
          >
            {team.map((member, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow text-center"
                variants={item}
                whileHover={{ 
                  y: -10,
                  boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.3)"
                }}
              >
                <motion.div 
                  className="h-48 bg-gray-100 overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Mission & Vision */}
        <motion.section 
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-xl p-8 sm:p-12"
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { 
              opacity: 1, 
              x: 0,
              transition: { 
                type: "spring",
                stiffness: 100
              }
            } : {}}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.3)"
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h2>
            <p className="text-gray-700 mb-6">
              "To transform healthcare delivery through innovative technology solutions that empower medical professionals and improve patient outcomes worldwide."
            </p>
            <motion.div 
              className="flex items-center text-red-600 font-medium"
              whileHover={{ x: 5 }}
            >
              <span>Learn how we achieve this</span>
              <motion.div
                animate={{
                  x: [0, 5, 0],
                  transition: { duration: 1, repeat: Infinity }
                }}
              >
                <FaArrowRight className="ml-2" />
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div
            className="bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-xl p-8 sm:p-12"
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { 
              opacity: 1, 
              x: 0,
              transition: { 
                type: "spring",
                stiffness: 100,
                delay: 0.2
              }
            } : {}}
            whileHover={{ 
              y: -5,
              boxShadow: "0 20px 25px -5px rgba(239, 68, 68, 0.3)"
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Vision</h2>
            <p className="text-gray-700 mb-6">
              "To be the global leader in healthcare management systems, setting the standard for innovation, security, and user experience in medical technology."
            </p>
            <motion.div 
              className="flex items-center text-red-700 font-medium"
              whileHover={{ x: 5 }}
            >
              <span>See our roadmap</span>
              <motion.div
                animate={{
                  x: [0, 5, 0],
                  transition: { duration: 1, repeat: Infinity, delay: 0.5 }
                }}
              >
                <FaArrowRight className="ml-2" />
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Partner With Us */}
        <motion.section 
          className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-xl p-8 sm:p-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-4"
              initial={{ opacity: 0 }}
              animate={inView ? { 
                opacity: 1,
                transition: { delay: 0.2 }
              } : {}}
            >
              Partner With Us
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={inView ? { 
                opacity: 1,
                transition: { delay: 0.4 }
              } : {}}
            >
              Join our network of healthcare innovators. Whether you're a hospital, clinic, or healthcare provider, we have solutions tailored to your needs.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={inView ? { 
                opacity: 1,
                transition: { delay: 0.6 }
              } : {}}
            >
              <motion.button
                className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-md"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.5)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Get a Free Demo
              </motion.button>
              <motion.button
                className="bg-white border border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 font-medium py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-md"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 15px -3px rgba(239, 68, 68, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Us
              </motion.button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Aboutus;
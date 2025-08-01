import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, User, Mail, MessageSquare, Globe, Calendar, Users } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import contactImage from '../assets/Contact.png';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      toast.error('Please accept the Terms of Service', {
        position: "top-right",
        autoClose: 3000,
        theme: "colored"
      });
      return;
    }
    
    console.log('Form submitted:', formData);
    
    toast.success('Thank you for your message! We will get back to you soon.', {
      position: "top-center",
      autoClose: 5000,
      theme: "colored"
    });
    
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    setAcceptTerms(false);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const iconVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 260, damping: 20 }
    }
  };

  const contactMethods = [
    {
      id: 1,
      title: "Call Us",
      description: 'Reach our support team directly',
      icon: <Phone className="text-red-500 text-3xl" />,
      iconBg: 'bg-red-100',
      details: [
        { icon: <Phone className="w-4 h-4 text-red-500" />, text: '1 (234) 567-891' },
        { icon: <Phone className="w-4 h-4 text-red-500" />, text: '1 (234) 987-654' },
        { icon: <Clock className="w-4 h-4 text-red-500" />, text: '24/7 Support' },
        { icon: <Globe className="w-4 h-4 text-red-500" />, text: 'Live Chat' }
      ]
    },
    {
      id: 2,
      title: "Visit Us",
      description: 'Find our hospital location',
      icon: <MapPin className="text-blue-500 text-3xl" />,
      iconBg: 'bg-blue-100',
      details: [
        { icon: <MapPin className="w-4 h-4 text-blue-500" />, text: '121 Rock Street, 21 Avenue' },
        { icon: <MapPin className="w-4 h-4 text-blue-500" />, text: 'New York, NY 92103-9000' },
        { icon: <Globe className="w-4 h-4 text-blue-500" />, text: 'View on Google Maps' }
      ]
    },
    {
      id: 3,
      title: "Hours",
      description: 'Our operating hours',
      icon: <Clock className="text-green-500 text-3xl" />,
      iconBg: 'bg-green-100',
      details: [
        { icon: <Clock className="w-4 h-4 text-green-500" />, text: 'Mon - Fri: 11 AM - 8 PM' },
        { icon: <Clock className="w-4 h-4 text-green-500" />, text: 'Sat - Sun: 6 AM - 8 PM' },
        { icon: <Calendar className="w-4 h-4 text-green-500" />, text: 'Book Appointment' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div 
        className="max-w-7xl mx-auto text-center mb-16"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span
          className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          Contact & Support
        </motion.span>
        <motion.h1 
          className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Get in <span className="text-red-600">Touch</span>
        </motion.h1>
        <motion.p 
          className="max-w-3xl mx-auto text-xl text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Reach out to us for inquiries, appointments, or any assistance you may need
        </motion.p>
      </motion.div>

      {/* Contact Methods Grid */}
      <motion.div 
        className="max-w-7xl mx-auto mb-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {contactMethods.map((method) => (
            <motion.div
              key={method.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-48 w-full flex items-center justify-center relative">
                <div className={`absolute inset-0 ${method.iconBg} opacity-30`}></div>
                <div className="relative z-10 text-center p-6">
                  <motion.div 
                    className={`${method.iconBg} rounded-full p-4 inline-flex items-center justify-center mb-4`}
                    variants={iconVariants}
                  >
                    {method.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{method.title}</h3>
                  <p className="text-gray-600">{method.description}</p>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <ul className="space-y-3 flex-grow">
                  {method.details.map((detail, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-start gap-3"
                      variants={itemVariants}
                    >
                      <motion.span 
                        className="mt-0.5"
                        whileHover={{ scale: 1.2 }}
                      >
                        {detail.icon}
                      </motion.span>
                      <span className="text-gray-600">{detail.text}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Contact Form Section with Image */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Image Section - Slides in from left */}
          <motion.div 
            className="lg:w-1/2"
            variants={imageVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full"
              whileHover={{ scale: 1.01 }}
            >
              <div className="h-full w-full overflow-hidden relative">
                <LazyLoadImage
                  src={contactImage}
                  alt="Contact our hospital"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  effect="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-6 left-6">
                  <h3 className="text-white text-2xl font-bold">We're Here to Help</h3>
                  <p className="text-white/90">Contact our team for any questions</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Form Section - Slides in from right */}
          <motion.div 
            className="lg:w-1/2"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 h-full"
              whileHover={{ scale: 1.01 }}
            >
              <div className="p-8">
                <motion.h2 
                  className="text-3xl font-bold text-gray-800 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Send us a message
                </motion.h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <User className="w-5 h-5 text-red-500" />
                      </motion.div>
                      <label className="text-gray-700 font-medium">Name</label>
                    </div>
                    <motion.input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                      required
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Mail className="w-5 h-5 text-red-500" />
                      </motion.div>
                      <label className="text-gray-700 font-medium">Email</label>
                    </div>
                    <motion.input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all duration-200"
                      required
                      whileFocus={{ scale: 1.01 }}
                    />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        whileHover={{ rotate: 10 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MessageSquare className="w-5 h-5 text-red-500" />
                      </motion.div>
                      <label className="text-gray-700 font-medium">Message</label>
                    </div>
                    <motion.textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Your message"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none transition-all duration-200"
                      required
                      whileFocus={{ scale: 1.01 }}
                    ></motion.textarea>
                  </motion.div>
                  
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <motion.input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 text-red-500 border-gray-200 rounded focus:ring-red-500"
                      required
                      whileHover={{ scale: 1.1 }}
                    />
                    <label htmlFor="terms" className="text-gray-600 text-sm">
                      I accept the <span className="text-red-500 underline cursor-pointer">Terms of Service</span>
                    </label>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <motion.button
                      type="submit"
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <motion.span
                        animate={{
                          x: [0, 5, 0],
                          transition: { repeat: Infinity, duration: 2 }
                        }}
                      >
                        <Send className="w-5 h-5 text-white" />
                      </motion.span>
                      Send Message
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
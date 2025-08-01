import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaClock, FaFileContract, FaShieldAlt, FaPhoneAlt, FaEnvelope, FaUserMd, FaArrowRight } from 'react-icons/fa';

const SupportandPolicies = ({ section }) => {
  const navigate = useNavigate();

  // Define policy sections
  const policySections = [
    {
      id: 'working-hours',
      title: 'Working Hours',
      description: 'Our hospital operating hours and emergency services',
      detailedDescription: 'Discover our hospital\'s operating hours and emergency service availability to plan your visit accordingly.',
      icon: <FaClock className="text-red-500 text-3xl" />,
      iconColor: 'bg-red-100',
      content: (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">General Operating Hours</h3>
              <ul className="text-gray-600 space-y-2">
                <li><strong>Monday - Friday:</strong> 8:00 AM - 8:00 PM</li>
                <li><strong>Saturday:</strong> 9:00 AM - 5:00 PM</li>
                <li><strong>Sunday:</strong> 10:00 AM - 4:00 PM</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Emergency Services</h3>
              <ul className="text-gray-600 space-y-2">
                <li><strong>24/7 Availability:</strong> Open 24 hours for emergencies</li>
                <li><strong>Contact:</strong> <a href="tel:+1234567890" className="text-red-600 hover:underline">+1 (234) 567-890</a></li>
                <li><strong>Ambulance:</strong> Immediate dispatch available</li>
              </ul>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Outpatient Clinics</h3>
            <p className="text-gray-600">
              Specialty clinics (e.g., Cardiology, Neurology) operate by appointment. Please contact us to schedule.
            </p>
          </div>
        </>
      )
    },
    {
      id: 'terms-of-service',
      title: 'Terms of Service',
      description: 'Understand the terms governing your use of our healthcare services',
      detailedDescription: 'By using our services, you agree to the following terms, designed to ensure a safe and effective healthcare experience.',
      icon: <FaFileContract className="text-blue-500 text-3xl" />,
      iconColor: 'bg-blue-100',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Patient Responsibilities</h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>Provide accurate medical history and personal information</li>
              <li>Follow prescribed treatment plans and medical advice</li>
              <li>Respect hospital staff, patients, and property</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Appointment Policies</h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>Appointments must be canceled or rescheduled 24 hours in advance</li>
              <li>Late arrivals may require rescheduling</li>
              <li>Emergency cases take precedence over scheduled appointments</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payment Terms</h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>Payment is due at the time of service unless covered by insurance</li>
              <li>We accept major insurance plans; verify coverage prior to visits</li>
              <li>Non-covered services are the patient's responsibility</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'privacy-policies',
      title: 'Privacy Policies',
      description: 'Learn how we protect your personal and health information',
      detailedDescription: 'We are committed to protecting your personal and health information in compliance with HIPAA and other applicable regulations.',
      icon: <FaShieldAlt className="text-green-500 text-3xl" />,
      iconColor: 'bg-green-100',
      content: (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Data Collection</h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>We collect personal details and medical history for treatment purposes</li>
              <li>Billing information is collected for payment processing</li>
              <li>Data is stored securely in our electronic health record (EHR) system</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Your Rights</h3>
            <ul className="text-gray-600 list-disc pl-5 space-y-2">
              <li>Access and request copies of your medical records</li>
              <li>Request corrections to inaccurate information</li>
              <li>Opt out of communications or restrict data sharing</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  // Filter sections if a specific one is requested
  const sectionsToShow = section 
    ? policySections.filter(sec => sec.id === section || sec.id.includes(section))
    : policySections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Support & Policies
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          {section ? sectionsToShow[0].title : 'Hospital'} <span className="text-red-600">Policies</span>
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600">
          {section ? sectionsToShow[0].detailedDescription : 'Important information about our hospital policies, terms of service, and privacy practices'}
        </p>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto">
        {section ? (
          // Single section view
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className={`h-24 ${sectionsToShow[0].iconColor} flex items-center px-8`}>
              <div className="bg-white rounded-full p-3 shadow-md mr-4">
                {sectionsToShow[0].icon}
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                {sectionsToShow[0].title}
              </h2>
            </div>
            <div className="p-8">
              {sectionsToShow[0].content}
            </div>
          </div>
        ) : (
          // Grid view for all sections
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectionsToShow.map((policy) => (
              <motion.div
                key={policy.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
              >
                <div className={`h-24 ${policy.iconColor} flex items-center px-6`}>
                  <div className="bg-white rounded-full p-3 shadow-md mr-4">
                    {policy.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{policy.title}</h3>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-600 mb-6 flex-grow">{policy.description}</p>
                  <button
                    onClick={() => navigate(`/support/${policy.id}`)}
                    className="flex items-center justify-between text-white bg-red-600 font-medium py-3 px-4 rounded-lg transition-all duration-300 hover:bg-red-700 w-full"
                  >
                    <span>Learn More</span>
                    <FaArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* CTA Section */}
        {!section && (
          <div className="mt-16 bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-8 text-white shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Need Help or Have Questions?</h2>
              <p className="text-xl mb-6">
                Our support team is available to assist you with any questions about our policies or services.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/contact')}
                  className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <FaEnvelope className="mr-2" /> Contact Support
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/appointment')}
                  className="bg-white text-red-600 font-bold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center"
                >
                  <FaUserMd className="mr-2" /> Book Appointment
                </motion.button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportandPolicies;
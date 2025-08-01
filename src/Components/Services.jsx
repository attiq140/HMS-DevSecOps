import React, { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaHeartbeat, FaBrain, FaBone, FaChild, FaFlask, FaAllergies,
  FaXRay, FaStethoscope, FaArrowRight, FaClock, FaUserMd,
  FaProcedures, FaAmbulance, FaTimes, FaPhone, FaMapMarkerAlt,
  FaUser, FaNotesMedical
} from 'react-icons/fa';

// Import your medical specialty images
import cardiology from '../assets/cardiology.png';
import Medicine from '../assets/Medicine.png';
import neurology from '../assets/neurology.jpeg';
import orthopedics from '../assets/orthopedics.png';
import pediatrics from '../assets/pediatrics.jpg';
import oncology from '../assets/oncology.jpg';
import dermatology from '../assets/dermatology.jpg';
import radiology from '../assets/radiology.jpg';

const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showEmergencyForm, setShowEmergencyForm] = useState(false);
  const [emergencyFormData, setEmergencyFormData] = useState({
    name: '',
    phone: '',
    location: '',
    condition: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Medical services data
  const services = [
    {
      title: 'Cardiology',
      description: 'Diagnosis and treatment of heart disorders and cardiovascular problems.',
      detailedDescription: 'Our cardiology department offers comprehensive heart care including diagnostic tests (ECG, echocardiography, stress tests), interventional procedures (angioplasty, stenting), and cardiac rehabilitation programs. Our team of board-certified cardiologists provides personalized treatment plans for conditions like coronary artery disease, arrhythmias, and heart failure.',
      image: cardiology,
      altText: 'Advanced cardiology diagnostic equipment',
      icon: <FaHeartbeat className="text-red-500 text-3xl" />
    },
    {
      title: 'Internal Medicine',
      description: 'Professional medical consultations, prescriptions, and continuous health management.',
      detailedDescription: 'Our general medicine specialists provide comprehensive adult healthcare services including preventive care, chronic disease management, and acute illness treatment. We offer complete physical examinations, health screenings, vaccinations, and personalized treatment plans for conditions like diabetes, hypertension, and respiratory disorders.',
      image: Medicine,
      altText: 'Medical consultation session',
      icon: <FaStethoscope className="text-blue-500 text-3xl" />
    },
    {
      title: 'Neurology',
      description: 'Specialized care for disorders of the brain, spine, and nervous system.',
      detailedDescription: 'Our neurology department specializes in treating complex neurological conditions including stroke, epilepsy, multiple sclerosis, Parkinson\'s disease, and migraines. We offer advanced diagnostic services (EEG, EMG, nerve conduction studies) and treatments like botulinum toxin therapy for movement disorders and infusion therapies for MS.',
      image: neurology,
      altText: 'Neurological diagnostic imaging',
      icon: <FaBrain className="text-purple-500 text-3xl" />
    },
    {
      title: 'Orthopedics',
      description: 'Treatment of musculoskeletal issues, including bones, joints, and muscles.',
      detailedDescription: 'Our orthopedic specialists provide comprehensive care for musculoskeletal conditions including arthritis, sports injuries, fractures, and spinal disorders. Services include joint replacement surgery, arthroscopic procedures, fracture management, and non-surgical treatments like physical therapy and injection therapies.',
      image: orthopedics,
      altText: 'Orthopedic surgery tools',
      icon: <FaBone className="text-green-500 text-3xl" />
    },
    {
      title: 'Pediatrics',
      description: 'Comprehensive healthcare for infants, children, and adolescents.',
      detailedDescription: 'Our pediatric department provides compassionate care for children from birth through adolescence. Services include well-child visits, immunizations, developmental screenings, acute illness care, and management of chronic conditions like asthma and allergies. We also offer specialized adolescent medicine services.',
      image: pediatrics,
      altText: 'Pediatric examination room',
      icon: <FaChild className="text-yellow-500 text-3xl" />
    },
    {
      title: 'Oncology',
      description: 'Advanced cancer diagnosis, treatment, and supportive care.',
      detailedDescription: 'Our cancer center provides comprehensive oncology services including chemotherapy, radiation therapy, immunotherapy, and targeted therapies. We offer multidisciplinary tumor boards, genetic counseling, clinical trials, and supportive care services like pain management and nutritional counseling.',
      image: oncology,
      altText: 'Oncology treatment equipment',
      icon: <FaFlask className="text-indigo-500 text-3xl" />
    },
    {
      title: 'Dermatology',
      description: 'Expert care for skin, hair, and nail conditions.',
      detailedDescription: 'Our dermatology services include medical, surgical, and cosmetic treatments for skin conditions. We specialize in skin cancer screening and treatment, acne therapy, psoriasis management, cosmetic procedures (Botox, fillers), and advanced treatments for complex dermatological conditions.',
      image: dermatology,
      altText: 'Dermatological examination tools',
      icon: <FaAllergies className="text-pink-500 text-3xl" />
    },
    {
      title: 'Radiology',
      description: 'State-of-the-art imaging for accurate diagnosis and treatment planning.',
      detailedDescription: 'Our radiology department offers advanced imaging services including X-ray, ultrasound, CT scans, MRI, mammography, and interventional radiology procedures. Our board-certified radiologists use the latest technology to provide accurate diagnoses with minimal radiation exposure when possible.',
      image: radiology,
      altText: 'Radiology imaging scanner',
      icon: <FaXRay className="text-teal-500 text-3xl" />
    },
  ];

  // Features data
  const features = [
    {
      title: "Expert Doctors",
      description: "Board-certified specialists with extensive experience",
      icon: <FaUserMd className="text-red-500 text-2xl" />
    },
    {
      title: "Advanced Technology",
      description: "Cutting-edge medical equipment and facilities",
      icon: <FaProcedures className="text-blue-500 text-2xl" />
    },
    {
      title: "24/7 Availability",
      description: "Round-the-clock emergency services",
      icon: <FaClock className="text-green-500 text-2xl" />
    },
    {
      title: "Emergency Care",
      description: "Rapid response teams for critical situations",
      icon: <FaAmbulance className="text-orange-500 text-2xl" />
    }
  ];

  // Close service detail view
  const closeDetail = () => {
    setSelectedService(null);
  };

  // Toggle emergency form visibility
  const toggleEmergencyForm = () => {
    setShowEmergencyForm(!showEmergencyForm);
  };

  // Handle emergency form input changes
  const handleEmergencyInputChange = (e) => {
    const { name, value } = e.target;
    setEmergencyFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle emergency form submission
  const handleEmergencySubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success notification
      toast.success('Emergency request received! Our team will contact you shortly.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });

      // Reset form but stay on the emergency page
      setEmergencyFormData({
        name: '',
        phone: '',
        location: '',
        condition: ''
      });

    } catch (error) {
      toast.error('Failed to submit emergency request. Please try again.', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Toast notifications container */}
      <ToastContainer />
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Our Medical Services
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          Comprehensive <span className="text-red-600">Healthcare</span> Services
        </h1>
        <p className="max-w-3xl mx-auto text-xl text-gray-600">
          We provide exceptional medical care across all major specialties with cutting-edge technology and compassionate professionals.
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-red-500">
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Services Grid - Shown when no service or emergency form is selected */}
        {!selectedService && !showEmergencyForm && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full group"
              >
                <div className="h-48 w-full overflow-hidden relative">
                  <LazyLoadImage
                    src={service.image}
                    alt={service.altText}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    effect="blur"
                    onError={(e) => (e.target.src = '/assets/fallback-image.jpg')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-md">
                    {service.icon}
                  </div>
                  <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">
                    {service.title}
                  </h3>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-600 mb-6 flex-grow">{service.description}</p>
                  <div className="mt-auto">
                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center justify-between text-red-600 font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-50 w-full"
                    >
                      <span>Learn More</span>
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detailed Service View */}
        {selectedService && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="relative h-64 w-full overflow-hidden">
              <LazyLoadImage
                src={selectedService.image}
                alt={selectedService.altText}
                className="w-full h-full object-cover"
                effect="blur"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button
                onClick={closeDetail}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
              >
                <FaTimes className="text-gray-800" />
              </button>
              <div className="absolute bottom-4 left-4 text-white">
                <div className="flex items-center mb-2">
                  <div className="mr-3 bg-white/20 backdrop-blur-sm rounded-full p-3">
                    {selectedService.icon}
                  </div>
                  <h2 className="text-3xl font-bold">{selectedService.title}</h2>
                </div>
              </div>
            </div>
            <div className="p-8">
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-6">{selectedService.detailedDescription}</p>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Services Include:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {selectedService.title === 'Cardiology' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Cardiac catheterization</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Echocardiography</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Stress testing</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span>Pacemaker implantation</span>
                      </li>
                    </>
                  )}
                  {selectedService.title === 'Internal Medicine' && (
                    <>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Preventive health screenings</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Chronic disease management</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Acute illness treatment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Health risk assessments</span>
                      </li>
                    </>
                  )}
                  {/* Similar lists for other services would go here */}
                </ul>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={closeDetail}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center"
                  >
                    <FaArrowRight className="mr-2 transform rotate-180" />
                    Back to Services
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact Form */}
        {showEmergencyForm && (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden max-w-4xl mx-auto">
            <div className="relative h-48 w-full overflow-hidden bg-gradient-to-r from-red-600 to-red-800 flex items-center justify-center">
              <div className="text-center text-white p-6 relative z-10">
                <div className="flex justify-center mb-4">
                  <FaAmbulance className="text-4xl animate-pulse" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Emergency Assistance</h2>
                <p className="text-xl">Please provide your details and we'll contact you immediately</p>
              </div>
              <button
                onClick={toggleEmergencyForm}
                className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors"
                disabled={isSubmitting}
              >
                <FaTimes className="text-gray-800" />
              </button>
            </div>
            <div className="p-8">
              <form onSubmit={handleEmergencySubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaUser className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          required
                          value={emergencyFormData.name}
                          onChange={handleEmergencyInputChange}
                          className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                          placeholder="John Doe"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaPhone className="text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          required
                          value={emergencyFormData.phone}
                          onChange={handleEmergencyInputChange}
                          className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                          placeholder="+1 (555) 123-4567"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Location (Address)
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="location"
                        id="location"
                        required
                        value={emergencyFormData.location}
                        onChange={handleEmergencyInputChange}
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3 border"
                        placeholder="123 Main St, City, State"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                      Describe the Emergency Condition
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                        <FaNotesMedical className="text-gray-400" />
                      </div>
                      <textarea
                        name="condition"
                        id="condition"
                        rows="4"
                        required
                        value={emergencyFormData.condition}
                        onChange={handleEmergencyInputChange}
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md border"
                        placeholder="Briefly describe the symptoms or emergency..."
                        disabled={isSubmitting}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    type="button"
                    onClick={toggleEmergencyForm}
                    className="bg-white text-gray-700 font-medium py-3 px-6 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-300 mr-4 flex items-center"
                    disabled={isSubmitting}
                  >
                    <FaTimes className="mr-2" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-300 flex items-center disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaAmbulance className="mr-2" />
                        Send Emergency Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Emergency CTA Section - Only shown when no service or form is selected */}
        {!selectedService && !showEmergencyForm && (
          <div className="mt-16 bg-gradient-to-r from-red-600 to-red-800 rounded-xl p-8 text-white shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Need Immediate Medical Assistance?</h2>
              <p className="text-xl mb-6">Our emergency team is available 24/7 to provide you with the best care when you need it most.</p>
              <button
                onClick={toggleEmergencyForm}
                className="inline-block bg-white text-red-600 font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center mx-auto"
              >
                <FaAmbulance className="mr-2" /> Emergency Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;
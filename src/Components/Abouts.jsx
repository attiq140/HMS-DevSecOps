import React from 'react';

const Abouts = () => {
  const handleHomeClick = () => {
    // You can replace this with your actual home page navigation
    window.location.href = '/';
    // Or if using React Router: navigate('/');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section with Background Image and Content */}
      <div className="relative bg-gradient-to-r from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="flex flex-col items-center text-center">
            
            {/* Content */}
            <div className="w-full max-w-4xl">
              {/* Breadcrumb */}
              <div className="mb-6">
                <div className="text-sm font-medium">
                  <span 
                    className="text-orange-500 hover:text-orange-600 cursor-pointer transition-colors"
                    onClick={handleHomeClick}
                  >
                    Home
                  </span> 
                  <span className="text-gray-400 mx-2">/</span> 
                  <span className="text-gray-700">About Us</span>
                </div>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-navy-900 mb-12">
                About Us
              </h1>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {/* Stat 1 */}
                <div className="bg-green-100 p-6 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-green-600 mb-2">186</h3>
                  <p className="text-gray-700 text-sm font-medium">Patients Beds</p>
                </div>

                {/* Stat 2 */}
                <div className="bg-pink-100 p-6 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-pink-600 mb-2">225</h3>
                  <p className="text-gray-700 text-sm font-medium">Doctors & Nurses</p>
                </div>

                {/* Stat 3 */}
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-orange-500 mb-2">2272</h3>
                  <p className="text-gray-700 text-sm font-medium">Happy Patients</p>
                </div>

                {/* Stat 4 */}
                <div className="bg-blue-100 p-6 rounded-lg text-center">
                  <h3 className="text-3xl font-bold text-blue-600 mb-2">5</h3>
                  <p className="text-gray-700 text-sm font-medium">Years Experience</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Content Section */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* About Text Content */}
            <div className="w-full lg:w-2/3">
              <h2 className="text-3xl font-bold text-navy-900 mb-6">About Us</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                At Home of Compassion Hospital, we are dedicated to providing exceptional and 
                comprehensive care to our patients. Our team of experienced healthcare professionals 
                is committed to using the latest technologies and techniques to ensure that every 
                patient receives the highest quality of care. We pride ourselves on our commitment 
                to excellence and strive to make a positive difference in the lives of those we serve. 
                Join us in our mission to advance healthcare and improve lives.
              </p>
              
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Book Appointment
              </button>
            </div>

            {/* Additional Info */}
            <div className="w-full lg:w-1/3">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Services</h3>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                    24/7 Emergency Care
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    Advanced Diagnostics
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    Specialist Consultations
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    Surgical Procedures
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section Header */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-orange-500 font-medium mb-2">Our Testimonials</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-navy-900">
            What Our Patients Say About Our<br />
            Medical Treatments
          </h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Our medical clinic provides quality care for the entire family while maintaining a personable 
            atmosphere best describes our medical...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Abouts;
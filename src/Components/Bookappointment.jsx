import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Appointment from '../assets/Appointment.png';
import { FaArrowRight, FaUserMd, FaStethoscope, FaHeartbeat, FaBrain, FaChild } from 'react-icons/fa';

const Bookappointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    description: '',
    canExtend: '',
    idCardNumber: '',
    patientType: '',
    gender: '',
    password: '',
    date: ''
  });
  const [doctorId, setDoctorId] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  useEffect(() => {
    if (location.state?.doctorId) {
      setDoctorId(location.state.doctorId);
      const departmentMap = {
        1: 'cardiology',
        2: 'orthopedics',
        3: 'neurology',
        4: 'pediatrics',
        5: 'gynecology',
        6: 'dermatology'
      };
      const dept = departmentMap[location.state.doctorId] || '';
      setSelectedDepartment(dept);
      setFormData(prev => ({ ...prev, department: dept }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || 
        !formData.gender || !formData.password || !formData.date) {
      toast.error('Please fill in all required fields', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: '#fef2f2',
          color: '#b91c1c'
        }
      });
      return;
    }

    // Format appointment details for the success message
    const appointmentDetails = {
      patientName: `${formData.firstName} ${formData.lastName}`,
      department: formData.department.charAt(0).toUpperCase() + formData.department.slice(1),
      date: new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      time: '10:00 AM', // Default time since no time input is provided
      doctorId: doctorId || 'TBD',
      email: formData.email
    };

    // Display detailed success message
    toast.success(
      `Appointment booked successfully!\n\n` +
      `Patient: ${appointmentDetails.patientName}\n` +
      `Department: ${appointmentDetails.department}\n` +
      `Date: ${appointmentDetails.date}\n` +
      `Time: ${appointmentDetails.time}\n` +
      `Doctor ID: ${appointmentDetails.doctorId}\n` +
      `Confirmation sent to: ${appointmentDetails.email}\n\n` +
      `Redirecting to home page...`,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          backgroundColor: '#ecfdf5',
          color: '#065f46',
          whiteSpace: 'pre-wrap'
        }
      }
    );

    // Simulate backend submission
    console.log('Appointment data:', { ...formData, time: appointmentDetails.time });

    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      department: selectedDepartment,
      description: '',
      canExtend: '',
      idCardNumber: '',
      patientType: '',
      gender: '',
      password: '',
      date: ''
    });

    // Navigate after success message
    setTimeout(() => {
      navigate('/');
    }, 5500);
  };

  const departmentIcons = {
    cardiology: <FaHeartbeat className="text-red-500 text-3xl" />,
    orthopedics: <FaStethoscope className="text-blue-500 text-3xl" />,
    neurology: <FaBrain className="text-purple-500 text-3xl" />,
    pediatrics: <FaChild className="text-yellow-500 text-3xl" />,
    gynecology: <FaUserMd className="text-pink-500 text-3xl" />,
    dermatology: <FaUserMd className="text-green-500 text-3xl" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <span className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Book Your Appointment
        </span>
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl mb-6">
          Schedule with <span className="text-red-600">Our Specialists</span>
        </h1>
        {doctorId && (
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            You're booking an appointment with Doctor ID: {doctorId} in {selectedDepartment}
          </p>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Appointment Form Card */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-8">
                <div className="flex items-center mb-8">
                  {selectedDepartment && departmentIcons[selectedDepartment]}
                  <h2 className="text-2xl font-bold text-gray-800 ml-4">Appointment Details</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input 
                        type="text" 
                        name="firstName"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your First Name"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input 
                        type="text" 
                        name="lastName"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your Last Name"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                    <input 
                      type="email" 
                      name="email"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Department *</label>
                    <div className="flex items-center">
                      <select 
                        name="department"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        value={formData.department}
                        onChange={handleChange}
                      >
                        <option value="">Select Department</option>
                        <option value="cardiology">Cardiology</option>
                        <option value="orthopedics">Orthopedics</option>
                        <option value="neurology">Neurology</option>
                        <option value="pediatrics">Pediatrics</option>
                        <option value="gynecology">Gynecology</option>
                        <option value="dermatology">Dermatology</option>
                      </select>
                      {formData.department && departmentIcons[formData.department] && (
                        <span className="ml-4">
                          {departmentIcons[formData.department]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      rows="4" 
                      name="description"
                      className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Tell us about your condition"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Patient Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Patient Type</label>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio text-blue-600" 
                              name="patientType" 
                              value="new" 
                              checked={formData.patientType === 'new'}
                              onChange={handleChange}
                            />
                            <span className="ml-2">New Patient</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio text-blue-600" 
                              name="patientType" 
                              value="old" 
                              checked={formData.patientType === 'old'}
                              onChange={handleChange}
                            />
                            <span className="ml-2">Old Patient</span>
                          </label>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                        <div className="flex items-center space-x-4">
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio text-blue-600" 
                              name="gender" 
                              value="male" 
                              checked={formData.gender === 'male'}
                              onChange={handleChange}
                              required
                            />
                            <span className="ml-2">Male</span>
                          </label>
                          <label className="inline-flex items-center">
                            <input 
                              type="radio" 
                              className="form-radio text-blue-600" 
                              name="gender" 
                              value="female" 
                              checked={formData.gender === 'female'}
                              onChange={handleChange}
                              required
                            />
                            <span className="ml-2">Female</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ID Card Number</label>
                        <input 
                          type="text" 
                          name="idCardNumber"
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ID Card Number"
                          value={formData.idCardNumber}
                          onChange={handleChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Can You Extend</label>
                        <input 
                          type="text" 
                          name="canExtend"
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Can you extend"
                          value={formData.canExtend}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                      <input 
                        type="password" 
                        name="password"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Appointment Date *</label>
                      <input 
                        type="date" 
                        name="date"
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={formData.date}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      type="submit" 
                      className="flex items-center justify-between text-white bg-red-600 font-medium py-2 px-4 rounded-lg transition-all duration-300 hover:bg-red-700 w-auto"
                    >
                      <span>Confirm Appointment</span>
                      <FaArrowRight className="ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* Side Panel with Image and Info */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
              <div className="h-64 w-full overflow-hidden relative">
                <LazyLoadImage
                  src={Appointment}
                  alt="Appointment Illustration"
                  className="w-full h-full object-cover"
                  effect="blur"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">Need Help?</h3>
                  <p className="text-sm">Our team is here to assist you</p>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Call for assistance</h3>
                    <p className="text-blue-600 text-sm font-medium">+19(9)6336616</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-800 mb-1">Email us</h3>
                    <p className="text-green-600 text-sm font-medium">Health@gmail.com</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">About Our Appointments</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    ByOUU is a valid process across the business company. This value will be
                    transmitted with and to shareholders through the Company of Corporate Health. The
                    business must ensure that its strong appetite, offering financial assistance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookappointment;
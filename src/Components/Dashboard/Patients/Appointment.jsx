import React, { useState, useEffect, useRef } from 'react';
import { FaCalendarAlt, FaUserMd, FaClock, FaFileUpload, FaPrint, FaHistory, FaBell, FaTimes, FaCheck, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaEdit, FaDownload } from 'react-icons/fa';
import { MdDateRange, MdOutlineSms, MdOutlineEmail } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';

// Custom CSS for animations, text shadow, dropdown arrow, and table adjustments
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes scaleIn {
    from { transform: scale(0.95); opacity: 0.8; }
    to { transform: scale(1); opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.3s ease-out;
  }
  .animate-scaleIn {
    animation: scaleIn 0.5s ease-out;
  }
  .gradient-text {
    background: linear-gradient(to right, #3b82f6, #7c3aed);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .modal-backdrop {
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.1);
  }
  .custom-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;utf8,<svg fill='none' stroke='currentColor' stroke-width='2' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'><path stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'></path></svg>");
    background-repeat: no-repeat;
    background-position: right 0.5rem center;
    background-size: 1rem;
    width: 100%;
    padding: 0.5rem;
    font-size: 0.875rem;
    border-radius: 0.375rem;
    border: 1px solid #d1d5db;
  }
  @media (min-width: 640px) {
    .custom-select {
      padding: 0.5rem 2rem 0.5rem 0.75rem;
      font-size: 1rem;
      background-position: right 0.75rem center;
    }
  }
  select option {
    font-size: 0.875rem;
    padding: 0.25rem;
  }
  @media (max-width: 640px) {
    .responsive-grid {
      grid-template-columns: 1fr;
    }
    .responsive-flex-col {
      flex-direction: column;
    }
    .responsive-text-sm {
      font-size: 0.875rem;
    }
    .responsive-p-2 {
      padding: 0.5rem;
    }
  }
  .profile-modal, .chat-modal, .email-modal {
    max-width: 600px;
    width: 90%;
  }
  .toast-container {
    font-size: 0.875rem;
  }
  .chat-messages {
    max-height: 300px;
    overflow-y: auto;
  }
  .appointments-table {
    table-layout: fixed;
    width: 100%;
    min-width: 0;
  }
  .appointments-table th,
  .appointments-table td {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-wrap: break-word;
  }
  @media (max-width: 768px) {
    .appointments-table th,
    .appointments-table td {
      font-size: 0.75rem;
      padding: 0.5rem;
    }
    .appointments-table th:nth-child(2),
    .appointments-table td:nth-child(2) {
      display: none;
    }
  }
  @media (max-width: 640px) {
    .appointments-table th,
    .appointments-table td {
      font-size: 0.7rem;
      padding: 0.4rem;
    }
    .appointments-table th:nth-child(4),
    .appointments-table td:nth-child(4) {
      display: none;
    }
  }
`;

const Appointment = () => {
  // State for form inputs
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    type: 'in-person',
    files: null
  });

  // State for profile modal and edit mode
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    department: '',
    bio: '',
    education: '',
    experience: '',
    specialization: '',
    availability: {
      days: [],
      hours: ''
    }
  });

  // State for SMS and Email modals
  const [showChatModal, setShowChatModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [currentNotificationId, setCurrentNotificationId] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [emailMessages, setEmailMessages] = useState({});
  const [newChatMessage, setNewChatMessage] = useState('');
  const [newEmailSubject, setNewEmailSubject] = useState('');
  const [newEmailBody, setNewEmailBody] = useState('');
  const chatMessagesEndRef = useRef(null);

  // State for loading
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample data - would typically come from an API
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState({});
  const [timeSlots, setTimeSlots] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState({});

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const mockDepartments = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics'];
        const mockDoctors = {
          'Cardiology': ['Dr. Smith', 'Dr. Johnson'],
          'Dermatology': ['Dr. Williams', 'Dr. Brown'],
          'Neurology': ['Dr. Davis', 'Dr. Miller'],
          'Pediatrics': ['Dr. Wilson', 'Dr. Moore'],
          'Orthopedics': ['Dr. Taylor', 'Dr. Anderson']
        };
        const mockTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'];
        const mockDoctorDetails = {
          'Dr. Smith': {
            department: 'Cardiology',
            bio: 'Specialized in heart conditions with 15 years of experience.',
            education: 'MD in Cardiology, Harvard Medical School',
            experience: '15 years',
            specialization: 'Cardiac Surgery, Heart Failure',
            availability: {
              days: ['Monday', 'Wednesday', 'Friday'],
              hours: '9:00 AM - 4:00 PM'
            },
            image: null
          },
          'Dr. Johnson': {
            department: 'Cardiology',
            education: 'MD in Cardiology, Johns Hopkins University',
            experience: '12 years',
            specialization: 'Echocardiography, Stress Testing',
            availability: {
              days: ['Tuesday', 'Thursday'],
              hours: '10:00 AM - 5:00 PM'
            },
            image: null
          },
          'Dr. Williams': {
            department: 'Dermatology',
            bio: 'Expert in skin conditions and cosmetic procedures.',
            education: 'MD in Dermatology, Stanford University',
            experience: '10 years',
            specialization: 'Psoriasis, Cosmetic Dermatology',
            availability: {
              days: ['Monday', 'Tuesday', 'Thursday'],
              hours: '8:00 AM - 3:00 PM'
            },
            image: null
          },
          'Dr. Brown': {
            department: 'Dermatology',
            bio: 'Specialized in pediatric dermatology.',
            education: 'MD in Dermatology, Yale University',
            experience: '8 years',
            specialization: 'Pediatric Dermatology, Eczema',
            availability: {
              days: ['Wednesday', 'Friday'],
              hours: '9:00 AM - 4:00 PM'
            },
            image: null
          }
        };

        setDepartments(mockDepartments);
        setDoctors(mockDoctors);
        setTimeSlots(mockTimeSlots);
        setDoctorDetails(mockDoctorDetails);
        setLoading(false);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        toast.error('Failed to load data.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Scroll to bottom of chat messages
  useEffect(() => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Open profile modal and load doctor details
  const openProfileModal = (doctorName) => {
    if (doctorName && doctorDetails[doctorName]) {
      setProfileFormData({
        name: doctorName,
        department: doctorDetails[doctorName].department,
        bio: doctorDetails[doctorName].bio || '',
        education: doctorDetails[doctorName].education || '',
        experience: doctorDetails[doctorName].experience || '',
        specialization: doctorDetails[doctorName].specialization || '',
        availability: doctorDetails[doctorName].availability
      });
      setShowProfileModal(true);
    }
  };

  // Close profile modal
  const closeProfileModal = () => {
    setShowProfileModal(false);
    setEditMode(false);
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle availability changes
  const handleAvailabilityChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [name]: name === 'days' ? value.split(',') : value
      }
    }));
  };

  // Save profile changes
  const saveProfileChanges = () => {
    setDoctorDetails(prev => ({
      ...prev,
      [profileFormData.name]: {
        ...prev[profileFormData.name],
        ...profileFormData
      }
    }));
    setEditMode(false);
    toast.success('Profile updated successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Filter time slots based on selected date
  const getAvailableTimeSlots = (date) => {
    if (!date) return timeSlots;
    return timeSlots;
  };

  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // Load sample data
  useEffect(() => {
    if (!loading) {
      setUpcomingAppointments([
        {
          id: 1,
          doctor: 'Dr. Smith',
          department: 'Cardiology',
          date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
          time: '10:00 AM',
          status: 'Confirmed',
          type: 'In-Person'
        },
        {
          id: 2,
          doctor: 'Dr. Johnson',
          department: 'Neurology',
          date: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
          time: '02:00 PM',
          status: 'Pending',
          type: 'Online'
        }
      ]);

      setAppointmentHistory([
        {
          id: 1,
          date: '2023-05-10',
          doctor: 'Dr. Williams',
          summary: 'Routine checkup, prescription provided',
          prescription: 'prescription_20230510.pdf',
          details: {
            patientName: 'John Doe',
            diagnosis: 'Hypertension',
            medication: 'Lisinopril 10mg daily',
            notes: 'Follow-up in 3 months'
          }
        },
        {
          id: 2,
          date: '2023-04-15',
          doctor: 'Dr. Brown',
          summary: 'Follow-up visit, lab tests ordered',
          prescription: 'prescription_20230415.pdf',
          details: {
            patientName: 'John Doe',
            diagnosis: 'Type 2 Diabetes',
            medication: 'Metformin 500mg twice daily',
            notes: 'Monitor blood sugar levels'
          }
        }
      ]);

      setNotifications([
        {
          id: 1,
          title: 'Appointment Confirmed',
          message: 'Your appointment with Dr. Smith has been confirmed',
          icon: <FaCheck className="h-5 w-5 text-green-600" />,
          date: new Date(),
          read: false
        },
        {
          id: 2,
          title: 'Appointment Reminder',
          message: "Don't forget your upcoming appointment",
          icon: <FaBell className="h-5 w-5 text-yellow-600" />,
          date: new Date(),
          read: false
        }
      ]);
    }
  }, [loading]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      files: e.target.files[0]
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department || !formData.doctor || !formData.date || !formData.time || !formData.reason) {
      toast.error('Please fill out all required fields.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const newAppointment = {
      id: upcomingAppointments.length + 1,
      doctor: formData.doctor,
      department: formData.department,
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'Pending',
      type: formData.type === 'in-person' ? 'In-Person' : 'Online'
    };
    
    setUpcomingAppointments([...upcomingAppointments, newAppointment]);
    
    const newNotification = {
      id: notifications.length + 1,
      title: 'Appointment Booked',
      message: `Your appointment with ${formData.doctor} on ${formData.date} at ${formData.time} has been booked`,
      icon: <FaCheckCircle className="h-5 w-5 text-blue-600" />,
      date: new Date(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
    
    toast.success('Appointment booked successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    setFormData({
      department: '',
      doctor: '',
      date: '',
      time: '',
      reason: '',
      type: 'in-person',
      files: null
    });
  };

  // Cancel appointment
  const cancelAppointment = (id) => {
    setUpcomingAppointments(upcomingAppointments.map(app => 
      app.id === id ? { ...app, status: 'Cancelled' } : app
    ));
    
    const cancelledApp = upcomingAppointments.find(app => app.id === id);
    if (cancelledApp) {
      const newNotification = {
        id: notifications.length + 1,
        title: 'Appointment Cancelled',
        message: `Your appointment with ${cancelledApp.doctor} has been cancelled`,
        icon: <FaTimesCircle className="h-5 w-5 text-red-600" />,
        date: new Date(),
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      toast.error(`Appointment with ${cancelledApp.doctor} cancelled.`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Reschedule appointment
  const rescheduleAppointment = (id) => {
    const appToReschedule = upcomingAppointments.find(app => app.id === id);
    if (appToReschedule) {
      setFormData({
        department: appToReschedule.department,
        doctor: appToReschedule.doctor,
        date: '',
        time: '',
        reason: '',
        type: appToReschedule.type === 'In-Person' ? 'in-person' : 'online',
        files: null
      });
      
      document.getElementById('appointment-form')?.scrollIntoView({ behavior: 'smooth' });
      toast.info('Ready to reschedule your appointment.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date for display
  const formatDisplayDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Open chat modal
  const openChatModal = (notificationId) => {
    setCurrentNotificationId(notificationId);
    setShowChatModal(true);
  };

  // Open email modal
  const openEmailModal = (notificationId) => {
    setCurrentNotificationId(notificationId);
    setShowEmailModal(true);
  };

  // Close chat modal
  const closeChatModal = () => {
    setShowChatModal(false);
    setNewChatMessage('');
    setCurrentNotificationId(null);
  };

  // Close email modal
  const closeEmailModal = () => {
    setShowEmailModal(false);
    setNewEmailSubject('');
    setNewEmailBody('');
    setCurrentNotificationId(null);
  };

  // Send chat message
  const sendChatMessage = (e) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newChatMessage,
      timestamp: new Date(),
      sender: 'user'
    };

    setChatMessages(prev => ({
      ...prev,
      [currentNotificationId]: [...(prev[currentNotificationId] || []), message]
    }));

    const notification = notifications.find(n => n.id === currentNotificationId);
    if (notification) {
      const newNotification = {
        id: notifications.length + 1,
        title: 'SMS Sent',
        message: `SMS sent regarding: ${notification.title}`,
        icon: <MdOutlineSms className="h-5 w-5 text-blue-600" />,
        date: new Date(),
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      toast.success('SMS sent successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    setNewChatMessage('');
  };

  // Send email
  const sendEmail = (e) => {
    e.preventDefault();
    if (!newEmailSubject.trim() || !newEmailBody.trim()) return;

    const email = {
      id: Date.now(),
      subject: newEmailSubject,
      body: newEmailBody,
      timestamp: new Date(),
      sender: 'user'
    };

    setEmailMessages(prev => ({
      ...prev,
      [currentNotificationId]: [...(prev[currentNotificationId] || []), email]
    }));

    const notification = notifications.find(n => n.id === currentNotificationId);
    if (notification) {
      const newNotification = {
        id: notifications.length + 1,
        title: 'Email Sent',
        message: `Email sent regarding: ${notification.title}`,
        icon: <MdOutlineEmail className="h-5 w-5 text-blue-600" />,
        date: new Date(),
        read: false
      };
      setNotifications([newNotification, ...notifications]);
      toast.success('Email sent successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    setNewEmailSubject('');
    setNewEmailBody('');
    closeEmailModal();
  };

  // Generate PDF for appointment
  const generatePDF = (history) => {
    const doc = new jsPDF();
    const doctorInfo = doctorDetails[history.doctor] || {};
    
    doc.setFontSize(20);
    doc.text('Doctor Appointment Slip', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Doctor: ${history.doctor}`, 20, 40);
    doc.text(`Department: ${doctorInfo.department || 'N/A'}`, 20, 50);
    doc.text(`Date: ${formatDisplayDate(history.date)}`, 20, 60);
    doc.text(`Specialization: ${doctorInfo.specialization || 'N/A'}`, 20, 70);
    doc.text(`Education: ${doctorInfo.education || 'N/A'}`, 20, 80);
    doc.text(`Experience: ${doctorInfo.experience || 'N/A'}`, 20, 90);
    doc.text(`Availability: ${doctorInfo.availability ? 
      `${doctorInfo.availability.days.join(', ')} (${doctorInfo.availability.hours})` : 'N/A'}`, 20, 100);
    doc.text(`Summary: ${history.summary}`, 20, 110);
    
    return doc;
  };

  // Download appointment slip
  const downloadAppointmentSlip = (history) => {
    const doc = generatePDF(history);
    doc.save(`doctor_appointment_${history.id}.pdf`);

    const newNotification = {
      id: notifications.length + 1,
      title: 'Document Downloaded',
      message: `Doctor appointment slip for ${history.doctor} downloaded`,
      icon: <FaDownload className="h-5 w-5 text-blue-600" />,
      date: new Date(),
      read: false
    };
    setNotifications([newNotification, ...notifications]);
    toast.success('Document downloaded successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // Print appointment slip
  const printAppointmentSlip = (history) => {
    const doc = generatePDF(history);
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    
    const printWindow = window.open(url);
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(url);
    };

    const newNotification = {
      id: notifications.length + 1,
      title: 'Document Printed',
      message: `Doctor appointment slip for ${history.doctor} printed`,
      icon: <FaPrint className="h-5 w-5 text-blue-600" />,
      date: new Date(),
      read: false
    };
    setNotifications([...notifications, newNotification]);
    toast.success('Document sent to printer!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="relative p-4 sm:p-6 md:p-8">
      <style>{styles}</style>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="toast-container"
      />
      
      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 profile-modal animate-fadeIn max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editMode ? 'Edit Doctor Profile' : 'Doctor Profile'}
              </h3>
              <button 
                onClick={closeProfileModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            {editMode ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={profileFormData.name}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={profileFormData.department}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    name="bio"
                    value={profileFormData.bio}
                    onChange={handleProfileChange}
                    rows="3"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    <input
                      type="text"
                      name="education"
                      value={profileFormData.education}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={profileFormData.experience}
                      onChange={handleProfileChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={profileFormData.specialization}
                    onChange={handleProfileChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Availability</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Days (comma separated)</label>
                      <input
                        type="text"
                        name="days"
                        value={profileFormData.availability.days.join(',')}
                        onChange={handleAvailabilityChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                      <input
                        type="text"
                        name="hours"
                        value={profileFormData.availability.hours}
                        onChange={handleAvailabilityChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveProfileChanges}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex-shrink-0 flex items-center justify-center">
                    <FaUserMd className="text-3xl text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">{profileFormData.name}</h4>
                    <p className="text-blue-600 font-medium">{profileFormData.department}</p>
                    <p className="text-gray-600 mt-2">{profileFormData.bio}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-gray-900">Education</h5>
                    <p className="text-gray-600">{profileFormData.education}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900">Experience</h5>
                    <p className="text-gray-600">{profileFormData.experience}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900">Specialization</h5>
                    <p className="text-gray-600">{profileFormData.specialization}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-gray-900">Availability</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm text-gray-500">Days</p>
                        <p className="text-gray-600">{profileFormData.availability.days.join(', ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Hours</p>
                        <p className="text-gray-600">{profileFormData.availability.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(true)}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FaEdit className="mr-2" /> Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 chat-modal animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">SMS Chat</h3>
              <button 
                onClick={closeChatModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <div className="chat-messages mb-4 p-4 bg-gray-50 rounded-lg">
              {(chatMessages[currentNotificationId] || []).map(message => (
                <div 
                  key={message.id} 
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}
                >
                  <div 
                    className={`max-w-[70%] p-2 rounded-lg ${
                      message.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={chatMessagesEndRef} />
            </div>
            
            <form onSubmit={sendChatMessage} className="flex gap-2">
              <input
                type="text"
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop">
          <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 email-modal animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Compose Email</h3>
              <button 
                onClick={closeEmailModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            
            <form onSubmit={sendEmail} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  value={newEmailSubject}
                  onChange={(e) => setNewEmailSubject(e.target.value)}
                  placeholder="Subject"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body</label>
                <textarea
                  value={newEmailBody}
                  onChange={(e) => setNewEmailBody(e.target.value)}
                  placeholder="Type your email here..."
                  rows="6"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeEmailModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header with gradient text */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-scaleIn">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaCalendarAlt className="text-3xl sm:text-4xl text-blue-600" aria-hidden="true" />
            <FaUserMd className="absolute -bottom-1 right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
            Appointment Management
            <span className="ml-2 text-xs sm:text-sm font-normal bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full">
              {upcomingAppointments.length} upcoming
            </span>
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 responsive-grid">
        {/* Book New Appointment Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 animate-fadeIn" id="appointment-form">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-600 text-lg sm:text-xl" /> Book New Appointment
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <FaUserMd className="mr-2 text-blue-600" /> Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="custom-select"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              {/* Doctor */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <FaUserMd className="mr-2 text-blue-600" /> Doctor
                </label>
                <select
                  name="doctor"
                  value={formData.doctor}
                  onChange={handleChange}
                  disabled={!formData.department}
                  className="custom-select"
                  required
                >
                  <option value="">Select Doctor</option>
                  {formData.department && doctors[formData.department]?.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>
              
              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" /> Date
                </label>
                <div className="relative">
                  <select
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="custom-select"
                    required
                  >
                    <option value="">Select Date</option>
                    {availableDates.map(date => (
                      <option key={date} value={date}>
                        {formatDisplayDate(date)}
                      </option>
                    ))}
                  </select>
                  <MdDateRange className="absolute right-3 top-2 sm:top-3 text-gray-400 text-lg sm:text-base" />
                </div>
              </div>
              
              {/* Time */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center">
                  <FaClock className="mr-2 text-blue-600" /> Time Slot
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={!formData.date}
                  className="custom-select"
                  required
                >
                  <option value="">Select Time</option>
                  {getAvailableTimeSlots(formData.date).map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> Appointment Type
              </label>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 responsive-flex-col">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="in-person"
                    checked={formData.type === 'in-person'}
                    onChange={handleChange}
                    className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm sm:text-base text-gray-700">In-Person</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="type"
                    value="online"
                    checked={formData.type === 'online'}
                    onChange={handleChange}
                    className="form-radio text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span className="ml-2 text-sm sm:text-base text-gray-700">Online</span>
                </label>
              </div>
            </div>
            
            {/* Reason for Visit */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center">
                <FaUserMd className="mr-2 text-blue-600" /> Reason for Visit
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 sm:p-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base"
                placeholder="Briefly describe your reason for the appointment"
                required
              />
            </div>
            
            {/* File Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1 flex items-center">
                <FaFileUpload className="mr-2 text-blue-600" /> Upload Medical Reports (Optional)
              </label>
              <div className="mt-1 flex flex-col sm:flex-row items-start sm:items-center">
                <label className="inline-flex items-center px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-all">
                  <FaFileUpload className="mr-2" />
                  Choose File
                  <input type="file" className="sr-only" onChange={handleFileChange} />
                </label>
                <span className="mt-2 sm:mt-0 sm:ml-2 text-sm text-gray-500 truncate max-w-xs">
                  {formData.files ? formData.files.name : 'No file selected'}
                </span>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 sm:py-3 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center justify-center text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCheckCircle className="mr-2" />
                    Book Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
        
        {/* Doctor Profile Preview */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 animate-fadeIn">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FaUserMd className="mr-2 text-blue-600 text-lg sm:text-xl" /> Doctor Profile
          </h2>
          
          {formData.doctor ? (
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                {doctorDetails[formData.doctor]?.image ? (
                  <img src={doctorDetails[formData.doctor].image} alt={formData.doctor} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <FaUserMd className="text-2xl sm:text-3xl text-blue-600" />
                )}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">{formData.doctor}</h3>
              <p className="text-xs sm:text-sm text-blue-600 mb-2">{formData.department}</p>
              
              {doctorDetails[formData.doctor]?.bio && (
                <p className="text-xs sm:text-sm text-gray-600 mt-2 text-left">
                  {doctorDetails[formData.doctor].bio}
                </p>
              )}
              
              <div className="mt-4 text-left">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center text-sm sm:text-base">
                  <FaClock className="mr-2 text-blue-600" /> Availability
                </h4>
                {doctorDetails[formData.doctor]?.availability ? (
                  <ul className="space-y-1 text-xs sm:text-sm text-gray-600">
                    <li>Days: {doctorDetails[formData.doctor].availability.days.join(', ')}</li>
                    <li>Hours: {doctorDetails[formData.doctor].availability.hours}</li>
                  </ul>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-500">Availability not specified</p>
                )}
              </div>
              
              <div className="mt-4 sm:mt-6">
                <button 
                  onClick={() => openProfileModal(formData.doctor)}
                  className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 py-2 px-4 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm sm:text-base"
                >
                  View Full Profile
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              Select a doctor to view profile
            </div>
          )}
        </div>
      </div>
      
      {/* Upcoming Appointments */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center p-4 sm:p-6">
          <FaCalendarAlt className="mr-2 text-blue-600 text-lg sm:text-xl" /> Upcoming Appointments
        </h2>
        
        {upcomingAppointments.length > 0 ? (
          <div className="w-full">
            <table className="min-w-full divide-y divide-gray-200 appointments-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUserMd className="mr-1" /> Doctor
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUserMd className="mr-1" /> Department
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1" /> Date & Time
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaUserMd className="mr-1" /> Type
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    <div className="flex items-center">
                      <FaCheckCircle className="mr-1" /> Status
                    </div>
                  </th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {upcomingAppointments.map((appointment, index) => (
                  <tr key={appointment.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-semibold text-gray-900">{appointment.doctor}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{appointment.department}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                      {formatDisplayDate(appointment.date)} at {appointment.time}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 inline-flex text-xs sm:text-sm leading-5 font-semibold rounded-full ${
                        appointment.type === 'In-Person' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {appointment.type}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`px-2 inline-flex items-center text-xs sm:text-sm font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {appointment.status === 'Confirmed' ? (
                          <FaCheckCircle className="inline mr-1" />
                        ) : appointment.status === 'Pending' ? (
                          <FaHourglassHalf className="inline mr-1" />
                        ) : (
                          <FaTimesCircle className="inline mr-1" />
                        )}
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium">
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {appointment.status !== 'Cancelled' && (
                          <button 
                            onClick={() => cancelAppointment(appointment.id)}
                            className="text-xs sm:text-sm text-red-600 hover:text-red-400 transition-colors flex items-center"
                          >
                            <FaTimesCircle className="mr-1" /> Cancel
                          </button>
                        )}
                        <button 
                          onClick={() => rescheduleAppointment(appointment.id)}
                          className={`text-xs sm:text-sm ${appointment.status === 'Cancelled' ? 'text-gray-500 cursor-not-allowed' : 'text-yellow-600 hover:text-yellow-400'} transition-colors flex items-center`}
                          disabled={appointment.status === 'Cancelled'}
                        >
                          <FaCalendarAlt className="mr-1" /> Reschedule
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No upcoming appointments found
          </div>
        )}
      </div>
      
      {/* Appointment History */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 animate-fadeIn">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaHistory className="mr-2 text-blue-600 text-lg sm:text-xl" /> Appointment History
        </h2>
        
        {appointmentHistory.length > 0 ? (
          <div className="space-y-4">
            {appointmentHistory.map(history => (
              <div key={history.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0 bg-white rounded-md shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
                      <FaUserMd className="mr-2 text-blue-600" /> {history.doctor}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{formatDisplayDate(history.date)}</p>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{history.summary}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <button 
                      onClick={() => printAppointmentSlip(history)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaPrint className="mr-1" /> Print
                    </button>
                    <button 
                      onClick={() => downloadAppointmentSlip(history)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <FaDownload className="mr-1" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            No appointment history found
          </div>
        )}
      </div>
      
      {/* Notifications */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 animate-fadeIn">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FaBell className="mr-2 text-blue-600 text-lg sm:text-xl" /> Notifications
        </h2>
        
        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(notification => (
              <div key={notification.id} className="flex items-start p-3 sm:p-4 bg-white rounded-md shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all">
                <div className="flex-shrink-0">
                  {notification.icon}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-900">{notification.title}</p>
                  <p className="text-xs sm:text-sm text-gray-600">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.date).toLocaleString()}
                  </p>
                  <div className="mt-2 flex space-x-3 sm:space-x-4">
                    <button 
                      onClick={() => openEmailModal(notification.id)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <MdOutlineEmail className="mr-1" /> Email
                    </button>
                    <button 
                      onClick={() => openChatModal(notification.id)}
                      className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <MdOutlineSms className="mr-1" /> SMS
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              No notifications found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointment;
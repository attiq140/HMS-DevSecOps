import React, { useState, useEffect } from 'react';
import { 
  FaVideo, FaPhone, FaComment, FaCalendarAlt, FaClock, 
  FaStar, FaRegStar, FaUserMd, FaNotesMedical, FaDownload,
  FaChevronDown, FaChevronUp, FaTimes, FaEdit, FaSave,
  FaUser, FaBell, FaShieldAlt, FaDatabase, FaCreditCard
} from 'react-icons/fa';
import { MdOutlineCancel } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Countdown from 'react-countdown';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';

// Custom CSS for animations and styling
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
  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  .toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  .toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 34px;
  }
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
  }
  input:checked + .toggle-slider {
    background-color: #3b82f6;
  }
  input:checked + .toggle-slider:before {
    transform: translateX(26px);
  }
`;

const LiveConsultations = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showReplayModal, setShowReplayModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState('video');
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [consultationStatus, setConsultationStatus] = useState({});
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [selectedReplay, setSelectedReplay] = useState(null);
  const [selectedNotes, setSelectedNotes] = useState(null);
  const [feedbackStore, setFeedbackStore] = useState({});
  const [activeSections, setActiveSections] = useState({
    upcoming: true,
    past: true
  });

  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiology',
      photo: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4.8,
      experience: '12 years',
      languages: ['English', 'Spanish'],
      availableSlots: ['2025-06-26T11:00', '2025-06-27T10:30'],
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialization: 'Neurology',
      photo: 'https://randomuser.me/api/portraits/men/42.jpg',
      rating: 4.6,
      experience: '8 years',
      languages: ['English', 'Mandarin'],
      availableSlots: ['2025-06-26T09:30', '2025-06-27T11:00'],
    },
    {
      id: 3,
      name: 'Dr. Emily Patel',
      specialization: 'Pediatrics',
      photo: 'https://randomuser.me/api/portraits/women/23.jpg',
      rating: 4.7,
      experience: '10 years',
      languages: ['English', 'Hindi'],
      availableSlots: ['2025-06-26T13:00', '2025-06-27T14:00'],
    },
    {
      id: 4,
      name: 'Dr. James Carter',
      specialization: 'Dermatology',
      photo: 'https://randomuser.me/api/portraits/men/17.jpg',
      rating: 4.5,
      experience: '6 years',
      languages: ['English', 'French'],
      availableSlots: ['2025-06-26T15:30', '2025-06-27T09:00'],
    },
  ];

  const specializations = ['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology'];

  const prescriptions = {
    'RX-2025-1001': {
      id: 'RX-2025-1001',
      medications: [
        { name: 'Ibuprofen', dosage: '200mg', frequency: 'Twice daily', duration: '7 days' },
        { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed for migraines', duration: '30 days' },
      ],
      instructions: 'Take with food. Drink plenty of water. Contact doctor if symptoms persist.',
      issuedDate: '2025-06-20',
      doctorName: 'Dr. Michael Chen',
    },
  };

  const upcomingConsultations = [
    {
      id: 1,
      doctor: doctors[0],
      date: '2025-06-26T10:00:00',
      type: 'video',
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/abc123',
      roomName: 'consultation-room-1',
    },
    {
      id: 2,
      doctor: doctors[1],
      date: '2025-06-27T10:30:00',
      type: 'audio',
      status: 'scheduled',
      meetingLink: 'https://meet.example.com/def456',
      roomName: 'consultation-room-2',
    },
  ];

  const pastConsultations = [
    {
      id: 3,
      doctor: doctors[1],
      date: '2025-06-20T14:00:00',
      type: 'video',
      summary: 'Patient reported persistent headaches. Recommended MRI scan and prescribed pain medication.',
      prescriptionId: 'RX-2025-1001',
      recorded: true,
      recordingUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      notes: 'Patient to follow up after MRI results. Monitor headache frequency.',
    },
    {
      id: 4,
      doctor: doctors[0],
      date: '2025-06-15T11:30:00',
      type: 'chat',
      summary: 'Follow-up consultation regarding blood pressure management. Advised lifestyle changes.',
      prescriptionId: null,
      recorded: false,
      notes: 'Recommended reducing salt intake and increasing physical activity.',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setConsultationStatus({
        1: Math.random() > 0.5 ? 'ready' : 'not-ready',
        2: Math.random() > 0.5 ? 'ready' : 'not-ready',
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handleBookConsultation = () => {
    toast.success(`Consultation booked with ${selectedDoctor.name} on ${selectedDate} at ${selectedTime}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    setShowBookingForm(false);
    setSelectedDoctor(null);
    setSelectedSpecialization('');
    setSelectedDate('');
    setSelectedTime('');
    setConsultationType('video');
  };

  const handleRateConsultation = (consultationId, stars, feedbackText) => {
    if (stars < 1 || stars > 5) {
      toast.error('Please select a valid rating (1-5 stars).', {
        position: 'top-right',
        autoClose: 3000,
      });
      return;
    }
    const feedbackData = {
      rating: stars,
      feedback: feedbackText.trim() || 'No feedback provided',
      submittedAt: new Date().toISOString(),
    };
    setFeedbackStore((prev) => ({
      ...prev,
      [consultationId]: feedbackData,
    }));
    toast.success(`Feedback submitted: ${stars} star${stars !== 1 ? 's' : ''}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    setRating(null);
    setFeedback('');
  };

  const handleViewPrescription = (prescriptionId) => {
    if (prescriptions[prescriptionId]) {
      setSelectedPrescription(prescriptions[prescriptionId]);
      setShowPrescriptionModal(true);
      toast.info(`Viewing prescription ${prescriptionId}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.error('Prescription not found.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleReplayConsultation = (consultation) => {
    if (consultation.recordingUrl) {
      setSelectedReplay(consultation);
      setShowReplayModal(true);
      toast.info(`Replaying consultation ${consultation.id}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.error('No recording available for this consultation.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleViewNotes = (consultation) => {
    if (consultation.notes) {
      setSelectedNotes(consultation);
      setShowNotesModal(true);
      toast.info(`Viewing notes for consultation ${consultation.id}`, {
        position: 'top-right',
        autoClose: 3000,
      });
    } else {
      toast.error('No notes available for this consultation.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleJoinConsultation = async (consultation) => {
    const now = new Date();
    const consultationTime = new Date(consultation.date);

    if (now < consultationTime) {
      const timeDiff = consultationTime - now;
      const minutesLeft = Math.floor(timeDiff / (1000 * 60));

      if (minutesLeft > 5) {
        toast.warning(`Consultation starts in ${minutesLeft} minutes. Please try again closer to the scheduled time.`, {
          position: 'top-right',
          autoClose: 3000,
        });
        return;
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: consultation.type === 'video',
        audio: true,
      });

      stream.getTracks().forEach((track) => track.stop());

      if (consultation.meetingLink) {
        window.open(consultation.meetingLink, '_blank', 'noopener,noreferrer');
        toast.success(`Joining consultation with ${consultation.doctor.name}`, {
          position: 'top-right',
          autoClose: 3000,
        });
      } else {
        toast.error('Meeting link not available. Please contact support.', {
          position: 'top-right',
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error(`Please enable ${consultation.type === 'video' ? 'camera and ' : ''}microphone permissions to join the consultation.`, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const renderCountdown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      return <span className="text-green-600 font-semibold">Ready to join!</span>;
    } else {
      return (
        <span className="text-gray-600">
          Starts in {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  const ConsultationTypeIcon = ({ type }) => {
    switch (type) {
      case 'video':
        return <FaVideo className="text-blue-500" />;
      case 'audio':
        return <FaPhone className="text-green-500" />;
      case 'chat':
        return <FaComment className="text-purple-500" />;
      default:
        return <FaUserMd />;
    }
  };

  const StatusBadge = ({ status }) => {
    const statusStyles = {
      scheduled: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`text-xs px-2 py-1 rounded-full ${statusStyles[status] || 'bg-gray-100'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const downloadConsultationDetails = (consultation) => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Consultation Details', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Doctor: ${consultation.doctor.name}`, 20, 40);
    doc.text(`Specialization: ${consultation.doctor.specialization}`, 20, 50);
    doc.text(`Date: ${new Date(consultation.date).toLocaleString()}`, 20, 60);
    doc.text(`Type: ${consultation.type}`, 20, 70);
    
    if (consultation.summary) {
      doc.text(`Summary: ${consultation.summary}`, 20, 80);
    }
    
    if (consultation.notes) {
      doc.text(`Notes: ${consultation.notes}`, 20, 90);
    }
    
    doc.save(`consultation_${consultation.id}.pdf`);
    toast.success('Consultation details exported as PDF', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

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
      />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 animate-scaleIn">
        <div className="flex items-center gap-3">
          <div className="relative">
            <FaUserMd className="text-3xl sm:text-4xl text-blue-600" aria-hidden="true" />
            <FaVideo className="absolute -bottom-1 right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
            Live Consultations
          </h1>
        </div>
        <button
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 sm:mt-0"
          onClick={() => setShowBookingForm(true)}
        >
          <FaCalendarAlt className="mr-2" /> Book New Consultation
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === 'upcoming' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 text-sm sm:text-base font-medium ${activeTab === 'past' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('past')}
        >
          Past Consultations
        </button>
      </div>

      {/* Upcoming Consultations Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('upcoming')}
        >
          <h2 className="text-lg font-medium text-gray-900">Upcoming Consultations</h2>
          {activeSections.upcoming ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.upcoming && activeTab === 'upcoming' && (
          <div className="px-6 py-4 space-y-4">
            {upcomingConsultations.length > 0 ? (
              upcomingConsultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start">
                    <img
                      src={consultation.doctor.photo}
                      alt={consultation.doctor.name}
                      className="w-16 h-16 rounded-full object-cover mb-4 sm:mb-0 sm:mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{consultation.doctor.name}</h3>
                          <p className="text-sm text-gray-600">{consultation.doctor.specialization}</p>
                        </div>
                        <StatusBadge status={consultation.status} />
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center text-sm text-gray-600 gap-3">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(consultation.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {new Date(consultation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center">
                          <ConsultationTypeIcon type={consultation.type} />
                          <span className="ml-1 capitalize">{consultation.type}</span>
                        </span>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        <Countdown date={consultation.date} renderer={renderCountdown} />
                      </div>
                      
                      <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <button
                          onClick={() => handleJoinConsultation(consultation)}
                          className={`px-4 py-2 rounded-md text-sm ${
                            consultationStatus[consultation.id] === 'ready'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-blue-600 text-white hover:bg-blue-700'
                          }`}
                        >
                          {consultationStatus[consultation.id] === 'ready' ? 'Doctor is Ready - Join Now' : 'Join Consultation'}
                        </button>
                        <button
                          onClick={() => toast.info('Canceling consultation...', { position: 'top-right', autoClose: 3000 })}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No upcoming consultations scheduled. Book a new consultation to get started.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Past Consultations Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('past')}
        >
          <h2 className="text-lg font-medium text-gray-900">Past Consultations</h2>
          {activeSections.past ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.past && activeTab === 'past' && (
          <div className="px-6 py-4 space-y-4">
            {pastConsultations.length > 0 ? (
              pastConsultations.map((consultation) => (
                <div key={consultation.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start">
                    <img
                      src={consultation.doctor.photo}
                      alt={consultation.doctor.name}
                      className="w-16 h-16 rounded-full object-cover mb-4 sm:mb-0 sm:mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{consultation.doctor.name}</h3>
                          <p className="text-sm text-gray-600">{consultation.doctor.specialization}</p>
                        </div>
                        <StatusBadge status="completed" />
                      </div>
                      
                      <div className="mt-3 flex flex-wrap items-center text-sm text-gray-600 gap-3">
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {new Date(consultation.date).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <FaClock className="mr-1" />
                          {new Date(consultation.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center">
                          <ConsultationTypeIcon type={consultation.type} />
                          <span className="ml-1 capitalize">{consultation.type}</span>
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium text-gray-800">Consultation Summary:</h4>
                        <p className="text-sm text-gray-600 mt-1">{consultation.summary}</p>
                      </div>
                      
                      <div className="mt-4 flex flex-wrap gap-2">
                        {consultation.prescriptionId && (
                          <button
                            onClick={() => handleViewPrescription(consultation.prescriptionId)}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 text-sm flex items-center"
                          >
                            <FaNotesMedical className="mr-1" /> View Prescription
                          </button>
                        )}
                        {consultation.recorded ? (
                          <button
                            onClick={() => handleReplayConsultation(consultation)}
                            className="px-3 py-1 bg-purple-100 text-purple-600 rounded-md hover:bg-purple-200 text-sm flex items-center"
                          >
                            <FaVideo className="mr-1" /> Replay Consultation
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewNotes(consultation)}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 text-sm flex items-center"
                          >
                            <FaNotesMedical className="mr-1" /> View Notes
                          </button>
                        )}
                        <button
                          onClick={() => downloadConsultationDetails(consultation)}
                          className="px-3 py-1 bg-green-100 text-green-600 rounded-md hover:bg-green-200 text-sm flex items-center"
                        >
                          <FaDownload className="mr-1" /> Export Details
                        </button>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-800 mb-2">Rate this consultation:</h4>
                        {feedbackStore[consultation.id] ? (
                          <div className="text-sm text-gray-600">
                            <p>Submitted: {new Date(feedbackStore[consultation.id].submittedAt).toLocaleString()}</p>
                            <p>Rating: {feedbackStore[consultation.id].rating} star{feedbackStore[consultation.id].rating !== 1 ? 's' : ''}</p>
                            <p>Feedback: {feedbackStore[consultation.id].feedback}</p>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center mb-2">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button 
                                  key={star} 
                                  onClick={() => setRating(star)} 
                                  className="text-xl mr-1"
                                >
                                  {star <= (rating || 0) ? <FaStar className="text-yellow-400" /> : <FaRegStar className="text-gray-400" />}
                                </button>
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {rating ? `${rating} star${rating !== 1 ? 's' : ''}` : 'Not rated'}
                              </span>
                            </div>
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Share your feedback (optional)"
                              className="w-full p-2 border border-gray-300 rounded-md text-sm"
                              rows="2"
                            />
                            <button
                              onClick={() => handleRateConsultation(consultation.id, rating, feedback)}
                              disabled={!rating}
                              className={`mt-2 px-4 py-2 rounded-md text-sm ${rating ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                            >
                              Submit Feedback
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No past consultations found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Book New Consultation</h2>
                  <button 
                    onClick={() => setShowBookingForm(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <select
                      value={selectedSpecialization}
                      onChange={(e) => setSelectedSpecialization(e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded-md"
                    >
                      <option value="">Select a specialization</option>
                      {specializations.map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedSpecialization && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
                      <select
                        value={selectedDoctor?.id || ''}
                        onChange={(e) => {
                          const docId = e.target.value;
                          setSelectedDoctor(doctors.find((d) => d.id === parseInt(docId)));
                        }}
                        className="w-full p-2 text-sm border border-gray-300 rounded-md"
                      >
                        <option value="">Select a doctor</option>
                        {doctors
                          .filter((doc) => doc.specialization === selectedSpecialization)
                          .map((doc) => (
                            <option key={doc.id} value={doc.id}>
                              {doc.name} ({doc.rating}★)
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
                  
                  {selectedDoctor && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <select
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="w-full p-2 text-sm border border-gray-300 rounded-md"
                        >
                          <option value="">Select a date</option>
                          {[...new Set(selectedDoctor.availableSlots.map((slot) => slot.split('T')[0]))].map((date) => (
                            <option key={date} value={date}>
                              {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
                          <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">Select a time</option>
                            {selectedDoctor.availableSlots
                              .filter((slot) => slot.startsWith(selectedDate))
                              .map((slot) => {
                                const time = slot.split('T')[1];
                                return (
                                  <option key={slot} value={time}>
                                    {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </option>
                                );
                              })}
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Type</label>
                        <div className="flex flex-wrap gap-4">
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="consultationType"
                              value="video"
                              checked={consultationType === 'video'}
                              onChange={() => setConsultationType('video')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 flex items-center">
                              <FaVideo className="mr-1 text-blue-500" /> Video
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="consultationType"
                              value="audio"
                              checked={consultationType === 'audio'}
                              onChange={() => setConsultationType('audio')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 flex items-center">
                              <FaPhone className="mr-1 text-green-500" /> Audio
                            </span>
                          </label>
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              name="consultationType"
                              value="chat"
                              checked={consultationType === 'chat'}
                              onChange={() => setConsultationType('chat')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 flex items-center">
                              <FaComment className="mr-1 text-purple-500" /> Chat
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setShowDoctorModal(true)}
                        className="text-blue-600 text-sm underline"
                      >
                        View Doctor Profile
                      </button>
                    </>
                  )}
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleBookConsultation}
                      disabled={!selectedDoctor || !selectedDate || !selectedTime}
                      className={`w-full py-2 px-4 rounded-md text-sm ${selectedDoctor && selectedDate && selectedTime ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    >
                      Confirm Booking
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doctor Profile Modal */}
      <AnimatePresence>
        {showDoctorModal && selectedDoctor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Doctor Profile</h2>
                  <button 
                    onClick={() => setShowDoctorModal(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <img
                    src={selectedDoctor.photo}
                    alt={selectedDoctor.name}
                    className="w-20 h-20 rounded-full object-cover mb-4 sm:mb-0 sm:mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedDoctor.name}</h3>
                    <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`text-sm ${star <= Math.floor(selectedDoctor.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-gray-600">{selectedDoctor.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 space-y-3 text-sm">
                  <div>
                    <span className="font-medium">Experience:</span> {selectedDoctor.experience}
                  </div>
                  <div>
                    <span className="font-medium">Languages:</span> {selectedDoctor.languages.join(', ')}
                  </div>
                  <div>
                    <span className="font-medium">Next Available:</span> {new Date(selectedDoctor.availableSlots[0]).toLocaleString()}
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowDoctorModal(false)}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prescription Modal */}
      <AnimatePresence>
        {showPrescriptionModal && selectedPrescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Prescription Details</h2>
                  <button 
                    onClick={() => setShowPrescriptionModal(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Prescription ID:</span> {selectedPrescription.id}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Issued By:</span> {selectedPrescription.doctorName}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {selectedPrescription.issuedDate}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800">Medications:</h4>
                    <ul className="list-disc pl-5 text-sm">
                      {selectedPrescription.medications.map((med, index) => (
                        <li key={index} className="mt-1">
                          {med.name} - {med.dosage}, {med.frequency} for {med.duration}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800">Instructions:</h4>
                    <p className="text-sm text-gray-600">{selectedPrescription.instructions}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowPrescriptionModal(false)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Replay Modal */}
      <AnimatePresence>
        {showReplayModal && selectedReplay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-3xl"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Replay Consultation</h2>
                  <button 
                    onClick={() => setShowReplayModal(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video controls className="w-full h-full" src={selectedReplay.recordingUrl}>
                      Your browser does not support the video tag.
                    </video>
                  </div>
                  
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Doctor:</span> {selectedReplay.doctor.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {new Date(selectedReplay.date).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {selectedReplay.type}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowReplayModal(false)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Modal */}
      <AnimatePresence>
        {showNotesModal && selectedNotes && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Consultation Notes</h2>
                  <button 
                    onClick={() => setShowNotesModal(false)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Doctor:</span> {selectedNotes.doctor.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {new Date(selectedNotes.date).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Type:</span> {selectedNotes.type}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-800">Notes:</h4>
                    <p className="text-sm text-gray-600">{selectedNotes.notes}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={() => setShowNotesModal(false)}
                      className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveConsultations;
import React, { useState } from 'react';
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, 
  FaHourglassHalf, FaTimesCircle, FaSearch, FaFilter, 
  FaPlus, FaSort, FaSortUp, FaSortDown, FaList, 
  FaCalendar, FaNotesMedical, FaProcedures
} from 'react-icons/fa';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import { MdAccessTime, MdEventNote, MdOutlineMedicalServices } from 'react-icons/md';

// Custom CSS for animations and responsive layout
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
  .appointment-header {
    position: relative;
    z-index: 10;
  }
  
  /* Mobile-specific styles */
  @media (max-width: 768px) {
    .summary-cards-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 16px;
    }
    
    .summary-card {
      padding: 12px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .mobile-appointment-card {
      width: 100%;
      padding: 16px;
      margin-bottom: 12px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      background: white;
    }
    
    .mobile-appointment-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }
    
    .mobile-appointment-detail {
      display: flex;
      margin-bottom: 8px;
    }
    
    .mobile-detail-label {
      width: 100px;
      font-weight: 500;
      color: #666;
    }
    
    .mobile-detail-value {
      flex: 1;
    }
    
    .mobile-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }
    
    .mobile-action-btn {
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 14px;
      display: flex;
      align-items: center;
    }
    
    .mobile-view-toggle {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
    }
    
    .mobile-view-btn {
      flex: 1;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }
  }
  
  /* Desktop styles */
  @media (min-width: 769px) {
    .summary-cards-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .mobile-appointment-view {
      display: none;
    }
    
    .mobile-view-toggle {
      display: none;
    }
  }
`;

// Mock appointment data
const initialAppointments = [
  { id: 1, patientName: 'John Smith', date: '2025-06-15', time: '09:30 AM', visitType: 'In-Person', reason: 'Annual Checkup', status: 'Confirmed', gender: 'Male', age: 35, contact: 'john.smith@example.com', doctor: 'Dr. Sarah Johnson' },
  { id: 2, patientName: 'Emma Wilson', date: '2025-06-16', time: '11:00 AM', visitType: 'Online', reason: 'Follow-up Consultation', status: 'Pending', gender: 'Female', age: 28, contact: 'emma.wilson@example.com', doctor: 'Dr. Sarah Johnson' },
  { id: 3, patientName: 'Michael Chen', date: '2025-06-17', time: '02:15 PM', visitType: 'In-Person', reason: 'Chest Pain', status: 'Confirmed', gender: 'Male', age: 45, contact: 'michael.chen@example.com', doctor: 'Dr. Sarah Johnson' },
  { id: 4, patientName: 'Sophia Brown', date: '2025-06-18', time: '10:45 AM', visitType: 'Online', reason: 'Blood Pressure Check', status: 'Cancelled', gender: 'Female', age: 60, contact: 'sophia.brown@example.com', doctor: 'Dr. James Lee' },
  { id: 5, patientName: 'Liam Davis', date: '2025-06-19', time: '03:30 PM', visitType: 'In-Person', reason: 'Routine ECG', status: 'Pending', gender: 'Male', age: 50, contact: 'liam.davis@example.com', doctor: 'Dr. Sarah Johnson' },
  { id: 6, patientName: 'Olivia Martinez', date: '2025-06-20', time: '08:00 AM', visitType: 'Online', reason: 'Medication Review', status: 'Confirmed', gender: 'Female', age: 32, contact: 'olivia.martinez@example.com', doctor: 'Dr. Sarah Johnson' },
];

// Mock patient and doctor lists
const patients = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Emma Wilson' },
  { id: '3', name: 'Michael Chen' },
  { id: '4', name: 'Sophia Brown' },
  { id: '5', name: 'Liam Davis' },
  { id: '6', name: 'Olivia Martinez' },
];

const doctors = [
  { id: '1', name: 'Dr. Sarah Johnson', specialty: 'Cardiology' },
  { id: '2', name: 'Dr. James Lee', specialty: 'Neurology' },
];

const Appointments = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [view, setView] = useState('list');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'asc' });
  const appointmentsPerPage = 5;

  // Sorting logic
  const sortAppointments = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...appointments].sort((a, b) => {
      if (key === 'date') {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      return direction === 'asc'
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });
    setAppointments(sorted);
  };

  // Filtering logic
  const filteredAppointments = appointments.filter((appt) => {
    const matchesSearch =
      appt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || appt.status === statusFilter;
    const matchesDateRange =
      (!dateRange.start || new Date(appt.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(appt.date) <= new Date(dateRange.end));
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  // Pagination logic
  const indexOfLastAppointment = currentPage * appointmentsPerPage;
  const indexOfFirstAppointment = indexOfLastAppointment - appointmentsPerPage;
  const currentAppointments = filteredAppointments.slice(indexOfFirstAppointment, indexOfLastAppointment);
  const totalPages = Math.ceil(filteredAppointments.length / appointmentsPerPage);

  // Calendar view data
  const daysInMonth = Array.from({ length: 30 }, (_, i) => ({
    date: `2025-06-${String(i + 1).padStart(2, '0')}`,
    appointments: filteredAppointments.filter((appt) => appt.date === `2025-06-${String(i + 1).padStart(2, '0')}`),
  }));

  // Action handlers
  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleConfirm = (id) => {
    setAppointments(appointments.map((appt) =>
      appt.id === id ? { ...appt, status: 'Confirmed' } : appt
    ));
  };

  const handleReschedule = (id) => {
    console.log(`Reschedule appointment ${id}`);
  };

  const handleCancel = (id) => {
    setAppointments(appointments.map((appt) =>
      appt.id === id ? { ...appt, status: 'Cancelled' } : appt
    ));
    setSelectedAppointment(null);
  };

  const handleAddAppointment = (newAppointment) => {
    setAppointments([...appointments, {
      id: appointments.length + 1,
      ...newAppointment,
      status: 'Pending',
    }]);
    setShowAddModal(false);
  };

  // Handle click outside to close modals
  const handleOutsideClick = (e, setModalState) => {
    if (e.target.classList.contains('modal-container')) {
      setModalState(false);
    }
  };

  // Get status counts for summary cards
  const statusCounts = {
    today: appointments.filter((appt) => appt.date === '2025-06-20').length,
    confirmed: appointments.filter((appt) => appt.status === 'Confirmed').length,
    pending: appointments.filter((appt) => appt.status === 'Pending').length,
    cancelled: appointments.filter((appt) => appt.status === 'Cancelled').length
  };

  return (
    <div className="relative p-4 md:p-8">
      <style>{styles}</style>
      
      {/* Header */}
      <div className={`appointment-header ${(showAddModal || showFilterModal || selectedAppointment) ? 'relative z-50' : ''}`}>
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <div className="flex items-center gap-3 animate-scaleIn">
            <div className="relative">
              <FaCalendarAlt className="text-3xl md:text-4xl text-blue-600" aria-hidden="true" />
              <MdOutlineMedicalServices className="absolute -bottom-1 -right-1 text-lg md:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
              Appointments
              <span className="ml-2 md:ml-3 text-xs md:text-sm font-normal bg-blue-100 text-blue-800 px-2 py-0.5 md:px-3 md:py-1 rounded-full">
                {appointments.length} total
              </span>
            </h2>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center bg-red-600 text-white px-3 py-2 md:px-5 md:py-3 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all group"
            aria-label="Add new appointment"
          >
            <FaPlus className="mr-1 md:mr-2 transition-transform group-hover:rotate-90" />
            <span className="font-semibold text-sm md:text-base">Add Appointment</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - 4 cards responsive layout */}
      <div className="summary-cards-container">
        {/* Today's Appointments */}
        <div className="summary-card bg-blue-100 text-blue-600 p-4 rounded-xl shadow-md transition-transform hover:scale-105">
          <div className="flex items-center mb-2">
            <FaCalendarAlt className="text-xl mr-2" />
            <span className="font-semibold">Today's Appointments</span>
          </div>
          <div className="text-2xl font-bold">{statusCounts.today}</div>
        </div>
        
        {/* Confirmed */}
        <div className="summary-card bg-green-100 text-green-600 p-4 rounded-xl shadow-md transition-transform hover:scale-105">
          <div className="flex items-center mb-2">
            <FaCheckCircle className="text-xl mr-2" />
            <span className="font-semibold">Confirmed</span>
          </div>
          <div className="text-2xl font-bold">{statusCounts.confirmed}</div>
        </div>
        
        {/* Pending */}
        <div className="summary-card bg-yellow-100 text-yellow-600 p-4 rounded-xl shadow-md transition-transform hover:scale-105">
          <div className="flex items-center mb-2">
            <FaHourglassHalf className="text-xl mr-2" />
            <span className="font-semibold">Pending</span>
          </div>
          <div className="text-2xl font-bold">{statusCounts.pending}</div>
        </div>
        
        {/* Cancelled */}
        <div className="summary-card bg-red-100 text-red-600 p-4 rounded-xl shadow-md transition-transform hover:scale-105">
          <div className="flex items-center mb-2">
            <FaTimesCircle className="text-xl mr-2" />
            <span className="font-semibold">Cancelled</span>
          </div>
          <div className="text-2xl font-bold">{statusCounts.cancelled}</div>
        </div>
      </div>

      {/* Main Content with Conditional Blur */}
      <div className={`transition-all duration-300 ${(showAddModal || showFilterModal || selectedAppointment) ? 'filter blur-sm opacity-90' : ''}`}>
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4 md:gap-6">
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by patient or reason..."
              className="pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search appointments"
            />
          </div>
          
          {/* Mobile View Toggle */}
          <div className="mobile-view-toggle w-full md:hidden">
            <button
              onClick={() => setView('list')}
              className={`mobile-view-btn ${
                view === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              aria-label="Switch to list view"
            >
              <FaList className="mr-2" />
              List
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`mobile-view-btn ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
              aria-label="Switch to calendar view"
            >
              <FaCalendar className="mr-2" />
              Calendar
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="mobile-view-btn bg-white text-gray-700 border border-gray-300"
              aria-label="Open filter options"
            >
              <FaFilter className="mr-2" />
              Filter
            </button>
          </div>
          
          {/* Desktop View Toggle */}
          <div className="hidden md:flex gap-4">
            <button
              onClick={() => setView('list')}
              className={`flex items-center px-5 py-3 rounded-lg shadow-md transition-all ${
                view === 'list'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              aria-label="Switch to list view"
            >
              <FaList className="mr-2" />
              List View
            </button>
            <button
              onClick={() => setView('calendar')}
              className={`flex items-center px-5 py-3 rounded-lg shadow-md transition-all ${
                view === 'calendar'
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
              }`}
              aria-label="Switch to calendar view"
            >
              <FaCalendar className="mr-2" />
              Calendar View
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className="flex items-center px-5 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all group"
              aria-label="Open filter options"
            >
              <FaFilter className="mr-2 transition-transform group-hover:rotate-180" />
              Filters
            </button>
          </div>
        </div>

        {/* Main Content */}
        {view === 'list' ? (
          <>
            {/* Desktop List View */}
            <div className="hidden md:block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <AiOutlineUser className="mr-1" />
                            Patient
                            <button onClick={() => sortAppointments('patientName')} aria-label="Sort by patient name">
                              {sortConfig.key === 'patientName' ? (
                                sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                              ) : <FaSort className="ml-1" />}
                            </button>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <MdAccessTime className="mr-1" />
                            Date & Time
                            <button onClick={() => sortAppointments('date')} aria-label="Sort by date">
                              {sortConfig.key === 'date' ? (
                                sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                              ) : <FaSort className="ml-1" />}
                            </button>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <FaProcedures className="inline mr-1" />
                          Visit Type
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <FaNotesMedical className="inline mr-1" />
                          Reason
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <div className="flex items-center">
                            <FaCheckCircle className="mr-1" />
                            Status
                            <button onClick={() => sortAppointments('status')} aria-label="Sort by status">
                              {sortConfig.key === 'status' ? (
                                sortConfig.direction === 'asc' ? <FaSortUp className="ml-1" /> : <FaSortDown className="ml-1" />
                              ) : <FaSort className="ml-1" />}
                            </button>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          <FaUserMd className="inline mr-1" />
                          Doctor
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {currentAppointments.map((appointment, index) => (
                        <tr key={appointment.id} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                                <AiOutlineUser className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <div className="font-semibold text-gray-900">{appointment.patientName}</div>
                                <div className="text-sm text-gray-600">{appointment.gender}, {appointment.age}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-purple-100 rounded-full text-purple-600 mr-3">
                                <MdEventNote className="h-5 w-5" />
                              </div>
                              <div>
                                <div className="text-gray-900">{appointment.date}</div>
                                <div className="text-sm text-gray-600">{appointment.time}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              appointment.visitType === 'In-Person' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {appointment.visitType === 'In-Person' ? (
                                <FaProcedures className="inline mr-1" />
                              ) : (
                                <MdOutlineMedicalServices className="inline mr-1" />
                              )}
                              {appointment.visitType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <FaNotesMedical className="inline mr-1 text-gray-400" />
                            {appointment.reason}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${
                              appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                            }`}>
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
                          <td className="px-6 py-4 text-sm text-gray-600">
                            <FaUserMd className="inline mr-1 text-gray-400" />
                            {appointment.doctor}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => handleView(appointment)}
                                className="text-blue-600 hover:text-blue-900 transition-colors flex items-center"
                                aria-label={`View appointment for ${appointment.patientName}`}
                              >
                                <FaSearch className="mr-1" /> View
                              </button>
                              {appointment.status !== 'Confirmed' && (
                                <button
                                  onClick={() => handleConfirm(appointment.id)}
                                  className="text-green-600 hover:text-green-900 transition-colors flex items-center"
                                  aria-label={`Confirm appointment for ${appointment.patientName}`}
                                >
                                  <FaCheckCircle className="mr-1" /> Confirm
                                </button>
                              )}
                              <button
                                onClick={() => handleReschedule(appointment.id)}
                                className="text-yellow-600 hover:text-yellow-900 transition-colors flex items-center"
                                aria-label={`Reschedule appointment for ${appointment.patientName}`}
                              >
                                <FaCalendarAlt className="mr-1" /> Reschedule
                              </button>
                              {appointment.status !== 'Cancelled' && (
                                <button
                                  onClick={() => handleCancel(appointment.id)}
                                  className="text-red-600 hover:text-red-900 transition-colors flex items-center"
                                  aria-label={`Cancel appointment for ${appointment.patientName}`}
                                >
                                  <FaTimesCircle className="mr-1" /> Cancel
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Pagination */}
                <div className="flex justify-between items-center p-6">
                  <div className="text-sm text-gray-600">
                    Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length} appointments
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                      aria-label="Previous page"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 disabled:opacity-50 shadow-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                      aria-label="Next page"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile List View */}
            <div className="mobile-appointment-view md:hidden">
              {currentAppointments.map((appointment) => (
                <div key={appointment.id} className="mobile-appointment-card">
                  <div className="mobile-appointment-header">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-blue-100 rounded-full text-blue-600">
                        <AiOutlineUser className="h-5 w-5" />
                      </div>
                      <div className="ml-3">
                        <div className="font-semibold">{appointment.patientName}</div>
                        <div className="text-xs text-gray-600">{appointment.gender}, {appointment.age}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                  
                  <div className="mobile-appointment-detail">
                    <div className="mobile-detail-label">Date/Time</div>
                    <div className="mobile-detail-value">
                      {appointment.date} at {appointment.time}
                    </div>
                  </div>
                  
                  <div className="mobile-appointment-detail">
                    <div className="mobile-detail-label">Visit Type</div>
                    <div className="mobile-detail-value">
                      {appointment.visitType}
                    </div>
                  </div>
                  
                  <div className="mobile-appointment-detail">
                    <div className="mobile-detail-label">Reason</div>
                    <div className="mobile-detail-value">
                      {appointment.reason}
                    </div>
                  </div>
                  
                  <div className="mobile-appointment-detail">
                    <div className="mobile-detail-label">Doctor</div>
                    <div className="mobile-detail-value">
                      {appointment.doctor}
                    </div>
                  </div>
                  
                  <div className="mobile-actions">
                    <button
                      onClick={() => handleView(appointment)}
                      className="mobile-action-btn bg-blue-100 text-blue-700"
                      aria-label={`View appointment for ${appointment.patientName}`}
                    >
                      <FaSearch className="mr-1" /> View
                    </button>
                    {appointment.status !== 'Confirmed' && (
                      <button
                        onClick={() => handleConfirm(appointment.id)}
                        className="mobile-action-btn bg-green-100 text-green-700"
                        aria-label={`Confirm appointment for ${appointment.patientName}`}
                      >
                        <FaCheckCircle className="mr-1" /> Confirm
                      </button>
                    )}
                    <button
                      onClick={() => handleReschedule(appointment.id)}
                      className="mobile-action-btn bg-yellow-100 text-yellow-700"
                      aria-label={`Reschedule appointment for ${appointment.patientName}`}
                    >
                      <FaCalendarAlt className="mr-1" /> Reschedule
                    </button>
                    {appointment.status !== 'Cancelled' && (
                      <button
                        onClick={() => handleCancel(appointment.id)}
                        className="mobile-action-btn bg-red-100 text-red-700"
                        aria-label={`Cancel appointment for ${appointment.patientName}`}
                      >
                        <FaTimesCircle className="mr-1" /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Mobile Pagination */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {indexOfFirstAppointment + 1} to {Math.min(indexOfLastAppointment, filteredAppointments.length)} of {filteredAppointments.length}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 disabled:opacity-50"
                    aria-label="Previous page"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 disabled:opacity-50"
                    aria-label="Next page"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FaCalendar className="mr-2 text-blue-600" />
                June 2025
              </h3>
              <div className="flex gap-2 md:gap-3">
                <button
                  className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Previous month"
                >
                  &lt;
                </button>
                <button
                  className="px-3 py-1 md:px-4 md:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  aria-label="Next month"
                >
                  &gt;
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 md:gap-3 text-center">
              <div className="text-xs md:text-sm font-semibold text-gray-600">Sun</div>
              <div className="text-xs md:text-sm font-semibold text-gray-600">Mon</div>
              <div className="text-xs md:text-sm font-semibold text-gray-600">Tue</div>
              <div className="text-xs md:text-sm font-semibold text-gray-600">Wed</div>
              <div className="text-xs md:text-sm font-semibold text-gray-600">Thu</div>
              <div className="text-xs md:text-sm font-semibold text-gray-600">Fri</div>
              <div className="text-xs md:text-sm font-semibold text-gray-600">Sat</div>
              {daysInMonth.map((day, index) => (
                <div
                  key={day.date}
                  className={`p-1 md:p-3 border border-gray-200 rounded-md transition-transform hover:scale-105 min-h-16 md:min-h-24 ${
                    day.appointments.length > 0 ? 'bg-blue-50 hover:bg-blue-100 cursor-pointer' : 'bg-gray-50'
                  } ${index < 7 && index !== 0 ? 'border-l-2' : ''}`}
                  onClick={() => day.appointments.length > 0 && setSelectedAppointment(day.appointments[0])}
                  aria-label={`View appointments for ${day.date}`}
                >
                  <div className="text-xs md:text-sm font-semibold text-gray-900">{parseInt(day.date.split('-')[2])}</div>
                  {day.appointments.map((appt) => (
                    <div
                      key={appt.id}
                      className="mt-1 p-1 md:mt-2 md:p-2 bg-white rounded-md shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedAppointment(appt);
                      }}
                    >
                      <div className="text-xxs md:text-xs font-semibold text-gray-900 flex items-center">
                        <MdAccessTime className="mr-1" />
                        {appt.time}
                      </div>
                      <div className="text-xxs md:text-xs text-gray-600 flex items-center">
                        <AiOutlineUser className="mr-1" />
                        {appt.patientName}
                      </div>
                      <div className="text-xxs md:text-xs text-gray-500 truncate flex items-center">
                        <FaNotesMedical className="mr-1" />
                        {appt.reason}
                      </div>
                      <span
                        className={`mt-0.5 px-1 md:mt-1 md:px-2 inline-flex text-xxs md:text-xs leading-5 font-semibold rounded-full ${
                          appt.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                          appt.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {appt.status === 'Confirmed' ? (
                          <FaCheckCircle className="inline mr-0.5 md:mr-1" />
                        ) : appt.status === 'Pending' ? (
                          <FaHourglassHalf className="inline mr-0.5 md:mr-1" />
                        ) : (
                          <FaTimesCircle className="inline mr-0.5 md:mr-1" />
                        )}
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showFilterModal && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 ml-0 md:ml-64 pt-16 modal-backdrop"
          onClick={(e) => handleOutsideClick(e, setShowFilterModal)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 md:p-8 animate-fadeIn">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FaFilter className="mr-2 text-blue-600" />
                Filter Appointments
              </h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close filter modal"
              >
                &times;
              </button>
            </div>
            <div className="mt-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 flex items-center">
                  <FaCheckCircle className="mr-2" />
                  Status
                </label>
                <select
                  className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  aria-label="Filter by status"
                >
                  <option value="All">All Statuses</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    aria-label="Filter by start date"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    End Date
                  </label>
                  <input
                    type="date"
                    className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    aria-label="Filter by end date"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => {
                    setStatusFilter('All');
                    setDateRange({ start: '', end: '' });
                    setShowFilterModal(false);
                  }}
                  className="px-5 py-2.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
                  aria-label="Reset filters"
                >
                  <FaTimesCircle className="mr-2" />
                  Reset
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
                  aria-label="Apply filters"
                >
                  <FaCheckCircle className="mr-2" />
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedAppointment && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 ml-0 md:ml-64 pt-16 modal-backdrop"
          onClick={(e) => handleOutsideClick(e, setSelectedAppointment)}
        >
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto p-6 md:p-8 animate-fadeIn">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                <MdEventNote className="mr-2 text-blue-600" />
                Appointment Details
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
                aria-label="Close appointment details"
              >
                &times;
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <AiOutlineUser className="mr-2 text-blue-600" />
                  Patient Information
                </h4>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Name:</span> 
                    <span className="font-medium">{selectedAppointment.patientName}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Gender/Age:</span> 
                    <span className="font-medium">{selectedAppointment.gender}, {selectedAppointment.age}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Contact:</span> 
                    <span className="font-medium">{selectedAppointment.contact}</span>
                  </p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FaCalendarAlt className="mr-2 text-blue-600" />
                  Appointment Details
                </h4>
                <div className="space-y-2">
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Date:</span> 
                    <span className="font-medium">{selectedAppointment.date} at {selectedAppointment.time}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Visit Type:</span> 
                    <span className="font-medium">{selectedAppointment.visitType}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Doctor:</span> 
                    <span className="font-medium">{selectedAppointment.doctor}</span>
                  </p>
                  <p className="flex items-center">
                    <span className="text-gray-600 w-24 inline-block">Status:</span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      selectedAppointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      selectedAppointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}
                    >
                      {selectedAppointment.status === 'Confirmed' ? (
                        <FaCheckCircle className="inline mr-1" />
                      ) : selectedAppointment.status === 'Pending' ? (
                        <FaHourglassHalf className="inline mr-1" />
                      ) : (
                        <FaTimesCircle className="inline mr-1" />
                      )}
                      {selectedAppointment.status}
                    </span>
                  </p>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FaNotesMedical className="mr-2 text-blue-600" />
                  Reason for Visit
                </h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedAppointment.reason}</p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              {selectedAppointment.status !== 'Cancelled' && (
                <button
                  onClick={() => handleCancel(selectedAppointment.id)}
                  className="px-4 py-2 md:px-5 md:py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all flex items-center"
                  aria-label="Cancel appointment"
                >
                  <FaTimesCircle className="mr-2" />
                  Cancel Appointment
                </button>
              )}
              <button
                onClick={() => handleReschedule(selectedAppointment.id)}
                className="px-4 py-2 md:px-5 md:py-3 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
                aria-label="Reschedule appointment"
              >
                <FaCalendarAlt className="mr-2" />
                Reschedule
              </button>
              <button
                onClick={() => console.log(`Start visit for ${selectedAppointment.patientName}`)}
                className="px-4 py-2 md:px-5 md:py-3 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
                aria-label="Start visit"
              >
                <FaUserMd className="mr-2" />
                Start Visit
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddAppointmentModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddAppointment}
          patients={patients}
          doctors={doctors}
          handleOutsideClick={handleOutsideClick}
        />
      )}
    </div>
  );
};

const AddAppointmentModal = ({ onClose, onAdd, patients, doctors, handleOutsideClick }) => {
  const [formData, setFormData] = useState({
    patient: '',
    date: '',
    time: '',
    visitType: 'In-Person',
    reason: '',
    doctor: '1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedPatient = patients.find((p) => p.id === formData.patient);
    const selectedDoctor = doctors.find((d) => d.id === formData.doctor);
    
    if (selectedPatient && selectedDoctor && formData.date && formData.time && formData.reason) {
      onAdd({
        patientName: selectedPatient.name,
        date: formData.date,
        time: formData.time,
        visitType: formData.visitType,
        reason: formData.reason,
        doctor: selectedDoctor.name,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        age: Math.floor(Math.random() * 50 + 20),
        contact: `${selectedPatient.name.toLowerCase().replace(' ', '.')}@example.com`,
      });
    } else {
      alert('Please fill all required fields');
    }
  };

  return (
    <div
      className="modal-container fixed inset-0 flex items-center justify-center z-50 ml-0 md:ml-64 pt-16 modal-backdrop"
      onClick={(e) => handleOutsideClick(e, onClose)}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 md:p-8 animate-fadeIn">
        <div className="flex justify-between items-start">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <FaPlus className="mr-2 text-blue-600" />
            Add New Appointment
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
            aria-label="Close appointment modal"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div>
            <label htmlFor="patient" className="block text-sm font-semibold text-gray-900 flex items-center">
              <AiOutlineUser className="mr-2" />
              Patient
            </label>
            <select
              id="patient"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.patient}
              onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
              required
              aria-label="Select patient"
            >
              <option value="">Select Patient</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="doctor" className="block text-sm font-semibold text-gray-900 flex items-center">
              <FaUserMd className="mr-2" />
              Doctor
            </label>
            <select
              id="doctor"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              required
              aria-label="Select doctor"
            >
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialty})
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-semibold text-gray-900 flex items-center">
                <FaCalendarAlt className="mr-2" />
                Date
              </label>
              <input
                id="date"
                type="date"
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                aria-label="Select appointment date"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-semibold text-gray-900 flex items-center">
                <FaClock className="mr-2" />
                Time
              </label>
              <input
                id="time"
                type="time"
                className="mt-1 block w-full border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
                aria-label="Select appointment time"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 flex items-center">
              <FaProcedures className="mr-2" />
              Visit Type
            </label>
            <div className="mt-2 flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visitType"
                  value="In-Person"
                  checked={formData.visitType === 'In-Person'}
                  onChange={() => setFormData({ ...formData, visitType: 'In-Person' })}
                  className="form-radio text-blue-600"
                  aria-label="Select in-person visit"
                />
                <span className="ml-2 text-gray-700">In-Person</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="visitType"
                  value="Online"
                  checked={formData.visitType === 'Online'}
                  onChange={() => setFormData({ ...formData, visitType: 'Online' })}
                  className="form-radio text-blue-600"
                  aria-label="Select online visit"
                />
                <span className="ml-2 text-gray-700">Online</span>
              </label>
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-semibold text-gray-900 flex items-center">
              <FaNotesMedical className="mr-2" />
              Reason
            </label>
            <textarea
              id="reason"
              rows="3"
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              aria-label="Enter reason for appointment"
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 md:px-5 md:py-3 rounded-md border border-gray-300 text-sm font-medium text-gray-800 hover:bg-gray-100 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
              aria-label="Cancel appointment"
            >
              <FaTimesCircle className="mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 md:px-5 md:py-3 rounded-md text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center"
              aria-label="Save appointment"
            >
              <FaCheckCircle className="mr-2" />
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Appointments;
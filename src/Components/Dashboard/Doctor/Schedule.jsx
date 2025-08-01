import { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaCheck, 
  FaTimes, 
  FaSpinner,
  FaExclamationCircle,
  FaChevronUp,
  FaChevronDown,
  FaPlus,
  FaSave,
  FaEllipsisH,
  FaRegCalendarCheck,
  FaRegCalendarTimes,
  FaRegClock
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Schedule = () => {
  // State for UI controls
  const [expandedSections, setExpandedSections] = useState({
    weeklyView: true,
    upcomingAppointments: true,
    availability: true
  });

  // State for mobile view detection
  const [isMobile, setIsMobile] = useState(false);
  const [showDropdown, setShowDropdown] = useState(null);
  const [selectedDay, setSelectedDay] = useState('monday');
  const [rescheduleData, setRescheduleData] = useState({
    appointmentId: null,
    day: null,
    time: null,
    showModal: false
  });

  // Data states with loading and error handling
  const [schedule, setSchedule] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState({
    schedule: false,
    appointments: false,
    availability: false,
    reschedule: false
  });
  const [errors, setErrors] = useState({
    schedule: null,
    appointments: null,
    availability: null,
    reschedule: null
  });

  // Form state
  const [availabilityForm, setAvailabilityForm] = useState({
    monday: { start: '9:00 AM', end: '5:00 PM' },
    tuesday: { start: '9:00 AM', end: '5:00 PM' },
    wednesday: { start: '9:00 AM', end: '5:00 PM' },
    thursday: { start: '9:00 AM', end: '5:00 PM' },
    friday: { start: '9:00 AM', end: '5:00 PM' },
    saturday: { start: '9:00 AM', end: '1:00 PM' },
    sunday: { start: '', end: '' }
  });

  // Days and time slots
  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  // Check screen size on mount and resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showDropdown) setShowDropdown(null);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  // Fetch data
  useEffect(() => {
    let isMounted = true;
    
    const fetchSchedule = async () => {
      if (!isMounted) return;
      setIsLoading(prev => ({ ...prev, schedule: true }));
      try {
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockSchedule = {
          monday: [
            { time: '9:00 AM', status: 'booked', patient: 'John Smith', type: 'Follow-up' },
            { time: '10:00 AM', status: 'available' },
            { time: '11:00 AM', status: 'booked', patient: 'Sarah Johnson', type: 'Checkup' },
            { time: '12:00 PM', status: 'blocked', note: 'Lunch break' },
            { time: '1:00 PM', status: 'available' },
            { time: '2:00 PM', status: 'booked', patient: 'Michael Brown', type: 'Vaccination' },
            { time: '3:00 PM', status: 'available' },
            { time: '4:00 PM', status: 'booked', patient: 'Emily Davis', type: 'Consultation' }
          ],
          tuesday: [
            { time: '9:00 AM', status: 'available' },
            { time: '10:00 AM', status: 'booked', patient: 'Robert Wilson', type: 'Follow-up' },
            { time: '11:00 AM', status: 'available' },
            { time: '12:00 PM', status: 'blocked', note: 'Lunch break' },
            { time: '1:00 PM', status: 'available' },
            { time: '2:00 PM', status: 'booked', patient: 'Lisa Miller', type: 'Checkup' },
            { time: '3:00 PM', status: 'available' },
            { time: '4:00 PM', status: 'booked', patient: 'David Taylor', type: 'Consultation' }
          ],
          wednesday: [
            { time: '9:00 AM', status: 'available' },
            { time: '10:00 AM', status: 'booked', patient: 'Thomas Anderson', type: 'Follow-up' },
            { time: '11:00 AM', status: 'available' },
            { time: '12:00 PM', status: 'blocked', note: 'Lunch break' },
            { time: '1:00 PM', status: 'available' },
            { time: '2:00 PM', status: 'booked', patient: 'Jennifer Lopez', type: 'Checkup' },
            { time: '3:00 PM', status: 'available' },
            { time: '4:00 PM', status: 'booked', patient: 'William Johnson', type: 'Vaccination' }
          ],
          thursday: [
            { time: '9:00 AM', status: 'available' },
            { time: '10:00 AM', status: 'booked', patient: 'Maria Garcia', type: 'Follow-up' },
            { time: '11:00 AM', status: 'available' },
            { time: '12:00 PM', status: 'blocked', note: 'Lunch break' },
            { time: '1:00 PM', status: 'available' },
            { time: '2:00 PM', status: 'booked', patient: 'James Smith', type: 'Consultation' },
            { time: '3:00 PM', status: 'available' },
            { time: '4:00 PM', status: 'booked', patient: 'Patricia Brown', type: 'Checkup' }
          ],
          friday: [
            { time: '9:00 AM', status: 'available' },
            { time: '10:00 AM', status: 'booked', patient: 'Robert Johnson', type: 'Follow-up' },
            { time: '11:00 AM', status: 'available' },
            { time: '12:00 PM', status: 'blocked', note: 'Lunch break' },
            { time: '1:00 PM', status: 'available' },
            { time: '2:00 PM', status: 'booked', patient: 'Linda Davis', type: 'Vaccination' },
            { time: '3:00 PM', status: 'available' },
            { time: '4:00 PM', status: 'booked', patient: 'Michael Miller', type: 'Consultation' }
          ],
          saturday: [
            { time: '9:00 AM', status: 'available' },
            { time: '10:00 AM', status: 'booked', patient: 'Barbara Wilson', type: 'Checkup' },
            { time: '11:00 AM', status: 'available' },
            { time: '12:00 PM', status: 'blocked', note: 'Lunch break' }
          ],
          sunday: []
        };
        if (isMounted) {
          setSchedule(mockSchedule);
          setErrors(prev => ({ ...prev, schedule: null }));
        }
      } catch (err) {
        if (isMounted) {
          setErrors(prev => ({ ...prev, schedule: 'Failed to load schedule' }));
          toast.error('Failed to load schedule data');
        }
      } finally {
        if (isMounted) setIsLoading(prev => ({ ...prev, schedule: false }));
      }
    };

    const fetchAppointments = async () => {
      if (!isMounted) return;
      setIsLoading(prev => ({ ...prev, appointments: true }));
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockAppointments = [
          {
            id: 'APT-001',
            patientName: 'John Smith',
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            time: '10:00 AM',
            status: 'Confirmed',
            reason: 'Follow-up consultation',
            type: 'Follow-up'
          },
          {
            id: 'APT-002',
            patientName: 'Sarah Johnson',
            date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
            time: '2:30 PM',
            status: 'Pending',
            reason: 'Annual checkup',
            type: 'Checkup'
          },
          {
            id: 'APT-003',
            patientName: 'Michael Brown',
            date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
            time: '11:00 AM',
            status: 'Confirmed',
            reason: 'Vaccination',
            type: 'Vaccination'
          },
        ];
        if (isMounted) {
          setAppointments(mockAppointments);
          setErrors(prev => ({ ...prev, appointments: null }));
        }
      } catch (err) {
        if (isMounted) {
          setErrors(prev => ({ ...prev, appointments: 'Failed to load appointments' }));
          toast.error('Failed to load appointments');
        }
      } finally {
        if (isMounted) setIsLoading(prev => ({ ...prev, appointments: false }));
      }
    };

    fetchSchedule();
    fetchAppointments();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleAvailabilityChange = (day, field, value) => {
    setAvailabilityForm(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const saveAvailability = async () => {
    try {
      setIsLoading(prev => ({ ...prev, availability: true }));
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Availability saved successfully!');
      setErrors(prev => ({ ...prev, availability: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, availability: 'Failed to save availability' }));
      toast.error('Failed to save availability');
    } finally {
      setIsLoading(prev => ({ ...prev, availability: false }));
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleAppointmentAction = (appointmentId, action) => {
    if (action === 'reschedule') {
      const appointment = appointments.find(a => a.id === appointmentId);
      setRescheduleData({
        appointmentId,
        day: null,
        time: null,
        showModal: true
      });
      return;
    }

    const updatedAppointments = appointments.map(appointment => {
      if (appointment.id === appointmentId) {
        if (action === 'confirm') {
          toast.success(`Appointment ${appointmentId} confirmed!`);
          return { ...appointment, status: 'Confirmed' };
        } else if (action === 'cancel') {
          toast.warn(`Appointment ${appointmentId} cancelled`);
          return { ...appointment, status: 'Cancelled' };
        }
      }
      return appointment;
    });
    
    setAppointments(updatedAppointments);
    setShowDropdown(null);
  };

  const toggleDropdown = (appointmentId, e) => {
    e.stopPropagation();
    setShowDropdown(showDropdown === appointmentId ? null : appointmentId);
  };

  const selectDay = (day) => {
    setSelectedDay(day);
  };

  const handleReschedule = async () => {
    if (!rescheduleData.day || !rescheduleData.time) {
      toast.error('Please select both day and time');
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, reschedule: true }));
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const updatedAppointments = appointments.map(appointment => {
        if (appointment.id === rescheduleData.appointmentId) {
          return { 
            ...appointment, 
            date: new Date().toISOString().split('T')[0],
            time: rescheduleData.time,
            status: 'Confirmed'
          };
        }
        return appointment;
      });

      const updatedSchedule = { ...schedule };
      
      if (updatedSchedule[rescheduleData.day]) {
        const existingSlotIndex = updatedSchedule[rescheduleData.day].findIndex(
          slot => slot.time === rescheduleData.time
        );
        
        if (existingSlotIndex !== -1) {
          const appointment = appointments.find(a => a.id === rescheduleData.appointmentId);
          updatedSchedule[rescheduleData.day][existingSlotIndex] = {
            time: rescheduleData.time,
            status: 'booked',
            patient: appointment.patientName,
            type: appointment.type
          };
        }
      }

      setAppointments(updatedAppointments);
      setSchedule(updatedSchedule);
      
      toast.success(`Appointment rescheduled to ${rescheduleData.day} at ${rescheduleData.time}`);
      setRescheduleData({
        appointmentId: null,
        day: null,
        time: null,
        showModal: false
      });
    } catch (err) {
      toast.error('Failed to reschedule appointment');
    } finally {
      setIsLoading(prev => ({ ...prev, reschedule: false }));
    }
  };

  const getAppointmentTypeColor = (type) => {
    switch(type) {
      case 'Follow-up': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Checkup': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Vaccination': return 'bg-green-100 text-green-800 border-green-200';
      case 'Consultation': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'booked': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  const generateTimeSlots = () => {
    const hours = [];
    for (let i = 9; i <= 17; i++) {
      const hour = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? 'PM' : 'AM';
      hours.push(`${hour}:00 ${ampm}`);
      if (i !== 17) hours.push(`${hour}:30 ${ampm}`);
    }
    return hours;
  };

  const graphicalTimeSlots = generateTimeSlots();

  const getAvailableSlots = (day) => {
    if (!schedule[day]) return [];
    return schedule[day]
      .filter(slot => slot.status === 'available')
      .map(slot => slot.time);
  };

  return (
    <div className="relative">
      {/* Main content with conditional blur */}
      <div className={`p-4 sm:p-6 flex flex-col gap-6 w-full max-w-full ${isMobile ? 'p-3' : ''} ${rescheduleData.showModal ? 'blur-sm' : ''}`}>
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
          theme="colored"
        />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <div className="relative">
              <div className="absolute -inset-2 bg-blue-100 rounded-full opacity-50"></div>
              <FaCalendarAlt className={`relative text-3xl sm:text-4xl text-blue-600 ${isMobile ? 'text-2xl' : ''}`} />
            </div>
            <div>
              <h2 className={`text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 flex items-center ${isMobile ? 'text-xl' : ''}`}>
                My Schedule
              </h2>
              <p className="text-sm text-gray-500">Manage your appointments and availability</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => toggleSection('weeklyView')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${expandedSections.weeklyView ? 'bg-blue-100 text-blue-800 shadow-inner' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} ${isMobile ? 'px-2 py-1 text-xs' : ''}`}
            >
              {expandedSections.weeklyView ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
              Weekly View
            </button>
            <button
              onClick={() => toggleSection('upcomingAppointments')}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-all ${expandedSections.upcomingAppointments ? 'bg-blue-100 text-blue-800 shadow-inner' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} ${isMobile ? 'px-2 py-1 text-xs' : ''}`}
            >
              {expandedSections.upcomingAppointments ? <FaChevronUp className="mr-1" /> : <FaChevronDown className="mr-1" />}
              Appointments
            </button>
          </div>
        </div>

        {/* Weekly Schedule View */}
        <div className="bg-white rounded-xl shadow-lg transition-all duration-200 overflow-hidden">
          <div 
            className={`flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${isMobile ? 'p-3' : ''}`}
            onClick={() => toggleSection('weeklyView')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FaCalendarAlt className={`text-blue-600 ${isMobile ? 'text-sm' : ''}`} />
              </div>
              <h3 className={`text-base sm:text-lg font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                Weekly Schedule View
              </h3>
            </div>
            <button className="text-blue-600 hover:text-blue-900 transition-colors">
              {expandedSections.weeklyView ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          
          {expandedSections.weeklyView && (
            <div className={`p-4 sm:p-6 ${isMobile ? 'p-3' : ''}`}>
              {isLoading.schedule ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
                  <span>Loading schedule...</span>
                </div>
              ) : errors.schedule ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
                  <FaExclamationCircle className="mr-2" />
                  {errors.schedule}
                </div>
              ) : (
                <>
                  {isMobile ? (
                    <div className="space-y-4">
                      <div className="flex overflow-x-auto pb-2 -mx-3 scrollbar-hide">
                        {daysOfWeek.map(day => (
                          <button
                            key={day}
                            onClick={() => selectDay(day)}
                            className={`flex-shrink-0 mx-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                              ${selectedDay === day ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
                          >
                            {day.slice(0, 3)}
                          </button>
                        ))}
                      </div>
                      
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h4 className="text-lg font-semibold mb-3 capitalize">{selectedDay}</h4>
                        <div className="space-y-2">
                          {schedule[selectedDay]?.length > 0 ? (
                            schedule[selectedDay].map(slot => (
                              <div 
                                key={`${selectedDay}-${slot.time}`}
                                className={`p-3 rounded-lg border transition-all
                                  ${slot.status === 'available' ? 'border-green-200 bg-green-50 hover:bg-green-100' : 
                                    slot.status === 'booked' ? 'border-blue-200 bg-blue-50 hover:bg-blue-100' : 
                                    'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
                              >
                                <div className="flex justify-between items-center">
                                  <span className="font-medium">{slot.time}</span>
                                  {slot.status === 'booked' ? (
                                    <span className={`text-xs px-2 py-1 rounded-full ${getAppointmentTypeColor(slot.type)}`}>
                                      {slot.type}
                                    </span>
                                  ) : slot.status === 'blocked' ? (
                                    <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                                      Blocked
                                    </span>
                                  ) : (
                                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-800">
                                      Available
                                    </span>
                                  )}
                                </div>
                                {slot.patient && (
                                  <div className="mt-1 text-sm text-gray-700">
                                    <FaUser className="inline mr-1" /> {slot.patient}
                                  </div>
                                )}
                                {slot.note && (
                                  <div className="mt-1 text-sm text-gray-500">
                                    <FaExclamationCircle className="inline mr-1" /> {slot.note}
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No appointments scheduled
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <div className="min-w-max">
                        <div className="flex border-b border-gray-200">
                          <div className="w-24 flex-shrink-0"></div>
                          {daysOfWeek.map(day => (
                            <div key={day} className="w-32 flex-shrink-0 p-2 text-center font-medium text-gray-700 capitalize">
                              {day}
                            </div>
                          ))}
                        </div>
                        
                        <div className="flex">
                          <div className="w-24 flex-shrink-0 border-r border-gray-200">
                            {graphicalTimeSlots.map(time => (
                              <div key={time} className="h-12 border-b border-gray-100 flex items-center justify-end pr-2 text-xs text-gray-500">
                                {time}
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-1">
                            {daysOfWeek.map(day => (
                              <div key={day} className="w-32 flex-shrink-0 border-r border-gray-200 last:border-r-0">
                                {graphicalTimeSlots.map(time => {
                                  const scheduledItem = schedule[day]?.find(item => {
                                    const itemTime = new Date(`01/01/2000 ${item.time}`);
                                    const slotTime = new Date(`01/01/2000 ${time}`);
                                    return Math.abs(itemTime - slotTime) < 30 * 60 * 1000;
                                  });
                                  
                                  return (
                                    <div 
                                      key={`${day}-${time}`}
                                      className={`h-12 border-b border-gray-100 relative ${scheduledItem ? getStatusColor(scheduledItem.status) : 'bg-white'}`}
                                      title={scheduledItem?.patient ? `Booked by ${scheduledItem.patient}` : scheduledItem?.note || ''}
                                    >
                                      {scheduledItem && (
                                        <div className="absolute inset-0 p-1 flex flex-col">
                                          {scheduledItem.status === 'booked' && (
                                            <>
                                              <div className="text-xs font-medium truncate">{scheduledItem.patient}</div>
                                              <div className={`text-2xs mt-auto px-1 py-0.5 rounded ${getAppointmentTypeColor(scheduledItem.type)}`}>
                                                {scheduledItem.type}
                                              </div>
                                            </>
                                          )}
                                          {scheduledItem.status === 'blocked' && (
                                            <div className="text-xs text-gray-600 flex items-center h-full justify-center">
                                              <FaTimes className="mr-1" /> {scheduledItem.note}
                                            </div>
                                          )}
                                          {scheduledItem.status === 'available' && (
                                            <div className="text-xs text-green-700 flex items-center h-full justify-center">
                                              <FaPlus className="mr-1" /> Available
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={`flex flex-wrap justify-center mt-6 gap-3 ${isMobile ? '' : 'gap-4'}`}>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full mr-2"></div>
                      <span className="text-sm">Available</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full mr-2"></div>
                      <span className="text-sm">Booked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-full mr-2"></div>
                      <span className="text-sm">Blocked</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded-full mr-2"></div>
                      <span className="text-sm">Follow-up</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded-full mr-2"></div>
                      <span className="text-sm">Consultation</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded-full mr-2"></div>
                      <span className="text-sm">Checkup</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full mr-2"></div>
                      <span className="text-sm">Vaccination</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Upcoming Appointments List */}
        <div className="bg-white rounded-xl shadow-lg transition-all duration-200 overflow-hidden">
          <div 
            className={`flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${isMobile ? 'p-3' : ''}`}
            onClick={() => toggleSection('upcomingAppointments')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FaRegCalendarCheck className={`text-blue-600 ${isMobile ? 'text-sm' : ''}`} />
              </div>
              <h3 className={`text-base sm:text-lg font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                Upcoming Appointments
                <span className="ml-2 text-xs font-normal bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  {appointments.filter(a => a.status === 'Confirmed').length} confirmed
                </span>
              </h3>
            </div>
            <button className="text-blue-600 hover:text-blue-900 transition-colors">
              {expandedSections.upcomingAppointments ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          
          {expandedSections.upcomingAppointments && (
            <div className={`p-4 sm:p-6 ${isMobile ? 'p-3' : ''}`}>
              {isLoading.appointments ? (
                <div className="flex justify-center items-center py-12">
                  <FaSpinner className="animate-spin text-blue-600 text-2xl mr-3" />
                  <span>Loading appointments...</span>
                </div>
              ) : errors.appointments ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 flex items-center">
                  <FaExclamationCircle className="mr-2" />
                  {errors.appointments}
                </div>
              ) : appointments.length > 0 ? (
                <div className="space-y-3">
                  {appointments.map(appointment => (
                    <div key={appointment.id} className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all ${isMobile ? 'p-3' : ''}`}>
                      <div className="flex justify-between items-start">
                        <div className={`${isMobile ? 'flex-1 min-w-0' : ''}`}>
                          <div className="flex items-center">
                            <h3 className={`font-medium text-gray-800 ${isMobile ? 'text-sm' : ''}`}>
                              {appointment.patientName}
                            </h3>
                            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getAppointmentTypeColor(appointment.type)}`}>
                              {appointment.type}
                            </span>
                          </div>
                          <p className={`text-sm text-gray-600 flex items-center mt-1 ${isMobile ? 'text-xs' : ''}`}>
                            <FaRegClock className="mr-2 text-blue-600" />
                            {appointment.date} • {appointment.time}
                          </p>
                          <p className={`text-sm text-gray-600 mt-1 ${isMobile ? 'text-xs' : ''}`}>
                            {appointment.reason}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded text-xs 
                            ${appointment.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                              appointment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                      <div className={`flex justify-end mt-3 space-x-2 ${isMobile ? 'space-x-1' : ''}`}>
                        {isMobile ? (
                          <div className="relative">
                            <button 
                              className="text-gray-500 hover:text-gray-700 p-1"
                              onClick={(e) => toggleDropdown(appointment.id, e)}
                            >
                              <FaEllipsisH size={14} />
                            </button>
                            {showDropdown === appointment.id && (
                              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                <button 
                                  className="text-xs text-blue-600 hover:bg-blue-50 w-full text-left px-3 py-1 flex items-center"
                                  onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                                >
                                  <FaCheck className="mr-1" /> Confirm
                                </button>
                                <button 
                                  className="text-xs text-gray-600 hover:bg-gray-50 w-full text-left px-3 py-1 flex items-center"
                                  onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                                >
                                  <FaTimes className="mr-1" /> Cancel
                                </button>
                                <button 
                                  className="text-xs text-purple-600 hover:bg-purple-50 w-full text-left px-3 py-1 flex items-center"
                                  onClick={() => handleAppointmentAction(appointment.id, 'reschedule')}
                                >
                                  <FaRegClock className="mr-1" /> Reschedule
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <button 
                              className="text-blue-600 hover:text-blue-800 text-sm flex items-center px-3 py-1 rounded hover:bg-blue-50"
                              onClick={() => handleAppointmentAction(appointment.id, 'confirm')}
                            >
                              <FaCheck className="mr-1" /> Confirm
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-800 text-sm flex items-center px-3 py-1 rounded hover:bg-gray-50"
                              onClick={() => handleAppointmentAction(appointment.id, 'cancel')}
                            >
                              <FaTimes className="mr-1" /> Cancel
                            </button>
                            <button 
                              className="text-purple-600 hover:text-purple-800 text-sm flex items-center px-3 py-1 rounded hover:bg-purple-50"
                              onClick={() => handleAppointmentAction(appointment.id, 'reschedule')}
                            >
                              <FaRegClock className="mr-1" /> Reschedule
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaRegCalendarTimes className="mx-auto text-3xl text-gray-300 mb-2" />
                  No upcoming appointments
                </div>
              )}
            </div>
          )}
        </div>

        {/* Availability Form */}
        <div className="bg-white rounded-xl shadow-lg transition-all duration-200 overflow-hidden">
          <div 
            className={`flex justify-between items-center p-4 sm:p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${isMobile ? 'p-3' : ''}`}
            onClick={() => toggleSection('availability')}
          >
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <FaClock className={`text-blue-600 ${isMobile ? 'text-sm' : ''}`} />
              </div>
              <h3 className={`text-base sm:text-lg font-semibold text-gray-900 ${isMobile ? 'text-sm' : ''}`}>
                Set Availability
              </h3>
            </div>
            <button className="text-blue-600 hover:text-blue-900 transition-colors">
              {expandedSections.availability ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          </div>
          
          {expandedSections.availability && (
            <div className={`p-4 sm:p-6 ${isMobile ? 'p-3' : ''}`}>
              <div className="space-y-4">
                {daysOfWeek.map(day => (
                  <div key={day} className={`grid grid-cols-3 gap-3 items-center ${isMobile ? 'gap-2' : ''}`}>
                    <label className={`text-sm font-semibold text-gray-700 capitalize flex items-center ${isMobile ? 'text-xs' : ''}`}>
                      {isMobile ? day.slice(0, 3) : day}
                    </label>
                    <select
                      value={availabilityForm[day].start}
                      onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                      className={`border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isMobile ? 'p-1.5 text-xs' : ''}`}
                    >
                      <option value="">Not Available</option>
                      {timeSlots.map(time => (
                        <option key={`start-${day}-${time}`} value={time}>
                          {isMobile ? time.split(' ')[0] : time}
                        </option>
                      ))}
                    </select>
                    <select
                      value={availabilityForm[day].end}
                      onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                      className={`border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${isMobile ? 'p-1.5 text-xs' : ''}`}
                      disabled={!availabilityForm[day].start}
                    >
                      <option value="">Not Available</option>
                      {timeSlots
                        .filter(time => {
                          if (!availabilityForm[day].start) return true;
                          const startIndex = timeSlots.indexOf(availabilityForm[day].start);
                          const timeIndex = timeSlots.indexOf(time);
                          return timeIndex >= startIndex;
                        })
                        .map(time => (
                          <option key={`end-${day}-${time}`} value={time}>
                            {isMobile ? time.split(' ')[0] : time}
                          </option>
                        ))}
                    </select>
                  </div>
                ))}
                
                <button
                  onClick={saveAvailability}
                  disabled={isLoading.availability}
                  className={`mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-6 rounded-lg flex items-center justify-center text-sm shadow-md hover:shadow-lg transition-all ${isMobile ? 'py-2 px-4 text-xs w-full' : ''}`}
                >
                  {isLoading.availability ? (
                    <>
                      <FaSpinner className={`animate-spin ${isMobile ? 'mr-1' : 'mr-2'}`} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave className={isMobile ? 'mr-1' : 'mr-2'} />
                      Save Availability
                    </>
                  )}
                </button>
                {errors.availability && (
                  <div className={`bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 flex items-center ${isMobile ? 'text-xs p-2' : 'text-sm'}`}>
                    <FaExclamationCircle className={isMobile ? 'mr-1' : 'mr-2'} />
                    {errors.availability}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {rescheduleData.showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md border border-gray-200 shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                <select
                  value={rescheduleData.day || ''}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, day: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a day</option>
                  {daysOfWeek.map(day => (
                    <option key={`reschedule-day-${day}`} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <select
                  value={rescheduleData.time || ''}
                  onChange={(e) => setRescheduleData(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!rescheduleData.day}
                >
                  <option value="">Select a time</option>
                  {rescheduleData.day && getAvailableSlots(rescheduleData.day).map(time => (
                    <option key={`reschedule-time-${time}`} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setRescheduleData({ appointmentId: null, day: null, time: null, showModal: false })}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleReschedule}
                disabled={isLoading.reschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 text-sm flex items-center"
              >
                {isLoading.reschedule ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Rescheduling...
                  </>
                ) : (
                  <>
                    <FaCheck className="mr-2" />
                    Confirm Reschedule
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Schedule;
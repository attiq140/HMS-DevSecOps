import React, { useState, useEffect } from 'react';
import { 
  FiSettings, 
  FiUser, 
  FiBell, 
  FiCalendar, 
  FiLock, 
  FiEdit2,
  FiMail,
  FiPhone,
  FiClock,
  FiMonitor,
  FiSun,
  FiMoon,
  FiLogOut,
  FiAlertCircle,
  FiCheckCircle,
  FiX,
  FiAlertTriangle,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { BsMoon } from 'react-icons/bs';
import { FaUserClock, FaSignature } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import { AiOutlineBell } from 'react-icons/ai';

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
  .settings-header {
    position: relative;
    z-index: 10;
  }
  .alert-message {
    transition: all 0.3s ease;
  }
`;

const Alert = ({ message, type, onClose }) => {
  const bgColors = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700'
  };

  const icons = {
    success: <FiCheckCircle className="mr-2" />,
    error: <FiAlertTriangle className="mr-2" />,
    warning: <FiAlertTriangle className="mr-2" />,
    info: <FiAlertCircle className="mr-2" />
  };

  return (
    <div className={`fixed top-4 right-4 z-50 border-l-4 ${bgColors[type]} p-4 rounded shadow-lg max-w-sm flex items-start animate-fadeIn`}>
      {icons[type]}
      <div className="flex-1">
        <p className="font-medium">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
        aria-label="Close alert"
      >
        <FiX />
      </button>
    </div>
  );
};

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <input 
        type={showPassword ? "text" : "password"} 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
      </button>
    </div>
  );
};

const Settings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [autoLogout, setAutoLogout] = useState(true);
  const [language, setLanguage] = useState('english');
  const [textSize, setTextSize] = useState('medium');
  const [profilePic, setProfilePic] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [doctorInfo, setDoctorInfo] = useState({
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    username: 'sarah.johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567',
    about: 'Board-certified cardiologist with extensive experience in interventional cardiology. Special interest in preventive cardiology and heart failure management.',
    experience: '12 years'
  });

  const [editableFields, setEditableFields] = useState({
    name: 'Dr. Sarah Johnson',
    username: 'sarah.johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 123-4567'
  });

  const [notifications, setNotifications] = useState({
    email: {
      newAppointments: true,
      labReports: true,
      patientMessages: false
    },
    sms: {
      newAppointments: false,
      labReports: true,
      patientMessages: false
    },
    soundAlerts: true,
    popupAlerts: true
  });

  const [availability, setAvailability] = useState({
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    breakStart: '13:00',
    breakEnd: '14:00',
    telemedicine: true
  });

  const [signature, setSignature] = useState({
    image: null,
    lastUpdated: null
  });

  const [calendarIntegrations, setCalendarIntegrations] = useState({
    google: false,
    outlook: false
  });

  const [loginActivity, setLoginActivity] = useState([
    {
      device: 'MacBook Pro',
      location: 'New York, USA',
      ip: '192.168.1.1',
      lastActive: 'Today, 10:30 AM'
    },
    {
      device: 'iPhone 13',
      location: 'Boston, USA',
      ip: '192.168.1.2',
      lastActive: 'Yesterday, 5:45 PM'
    }
  ]);

  useEffect(() => {
    // Apply dark mode to the document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Apply text size to the document
    document.documentElement.style.fontSize = 
      textSize === 'small' ? '14px' : 
      textSize === 'medium' ? '16px' : '18px';
  }, [textSize]);

  const showAlert = (message, type = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showAlert('File size should be less than 2MB', 'error');
        return;
      }
      
      if (!file.type.match('image.*')) {
        showAlert('Please select an image file', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        showAlert('Profile picture updated successfully!', 'success');
      };
      reader.onerror = () => {
        showAlert('Error reading file', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1 * 1024 * 1024) {
        showAlert('Signature file should be less than 1MB', 'error');
        return;
      }
      
      if (!file.type.match('image.*')) {
        showAlert('Please select an image file for signature', 'error');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature({
          image: reader.result,
          lastUpdated: new Date().toISOString()
        });
        showAlert('Signature uploaded successfully!', 'success');
      };
      reader.onerror = () => {
        showAlert('Error reading signature file', 'error');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleNotification = (type, category) => {
    setNotifications(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [category]: !prev[type][category]
      }
    }));
    
    const action = notifications[type][category] ? 'disabled' : 'enabled';
    showAlert(`${category.replace(/([A-Z])/g, ' $1').toLowerCase()} notifications ${action} for ${type.toUpperCase()}`, 'info');
  };

  const toggleWorkingDay = (day) => {
    setAvailability(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter(d => d !== day)
        : [...prev.workingDays, day]
    }));
    
    const action = availability.workingDays.includes(day) ? 'removed from' : 'added to';
    showAlert(`${day} ${action} working days`, 'info');
  };

  const toggleCalendarIntegration = (service) => {
    setCalendarIntegrations(prev => ({
      ...prev,
      [service]: !prev[service]
    }));
    
    const action = calendarIntegrations[service] ? 'disconnected from' : 'connected to';
    showAlert(`${service.charAt(0).toUpperCase() + service.slice(1)} calendar ${action}`, 'info');
  };

  const handleFieldChange = (field, value) => {
    setEditableFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateField = (field) => {
    // Validate the field before updating
    if (field === 'email' && !/^\S+@\S+\.\S+$/.test(editableFields.email)) {
      showAlert('Please enter a valid email address', 'error');
      return;
    }
    
    if (field === 'phone' && !/^\+?[\d\s()-]+$/.test(editableFields.phone)) {
      showAlert('Please enter a valid phone number', 'error');
      return;
    }
    
    if (field === 'username' && editableFields.username.length < 3) {
      showAlert('Username must be at least 3 characters', 'error');
      return;
    }
    
    if (field === 'name' && editableFields.name.length < 2) {
      showAlert('Name must be at least 2 characters', 'error');
      return;
    }
    
    // Update the doctorInfo with the new value from editableFields
    setDoctorInfo(prev => ({
      ...prev,
      [field]: editableFields[field]
    }));
    
    showAlert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`, 'success');
  };

  const changePassword = () => {
    if (!currentPassword) {
      showAlert('Please enter your current password', 'error');
      return;
    }
    
    if (newPassword.length < 8) {
      showAlert('New password must be at least 8 characters', 'error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showAlert('New passwords do not match', 'error');
      return;
    }
    
    // In a real app, you would send this to your backend
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showAlert('Password changed successfully!', 'success');
  };

  const logoutOtherDevices = () => {
    // In a real app, this would call an API to invalidate other sessions
    setLoginActivity(prev => [prev[0]]); // Keep only the current session
    showAlert('Logged out from all other devices', 'success');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={profilePic || "https://via.placeholder.com/100"} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 transition-colors">
                  <FiEdit2 size={14} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
              <div>
                <h3 className="text-lg font-semibold">{doctorInfo.name}</h3>
                <p className="text-gray-600">{doctorInfo.specialty}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input 
                    type="text" 
                    value={editableFields.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={() => updateField('name')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Update
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input 
                    type="text" 
                    value={editableFields.username}
                    onChange={(e) => handleFieldChange('username', e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button 
                  onClick={() => updateField('username')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Update
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="flex items-center mt-1">
                    <FiMail className="text-gray-400 mr-2" />
                    <input 
                      type="email" 
                      value={editableFields.email}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => updateField('email')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Update
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-gray-50 p-4 rounded-lg">
                <div className="mb-2 sm:mb-0">
                  <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <div className="flex items-center mt-1">
                    <FiPhone className="text-gray-400 mr-2" />
                    <input 
                      type="tel" 
                      value={editableFields.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      className="p-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => updateField('phone')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Update
                </button>
              </div>

              <div className="pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium mb-3">Change Password</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <PasswordInput 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <PasswordInput 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <PasswordInput 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button 
                    onClick={changePassword}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Change Password
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
                <div>
                  <h4 className="text-md font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <button 
                  onClick={() => {
                    setTwoFactorAuth(!twoFactorAuth);
                    showAlert(
                      `Two-factor authentication ${!twoFactorAuth ? 'enabled' : 'disabled'}`,
                      !twoFactorAuth ? 'success' : 'warning'
                    );
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${twoFactorAuth ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Email Notifications</h3>
              <div className="space-y-3">
                {renderNotificationToggle('email', 'newAppointments', 'New Appointments', 'Get notified when a new appointment is booked')}
                {renderNotificationToggle('email', 'labReports', 'Lab Reports', 'Receive notifications when lab results are available')}
                {renderNotificationToggle('email', 'patientMessages', 'Patient Messages', 'Notify me when patients send messages')}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">SMS Notifications</h3>
              <div className="space-y-3">
                {renderNotificationToggle('sms', 'newAppointments', 'New Appointments', 'Get SMS alerts for new appointments')}
                {renderNotificationToggle('sms', 'labReports', 'Lab Reports', 'Receive SMS when lab results are available')}
                {renderNotificationToggle('sms', 'patientMessages', 'Patient Messages', 'SMS alerts for patient messages')}
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Alert Preferences</h3>
              <div className="space-y-3">
                {renderNotificationToggle('soundAlerts', null, 'Sound Alerts', 'Play sound for new notifications')}
                {renderNotificationToggle('popupAlerts', null, 'Popup Alerts', 'Show popup notifications')}
              </div>
            </div>
          </div>
        );

      case 'availability':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Working Days</h3>
              <div className="flex flex-wrap gap-2">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <button
                    key={day}
                    onClick={() => toggleWorkingDay(day)}
                    className={`px-4 py-2 rounded-md transition-colors ${availability.workingDays.includes(day) ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Working Hours</h3>
                <div className="flex items-center space-x-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <input 
                      type="time" 
                      value={availability.startTime}
                      onChange={(e) => {
                        setAvailability({...availability, startTime: e.target.value});
                        showAlert('Working hours updated', 'info');
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <input 
                      type="time" 
                      value={availability.endTime}
                      onChange={(e) => {
                        setAvailability({...availability, endTime: e.target.value});
                        showAlert('Working hours updated', 'info');
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Break Time</h3>
                <div className="flex items-center space-x-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start</label>
                    <input 
                      type="time" 
                      value={availability.breakStart}
                      onChange={(e) => {
                        setAvailability({...availability, breakStart: e.target.value});
                        showAlert('Break time updated', 'info');
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End</label>
                    <input 
                      type="time" 
                      value={availability.breakEnd}
                      onChange={(e) => {
                        setAvailability({...availability, breakEnd: e.target.value});
                        showAlert('Break time updated', 'info');
                      }}
                      className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <div>
                <h3 className="text-md font-medium">Telemedicine Availability</h3>
                <p className="text-sm text-gray-600">Enable virtual consultations for patients</p>
              </div>
              <button 
                onClick={() => {
                  setAvailability({...availability, telemedicine: !availability.telemedicine});
                  showAlert(
                    `Telemedicine ${!availability.telemedicine ? 'enabled' : 'disabled'}`,
                    !availability.telemedicine ? 'success' : 'warning'
                  );
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${availability.telemedicine ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${availability.telemedicine ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Login Activity</h3>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Device</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">IP Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loginActivity.map((activity, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center">
                            {activity.device.includes('iPhone') ? (
                              <FiPhone className="text-gray-400 mr-2" />
                            ) : (
                              <FiMonitor className="text-gray-400 mr-2" />
                            )}
                            <span>{activity.device}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">{activity.location}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{activity.ip}</td>
                        <td className="px-4 py-3 whitespace-nowrap">{activity.lastActive}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-md font-medium">Auto-Logout After Inactivity</h3>
                  <p className="text-sm text-gray-600">Automatically log out after 30 minutes of inactivity</p>
                </div>
                <button 
                  onClick={() => {
                    setAutoLogout(!autoLogout);
                    showAlert(
                      `Auto-logout ${!autoLogout ? 'enabled' : 'disabled'}`,
                      !autoLogout ? 'success' : 'warning'
                    );
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${autoLogout ? 'bg-blue-600' : 'bg-gray-200'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoLogout ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="pt-4">
                <h3 className="text-md font-medium mb-3">Active Sessions</h3>
                <button 
                  onClick={logoutOtherDevices}
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiLogOut className="mr-2" />
                  Log out of all other devices
                </button>
              </div>
            </div>
          </div>
        );

      case 'signature':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Digital Signature</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                {signature.image ? (
                  <div className="mb-4">
                    <img 
                      src={signature.image} 
                      alt="Signature" 
                      className="mx-auto h-24 object-contain"
                    />
                    {signature.lastUpdated && (
                      <p className="text-sm text-gray-500 mt-2">
                        Last updated: {new Date(signature.lastUpdated).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <FaSignature className="mx-auto text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-600 mb-4">Upload or draw your digital signature for prescriptions</p>
                  </>
                )}
                <div className="flex justify-center space-x-3">
                  <label className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer transition-colors">
                    Upload Signature
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleSignatureUpload}
                      accept="image/*"
                    />
                  </label>
                  <button 
                    onClick={() => {
                      // In a real app, this would open a signature drawing canvas
                      const dummySignature = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMTAwIj48cGF0aCBkPSJNMTAgNTBjMC0yMiA4LTQwIDIwLTQwczIwIDE4IDIwIDQwLTE4IDQwLTIwIDQwLTIwLTE4LTIwLTQwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2NmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNNTAgNTBjMC0yMiA4LTQwIDIwLTQwczIwIDE4IDIwIDQwLTE4IDQwLTIwIDQwLTIwLTE4LTIwLTQwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2NmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNOTAgNTBjMC0yMiA4LTQwIDIwLTQwczIwIDE4IDIwIDQwLTE4IDQwLTIwIDQwLTIwLTE4LTIwLTQwWiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMzM2NmZmIiBzdHJva2Utd2lkdGg9IjIiLz48cGF0aCBkPSJNMTMwIDUwYzAtMjIgOC00MCAyMC00MHMxOCAxOCAyMCA0MC0yMCA0MC0yMCA0MC0yMC0xOC0yMC00MFoiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzNjZmZiIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+';
                      setSignature({
                        image: dummySignature,
                        lastUpdated: new Date().toISOString()
                      });
                      showAlert('Signature created successfully!', 'success');
                    }}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                  >
                    Draw Signature
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Calendar Integration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderCalendarIntegration('google', 'Google Calendar', 'Sync your appointments with Google Calendar')}
                {renderCalendarIntegration('outlook', 'Outlook Calendar', 'Sync your appointments with Outlook')}
              </div>
            </div>
          </div>
        );

      case 'ui':
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Language</h3>
              <select 
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  showAlert(`Language changed to ${e.target.value}`, 'info');
                }}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="english">English</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
                <option value="chinese">Chinese</option>
              </select>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Theme</h3>
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => {
                    setDarkMode(false);
                    showAlert('Light theme activated', 'info');
                  }}
                  className={`flex-1 border rounded-md p-4 flex flex-col items-center ${!darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <FiSun className={`text-2xl mb-2 ${!darkMode ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`font-medium ${!darkMode ? 'text-blue-500' : 'text-gray-600'}`}>Light Mode</span>
                </button>
                <button 
                  onClick={() => {
                    setDarkMode(true);
                    showAlert('Dark theme activated', 'info');
                  }}
                  className={`flex-1 border rounded-md p-4 flex flex-col items-center ${darkMode ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <FiMoon className={`text-2xl mb-2 ${darkMode ? 'text-blue-500' : 'text-gray-400'}`} />
                  <span className={`font-medium ${darkMode ? 'text-blue-500' : 'text-gray-600'}`}>Dark Mode</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold">Text Size</h3>
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => {
                    setTextSize('small');
                    showAlert('Text size set to small', 'info');
                  }}
                  className={`px-3 py-1 rounded-md ${textSize === 'small' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} transition-colors`}
                >
                  Small
                </button>
                <button 
                  onClick={() => {
                    setTextSize('medium');
                    showAlert('Text size set to medium', 'info');
                  }}
                  className={`px-3 py-1 rounded-md ${textSize === 'medium' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} transition-colors`}
                >
                  Medium
                </button>
                <button 
                  onClick={() => {
                    setTextSize('large');
                    showAlert('Text size set to large', 'info');
                  }}
                  className={`px-3 py-1 rounded-md ${textSize === 'large' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'} transition-colors`}
                >
                  Large
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderNotificationToggle = (type, category, title, description) => {
    const isChecked = category 
      ? notifications[type][category] 
      : notifications[type];
    
    return (
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button 
          onClick={() => {
            if (category) {
              toggleNotification(type, category);
            } else {
              setNotifications(prev => ({...prev, [type]: !prev[type]}));
              showAlert(
                `${title} ${!notifications[type] ? 'enabled' : 'disabled'}`,
                'info'
              );
            }
          }}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${isChecked ? 'bg-blue-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isChecked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    );
  };

  const renderCalendarIntegration = (service, title, description) => {
    return (
      <div className="border rounded-md p-4 flex items-center">
        <div className={`${service === 'google' ? 'bg-red-100' : 'bg-blue-100'} p-3 rounded-full mr-4`}>
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C8.1 0 5 3.1 5 7v1H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2h-1V7c0-3.9-3.1-7-7-7zm0 2c2.8 0 5 2.2 5 5v1H7V7c0-2.8 2.2-5 5-5zm6 10H6v2h12v-2zm-6 3H6v2h6v-2z"/>
          </svg>
        </div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        <button 
          onClick={() => toggleCalendarIntegration(service)}
          className={`ml-auto px-3 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            calendarIntegrations[service] 
              ? 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500' 
              : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
          }`}
        >
          {calendarIntegrations[service] ? 'Connected' : 'Connect'}
        </button>
      </div>
    );
  };

  return (
    <div className="relative p-4 md:p-6 lg:p-8">
      <style>{styles}</style>
      
      {alerts.map(alert => (
        <Alert 
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
      
      <div className={`settings-header ${showProfileModal ? 'relative z-50' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3 animate-scaleIn">
            <div className="relative">
              <FiSettings className="text-3xl md:text-4xl text-blue-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
              Doctor Settings
              <span className="ml-2 md:ml-3 text-xs md:text-sm font-normal bg-blue-100 text-blue-800 px-2 md:px-3 py-1 rounded-full">
                Account Preferences
              </span>
            </h2>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center bg-red-600 text-white px-4 py-2 md:px-5 md:py-3 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all group w-full md:w-auto justify-center"
            aria-label="View profile"
          >
            <FiUser className="mr-2" />
            <span className="font-semibold">View Profile</span>
          </button>
        </div>
      </div>

      <div className={`transition-all duration-300 ${showProfileModal ? 'filter blur-sm opacity-90' : ''}`}>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50">
              <nav className="p-4 space-y-1">
                <button
                  onClick={() => setActiveTab('account')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${activeTab === 'account' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FiUser className="text-lg" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <AiOutlineBell className="text-lg" />
                  <span>Notification Preferences</span>
                </button>
                <button
                  onClick={() => setActiveTab('availability')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${activeTab === 'availability' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FaUserClock className="text-lg" />
                  <span>Availability Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <MdOutlineSecurity className="text-lg" />
                  <span>Security & Privacy</span>
                </button>
                <button
                  onClick={() => setActiveTab('signature')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${activeTab === 'signature' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <FaSignature className="text-lg" />
                  <span>Signature & Integration</span>
                </button>
                <button
                  onClick={() => setActiveTab('ui')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left ${activeTab === 'ui' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <BsMoon className="text-lg" />
                  <span>UI Preferences</span>
                </button>
              </nav>
            </div>

            <div className="flex-1 p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
      
      {showProfileModal && (
        <div
          className="modal-container fixed inset-0 flex items-center justify-center z-50 pt-16 modal-backdrop"
          onClick={(e) => e.target.classList.contains('modal-container') && setShowProfileModal(false)}
        >
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto p-4 md:p-6 lg:p-8 animate-fadeIn">
            <div className="flex justify-between items-start">
              <h2 className="text-lg md:text-xl font-bold text-gray-800 flex items-center">
                <FiUser className="mr-2 text-blue-600" />
                Doctor Profile
              </h2>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
                aria-label="Close profile"
              >
                &times;
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mt-6">
              <div className="relative">
                <img 
                  src={profilePic || "https://via.placeholder.com/150"} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
                />
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <FiEdit2 size={16} />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{doctorInfo.name}</h3>
                  <p className="text-blue-600 font-medium">{doctorInfo.specialty}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{doctorInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{doctorInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">{doctorInfo.specialty}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Years of Experience</p>
                    <p className="font-medium">{doctorInfo.experience}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">About</p>
                  <p className="text-gray-700">
                    {doctorInfo.about}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
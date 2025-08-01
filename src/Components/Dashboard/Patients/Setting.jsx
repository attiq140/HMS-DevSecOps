import React, { useState } from 'react';
import { 
  FaUser, FaLock, FaBell, FaGlobe, FaPalette, 
  FaShieldAlt, FaDatabase, FaCreditCard, 
  FaChevronDown, FaChevronUp, FaSave, FaTimes, FaEdit,
  FaEye, FaEyeSlash, FaFileUpload, FaDownload, FaPrint
} from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
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
  /* Enhanced dropdown styles for mobile */
  .responsive-select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1.25rem;
  }
  @media (max-width: 640px) {
    .responsive-select {
      font-size: 16px; /* Larger font for mobile */
      padding: 0.75rem; /* Larger tap target */
    }
    .toggle-switch {
      width: 52px;
      height: 30px;
    }
    .toggle-slider:before {
      height: 22px;
      width: 22px;
    }
    input:checked + .toggle-slider:before {
      transform: translateX(22px);
    }
  }
`;

const Setting = () => {
  // State for form data and edit mode
  const [formData, setFormData] = useState({
    email: 'patient@example.com',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    language: 'en',
    theme: 'light',
    smsNotifications: true,
    emailNotifications: true,
    inAppNotifications: true,
    shareData: false,
    visibility: 'private',
    paymentMethod: 'credit_card',
    insuranceProvider: 'Blue Cross'
  });

  const [editMode, setEditMode] = useState(false);
  const [tempFormData, setTempFormData] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // State for active sections
  const [activeSections, setActiveSections] = useState({
    account: true,
    preferences: true,
    notifications: true,
    privacy: true,
    data: true,
    billing: true
  });

  // Options for select fields
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
    { value: 'de', label: 'German' }
  ];

  const themes = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System Default' }
  ];

  const visibilityOptions = [
    { value: 'private', label: 'Private (Only me and my doctors)' },
    { value: 'limited', label: 'Limited (Selected family members)' },
    { value: 'public', label: 'Public (All hospital staff)' }
  ];

  const paymentMethods = [
    { value: 'credit_card', label: 'Credit Card ending in 4242' },
    { value: 'paypal', label: 'PayPal' },
    { value: 'bank_transfer', label: 'Bank Transfer' }
  ];

  const insuranceProviders = [
    { value: 'Blue Cross', label: 'Blue Cross Blue Shield' },
    { value: 'Aetna', label: 'Aetna' },
    { value: 'UnitedHealth', label: 'UnitedHealthcare' },
    { value: 'Medicare', label: 'Medicare' }
  ];

  const billingHistory = [
    { date: '2023-06-15', service: 'Annual Checkup', amount: '$150.00', status: 'Paid', statusColor: 'text-green-600' },
    { date: '2023-05-22', service: 'Lab Tests', amount: '$85.50', status: 'Paid', statusColor: 'text-green-600' },
    { date: '2023-04-10', service: 'Consultation', amount: '$75.00', status: 'Pending', statusColor: 'text-yellow-600' }
  ];

  // Helper functions
  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEdit = () => {
    setTempFormData({ ...formData });
    setEditMode(true);
    showToast('Edit mode activated', 'info');
  };

  const handleSave = () => {
    setFormData(tempFormData);
    setEditMode(false);
    showToast('Settings saved successfully!', 'success');
  };

  const handleCancel = () => {
    setEditMode(false);
    showToast('Changes discarded', 'info');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTempFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: type === 'info' ? 2000 : 3000,
      hideProgressBar: type === 'info',
    });
  };

  const downloadSettingsPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Patient Settings Summary', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Email: ${formData.email}`, 20, 40);
    doc.text(`Language: ${languages.find(lang => lang.value === formData.language)?.label || formData.language}`, 20, 50);
    doc.text(`Theme: ${themes.find(t => t.value === formData.theme)?.label || formData.theme}`, 20, 60);
    doc.text(`SMS Notifications: ${formData.smsNotifications ? 'Enabled' : 'Disabled'}`, 20, 70);
    doc.text(`Email Notifications: ${formData.emailNotifications ? 'Enabled' : 'Disabled'}`, 20, 80);
    doc.text(`In-App Notifications: ${formData.inAppNotifications ? 'Enabled' : 'Disabled'}`, 20, 90);
    doc.text(`Data Sharing: ${formData.shareData ? 'Enabled' : 'Disabled'}`, 20, 100);
    doc.text(`Profile Visibility: ${visibilityOptions.find(v => v.value === formData.visibility)?.label || formData.visibility}`, 20, 110);
    doc.text(`Payment Method: ${paymentMethods.find(p => p.value === formData.paymentMethod)?.label || formData.paymentMethod}`, 20, 120);
    doc.text(`Insurance Provider: ${insuranceProviders.find(i => i.value === formData.insuranceProvider)?.label || formData.insuranceProvider}`, 20, 130);
    
    doc.save('patient_settings.pdf');
    showToast('Settings exported as PDF', 'success');
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
            <FaUser className="text-3xl sm:text-4xl text-blue-600" aria-hidden="true" />
            <FaLock className="absolute -bottom-1 right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
            Patient Settings
          </h1>
        </div>
        {editMode ? (
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={handleEdit}
            className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4 sm:mt-0"
          >
            <FaEdit className="mr-2" /> Edit Settings
          </button>
        )}
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('account')}
        >
          <div className="flex items-center">
            <FaUser className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
          </div>
          {activeSections.account ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.account && (
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={tempFormData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">{formData.email}</div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-md font-medium text-gray-900 mb-3">Change Password</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <div className="relative">
                  {editMode ? (
                    <>
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={tempFormData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                        onClick={() => togglePasswordVisibility('current')}
                      >
                        {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md">••••••••</div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  {editMode ? (
                    <>
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={tempFormData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                        onClick={() => togglePasswordVisibility('new')}
                      >
                        {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md">••••••••</div>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  {editMode ? (
                    <>
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={tempFormData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
                        onClick={() => togglePasswordVisibility('confirm')}
                      >
                        {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-50 rounded-md">••••••••</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Preferences Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('preferences')}
        >
          <div className="flex items-center">
            <FaGlobe className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Preferences</h2>
          </div>
          {activeSections.preferences ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.preferences && (
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              {editMode ? (
                <select
                  name="language"
                  value={tempFormData.language}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 responsive-select"
                >
                  {languages.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  {languages.find(lang => lang.value === formData.language)?.label || formData.language}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              {editMode ? (
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
                  {themes.map(theme => (
                    <label key={theme.value} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="theme"
                        value={theme.value}
                        checked={tempFormData.theme === theme.value}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{theme.label}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  {themes.find(t => t.value === formData.theme)?.label || formData.theme}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('notifications')}
        >
          <div className="flex items-center">
            <FaBell className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
          </div>
          {activeSections.notifications ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.notifications && (
          <div className="px-6 py-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-2 sm:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">SMS Notifications</label>
                <p className="text-xs text-gray-500">Receive important updates via SMS</p>
              </div>
              {editMode ? (
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="smsNotifications"
                    checked={tempFormData.smsNotifications}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  formData.smsNotifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formData.smsNotifications ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
            
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-2 sm:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Notifications</label>
                <p className="text-xs text-gray-500">Receive appointment reminders and updates via email</p>
              </div>
              {editMode ? (
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="emailNotifications"
                    checked={tempFormData.emailNotifications}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  formData.emailNotifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formData.emailNotifications ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
            
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-2 sm:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">In-App Notifications</label>
                <p className="text-xs text-gray-500">Receive notifications within the application</p>
              </div>
              {editMode ? (
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="inAppNotifications"
                    checked={tempFormData.inAppNotifications}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  formData.inAppNotifications ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formData.inAppNotifications ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Privacy Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('privacy')}
        >
          <div className="flex items-center">
            <FaShieldAlt className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Privacy Settings</h2>
          </div>
          {activeSections.privacy ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.privacy && (
          <div className="px-6 py-4">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
              <div className="mb-2 sm:mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-1">Share Data for Research</label>
                <p className="text-xs text-gray-500">Allow anonymized medical data to be used for research purposes</p>
              </div>
              {editMode ? (
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    name="shareData"
                    checked={tempFormData.shareData}
                    onChange={handleChange}
                  />
                  <span className="toggle-slider"></span>
                </label>
              ) : (
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  formData.shareData ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {formData.shareData ? 'Enabled' : 'Disabled'}
                </span>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
              {editMode ? (
                <select
                  name="visibility"
                  value={tempFormData.visibility}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 responsive-select"
                >
                  {visibilityOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  {visibilityOptions.find(v => v.value === formData.visibility)?.label || formData.visibility}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('data')}
        >
          <div className="flex items-center">
            <FaDatabase className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Data Management</h2>
          </div>
          {activeSections.data ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.data && (
          <div className="px-6 py-4">
            <div className="mb-4 border border-gray-200 rounded-md p-4">
              <h3 className="text-md font-medium text-gray-800 mb-2">Export Medical Data</h3>
              <p className="text-sm text-gray-600 mb-4">Download a copy of your medical records and history.</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
              >
                <FaDownload className="mr-2" /> Download Medical Records (PDF)
              </button>
            </div>
            
            <div className="mb-4 border border-gray-200 rounded-md p-4">
              <h3 className="text-md font-medium text-gray-800 mb-2">Export Settings</h3>
              <p className="text-sm text-gray-600 mb-4">Download a copy of your current settings.</p>
              <button
                type="button"
                onClick={downloadSettingsPDF}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto justify-center"
              >
                <FaDownload className="mr-2" /> Download Settings (PDF)
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-md p-4">
              <h3 className="text-md font-medium text-gray-800 mb-2">Request Data Deletion</h3>
              <p className="text-sm text-gray-600 mb-4">You can request deletion of your account and all associated data.</p>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 w-full sm:w-auto justify-center"
              >
                Request Account Deletion
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Billing Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('billing')}
        >
          <div className="flex items-center">
            <FaCreditCard className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Billing Settings</h2>
          </div>
          {activeSections.billing ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.billing && (
          <div className="px-6 py-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Payment Method</label>
              {editMode ? (
                <select
                  name="paymentMethod"
                  value={tempFormData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 responsive-select"
                >
                  {paymentMethods.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  {paymentMethods.find(p => p.value === formData.paymentMethod)?.label || formData.paymentMethod}
                </div>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Primary Insurance Provider</label>
              {editMode ? (
                <select
                  name="insuranceProvider"
                  value={tempFormData.insuranceProvider}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 responsive-select"
                >
                  {insuranceProviders.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <div className="px-3 py-2 bg-gray-50 rounded-md">
                  {insuranceProviders.find(i => i.value === formData.insuranceProvider)?.label || formData.insuranceProvider}
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Billing History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {billingHistory.map((item, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.service}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                        <td className={`px-3 py-2 whitespace-nowrap text-sm ${item.statusColor}`}>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Setting;
import React, { useState } from 'react';
import { 
  FaUser, FaPhone, FaClinicMedical, FaShieldAlt, FaCog, 
  FaEdit, FaSave, FaTimes, FaChevronDown, FaChevronUp, 
  FaUpload, FaCheckCircle, FaEye, FaEyeSlash, FaDownload,
  FaFileMedical, FaFilePdf, FaTrash
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
`;

const dummyProfileImage = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=200&q=80';

const MyProfile = () => {
  // Initial data structure
  const initialData = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Male',
      dob: '1985-05-15',
      bloodGroup: 'A+',
      profilePic: dummyProfileImage
    },
    contactInfo: {
      phone: '+1 (555) 123-4567',
      email: 'john.doe@example.com',
      address: '123 Main St, Apt 4B, New York, NY 10001'
    },
    medicalDetails: {
      allergies: ['Penicillin', 'Peanuts'],
      chronicConditions: ['Hypertension', 'Type 2 Diabetes'],
      currentMedications: ['Metformin 500mg twice daily', 'Lisinopril 10mg daily']
    },
    insuranceInfo: {
      provider: 'Blue Cross Blue Shield',
      policyNumber: 'BCBS123456789',
      validity: '2025-12-31'
    },
    accountSettings: {
      currentPassword: 'currentPassword123',
      notifications: {
        email: true,
        sms: true,
        push: false
      }
    }
  };

  // State management
  const [data, setData] = useState(initialData);
  const [editMode, setEditMode] = useState(false);
  const [tempData, setTempData] = useState(initialData);
  const [activeSections, setActiveSections] = useState({
    personal: true,
    contact: true,
    medical: true,
    insurance: true,
    account: true
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Helper functions
  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleEdit = () => {
    setTempData(JSON.parse(JSON.stringify(data)));
    setEditMode(true);
    showToast('Edit mode activated', 'info');
  };

  const handleSave = () => {
    setData(tempData);
    setEditMode(false);
    showToast('Profile saved successfully!', 'success');
  };

  const handleCancel = () => {
    setTempData(JSON.parse(JSON.stringify(data)));
    setEditMode(false);
    resetPasswordForm();
    showToast('Changes discarded', 'info');
  };

  const handleChange = (section, field, value) => {
    setTempData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleArrayChange = (section, field, index, value) => {
    const updatedArray = [...tempData[section][field]];
    updatedArray[index] = value;
    handleChange(section, field, updatedArray);
  };

  const handleAddItem = (section, field, defaultValue) => {
    const updatedArray = [...tempData[section][field], defaultValue];
    handleChange(section, field, updatedArray);
  };

  const handleRemoveItem = (section, field, index) => {
    const updatedArray = tempData[section][field].filter((_, i) => i !== index);
    handleChange(section, field, updatedArray);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange('personalInfo', 'profilePic', reader.result);
      };
      reader.readAsDataURL(file);
      showToast('Profile picture updated!', 'success');
    }
  };

  // Password functions
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = () => {
    const errors = {};
    let isValid = true;

    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    } else if (passwordData.currentPassword !== data.accountSettings.currentPassword) {
      errors.currentPassword = 'Current password is incorrect';
      isValid = false;
    }

    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (validatePassword()) {
      setData(prev => ({
        ...prev,
        accountSettings: {
          ...prev.accountSettings,
          currentPassword: passwordData.newPassword
        }
      }));
      resetPasswordForm();
      showToast('Password changed successfully!', 'success');
    }
  };

  const resetPasswordForm = () => {
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordErrors({});
  };

  const exportMedicalData = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Patient Medical Summary', 20, 20);
    
    doc.setFontSize(12);
    doc.text(`Name: ${data.personalInfo.firstName} ${data.personalInfo.lastName}`, 20, 40);
    doc.text(`Date of Birth: ${data.personalInfo.dob}`, 20, 50);
    doc.text(`Blood Group: ${data.personalInfo.bloodGroup}`, 20, 60);
    
    doc.text('Allergies:', 20, 80);
    data.medicalDetails.allergies.forEach((allergy, i) => {
      doc.text(`- ${allergy}`, 30, 90 + (i * 10));
    });
    
    doc.text('Chronic Conditions:', 20, 120);
    data.medicalDetails.chronicConditions.forEach((condition, i) => {
      doc.text(`- ${condition}`, 30, 130 + (i * 10));
    });
    
    doc.text('Current Medications:', 20, 160);
    data.medicalDetails.currentMedications.forEach((med, i) => {
      doc.text(`- ${med}`, 30, 170 + (i * 10));
    });
    
    doc.text('Insurance Information:', 20, 200);
    doc.text(`Provider: ${data.insuranceInfo.provider}`, 30, 210);
    doc.text(`Policy Number: ${data.insuranceInfo.policyNumber}`, 30, 220);
    doc.text(`Validity: ${data.insuranceInfo.validity}`, 30, 230);
    
    doc.save('medical_summary.pdf');
    showToast('Medical data exported as PDF', 'success');
  };

  const showToast = (message, type) => {
    toast[type](message, {
      position: "top-right",
      autoClose: type === 'info' ? 2000 : 3000,
      hideProgressBar: type === 'info',
    });
  };

  // Render functions
  const renderInput = (section, field, label, type = 'text') => {
    const value = editMode ? tempData[section][field] : data[section][field];
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {editMode ? (
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(section, field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <div className="px-3 py-2 bg-gray-50 rounded-md">{value || 'Not specified'}</div>
        )}
      </div>
    );
  };

  const renderArrayInputs = (section, field, label, addLabel) => {
    const items = editMode ? tempData[section][field] : data[section][field];
    
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {items.length === 0 && !editMode ? (
          <div className="px-3 py-2 bg-gray-50 rounded-md">None</div>
        ) : (
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="flex items-center">
                {editMode ? (
                  <>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleArrayChange(section, field, index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleRemoveItem(section, field, index)}
                      className="ml-2 px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="flex-1 px-3 py-2 bg-gray-50 rounded-md">{item}</div>
                )}
              </li>
            ))}
          </ul>
        )}
        {editMode && (
          <button
            onClick={() => handleAddItem(section, field, '')}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {addLabel}
          </button>
        )}
      </div>
    );
  };

  const renderCheckbox = (section, field, label) => {
    const checked = editMode ? tempData[section][field] : data[section][field];
    
    return (
      <div className="mb-4 flex items-center">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={checked}
            onChange={editMode ? (e) => handleChange(section, field, e.target.checked) : undefined}
            readOnly={!editMode}
          />
          <span className="toggle-slider"></span>
        </label>
        <label className="ml-2 block text-sm text-gray-700">{label}</label>
      </div>
    );
  };

  const renderPasswordInput = (field, label) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
          <input
            type={showPassword[field] ? "text" : "password"}
            value={passwordData[field]}
            onChange={(e) => handlePasswordChange(field, e.target.value)}
            className={`w-full px-3 py-2 border ${
              passwordErrors[field] ? 'border-red-500' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
            onClick={() => togglePasswordVisibility(field)}
          >
            {showPassword[field] ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {passwordErrors[field] && (
          <p className="mt-1 text-sm text-red-600">{passwordErrors[field]}</p>
        )}
      </div>
    );
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
            <FaFileMedical className="absolute -bottom-1 right-1 text-lg sm:text-xl bg-white rounded-full p-1 text-blue-600 border-2 border-blue-600" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold gradient-text border-b-2 border-blue-200 pb-2 flex items-center">
            My Patient Profile
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
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Picture */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div className="px-6 py-8 flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                src={editMode ? tempData.personalInfo.profilePic : data.personalInfo.profilePic} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            {editMode && (
              <label className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 shadow-md">
                <FaUpload />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h2>
          <div className="mt-2 flex items-center text-blue-600">
            <FaCheckCircle className="mr-1" />
            <span className="text-sm">Active Patient</span>
          </div>
        </div>
      </div>
      
      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('personal')}
        >
          <div className="flex items-center">
            <FaUser className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
          </div>
          {activeSections.personal ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.personal && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('personalInfo', 'firstName', 'First Name')}
              {renderInput('personalInfo', 'lastName', 'Last Name')}
              {renderInput('personalInfo', 'gender', 'Gender', 'select')}
              {renderInput('personalInfo', 'dob', 'Date of Birth', 'date')}
              {renderInput('personalInfo', 'bloodGroup', 'Blood Group')}
            </div>
          </div>
        )}
      </div>
      
      {/* Contact Information */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('contact')}
        >
          <div className="flex items-center">
            <FaPhone className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Contact Information</h2>
          </div>
          {activeSections.contact ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.contact && (
          <div className="px-6 py-4">
            {renderInput('contactInfo', 'phone', 'Phone Number')}
            {renderInput('contactInfo', 'email', 'Email Address', 'email')}
            {renderInput('contactInfo', 'address', 'Address')}
          </div>
        )}
      </div>
      
      {/* Medical Details */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('medical')}
        >
          <div className="flex items-center">
            <FaClinicMedical className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Medical Details</h2>
          </div>
          {activeSections.medical ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.medical && (
          <div className="px-6 py-4">
            {renderArrayInputs('medicalDetails', 'allergies', 'Allergies', 'Add Allergy')}
            {renderArrayInputs('medicalDetails', 'chronicConditions', 'Chronic Conditions', 'Add Condition')}
            {renderArrayInputs('medicalDetails', 'currentMedications', 'Current Medications', 'Add Medication')}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="text-md font-medium text-gray-800 mb-3">Export Medical Data</h3>
              <button
                onClick={exportMedicalData}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FaFilePdf className="mr-2" /> Download Medical Summary (PDF)
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Insurance Information */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn mb-6">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('insurance')}
        >
          <div className="flex items-center">
            <FaShieldAlt className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Insurance Information</h2>
          </div>
          {activeSections.insurance ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.insurance && (
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {renderInput('insuranceInfo', 'provider', 'Insurance Provider')}
              {renderInput('insuranceInfo', 'policyNumber', 'Policy Number')}
              {renderInput('insuranceInfo', 'validity', 'Policy Validity', 'date')}
            </div>
          </div>
        )}
      </div>
      
      {/* Account Settings */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden animate-fadeIn">
        <div 
          className="px-6 py-4 flex justify-between items-center cursor-pointer bg-gray-50 hover:bg-gray-100"
          onClick={() => toggleSection('account')}
        >
          <div className="flex items-center">
            <FaCog className="mr-3 text-blue-500" />
            <h2 className="text-lg font-medium text-gray-900">Account Settings</h2>
          </div>
          {activeSections.account ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
        </div>
        
        {activeSections.account && (
          <div className="px-6 py-4">
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Change Password</h4>
              <form onSubmit={handlePasswordSubmit}>
                {renderPasswordInput('currentPassword', 'Current Password')}
                {renderPasswordInput('newPassword', 'New Password')}
                {renderPasswordInput('confirmPassword', 'Confirm New Password')}
                <div className="mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
            
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-3">Notification Preferences</h4>
              <div className="space-y-2">
                {renderCheckbox('accountSettings', 'notifications.email', 'Email Notifications')}
                {renderCheckbox('accountSettings', 'notifications.sms', 'SMS Notifications')}
                {renderCheckbox('accountSettings', 'notifications.push', 'Push Notifications')}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">Danger Zone</h4>
              <button
                className="flex items-center px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <FaTrash className="mr-2" /> Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
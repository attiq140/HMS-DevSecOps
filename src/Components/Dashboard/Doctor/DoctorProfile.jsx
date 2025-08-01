import { useState } from 'react';
import { 
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaIdCard, 
  FaBriefcaseMedical, FaHospital, FaCalendarAlt, FaClock,
  FaGraduationCap, FaSignature, FaLanguage, FaFileUpload,
  FaLock, FaUserShield, FaEdit, FaSave, FaTimes, FaUserMd,
  FaClinicMedical, FaCertificate, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { MdOutlineWork, MdVerified, MdOutlineSecurity } from 'react-icons/md';
import { BsGenderAmbiguous, BsCalendarDate } from 'react-icons/bs';
import { HiOutlineDocumentText } from 'react-icons/hi';

// Custom CSS for animations and text shadow
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
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const CombinedProfileCard = () => {
  // Dummy doctor data
  const initialDoctorData = {
    personalInfo: {
      fullName: 'Dr. Sarah Johnson',
      profilePicture: 'https://randomuser.me/api/portraits/women/65.jpg',
      gender: 'Female',
      dateOfBirth: '1985-07-15',
      contactNumber: '+1 (555) 123-4567',
      email: 'sarah.johnson@hospital.com',
      cnic: '12345-6789012-3',
      address: '123 Medical Plaza, Suite 456, New York, NY 10001'
    },
    professionalInfo: {
      designation: 'Senior Consultant',
      department: 'Cardiology',
      specialization: 'Interventional Cardiology',
      experience: 12,
      licenseNumber: 'MED12345678',
      degrees: ['MD, Cardiology', 'PhD, Cardiovascular Sciences'],
      hospitalBranch: 'Main Hospital Center'
    },
    schedule: {
      workingDays: ['Monday', 'Wednesday', 'Friday'],
      workingHours: '9:00 AM - 5:00 PM',
      currentShift: 'Day Shift (8 hours)'
    },
    accountSettings: {
      username: 'dr.sarahj',
      twoFactorEnabled: true
    },
    additionalInfo: {
      bio: 'Board-certified cardiologist with 12 years of experience in interventional procedures. Special interest in preventive cardiology and heart failure management.',
      languages: ['English', 'Spanish', 'French'],
      signature: null,
      documents: []
    }
  };

  const [doctorData, setDoctorData] = useState(initialDoctorData);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [tempData, setTempData] = useState({...initialDoctorData});
  const [profileImage, setProfileImage] = useState(initialDoctorData.personalInfo.profilePicture);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [expandedSections, setExpandedSections] = useState({
    professional: true,
    schedule: true,
    account: true,
    additional: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleInputChange = (section, field, value) => {
    setTempData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setDoctorData(tempData);
    } else {
      setTempData({...doctorData});
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setTempData({...doctorData});
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    // Password change logic would go here
    alert('Password changed successfully!');
    setShowChangePassword(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const renderPersonalInfo = () => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 mb-4 sm:mb-6 border border-gray-200 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <FaUserMd className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
          <span className="gradient-text">Personal Information</span>
        </h2>
        {!isEditing && (
          <button 
            onClick={handleEditToggle}
            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
          >
            <FaEdit className="mr-1 sm:mr-2" />
            Edit Info
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        <div className="flex flex-col items-center w-full lg:w-auto">
          <div className="relative mb-3 sm:mb-4 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-all blur-md"></div>
            <img 
              src={profileImage} 
              alt="Profile" 
              className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-lg z-10"
            />
            {isEditing && (
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-white p-1 rounded-full shadow-lg z-20 transform hover:scale-110 transition-transform">
                <label className="cursor-pointer">
                  <FaFileUpload className="text-blue-600 text-sm sm:text-base" />
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageUpload}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-center mt-2">
            {isEditing ? (
              <input
                type="text"
                value={tempData.personalInfo.fullName}
                onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                className="border-b-2 border-blue-300 focus:border-blue-500 focus:outline-none text-center bg-transparent font-bold text-gray-800 text-base sm:text-lg w-full max-w-xs"
              />
            ) : (
              <span className="font-bold">{doctorData.personalInfo.fullName}</span>
            )}
          </h3>
          <p className="text-blue-600 font-medium mt-1 text-xs sm:text-sm">{doctorData.professionalInfo.designation}</p>
        </div>

        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-3">
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                  <BsGenderAmbiguous className="mr-1 sm:mr-2 text-blue-500" />
                  Gender
                </label>
                {isEditing ? (
                  <select
                    value={tempData.personalInfo.gender}
                    onChange={(e) => handleInputChange('personalInfo', 'gender', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                ) : (
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">{doctorData.personalInfo.gender}</p>
                )}
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                  <BsCalendarDate className="mr-1 sm:mr-2 text-blue-500" />
                  Date of Birth
                </label>
                {isEditing ? (
                  <input
                    type="date"
                    value={tempData.personalInfo.dateOfBirth}
                    onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">{new Date(doctorData.personalInfo.dateOfBirth).toLocaleDateString()}</p>
                )}
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                  <FaPhone className="mr-1 sm:mr-2 text-blue-500" />
                  Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={tempData.personalInfo.contactNumber}
                    onChange={(e) => handleInputChange('personalInfo', 'contactNumber', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">{doctorData.personalInfo.contactNumber}</p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                  <FaEnvelope className="mr-1 sm:mr-2 text-blue-500" />
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={tempData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">{doctorData.personalInfo.email}</p>
                )}
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                  <FaIdCard className="mr-1 sm:mr-2 text-blue-500" />
                  CNIC / National ID
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempData.personalInfo.cnic}
                    onChange={(e) => handleInputChange('personalInfo', 'cnic', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                  />
                ) : (
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">{doctorData.personalInfo.cnic}</p>
                )}
              </div>

              <div className="bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
                  <FaMapMarkerAlt className="mr-1 sm:mr-2 text-blue-500" />
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    value={tempData.personalInfo.address}
                    onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                    rows="2"
                  />
                ) : (
                  <p className="font-medium text-gray-800 text-xs sm:text-sm">{doctorData.personalInfo.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4">
          <button 
            onClick={handleCancelEdit}
            className="flex items-center justify-center bg-white text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all border border-gray-300 shadow-sm hover:shadow-md text-xs sm:text-sm"
          >
            <FaTimes className="mr-1" />
            Cancel
          </button>
          <button 
            onClick={handleEditToggle}
            className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
          >
            <FaSave className="mr-1" />
            Save Changes
          </button>
        </div>
      )}
    </div>
  );

  const renderProfessionalInfo = () => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 mb-4 sm:mb-6 border border-gray-200 animate-fadeIn">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection('professional')}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <FaBriefcaseMedical className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
          <span className="gradient-text">Professional Information</span>
        </h2>
        {expandedSections.professional ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </div>

      {expandedSections.professional && (
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">Designation</label>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{doctorData.professionalInfo.designation}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">Department</label>
              <div className="flex items-center">
                <FaClinicMedical className="text-blue-500 mr-1 sm:mr-2" />
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{doctorData.professionalInfo.department}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">Specialization</label>
              <p className="font-semibold text-gray-800 text-sm sm:text-base">{doctorData.professionalInfo.specialization}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">Experience</label>
              <div className="flex items-center">
                <div className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-bold mr-2 text-xs sm:text-sm">
                  {doctorData.professionalInfo.experience}+
                </div>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">years</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">License/Registration</label>
              <div className="flex items-center">
                <FaCertificate className="text-green-500 mr-1 sm:mr-2" />
                <p className="font-semibold text-gray-800 text-sm sm:text-base flex items-center">
                  {doctorData.professionalInfo.licenseNumber}
                  <MdVerified className="ml-1 text-green-500" />
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">Degrees & Certifications</label>
              <ul className="space-y-1">
                {doctorData.professionalInfo.degrees.map((degree, index) => (
                  <li key={index} className="font-medium text-gray-800 flex items-start text-xs sm:text-sm">
                    <FaGraduationCap className="text-blue-500 mt-0.5 mr-1 sm:mr-2 flex-shrink-0" />
                    {degree}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
              <label className="block text-xs font-medium text-gray-500 mb-1">Hospital Branch</label>
              <div className="flex items-center">
                <FaHospital className="text-blue-500 mr-1 sm:mr-2" />
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{doctorData.professionalInfo.hospitalBranch}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderSchedule = () => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 mb-4 sm:mb-6 border border-gray-200 animate-fadeIn">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection('schedule')}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <MdOutlineWork className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
          <span className="gradient-text">Schedule Summary</span>
        </h2>
        {expandedSections.schedule ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </div>

      {expandedSections.schedule && (
        <>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg border border-blue-200">
              <div className="flex items-center mb-1">
                <div className="bg-blue-100 p-1 rounded-lg mr-1 sm:mr-2">
                  <FaCalendarAlt className="text-blue-600 text-sm sm:text-base" />
                </div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Working Days</h3>
              </div>
              <ul className="space-y-1 pl-1">
                {doctorData.schedule.workingDays.map((day, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1 sm:mr-1.5"></div>
                    <span className="text-gray-700 font-medium text-xs sm:text-sm">{day}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200">
              <div className="flex items-center mb-1">
                <div className="bg-green-100 p-1 rounded-lg mr-1 sm:mr-2">
                  <FaClock className="text-green-600 text-sm sm:text-base" />
                </div>
                <h3 className="font-semibold text-green-800 text-sm sm:text-base">Working Hours</h3>
              </div>
              <p className="text-gray-700 font-medium pl-1 text-xs sm:text-sm">{doctorData.schedule.workingHours}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg border border-purple-200">
              <div className="flex items-center mb-1">
                <div className="bg-purple-100 p-1 rounded-lg mr-1 sm:mr-2">
                  <FaClock className="text-purple-600 text-sm sm:text-base" />
                </div>
                <h3 className="font-semibold text-purple-800 text-sm sm:text-base">Current Shift</h3>
              </div>
              <p className="text-gray-700 font-medium pl-1 text-xs sm:text-sm">{doctorData.schedule.currentShift}</p>
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <button className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm">
              <FaEdit className="mr-1" />
              Edit Schedule
            </button>
          </div>
        </>
      )}
    </div>
  );

  const renderAccountSettings = () => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 mb-4 sm:mb-6 border border-gray-200 animate-fadeIn">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection('account')}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <MdOutlineSecurity className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
          <span className="gradient-text">Account Settings</span>
        </h2>
        {expandedSections.account ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </div>

      {expandedSections.account && (
        <div className="mt-4 space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-1">Username</label>
            <p className="font-semibold text-gray-800 text-sm sm:text-base">{doctorData.accountSettings.username}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Password</label>
                <p className="font-semibold text-gray-800 text-sm sm:text-base">••••••••</p>
              </div>
              <button 
                onClick={() => setShowChangePassword(true)}
                className="mt-2 sm:mt-0 flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
              >
                Change Password
              </button>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Two-Factor Authentication</label>
                <p className="font-semibold text-gray-800 text-xs sm:text-sm">
                  {doctorData.accountSettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer mt-2 sm:mt-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={doctorData.accountSettings.twoFactorEnabled}
                  onChange={() => {}}
                />
                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] sm:after:top-0.5 sm:after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          {showChangePassword && (
            <div className="mt-4 bg-white p-3 rounded-lg border border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Change Password</h3>
              <form onSubmit={handlePasswordSubmit}>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="w-full border border-gray-300 rounded-lg p-1.5 sm:p-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 bg-white text-xs sm:text-sm"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-3">
                  <button 
                    type="button"
                    onClick={() => setShowChangePassword(false)}
                    className="px-3 py-1.5 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition-all border border-gray-300 shadow-sm hover:shadow-md text-xs sm:text-sm"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg p-4 mb-4 sm:mb-6 border border-gray-200 animate-fadeIn">
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleSection('additional')}
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
          <FaUserShield className="mr-2 sm:mr-3 text-blue-600 text-lg sm:text-xl" />
          <span className="gradient-text">Additional Information</span>
        </h2>
        {expandedSections.additional ? (
          <FaChevronUp className="text-gray-500" />
        ) : (
          <FaChevronDown className="text-gray-500" />
        )}
      </div>

      {expandedSections.additional && (
        <div className="mt-4 space-y-3">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-1">Bio / About Me</label>
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm">{doctorData.additionalInfo.bio}</p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
              <FaLanguage className="mr-1 sm:mr-2 text-blue-500" />
              Languages Spoken
            </label>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {doctorData.additionalInfo.languages.map((language, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-medium flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 sm:mr-1.5"></span>
                  {language}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
              <FaSignature className="mr-1 sm:mr-2 text-blue-500" />
              Digital Signature
            </label>
            {doctorData.additionalInfo.signature ? (
              <img 
                src={doctorData.additionalInfo.signature} 
                alt="Signature" 
                className="h-16 sm:h-20 border-2 border-gray-200 rounded-lg"
              />
            ) : (
              <button className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-3 py-1.5 rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg text-xs sm:text-sm">
                <FaFileUpload className="mr-1 sm:mr-2" />
                Upload Signature
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center">
              <HiOutlineDocumentText className="mr-1 sm:mr-2 text-blue-500" />
              Documents
            </label>
            <div className="space-y-1.5">
              <button className="flex items-center justify-center bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all border border-blue-200 shadow-sm hover:shadow-md w-full text-xs sm:text-sm">
                <FaFileUpload className="mr-1 sm:mr-2" />
                Upload Medical License
              </button>
              <button className="flex items-center justify-center bg-white text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all border border-blue-200 shadow-sm hover:shadow-md w-full text-xs sm:text-sm">
                <FaFileUpload className="mr-1 sm:mr-2" />
                Upload CNIC Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full px-3 sm:px-4 md:px-6">
      <style>{styles}</style>
      
      {/* Main Card Container */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 sm:gap-3 animate-scaleIn">
              <div className="relative">
                <FaUserMd className="text-xl sm:text-2xl md:text-3xl text-white" aria-hidden="true" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-white flex items-center">
                Doctor Profile
                <span className="ml-1 sm:ml-2 text-xs font-normal bg-black bg-opacity-20 text-white px-2 py-0.5 sm:px-3 sm:py-1 rounded-full">
                  {doctorData.professionalInfo.designation}
                </span>
              </h2>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="bg-black bg-opacity-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium">
                <span className="mr-1">Status:</span>
                <span className="font-bold">Active</span>
              </div>
              <div className="bg-black bg-opacity-20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium flex items-center">
                <MdVerified className="mr-1 text-yellow-300" />
                Verified
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto no-scrollbar">
          <nav className="flex w-max min-w-full">
            <button
              onClick={() => setActiveTab('personal')}
              className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'personal' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUserMd className="mr-1 sm:mr-2" />
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab('professional')}
              className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'professional' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaBriefcaseMedical className="mr-1 sm:mr-2" />
              Professional
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'schedule' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MdOutlineWork className="mr-1 sm:mr-2" />
              Schedule
            </button>
            <button
              onClick={() => setActiveTab('account')}
              className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'account' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MdOutlineSecurity className="mr-1 sm:mr-2" />
              Account
            </button>
            <button
              onClick={() => setActiveTab('additional')}
              className={`px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-medium flex items-center whitespace-nowrap border-b-2 transition-colors ${
                activeTab === 'additional' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FaUserShield className="mr-1 sm:mr-2" />
              Additional
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="p-3 sm:p-4 md:p-6">
          {activeTab === 'personal' && renderPersonalInfo()}
          {activeTab === 'professional' && renderProfessionalInfo()}
          {activeTab === 'schedule' && renderSchedule()}
          {activeTab === 'account' && renderAccountSettings()}
          {activeTab === 'additional' && renderAdditionalInfo()}
        </div>
      </div>
    </div>
  );
};

export default CombinedProfileCard;
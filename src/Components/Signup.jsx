import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaStethoscope, 
         FaUserShield, FaUserNurse, FaUserTie, FaUserMd, FaUserInjured, 
         FaArrowRight, FaEye, FaEyeSlash, FaClinicMedical } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import ReCAPTCHA from "react-google-recaptcha";
import 'react-toastify/dist/ReactToastify.css';

const ROLES = [
  { value: 'patient', label: 'Patient', icon: <FaUserInjured /> },
  { value: 'doctor', label: 'Doctor', icon: <FaUserMd /> },
  { value: 'nurse', label: 'Nurse', icon: <FaUserNurse /> },
  { value: 'admin', label: 'Admin', icon: <FaUserShield /> },
  { value: 'staff', label: 'Staff', icon: <FaUserTie /> },
  { value: 'super_admin', label: 'Super Admin', icon: <FaUserShield /> },
  { value: 'accountant', label: 'Accountant', icon: <FaUserTie /> },
  { value: 'case_handler', label: 'Case Handler', icon: <FaUserTie /> },
  { value: 'receptionist', label: 'Receptionist', icon: <FaUserTie /> },
  { value: 'pharmacist', label: 'Pharmacist', icon: <FaUserMd /> },
  { value: 'lab_technician', label: 'Lab Technician', icon: <FaUserMd /> },
  { value: 'hr_manager', label: 'HR Manager', icon: <FaUserTie /> },
];

const motionVariants = {
  container: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  },
  field: (delay = 0) => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay } },
  }),
  roleFields: {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: 'auto', transition: { duration: 0.3 } },
  },
};

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    licenseNumber: '',
    specialization: '',
    department: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const navigate = useNavigate();

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = {...prev};
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors = {};
    const { fullName, email, phone, password, confirmPassword, role, agreeToTerms } = formData;

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!role) newErrors.role = 'Please select a role';
    if (!agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    if (!recaptchaValue) newErrors.recaptcha = 'Please verify you are not a robot';

    if (role === 'doctor' && !formData.licenseNumber) {
      newErrors.licenseNumber = 'License number is required';
    }
    if ((role === 'doctor' || role === 'nurse') && !formData.specialization) {
      newErrors.specialization = 'Specialization is required';
    }

    return newErrors;
  }, [formData, recaptchaValue]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstError = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstError}"]`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      toast.error('Please fix the form errors');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Account created successfully!');
      navigate('/login');
    } catch (error) {
      toast.error('Account creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, navigate]);

  const renderInputField = useCallback(({ name, label, type = 'text', placeholder, Icon, required = false, error, isPassword = false }) => {
    const inputType = isPassword 
      ? (name === 'password' 
        ? (showPassword ? 'text' : 'password') 
        : (showConfirmPassword ? 'text' : 'password'))
      : type;

    return (
      <motion.div 
        variants={motionVariants.field(0.2)} 
        className="mb-4"
        initial="hidden"
        animate="visible"
      >
        <label className="block text-gray-700 font-medium mb-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400" />
          </div>
          <input
            type={inputType}
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full pl-10 pr-10 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition`}
            placeholder={placeholder}
          />
          {isPassword && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              onClick={() => name === 'password' 
                ? setShowPassword(!showPassword) 
                : setShowConfirmPassword(!showConfirmPassword)}
              aria-label={inputType === 'password' ? 'Show password' : 'Hide password'}
            >
              {inputType === 'password' ? <FaEye /> : <FaEyeSlash />}
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </motion.div>
    );
  }, [formData, handleChange, showPassword, showConfirmPassword]);

  const getRoleSpecificFields = useMemo(() => {
    switch (formData.role) {
      case 'doctor':
        return (
          <>
            {renderInputField({
              name: 'licenseNumber',
              label: 'License Number',
              placeholder: 'MD-123456',
              Icon: FaIdCard,
              required: true,
              error: errors.licenseNumber,
            })}
            {renderInputField({
              name: 'specialization',
              label: 'Specialization',
              placeholder: 'Cardiology, Neurology, etc.',
              Icon: FaStethoscope,
              required: true,
              error: errors.specialization,
            })}
            {renderInputField({
              name: 'department',
              label: 'Department',
              placeholder: 'Cardiology Department',
              Icon: FaUserTie,
              error: errors.department,
            })}
          </>
        );
      case 'nurse':
        return (
          <>
            {renderInputField({
              name: 'specialization',
              label: 'Specialization',
              placeholder: 'Pediatrics, ICU, etc.',
              Icon: FaStethoscope,
              required: true,
              error: errors.specialization,
            })}
            {renderInputField({
              name: 'department',
              label: 'Department',
              placeholder: 'Emergency Department',
              Icon: FaUserTie,
              error: errors.department,
            })}
          </>
        );
      default:
        return null;
    }
  }, [formData.role, errors, renderInputField]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer 
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={motionVariants.container}
        className="max-w-2xl mx-auto text-center mb-12"
      >
        <motion.span 
          variants={motionVariants.field(0.1)} 
          className="inline-flex items-center bg-blue-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4"
        >
          <FaClinicMedical className="mr-2" />
          ClinicPro v2.0
        </motion.span>
        <motion.h1 
          variants={motionVariants.field(0.2)} 
          className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-6"
        >
          Join <span className="text-red-600">ClinicPro</span>
        </motion.h1>
        <motion.p 
          variants={motionVariants.field(0.3)} 
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          The complete clinic management solution for modern healthcare providers
        </motion.p>
        
        <motion.div 
          variants={motionVariants.field(0.4)}
          className="mt-8 bg-blue-50 p-6 rounded-lg text-left"
        >
          <h3 className="text-lg font-semibold text-blue-800 mb-3">Why Join ClinicPro?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Streamline patient management and appointments</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Secure, cloud-based medical records</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Integrated billing and insurance processing</span>
            </li>
            <li className="flex items-start">
              <svg className="h-5 w-5 text-blue-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>HIPAA-compliant data security</span>
            </li>
          </ul>
        </motion.div>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={motionVariants.container}
        className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8"
      >
        <form onSubmit={handleSubmit} noValidate>
          {renderInputField({
            name: 'fullName',
            label: 'Full Name',
            placeholder: 'John Doe',
            Icon: FaUser,
            required: true,
            error: errors.fullName,
          })}

          {renderInputField({
            name: 'email',
            label: 'Email Address',
            type: 'email',
            placeholder: 'john@example.com',
            Icon: FaEnvelope,
            required: true,
            error: errors.email,
          })}

          {renderInputField({
            name: 'phone',
            label: 'Phone Number',
            type: 'tel',
            placeholder: '+1 (555) 123-4567',
            Icon: FaPhone,
            required: true,
            error: errors.phone,
          })}

          {renderInputField({
            name: 'password',
            label: 'Password',
            type: 'password',
            placeholder: '••••••••',
            Icon: FaLock,
            required: true,
            error: errors.password,
            isPassword: true,
          })}

          {renderInputField({
            name: 'confirmPassword',
            label: 'Confirm Password',
            type: 'password',
            placeholder: '••••••••',
            Icon: FaLock,
            required: true,
            error: errors.confirmPassword,
            isPassword: true,
          })}

          <motion.div 
            variants={motionVariants.field(0.5)} 
            className="mb-6"
            initial="hidden"
            animate="visible"
          >
            <label className="block text-gray-700 font-medium mb-2">
              Role<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full pl-4 pr-10 py-3 border ${errors.role ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 bg-white appearance-none`}
                required
              >
                <option value="">Select your role</option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
          </motion.div>

          {formData.role && (
            <motion.div
              variants={motionVariants.roleFields}
              initial="hidden"
              animate="visible"
              className="mb-6 overflow-hidden"
            >
              
              {getRoleSpecificFields}
            </motion.div>
          )}

          <motion.div 
            variants={motionVariants.field(0.6)} 
            className="mb-6"
            initial="hidden"
            animate="visible"
          >
            <ReCAPTCHA
              sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // Replace with your actual key
              onChange={(value) => setRecaptchaValue(value)}
              onErrored={() => setRecaptchaValue(null)}
              onExpired={() => setRecaptchaValue(null)}
              className="flex justify-center"
            />
            {errors.recaptcha && <p className="text-red-500 text-sm mt-2 text-center">{errors.recaptcha}</p>}
          </motion.div>

          <motion.div 
            variants={motionVariants.field(0.7)} 
            className="mb-6"
            initial="hidden"
            animate="visible"
          >
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 ${errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'} text-blue-600 focus:ring-blue-500 rounded`}
                  required
                />
              </div>
              <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-red-600 hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-red-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-1">{errors.agreeToTerms}</p>}
          </motion.div>

          <motion.button
            variants={motionVariants.field(0.8)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition flex items-center justify-center ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
            }`}
            initial="hidden"
            animate="visible"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </>
            ) : (
              <>
                Join ClinicPro
                <FaArrowRight className="ml-2" />
              </>
            )}
          </motion.button>

          <motion.p 
            variants={motionVariants.field(0.9)} 
            className="text-center text-gray-600 mt-6"
            initial="hidden"
            animate="visible"
          >
            Already using ClinicPro?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline font-medium focus:outline-none"
            >
              Sign in to your account
            </button>
          </motion.p>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaEnvelope, FaPhone, FaUserShield, FaEye, FaEyeSlash, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const roles = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'admin', label: 'Admin' },
  { value: 'receptionist', label: 'Receptionist' },
  { value: 'pharmacist', label: 'Pharmacist' },
  { value: 'lab_technician', label: 'Lab Technician' },
  { value: 'accountant', label: 'Accountant' },
  { value: 'hr_manager', label: 'HR Manager' },
  { value: 'super_admin', label: 'Super Admin' },
];

const ForgotPassword = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [role, setRole] = useState('patient');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: initial, 2: OTP, 3: new password
  const [countdown, setCountdown] = useState(0);
  const [captchaText, setCaptchaText] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  const [attempts, setAttempts] = useState(0);
  const navigate = useNavigate();

  // Generate CAPTCHA
  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
    setUserCaptcha('');
  };

  // Countdown timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = () => {
    if (!emailOrPhone) {
      toast.error('Please enter your email or phone number');
      return;
    }

    if (userCaptcha !== captchaText) {
      toast.error('CAPTCHA verification failed');
      setAttempts(attempts + 1);
      generateCaptcha();
      return;
    }

    // In real app, send OTP to email/phone here
    setStep(2);
    setCountdown(30); // 30 seconds countdown
    setAttempts(0);
    toast.success('OTP sent successfully!');
  };

  const handleResendOTP = () => {
    if (countdown > 0) return;
    setCountdown(30);
    toast.success('OTP resent successfully!');
    // Resend OTP logic would go here
  };

  const handleVerifyOTP = () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    setStep(3);
    toast.success('OTP verified! Please set a new password');
  };

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!validatePassword(newPassword)) {
      toast.error('Password does not meet requirements');
      return;
    }

    // Password reset logic would go here
    toast.success('Password has been reset successfully!');
    navigate('/login');
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const getPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[@$!%*?&]/.test(password)) strength += 1;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden p-6"
      >
        <div className="text-center mb-6">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="flex justify-center text-red-600 mb-2"
          >
            <FaLock className="text-4xl" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-800"
          >
            Forgot Your Password?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mt-2"
          >
            {step === 1 
              ? "Enter your registered email or phone number to receive a reset code"
              : step === 2
              ? "We've sent a 6-digit code to your registered contact"
              : "Create a new secure password"}
          </motion.p>
        </div>

        {step === 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email or Phone Number<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  {emailOrPhone.includes('@') ? <FaEnvelope /> : <FaPhone />}
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Email or phone number"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaUserShield />
                </div>
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CAPTCHA Verification<span className="text-red-500">*</span>
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex-1 bg-gray-100 p-2 rounded-lg text-center font-mono text-lg tracking-widest">
                  {captchaText}
                </div>
                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <FaRedo />
                </button>
              </div>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Enter CAPTCHA"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSendOTP}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Send OTP
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                6-digit OTP<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-center font-mono tracking-widest"
                placeholder="------"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
              <div className="text-right mt-1 text-sm">
                {countdown > 0 ? (
                  <span className="text-gray-500">
                    Resend in {countdown}s
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="text-red-600 hover:text-red-800"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleVerifyOTP}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Verify OTP
            </motion.button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="mt-1">
                <div className="flex space-x-1 h-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-full ${
                        i < passwordStrength
                          ? i < 2
                            ? 'bg-red-400'
                            : i < 3
                            ? 'bg-yellow-400'
                            : i < 4
                            ? 'bg-blue-400'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    ></div>
                  ))}
                </div>
                <ul className="text-xs text-gray-600 mt-2 list-disc pl-5">
                  <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                    At least 8 characters
                  </li>
                  <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                    1 uppercase letter
                  </li>
                  <li className={/\d/.test(newPassword) ? 'text-green-600' : ''}>
                    1 number
                  </li>
                  <li className={/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : ''}>
                    1 special character (@$!%*?&)
                  </li>
                </ul>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleResetPassword}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition duration-200"
            >
              Reset Password
            </motion.button>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-6 text-center"
        >
          <button
            onClick={() => navigate('/login')}
            className="text-red-600 hover:text-red-800 text-sm flex items-center justify-center"
          >
            <FaArrowLeft className="mr-1" /> Back to Login
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
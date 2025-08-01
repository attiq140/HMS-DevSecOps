import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaLock, FaEnvelope, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

const roles = [
  { label: 'SUPER ADMIN', color: 'bg-purple-600 hover:bg-purple-700', route: '/super-admin' },
  { label: 'DOCTOR', color: 'bg-cyan-700 hover:bg-cyan-800', route: '/doctor' },
  { label: 'ACCOUNTANT', color: 'bg-orange-500 hover:bg-orange-600', route: '/accountant' },
  { label: 'CASE HANDLER', color: 'bg-green-600 hover:bg-green-700', route: '/case-handler' },
  { label: 'RECEPTIONIST', color: 'bg-cyan-500 hover:bg-cyan-600', route: '/receptionist' },
  { label: 'PHARMACIST', color: 'bg-gray-600 hover:bg-gray-700', route: '/pharmacist' },
  { label: 'LAB TECHNICIAN', color: 'bg-yellow-600 hover:bg-yellow-700', route: '/lab-technician' },
  { label: 'NURSE', color: 'bg-purple-500 hover:bg-purple-600', route: '/nurse' },
  { label: 'HR MANAGER', color: 'bg-pink-600 hover:bg-pink-700', route: '/hr-manager' },
  { label: 'PATIENT', color: 'bg-red-500 hover:bg-red-600', route: '/patient' },
];

const motionVariants = {
  container: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  },
  item: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 10 } },
    hover: { scale: 1.03, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    selected: {
      scale: 1.05,
      boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.5), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      zIndex: 10,
      transition: { type: 'spring', stiffness: 300, damping: 15 },
    },
  },
  checkmark: {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 15 } },
  },
  form: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.3 } },
  },
  field: (delay) => ({
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { delay } },
  }),
};

const RoleButton = ({ role, selectedRole, setSelectedRole }) => (
  <motion.div className="relative" whileHover="hover" animate={selectedRole === role.label ? 'selected' : 'visible'} variants={motionVariants.item}>
    <button
      type="button"
      className={`w-full text-white text-sm font-semibold py-4 px-2 rounded-lg border-2 ${selectedRole === role.label ? 'border-red-500' : 'border-transparent'} ${role.color}`}
      onClick={() => setSelectedRole(role.label)}
    >
      {role.label}
      {selectedRole === role.label && (
        <motion.span className="absolute top-1 right-1" variants={motionVariants.checkmark} initial="hidden" animate="visible">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.span>
      )}
    </button>
    {selectedRole === role.label && (
      <motion.div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2" variants={motionVariants.checkmark} initial="hidden" animate="visible">
        <div className="w-4 h-4 bg-red-500 rotate-45" />
      </motion.div>
    )}
  </motion.div>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    if (!email) return toast.error('Please enter your email'), false;
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error('Please enter a valid email'), false;
    if (!password) return toast.error('Please enter your password'), false;
    if (!selectedRole) return toast.error('Please select your role'), false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Find the selected role object
      const role = roles.find(r => r.label === selectedRole);
      
      if (role) {
        toast.success(`Login successful as ${selectedRole}!`);
        // Navigate to the specific route for the selected role
        navigate(role.route);
      } else {
        toast.error('Invalid role selected');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
      <motion.div initial="hidden" animate="visible" variants={motionVariants.container} className="max-w-4xl mx-auto text-center mb-12">
        <motion.span variants={motionVariants.item} className="inline-block bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          Healthcare Management System
        </motion.span>
        <motion.h1 variants={motionVariants.item} className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl mb-6">
          Secure <span className="text-red-600">Login Portal</span>
        </motion.h1>
      </motion.div>

      <div className="max-w-4xl mx-auto flex flex-col lg:flex-row gap-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={motionVariants.container}
          className="lg:w-1/2 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 p-6"
        >
          <motion.h2 variants={motionVariants.item} className="text-2xl font-bold text-center text-gray-800 mb-6">
            Select Your Role
          </motion.h2>
          <div className="space-y-4">
            {[roles.slice(0, 4), roles.slice(4, 7), roles.slice(7)].map((group, idx) => (
              <div key={idx} className={`grid grid-cols-${idx === 0 ? 2 : 3} gap-4`}>
                {group.map((role) => (
                  <RoleButton key={role.label} role={role} selectedRole={selectedRole} setSelectedRole={setSelectedRole} />
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial="form"
          animate="visible"
          variants={motionVariants.form}
          className="lg:w-1/2 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 p-8"
        >
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.4 }} className="flex justify-center mb-8">
            <div className="bg-red-100 p-4 rounded-full">
              <FaUserShield className="text-red-600 text-4xl" />
            </div>
          </motion.div>
          <motion.h2 variants={motionVariants.field(0.5)} className="text-2xl font-bold text-center text-gray-800 mb-8">
            Sign In
          </motion.h2>

          <form onSubmit={handleSubmit} noValidate>
            <motion.div variants={motionVariants.field(0.6)} className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Email Address<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaEnvelope className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="admin@hms.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </motion.div>

            <motion.div variants={motionVariants.field(0.7)} className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Password<span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FaLock className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-300 focus:border-red-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={motionVariants.field(0.8)} className="flex justify-between items-center mb-8">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="ml-2 text-gray-700">
                  Remember Me
                </label>
              </div>
              <button 
                type="button" 
                onClick={() => navigate('/forgetpassword')}
                className="text-sm text-red-600 hover:underline font-medium"
              >
                Forgot Password?
              </button>
            </motion.div>

            <motion.button
              variants={motionVariants.field(0.9)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full bg-red-600 text-white font-medium py-3 px-4 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="ml-2" />
                </>
              )}
            </motion.button>
          </form>

          <motion.p variants={motionVariants.field(1)} className="text-center text-gray-600 mt-8">
            New Here?{' '}
            <button onClick={() => navigate('/signup')} className="text-red-600 hover:underline font-medium">
              Create an Account
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
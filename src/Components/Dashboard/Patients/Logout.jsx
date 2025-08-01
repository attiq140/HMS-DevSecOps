import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

const Logout = () => {
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      navigate('/login', { replace: true });
    }, 1500);
  };

  const handleCancel = () => navigate(-1);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <FiAlertTriangle className="mr-2 text-yellow-500" />
            Confirm Logout
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
            disabled={isLoggingOut}
          >
            <FiX size={20} />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to logout? You'll need to sign in again to access your account.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            disabled={isLoggingOut}
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center justify-center"
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Logging Out...
              </>
            ) : (
              'Yes, Logout'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Logout;
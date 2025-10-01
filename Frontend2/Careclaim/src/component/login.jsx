import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// A simple SVG for the Google 'G' logo
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    {/* SVG paths remain the same */}
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const LoginPage = ({ handleLogin }) => {
  const navigate = useNavigate();
  // Define the base URL for your backend API
  // You should move this to a .env file for production
  const BACKEND_URL = "http://localhost:5000";

  // Check if user is already authenticated when component mounts
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/profile`, {
          credentials: 'include' // Include cookies for session-based auth
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            handleLogin();
            navigate('/');
          }
        }
      } catch (error) {
        console.log('Not authenticated or auth check failed');
      }
    };

    checkAuthStatus();
  }, [handleLogin, navigate]);

  const handleGoogleLogin = () => {
    // Redirect the user to the backend's Google authentication route
    // The backend will redirect back to the frontend after successful authentication
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
      <div className="w-full max-w-md p-8 space-y-8">
        {/* Logo and App Name */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner shadow-slate-900/20">
            <span className="text-white font-bold text-4xl">C</span>
          </div>
          <span className="text-4xl font-semibold text-gray-900">CareClaim</span>
          <p className="text-gray-500 text-lg">Sign in to manage your claims.</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">Welcome!</h2>
            <p className="text-center text-gray-500">
              Please sign in with your Google account to continue.
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin} // <-- ADD THIS ONCLICK HANDLER
              className="w-full flex items-center justify-center space-x-3 py-3 px-4 border border-gray-300 rounded-lg text-gray-800 font-medium hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              <GoogleIcon />
              <span>Sign in with Google</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} CareClaim. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
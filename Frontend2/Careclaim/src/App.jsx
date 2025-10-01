<<<<<<< HEAD
// src/App.jsx
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './component/dashboard';
import MyClaimsPage from './component/myclaim';
import SubmitClaimPage from './component/newclaim';
import SettingsPage from './component/setting';
import LoginPage from './component/header';
// Define the routes as a flat array of objects
const router = createBrowserRouter([
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/myclaims',
    element: <MyClaimsPage />,
  },
  {
    path: '/newclaim',
    element: <SubmitClaimPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/',
    element: <LoginPage />,
  },
]);

function App() {
  // Use the router in the App component by passing it to RouterProvider
  return (
    <RouterProvider router={router} />
  );
}

export default App;
=======
import React, { useState, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

// Import all page components
import Dashboard from './component/dashboard.jsx';
import MyClaimsPage from './component/myclaim.jsx';
import SubmitClaimPage from './component/newclaim.jsx';
import SettingsPage from './component/setting.jsx';
import LoginPage from './component/login.jsx';
import DocumentsPage from './component/document.jsx';
import PoliciesPage from './component/policies.jsx';

// Main App Component that manages routing and authentication state
function App() {
  // State to track whether the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(!!data.user);
        }
      } catch (error) {
        console.log('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Function to be called on successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Function to be called on logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'GET',
        credentials: 'include'
      });
    } catch (error) {
      console.log('Logout error:', error);
    }
    setIsAuthenticated(false);
  };

  // A wrapper component to protect routes that require authentication
  const ProtectedRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">C</span>
            </div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }
    
    if (!isAuthenticated) {
      // If the user is not authenticated, redirect them to the login page
      return <Navigate to="/login" replace />;
    }
    // If authenticated, render the requested component and pass the logout handler to it
    return React.cloneElement(children, { handleLogout });
  };


  // Define the application's routes
  const router = createBrowserRouter([
    {
      path: '/login',
      // The login page is always accessible and receives the handleLogin function
      element: <LoginPage handleLogin={handleLogin} />,
    },
    {
      path: '/',
      // The root path is protected; it will render the Dashboard or redirect to login
      element: <ProtectedRoute><Dashboard /></ProtectedRoute>,
    },
    {
      path: '/myclaims',
      element: <ProtectedRoute><MyClaimsPage /></ProtectedRoute>,
    },
    {
      path: '/newclaim',
      element: <ProtectedRoute><SubmitClaimPage /></ProtectedRoute>,
    },
    {
      path: '/settings',
      element: <ProtectedRoute><SettingsPage /></ProtectedRoute>,
    },
    {
      path: '/documents',
      element: <ProtectedRoute><DocumentsPage /></ProtectedRoute>,
    },
    {
      path: '/policies',
      element: <ProtectedRoute><PoliciesPage /></ProtectedRoute>,
    },
    {
      // A catch-all route to redirect any unknown paths
      path: '*',
      element: <Navigate to={isAuthenticated ? "/" : "/login"} replace />,
    }
  ]);

  // Provide the router configuration to the application
  return <RouterProvider router={router} />;
}

export default App;


>>>>>>> 024cb20 (feat: setup of auth and database)

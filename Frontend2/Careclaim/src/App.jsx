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

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Web3Provider } from './context/Web3context.jsx'; // <-- IMPORT IT
import axios from 'axios';

axios.defaults.baseURL = `${import.meta.env.VITE_BACKEND_URL}`; // Set base URL for all Axios requests
axios.defaults.withCredentials = true; // Ensure cookies are sent with requests

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Web3Provider> {/* <-- WRAP YOUR APP */}
        <App />
      </Web3Provider>

  </React.StrictMode>,
);

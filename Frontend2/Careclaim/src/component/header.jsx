import React, { useEffect, useState } from 'react';
import { BarChart3, Plus, List, Shield, Settings, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers'; // <-- 1. IMPORTED ETHERS

const Header = ({ currentPage }) => {
  const navigate = useNavigate();
  const [userdata, setUserdata] = useState(null);
  
  // --- New Web3 State ---
  const [account, setAccount] = useState(null);
  // -----------------------

  const fetchData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/profile`, {
        credentials: 'include' // Include cookies for session-based auth
      });
      
      if (response.ok) {
        const data = await response.json();
        setUserdata(data.user);
        console.log('User data:', data);
      } else {
        console.log('Failed to fetch profile:', response.status);
        setUserdata(null);
      }
    } catch (error) {
      console.log("Error fetching profile:", error);
      setUserdata(null);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- New Web3 Function ---
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        console.log("Wallet connected:", accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("Please install MetaMask to use this app!");
    }
  };

  // Helper function to show a shorter address
  const truncateAddress = (address) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };
  // -------------------------

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center shadow-inner shadow-slate-900/20">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-2xl font-semibold text-gray-900">CareClaim</span>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'dashboard' 
                ? 'text-slate-900 bg-slate-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
            onClick={() => navigate('/')}>
              <BarChart3 className="w-4 h-4" /><span>Dashboard</span>
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'newclaim' 
                ? 'text-slate-900 bg-slate-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
            onClick={() => navigate('/newclaim')}>
              <Plus className="w-4 h-4" /><span>Submit Claim</span>
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'myclaims' 
                ? 'text-slate-900 bg-slate-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
            onClick={() => navigate('/myclaims')}>
              <List className="w-4 h-4" /><span>My Claims</span>
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'policies' 
                ? 'text-slate-900 bg-slate-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
            onClick={() => navigate('/policies')}>
              <Shield className="w-4 h-4" /><span>Policies</span>
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'documents' 
                ? 'text-slate-900 bg-slate-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
            onClick={() => navigate('/documents')}>
              <FileText className="w-4 h-4" /><span>Documents</span>
            </button>
            <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentPage === 'settings' 
                ? 'text-slate-900 bg-slate-100' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-slate-100'
            }`}
            onClick={() => navigate('/settings')}>
              <Settings className="w-4 h-4" /><span>Settings</span>
            </button>
          </div>
        </div>
        
        {/* --- MODIFIED RIGHT SIDE --- */}
        <div className="flex items-center space-x-4"> {/* Added space */}
          
          {/* New Wallet Button/Display */}
          <div>
            {account ? (
              <span className="px-3 py-2 bg-slate-100 text-slate-900 rounded-lg text-sm font-mono font-medium">
                {truncateAddress(account)}
              </span>
            ) : (
              <button
                onClick={connectWallet}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>

          {/* Existing User Profile Display */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-gray-200">
              <span className="text-white text-sm font-medium">
                {userdata?.name ? userdata.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
              </span>
            </div>
            <span className="text-gray-800 hidden sm:inline font-medium">
              {userdata?.name || 'User'}
            </span>
          </div>
        </div>
        {/* ------------------------- */}
        
      </div>
    </nav>
  );
};

export default Header;
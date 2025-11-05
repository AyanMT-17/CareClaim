import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Search, ChevronDown, FileText, CheckCircle, Clock, DollarSign, AlertCircle } from 'lucide-react';

// Main Dashboard Component
const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch claims
        const claimsResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/claims`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        const claimsData = await claimsResponse.json();
        
        // Fetch policies
        const policiesResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/policies`, {
          credentials: 'include',
          headers: { 'Accept': 'application/json' }
        });
        const policiesData = await policiesResponse.json();

        if (claimsResponse.ok && policiesResponse.ok) {
          setClaims(claimsData?.ok ? claimsData.items : []);
          setPolicies(policiesData?.ok ? policiesData.items : []);
          if (!claimsData?.ok || !policiesData?.ok) {
            console.warn('API returned ok:false -', claimsData?.error || policiesData?.error);
          }
        } else {
          setError('Failed to fetch data: ' + (claimsData?.error || policiesData?.error || 'Unknown error'));
        }
        
        // Debug log
        console.log('Claims data:', claimsData);
        console.log('Policies data:', policiesData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalClaims = claims.length;
    const approvedClaims = claims.filter(c => c.status === 'Approved').length;
    const pendingClaims = claims.filter(c => ['Draft', 'Submitted', 'InReview'].includes(c.status)).length;
    const totalValue = claims.reduce((sum, claim) => sum + (claim.incident?.amountClaimed || 0), 0);

    return [
      { 
        title: 'Total Claims', 
        value: totalClaims.toString(), 
        change: `${policies.length} Policies`, 
        changeType: 'positive', 
        icon: FileText, 
        color: 'slate' 
      },
      { 
        title: 'Approved Claims', 
        value: approvedClaims.toString(), 
        change: `${((approvedClaims/totalClaims)*100 || 0).toFixed(0)}%`, 
        changeType: 'positive', 
        icon: CheckCircle, 
        color: 'green' 
      },
      { 
        title: 'Pending Review', 
        value: pendingClaims.toString(), 
        change: `${((pendingClaims/totalClaims)*100 || 0).toFixed(0)}%`, 
        changeType: pendingClaims ? 'negative' : 'positive', 
        icon: Clock, 
        color: 'slate' 
      },
      { 
        title: 'Total Value', 
        value: totalValue.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          maximumFractionDigits: 0
        }), 
        change: `${policies.length} Active`, 
        changeType: 'positive', 
        icon: DollarSign, 
        color: 'green' 
      }
    ];
  }, [claims, policies]);

  // --- Filtering Logic ---
  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      // Status filter
      const statusMatch = statusFilter === 'All Status' || claim.status === statusFilter;
      if (!statusMatch) return false;
      
      // Search filter - search through nested objects too
      if (!searchTerm) return true;
      
      const searchLower = searchTerm.toLowerCase();
      const searchFields = {
        id: claim._id,
        userId: claim.userId,
        status: claim.status,
        provider: claim.incident?.provider,
        type: claim.incident?.type,
        details: claim.incident?.details,
        amount: claim.incident?.amountClaimed?.toString()
      };
      
      return Object.values(searchFields).some(val => 
        val && String(val).toLowerCase().includes(searchLower)
      );
    });
  }, [claims, searchTerm, statusFilter]);

  // --- Style Helper Functions ---
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatStyles = (color) => {
    const styles = {
      green: { baseText: 'text-green-600', hoverBg: 'hover:bg-green-500' },
      slate: { baseText: 'text-slate-600', hoverBg: 'hover:bg-slate-700' },
    };
    return styles[color] || { baseText: 'text-gray-600', hoverBg: 'hover:bg-gray-500' };
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentPage={currentPage} />

      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500 text-lg">Overview of your claims and recent activity.</p>
        </div>

        {/* Loading and Error States */}
      {loading && (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

      {/* Content when data is loaded */}
      {!loading && !error && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            const styles = getStatStyles(stat.color);
            return (
              <div key={stat.title} className={`group bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${styles.hoverBg}`}>
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-7 h-7 transition-colors duration-300 ${styles.baseText} group-hover:text-white`} />
                  <span className={`text-sm font-semibold px-2 py-1 rounded-md ${stat.changeType === 'positive' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {stat.change}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 text-md mb-1 transition-colors duration-300 group-hover:text-white/80">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Claims Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Claims</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search claims..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-64 bg-gray-50 text-gray-800 placeholder-gray-500 pl-11 pr-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-50 text-gray-800 px-4 py-2.5 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none transition-all"
                >
                  {['All Status', 'Approved', 'Pending', 'Rejected', 'Processing', 'Under Review'].map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Claim ID</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Patient</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Provider</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Date</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Amount</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Status</th>
                  <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase tracking-wider">Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredClaims.map((claim, index) => (
                  <tr key={claim._id} className={`border-b border-gray-200/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`} onClick={() => navigate(`/claims/${claim._id}`)}>
                    <td className="py-4 px-6 text-slate-600 font-medium">{claim._id}</td>
                    <td className="py-4 px-6 text-gray-800">{claim.userId}</td>
                    <td className="py-4 px-6 text-gray-600">{claim.incident?.provider || 'N/A'}</td>
                    <td className="py-4 px-6 text-gray-600">{new Date(claim.incident?.date).toLocaleDateString()}</td>
                    <td className="py-4 px-6 text-gray-800 font-medium">
                      {claim.incident?.amountClaimed?.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD'
                      }) || '$0'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{claim.incident?.type || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
      </main>
    </div>
  );
};

export default Dashboard;
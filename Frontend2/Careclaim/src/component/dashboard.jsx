import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

// Main Dashboard Component
const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');

  // --- Data ---
  const stats = [
    { title: 'Total Claims', value: '1,247', change: '+12%', changeType: 'positive', icon: FileText, color: 'slate' },
    { title: 'Approved Claims', value: '1,089', change: '+8%', changeType: 'positive', icon: CheckCircle, color: 'green' },
    { title: 'Pending Review', value: '127', change: '-5%', changeType: 'negative', icon: Clock, color: 'slate' },
    { title: 'Total Value', value: '$2.4M', change: '+15%', changeType: 'positive', icon: DollarSign, color: 'green' }
  ];

  const claims = [
    { id: 'CLM-2024-005', patient: 'Robert Wilson', provider: 'Specialist Center', date: '1/25/2024', amount: '$1,580.75', status: 'Processing', type: 'Diagnostic' },
    { id: 'CLM-2024-004', patient: 'Emily Chen', provider: 'Family Health Care', date: '1/22/2024', amount: '$320', status: 'Rejected', type: 'Consultation' },
    { id: 'CLM-2024-003', patient: 'Michael Davis', provider: 'Metro Hospital', date: '1/20/2024', amount: '$5,200', status: 'Under Review', type: 'Surgery' },
    { id: 'CLM-2024-002', patient: 'Sarah Johnson', provider: 'Downtown Clinic', date: '1/18/2024', amount: '$890.50', status: 'Pending', type: 'Emergency' },
    { id: 'CLM-2024-001', patient: 'John Smith', provider: 'City Medical Center', date: '1/15/2024', amount: '$2,450', status: 'Approved', type: 'Outpatient' }
  ];

  // --- Filtering Logic ---
  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const statusMatch = statusFilter === 'All Status' || claim.status === statusFilter;
      if (!statusMatch) return false;
      const searchMatch = Object.values(claim).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
      return searchMatch;
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
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center shadow-inner shadow-slate-900/20">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-2xl font-semibold text-gray-900">CareClaim</span>
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <span>Dashboard</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <span>Submit Claim</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <span>My Claims</span>
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center ring-2 ring-gray-200">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-gray-800 hidden sm:inline font-medium">John Doe</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500 text-lg">Overview of your claims and recent activity.</p>
        </div>

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
                  <tr key={claim.id} className={`border-b border-gray-200/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
                    <td className="py-4 px-6 text-slate-600 font-medium">{claim.id}</td>
                    <td className="py-4 px-6 text-gray-800">{claim.patient}</td>
                    <td className="py-4 px-6 text-gray-600">{claim.provider}</td>
                    <td className="py-4 px-6 text-gray-600">{claim.date}</td>
                    <td className="py-4 px-6 text-gray-800 font-medium">{claim.amount}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(claim.status)}`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{claim.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import Header from './Header';
import { FileText, Plus, BarChart3 } from 'lucide-react';

const MyClaimsPage = () => {
  const [currentPage, setCurrentPage] = useState('myclaims');
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentPage={currentPage} />

      {/* Main Content */}
      <main className="flex items-center justify-center py-12 px-6">
        <div className="max-w-4xl w-full">
          {/* Coming Soon Card */}
          <div className="bg-white rounded-2xl border border-gray-200 p-12 sm:p-16 text-center shadow-lg">
            {/* Icon */}
            <div className="mb-8">
              <div className="w-28 h-28 bg-gradient-to-br from-slate-600 to-slate-800 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <FileText className="w-14 h-14 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-5">My Claims Page</h1>

            {/* Description */}
            <p className="text-lg text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
              This page will show your claim history and detailed status tracking. The full claims management interface is coming soon.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-800 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md hover:shadow-lg">
                <Plus className="w-5 h-5" />
                <span>Submit New Claim</span>
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center space-x-2 border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white px-8 py-3 rounded-lg font-semibold transition-all">
                <BarChart3 className="w-5 h-5" />
                <span>View Dashboard</span>
              </button>
            </div>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-center">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Claim History</h3>
              <p className="text-sm text-gray-500">View all your submitted claims with detailed status information.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-slate-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Status Tracking</h3>
              <p className="text-sm text-gray-500">Get real-time updates on your claim processing status.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Document Manager</h3>
              <p className="text-sm text-gray-500">Upload and manage supporting documents for your claims.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MyClaimsPage;

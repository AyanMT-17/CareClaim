import React, { useState } from 'react';
import Header from './Header';
import { Shield, FileText, BarChart3, List, Plus, Settings, Calendar, DollarSign, CheckCircle, XCircle } from 'lucide-react';

const PoliciesPage = () => {
  const [currentPage, setCurrentPage] = useState('policies');
  const policiesData = [
    {
      id: 1,
      name: 'Comprehensive Health Plan',
      policyNumber: 'HLT-8C3491-01',
      status: 'Active',
      premium: 450.00,
      dueDate: '2024-10-25',
      coverage: [
        { item: 'Hospitalization', limit: '$250,000' },
        { item: 'Prescription Drugs', limit: '$10,000' },
        { item: 'Emergency Services', limit: 'Fully Covered' },
        { item: 'Maternity Care', limit: '$15,000' },
      ]
    },
    {
      id: 2,
      name: 'Dental & Vision Care',
      policyNumber: 'DVS-5A1129-03',
      status: 'Active',
      premium: 75.50,
      dueDate: '2024-10-28',
      coverage: [
        { item: 'Routine Checkups', limit: '2 per year' },
        { item: 'Major Dental Work', limit: '$2,500' },
        { item: 'Vision Exams', limit: '1 per year' },
        { item: 'Eyewear Allowance', limit: '$300' },
      ]
    },
    {
      id: 3,
      name: 'Critical Illness Rider',
      policyNumber: 'CIR-9B8743-02',
      status: 'Inactive',
      premium: 45.00,
      dueDate: 'N/A',
      coverage: [
        { item: 'Lump Sum Payout', limit: '$50,000' },
        { item: 'Covered Conditions', limit: '32 Specified' },
      ]
    }
  ];

  const [selectedPolicy, setSelectedPolicy] = useState(policiesData[0]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentPage={currentPage} />

      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Insurance Policies</h1>
            <p className="text-lg text-gray-500">Review your coverage details and manage your policies.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Policies List */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
              <h2 className="text-2xl font-semibold text-gray-900 mb-5">Your Policies</h2>
              <div className="space-y-4">
                {policiesData.map((policy) => (
                  <div
                    key={policy.id}
                    onClick={() => setSelectedPolicy(policy)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedPolicy && selectedPolicy.id === policy.id
                        ? 'bg-slate-50 border-slate-500 shadow-md'
                        : 'bg-white border-gray-200 hover:border-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-800">{policy.name}</h3>
                      {policy.status === 'Active' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{policy.policyNumber}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Details */}
            <div className="lg:col-span-2">
              {selectedPolicy ? (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{selectedPolicy.name}</h2>
                            <p className="text-gray-500 mt-1">{selectedPolicy.policyNumber}</p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedPolicy.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                            {selectedPolicy.status}
                        </span>
                    </div>
                  </div>
                  
                  {/* Premium Reminder */}
                  {selectedPolicy.status === 'Active' && (
                    <div className="p-6 border-b border-gray-200 bg-slate-50">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Premium Reminder</h3>
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center space-x-3">
                                <DollarSign className="w-6 h-6 text-slate-500"/>
                                <div>
                                    <p className="text-gray-600">Amount Due</p>
                                    <p className="text-2xl font-bold text-gray-900">${selectedPolicy.premium.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-6 h-6 text-slate-500"/>
                                <div>
                                    <p className="text-gray-600">Due Date</p>
                                    <p className="text-2xl font-bold text-gray-900">{new Date(selectedPolicy.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>
                            <button className="px-6 py-2.5 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-all">
                                Pay Premium
                            </button>
                        </div>
                    </div>
                  )}

                  {/* Coverage Summary */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Coverage Summary</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Coverage</th>
                                    <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm uppercase">Limit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedPolicy.coverage.map((item, index) => (
                                <tr key={index} className="border-b border-gray-200/50">
                                    <td className="py-3 px-4 text-gray-800">{item.item}</td>
                                    <td className="py-3 px-4 text-gray-600 font-medium">{item.limit}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm p-12">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">Select a Policy</h3>
                    <p className="text-gray-500 mt-2">Choose a policy from the list to see its details.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PoliciesPage;

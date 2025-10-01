import React, { useState } from 'react';
import Header from './Header';
import { Upload, CheckCircle, Clock, Trash2, Download } from 'lucide-react';

const DocumentsPage = () => {
  const [currentPage, setCurrentPage] = useState('documents');
  const documentsData = [
    { id: 1, name: 'MRI_Scan_Report.pdf', type: 'Medical Report', size: '2.5 MB', uploaded: '2024-09-15', status: 'Verified' },
    { id: 2, name: 'Hospital_Bill_July.pdf', type: 'Billing Statement', size: '800 KB', uploaded: '2024-09-12', status: 'Verified' },
    { id: 3, name: 'Insurance_Card_Front.jpg', type: 'Photo ID', size: '1.2 MB', uploaded: '2024-09-10', status: 'Pending' },
    { id: 4, name: 'Consultation_Receipt.png', type: 'Receipt', size: '450 KB', uploaded: '2024-09-08', status: 'Verified' },
  ];

  const getStatusIndicator = (status) => {
    if (status === 'Verified') {
      return (
        <span className="inline-flex items-center space-x-2 text-green-600">
          <CheckCircle className="w-4 h-4" />
          <span>{status}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-2 text-yellow-600">
        <Clock className="w-4 h-4" />
        <span>{status}</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Header currentPage={currentPage} />
      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Documents Center</h1>
            <p className="text-lg text-gray-500">Upload and manage your bills, reports, and other documents.</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Section */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
                     <h2 className="text-2xl font-semibold text-gray-900 mb-5">Upload New Document</h2>
                     <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PDF, PNG, JPG or DOCX (MAX. 10MB)</p>
                            </div>
                            <input id="dropzone-file" type="file" className="hidden" />
                        </label>
                    </div>
                    <button className="w-full mt-5 px-6 py-3 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-900 transition-all">
                        Upload File
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-500">Uploaded files will be scanned for integrity.</p>
                    </div>
                </div>
            </div>

            {/* Documents List */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                     <h2 className="text-2xl font-semibold text-gray-900">Your Documents</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50">
                            <tr>
                                <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase">File Name</th>
                                <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase">Type</th>
                                <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase">Uploaded</th>
                                <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase">Status</th>
                                <th className="text-left py-3 px-6 text-gray-600 font-semibold text-sm uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {documentsData.map((doc) => (
                            <tr key={doc.id} className="border-b border-gray-200/50 hover:bg-slate-50 transition-colors">
                                <td className="py-4 px-6">
                                    <p className="font-medium text-gray-800">{doc.name}</p>
                                    <p className="text-sm text-gray-500">{doc.size}</p>
                                </td>
                                <td className="py-4 px-6 text-gray-600">{doc.type}</td>
                                <td className="py-4 px-6 text-gray-600">{doc.uploaded}</td>
                                <td className="py-4 px-6 font-medium">{getStatusIndicator(doc.status)}</td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center space-x-3">
                                        <button className="text-gray-500 hover:text-slate-700 transition-colors"><Download className="w-5 h-5"/></button>
                                        <button className="text-gray-500 hover:text-red-600 transition-colors"><Trash2 className="w-5 h-5"/></button>
                                    </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentsPage;


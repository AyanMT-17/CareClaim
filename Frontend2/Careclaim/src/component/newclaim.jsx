import React, { useState } from 'react';
<<<<<<< HEAD
import { User, FileText, Shield, Upload, CheckCircle, ChevronLeft, ChevronRight, BarChart3, List, Plus } from 'lucide-react';

const SubmitClaimPage = () => {
=======
import Header from './Header';
import { User, FileText, Shield, Upload, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const SubmitClaimPage = () => {
  const [currentPage, setCurrentPage] = useState('newclaim');
>>>>>>> 024cb20 (feat: setup of auth and database)
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    patientFullName: '',
    patientId: '',
    dateOfBirth: '',
    phoneNumber: '',
    emailAddress: ''
  });

  const steps = [
    { id: 'patient-info', title: 'Patient Info', subtitle: 'Basic patient information', icon: User },
    { id: 'claim-details', title: 'Claim Details', subtitle: 'Service and treatment details', icon: FileText },
    { id: 'insurance', title: 'Insurance', subtitle: 'Insurance information', icon: Shield },
    { id: 'documents', title: 'Documents', subtitle: 'Upload supporting documents', icon: Upload },
    { id: 'review', title: 'Review', subtitle: 'Review and submit', icon: CheckCircle }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
<<<<<<< HEAD
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
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </button>
              <button className="flex items-center space-x-2 bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                <Plus className="w-4 h-4" />
                <span>Submit Claim</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <List className="w-4 h-4" />
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
=======
      <Header currentPage={currentPage} />
>>>>>>> 024cb20 (feat: setup of auth and database)

      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-left mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit New Claim</h1>
            <p className="text-lg text-gray-500">Follow the steps below to submit your claim.</p>
          </div>

          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center">
              {steps.map((step, index) => {
                const status = getStepStatus(index);
                const isLastStep = index === steps.length - 1;
                const Icon = step.icon;
                
                let circleClasses = 'bg-white border-gray-300 text-gray-400';
                if (status === 'active') circleClasses = 'bg-white border-slate-700 text-slate-700 ring-4 ring-slate-200';
                if (status === 'completed') circleClasses = 'bg-green-500 border-green-500 text-white';

                let lineClasses = 'bg-gray-300';
                if (status === 'completed') lineClasses = 'bg-green-500';

                return (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${circleClasses}`}>
                        {status === 'completed' ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                      </div>
                      <p className={`mt-2 text-sm font-medium ${status === 'active' ? 'text-slate-800' : status === 'completed' ? 'text-gray-700' : 'text-gray-500'}`}>{step.title}</p>
                    </div>
                    {!isLastStep && <div className={`flex-auto h-1 mx-4 rounded ${lineClasses} transition-colors duration-300`}></div>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
            {currentStep === 0 && (
              <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Patient Full Name *</label>
                        <input type="text" name="patientFullName" placeholder="Enter patient's full name" value={formData.patientFullName} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
                        <input type="text" name="patientId" placeholder="Enter patient ID" value={formData.patientId} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                        <input type="text" name="dateOfBirth" placeholder="DD-MM-YYYY" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input type="tel" name="phoneNumber" placeholder="(555) 123-4567" value={formData.phoneNumber} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input type="email" name="emailAddress" placeholder="patient@example.com" value={formData.emailAddress} onChange={handleInputChange} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all" />
                  </div>
              </div>
            )}
            {currentStep > 0 && (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-slate-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{steps[currentStep].title}</h3>
                    <p className="text-gray-500">This form section is a placeholder: {steps[currentStep].subtitle}</p>
                </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-lg font-medium transition-all bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <button
              onClick={handleNext}
              className="flex items-center space-x-2 px-6 py-2.5 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{currentStep === steps.length - 1 ? 'Submit Claim' : 'Next'}</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitClaimPage;

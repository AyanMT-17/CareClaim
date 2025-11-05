import React, { useState, useEffect } from 'react';
import Header from './Header';
import { User, FileText, Shield, Upload, CheckCircle, X } from 'lucide-react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';

const SubmitClaimPage = () => {
  const [currentPage, setCurrentPage] = useState('newclaim');
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyWarning, setPolicyWarning] = useState('');

  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const response = await api.get('/api/policies');
        if (response.data.ok) {
          const mappedPolicies = response.data.items.map(policy => ({
            id: policy._id,
            type: policy.product || 'health',
            name: policy.insurer,
            policyNumber: policy.policyNumber,
            insuredName: policy.insuredName,
            coverage: policy.sumInsured,
            effectiveStart: policy.startDate,
            effectiveEnd: policy.endDate,
            effectiveEndDisplay: new Date(policy.endDate).toLocaleDateString(),
            status: new Date(policy.endDate) >= new Date() ? 'Active' : 'Expired'
          }));
          setPolicies(mappedPolicies);
        }
      } catch (error) {
        console.error('Failed to fetch policies:', error);
        setPolicyWarning('Failed to load policies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolicies();
  }, []);
  
  const [formData, setFormData] = useState({
    policyId: '',
    insurerName: '',
    policyNumber: '',
    insuredName: '',
    effectiveStart: '',
    effectiveEnd: '',
    sumInsured: '',
    
    incidentType: '',
    incidentDate: '',
    incidentTime: '',
    incidentLocation: '',
    description: '',
    policeReportNumber: '',
    lateReportReason: '',
    
    hasInjuries: false,
    medicalCareType: '',
    healthcareProvider: '',
    treatmentDetails: '',
    initialExpenses: '',
    
    agreeToTerms: false,
  });
  
  const [uploads, setUploads] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const [isDraft, setIsDraft] = useState(true);
  const [draftId, setDraftId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    
    // Policy Selection
    if (!selectedPolicy?.id) errors.policy = 'Please select a policy';

    // Incident Basics
    if (!formData.incidentType) errors.incidentType = 'Select incident type';
    if (!formData.incidentDate) errors.incidentDate = 'Enter incident date';
    if (!formData.description) errors.description = 'Describe what happened';
    if (formData.incidentLocation === '') errors._incidentLocation = 'Location is recommended';
    
    const incident = formData.incidentDate ? new Date(formData.incidentDate) : null;
    if (incident) {
      const now = new Date();
      
      if (formData.effectiveStart && formData.effectiveEnd) {
        const start = new Date(formData.effectiveStart);
        const end = new Date(formData.effectiveEnd);
        end.setHours(23, 59, 59, 999);
        
        if (incident < start || incident > end) {
          errors.incidentDate = 'Incident date falls outside the policy coverage period.';
          setPolicyWarning('Warning: Incident date is outside the policy period.');
        } else {
          setPolicyWarning('');
        }
      }
      
      const daysDiff = Math.floor((now - incident) / (1000 * 60 * 60 * 24));
      if (daysDiff > 30 && !formData.lateReportReason) {
        errors.lateReportReason = 'Please explain why this incident is being reported now';
      }
      
      if (incident > now) {
        errors.incidentDate = 'Incident date cannot be in the future';
      }
    }
    
    if (formData.incidentType === 'accident' && !formData.policeReportNumber) {
      errors.policeReportNumber = 'Police report number required for this type of incident';
    }
    
    // Loss Details (Medical)
    if (!formData.medicalCareType) {
      errors.medicalCareType = 'Please select the type of medical care';
    }
    if (formData.hasInjuries && !formData.treatmentDetails) {
        errors.treatmentDetails = 'Please describe the treatment received for the injuries';
    }
    if (!formData.healthcareProvider) {
        errors.healthcareProvider = 'Please enter the name of the hospital or clinic';
    }
    
    // Documents (Warning only)
    if (uploads.length === 0) {
      errors._warning = 'No documents uploaded. You can add these later from the claim details page.';
    }
    const failed = uploads.filter(u => u.status === 'error');
    if (failed.length > 0) {
      errors._warning = `${failed.length} document(s) failed to upload. You can remove them or continue.`;
    }
    
    // Review
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'Please agree to terms and conditions';
    }
    
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleRemoveUpload = (idToRemove) => {
    setUploads(prev => prev.filter(u => u.id !== idToRemove));
  };

  const handleFileUpload = async (files) => {
    let currentDraftId = draftId;
    if (!currentDraftId) {
      try {
        setIsSubmitting(true);
        const newDraftId = await saveDraft(true);
        if (newDraftId) {
          currentDraftId = newDraftId;
        } else {
          throw new Error("Failed to create draft.");
        }
      } catch (error) {
        console.error("Failed to create draft before upload:", error);
        setSubmitError("Could not save draft to start upload. Please try again.");
        setIsSubmitting(false);
        return;
      } finally {
        setIsSubmitting(false);
      }
    }

    for (const file of files) {
      const isValidType = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024;

      const upload = {
        id: Date.now() + Math.random(),
        name: file.name,
        type: file.type,
        size: file.size,
        status: 'uploading'
      };
      
      if (!isValidType || !isValidSize) {
        setUploads(prev => [...prev, {
          ...upload,
          status: 'error',
          error: !isValidType ? 'Invalid file type' : 'File too large (max 10MB)'
        }]);
        continue;
      }
      
      setUploads(prev => [...prev, upload]);

      try {
        const fileData = new FormData();
        fileData.append('file', file);
        
        const response = await api.post(
          `/api/claims/${currentDraftId}/files`,
          fileData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(prev => ({
                ...prev,
                [upload.id]: percentCompleted
              }));
            }
          }
        );
        
        setUploads(prev => 
          prev.map(u => u.id === upload.id 
            ? { ...u, status: 'complete', fileId: response.data.fileId }
            : u
          )
        );
      } catch (err) {
        setUploads(prev =>
          prev.map(u => u.id === upload.id
            ? { ...u, status: 'error', error: err.message || "Upload failed" }
            : u
          )
        );
      }
    }
  };

  const saveDraft = async (returnNewId = false) => {
    try {
      setIsSubmitting(true);
      
      const parsedAmount = parseFloat(formData.initialExpenses);

      const claimData = {
        policyId: formData.policyId,
        incident: {
          type: formData.incidentType,
          date: formData.incidentDate,
          details: formData.description,
          amountClaimed: isNaN(parsedAmount) ? 0 : parsedAmount,
          time: formData.incidentTime || undefined,
          location: formData.incidentLocation || undefined,
          policeReport: formData.policeReportNumber || undefined,
          lateReportReason: formData.lateReportReason || undefined,
          medicalCareType: formData.medicalCareType || undefined,
          healthcareProvider: formData.healthcareProvider || undefined,
          treatmentDetails: formData.treatmentDetails || undefined,
          hasInjuries: formData.hasInjuries || undefined
        }
      };

      // Add critical validation here before API call
      const criticalErrors = {};
      if (!claimData.policyId) criticalErrors.policy = 'Please select a policy';
      if (!claimData.incident.type) criticalErrors.incidentType = 'Select incident type';
      if (!claimData.incident.date) criticalErrors.incidentDate = 'Enter incident date';
      if (!claimData.incident.details) criticalErrors.description = 'Describe what happened';
      if (isNaN(claimData.incident.amountClaimed)) criticalErrors.initialExpenses = 'Enter a valid amount claimed';
      if (!claimData.incident.medicalCareType) criticalErrors.medicalCareType = 'Please select the type of medical care';
      if (!claimData.incident.healthcareProvider) criticalErrors.healthcareProvider = 'Please enter the name of the hospital or clinic';
      if (claimData.incident.hasInjuries && !claimData.incident.treatmentDetails) criticalErrors.treatmentDetails = 'Please describe the treatment received for the injuries';


      if (Object.keys(criticalErrors).length > 0) {
        setFormErrors(prev => ({ ...prev, ...criticalErrors }));
        throw new Error('Missing critical incident details for draft save.');
      }

      const response = await (draftId 
        ? api.patch(`/api/claims/${draftId}`, claimData)
        : api.post('/api/claims', claimData));

      if (response.data.ok) {
        const newDraftId = draftId || response.data.id;
        if (!draftId) {
          setDraftId(newDraftId);
        }
        setIsDraft(true);
        setSubmitError(null);
        if (returnNewId) {
          return newDraftId;
        }
      } else {
        throw new Error(response.data.error || 'Failed to save draft');
      }
    } catch (err) {
      console.error('Failed to save draft:', err);
      setSubmitError(err.message || 'Failed to save draft');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitClaim = async () => {
    const errors = validateForm();
    setFormErrors(errors);
    
    const errorKeys = Object.keys(errors);
    const hasErrors = errorKeys.length > 0 && !errorKeys.every(k => k.startsWith('_'));

    if (!hasErrors) {
      try {
        setIsSubmitting(true);
        
        // First, save the current form data as a draft
        await saveDraft();

        if (!draftId) {
          throw new Error('No draft ID available after saving. Cannot submit.');
        }
        
        // Then, submit the claim
        const response = await api.post(`/api/claims/${draftId}/submit`);
        if (response.data.ok) {
          setIsDraft(false);
          setSubmitError(null);
          toast.success('Claim submitted successfully!');
          // TODO: Redirect to a success page or claim details
        } else {
          throw new Error(response.data.error || 'Failed to submit claim');
        }
      } catch (error) {
        console.error('Failed to submit claim:', error);
        setSubmitError(error.message || 'Failed to submit claim. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentPage={currentPage} />

      <main className="px-6 md:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-left mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Submit New Claim</h1>
            <p className="text-lg text-gray-500">Fill out the form below to submit your claim.</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-8">
            {/* Policy Selection */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Select Your Policy</h3>
              <p className="text-gray-500 mb-6">Choose the insurance policy related to this claim.</p>

              {policyWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">{policyWarning}</p>
                </div>
              )}

              <div className="grid gap-4">
                {loading ? (
                  <div className="text-center p-4">
                    <p className="text-gray-500">Loading policies...</p>
                  </div>
                ) : policies.length === 0 ? (
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-500">No active policies found. Please add a policy first.</p>
                  </div>
                ) : (
                  policies.map((policy) => (
                    <div 
                      key={policy.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-slate-400 ${
                        selectedPolicy?.id === policy.id ? 'border-slate-500 bg-slate-50 ring-2 ring-slate-500' : 'border-gray-200'
                      } ${policy.status !== 'Active' ? 'opacity-60 bg-gray-100 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (policy.status !== 'Active') {
                          setPolicyWarning('This policy has expired. Please select an active policy.');
                          setSelectedPolicy(null);
                          setFormData(prev => ({ ...prev, policyId: '' })); // Clear policyId
                          return;
                        }
                        setPolicyWarning('');
                        setSelectedPolicy(policy);
                        setFormData(prev => ({
                          ...prev,
                          policyId: policy.id,
                          insurerName: policy.name,
                          policyNumber: policy.policyNumber,
                          insuredName: policy.insuredName,
                          effectiveStart: policy.effectiveStart,
                          effectiveEnd: policy.effectiveEnd,
                          sumInsured: policy.coverage,
                          incidentType: policy.type
                        }));
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{policy.name} - {policy.type}</h4>
                          <p className="text-sm text-gray-500 mt-1">Policy #: {policy.policyNumber}</p>
                          {policy.status !== 'Active' && (
                            <p className="text-xs font-bold text-red-500 mt-1">EXPIRED</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Coverage: ${policy.coverage.toLocaleString()}</p>
                          <p className="text-xs text-gray-500 mt-1">Active until {policy.effectiveEndDisplay}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {formErrors.policy && (
                <p className="text-sm text-red-600 mt-2">{formErrors.policy}</p>
              )}
            </div>

            {/* Incident Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Incident Details</h3>
              <p className="text-gray-500 mb-6">Tell us about what happened.</p>

              <div className="grid gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Incident *</label>
                  <select
                    name="incidentType"
                    value={formData.incidentType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  >
                    <option value="">Select type</option>
                    <option value="accident">Accident</option>
                    <option value="illness">Illness</option>
                    <option value="injury">Injury</option>
                    <option value="emergency">Emergency</option>
                  </select>
                  {formErrors.incidentType && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.incidentType}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Incident *</label>
                    <input
                      type="date"
                      name="incidentDate"
                      value={formData.incidentDate}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                    />
                    {formErrors.incidentDate && (
                      <p className="text-sm text-red-600 mt-1">{formErrors.incidentDate}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time of Incident</label>
                    <input
                      type="time"
                      name="incidentTime"
                      value={formData.incidentTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                  <input
                    type="text"
                    name="incidentLocation"
                    placeholder="Where did this happen?"
                    value={formData.incidentLocation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  />
                  {formErrors.incidentLocation && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.incidentLocation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe what happened..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  />
                  {formErrors.description && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
                  )}
                </div>

                {formData.incidentType === 'accident' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Police Report Number *</label>
                    <input
                      type="text"
                      name="policeReportNumber"
                      placeholder="Enter report number if available"
                      value={formData.policeReportNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                    />
                    {formErrors.policeReportNumber && (
                       <p className="text-sm text-red-600 mt-1">{formErrors.policeReportNumber}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Medical Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Medical Details</h3>
              <p className="text-gray-500 mb-6">Provide information about the medical care received.</p>

              <div className="grid gap-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="hasInjuries"
                    name="hasInjuries"
                    checked={formData.hasInjuries}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                  />
                  <label htmlFor="hasInjuries" className="text-sm text-gray-700">
                    Are there any injuries?
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type of Medical Care *</label>
                  <select
                    name="medicalCareType"
                    value={formData.medicalCareType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  >
                    <option value="">Select type</option>
                    <option value="emergency">Emergency Room</option>
                    <option value="hospitalization">Hospitalization</option>
                    <option value="outpatient">Outpatient Care</option>
                    <option value="specialist">Specialist Visit</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.medicalCareType && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.medicalCareType}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Healthcare Provider *</label>
                  <input
                    type="text"
                    name="healthcareProvider"
                    placeholder="Name of hospital or clinic"
                    value={formData.healthcareProvider}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  />
                  {formErrors.healthcareProvider && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.healthcareProvider}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Details {formData.hasInjuries ? '*' : ''}</label>
                  <textarea
                    name="treatmentDetails"
                    rows="4"
                    placeholder="Describe the treatment received..."
                    value={formData.treatmentDetails}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  />
                  {formErrors.treatmentDetails && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.treatmentDetails}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Initial Expenses (USD) *</label>
                  <input
                    type="number"
                    name="initialExpenses"
                    placeholder="e.g., 500.00"
                    value={formData.initialExpenses}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 transition-all"
                  />
                  {formErrors.initialExpenses && (
                    <p className="text-sm text-red-600 mt-1">{formErrors.initialExpenses}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Document Upload */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">4. Upload Documents</h3>
              <p className="text-gray-500 mb-6">Attach relevant documents to support your claim.</p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="fileUpload"
                />
                <label
                  htmlFor="fileUpload"
                  className="cursor-pointer inline-flex flex-col items-center space-y-2"
                >
                  <Upload className="w-8 h-8 text-gray-400" />
                  <span className="text-sm font-medium text-gray-600">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF, PNG, JPG (max. 10MB per file)
                  </span>
                </label>
              </div>

              {uploads.length > 0 && (
                <div className="mt-4 space-y-3">
                  {uploads.map(upload => (
                    <div
                      key={upload.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        upload.status === 'error' ? 'border-red-200 bg-red-50' :
                        upload.status === 'complete' ? 'border-green-200 bg-green-50' :
                        'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{upload.name}</p>
                          <p className="text-xs text-gray-500">
                            {upload.status === 'error' ? upload.error :
                             upload.status === 'uploading' ? `Uploading... ${uploadProgress[upload.id] || 0}%` :
                             'Uploaded'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveUpload(upload.id)}
                        className={`text-sm p-1 rounded ${
                          upload.status === 'error' ? 'text-red-600 hover:bg-red-100' : 'text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {formErrors._warning && (
                <p className="text-sm text-yellow-600 mt-2">{formErrors._warning}</p>
              )}
            </div>

            {/* Review & Submit */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">5. Review & Submit</h3>
              <p className="text-gray-500 mb-6">Please review your claim details before submitting.</p>

              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Policy</h4>
                  <p className="text-gray-900 font-semibold">{formData.insurerName}</p>
                  <p className="text-gray-600 text-sm">Policy #: {formData.policyNumber}</p>
                  <p className="text-gray-600 text-sm">Insured: {formData.insuredName}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Incident Details</h4>
                  <p className="text-gray-900 capitalize">{formData.incidentType} on {new Date(formData.incidentDate).toLocaleDateString()}</p>
                  <p className="text-gray-600 mt-1 text-sm">Location: {formData.incidentLocation || 'N/A'}</p>
                  <p className="text-gray-600 mt-1 text-sm">Description: {formData.description}</p>
                </div>
                
                 <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Medical Details</h4>
                  <p className="text-gray-900 capitalize text-sm">Care Type: {formData.medicalCareType || 'N/A'}</p>
                  <p className="text-gray-600 mt-1 text-sm">Provider: {formData.healthcareProvider || 'N/A'}</p>
                  <p className="text-gray-600 mt-1 text-sm">Injuries Reported: {formData.hasInjuries ? 'Yes' : 'No'}</p>
                  <p className="text-gray-600 mt-1 text-sm">Initial Expenses: ${parseFloat(formData.initialExpenses || 0).toLocaleString()}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Documents</h4>
                  <p className="text-gray-900">{uploads.filter(u => u.status === 'complete').length} documents</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-slate-600 focus:ring-slate-500 border-gray-300 rounded"
                  />
                  <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                    I confirm that all information provided is true and accurate to the best of my knowledge. 
                    I understand that providing false information may result in claim denial and possible legal action.
                  </label>
                </div>
                {formErrors.agreeToTerms && (
                  <p className="text-sm text-red-600 mt-2">{formErrors.agreeToTerms}</p>
                )}
              </div>

              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-600">{submitError}</p>
                </div>
              )}
            </div>

            <div className="mt-8 text-right">
              <button
                onClick={handleSubmitClaim}
                disabled={isSubmitting}
                className="px-8 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Claim'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SubmitClaimPage;

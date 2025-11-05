import React, { useState } from 'react';
import Header from './Header.jsx';
import { Shield, FileText, BarChart3, List, Plus, Settings, Calendar, DollarSign, CheckCircle, XCircle, Edit3, Eye } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PoliciesPage = () => {
  const [currentPage, setCurrentPage] = useState('policies');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [policies, setPolicies] = useState([]);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [editing, setEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  // --- FORM STATE ---
  const [form, setForm] = useState({
    insurerName: '',
    policyNumber: '',
    insuredName: '',
    startDate: '',
    endDate: '',
    sumInsured: '',
    product: '', // Changed from productName to match schema
    uin: '',
    verificationStatus: 'Pending'
  });
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(true); // Default to true
  const [showAddLater, setShowAddLater] = useState(false);

  // Fetch policies on component mount
  useEffect(() => {
    fetchPolicies().then((initialPolicies) => {
      // Auto-select first policy on load if none is selected
      if (!selectedPolicy && initialPolicies && initialPolicies.length > 0) {
        const policy = initialPolicies[0];
        setSelectedPolicy(policy);
        
        // <-- FIX 1: Removed the setForm(...) call from here.
        // Populating the form here causes it to be out of sync
        // when the user clicks a *different* policy. The form
        // should only be populated when "Edit" or "Add" is clicked.
      }
    });
  }, []); // Empty dependency array ensures this runs only once on mount

  // --- DATA FETCHING ---
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      console.log('Fetching policies from:', axios.defaults.baseURL + '/api/policies');
      const res = await axios.get('/api/policies');
      if (res.data.ok) {
        const mappedPolicies = res.data.items.map(policy => ({
          id: policy._id,
          name: policy.insurer,
          policyNumber: policy.policyNumber,
          insuredName: policy.insuredName,
          effectiveStart: policy.startDate.split('T')[0],
          effectiveEnd: policy.endDate.split('T')[0],
          sumInsured: policy.sumInsured,
          productName: policy.product, // This mapping is correct
          uin: policy.uin,
          status: new Date(policy.endDate) >= new Date() ? 'Active' : 'Expired',
          coverage: [
            { item: 'Base Coverage', limit: `$${policy.sumInsured.toLocaleString()}` }
            // Add other coverage items if available in 'policy' object
          ]
        }));
        setPolicies(mappedPolicies);
        return mappedPolicies; // Return the policies for handlers
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load policies');
    } finally {
      setLoading(false);
    }
    return []; // Return empty array on failure
  };

  // --- EVENT HANDLERS ---
  const handleSelectPolicy = (policy) => {
    setSelectedPolicy(policy);
    setEditing(false); // Close edit form
    setIsNew(false);
    setShowPreview(true); // Show preview
    setErrors({}); // Clear any errors
  };

  const handleAddNewClick = () => {
    setSelectedPolicy(null); // Deselect any policy
    setForm({ // Reset form
      insurerName: '',
      policyNumber: '',
      insuredName: '',
      startDate: '',
      endDate: '',
      sumInsured: '',
      product: '', // <-- FIX 2: Was 'productName: ""'
      uin: '',
      policyType: 'health',
      contact: '',
      assetId: '',
      branch: '',
      verificationStatus: 'Pending' // Reset verification status
    });
    setIsNew(true);
    setEditing(true);
    setShowPreview(false); // Hide preview
    setShowAddLater(false);
    setErrors({});
  };

  const handleEditClick = () => {
    if (!selectedPolicy) return;
    setForm({
      insurerName: selectedPolicy.name || '',
      policyNumber: selectedPolicy.policyNumber || '',
      insuredName: selectedPolicy.insuredName || selectedPolicy.name || '',
      startDate: selectedPolicy.effectiveStart || '',
      endDate: selectedPolicy.effectiveEnd || '',
      sumInsured: selectedPolicy.sumInsured || 0,
      product: selectedPolicy.productName || '', // <-- FIX 3: Was 'productName: ...'
      uin: selectedPolicy.uin || '',
      policyType: selectedPolicy.policyType || 'health',
      contact: selectedPolicy.contact || '',
      assetId: selectedPolicy.assetId || '',
      branch: selectedPolicy.branch || '',
      verificationStatus: selectedPolicy.verificationStatus || 'Pending'
    });
    setEditing(true);
    setIsNew(false);
    setShowPreview(false); // Hide preview
    setErrors({});
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setIsNew(false);
    setErrors({});
    setShowAddLater(false);
    // If we were adding new, selectedPolicy is null, so it will show placeholder
    // If we were editing, selectedPolicy is still set, so it will show preview
    if (!isNew && selectedPolicy) {
      setShowPreview(true);
    }
  };

  const handleSavePolicy = async () => {
    try {
      setSubmitting(true);
      const errors = {};
      
      // ... (Validation logic looks good) ...
      if (!form.insurerName?.trim()) errors.insurerName = 'Please enter the insurance company name';
      if (!form.policyNumber?.trim()) errors.policyNumber = 'Please enter your policy number';
      if (!form.insuredName?.trim()) errors.insuredName = 'Please enter the name of the insured person';
      if (!form.startDate) errors.startDate = 'Please select the policy start date';
      if (!form.endDate) errors.endDate = 'Please select the policy end date';
      if (!form.sumInsured) {
        errors.sumInsured = 'Please enter the sum insured amount';
      } else if (isNaN(form.sumInsured)) {
        errors.sumInsured = 'Please enter a valid numeric amount';
      } else if (Number(form.sumInsured) <= 0) {
        errors.sumInsured = 'Sum insured must be greater than zero';
      }
      if (form.startDate && form.endDate) {
        const start = new Date(form.startDate);
        const end = new Date(form.endDate);
        if (end < start) {
          errors.endDate = 'End date cannot be earlier than start date';
        }
      }
      // ... (End of validation) ...
      
      if (Object.keys(errors).length > 0) {
        setErrors(errors);
        setSubmitting(false); // <-- FIX 4: Stop submitting if validation fails
        return;
      }

      const data = {
        insurer: form.insurerName,
        policyNumber: form.policyNumber,
        insuredName: form.insuredName,
        startDate: new Date(form.startDate).toISOString(),
        endDate: new Date(form.endDate).toISOString(),
        sumInsured: Number(form.sumInsured),
        product: form.product || undefined,
        uin: form.uin || undefined,
        verificationStatus: form.verificationStatus
      };

      if (isNew) {
        // --- CREATE NEW POLICY ---
        console.log('Creating new policy at:', axios.defaults.baseURL + '/api/policies/');
        const res = await axios.post('/api/policies/', data);
        if (res.data.ok) {
          toast.success('Policy added successfully');
          const newPolicies = await fetchPolicies(); // Refetches and sets policy list
          
          // Try to find and select the new policy
          const newPolicyId = res.data.item?._id; // Assumes API returns { ok: true, item: {...} }
          const newPolicy = newPolicyId ? newPolicies.find(p => p.id === newPolicyId) : null;
          
          setSelectedPolicy(newPolicy || newPolicies[0]); // Select new policy or fallback
          setEditing(false);
          setShowPreview(true);
        }
      } else {
        // --- UPDATE EXISTING POLICY ---
        const policyIdToUpdate = selectedPolicy.id; // Use 'id', not '_id'
        console.log('Updating policy at:', axios.defaults.baseURL + `/api/policies/${policyIdToUpdate}`);
        const res = await axios.patch(`/api/policies/${policyIdToUpdate}`, data);
        if (res.data.ok) {
          toast.success('Policy updated successfully');
          const newPolicies = await fetchPolicies(); // Refetches and sets policy list
          
          // Find and re-select the *updated* policy to avoid stale state
          const updatedPolicy = newPolicies.find(p => p.id === policyIdToUpdate);
          
          setSelectedPolicy(updatedPolicy || newPolicies[0]); // Reselect or fallback
          setEditing(false);
          setShowPreview(true);
        }
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors.reduce((acc, e) => ({ ...acc, [e]: true }), {}));
      } else {
        toast.error(err.response?.data?.error || 'Failed to save policy');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentPage={currentPage} />

      {/* Main Content */}
      <main className="px-6 md:px-8 py-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Insurance Policies</h1>
              <p className="text-lg text-gray-500">Review your coverage details and manage your policies.</p>
            </div>
            <div>
              <button
                onClick={handleAddNewClick}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                disabled={submitting}
              >
                <Plus className="w-4 h-4 inline-block -mt-1 mr-1" />
                Add Policy
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Policies List */}
            <div className="lg:col-span-1 bg-white rounded-xl border border-gray-200 shadow-sm p-6 h-fit">
              {/* ... (No changes in this block) ... */}
              <h2 className="text-2xl font-semibold text-gray-900 mb-5">Your Policies</h2>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    <p className="text-sm text-gray-500 mt-2">Loading policies...</p>
                  </div>
                </div>
              ) : policies.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No policies found.</p>
                  <p className="text-sm text-gray-400 mt-1">Add your first policy to get started.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {policies.map((policy) => (
                    <div
                      key={policy.id}
                      onClick={() => handleSelectPolicy(policy)} 
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                        selectedPolicy && selectedPolicy.id === policy.id && !editing 
                          ? 'bg-slate-50 border-slate-500 shadow-md'
                          : 'bg-white border-gray-200 hover:border-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800">{policy.name}</h3>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs ${policy.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                            {policy.status}
                          </span>
                          {policy.status === 'Active' ? (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{policy.policyNumber}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- RIGHT PANEL (Policy Details / Edit Form) --- */}
            <div className="lg:col-span-2">
              {editing ? (
                // --- EDIT / ADD FORM ---
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-200 bg-white">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                      {isNew ? 'Add New Policy' : 'Edit Policy Details'}
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Enter the required fields below. Other fields are optional.</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* ... (No changes in this block) ... */}
                      <div>
                        <label className="text-sm text-gray-600">Insurer name*</label>
                        <input value={form.insurerName} onChange={(e)=> setForm({...form, insurerName: e.target.value})} className={`w-full mt-1 p-2 border rounded-md ${errors.insurerName ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.insurerName && <p className="text-xs text-red-600 mt-1">⚠ {errors.insurerName}</p>}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Policy number*</label>
                        <input value={form.policyNumber} onChange={(e)=> setForm({...form, policyNumber: e.target.value})} className={`w-full mt-1 p-2 border rounded-md ${errors.policyNumber ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.policyNumber && <p className="text-xs text-red-600 mt-1">⚠ {errors.policyNumber}</p>}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Insured name*</label>
                        <input value={form.insuredName} onChange={(e)=> setForm({...form, insuredName: e.target.value})} className={`w-full mt-1 p-2 border rounded-md ${errors.insuredName ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.insuredName && <p className="text-xs text-red-600 mt-1">⚠ {errors.insuredName}</p>}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Sum insured / Coverage*</label>
                        <input type="number" value={form.sumInsured} onChange={(e)=> setForm({...form, sumInsured: e.target.value})} className={`w-full mt-1 p-2 border rounded-md ${errors.sumInsured ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.sumInsured && <p className="text-xs text-red-600 mt-1">⚠ {errors.sumInsured}</p>}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Effective start*</label>
                        <input type="date" value={form.startDate} onChange={(e)=> setForm({...form, startDate: e.target.value})} className={`w-full mt-1 p-2 border rounded-md ${errors.startDate ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.startDate && <p className="text-xs text-red-600 mt-1">⚠ {errors.startDate}</p>}
                      </div>
                      <div>
                        <label className="text-sm text-gray-600">Effective end*</label>
                        <input type="date" value={form.endDate} onChange={(e)=> setForm({...form, endDate: e.target.value})} className={`w-full mt-1 p-2 border rounded-md ${errors.endDate ? 'border-red-300' : 'border-gray-300'}`} />
                        {errors.endDate && <p className="text-xs text-red-600 mt-1">⚠ {errors.endDate}</p>}
                      </div>
                    </div>

                    <div className="mt-6">
                      {/* ... (No changes in this block) ... */}
                      <button onClick={handleSavePolicy} disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white rounded-md mr-2 disabled:opacity-50">
                        {submitting ? 'Saving...' : 'Save Policy'}
                      </button>
                      <button onClick={handleCancelEdit} className="px-4 py-2 bg-slate-100 rounded-md hover:bg-slate-200" disabled={submitting}>
                        Cancel
                      </button>
                      <button onClick={() => setShowAddLater(s=>!s)} className="ml-4 px-3 py-2 text-sm border rounded-md">{showAddLater ? 'Hide optional' : 'Show optional fields'}</button>
                    </div>

                    {/* Add later section */}
                    {showAddLater && (
                      <div className="mt-6 border-t pt-4">
                         <h4 className="text-lg font-semibold text-gray-800 mb-4">Optional Details</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* ... (No changes in this block, 'product' input is correct) ... */}
                          <div>
                            <label className="text-sm text-gray-600">Product / Plan</label>
                            <input value={form.product} onChange={(e)=> setForm({...form, product: e.target.value})} className="w-full mt-1 p-2 border border-gray-300 rounded-md" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">UIN</label>
                            <input value={form.uin} onChange={(e)=> setForm({...form, uin: e.target.value})} className="w-full mt-1 p-2 border border-gray-300 rounded-md" placeholder="Enter Unique Identification Number" />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Verification Status</label>
                            <select value={form.verificationStatus} onChange={(e)=> setForm({...form, verificationStatus: e.target.value})} className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white">
                              <option value="Pending">Pending</option>
                              <option value="Verified">Verified</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              ) : selectedPolicy ? (
                // --- POLICY PREVIEW ---
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                  {/* ... (No changes in this block) ... */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold text-gray-900">{selectedPolicy.name}</h2>
                        <p className="text-gray-500 mt-1">{selectedPolicy.policyNumber}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={handleEditClick} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 border rounded-md hover:bg-slate-50">
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={() => setShowPreview((s) => !s)} className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-800 text-white rounded-md">
                          <Eye className="w-4 h-4" /> {showPreview ? 'Hide' : 'Show'} Preview
                        </button>
                      </div>
                    </div>
                  </div>
                  {showPreview && (
                    <div className="p-6 border-b border-gray-200 bg-slate-50">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Policy Preview</h3>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Insurer</p>
                          <p className="font-bold text-gray-900">{selectedPolicy.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Policy Number</p>
                          <p className="font-bold text-gray-900">{selectedPolicy.policyNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Insured</p>
                          <p className="font-bold text-gray-900">{selectedPolicy.insuredName || selectedPolicy.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Effective</p>
                          <p className="font-bold text-gray-900">
                           {(() => {
                              try {
                                const start = new Date(selectedPolicy.effectiveStart);
                                const end = new Date(selectedPolicy.effectiveEnd);
                                return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
                              } catch (e) { return 'Invalid date range'; }
                            })()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Sum Insured</p>
                          <p className="font-bold text-gray-900">{selectedPolicy.sumInsured ? `$${Number(selectedPolicy.sumInsured).toLocaleString()}` : '$0.00'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className={`font-bold ${selectedPolicy.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                            {selectedPolicy.status}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4">
                        <button 
                          onClick={() => {
                            if (selectedPolicy.status !== 'Active') {
                              toast.error('Cannot start FNOL for an expired policy');
                              return;
                            }
                            toast.success('FNOL process will be implemented soon');
                          }} 
                          className={`px-5 py-2 text-white rounded-md ${
                            selectedPolicy.status === 'Active' 
                              ? 'bg-indigo-600 hover:bg-indigo-700' 
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          Start FNOL
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Coverage Summary</h3>
                    <div className="overflow-x-auto">
                      {selectedPolicy.coverage?.length > 0 ? (
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
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-lg">
                          <Shield className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-gray-500">Coverage details will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              ) : (
                // --- PLACEHOLDER ---
                <div className="flex items-center justify-center h-full bg-white rounded-xl border border-gray-200 shadow-sm p-12" style={{ minHeight: '400px' }}>
                  {/* ... (No changes in this block) ... */}
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">Select a Policy</h3>
                    <p className="text-gray-500 mt-2">Choose a policy from the list to see its details, or add a new one.</p>
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

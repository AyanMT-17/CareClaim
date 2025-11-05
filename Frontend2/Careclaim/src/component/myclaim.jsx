import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { FileText, Plus, BarChart3, Calendar, DollarSign, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';

const ClaimStatusBadge = ({ status }) => {
  const statusConfig = {
    'Draft': { color: 'bg-gray-100 text-gray-800', icon: Clock },
    'Submitted': { color: 'bg-blue-100 text-blue-800', icon: FileText },
    'InReview': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    'Approved': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'Rejected': { color: 'bg-red-100 text-red-800', icon: XCircle },
    'Paid': { color: 'bg-emerald-100 text-emerald-800', icon: DollarSign }
  };

  const config = statusConfig[status] || statusConfig['Draft'];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-medium ${config.color}`}>
      <Icon className="w-4 h-4" />
      {status}
    </span>
  );
};

const MyClaimsPage = () => {
  const [currentPage, setCurrentPage] = useState('myclaims');
  const [claims, setClaims] = useState([]);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updating, setUpdating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClaims();
  }, []);

  const fetchClaims = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/claims`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.ok) {
        setClaims(data.items);
      } else {
        setError(data.error || 'Failed to fetch claims');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to fetch claims. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const fetchClaimDetails = async (claimId) => {
    try {
      console.log('Fetching details for claim:', claimId);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/claims/${claimId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      const data = await response.json();
      if (data.ok) {
        console.log('Received claim details:', data);
        setSelectedClaim(data.claim);
        setTimeline(data.timeline);
      } else {
        console.error('Error fetching claim details:', data.error);
      }
    } catch (err) {
      console.error('Failed to fetch claim details:', err);
    }
  };

  const updateClaimStatus = async (claimId, newStatus) => {
    try {
      setUpdating(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/claims/${claimId}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.ok) {
        // Refresh claim details and main list
        await fetchClaimDetails(claimId);
        await fetchClaims();
      } else {
        console.error('Error updating claim status:', data.error);
      }
    } catch (err) {
      console.error('Failed to update claim status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
        <Header currentPage={currentPage} />
        <main className="flex items-center justify-center py-12 px-6">
          <div className="text-xl text-gray-600">Loading claims...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header currentPage={currentPage} />

      {/* Main Content */}
      <main className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Claims</h1>

            <button 
              onClick={() => navigate('/newclaim')}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white px-4 py-2 rounded-lg font-semibold transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>New Claim</span>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Claims List */}
          {claims.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Claims Yet</h3>
              <p className="text-gray-500 mt-2">Start by submitting your first claim</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {claims.map((claim) => (
                <div 
                  key={claim._id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  onClick={() => fetchClaimDetails(claim._id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Claim #{claim._id.slice(-6)}
                        </h3>
                        <ClaimStatusBadge status={claim.status} />
                      </div>
                      <div className="text-gray-600">
                        {claim.incident?.type} - {claim.incident?.details}
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(claim.incident?.date)}
                        </div>
                        {claim.incident?.amountClaimed && (
                          <div className="flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4" />
                            {claim.incident.amountClaimed.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD'
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Claim Timeline Modal */}
          {selectedClaim && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        Claim #{selectedClaim._id.slice(-6)}
                      </h2>
                      <p className="text-gray-600 mt-1">{selectedClaim.incident?.type}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedClaim(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Claim Details</h3>
                    <dl className="grid grid-cols-2 gap-4">
                      <div>
                        <dt className="text-sm text-gray-500">Status</dt>
                        <dd className="mt-1 space-y-2">
                          <ClaimStatusBadge status={selectedClaim.status} />
                          <div className="flex items-center gap-2">
                            <select
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md"
                              value=""
                              onChange={(e) => {
                                if (e.target.value) {
                                  updateClaimStatus(selectedClaim._id, e.target.value);
                                }
                              }}
                              disabled={updating}
                            >
                              <option value="">Update Status</option>
                              <option value="Draft">Draft</option>
                              <option value="Submitted">Submitted</option>
                              <option value="InReview">In Review</option>
                              <option value="Approved">Approved</option>
                              <option value="Rejected">Rejected</option>
                              <option value="Paid">Paid</option>
                            </select>
                            {updating && (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
                            )}
                          </div>
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Amount Claimed</dt>
                        <dd className="mt-1 font-medium">
                          {selectedClaim.incident?.amountClaimed?.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          })}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Incident Date</dt>
                        <dd className="mt-1 font-medium">
                          {formatDate(selectedClaim.incident?.date)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm text-gray-500">Created At</dt>
                        <dd className="mt-1 font-medium">
                          {formatDate(selectedClaim.createdAt)}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
                    <div className="space-y-6">
                      {timeline.map((event) => (
                        <div key={event._id} className="flex gap-4">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-slate-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.description}</p>
                            <p className="text-sm text-gray-500">
                              {formatDate(event.timestamp)}
                            </p>
                            {event.blockchainTxHash && (
                              <a 
                                href={`https://sepolia.etherscan.io/tx/${event.blockchainTxHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:text-blue-800 mt-1 inline-block"
                              >
                                View on Etherscan
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MyClaimsPage;

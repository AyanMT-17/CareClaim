// src/models/Claim.js
import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  policyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Policy', required: true, index: true },
  incident: {
    type: { type: String, required: true },     // e.g., Accident, Theft
    date: { type: Date, required: true },
    details: { type: String, required: true },
    location: { type: String },
    amountClaimed: { type: Number, required: true, min: 0 }
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'SubmittedToInsurer', 'InReview', 'Approved', 'Rejected', 'Paid'],
    default: 'Draft'
  },
  blockchain: {
    claimIdHash: { type: String },
    lastTxHash: { type: String }
  },
  ack: {
    referenceNumber: String,
    file: {
      fileName: String,
      filePath: String,
      size: Number,
      checksum: String
    },
    recordedAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

claimSchema.index({ userId: 1, policyId: 1 });

const Claim = mongoose.model('Claim', claimSchema);
export default Claim;

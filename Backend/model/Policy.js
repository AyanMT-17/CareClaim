// models/Policy.js (ESM)
import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  insurer: { type: String, required: true },
  policyNumber: { type: String, required: true, index: true },
  product: { type: String },
  uin: { type: String },
  insuredName: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  sumInsured: { type: Number, required: true, min: 0 },
  verificationStatus: { type: String, enum: ['Verified', 'Pending'], default: 'Verified' },
  linkedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

policySchema.index({ userId: 1, policyNumber: 1 }, { unique: false });

const Policy = mongoose.model('Policy', policySchema);
export default Policy;

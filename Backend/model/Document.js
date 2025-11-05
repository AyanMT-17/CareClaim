// src/models/Document.js
import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', index: true },
  type: { type: String, enum: ['Photo', 'Bill', 'Report', 'Acknowledgement', 'Other'], required: true },
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number },
  checksum: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now }
});

documentSchema.index({ checksum: 1 });

const Document = mongoose.model('Document', documentSchema);
export default Document;

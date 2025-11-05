// src/models/TimelineEvent.js
import mongoose from 'mongoose';

const timelineEventSchema = new mongoose.Schema({
  claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', required: true, index: true },
  eventType: {
    type: String,
    enum: ['FNOLSubmitted', 'StatusChanged', 'DocumentUploaded', 'InsurerAcknowledged', 'BlockchainTx'],
    required: true
  },
  description: { type: String, required: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now },
  relatedFileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  newStatus: String,
  blockchainTxHash: String
});

const TimelineEvent = mongoose.model('TimelineEvent', timelineEventSchema);
export default TimelineEvent;

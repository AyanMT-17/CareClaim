// src/routes/claims.js
import { Router } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path, { dirname as pathDirname, join } from 'path';
import multer from 'multer';
import { fileURLToPath } from 'url';
import Claim from '../model/Claim.js';
import Document from '../model/Document.js';
import TimelineEvent from '../model/TimelineEvent.js';
import { contract, STATUS_CODE, keccak256 } from '../services/blockchain.js';
import ensureAuth from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = pathDirname(__filename);

const router = Router();



function isValidDate(v) { const d = new Date(v); return !Number.isNaN(d.getTime()); }

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, join(__dirname, '..', 'uploads', 'claims')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const fileFilter = (req, file, cb) => {
  const ok = ['image/png', 'image/jpeg', 'application/pdf'].includes(file.mimetype);
  cb(ok ? null : new Error('Invalid file type'), ok);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/claims  -> create FNOL draft
router.post('/', ensureAuth, async (req, res) => {
  try {
    const { policyId, incident } = req.body || {};
    if (!policyId || !incident?.type || !incident?.date || !incident?.details || incident?.amountClaimed == null) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }
    if (!isValidDate(incident.date)) return res.status(400).json({ ok: false, error: 'Invalid incident date' });

    const claim = await Claim.create({
      userId: req.user.id,
      policyId,
      incident: { ...incident, amountClaimed: Number(incident.amountClaimed) },
      status: 'Draft'
    });

    res.json({ ok: true, id: claim._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

// PATCH /api/claims/:id -> update draft
router.patch('/:id', ensureAuth, async (req, res) => {
  try {
    const patch = { ...req.body, updatedAt: new Date() };
    const claim = await Claim.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, patch, { new: true });
    if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });
    res.json({ ok: true, claim });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

// POST /api/claims/:id/submit -> finalize FNOL + on-chain Created
router.post('/:id/submit', ensureAuth, async (req, res) => {
  try {
    console.log('Submitting claim:', req.params.id);
    
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user.id });
    if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });
    if (claim.status !== 'Draft') return res.status(400).json({ ok: false, error: 'Already submitted' });

    console.log('Found claim:', claim);

    if (!claim.incident?.type || !isValidDate(claim.incident?.date) || !claim.incident?.details) {
      console.log('Validation failed:', { 
        type: claim.incident?.type,
        date: claim.incident?.date,
        details: claim.incident?.details
      });
      return res.status(400).json({ ok: false, error: 'Incomplete FNOL' });
    }

    try {
      const claimIdHash = keccak256({ userId: String(claim.userId), claimId: String(claim._id) });
      const fnolHash = keccak256({ policyId: String(claim.policyId), incident: claim.incident });
      
      console.log('Creating blockchain claim with:', {
        claimIdHash,
        fnolHash,
        contractAddress: contract.target
      });

      const tx = await contract.createClaim(claimIdHash, fnolHash);
      console.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt.hash);
      
      claim.status = 'Submitted';
      claim.blockchain = { claimIdHash, lastTxHash: receipt.hash };
      claim.updatedAt = new Date();
      await claim.save();

      await TimelineEvent.create({
        claimId: claim._id,
        eventType: 'FNOLSubmitted',
        description: 'FNOL submitted',
        actor: req.user.id,
        timestamp: new Date(),
        blockchainTxHash: receipt.hash
      });

      return res.json({ ok: true, status: claim.status, txHash: receipt.hash, claimIdHash });
    } catch (contractError) {
      console.error('Contract error:', contractError);
      return res.status(500).json({
        ok: false,
        error: 'Blockchain error',
        details: contractError.message
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ ok: false, error: error.message });
  }
});

// POST /api/claims/:id/files -> upload evidence
router.post('/:id/files', ensureAuth, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: 'No file uploaded' });
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user.id });
    if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });

    const checksum = crypto.createHash('sha256').update(fs.readFileSync(req.file.path)).digest('hex');
    const doc = await Document.create({
      claimId: claim._id,
      type: req.body.type || 'Other',
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      checksum,
      uploadedBy: req.user.id
    });

    await TimelineEvent.create({
      claimId: claim._id,
      eventType: 'DocumentUploaded',
      description: `Document uploaded: ${req.file.originalname}`,
      actor: req.user.id,
      timestamp: new Date(),
      relatedFileId: doc._id
    });

    res.json({ ok: true, documentId: doc._id, checksum });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Upload failed' });
  }
});

// POST /api/claims/:id/ack -> save insurer ref + optional file + on-chain status 2
router.post('/:id/ack', ensureAuth, upload.single('file'), async (req, res) => {
  try {
    const { referenceNumber } = req.body || {};
    if (!referenceNumber) return res.status(400).json({ ok: false, error: 'referenceNumber required' });

    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user.id });
    if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });

    let fileMeta = null;
    if (req.file) {
      const checksum = crypto.createHash('sha256').update(fs.readFileSync(req.file.path)).digest('hex');
      fileMeta = { fileName: req.file.originalname, filePath: req.file.path, size: req.file.size, checksum };
      await Document.create({
        claimId: claim._id,
        type: 'Acknowledgement',
        ...fileMeta,
        uploadedBy: req.user.id
      });
    }

    const contentHash = keccak256({ referenceNumber, fileChecksum: fileMeta?.checksum || null, ts: Date.now() });
    const tx = await contract.updateStatus(
      claim.blockchain?.claimIdHash || keccak256({ userId: String(claim.userId), claimId: String(claim._id) }),
      STATUS_CODE.SubmittedToInsurer,
      contentHash
    );
    const receipt = await tx.wait();

    claim.status = 'SubmittedToInsurer';
    claim.ack = { referenceNumber, file: fileMeta || undefined, recordedAt: new Date() };
    claim.blockchain = { ...(claim.blockchain || {}), lastTxHash: receipt.hash };
    claim.updatedAt = new Date();
    await claim.save();

    await TimelineEvent.create({
      claimId: claim._id,
      eventType: 'InsurerAcknowledged',
      description: `Insurer reference recorded: ${referenceNumber}`,
      actor: req.user.id,
      timestamp: new Date(),
      blockchainTxHash: receipt.hash
    });

    res.json({ ok: true, status: claim.status, ref: referenceNumber, txHash: receipt.hash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Ack failed' });
  }
});

// POST /api/claims/:id/status -> move to InReview/Approved/Rejected/Paid with on-chain proof
router.post('/:id/status', ensureAuth, async (req, res) => {
  try {
    const { newStatus } = req.body || {};
    const allowed = ['InReview', 'Approved', 'Rejected', 'Paid'];
    if (!allowed.includes(newStatus)) return res.status(400).json({ ok: false, error: 'Invalid newStatus' });

    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user.id });
    if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });

    const contentHash = keccak256({ newStatus, ts: Date.now() });
    const tx = await contract.updateStatus(
      claim.blockchain?.claimIdHash || keccak256({ userId: String(claim.userId), claimId: String(claim._id) }),
      STATUS_CODE[newStatus],
      contentHash
    );
    const receipt = await tx.wait();

    claim.status = newStatus;
    claim.blockchain = { ...(claim.blockchain || {}), lastTxHash: receipt.hash };
    claim.updatedAt = new Date();
    await claim.save();

    await TimelineEvent.create({
      claimId: claim._id,
      eventType: 'StatusChanged',
      description: `Status changed to ${newStatus}`,
      actor: req.user.id,
      timestamp: new Date(),
      newStatus,
      blockchainTxHash: receipt.hash
    });

    res.json({ ok: true, status: claim.status, txHash: receipt.hash });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Status update failed' });
  }
});

// GET /api/claims/:id -> claim + timeline
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    const claim = await Claim.findOne({ _id: req.params.id, userId: req.user.id }).lean();
    if (!claim) return res.status(404).json({ ok: false, error: 'Claim not found' });
    const timeline = await TimelineEvent.find({ claimId: claim._id }).sort({ timestamp: 1 }).lean();
    res.json({ ok: true, claim, timeline });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

// GET /api/claims -> list claims for dashboard
router.get('/', ensureAuth, async (req, res) => {
  try {
    console.log('Fetching claims for user:', req.user.id);
    const items = await Claim.find({ userId: req.user.id }).sort({ updatedAt: -1 }).lean();
    console.log('Found claims:', items.length);
    res.json({ ok: true, items });
  } catch (err) {
    console.error('Error fetching claims:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch claims' });
  }
});

export default router;

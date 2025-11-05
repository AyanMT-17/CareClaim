// routes/policyAck.js (ES Module)
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import Policy from '../model/Policy.js';
import Document from '../model/Document.js';
import requireAuth from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '..', 'uploads', 'epolicy')),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '_'))
});
const fileFilter = (req, file, cb) => {
  const ok = ['image/png', 'image/jpeg', 'application/pdf'].includes(file.mimetype);
  cb(ok ? null : new Error('Invalid file type'), ok);
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 8 * 1024 * 1024 } });

router.post('/:policyId/acknowledgement', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { policyId } = req.params;
    const { referenceNumber } = req.body || {};
    const policy = await Policy.findOne({ _id: policyId, userId: req.user.id });
    if (!policy) return res.status(404).json({ ok: false, error: 'Policy not found' });

    if (!req.file) return res.status(400).json({ ok: false, error: 'No file uploaded' });
    const filePath = req.file.path;
    const checksum = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');

    const doc = await Document.create({
      type: 'Acknowledgement',
      fileName: req.file.originalname,
      filePath,
      fileSize: req.file.size,
      checksum,
      uploadedBy: req.user.id
    });

    policy.acknowledgement = {
      referenceNumber: referenceNumber || '',
      fileId: doc._id,
      verifiedAt: new Date()
    };
    // Flip to Verified if it was Pending
    if (policy.verificationStatus !== 'Verified') policy.verificationStatus = 'Verified';
    policy.updatedAt = new Date();
    await policy.save();

    res.json({ ok: true, policyId: policy._id, verificationStatus: policy.verificationStatus, acknowledgementDocId: doc._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

export default router;

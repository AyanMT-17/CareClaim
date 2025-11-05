
// routes/policyConfirm.js (ESM)
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Policy from '../model/Policy.js';
import Document from '../model/Document.js';
import requireAuth from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

function isValidDate(d) {
  const dt = new Date(d);
  return !isNaN(dt.getTime());
}

function basicPolicyValidation(fields) {
  const errors = [];
  if (!fields.policyNumber || fields.policyNumber.length < 6) errors.push('Invalid policy number');
  if (!fields.insurer) errors.push('Insurer required');
  if (!isValidDate(fields.startDate) || !isValidDate(fields.endDate)) errors.push('Invalid dates');
  if (new Date(fields.startDate) >= new Date(fields.endDate)) errors.push('Start date must be before end date');
  if (!fields.insuredName) errors.push('Insured name required');
  if (!(Number(fields.sumInsured) > 0)) errors.push('Sum insured required');
  return errors;
}

router.post('/link/confirm', requireAuth, async (req, res) => {
  try {
    const { file, extracted, ocrConfidence = 0, userConfirmed = false } = req.body || {};
    if (!file?.filePath || !file?.checksum) return res.status(400).json({ ok: false, error: 'Missing file metadata' });

    const errors = basicPolicyValidation(extracted || {});
    const canVerify = errors.length === 0 && userConfirmed;

    if (!fs.existsSync(file.filePath)) return res.status(400).json({ ok: false, error: 'Uploaded file not found' });

    const doc = await Document.create({
      type: 'EPolicy',
      fileName: file.fileName || path.basename(file.filePath),
      filePath: file.filePath,
      fileSize: file.fileSize || fs.statSync(file.filePath).size,
      checksum: file.checksum,
      uploadedBy: req.user.id,
      ocrExtractedFields: extracted || {}
    });

    const policy = await Policy.create({
      userId: req.user.id,
      insurer: extracted.insurer,
      policyNumber: extracted.policyNumber,
      product: extracted.product || null,
      uin: extracted.uin || null,
      insuredName: extracted.insuredName,
      startDate: new Date(extracted.startDate),
      endDate: new Date(extracted.endDate),
      sumInsured: Number(extracted.sumInsured),
      verificationStatus: canVerify ? 'Verified' : 'Pending',
      ocrConfidence: Number(ocrConfidence) || 0,
      linkedAt: new Date(),
      updatedAt: new Date()
    });

    return res.json({
      ok: true,
      policy: {
        id: policy._id,
        policyNumber: policy.policyNumber,
        insurer: policy.insurer,
        product: policy.product,
        uin: policy.uin,
        insuredName: policy.insuredName,
        startDate: policy.startDate,
        endDate: policy.endDate,
        sumInsured: policy.sumInsured,
        verificationStatus: policy.verificationStatus,
        ocrConfidence: policy.ocrConfidence
      },
      documentId: doc._id,
      errors,
      next: canVerify ? 'Policy verified and ready for FNOL' : 'Policy pending; upload acknowledgement to finalize'
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

export default router;
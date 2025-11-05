// routes/policies.js (ESM)
import { Router } from 'express';
import Policy from '../model/Policy.js';
import ensureAuth from '../middleware/auth.js';
const router = Router();

// Stub: ensure req.user.id exists (wire your real OAuth middleware)


function isValidDate(v) { const d = new Date(v); return !Number.isNaN(d.getTime()); }
function validateBody(b) {
  const errors = [];
  if (!b.insurer) errors.push('insurer required');
  if (!b.policyNumber) errors.push('policyNumber required');
  if (!b.insuredName) errors.push('insuredName required');
  if (!isValidDate(b.startDate) || !isValidDate(b.endDate)) errors.push('invalid dates');
  if (new Date(b.startDate) >= new Date(b.endDate)) errors.push('startDate must be before endDate');
  if (!(Number(b.sumInsured) >= 0)) errors.push('sumInsured must be a non-negative number');
  return errors;
}

// POST /api/policies  -> create from form
router.post('/', ensureAuth, async (req, res) => {
  try {
    const errors = validateBody(req.body || {});
    if (errors.length) return res.status(400).json({ ok: false, errors });

    // Optional duplicate check for same user + policyNumber
    const exists = await Policy.findOne({ userId: req.user.id, policyNumber: req.body.policyNumber });
    if (exists) return res.status(409).json({ ok: false, error: 'Policy already linked' });

    const policy = await Policy.create({
      userId: req.user.id,
      insurer: req.body.insurer,
      policyNumber: req.body.policyNumber,
      product: req.body.product || null,
      uin: req.body.uin || null,
      insuredName: req.body.insuredName,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      sumInsured: Number(req.body.sumInsured),
      verificationStatus: req.body.verificationStatus || 'Verified',
      linkedAt: new Date(),
      updatedAt: new Date()
    });

    res.json({ ok: true, id: policy._id });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

// PATCH /api/policies/:id  -> update editable fields
router.patch('/:id', ensureAuth, async (req, res) => {
  try {
    const patch = { ...req.body, updatedAt: new Date() };
    if (patch.startDate || patch.endDate || patch.sumInsured) {
      const check = validateBody({ ...patch, insurer: patch.insurer ?? 'x', policyNumber: patch.policyNumber ?? 'x', insuredName: patch.insuredName ?? 'x' });
      if (check.includes('invalid dates') || check.includes('startDate must be before endDate') || check.includes('sumInsured must be a non-negative number')) {
        return res.status(400).json({ ok: false, errors: check });
      }
    }
    const doc = await Policy.findOneAndUpdate({ _id: req.params.id, userId: req.user.id }, patch, { new: true });
    if (!doc) return res.status(404).json({ ok: false, error: 'Policy not found' });
    res.json({ ok: true, policy: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false, error: 'Internal error' });
  }
});

// GET /api/policies  -> list user policies
router.get('/', ensureAuth, async (req, res) => {
  const items = await Policy.find({ userId: req.user.id }).sort({ updatedAt: -1 }).lean();
  res.json({ ok: true, items });
});

// GET /api/policies/:id  -> get one
router.get('/:id', ensureAuth, async (req, res) => {
  const item = await Policy.findOne({ _id: req.params.id, userId: req.user.id }).lean();
  if (!item) return res.status(404).json({ ok: false, error: 'Policy not found' });
  res.json({ ok: true, policy: item });
});

export default router;

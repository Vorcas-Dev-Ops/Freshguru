const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Helper to generate FG-XXXXX ID
const generatePartnerId = () => {
  return 'FG-' + Math.floor(10000 + Math.random() * 90000);
};

// Get Activity Logs
router.get('/activity-logs', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT al.*, a.name as admin_name 
      FROM activity_logs al 
      JOIN admins a ON al.admin_id = a.id 
      ORDER BY al.created_at DESC 
      LIMIT 50
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all partners
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM partners ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new partner (Protected)
router.post('/', auth, async (req, res) => {
  const { name, phone, email, shopName, businessName, type, location, referralCode } = req.body;
  const partnerId = generatePartnerId();

  try {
    const result = await db.query(
      `INSERT INTO partners 
      (partner_id, name, phone, email, shop_name, business_name, type, location, referral_code) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [partnerId, name, phone, email, shopName, businessName, type, location, referralCode]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Partner Enrollment', shopName || name, `New business registration received via ${req.admin.name}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update partner status (Protected)
router.put('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const partnerResult = await db.query('SELECT * FROM partners WHERE id = $1', [id]);
    if (partnerResult.rows.length === 0) {
      return res.status(404).json({ message: 'Partner not found' });
    }
    const partner = partnerResult.rows[0];

    const result = await db.query(
      'UPDATE partners SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    // Log activity
    const actionLabel = status === 'approved' ? 'Approved Access' : status === 'blocked' ? 'Registration Rejected' : `Status updated to ${status}`;
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, actionLabel, partner.shop_name || partner.name, `${actionLabel} by ${req.admin.name}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

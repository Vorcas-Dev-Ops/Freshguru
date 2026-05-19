const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all activity logs
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT al.*, a.name as admin_name 
      FROM activity_logs al 
      JOIN admins a ON al.admin_id = a.id 
      ORDER BY al.created_at DESC 
      LIMIT 100
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const auth = require('../middleware/auth');

// Get all drivers
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT id, driver_id, name, status, vehicle, contact, total_orders, rating, image_url FROM drivers ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new driver (Protected)
router.post('/', auth, async (req, res) => {
  const { name, vehicle, contact, username, password, imageUrl } = req.body;
  const driverId = 'DRV-' + Math.floor(1000 + Math.random() * 9000);

  try {
    // Check if username exists
    const userCheck = await db.query('SELECT * FROM drivers WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      `INSERT INTO drivers 
      (driver_id, name, vehicle, contact, username, password, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING id, driver_id, name, status, vehicle, contact, total_orders, rating, image_url`,
      [driverId, name, vehicle, contact, username, hashedPassword, imageUrl]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Driver Registration', name, `Registered new driver ${name} (${driverId})`]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update driver status (Protected)
router.put('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query(
      'UPDATE drivers SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Driver not found' });

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Driver Status Update', result.rows[0].name, `Updated status to ${status}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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
  const {
    name,
    contact,
    email,
    aadhaar,
    vehicleRc,
    drivingLicence,
    vehicleType,
    password,
    imageUrl
  } = req.body;

  const driverId = 'DRV-' + Math.floor(1000 + Math.random() * 9000);

  try {
    // Check if email already exists
    if (email) {
      const emailCheck = await db.query('SELECT * FROM drivers WHERE email = $1', [email]);
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    }

    // Check if contact already exists
    if (contact) {
      const contactCheck = await db.query('SELECT * FROM drivers WHERE contact = $1', [contact]);
      if (contactCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Contact number already registered' });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO drivers 
      (driver_id, name, contact, email, aadhaar, vehicle_rc, driving_licence, vehicle, vehicle_type, password, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING id, driver_id, name, status, vehicle, contact, email, total_orders, rating, image_url`,
      [
        driverId,
        name,
        contact,
        email || null,
        aadhaar || null,
        vehicleRc || null,
        drivingLicence || null,
        vehicleType, // store in vehicle for backward compatibility
        vehicleType, // store in vehicle_type
        hashedPassword,
        imageUrl || null
      ]
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

// Driver Login
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Mobile or email and password are required' });
    }

    // Find driver by email or contact/mobile number
    const result = await db.query(
      'SELECT * FROM drivers WHERE email = $1 OR contact = $2',
      [identifier, identifier]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const driver = result.rows[0];
    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: driver.id, driverId: driver.driver_id, role: 'driver' },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '30d' }
    );

    res.json({
      token,
      driver: {
        id: driver.id,
        driverId: driver.driver_id,
        name: driver.name,
        email: driver.email,
        contact: driver.contact,
        vehicleType: driver.vehicle_type,
        imageUrl: driver.image_url
      }
    });
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

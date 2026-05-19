const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const admin = result.rows[0];
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create login log
    const logResult = await db.query(
      'INSERT INTO admin_logs (admin_id) VALUES ($1) RETURNING id',
      [admin.id]
    );
    const logId = logResult.rows[0].id;

    // Generate JWT
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name, logId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout Route
router.post('/logout', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const logId = decoded.logId;

    if (logId) {
      await db.query(
        'UPDATE admin_logs SET logout_time = CURRENT_TIMESTAMP WHERE id = $1',
        [logId]
      );
    }

    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    // Even if token verification fails, we return success as the client will clear the token anyway
    res.json({ message: 'Logged out' });
  }
});

// Verify Token Route
router.get('/verify', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const result = await db.query('SELECT id, email, name, role FROM admins WHERE id = $1', [decoded.id]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    res.json({ admin: result.rows[0] });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM expenses ORDER BY date DESC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new expense (Protected)
router.post('/', auth, async (req, res) => {
  const { date, category, description, quantity, unitPrice, amount } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO expenses (date, category, description, quantity, unit_price, amount, added_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [date, category, description, quantity, unitPrice, amount, req.admin.name]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Expense Logged', category, `Logged expense for ${description} (₹${amount})`]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update expense (Protected)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { date, category, description, quantity, unitPrice, amount } = req.body;

  try {
    const result = await db.query(
      `UPDATE expenses 
       SET date = $1, category = $2, description = $3, quantity = $4, unit_price = $5, amount = $6, edited_by = $7 
       WHERE id = $8 RETURNING *`,
      [date, category, description, quantity, unitPrice, amount, req.admin.name, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Expense not found' });

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Expense Updated', category, `Updated expense details for ${description}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete expense (Protected)
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM expenses WHERE id = $1', [id]);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

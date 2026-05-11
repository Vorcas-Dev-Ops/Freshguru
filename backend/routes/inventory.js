const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all products
router.get('/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product (Protected)
router.post('/products', auth, async (req, res) => {
  const { sku, name, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, enabled, imageUrl } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO products 
      (sku, name, category, purchase_price, retail_price, discount, unit, quantity, min_quantity, enabled, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [sku, name, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, enabled, imageUrl]
    );

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Inventory Add', name, `Added new item ${name} (SKU: ${sku}) to ${category}`]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Protected)
router.put('/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, enabled, imageUrl } = req.body;

  try {
    const result = await db.query(
      `UPDATE products SET 
      name = $1, category = $2, purchase_price = $3, retail_price = $4, discount = $5, 
      unit = $6, quantity = $7, min_quantity = $8, enabled = $9, image_url = $10 
      WHERE id = $11 RETURNING *`,
      [name, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, enabled, imageUrl, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Inventory Update', name, `Updated item details for ${name}`]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete product (Protected)
router.delete('/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const productResult = await db.query('SELECT name FROM products WHERE id = $1', [id]);
    if (productResult.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    const productName = productResult.rows[0].name;

    await db.query('DELETE FROM products WHERE id = $1', [id]);

    // Log activity
    await db.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Inventory Delete', productName, `Deleted item ${productName} from inventory`]
    );

    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

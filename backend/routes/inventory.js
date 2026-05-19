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

// Get top selling products
router.get('/top-selling', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY sales_count DESC LIMIT 5');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new product (Protected)
router.post('/products', auth, async (req, res) => {
  const { sku, name, hsn, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, taxType, enabled, imageUrl, description, minOrderQty } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO products 
      (sku, name, hsn, category, purchase_price, retail_price, discount, unit, quantity, min_quantity, tax_type, enabled, image_url, description, min_order_qty) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) 
      RETURNING *`,
      [sku, name, hsn, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, taxType, enabled, imageUrl, description, minOrderQty || 1]
    );

    // Log activity (non-blocking)
    try {
      await db.query(
        'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
        [req.admin?.id || 1, 'Inventory Add', name, `Added new item ${name} (SKU: ${sku}) to ${category}`]
      );
    } catch (logErr) { console.error('Activity Log Error:', logErr); }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ message: 'A product with this SKU already exists' });
    res.status(500).json({ message: 'Server error' });
  }
});

// Update product (Protected)
router.put('/products/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { name, hsn, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, taxType, enabled, imageUrl, description, minOrderQty } = req.body;

  try {
    const result = await db.query(
      `UPDATE products SET 
      name = $1, hsn = $2, category = $3, purchase_price = $4, retail_price = $5, discount = $6, 
      unit = $7, quantity = $8, min_quantity = $9, tax_type = $10, enabled = $11, image_url = $12, description = $13, min_order_qty = $14
      WHERE id = $15 RETURNING *`,
      [name, hsn, category, purchasePrice, retailPrice, discount, unit, quantity, minQuantity, taxType, enabled, imageUrl, description, minOrderQty || 1, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ message: 'Product not found' });

    // Log activity (non-blocking)
    try {
      await db.query(
        'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
        [req.admin?.id || 1, 'Inventory Update', name, `Updated item details for ${name}`]
      );
    } catch (logErr) { console.error('Activity Log Error:', logErr); }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === '23505') return res.status(400).json({ message: 'SKU conflict detected' });
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

// Get product transaction history
router.get('/products/:id/history', async (req, res) => {
  const { id } = req.params;
  try {
    // Fetch sales from order_items and purchases from expenses
    const sales = await db.query(`
      SELECT 'Sale' as type, o.customer_name as name, o.created_at as date, oi.quantity as qty, oi.price_at_order as price, 'emerald' as color
      FROM order_items oi
      JOIN orders o ON oi.order_id = o.id
      WHERE oi.product_id = $1
      ORDER BY o.created_at DESC
      LIMIT 20
    `, [id]);

    const product = await db.query('SELECT name FROM products WHERE id = $1', [id]);
    if (product.rows.length === 0) return res.status(404).json({ message: 'Product not found' });
    const productName = product.rows[0].name;

    const purchases = await db.query(`
      SELECT 'Purchase' as type, added_by as name, date, quantity as qty_str, unit_price as price, description, 'blue' as color
      FROM expenses
      WHERE category = 'FARM PROCUREMENT' AND description LIKE $1
      ORDER BY date DESC
      LIMIT 20
    `, [`%${productName}%`]);

    // Format purchases to match sales
    const formattedPurchases = purchases.rows.map(p => ({
      type: p.type,
      name: p.name,
      date: p.date,
      qty: p.qty_str,
      price: p.price,
      description: p.description,
      color: p.color
    }));

    const all = [...sales.rows, ...formattedPurchases].sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Purchase Entry (Inward Stock) - Protected
router.post('/purchases', auth, async (req, res) => {
  const { productId, quantity, unitPrice, amount, date, description } = req.body;

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Update product quantity and purchase price (Optional)
    let product = null;
    if (productId) {
      const productUpdate = await client.query(
        'UPDATE products SET quantity = quantity + $1, purchase_price = $2 WHERE id = $3 RETURNING *',
        [quantity, unitPrice, productId]
      );
      if (productUpdate.rows.length === 0) {
        throw new Error('Product not found');
      }
      product = productUpdate.rows[0];
    }

    // 2. Create expense entry
    const finalDesc = product 
      ? (description || `Stock Purchase: ${product.name}`) 
      : (description || 'General Procurement');

    await client.query(
      `INSERT INTO expenses (date, category, description, quantity, unit_price, amount, added_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [date || new Date(), 'FARM PROCUREMENT', finalDesc, quantity ? `${quantity}` : 'N/A', unitPrice || 0, amount, req.admin.name]
    );

    // 3. Log activity
    await client.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Inventory Inward', product ? product.name : 'General Expense', `Purchased inward stock: ${finalDesc}`]
    );

    await client.query('COMMIT');
    res.status(201).json({ message: 'Purchase logged successfully', product });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  } finally {
    client.release();
  }
});

// Stock Adjustment (Add/Subtract/Set) - Protected
router.post('/adjustments', auth, async (req, res) => {
  const { productId, type, quantity, reason } = req.body;
  
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    let updateQuery = '';
    let params = [];

    if (type === 'add') {
      updateQuery = 'UPDATE products SET quantity = quantity + $1 WHERE id = $2 RETURNING *';
      params = [quantity, productId];
    } else if (type === 'subtract') {
      updateQuery = 'UPDATE products SET quantity = quantity - $1 WHERE id = $2 RETURNING *';
      params = [quantity, productId];
    } else if (type === 'set') {
      updateQuery = 'UPDATE products SET quantity = $1 WHERE id = $2 RETURNING *';
      params = [quantity, productId];
    } else {
      throw new Error('Invalid adjustment type');
    }

    const result = await client.query(updateQuery, params);
    if (result.rows.length === 0) throw new Error('Product not found');
    const product = result.rows[0];

    // Log activity
    await client.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin.id, 'Stock Adjustment', product.name, `Adjusted ${product.name} quantity (${type} ${quantity}). Reason: ${reason}`]
    );

    await client.query('COMMIT');
    res.json({ message: 'Stock adjusted successfully', product });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;

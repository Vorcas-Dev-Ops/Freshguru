const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all orders for dispatch
router.get('/', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT o.*, d.name as driver_name, 
             p.phone as customer_phone, p.email as customer_email, 
             p.shop_name as customer_shop_name, p.location as customer_location,
             p.type as partner_type, p.loyalty_points as partner_points
      FROM orders o 
      LEFT JOIN drivers d ON o.driver_id = d.id 
      LEFT JOIN (
        SELECT DISTINCT ON (name) name, phone, email, shop_name, location, type, loyalty_points FROM partners
      ) p ON o.customer_name = p.name
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk assign driver
router.post('/bulk-assign', async (req, res) => {
  const { orderIds, driverId } = req.body;
  try {
    await db.query(
      'UPDATE orders SET driver_id = $1, status = $2 WHERE order_id = ANY($3)',
      [driverId, 'Assigned', orderIds]
    );
    res.json({ message: 'Driver assigned successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk finalize dispatch
router.post('/bulk-dispatch', async (req, res) => {
  const { orderIds } = req.body;
  try {
    await db.query(
      'UPDATE orders SET status = $1, dispatch_time = CURRENT_TIMESTAMP WHERE order_id = ANY($2)',
      ['Out for Delivery', orderIds]
    );
    res.json({ message: 'Orders dispatched successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get order items by order_id string
router.get('/items/by-order/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await db.query(`
      SELECT oi.*, p.image_url, p.description, p.tax_type, p.retail_price, p.unit as product_unit
      FROM order_items oi 
      JOIN orders o ON oi.order_id = o.id 
      LEFT JOIN products p ON oi.product_id = p.id 
      WHERE o.order_id = $1
    `, [orderId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Legacy support or fallback (keep it at the end)
router.get('/:orderId/items', async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await db.query(
      'SELECT oi.* FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.order_id = $1',
      [orderId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order item quantity
router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;
  try {
    // Update quantity
    const updateRes = await db.query(
      'UPDATE order_items SET quantity = $1 WHERE id = $2 RETURNING order_id',
      [quantity, id]
    );
    
    if (updateRes.rows.length > 0) {
      const orderId = updateRes.rows[0].order_id;
      // Recalculate total
      const totalRes = await db.query(
        'SELECT SUM(quantity * price_at_order) as total FROM order_items WHERE order_id = $1',
        [orderId]
      );
      const newTotal = totalRes.rows[0].total || 0;
      await db.query('UPDATE orders SET total_amount = $1 WHERE id = $2', [newTotal, orderId]);
    }

    res.json({ message: 'Item updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order status
router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await db.query(
      'UPDATE orders SET status = $1 WHERE order_id = $2',
      [status, id]
    );
    res.json({ message: 'Order status updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order delivery slot
router.put('/:id/delivery-slot', async (req, res) => {
  const { id } = req.params;
  const { slot } = req.body;
  try {
    await db.query(
      'UPDATE orders SET delivery_slot = $1 WHERE order_id = $2',
      [slot, id]
    );
    res.json({ message: 'Order delivery slot updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update order location/address
router.put('/:id/location', async (req, res) => {
  const { id } = req.params;
  const { location } = req.body;
  try {
    await db.query(
      'UPDATE orders SET delivery_location = $1 WHERE order_id = $2',
      [location, id]
    );
    res.json({ message: 'Order delivery location updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

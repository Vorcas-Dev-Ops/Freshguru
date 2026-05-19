const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all notifications
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new notification (e.g. from simulator or integration)
router.post('/', async (req, res) => {
  const { type, title, message } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3) RETURNING *',
      [type, title, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification(s) as read
router.post('/mark-read', async (req, res) => {
  const { id } = req.body;
  try {
    if (id) {
      await db.query('UPDATE notifications SET read = TRUE WHERE id = $1', [id]);
    } else {
      await db.query('UPDATE notifications SET read = TRUE');
    }
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Simulate events (e.g. New request, Order placed, Order delivered)
router.post('/simulate', async (req, res) => {
  const { eventType } = req.body;
  try {
    let title, message, type;
    
    if (eventType === 'request') {
      const customers = ['Nature Fresh', 'Reliance Retail', 'Star Mart', 'Indiranagar Hub', 'Gourmet Store'];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const requestTypes = ['Onboarding Request', 'Bulk Price Quote', 'Logistics Query'];
      const reqType = requestTypes[Math.floor(Math.random() * requestTypes.length)];
      
      type = 'request';
      title = `New Customer ${reqType}`;
      message = `Customer "${customer}" has sent a new ${reqType.toLowerCase()} via the mobile app.`;
      
      // Also insert into partners table if onboarding
      if (reqType === 'Onboarding Request') {
        const pId = 'FG-' + Math.floor(10000 + Math.random() * 90000);
        await db.query(
          'INSERT INTO partners (partner_id, name, shop_name, status, location) VALUES ($1, $2, $3, $4, $5)',
          [pId, customer, `${customer} Shop`, 'pending', 'Indiranagar, Bangalore']
        );
      }
    } else if (eventType === 'placed') {
      const customers = ['Metro Gourmet', 'Organic Farms', 'Star Retailers', 'Nature Fresh', 'Reliance Fresh'];
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const amount = Math.floor(1500 + Math.random() * 10000);
      const ordId = 'FG-ORD-' + Math.floor(1000 + Math.random() * 9000);
      
      type = 'placed';
      title = 'New Order Placed';
      message = `Order ${ordId} worth ₹${amount.toLocaleString()} was successfully placed by ${customer}.`;
      
      // Insert into orders
      await db.query(
        'INSERT INTO orders (order_id, customer_name, delivery_location, total_amount, status) VALUES ($1, $2, $3, $4, $5)',
        [ordId, customer, 'Indiranagar Cluster', amount, 'Ready for Dispatch']
      );
    } else if (eventType === 'delivered') {
      // Find an order to update to delivered
      const orders = await db.query("SELECT * FROM orders WHERE status != 'Delivered' LIMIT 1");
      let ordId = 'FG-ORD-9842';
      let customer = 'Aman Gupta';
      if (orders.rows.length > 0) {
        ordId = orders.rows[0].order_id;
        customer = orders.rows[0].customer_name;
        await db.query("UPDATE orders SET status = 'Delivered' WHERE order_id = $1", [ordId]);
      } else {
        // Create one then mark delivered
        await db.query(
          "INSERT INTO orders (order_id, customer_name, delivery_location, total_amount, status) VALUES ($1, $2, $3, $4, $5)",
          [ordId, customer, 'Koramangala Hub', 4500, 'Delivered']
        );
      }
      
      type = 'delivered';
      title = 'Order Delivered';
      message = `Order ${ordId} has been successfully delivered to ${customer}.`;
    } else {
      return res.status(400).json({ message: 'Invalid eventType' });
    }

    const result = await db.query(
      'INSERT INTO notifications (type, title, message) VALUES ($1, $2, $3) RETURNING *',
      [type, title, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

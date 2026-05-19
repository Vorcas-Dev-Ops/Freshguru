const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./db');
const authRoutes = require('./routes/auth');
const partnersRoutes = require('./routes/partners');
const inventoryRoutes = require('./routes/inventory');
const categoriesRoutes = require('./routes/categories');
const driversRoutes = require('./routes/drivers');
const expensesRoutes = require('./routes/expenses');
const ordersRoutes = require('./routes/orders');
const reportsRoutes = require('./routes/reports');
const insightsRoutes = require('./routes/insights');
const backupRoutes = require('./routes/backup');
const logsRoutes = require('./routes/logs');
const notificationsRoutes = require('./routes/notifications');
require('dotenv').config();

const app = express();

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased for image base64

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/partners', partnersRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/expenses', expensesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/insights', insightsRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/notifications', notificationsRoutes);

// Seed Categories Function
const seedCategories = async () => {
  const categories = ['Fruit', 'Vegetable', 'Dairy', 'Bakery', 'Frozen'];
  for (const cat of categories) {
    await db.query('INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [cat]);
  }
};

// Seed Admins Function
const seedAdmins = async () => {
  const admins = [
    { name: 'Admin One', email: 'admin1@freshguru.in', password: 'adminpassword1' },
    { name: 'Admin Two', email: 'admin2@freshguru.in', password: 'adminpassword2' }
  ];

  for (const admin of admins) {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [admin.email]);
    if (result.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(admin.password, 10);
      await db.query(
        'INSERT INTO admins (name, email, password) VALUES ($1, $2, $3)',
        [admin.name, admin.email, hashedPassword]
      );
      console.log(`Seeded admin: ${admin.email}`);
    }
  }
};

// Seed Orders Function
const seedOrders = async () => {
  const orders = [
    { order_id: 'FG-ORD-9840', customer_name: 'Metro Gourmet', delivery_location: 'Indiranagar Cluster', total_amount: 4250, loyalty_points: 42, status: 'Ready for Dispatch', delivery_slot: '06:00 AM - 09:00 AM', zone: 'East' },
    { order_id: 'FG-ORD-9841', customer_name: 'Star Retailers', delivery_location: 'Koramangala Hub', total_amount: 1200, loyalty_points: 12, status: 'Ready for Dispatch', delivery_slot: '06:00 AM - 09:00 AM', zone: 'South' },
    { order_id: 'FG-ORD-9842', customer_name: 'Nature Fresh', delivery_location: 'Indiranagar Cluster', total_amount: 8400, loyalty_points: 84, status: 'Ready for Dispatch', delivery_slot: '09:00 AM - 12:00 PM', zone: 'East' },
    { order_id: 'FG-ORD-9843', customer_name: 'Organic Farms', delivery_location: 'Whitefield Zone', total_amount: 3100, loyalty_points: 31, status: 'Ready for Dispatch', delivery_slot: '09:00 AM - 12:00 PM', zone: 'East' },
    { order_id: 'FG-ORD-9844', customer_name: 'Reliance Fresh', delivery_location: 'Jayanagar Block', total_amount: 15400, loyalty_points: 154, status: 'Out for Delivery', delivery_slot: 'Early Morning', zone: 'South' },
  ];

  const result = await db.query('SELECT COUNT(*) FROM orders');
  if (parseInt(result.rows[0].count) === 0) {
    for (const order of orders) {
      const orderRes = await db.query(
        'INSERT INTO orders (order_id, customer_name, delivery_location, total_amount, loyalty_points, status, delivery_slot, zone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
        [order.order_id, order.customer_name, order.delivery_location, order.total_amount, order.loyalty_points, order.status, order.delivery_slot, order.zone]
      );
      const dbOrderId = orderRes.rows[0].id;

      // Seed items for each order
      const items = [
        { name: 'Potato (Premium)', quantity: 5, unit: 'kg', price: 40 },
        { name: 'Onion (Nasik)', quantity: 3, unit: 'kg', price: 60 },
        { name: 'Tomato (Local)', quantity: 2, unit: 'kg', price: 50 },
      ];

      for (const item of items) {
        await db.query(
          'INSERT INTO order_items (order_id, product_name, quantity, unit, price_at_order) VALUES ($1, $2, $3, $4, $5)',
          [dbOrderId, item.name, item.quantity, item.unit, item.price]
        );
      }
    }
    console.log('Seeded sample orders and items');
  }
};

const PORT = 5055;

const startServer = async () => {
  try {
    // Initialize DB tables
    await db.initDb();
    
    // Seed default admins
    await seedAdmins();
    
    // Seed categories
    await seedCategories();

    // Seed sample orders
    await seedOrders();

    console.log('Starting app.listen...');
    const server = app.listen(PORT, () => {
      console.log(`Server successfully listening on port ${PORT}`);
    });

    server.on('error', (err) => {
      console.error('Server error:', err);
    });

    server.on('close', () => {
      console.log('Server closed');
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();

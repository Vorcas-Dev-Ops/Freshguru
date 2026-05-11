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

const PORT = 5055;

const startServer = async () => {
  try {
    // Initialize DB tables
    await db.initDb();
    
    // Seed default admins
    await seedAdmins();
    
    // Seed categories
    await seedCategories();

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

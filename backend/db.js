const { Pool } = require('pg');
const path = require('path');
const fs = require('fs');

const dotenvPath = path.join(__dirname, '.env');
console.log('Dotenv path:', dotenvPath);
console.log('Dotenv file exists:', fs.existsSync(dotenvPath));
if (fs.existsSync(dotenvPath)) {
  console.log('Dotenv contents:\n', fs.readFileSync(dotenvPath, 'utf8'));
}

require('dotenv').config({ path: dotenvPath, override: true });

console.log('Database config debug:', {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  passwordType: typeof process.env.DB_PASSWORD,
  passwordVal: process.env.DB_PASSWORD ? `[length: ${process.env.DB_PASSWORD.length}]` : 'undefined',
  port: process.env.DB_PORT,
});

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Create admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'Main Admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create admin_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        logout_time TIMESTAMP,
        session_token TEXT
      );
    `);

    // Create partners table
    await client.query(`
      CREATE TABLE IF NOT EXISTS partners (
        id SERIAL PRIMARY KEY,
        partner_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(255),
        shop_name VARCHAR(255),
        business_name VARCHAR(255),
        type VARCHAR(100),
        location VARCHAR(255),
        referral_code VARCHAR(50),
        status VARCHAR(50) DEFAULT 'pending',
        credit_balance DECIMAL(15,2) DEFAULT 0.00,
        loyalty_points INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create activity_logs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id SERIAL PRIMARY KEY,
        admin_id INTEGER REFERENCES admins(id) ON DELETE CASCADE,
        action VARCHAR(255) NOT NULL,
        entity_name VARCHAR(255),
        details TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create categories table
    await client.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        sku VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        hsn VARCHAR(50),
        category VARCHAR(100) NOT NULL,
        purchase_price DECIMAL(15,2) DEFAULT 0.00,
        retail_price DECIMAL(15,2) DEFAULT 0.00,
        discount DECIMAL(5,2) DEFAULT 0.00,
        unit VARCHAR(50) DEFAULT 'kg',
        quantity INTEGER DEFAULT 0,
        min_quantity INTEGER DEFAULT 1,
        tax_type VARCHAR(50) DEFAULT 'GST 5%',
        enabled BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create drivers table
    await client.query(`
      CREATE TABLE IF NOT EXISTS drivers (
        id SERIAL PRIMARY KEY,
        driver_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) DEFAULT 'Active',
        vehicle VARCHAR(100),
        contact VARCHAR(255),
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        total_orders INTEGER DEFAULT 0,
        rating DECIMAL(3,1) DEFAULT 5.0,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create expenses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        quantity VARCHAR(50),
        unit_price DECIMAL(15,2),
        amount DECIMAL(15,2) NOT NULL,
        added_by VARCHAR(255),
        edited_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create orders table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        customer_name VARCHAR(255) NOT NULL,
        delivery_location TEXT NOT NULL,
        total_amount DECIMAL(15,2) NOT NULL,
        loyalty_points INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'Ready for Dispatch',
        driver_id INTEGER REFERENCES drivers(id) ON DELETE SET NULL,
        delivery_slot VARCHAR(100),
        zone VARCHAR(100),
        dispatch_time TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Ensure columns exist (Manual migration for existing tables)
    try {
      await client.query('ALTER TABLE partners ADD COLUMN IF NOT EXISTS image_url TEXT');
      await client.query('ALTER TABLE expenses ADD COLUMN IF NOT EXISTS added_by VARCHAR(255)');
      await client.query('ALTER TABLE expenses ADD COLUMN IF NOT EXISTS edited_by VARCHAR(255)');
      await client.query('ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT \'Main Admin\'');
      
      // Product table migrations
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS hsn VARCHAR(50)');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS tax_type VARCHAR(50) DEFAULT \'GST 5%\'');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS sales_count INTEGER DEFAULT 0');
      await client.query('ALTER TABLE products ADD COLUMN IF NOT EXISTS min_order_qty DECIMAL(10,2) DEFAULT 1.0');

      // Order table migrations
      await client.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS zone VARCHAR(100)');
      await client.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_slot VARCHAR(100)');

      // Create order_items table
      await client.query(`
        CREATE TABLE IF NOT EXISTS order_items (
          id SERIAL PRIMARY KEY,
          order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
          product_id INTEGER REFERENCES products(id),
          product_name VARCHAR(255),
          quantity DECIMAL(10,2) NOT NULL,
          unit VARCHAR(50),
          price_at_order DECIMAL(15,2) NOT NULL
        );
      `);

      // Create backups table
      await client.query(`
        CREATE TABLE IF NOT EXISTS backups (
          id SERIAL PRIMARY KEY,
          filename VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          size BIGINT,
          status VARCHAR(50) DEFAULT 'Success',
          storage_location VARCHAR(100) DEFAULT 'Local',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Create notifications table
      await client.query(`
        CREATE TABLE IF NOT EXISTS notifications (
          id SERIAL PRIMARY KEY,
          type VARCHAR(100) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);
    } catch (e) {
      console.log('Columns might already exist or error during migration:', e.message);
    }

    await client.query('COMMIT');
    console.log('Database tables initialized successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database tables:', err);
  } finally {
    client.release();
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb,
  pool
};

const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Business Overview Stats
router.get('/overview', authMiddleware, async (req, res) => {
  try {
    const revenue = await db.query("SELECT SUM(total_amount) FROM orders WHERE status = 'Delivered'");
    const orders = await db.query("SELECT COUNT(*) FROM orders");
    const customers = await db.query("SELECT COUNT(*) FROM partners WHERE type = 'Customer'");
    const pending = await db.query("SELECT COUNT(*) FROM orders WHERE status NOT IN ('Delivered', 'Cancelled', 'Rejected')");
    const outstanding = await db.query("SELECT SUM(credit_balance) FROM partners");
    const lowStock = await db.query("SELECT COUNT(*) FROM products WHERE quantity <= min_quantity");

    const dailySales = await db.query(`
      SELECT TO_CHAR(created_at, 'Dy') as name, SUM(total_amount) as revenue, COUNT(*) as orders
      FROM orders
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY TO_CHAR(created_at, 'Dy'), DATE(created_at)
      ORDER BY DATE(created_at) ASC
    `);

    res.json({
      kpis: {
        totalRevenue: revenue.rows[0].sum || 0,
        totalOrders: orders.rows[0].count || 0,
        activeCustomers: customers.rows[0].count || 0,
        pendingDeliveries: pending.rows[0].count || 0,
        outstandingPayments: outstanding.rows[0].sum || 0,
        lowStockProducts: lowStock.rows[0].count || 0
      },
      charts: {
        dailySales: dailySales.rows
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sales Analytics
router.get('/sales', authMiddleware, async (req, res) => {
  try {
    const salesByDay = await db.query(`
      SELECT TO_CHAR(created_at, 'DD Mon') as name, SUM(total_amount) as revenue
      FROM orders
      WHERE status = 'Delivered'
      GROUP BY TO_CHAR(created_at, 'DD Mon'), DATE(created_at)
      ORDER BY DATE(created_at) ASC
      LIMIT 30
    `);

    const salesByCategory = await db.query(`
      SELECT p.category as name, SUM(oi.quantity * oi.price_at_order) as value
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      GROUP BY p.category
      ORDER BY value DESC
    `);

    res.json({
      salesTrend: salesByDay.rows,
      categorySales: salesByCategory.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Inventory Insights
router.get('/inventory', authMiddleware, async (req, res) => {
  try {
    const valuation = await db.query("SELECT SUM(quantity * purchase_price) as value FROM products");
    const outOfStock = await db.query("SELECT COUNT(*) FROM products WHERE quantity = 0");
    const lowStock = await db.query("SELECT COUNT(*) FROM products WHERE quantity <= min_quantity AND quantity > 0");
    
    const stockLevels = await db.query(`
      SELECT name, quantity as current, min_quantity as min
      FROM products
      ORDER BY quantity ASC
      LIMIT 10
    `);

    res.json({
      kpis: {
        totalValuation: valuation.rows[0].value || 0,
        outOfStock: outOfStock.rows[0].count || 0,
        lowStock: lowStock.rows[0].count || 0
      },
      stockLevels: stockLevels.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Financial Insights
router.get('/financial', authMiddleware, async (req, res) => {
  try {
    const revenue = await db.query("SELECT SUM(total_amount) FROM orders WHERE status = 'Delivered'");
    const expenses = await db.query("SELECT SUM(amount) FROM expenses");
    
    const pnlTrend = await db.query(`
      SELECT 
        TO_CHAR(date_trunc('month', created_at), 'Mon YYYY') as name,
        SUM(total_amount) as revenue
      FROM orders
      WHERE status = 'Delivered'
      GROUP BY date_trunc('month', created_at)
      ORDER BY date_trunc('month', created_at) ASC
    `);

    res.json({
      kpis: {
        grossRevenue: revenue.rows[0].sum || 0,
        totalExpenses: expenses.rows[0].sum || 0,
        netProfit: (revenue.rows[0].sum || 0) - (expenses.rows[0].sum || 0)
      },
      pnlTrend: pnlTrend.rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

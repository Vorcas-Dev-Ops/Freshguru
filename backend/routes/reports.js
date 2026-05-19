const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');

// Generic Report Fetcher
router.get('/:type', authMiddleware, async (req, res) => {
  const { type } = req.params;
  const { startDate, endDate } = req.query;

  try {
    let query = '';
    let params = [];

    switch (type) {
      case 'daily-sales':
        query = `
          SELECT 
            TO_CHAR(created_at, 'DD Mon YYYY') as label, 
            SUM(total_amount) as value,
            COUNT(id) as count
          FROM orders 
          WHERE status NOT IN ('Rejected', 'Cancelled')
          GROUP BY TO_CHAR(created_at, 'DD Mon YYYY'), DATE(created_at)
          ORDER BY DATE(created_at) DESC 
          LIMIT 30`;
        break;

      case 'weekly-sales':
        query = `
          SELECT 
            'Week ' || TO_CHAR(created_at, 'WW, YYYY') as label, 
            SUM(total_amount) as value,
            COUNT(id) as count
          FROM orders 
          WHERE status NOT IN ('Rejected', 'Cancelled')
          GROUP BY TO_CHAR(created_at, 'WW, YYYY'), DATE_TRUNC('week', created_at)
          ORDER BY DATE_TRUNC('week', created_at) DESC 
          LIMIT 12`;
        break;

      case 'monthly-revenue':
        query = `
          SELECT 
            TO_CHAR(created_at, 'Mon YYYY') as label, 
            SUM(total_amount) as value
          FROM orders 
          WHERE status != 'Rejected'
          GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
          ORDER BY DATE_TRUNC('month', created_at) DESC`;
        break;

      case 'product-sales':
        query = `
          SELECT 
            product_name as label, 
            SUM(quantity) as units,
            SUM(quantity * price_at_order) as value
          FROM order_items 
          GROUP BY product_name 
          ORDER BY value DESC 
          LIMIT 50`;
        break;

      case 'partner-sales':
        query = `
          SELECT 
            customer_name as label, 
            COUNT(id) as count,
            SUM(total_amount) as value
          FROM orders 
          WHERE status != 'Rejected'
          GROUP BY customer_name 
          ORDER BY value DESC 
          LIMIT 50`;
        break;

      case 'category-sales':
        query = `
          SELECT 
            p.category as label, 
            SUM(oi.quantity * oi.price_at_order) as value
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          GROUP BY p.category 
          ORDER BY value DESC`;
        break;

      case 'current-stock':
        query = `
          SELECT 
            name as label, 
            quantity as qty,
            unit,
            purchase_price as rate,
            (quantity * purchase_price) as value
          FROM products 
          ORDER BY value DESC`;
        break;

      case 'low-stock':
        query = `
          SELECT 
            name as label, 
            quantity as qty,
            min_quantity as min
          FROM products 
          WHERE quantity <= min_quantity
          ORDER BY quantity ASC`;
        break;

      case 'expense-summary':
        query = `
          SELECT 
            category as label, 
            SUM(amount) as value
          FROM expenses 
          GROUP BY category 
          ORDER BY value DESC`;
        break;

      case 'delivered-orders':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            TO_CHAR(created_at, 'DD/MM HH:MI AM') as time,
            total_amount as value
          FROM orders 
          WHERE status = 'Delivered'
          ORDER BY created_at DESC 
          LIMIT 100`;
        break;

      case 'failed-deliveries':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            TO_CHAR(created_at, 'DD/MM HH:MI AM') as time,
            total_amount as value
          FROM orders 
          WHERE status IN ('Rejected', 'Cancelled')
          ORDER BY created_at DESC 
          LIMIT 100`;
        break;

      case 'top-selling':
        query = `
          SELECT 
            product_name as label, 
            SUM(quantity) as units,
            SUM(quantity * price_at_order) as value
          FROM order_items 
          GROUP BY product_name 
          ORDER BY units DESC 
          LIMIT 10`;
        break;

      case 'credit-partners':
        query = `
          SELECT 
            name as label, 
            credit_balance as value
          FROM partners 
          WHERE credit_balance > 0
          ORDER BY credit_balance DESC`;
        break;

      case 'partner-statements':
        query = `
          SELECT 
            customer_name as label, 
            SUM(total_amount) as value,
            COUNT(id) as count
          FROM orders 
          GROUP BY customer_name 
          ORDER BY value DESC`;
        break;

      // Purchase Reports
      case 'supplier-purchases':
        query = `
          SELECT 
            added_by as label, 
            SUM(amount) as value,
            COUNT(id) as count
          FROM expenses 
          WHERE category = 'Inventory'
          GROUP BY added_by 
          ORDER BY value DESC`;
        break;

      case 'daily-purchases':
        query = `
          SELECT 
            TO_CHAR(date, 'DD Mon YYYY') as label, 
            SUM(amount) as value
          FROM expenses 
          WHERE category = 'Inventory'
          GROUP BY TO_CHAR(date, 'DD Mon YYYY'), date
          ORDER BY date DESC 
          LIMIT 30`;
        break;

      case 'purchase-history':
        query = `
          SELECT 
            TO_CHAR(date, 'DD/MM/YYYY') as label, 
            description as entity,
            amount as value,
            added_by as user
          FROM expenses 
          WHERE category = 'Inventory'
          ORDER BY date DESC`;
        break;

      // Inventory Reports
      case 'inventory-valuation':
        query = `
          SELECT 
            category as label, 
            SUM(quantity * purchase_price) as value
          FROM products 
          GROUP BY category 
          ORDER BY value DESC`;
        break;

      case 'stock-movement':
        query = `
          SELECT 
            p.name as label, 
            SUM(oi.quantity) as units_out,
            p.quantity as remaining
          FROM products p
          LEFT JOIN order_items oi ON p.id = oi.product_id
          GROUP BY p.name, p.quantity
          ORDER BY units_out DESC NULLS LAST`;
        break;

      // Partner Reports
      case 'loyalty-report':
        query = `
          SELECT 
            name as label, 
            loyalty_points as value
          FROM partners 
          WHERE loyalty_points > 0
          ORDER BY loyalty_points DESC`;
        break;

      case 'customer-history':
        query = `
          SELECT 
            customer_name as label, 
            MAX(created_at) as last_order,
            COUNT(id) as total_orders
          FROM orders 
          GROUP BY customer_name 
          ORDER BY total_orders DESC`;
        break;

      // Payment Reports
      case 'paid-invoices':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            total_amount as value,
            'Paid' as status
          FROM orders 
          WHERE status = 'Delivered'
          ORDER BY created_at DESC`;
        break;

      case 'pending-payments':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            total_amount as value,
            status
          FROM orders 
          WHERE status NOT IN ('Delivered', 'Cancelled', 'Rejected')
          ORDER BY created_at DESC`;
        break;

      // Delivery Reports
      case 'driver-performance':
        query = `
          SELECT 
            d.name as label, 
            COUNT(o.id) as deliveries,
            d.rating as value
          FROM drivers d
          LEFT JOIN orders o ON d.id = o.driver_id AND o.status = 'Delivered'
          GROUP BY d.name, d.rating
          ORDER BY deliveries DESC`;
        break;

      // Financial Reports
      case 'profit-loss':
        query = `
          SELECT 
            'Gross Revenue' as label, SUM(total_amount) as value FROM orders WHERE status = 'Delivered'
          UNION ALL
          SELECT 
            'Total Expenses' as label, SUM(amount) as value FROM expenses
          UNION ALL
          SELECT 
            'Net Profit' as label, 
            (SELECT SUM(total_amount) FROM orders WHERE status = 'Delivered') - 
            (SELECT SUM(amount) FROM expenses) as value`;
        break;

      case 'revenue-summary':
        query = `
          SELECT 
            TO_CHAR(created_at, 'Mon YYYY') as label, 
            SUM(total_amount) as value
          FROM orders 
          WHERE status = 'Delivered'
          GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
          ORDER BY DATE_TRUNC('month', created_at) DESC`;
        break;

      // GST Reports
      case 'gst-summary':
        query = `
          SELECT 
            tax_type as label, 
            SUM(quantity * retail_price * 0.05) as tax_value
          FROM products 
          GROUP BY tax_type`;
        break;

      case 'hsn-reports':
        query = `
          SELECT 
            hsn as label, 
            SUM(quantity) as stock,
            SUM(quantity * retail_price) as valuation
          FROM products 
          GROUP BY hsn`;
        break;

      case 'overdue-payments':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            total_amount as value,
            'Overdue' as status
          FROM orders 
          WHERE status = 'Out for Delivery' AND created_at < NOW() - INTERVAL '2 days'
          ORDER BY created_at ASC`;
        break;

      case 'damaged-stock':
        query = `
          SELECT 
            name as label, 
            0 as qty,
            'N/A' as reason
          FROM products 
          LIMIT 0`; // Placeholder since we don't have a damaged_stock table yet
        break;

      case 'tax-collected':
        query = `
          SELECT 
            TO_CHAR(created_at, 'Mon YYYY') as label, 
            SUM(total_amount * 0.05) as tax_value
          FROM orders 
          WHERE status = 'Delivered'
          GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
          ORDER BY DATE_TRUNC('month', created_at) DESC`;
        break;

      case 'delivery-delays':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            'Delayed' as reason,
            total_amount as value
          FROM orders 
          WHERE status = 'Out for Delivery' AND created_at < NOW() - INTERVAL '4 hours'`;
        break;

      case 'cash-flow':
        query = `
          SELECT 
            TO_CHAR(date, 'DD/MM') as label,
            SUM(CASE WHEN category = 'Inventory' THEN -amount ELSE amount END) as value
          FROM expenses
          GROUP BY TO_CHAR(date, 'DD/MM'), date
          ORDER BY date DESC
          LIMIT 15`;
        break;

      case 'qr-history':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            'UPI/QR' as method,
            total_amount as value
          FROM orders 
          WHERE status = 'Delivered'
          LIMIT 50`;
        break;

      case 'delivery-adjustments':
        query = `
          SELECT 
            order_id as label, 
            customer_name as entity,
            'Qty Changed' as reason,
            total_amount as value
          FROM orders 
          WHERE status = 'Delivered'
          LIMIT 50`;
        break;

      case 'balance-sheet':
        query = `
          SELECT 'Total Assets' as label, (SELECT SUM(quantity * purchase_price) FROM products) as value
          UNION ALL
          SELECT 'Accounts Receivable' as label, (SELECT SUM(credit_balance) FROM partners) as value
          UNION ALL
          SELECT 'Total Liabilities' as label, 0 as value`;
        break;

      case 'credit-utilization':
        query = `
          SELECT 
            name as label, 
            credit_balance as value
          FROM partners 
          WHERE credit_balance > 0
          ORDER BY credit_balance DESC`;
        break;

      default:
        return res.status(400).json({ message: 'Invalid report type' });
    }

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Report Error:', err);
    res.status(500).json({ message: 'Error generating report' });
  }
});

module.exports = router;

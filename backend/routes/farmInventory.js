const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/auth');

// Get all farm ledger entries
router.get('/', auth, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM farm_inventory ORDER BY date DESC, created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching farm inventory:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new inward stock entry
router.post('/', auth, async (req, res) => {
  const {
    id,
    name,
    category,
    source,
    date,
    qty,
    unit,
    purchaseRate,
    targetPrice,
    image, // base64 string
    pushDirectly
  } = req.body;

  const entryId = id || `FP-${Math.floor(Math.random() * 9000) + 1000}`;
  const status = pushDirectly ? 'Pushed' : 'Pending';
  const pushQty = pushDirectly ? Number(qty) : 0;
  const formattedDate = date ? new Date(date) : new Date();

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into farm_inventory ledger
    const ledgerResult = await client.query(
      `INSERT INTO farm_inventory 
      (id, date, name, category, source, qty, push_qty, unit, purchase_rate, target_price, status, image_url) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        entryId,
        formattedDate,
        name,
        category,
        source || 'Direct Farm',
        Number(qty),
        pushQty,
        unit || 'kg',
        Number(purchaseRate),
        Number(targetPrice),
        status,
        image || null
      ]
    );

    // 2. If pushDirectly is true, insert into main products inventory
    if (pushDirectly) {
      const catPrefix = category.substring(0, 3).toUpperCase();
      const sku = `FARM-${catPrefix}-${Math.floor(Math.random() * 10000)}`;
      const desc = `Procured from: ${source || 'Direct Farm'} on ${formattedDate.toLocaleDateString()}`;

      await client.query(
        `INSERT INTO products 
        (sku, name, category, purchase_price, retail_price, unit, quantity, min_quantity, tax_type, enabled, image_url, description, min_order_qty) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          sku,
          name,
          category,
          Number(purchaseRate),
          Number(targetPrice),
          unit || 'kg',
          Number(qty),
          10, // minQuantity default
          'GST 5%', // taxType default
          true, // enabled default
          image || null,
          desc,
          1.0 // minOrderQty default
        ]
      );

      // Log activity
      await client.query(
        'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
        [req.admin?.id || 1, 'Inventory Add', name, `Added new item ${name} (SKU: ${sku}) to ${category}`]
      );

      // 3. Log to Expenses
      const expenseDesc = `${name} (Procured from ${source || 'Direct Farm'})`;
      const expenseQty = `${qty} ${unit || 'kg'}`;
      const expenseAmount = Number(qty) * Number(purchaseRate);

      await client.query(
        `INSERT INTO expenses (date, category, description, quantity, unit_price, amount, added_by) 
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          formattedDate,
          'FARM PROCUREMENT',
          expenseDesc,
          expenseQty,
          Number(purchaseRate),
          expenseAmount,
          req.admin?.name || 'System'
        ]
      );
    }

    await client.query('COMMIT');
    res.status(201).json(ledgerResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error creating farm inventory entry:', err);
    res.status(500).json({ message: 'Server error' });
  } finally {
    client.release();
  }
});

// Push a pending ledger item to the main inventory
router.post('/:id/push', auth, async (req, res) => {
  const { id } = req.params;
  const { pushQty } = req.body;

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Fetch item from ledger
    const ledgerSearch = await client.query('SELECT * FROM farm_inventory WHERE id = $1', [id]);
    if (ledgerSearch.rows.length === 0) {
      throw new Error('Farm inventory entry not found');
    }

    const item = ledgerSearch.rows[0];
    if (item.status === 'Pushed') {
      throw new Error('Item is already pushed to inventory');
    }

    const finalPushQty = Number(pushQty) || item.qty;
    const catPrefix = item.category.substring(0, 3).toUpperCase();
    const sku = `FARM-${catPrefix}-${Math.floor(Math.random() * 10000)}`;
    const desc = `Procured from: ${item.source} on ${new Date(item.date).toLocaleDateString()}`;

    // 2. Create the product in the main inventory
    await client.query(
      `INSERT INTO products 
      (sku, name, category, purchase_price, retail_price, unit, quantity, min_quantity, tax_type, enabled, image_url, description, min_order_qty) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        sku,
        item.name,
        item.category,
        Number(item.purchase_rate),
        Number(item.target_price),
        item.unit,
        finalPushQty,
        10, // minQuantity
        'GST 5%', // taxType
        true, // enabled
        item.image_url,
        desc,
        1.0 // minOrderQty
      ]
    );

    // 3. Update the farm ledger status
    const updateResult = await client.query(
      `UPDATE farm_inventory 
       SET status = 'Pushed', push_qty = $1 
       WHERE id = $2 
       RETURNING *`,
      [finalPushQty, id]
    );

    // 4. Log activity
    await client.query(
      'INSERT INTO activity_logs (admin_id, action, entity_name, details) VALUES ($1, $2, $3, $4)',
      [req.admin?.id || 1, 'Inventory Add', item.name, `Added new item ${item.name} (SKU: ${sku}) to ${item.category}`]
    );

    // 5. Log to Expenses
    const expenseDesc = `${item.name} (Procured from ${item.source})`;
    const expenseQty = `${finalPushQty} ${item.unit}`;
    const expenseAmount = Number(finalPushQty) * Number(item.purchase_rate);

    await client.query(
      `INSERT INTO expenses (date, category, description, quantity, unit_price, amount, added_by) 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        new Date(item.date),
        'FARM PROCUREMENT',
        expenseDesc,
        expenseQty,
        Number(item.purchase_rate),
        expenseAmount,
        req.admin?.name || 'System'
      ]
    );

    await client.query('COMMIT');
    res.json(updateResult.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error pushing farm inventory to main:', err);
    res.status(500).json({ message: err.message || 'Server error' });
  } finally {
    client.release();
  }
});

module.exports = router;

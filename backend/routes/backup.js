const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/auth');
const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

const BACKUP_DIR = path.join(__dirname, '../backups');
fs.ensureDirSync(BACKUP_DIR);

// Get Backup History
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM backups ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching backup history' });
  }
});

// Create Backup
router.post('/create', authMiddleware, async (req, res) => {
  const { options, storage } = req.body;
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `freshguru_backup_${timestamp}.zip`;
  const filePath = path.join(BACKUP_DIR, filename);

  try {
    const output = fs.createWriteStream(filePath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      const stats = fs.statSync(filePath);
      await db.query(
        'INSERT INTO backups (filename, type, size, status, storage_location) VALUES ($1, $2, $3, $4, $5)',
        [filename, options.full ? 'Full' : 'Partial', stats.size, 'Success', storage]
      );
      res.json({ message: 'Backup created successfully', filename });
    });

    archive.on('error', (err) => { throw err; });
    archive.pipe(output);

    // Export Data Logic
    const tables = {
      partners: 'partners',
      products: 'products',
      inventory: 'products', // Inventory is in products table
      orders: 'orders',
      order_items: 'order_items',
      expenses: 'expenses',
      categories: 'categories',
      drivers: 'drivers'
    };

    for (const [key, table] of Object.entries(tables)) {
      if (options.full || options[key]) {
        const result = await db.query(`SELECT * FROM ${table}`);
        archive.append(JSON.stringify(result.rows, null, 2), { name: `data/${table}.json` });
      }
    }

    // Add a manifest file
    const manifest = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      type: options.full ? 'Full' : 'Partial',
      included: options
    };
    archive.append(JSON.stringify(manifest, null, 2), { name: 'manifest.json' });

    archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Backup failed' });
  }
});

// Download Backup
router.get('/download/:filename', authMiddleware, (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(BACKUP_DIR, filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'Backup file not found' });
  }
});

// Delete Backup
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await db.query('SELECT filename FROM backups WHERE id = $1', [req.params.id]);
    if (result.rows.length > 0) {
      const filePath = path.join(BACKUP_DIR, result.rows[0].filename);
      if (fs.existsSync(filePath)) {
        await fs.remove(filePath);
      }
      await db.query('DELETE FROM backups WHERE id = $1', [req.params.id]);
      res.json({ message: 'Backup deleted successfully' });
    } else {
      res.status(404).json({ message: 'Backup not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting backup' });
  }
});

// Restore Logic
const AdmZip = require('adm-zip');

router.post('/restore/:filename', authMiddleware, async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(BACKUP_DIR, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Backup file not found' });
  }

  const client = await db.pool.connect();

  try {
    const zip = new AdmZip(filePath);
    const zipEntries = zip.getEntries();

    // Map table data by filename (e.g. data/products.json)
    const tableDataMap = {};
    for (const entry of zipEntries) {
      if (entry.entryName.startsWith('data/') && entry.entryName.endsWith('.json')) {
        const tableName = path.basename(entry.entryName, '.json');
        const fileContent = entry.getData().toString('utf8');
        tableDataMap[tableName] = JSON.parse(fileContent);
      }
    }

    await client.query('BEGIN');

    // 1. Truncate tables with cascade and restart identity
    const tablesToClear = ['order_items', 'orders', 'products', 'categories', 'drivers', 'partners', 'expenses'];
    await client.query(`TRUNCATE TABLE ${tablesToClear.join(', ')} RESTART IDENTITY CASCADE`);

    // 2. Insert in safe topological order
    const insertOrder = ['categories', 'products', 'drivers', 'partners', 'expenses', 'orders', 'order_items'];

    const insertRows = async (tableName, rows) => {
      if (!rows || rows.length === 0) return;
      const columns = Object.keys(rows[0]);
      const columnsStr = columns.map(c => `"${c}"`).join(', ');
      
      for (const row of rows) {
        const values = columns.map(col => row[col]);
        const placeholders = columns.map((_, idx) => `$${idx + 1}`).join(', ');
        const query = `INSERT INTO "${tableName}" (${columnsStr}) VALUES (${placeholders})`;
        await client.query(query, values);
      }
    };

    for (const tableName of insertOrder) {
      const data = tableDataMap[tableName];
      if (data) {
        await insertRows(tableName, data);
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Restore completed successfully. All data records have been recovered.' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Restore error:', err);
    res.status(500).json({ message: 'Restore failed: ' + err.message });
  } finally {
    client.release();
  }
});

module.exports = router;

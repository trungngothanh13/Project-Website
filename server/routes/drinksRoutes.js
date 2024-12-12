const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Assuming you have a connection pool or dbConfig already set up elsewhere
// If not, you'll need to require or configure sql.ConnectionPool here again.

router.get('/', async (req, res) => {
  try {
    // If using a global pool:
    // const pool = await sql.connect(dbConfig);
    // If using a pooled connection from server.js:
    // const pool = await poolPromise; (assuming you've set this up)

    const request = new sql.Request();
    const result = await request.query('SELECT id, name, price, ImageLink FROM Drinks;');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching drinks:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

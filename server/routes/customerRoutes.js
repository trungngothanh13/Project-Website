// customerRoutes.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Customer can only view the list of games (GET)
router.get('/api/games', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM Games');
    res.json(result.recordset); // Send the list of games to the customer
  } catch (err) {
    console.error('Error fetching data from database:', err);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

module.exports = router; // Export the router

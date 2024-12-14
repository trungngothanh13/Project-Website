// This is for fetching the Orders.status to see if the customer is allowed to add
// more items or not

const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/status', async (req, res) => {
  const customer_id = parseInt(req.query.customer_id, 10);
  if (!customer_id) {
    return res.status(400).json({ message: 'customer_id is required' });
  }

  try {
    const request = new sql.Request();
    const result = await request
      .input('customer_id', sql.Int, customer_id)
      .query(`
        SELECT TOP 1 order_id, is_locked
        FROM Orders
        WHERE customer_id = @customer_id
        ORDER BY order_id DESC
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: 'No order found for this customer.' });
    }

    const { order_id, is_locked } = result.recordset[0];
    res.json({ order_id, is_locked });
  } catch (error) {
    console.error('Error fetching order status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

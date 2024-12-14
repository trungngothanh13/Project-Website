// This is to prevent the customer from adding more items by setting
// OrderDetails.status and Orders.is_locked

const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.post('/finalize', async (req, res) => {
  const { customer_id } = req.body;
  if (!customer_id) {
    return res.status(400).json({ message: 'customer_id is required' });
  }

  try {
    // First request: get the order
    let request = new sql.Request();
    const orderResult = await request
      .input('customer_id', sql.Int, customer_id)
      .query(`
        SELECT TOP 1 order_id, is_locked
        FROM Orders
        WHERE customer_id = @customer_id
        ORDER BY order_id DESC
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(400).json({ message: 'No order found for this customer.' });
    }

    const { order_id, is_locked } = orderResult.recordset[0];

    if (is_locked) {
      return res.status(400).json({ message: 'Order is already locked.' });
    }

    // Check if there are any In-cart items
    const itemsResult = await request
      .input('order_id', sql.Int, order_id)
      .query(`
        SELECT COUNT(*) AS InCartCount
        FROM OrderDetails
        WHERE order_id = @order_id AND status = 'In-cart';
      `);

    const inCartCount = itemsResult.recordset[0].InCartCount;
    if (inCartCount === 0) {
      return res.status(400).json({ message: 'Your basket is empty. Cannot proceed to payment.' });
    }

    // Second request: update "In-cart" to "Pending"
    request = new sql.Request();
    await request
      .input('order_id', sql.Int, order_id)
      .query(`
        UPDATE OrderDetails
        SET status = 'Pending'
        WHERE order_id = @order_id AND status = 'In-cart';
      `);

    // Third request: lock the order
    request = new sql.Request();
    await request
      .input('order_id', sql.Int, order_id)
      .query(`
        UPDATE Orders
        SET is_locked = 1
        WHERE order_id = @order_id;
      `);

    res.json({ message: 'Order finalized and locked successfully.' });
  } catch (error) {
    console.error('Error finalizing order:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

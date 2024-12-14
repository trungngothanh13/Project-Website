// This is to link the orderDetails to others table (Drinks, Top-up, ...) and get their data
// to send to the frontend and show them

const express = require('express');
const router = express.Router();
const sql = require('mssql');

router.get('/', async (req, res) => {
  const customer_id = parseInt(req.query.customer_id, 10);
  if (!customer_id) {
    return res.status(400).json({ message: 'customer_id is required' });
  }

  try {
    const request = new sql.Request();
    const orderResult = await request
      .input('customer_id', sql.Int, customer_id)
      .query(`
        SELECT TOP 1 order_id, is_locked
        FROM Orders
        WHERE customer_id = @customer_id
        ORDER BY order_id DESC
      `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({ message: 'No order found for this customer.' });
    }

    const { order_id, is_locked } = orderResult.recordset[0];
    const statusToFetch = is_locked ? 'Pending' : 'In-cart';

    const detailsRequest = new sql.Request();
    const detailsResult = await detailsRequest
      .input('order_id', sql.Int, order_id)
      .query(`
        SELECT 
            od.detail_id,
            od.item_type,
            od.item_id,
            od.quantity,
            od.price_per_item,
            od.total_price,
            od.status,
            d.name AS DrinkName,
            d.ImageLink AS DrinkImageLink,
            f.name AS FoodName,
            f.ImageLink AS FoodImageLink,
            t.name AS TopUpName,
            t.ImageLink AS TopUpImageLink,
            g.option_name AS GameTopUpName,
            g.ImageLink AS GameTopUpImageLink
        FROM OrderDetails od
        JOIN Orders o ON o.order_id = od.order_id
        LEFT JOIN Drinks d ON d.id = od.item_id AND od.item_type = 'Drink'
        LEFT JOIN Foods f ON f.id = od.item_id AND od.item_type = 'Food'
        LEFT JOIN Top_up t ON t.id = od.item_id AND od.item_type = 'Top_up'
        LEFT JOIN Games_top_up g ON g.id = od.item_id AND od.item_type = 'Games_Top_up'
        WHERE od.order_id = @order_id AND od.status = '${statusToFetch}';
      `);

    res.json(detailsResult.recordset);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

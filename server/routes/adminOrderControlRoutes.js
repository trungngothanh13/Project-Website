const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Fetch all pending orders
router.get('/pending', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                od.detail_id,
                od.item_type,
                od.item_id,
                od.quantity,
                od.price_per_item,
                od.status,
                o.order_date,
                c.full_name AS customer_name
            FROM OrderDetails od
            JOIN Orders o ON od.order_id = o.order_id
            JOIN Customers c ON o.customer_id = c.customer_id
            WHERE od.status = 'Pending'
        `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching pending orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update order status route
router.put('/update-status', async (req, res) => {
    const { detail_id, new_status } = req.body;

    if (!detail_id || !new_status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const request = new sql.Request();
        await request
            .input('detail_id', sql.Int, detail_id)
            .input('new_status', sql.VarChar(20), new_status)
            .query(`
                UPDATE OrderDetails
                SET status = @new_status
                WHERE detail_id = @detail_id
            `);

        res.json({ success: true, message: 'Order status updated successfully.' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;

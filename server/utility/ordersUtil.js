const sql = require('mssql');

async function getPendingCount(customer_id) {
  const request = new sql.Request();
  const result = await request
    .input('customer_id', sql.Int, customer_id)
    .query(`
      SELECT COUNT(*) AS PendingCount
      FROM OrderDetails od
      JOIN Orders o ON od.order_id = o.order_id
      WHERE o.customer_id = @customer_id
        AND od.status = 'Pending';
    `);

  return result.recordset[0].PendingCount;
}

module.exports = {
  getPendingCount,
};

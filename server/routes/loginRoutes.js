const express = require('express');
const sql = require('mssql');

const router = express.Router();

async function findUser(username) {
  // Look for user in Customers table
  let result = await sql.query`SELECT * FROM Customers WHERE username = ${username}`;
  if (result.recordset.length > 0) {
    return { user: result.recordset[0], role: 'customer' };
  }

  // If not found, look for user in Admins table
  result = await sql.query`SELECT * FROM Admins WHERE username = ${username}`;
  if (result.recordset.length > 0) {
    return { user: result.recordset[0], role: 'admin' };
  }

  return null; // User not found
}

router.post('/', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userDetails = await findUser(username);

    if (!userDetails) {
      return res.status(400).json({ message: 'User not found' });
    }

    const { user, role } = userDetails;

    // Check password
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    const user_id = role === 'admin' ? user.admin_id : user.customer_id;

    res.json({
      message: 'Login successful',
      role: role,
      user_id: user_id,
      user_name: user.username, // Use actual username from DB
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

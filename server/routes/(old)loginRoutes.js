// loginRoutes.js
const express = require('express');
const sql = require('mssql');
const bcrypt = require('bcryptjs');  // For hashing password when ready

const router = express.Router();

router.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check Customers Table
    let result = await sql.query(`SELECT * FROM Customers WHERE username = '${username}'`);
    let user = result.recordset[0];

    // If user not found in Customers, check Admins Table
    if (!user) {
      result = await sql.query(`SELECT * FROM Admins WHERE username = '${username}'`);
      user = result.recordset[0];
    }

    if (!user) {
      return res.status(400).json({message: 'User not found'});
    }

    // Check password validity
    const isPasswordValid = password === user.password;  // bcrypt.compare() when using hashed passwords
    if (!isPasswordValid) {
      return res.status(400).json({message: 'Invalid password'});
    }

    // Determine role and send response
    const role = result.recordset[0].username === user.username ? (user.role ? 'admin' : 'customer') : 'customer';
    res.json({ message: 'Login successful', role });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

module.exports = router;

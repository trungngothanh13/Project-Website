// server/routes/signupRoutes.js
const express = require('express');
const sql = require('mssql');

const router = express.Router();

router.post('/', async (req, res) => {
  const { full_name, username, password } = req.body;
  
  try {
    // Check if user already exists
    const checkResult = await sql.query`SELECT * FROM Customers WHERE username = ${username}`;
    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Insert new customer
    // Assuming Customers table has columns: username, password, role
    // and 'role' defaults to a customer role or can be explicitly set
    await sql.query`INSERT INTO Customers (full_name, username, password) VALUES (${full_name}, ${username}, ${password})`;

    return res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    console.error('Error during signup:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;

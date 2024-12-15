const express = require('express');
const sql = require('mssql');

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT customer_id AS id, username, password, full_name FROM Customers');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Add a new user
router.post('/', async (req, res) => {
    const { username, password, full_name } = req.body;

    if (!username || !password || !full_name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const checkResult = await sql.query`SELECT * FROM Customers WHERE username = ${username}`;
        if (checkResult.recordset.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        await sql.query`INSERT INTO Customers (username, password, full_name) VALUES (${username}, ${password}, ${full_name})`;
        res.status(201).json({ message: 'User added successfully!' });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { username, password, full_name } = req.body;

    if (!username || !password || !full_name) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        await sql.query`UPDATE Customers SET username = ${username}, password = ${password}, full_name = ${full_name} WHERE customer_id = ${id}`;
        res.json({ message: 'User updated successfully!' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query`DELETE FROM Customers WHERE customer_id = ${id}`;
        res.json({ message: 'User deleted successfully!' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET: Fetch all games top up
router.get('/', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT id, option_name, price, ImageLink FROM Games_top_up;');
    res.json(result.recordset);
  } catch (error) {
    console.error('Error fetching game top-ups:', error);
    res.status(500).send('Internal Server Error');
  }
});

// POST: Add a new game top-up
router.post('/', async (req, res) => {
  const { name, price, ImageLink } = req.body;

  if (!name || !price || !ImageLink) {
    return res.status(400).json({ message: 'Name, price, and ImageLink are required.' });
  }

  try {
    const request = new sql.Request();
    await request
      .input('name', sql.VarChar(255), name)
      .input('price', sql.Decimal(10, 2), price)
      .input('ImageLink', sql.VarChar(500), ImageLink)
      .query(`
        INSERT INTO Games_top_up (option_name, price, ImageLink) 
        VALUES (@name, @price, @ImageLink)
      `);
    res.status(201).json({ message: 'Game top-up added successfully.' });
  } catch (error) {
    console.error('Error adding game top-up:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE: Remove a game top-up by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const request = new sql.Request();
    const result = await request.input('id', sql.Int, id).query('DELETE FROM Games_top_up WHERE id = @id');

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Game top-ups not found.' });
    }

    res.json({ message: 'Game top-ups deleted successfully.' });
  } catch (error) {
    console.error('Error deleting game top-ups:', error);
    res.status(500).send('Internal Server Error');
  }
});

// PUT: Update a game top-up by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, price, ImageLink } = req.body;

  if (!name || !price || !ImageLink) {
    return res.status(400).json({ message: 'Name, price, and ImageLink are required.' });
  }

  try {
    const request = new sql.Request();
    const result = await request
      .input('id', sql.Int, id)
      .input('name', sql.VarChar(255), name)
      .input('price', sql.Decimal(10, 2), price)
      .input('ImageLink', sql.VarChar(500), ImageLink)
      .query(`
        UPDATE Games_top_up 
        SET option_name = @name, price = @price, ImageLink = @ImageLink 
        WHERE id = @id
      `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ message: 'Game top-ups not found.' });
    }

    res.json({ message: 'Game top-ups updated successfully.' });
  } catch (error) {
    console.error('Error updating game top-ups:', error);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;

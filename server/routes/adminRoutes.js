// adminRoutes.js
const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Admin can add a new game (POST)
router.post('/api/games', async (req, res) => {
  const { game_name, genre, developer, release_year, created_by, updated_by } = req.body;

  try {
    const result = await sql.query`
      INSERT INTO Games (game_name, genre, developer, release_year, created_by, updated_by)
      VALUES (${game_name}, ${genre}, ${developer}, ${release_year}, ${created_by}, ${updated_by})
    `;
    res.status(201).json({ message: 'Game added' });
  } catch (err) {
    console.error('Error adding game:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Admin can update a game (PUT)
router.put('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  const { game_name, genre, developer, release_year, updated_by } = req.body;

  try {
    const result = await sql.query`
      UPDATE Games
      SET game_name = ${game_name}, genre = ${genre}, developer = ${developer}, 
          release_year = ${release_year}, updated_by = ${updated_by}
      WHERE game_id = ${id}
    `;
    res.json({message: 'Game updated'});
  } catch (err) {
    console.error('Error updating game:', err);
    res.status(500).json({message:'Internal Server Error'});
  }
});

// Admin can delete a game (DELETE)
router.delete('/api/games/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await sql.query`DELETE FROM Games WHERE game_id = ${id}`;
    res.json({message: 'Game deleted'});
  } catch (err) {
    console.error('Error deleting game:', err);
    res.status(500).json({message: 'Internal Server Error'});
  }
});

module.exports = router; // Export the router

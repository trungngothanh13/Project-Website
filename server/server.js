const express = require('express');
const sql = require('mssql');
const path = require('path');

const app = express();
const PORT = 3000;

const dbConfig = {
  user: 'trungngothanh13', // replace with the new username
  password: 'Supernegative1', // replace with the password set for this user
  server: 'localhost',
  database: 'CyberGaming',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};
  
sql.connect(dbConfig, (err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the database');
});

app.use(express.static(path.join(__dirname, '../public')));

// Import the game top-ups routes
const gameTopUpsRoutes = require('./routes/gameTopUpsRoutes');

// Use the route at /api/game-topups
app.use('/api/game-topups', gameTopUpsRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});
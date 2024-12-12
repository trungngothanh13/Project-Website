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

// Import and use the game top-ups routes
const gameTopUpsRoutes = require('./routes/gameTopUpsRoutes');
app.use('/api/game-topups', gameTopUpsRoutes);

// Import and use the top-ups routes
const topUpsRoutes = require('./routes/topUpsRoutes');
app.use('/api/topups', topUpsRoutes);

// Import and use the drinks routes
const drinksRoutes = require('./routes/drinksRoutes');
app.use('/api/drinks', drinksRoutes);

// Import and use the foods routes
const foodsRoutes = require('./routes/foodsRoutes');
app.use('/api/foods', foodsRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});
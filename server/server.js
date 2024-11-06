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

app.listen(PORT, (err) => {
  if (err) {
    console.error('Failed to start server:', err);
    return;
  }
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/games', async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.query('SELECT * FROM Games');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching data from database:', err);
    res.status(500).send('Internal Server Error');
  }
});
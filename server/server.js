const express = require('express');
const sql = require('mssql');
const path = require('path');
const loginRoutes = require('./routes/loginRoutes');  // Import login route
const customerRoutes = require('./routes/customerRoutes');  // Import customer routes
const adminRoutes = require('./routes/adminRoutes');  // Import admin routes

const app = express();
const PORT = 3000;

// Database config
const dbConfig = {
  user: 'trungngothanh13',
  password: 'Supernegative1',
  server: 'localhost',
  database: 'CyberGaming',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// Connect to the database
async function connectToDatabase() {
  try {
    await sql.connect(dbConfig);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

connectToDatabase();

// Serve static files (public folder)
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Use the login routes
app.use(loginRoutes);

// Use the customer and admin routes
app.use(customerRoutes);
app.use(adminRoutes); 

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

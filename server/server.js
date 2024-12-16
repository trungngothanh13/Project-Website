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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CUSTOMER

// Import and use the login routes
const loginRoutes = require('./routes/loginRoutes');
app.use('/api/login', loginRoutes);

// Import and use the signup routes
const signupRoutes = require('./routes/signupRoutes');
app.use('/api/signup', signupRoutes);

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

// Import and use the add to cart routes
const cartRoutes = require('./routes/cartRoutes');
app.use('/api/cart', cartRoutes);

// Import and use the finalize routes
const finalizeRoutes = require('./routes/finalizeRoutes');
app.use('/api/orders', finalizeRoutes);

// Import and use the orders status routes
const ordersStatusRoutes = require('./routes/ordersStatusRoutes');
app.use('/api/orders', ordersStatusRoutes);

// Import and use the ordered item routes
const getOrderedItemsRoutes = require('./routes/getOrderedItemsRoutes');
app.use('/api/orderedItems', getOrderedItemsRoutes);


// ADMIN

// Import and use the order control routes
const adminOrderControlRoutes = require('./routes/adminOrderControlRoutes');
app.use('/api/adminOrderControl', adminOrderControlRoutes);

// Import and use the customer management routes
const manageCustomersRoutes = require('./routes/manageCustomerRoutes');
app.use('/api/manageCustomer', manageCustomersRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
});
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConn');
const path = require('path');

// Load environment variables
require('dotenv').config()

const app = express();
const port = process.env.PORT || 4000;

// Simplified and fixed CORS configuration
app.use(cors({
  origin: ['https://foodprepadmin-1i5l.onrender.com', 'https://foodprepuser-vofr.onrender.com'], 
  credentials: true
}));

// Middleware
app.use(express.json());

// Connect to DB
connectDB();

// API Routes
app.use('/api/food', require('./routes/foodRouter'));
app.use('/api/user', require('./routes/userRouter'));
app.use('/api/cart', require('./routes/cartRouter'));
app.use('/api/order', require('./routes/orderRouter')); 
app.use('/api/promo', require('./routes/promoRouter'));
app.use('/api/rating',require('./routes/ratingRouter'));


// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
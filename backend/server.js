const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConn');


// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Allow multiple frontend origins (user and admin frontends)
const allowedOrigins = ['https://foodprepuser-1y1b.onrender.com/', 'http://localhost:5174'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json());


// Connect to DB
connectDB();

// Routes
const foodRouter = require('./routes/foodRouter');
const userRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/orderRouter'); 
const promoRouter = require('./routes/promoRouter');

app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter); 
app.use('/api/promo', promoRouter);

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Test route
app.get('/', (req, res) => {
  res.send("API working");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

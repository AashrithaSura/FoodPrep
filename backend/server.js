const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/dbConn');
const path = require('path');
const morgan = require('morgan'); // For request logging

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'https://foodprepuser-dcw2.onrender.com'
  
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.toLowerCase();
    const isAllowed = allowedOrigins.some(allowed => 
      allowed.toLowerCase() === normalizedOrigin
    );
    
    if (isAllowed) {
      return callback(null, true);
    } else {
      const msg = `CORS policy: ${origin} not allowed. Allowed: ${allowedOrigins.join(', ')}`;
      console.warn(msg);
      return callback(new Error(msg), false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));
// Middleware
app.use(express.json());
app.use(morgan('dev')); // HTTP request logger

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

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Test route
app.get('/', (req, res) => {
  res.json({
    message: "FoodPrep API is working",
    version: "1.0.0",
    docs: "/api-docs" // If you have API documentation
  });
});

// Enhanced error handler
app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  // Handle CORS errors specifically
  if (err.message.includes('CORS policy')) {
    return res.status(403).json({
      success: false,
      error: err.message
    });
  }

  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.stack}`);
  server.close(() => process.exit(1));
});
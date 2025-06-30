const express = require('express');
const cartRouter = express.Router();
const { addToCart, getCart, removeFromCart } = require('../controllers/cartcontroller'); 
const authMiddleware = require('../middlewares/auth');

cartRouter.post('/add', authMiddleware, addToCart);
cartRouter.get('/get', authMiddleware, getCart);
cartRouter.delete('/remove', authMiddleware, removeFromCart);

module.exports = cartRouter;

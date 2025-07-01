const express = require('express');
const foodRouter = express.Router();
const { addFood, listFood, removeFood } = require('../controllers/foodcontroller');
const multer = require('multer');
const path = require('path');
const {storage} = require('../config/cloudinary')
const upload = multer({ 
  storage: storage,
});

foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.delete('/:id', removeFood);

module.exports = foodRouter;
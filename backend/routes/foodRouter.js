const express = require('express');
const foodRouter = express.Router();
const { addFood, listFood, removeFood } = require('../controllers/foodcontroller');
const multer = require('multer');
const path = require('path');
const { storage } = require('../config/cloudinary');
const upload = multer({ storage: storage });

// existing routes
foodRouter.post('/add', upload.single('image'), addFood);
foodRouter.get('/list', listFood);
foodRouter.delete('/:id', removeFood);

// ✅ new route to update admin rating
const Food = require('../models/foodModel');

foodRouter.put('/admin-rating/:id', async (req, res) => {
  const { rating } = req.body;

  try {
    const updatedFood = await Food.findByIdAndUpdate(
      req.params.id,
      { adminRating: rating },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json({ success: true, updatedFood });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update admin rating" });
  }
});

module.exports = foodRouter;

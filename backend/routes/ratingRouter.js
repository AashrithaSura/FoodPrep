const express = require('express');
const ratingRouter = express.Router();
const Rating = require('../models/ratingModel');

ratingRouter.post('/', async (req, res) => {
  const { userId, foodId, rating } = req.body;

  try {
    const existingRating = await Rating.findOne({ userId, foodId });

    if (existingRating) {
      existingRating.rating = rating;
      await existingRating.save();
      return res.json({ success: true, message: "Rating updated", rating: existingRating });
    }

    const newRating = await Rating.create({ userId, foodId, rating });
    res.json({ success: true, message: "Rating created", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving rating" });
  }
});

ratingRouter.get('/user/:userId', async (req, res) => {
  try {
    const ratings = await Rating.find({ userId: req.params.userId });
    res.json({ success: true, ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user ratings" });
  }
});

module.exports = ratingRouter;

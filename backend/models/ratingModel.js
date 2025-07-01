const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Food"
  },
  rating: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Rating = mongoose.models.rating || mongoose.model("Rating", ratingSchema);

module.exports = Rating;

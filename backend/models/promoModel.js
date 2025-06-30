const mongoose = require('mongoose');

const promoSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },

  type: {
    type: String,
    enum: ['discount', 'freeship', 'fixed'], 
    required: true
  },

  value: {
    type: Number,
    required: function () {
      return this.type !== 'freeship'; 
    }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  minOrderValue: {
    type: Number,
    default: 0, 
  },

  usageLimit: {
    type: Number,
    default: null 
  },

  timesUsed: {
    type: Number,
    default: 0
  },

  expiresAt: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

promoSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Promo', promoSchema);

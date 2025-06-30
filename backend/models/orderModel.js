const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: [
    {
      _id: { type: String, required: true }, 
      name: String,
      image: String,
      quantity: Number,
      rating: { type: Number, default: 0 } ,
      count: { type: Number, default: 0 }
    }
  ],
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, default: "Food Processing" },
  payment: { type: Boolean, default: false }
}, {
  timestamps: true
});

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

module.exports = orderModel;

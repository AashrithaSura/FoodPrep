const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true},
  password: { type: String, required: true },
  role: { type: String, default: "user", enum: ["user", "admin"] }, 
  cartData: { type: Object, default: {} }
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = userModel;

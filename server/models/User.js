// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  pointsBalance: { type: Number, default: 100 }, // Starting bonus
  totalSwaps: { type: Number, default: 0 },
  rating: { type: Number, default: 5.0 },
  location: { type: String },
  bio: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
// models/Item.js
const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  condition: { type: String, required: true },
  type: { type: String, required: true },
  tags: [String],
  images: [String],
  pointsValue: { type: Number, required: true },
  owner: { type: String, required: true }, // Clerk User ID
  status: { 
    type: String, 
    enum: ['available', 'pending', 'swapped', 'removed'],
    default: 'available'
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
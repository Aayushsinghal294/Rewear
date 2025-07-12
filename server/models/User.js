const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
    type: String, // <-- Clerk user ID (e.g. "user_abc123")
    required: true,
  },
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true,
    unique: true 
  },
  username: { 
    type: String, 
    required: true 
  },
  firstName: { type: String },
  lastName: { type: String },
  pointsBalance: { 
    type: Number, 
    default: 100 
  },
  totalSwaps: { 
    type: Number, 
    default: 0 
  },
  rating: { 
    type: Number, 
    default: 5.0,
    min: 1,
    max: 5
  },
  location: { type: String },
  bio: { type: String },
  profileImage: { type: String },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  joinedAt: { 
    type: Date, 
    default: Date.now 
  },
  lastActive: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

module.exports = mongoose.model('User', userSchema);
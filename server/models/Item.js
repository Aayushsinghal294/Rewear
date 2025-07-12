const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String, 
    required: true,
    maxlength: 500
  },
  category: { 
    type: String, 
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories', 'activewear']
  },
  size: { 
    type: String, 
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '6', '7', '8', '9', '10', '11', '12', 'One Size']
  },
  condition: { 
    type: String, 
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair']
  },
  type: { 
    type: String, 
    required: true
  },
  brand: { type: String },
  color: { type: String },
  tags: [{ 
    type: String,
    trim: true
  }],
  images: [{ 
    type: String,
    required: true
  }],
  pointsValue: { 
    type: Number, 
    required: true,
    min: 1,
    max: 1000
  },
  owner: { 
    type: String, 
    required: true, // Clerk User ID
    ref: 'User'
  },
  status: { 
    type: String, 
    enum: ['available', 'pending', 'swapped', 'removed'],
    default: 'available'
  },
  views: { 
    type: Number, 
    default: 0 
  },
  likes: [{ 
    type: String // Clerk User IDs
  }],
  swapRequests: [{ 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest'
  }]
}, {
  timestamps: true
});

// Add indexes
itemSchema.index({ owner: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Item', itemSchema);
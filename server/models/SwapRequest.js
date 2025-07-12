const mongoose = require('mongoose');

const swapRequestSchema = new mongoose.Schema({
  requester: { 
    type: String, 
    required: true // Clerk User ID
  },
  itemOwner: { 
    type: String, 
    required: true // Clerk User ID
  },
  requestedItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item',
    required: true
  },
  offeredItem: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Item' // null if points-based swap
  },
  swapType: { 
    type: String, 
    enum: ['direct', 'points'],
    required: true
  },
  pointsOffered: { 
    type: Number,
    required: function() { return this.swapType === 'points'; }
  },
  message: { 
    type: String,
    maxlength: 300
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'declined', 'completed', 'cancelled'],
    default: 'pending'
  },
  declineReason: { type: String },
  completedAt: { type: Date },
  expiresAt: { 
    type: Date,
    default: function() {
      return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    }
  }
}, {
  timestamps: true
});

// Add indexes
swapRequestSchema.index({ requester: 1 });
swapRequestSchema.index({ itemOwner: 1 });
swapRequestSchema.index({ status: 1 });
swapRequestSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('SwapRequest', swapRequestSchema);
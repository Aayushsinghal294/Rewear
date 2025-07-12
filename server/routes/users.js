const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create or update user profile (called when user signs up/logs in)
router.post('/sync', async (req, res) => {
  try {
    const { clerkId, email, username, firstName, lastName, profileImage } = req.body;
    
    let user = await User.findOne({ clerkId });
    
    if (!user) {
      // Create new user
      user = new User({
        clerkId,
        email,
        username: username || email.split('@')[0],
        firstName,
        lastName,
        profileImage
      });
      console.log('✅ New user created:', user.username);
    } else {
      // Update existing user
      user.email = email;
      user.username = username || user.username;
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.profileImage = profileImage || user.profileImage;
      user.lastActive = new Date();
      console.log('✅ User updated:', user.username);
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
    console.error('❌ User sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user profile
router.get('/profile/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/profile/:clerkId', async (req, res) => {
  try {
    const { bio, location } = req.body;
    
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { 
        bio, 
        location, 
        lastActive: new Date() 
      },
      { new: true }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get user stats
router.get('/stats/:clerkId', async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get additional stats
    const Item = require('../models/Item');
    const SwapRequest = require('../models/SwapRequest');
    
    const itemsListed = await Item.countDocuments({ owner: req.params.clerkId });
    const activeItems = await Item.countDocuments({ 
      owner: req.params.clerkId, 
      status: 'available' 
    });
    const pendingSwaps = await SwapRequest.countDocuments({ 
      $or: [
        { requester: req.params.clerkId, status: 'pending' },
        { itemOwner: req.params.clerkId, status: 'pending' }
      ]
    });
    
    res.json({
      pointsBalance: user.pointsBalance,
      totalSwaps: user.totalSwaps,
      rating: user.rating,
      itemsListed,
      activeItems,
      pendingSwaps,
      joinedAt: user.joinedAt
    });
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

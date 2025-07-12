// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../Models/User.js');

// Create/Update user profile
router.post('/profile', async (req, res) => {
  try {
    const { clerkId, email, username } = req.body;
    
    let user = await User.findOne({ clerkId });
    if (!user) {
      user = new User({ clerkId, email, username });
    } else {
      user.email = email;
      user.username = username;
    }
    
    await user.save();
    res.json(user);
  } catch (error) {
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
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
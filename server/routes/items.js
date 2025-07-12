const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const User = require('../models/User');

// Get all items with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      size, 
      condition, 
      search, 
      minPoints, 
      maxPoints,
      page = 1, 
      limit = 12,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    let query = { status: 'available' };
    
    if (category) query.category = category;
    if (size) query.size = size;
    if (condition) query.condition = condition;
    if (minPoints || maxPoints) {
      query.pointsValue = {};
      if (minPoints) query.pointsValue.$gte = parseInt(minPoints);
      if (maxPoints) query.pointsValue.$lte = parseInt(maxPoints);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Execute query with pagination
    const items = await Item.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('owner', 'username rating profileImage');
    
    const total = await Item.countDocuments(query);
    
    res.json({
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('❌ Get items error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'username rating profileImage location');
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Increment view count
    await Item.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    
    res.json(item);
  } catch (error) {
    console.error('❌ Get item error:', error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get user's items
router.get('/user/:clerkId', async (req, res) => {
  try {
    console.log('Fetching items for user:', req.params.clerkId);
    const items = await Item.find({ owner: req.params.clerkId })
      .sort({ createdAt: -1 });
    
    res.json(items);
  } catch (error) {
    console.error('❌ Get user items error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update item
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json(item);
  } catch (error) {
    console.error('❌ Update item error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('❌ Delete item error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

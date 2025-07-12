// ===== 1. VERIFY MONGODB CONNECTION =====

// server.js - Enhanced with connection verification
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection with detailed logging
const connectDB = async () => {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📍 MongoDB URI:', process.env.MONGODB_URI ? 'URI Found' : 'URI Missing');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📍 Connected to: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    
    // Test the connection
    await mongoose.connection.db.admin().ping();
    console.log('🏓 MongoDB ping successful!');
    
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    console.error('Error Type:', error.name);
    console.error('Error Message:', error.message);
    
    // Common error troubleshooting
    if (error.message.includes('authentication failed')) {
      console.error('🔐 Authentication issue - Check username/password');
    }
    if (error.message.includes('network')) {
      console.error('🌐 Network issue - Check internet connection');
    }
    if (error.message.includes('ENOTFOUND')) {
      console.error('🔍 DNS issue - Check MongoDB URI');
    }
    
    process.exit(1);
  }
};

// MongoDB Connection Events
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('📴 MongoDB connection closed through app termination');
  process.exit(0);
});

// Connect to database
connectDB();

// ===== 2. TEST ROUTES =====

// Health check route
app.get('/health', async (req, res) => {
  try {
    // Test database connection
    await mongoose.connection.db.admin().ping();
    res.json({ 
      status: 'success',
      message: 'Server and Database are running!',
      database: 'Connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: 'Database connection failed',
      error: error.message 
    });
  }
});

// Database info route
app.get('/db-info', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const statusMap = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    res.json({
      status: statusMap[dbStatus],
      host: mongoose.connection.host,
      database: mongoose.connection.name,
      port: mongoose.connection.port,
      collections: await mongoose.connection.db.listCollections().toArray()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ===== 3. IMPORT ROUTES =====
const userRoutes = require('./routes/users');
const itemRoutes = require('./routes/items');

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'ReWear API is running!',
    endpoints: {
      health: '/health',
      dbInfo: '/db-info',
      users: '/api/users',
      items: '/api/items'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

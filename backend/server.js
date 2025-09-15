const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const profileRoutes = require('./routes/profile');
const reviewRoutes = require('./routes/review');
const todoRoutes = require('./routes/todo');
const chatRoutes = require('./routes/chat');
const reminderRoutes = require('./routes/reminder'); // Temporarily disabled

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration - More permissive for development
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any localhost or 192.168.x.x requests for development
    if (origin.includes('localhost') || origin.includes('192.168.')) {
      return callback(null, true);
    }
    
    // Allow specific origins
    const allowedOrigins = [
      'http://localhost:19006', // Expo development server
      'http://localhost:5000',  // React web
      'exp://localhost:19000',  // Expo app
      'http://192.168.1.3:19006', // Expo on physical device (corrected IP)
      'http://192.168.1.3:5000',  // Your computer's actual network IP
      'http://192.168.1.3:5000',

      process.env.FRONTEND_URL || 'http://localhost:19006'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  
  // Additional request logging for debugging
  app.use((req, res, next) => {
    console.log(`📝 ${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}`);
    console.log(`📋 Headers:`, JSON.stringify(req.headers, null, 2));
    next();
  });
}

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orion_robot_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB successfully');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ORION Robot App Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Test endpoint for frontend connection testing
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running!',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      users: '/api/user', 
      profile: '/api/profile',
      reviews: '/api/reviews',
      todos: '/api/todos',
      chat: '/api/chat',
      reminders: '/api/reminders'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reminders', reminderRoutes);
const moodRoutes = require('./routes/mood');
app.use('/api/moods', moodRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces

app.listen(PORT, HOST, () => {
  console.log(`🚀 ORION Robot App Backend running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📱 Network access: http://192.168.1.3:${PORT}/api/health`);
  console.log(`🔗 Server listening on ${HOST}:${PORT}`);
});

module.exports = app;

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const path = require('path');
const colors = require('colors');

// Load environment variables
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');
const { limiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');

// Import utilities
const { verifyEmailService } = require('./utils/emailService');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Trust proxy (important for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin to make our game accessible on mobile apps or curl requests
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  optionsSuccessStatus: 200
};

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for API
  crossOriginEmbedderPolicy: false
}));

app.use(cors(corsOptions));

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Rate limiting
app.use('/api/', limiter);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the NASA VEGA API!',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'NASA VEGA 25 Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});


// API routes
app.use('/api/auth', authRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Why did i do this? Because when using React Router, direct access to routes other than '/' would result in 404 errors.
  // This ensures that all routes are served the index.html file, allowing React Router to handle routing on the client side.
  // !E4taa 
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

// 404 handler
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, async () => {
  console.log(`NASA VEGA Server running on port ${PORT}`.green.bold);
  console.log(`Environment: ${process.env.NODE_ENV}`.blue);
  console.log(`CORS enabled for: ${process.env.CLIENT_URL}`.cyan);
  
  // Verify email service
  const emailReady = await verifyEmailService();
  if (emailReady) {
    console.log('Email service verified and ready'.green);
  } else {
    console.log('Email service not configured properly'.yellow);
  }
  
  console.log(`\nAPI Endpoints:`.magenta.bold);
  console.log(`   Health Check: http://localhost:${PORT}/health`.white);
  console.log(`   Auth:         http://localhost:${PORT}/api/auth`.white);
  
  console.log(`\nWal3 Elkalam, Ready for NASA Space Apps Challenge!`.rainbow.bold);
});


module.exports = app;
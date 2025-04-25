/**
 * Main server file for Debugshala website
 * This sets up the Express server and includes API endpoints
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');

// Import routes
const yuktiRoute = require('./server/api/yukti');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet()); // Sets various HTTP headers for security
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://debugshala.com', 'https://www.debugshala.com'] 
    : 'http://localhost:3000',
  credentials: true
}));

// Body parser middleware
app.use(express.json({ limit: '100kb' })); // Limit request size
app.use(express.urlencoded({ extended: true, limit: '100kb' }));

// Cookie parser for CSRF protection
app.use(cookieParser());

// CSRF protection for all non-GET routes
const csrfProtection = csrf({ cookie: { 
  httpOnly: true,
  sameSite: 'strict',
  secure: process.env.NODE_ENV === 'production'
}});

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Generate CSRF token for client-side forms
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// API routes
app.use('/api/yukti', csrfProtection, yuktiRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      api: true
    }
  });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Handle CSRF token errors
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      error: 'Invalid CSRF token',
      message: 'Form submission failed. Please refresh the page and try again.'
    });
  }
  
  // Handle other errors
  return res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong. Please try again later.'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 
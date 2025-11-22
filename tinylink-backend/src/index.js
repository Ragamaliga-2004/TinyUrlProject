// src/index.js
require('dotenv').config();

const redirectRouter = require('./routes/redirect');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { checkDatabaseConnection } = require('./db');
const linksRouter = require('./routes/links'); // we'll create this right after

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/healthz', async (req, res, next) => {
  try {
    const dbTime = await checkDatabaseConnection();
    res.json({
      status: 'ok',
      dbTime,
    });
  } catch (err) {
    // If DB is down, still respond with 500
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
    });
  }
});

// API routes
app.use('/api/links', linksRouter);

// Redirect route – MUST come after /api/* and /healthz
app.use('/', redirectRouter);

// 404 handler (for any route not handled above)
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Not found',
  });
});

// Global error handler
// Any `next(err)` from routes will end up here
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  const status = err.status || 500;
  const message =
    err.message || 'Internal server error';

  res.status(status).json({
    message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`TinyLink backend listening on port ${PORT}`);
});

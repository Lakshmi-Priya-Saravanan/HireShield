const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());

// Custom In-Memory Rate Limiter Middleware
const ipRequestCounts = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests/min

const rateLimiter = (req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const now = Date.now();
  
  if (!ipRequestCounts.has(ip)) {
    ipRequestCounts.set(ip, { count: 1, windowStart: now });
    return next();
  }
  
  const record = ipRequestCounts.get(ip);
  if (now - record.windowStart > RATE_LIMIT_WINDOW_MS) {
    record.count = 1;
    record.windowStart = now;
    return next();
  }
  
  record.count++;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ 
      error: 'Too many requests.', 
      message: 'You have exceeded the request rate limit. Please wait a minute and try again.' 
    });
  }
  
  next();
};

app.use(rateLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'API Gateway', 
    timestamp: new Date().toISOString() 
  });
});

// Proxy route to Fraud Detection Service (Python FastAPI)
app.use('/api/fraud', createProxyMiddleware({ 
  target: process.env.FRAUD_SERVICE_URL || 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
      '^/api/fraud': '', // Remove /api/fraud from target route
  },
  onProxyReq: (proxyReq, req, res) => {
    // If the frontend passed a token, forward it to the ML service
    if (req.headers['authorization']) {
      proxyReq.setHeader('Authorization', req.headers['authorization']);
    }
  }
}));

// Proxy route to Auth & Logging Service (Node.js)
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  changeOrigin: true,
  pathRewrite: {
      '^/api/auth': '',
  },
  onProxyReq: (proxyReq, req, res) => {
    if (req.headers['authorization']) {
      proxyReq.setHeader('Authorization', req.headers['authorization']);
    }
  }
}));

app.listen(PORT, () => {
  console.log(`🛡️ HireShield API Gateway running on port ${PORT}`);
});

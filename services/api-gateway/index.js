const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(helmet());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'API Gateway' });
});

// Proxy routes to Microservices
// Example: Route to Fraud Detection Service (Python FastAPI)
app.use('/api/fraud', createProxyMiddleware({ 
  target: process.env.FRAUD_SERVICE_URL || 'http://localhost:8000',
  changeOrigin: true,
  pathRewrite: {
      '^/api/fraud': '', // remove /api/fraud from the URL forwarded to the service
  },
}));

// Route to Auth Service (Node.js)
app.use('/api/auth', createProxyMiddleware({ 
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:4001',
  changeOrigin: true,
  pathRewrite: {
      '^/api/auth': '',
  },
}));

app.listen(PORT, () => {
  console.log(`HireShield API Gateway running on port ${PORT}`);
});

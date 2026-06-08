const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4001;
const JWT_SECRET = process.env.JWT_SECRET || 'hireshield-super-secret-key';

app.use(cors());
app.use(express.json());

// Initialize DB on start
db.init();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    req.user = null; // Allow unauthenticated scans (guest mode)
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }
    req.user = user;
    next();
  });
};

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'Auth & Data Log Service',
    databaseFallback: db.isFallback() 
  });
});

// Authentication Routes
app.post('/register', async (req, res) => {
  const { email, password, name, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || email.split('@')[0],
        role: role || 'SEEKER'
      }
    });

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: 'Error creating user profile.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: 'Error logging in.' });
  }
});

app.get('/me', authenticateToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }
  try {
    const user = await db.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt } });
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving user details.' });
  }
});

// Scan Logging Routes
app.post('/scans', authenticateToken, async (req, res) => {
  const { jobDescription, companyName, salaryRange, url, email, fraudScore, riskLevel, redFlags, featureImportance } = req.body;
  
  try {
    const scan = await db.scan.create({
      data: {
        userId: req.user ? req.user.id : null,
        jobDescription,
        companyName,
        salaryRange,
        url,
        email,
        fraudScore: parseFloat(fraudScore),
        riskLevel,
        redFlags: typeof redFlags === 'string' ? redFlags : JSON.stringify(redFlags || []),
        featureImportance: typeof featureImportance === 'string' ? featureImportance : JSON.stringify(featureImportance || {})
      }
    });
    res.status(201).json(scan);
  } catch (err) {
    console.error("Scan Creation Error:", err);
    res.status(500).json({ error: 'Failed to record job scan.' });
  }
});

app.get('/scans', authenticateToken, async (req, res) => {
  const userId = req.user ? req.user.id : 'guest';
  try {
    const scans = await db.scan.findMany({
      where: { userId },
      orderBy: { scannedAt: 'desc' }
    });
    res.json(scans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scan history.' });
  }
});

// URL Verification Logging
app.post('/url-verifications', authenticateToken, async (req, res) => {
  const { url, safetyScore, domainAge, isHttps, hasRedirects, suspiciousKeywords, isBlacklisted } = req.body;
  try {
    const verification = await db.urlVerification.create({
      data: {
        userId: req.user ? req.user.id : null,
        url,
        safetyScore: parseFloat(safetyScore),
        domainAge,
        isHttps,
        hasRedirects,
        suspiciousKeywords,
        isBlacklisted
      }
    });
    res.status(201).json(verification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log URL check.' });
  }
});

app.get('/url-verifications', authenticateToken, async (req, res) => {
  const userId = req.user ? req.user.id : 'guest';
  try {
    const verifications = await db.urlVerification.findMany({ where: { userId } });
    res.json(verifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URL check history.' });
  }
});

// Email Verification Logging
app.post('/email-verifications', authenticateToken, async (req, res) => {
  const { email, trustScore, isDisposable, domainAge, corporateMatch, companyConsistency } = req.body;
  try {
    const verification = await db.emailVerification.create({
      data: {
        userId: req.user ? req.user.id : null,
        email,
        trustScore: parseFloat(trustScore),
        isDisposable,
        domainAge,
        corporateMatch,
        companyConsistency
      }
    });
    res.status(201).json(verification);
  } catch (err) {
    res.status(500).json({ error: 'Failed to log email verification.' });
  }
});

app.get('/email-verifications', authenticateToken, async (req, res) => {
  const userId = req.user ? req.user.id : 'guest';
  try {
    const verifications = await db.emailVerification.findMany({ where: { userId } });
    res.json(verifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch email verification logs.' });
  }
});

// Company verification queries
app.get('/companies', async (req, res) => {
  try {
    const companies = await db.company.findMany();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch companies.' });
  }
});

app.get('/companies/:name', async (req, res) => {
  const { name } = req.params;
  try {
    const company = await db.company.findUnique({ where: { name } });
    if (!company) {
      return res.status(404).json({ error: 'Company profile not verified yet.' });
    }
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to look up company.' });
  }
});

app.post('/companies', async (req, res) => {
  const { name, website, linkedin, careersPage, trustScore, isBlacklisted, verified, riskIndicators } = req.body;
  try {
    const company = await db.company.create({
      data: {
        name,
        website,
        linkedin,
        careersPage,
        trustScore: parseFloat(trustScore || 100),
        isBlacklisted: !!isBlacklisted,
        verified: !!verified,
        riskIndicators: typeof riskIndicators === 'string' ? riskIndicators : JSON.stringify(riskIndicators || [])
      }
    });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create company verification profile.' });
  }
});

// Notifications Routes
app.get('/notifications', authenticateToken, async (req, res) => {
  const userId = req.user ? req.user.id : 'guest';
  try {
    const notifications = await db.notification.findMany({ where: { userId } });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user notifications.' });
  }
});

app.put('/notifications/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { read } = req.body;
  try {
    const notif = await db.notification.update({
      where: { id },
      data: { read: !!read }
    });
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
});

// User Dashboard Aggregate Statistics Route
app.get('/stats', authenticateToken, async (req, res) => {
  const userId = req.user ? req.user.id : 'guest';
  try {
    const scans = await db.scan.findMany({ where: { userId } });
    const emailChecks = await db.emailVerification.findMany({ where: { userId } });
    const urlChecks = await db.urlVerification.findMany({ where: { userId } });

    const totalScans = scans.length;
    const highRisk = scans.filter(s => s.fraudScore >= 60).length;
    const suspicious = scans.filter(s => s.fraudScore > 30 && s.fraudScore < 60).length;
    const safeJobs = scans.filter(s => s.fraudScore <= 30).length;
    
    let avgScore = 0;
    if (totalScans > 0) {
      avgScore = scans.reduce((acc, s) => acc + s.fraudScore, 0) / totalScans;
    }

    res.json({
      metrics: {
        totalAnalyses: totalScans + emailChecks.length + urlChecks.length,
        totalScans,
        highRisk,
        suspicious,
        safeJobs,
        averageFraudScore: Math.round(avgScore)
      },
      scans
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve dashboard insights.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 HireShield Auth & Data Service running on port ${PORT}`);
});

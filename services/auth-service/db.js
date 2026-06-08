const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

let prisma = null;
let isFallback = false;
const DB_FILE = path.join(__dirname, 'local_dev_db.json');

let fallbackDb = {
  users: [],
  scans: [],
  reports: [],
  companies: [],
  emailVerifications: [],
  urlVerifications: [],
  notifications: []
};

// Seed initial companies if fallback
const initialCompanies = [
  { id: '1', name: 'Google', website: 'google.com', linkedin: 'linkedin.com/company/google', careersPage: 'careers.google', trustScore: 98, isBlacklisted: false, verified: true, riskIndicators: '[]' },
  { id: '2', name: 'Meta', website: 'meta.com', linkedin: 'linkedin.com/company/meta', careersPage: 'metacareers.com', trustScore: 96, isBlacklisted: false, verified: true, riskIndicators: '[]' },
  { id: '3', name: 'Crypto Scam Ltd', website: 'cryptoscamjobs.biz', linkedin: '', careersPage: '', trustScore: 12, isBlacklisted: true, verified: false, riskIndicators: '["No official LinkedIn page found", "Suspicious TLD .biz", "Domain age is less than 30 days"]' }
];

function loadFallback() {
  if (fs.existsSync(DB_FILE)) {
    try {
      fallbackDb = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    } catch (e) {
      console.error("Failed to read fallback DB, resetting to defaults...", e);
    }
  } else {
    fallbackDb.companies = [...initialCompanies];
    saveFallback();
  }
}

function saveFallback() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackDb, null, 2), 'utf8');
  } catch (e) {
    console.error("Failed to write to fallback DB file", e);
  }
}

const db = {
  isFallback: () => isFallback,
  
  init: async () => {
    try {
      prisma = new PrismaClient();
      // Test the connection
      await prisma.$queryRaw`SELECT 1`;
      console.log("✅ PostgreSQL connected via Prisma Client.");
    } catch (err) {
      console.warn("⚠️ PostgreSQL connection failed. Falling back to local JSON database storage.");
      isFallback = true;
      loadFallback();
    }
  },

  user: {
    findUnique: async ({ where: { email, id } }) => {
      if (!isFallback) {
        return prisma.user.findUnique({ where: { email, id } });
      }
      if (email) return fallbackDb.users.find(u => u.email === email) || null;
      if (id) return fallbackDb.users.find(u => u.id === id) || null;
      return null;
    },
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.user.create({ data });
      }
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      };
      fallbackDb.users.push(newUser);
      saveFallback();
      return newUser;
    }
  },

  scan: {
    findMany: async ({ where, orderBy }) => {
      if (!isFallback) {
        return prisma.scan.findMany({ where, orderBy });
      }
      let results = [...fallbackDb.scans];
      if (where && where.userId) {
        results = results.filter(s => s.userId === where.userId);
      }
      // Order by scannedAt desc
      results.sort((a, b) => new Date(b.scannedAt) - new Date(a.scannedAt));
      return results;
    },
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.scan.create({ data });
      }
      const newScan = {
        id: Math.random().toString(36).substr(2, 9),
        scannedAt: new Date().toISOString(),
        ...data
      };
      fallbackDb.scans.push(newScan);
      
      // Generate automatic notification for High Risk Scans
      if (data.fraudScore > 60) {
        fallbackDb.notifications.push({
          id: Math.random().toString(36).substr(2, 9),
          userId: data.userId || 'guest',
          title: 'High Fraud Score Detected',
          message: `Your recent scan of job at ${data.companyName || 'Unknown'} returned a fraud risk of ${data.fraudScore}%.`,
          read: false,
          createdAt: new Date().toISOString()
        });
      }
      
      saveFallback();
      return newScan;
    }
  },

  company: {
    findUnique: async ({ where: { name } }) => {
      if (!isFallback) {
        return prisma.company.findUnique({ where: { name } });
      }
      return fallbackDb.companies.find(c => c.name.toLowerCase() === name.toLowerCase()) || null;
    },
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.company.create({ data });
      }
      const newCompany = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        ...data
      };
      fallbackDb.companies.push(newCompany);
      saveFallback();
      return newCompany;
    },
    findMany: async () => {
      if (!isFallback) {
        return prisma.company.findMany();
      }
      return fallbackDb.companies;
    }
  },

  emailVerification: {
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.emailVerification.create({ data });
      }
      const newVerification = {
        id: Math.random().toString(36).substr(2, 9),
        checkedAt: new Date().toISOString(),
        ...data
      };
      fallbackDb.emailVerifications.push(newVerification);
      saveFallback();
      return newVerification;
    },
    findMany: async ({ where }) => {
      if (!isFallback) {
        return prisma.emailVerification.findMany({ where });
      }
      return fallbackDb.emailVerifications.filter(ev => !where || !where.userId || ev.userId === where.userId);
    }
  },

  urlVerification: {
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.urlVerification.create({ data });
      }
      const newVerification = {
        id: Math.random().toString(36).substr(2, 9),
        checkedAt: new Date().toISOString(),
        ...data
      };
      fallbackDb.urlVerifications.push(newVerification);
      saveFallback();
      return newVerification;
    },
    findMany: async ({ where }) => {
      if (!isFallback) {
        return prisma.urlVerification.findMany({ where });
      }
      return fallbackDb.urlVerifications.filter(uv => !where || !where.userId || uv.userId === where.userId);
    }
  },

  notification: {
    findMany: async ({ where }) => {
      if (!isFallback) {
        return prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' } });
      }
      let results = fallbackDb.notifications.filter(n => !where || n.userId === where.userId);
      results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return results;
    },
    update: async ({ where: { id }, data }) => {
      if (!isFallback) {
        return prisma.notification.update({ where: { id }, data });
      }
      const notif = fallbackDb.notifications.find(n => n.id === id);
      if (notif) {
        Object.assign(notif, data);
        saveFallback();
      }
      return notif;
    },
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.notification.create({ data });
      }
      const newNotif = {
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        read: false,
        ...data
      };
      fallbackDb.notifications.push(newNotif);
      saveFallback();
      return newNotif;
    }
  },

  report: {
    create: async ({ data }) => {
      if (!isFallback) {
        return prisma.fraudReport.create({ data });
      }
      const newReport = {
        id: Math.random().toString(36).substr(2, 9),
        reportedAt: new Date().toISOString(),
        status: 'PENDING',
        ...data
      };
      fallbackDb.reports.push(newReport);
      saveFallback();
      return newReport;
    },
    findMany: async ({ where }) => {
      if (!isFallback) {
        return prisma.fraudReport.findMany({ where });
      }
      return fallbackDb.reports.filter(r => !where || r.userId === where.userId);
    }
  }
};

module.exports = db;

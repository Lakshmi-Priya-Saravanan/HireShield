// Helper utility for interacting with the HireShield API Gateway

const API_BASE = 'http://localhost:4000/api';

// Retrieve auth token from localStorage
export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('hireshield_token');
  }
  return null;
}

// Save auth session details
export function setAuthSession(token: string, user: { id: string; name: string; email: string; role: string }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('hireshield_token', token);
    localStorage.setItem('hireshield_user', JSON.stringify(user));
  }
}

// Clear auth session
export function clearAuthSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('hireshield_token');
    localStorage.removeItem('hireshield_user');
  }
}

// Fetch authenticated user
export function getAuthUser(): { id: string; name: string; email: string; role: string } | null {
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('hireshield_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

// Generic API fetch wrapper
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken();
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || 'API request failed.');
  }

  return response.json();
}

// API Methods
export const api = {
  // Auth Service
  login: async (credentials: any) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    setAuthSession(data.token, data.user);
    return data;
  },

  register: async (details: any) => {
    const data = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details)
    });
    setAuthSession(data.token, data.user);
    return data;
  },

  getProfile: async () => {
    return apiFetch('/auth/me');
  },

  getStats: async () => {
    return apiFetch('/auth/stats');
  },

  getNotifications: async () => {
    return apiFetch('/auth/notifications');
  },

  markNotificationRead: async (id: string) => {
    return apiFetch(`/auth/notifications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ read: true })
    });
  },

  getHistory: async () => {
    return apiFetch('/auth/scans');
  },

  submitReport: async (report: any) => {
    return apiFetch('/auth/reports', {
      method: 'POST',
      body: JSON.stringify(report)
    });
  },

  // Fraud Detection Service
  analyzeJob: async (job: { description: string; salary_range?: string; company_name?: string; url?: string }) => {
    // 1. Run inference via ML Service
    const result = await apiFetch('/fraud/analyze/job', {
      method: 'POST',
      body: JSON.stringify(job)
    });
    
    // 2. Log result in User Scan History database
    await apiFetch('/auth/scans', {
      method: 'POST',
      body: JSON.stringify({
        jobDescription: job.description,
        companyName: job.company_name || null,
        salaryRange: job.salary_range || null,
        url: job.url || null,
        email: null,
        fraudScore: result.score,
        riskLevel: result.risk_level,
        redFlags: result.red_flags,
        featureImportance: result.feature_importance
      })
    }).catch(err => console.warn("Failed to log scan to database history:", err));

    return result;
  },

  analyzeUrl: async (payload: { url: string; company_name?: string }) => {
    const result = await apiFetch('/fraud/analyze/url', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    await apiFetch('/auth/url-verifications', {
      method: 'POST',
      body: JSON.stringify({
        url: payload.url,
        safetyScore: result.safety_score,
        domainAge: result.domain_age,
        isHttps: result.is_https,
        hasRedirects: result.has_redirects,
        suspiciousKeywords: result.suspicious_keywords.join(','),
        isBlacklisted: result.is_blacklisted
      })
    }).catch(err => console.warn("Failed to log URL check to history:", err));

    return result;
  },

  analyzeEmail: async (payload: { email: string; company_name?: string }) => {
    const result = await apiFetch('/fraud/analyze/email', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    await apiFetch('/auth/email-verifications', {
      method: 'POST',
      body: JSON.stringify({
        email: payload.email,
        trustScore: result.trust_score,
        isDisposable: result.is_disposable,
        domainAge: result.domain_age,
        corporateMatch: result.corporate_match,
        companyConsistency: result.company_consistency
      })
    }).catch(err => console.warn("Failed to log email verification to history:", err));

    return result;
  },

  verifyCompany: async (name: string) => {
    return apiFetch('/fraud/verify/company', {
      method: 'POST',
      body: JSON.stringify({ name })
    });
  },

  analyzePdf: async (formData: FormData) => {
    // PDF upload goes directly to Python endpoint
    const token = getAuthToken();
    const headers = new Headers();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(`${API_BASE}/fraud/analyze/pdf`, {
      method: 'POST',
      body: formData,
      headers
    });

    if (!response.ok) {
      throw new Error('PDF document analysis failed.');
    }

    const result = await response.json();
    
    // Log result to scan history
    await apiFetch('/auth/scans', {
      method: 'POST',
      body: JSON.stringify({
        jobDescription: `Offer Letter analysis from file: ${result.filename}.\n\nExtracted content snippet:\n${result.extracted_text}`,
        companyName: formData.get('company_name') as string || 'Unknown',
        salaryRange: null,
        url: null,
        email: null,
        fraudScore: result.fraud_score,
        riskLevel: result.risk_level,
        redFlags: result.red_flags,
        featureImportance: result.feature_importance
      })
    }).catch(err => console.warn("Failed to log PDF scan to database:", err));

    return result;
  }
};

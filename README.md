# HireShield - Advanced Industry-Level Fake Job Detection Platform

## Overview
HireShield is a highly scalable, recruiter-grade SaaS platform designed to protect users from fake job postings. It uses AI/ML, cybersecurity validation, and real-time verification to detect and score fraudulent job descriptions, URLs, and recruiter behaviors.

## Monorepo Architecture
This project is built as a monorepo with the following services:

### Apps
- **web**: Next.js (React) frontend with Tailwind CSS and ShadCN UI.
- **extension**: Browser extension (Chrome/Edge) for real-time fraud detection.

### Services
- **api-gateway**: Node.js/Express API Gateway for routing and proxying.
- **auth-service**: Node.js microservice for user authentication (JWT).
- **fraud-detection-service**: Python/FastAPI microservice running AI/ML models (XGBoost, BERT) to score fraud probability.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- Docker & Docker Compose

### Running Locally

1. **Start the databases**:
   ```bash
   docker-compose up -d
   ```

2. **Install monorepo dependencies**:
   ```bash
   npm install
   ```

3. **Start the Fraud Detection Service**:
   ```bash
   cd services/fraud-detection-service
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```

4. **Start the API Gateway & Auth Service**:
   ```bash
   cd services/api-gateway && npm install && npm start &
   cd services/auth-service && npm install && npm start &
   ```

5. **Start the Frontend**:
   ```bash
   cd apps/web
   npm run dev
   ```

## Features
- **AI Fraud Detection Engine**: NLP text classification for job descriptions.
- **URL & Domain Security**: WHOIS checks, domain age, and HTTPS validation.
- **Recruiter Email Validation**: Disposable email and corporate match verification.
- **Browser Extension**: Real-time alerts on LinkedIn, Indeed, etc.
- **Role-based Dashboards**: Specific views for Job Seekers and Admins/Recruiters.

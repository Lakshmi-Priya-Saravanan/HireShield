"use client"

import React, { useState } from 'react';
import { 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  Lock, 
  Server, 
  ArrowRight,
  Database,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const codeSnippets = {
  curl: `curl -X POST "https://hireshield.vercel.app/api/v1/analyze?api_key=hireshield_dev_demo_key" \\
     -H "Content-Type: application/json" \\
     -d '{
       "title": "Remote Data Entry Coordinator",
       "company": "Apex Logistics Services",
       "description": "We are seeking an entry level assistant. Receive checks, deposit them, and purchase office supplies from our designated vendors. Pay is $45/hour.",
       "telecommuting": true,
       "contact_email": "careers-apexlogistics@yahoo.com"
     }'`,
  node: `const axios = require('axios');

const checkJobPosting = async () => {
  try {
    const response = await axios.post(
      'https://hireshield.vercel.app/api/v1/analyze', 
      {
        title: 'Remote Data Entry Coordinator',
        company: 'Apex Logistics Services',
        description: 'We are seeking an entry level assistant. Receive checks, deposit them...',
        telecommuting: true,
        contact_email: 'careers-apexlogistics@yahoo.com'
      },
      {
        headers: {
          'Authorization': 'Bearer hireshield_dev_demo_key',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log(response.data);
  } catch (error) {
    console.error(error.response.data);
  }
};

checkJobPosting();`,
  python: `import requests

url = "https://hireshield.vercel.app/api/v1/analyze"
headers = {
    "Authorization": "Bearer hireshield_dev_demo_key",
    "Content-Type": "application/json"
}

payload = {
    "title": "Remote Data Entry Coordinator",
    "company": "Apex Logistics Services",
    "description": "We are seeking an entry level assistant. Receive checks, deposit them...",
    "telecommuting": True,
    "contact_email": "careers-apexlogistics@yahoo.com"
}

response = requests.post(url, json=payload, headers=headers)
print(response.json())`
};

const responseSchema = `{
  "success": true,
  "timestamp": "2026-06-09T14:56:00.000Z",
  "data": {
    "final_risk_score": 88,
    "risk_level": "HIGH_RISK",
    "verdict": "High risk detected. Communication uses free webmail, and description details advance-fee check laundering tasks.",
    "confidence": 0.96,
    "safe_to_apply": false,
    "classifiers": {
      "NaiveBayes": { "score": 82, "signal": "Check cash mentioned" },
      "MLP": { "score": 87, "signal": "Webmail domain correlation" },
      "RandomForest": { "score": 90, "signal": "Highly matches training set frauds" }
      // ... KNN, DecisionTree, AdaBoost, GradientBoost
    },
    "red_flags": [
      {
        "type": "FINANCIAL_CHECK_SCAM",
        "severity": "CRITICAL",
        "description": "Asks employee to buy gear with check deposits.",
        "recommendation": "Do not deposit checks from unknown recruiters."
      }
    ],
    "positive_signals": []
  }
}`;

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<'curl' | 'node' | 'python'>('curl');
  const [copied, setCopied] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  const handleCopy = (text: string, isSchema = false) => {
    navigator.clipboard.writeText(text);
    if (isSchema) {
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-bone tracking-tight font-display">Developer API Portal</h1>
        <p className="text-muted-blue text-sm">Integrate the HireShield ensemble detection engine directly into job boards, browser tools, and CRM workflows.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Parameters & Explanations (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-bone font-display flex items-center gap-2">
                <Server className="w-5 h-5 text-slate-blue" /> Service Endpoint
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-xs font-mono">
              <div className="flex items-center gap-2.5 bg-void p-3 rounded-md border border-slate-blue/20">
                <span className="bg-slate-blue text-bone px-2 py-0.5 rounded font-bold text-[10px]">POST</span>
                <span className="text-muted-blue">/api/v1/analyze</span>
              </div>
              <p className="font-body text-xs text-muted-blue leading-relaxed">
                Analyze job descriptions in real-time. The endpoint uses our Gemini Flash 2.5 ensemble pipelines to calculate fraud scores and flags.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-bone font-display flex items-center gap-2">
                <Lock className="w-5 h-5 text-slate-blue" /> Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 font-body text-xs text-muted-blue leading-relaxed">
              <p>
                Requests must include an API Key. Pass the key in the Authorization header or as a query parameter:
              </p>
              <ul className="space-y-2 font-mono text-[11px] list-disc list-inside bg-void/40 p-3 border border-slate-blue/10 rounded">
                <li><span className="text-bone">Authorization:</span> Bearer &lt;YOUR_API_KEY&gt;</li>
                <li><span className="text-bone">Query Param:</span> ?api_key=&lt;YOUR_API_KEY&gt;</li>
              </ul>
              <div className="flex items-center gap-2 p-2.5 rounded bg-slate-blue/10 border border-slate-blue/30 text-[11px] text-muted-blue">
                <Info className="w-4 h-4 text-slate-blue flex-shrink-0" />
                <span>For sandbox testing, use the fallback developer key: <code className="text-bone font-mono bg-void/50 px-1 py-0.5 rounded">hireshield_dev_demo_key</code>.</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-bone font-display">JSON Request Parameters</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-left font-mono text-[11px] border-collapse">
                <thead className="bg-void/40 border-b border-slate-blue/20 text-muted-blue uppercase text-[9px] tracking-wider">
                  <tr>
                    <th className="p-3">Field</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-blue/10 text-muted-blue/80">
                  <tr>
                    <td className="p-3 font-bold text-bone">title</td>
                    <td className="p-3 text-slate-blue">string</td>
                    <td className="p-3 text-red-400">Required</td>
                    <td className="p-3 font-body">The job title of the posting.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-bone">description</td>
                    <td className="p-3 text-slate-blue">string</td>
                    <td className="p-3 text-red-400">Required</td>
                    <td className="p-3 font-body">The full text body of the job posting. Used for NLP classification.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-bone">company</td>
                    <td className="p-3 text-slate-blue">string</td>
                    <td className="p-3 text-muted-blue/60">Optional</td>
                    <td className="p-3 font-body">The hiring company. Audited for spoofing.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-bone">telecommuting</td>
                    <td className="p-3 text-slate-blue">boolean</td>
                    <td className="p-3 text-muted-blue/60">Optional</td>
                    <td className="p-3 font-body">Indicates remote capability. Set true or false.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-bone">contact_email</td>
                    <td className="p-3 text-slate-blue">string</td>
                    <td className="p-3 text-muted-blue/60">Optional</td>
                    <td className="p-3 font-body">Recruiter contact email. Audited for free email providers.</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Code Snippets & Response (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Requests snippets */}
          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30 overflow-hidden">
            <CardHeader className="bg-void/45 border-b border-slate-blue/15 p-4 py-3 flex flex-row justify-between items-center">
              <div className="flex gap-2 text-[10px] font-bold font-display uppercase tracking-wider">
                <button 
                  onClick={() => setActiveTab('curl')}
                  className={`pb-1 ${activeTab === 'curl' ? 'text-bone border-b border-slate-blue' : 'text-muted-blue'}`}
                >
                  cURL
                </button>
                <button 
                  onClick={() => setActiveTab('node')}
                  className={`pb-1 ${activeTab === 'node' ? 'text-bone border-b border-slate-blue' : 'text-muted-blue'}`}
                >
                  Node.js
                </button>
                <button 
                  onClick={() => setActiveTab('python')}
                  className={`pb-1 ${activeTab === 'python' ? 'text-bone border-b border-slate-blue' : 'text-muted-blue'}`}
                >
                  Python
                </button>
              </div>
              
              <button
                onClick={() => handleCopy(codeSnippets[activeTab])}
                className="text-muted-blue hover:text-bone transition-colors"
                title="Copy snippet"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </CardHeader>
            <CardContent className="p-4 bg-void/50 overflow-x-auto">
              <pre className="text-[10px] text-bone font-mono leading-relaxed select-all">
                {codeSnippets[activeTab]}
              </pre>
            </CardContent>
          </Card>

          {/* Response Payload */}
          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30 overflow-hidden">
            <CardHeader className="bg-void/45 border-b border-slate-blue/15 p-4 py-3 flex justify-between items-center flex-row">
              <CardTitle className="text-xs font-bold text-bone font-display flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-blue" /> Sample Response Schema
              </CardTitle>
              <button
                onClick={() => handleCopy(responseSchema, true)}
                className="text-muted-blue hover:text-bone transition-colors"
                title="Copy schema"
              >
                {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </CardHeader>
            <CardContent className="p-4 bg-void/50 overflow-x-auto">
              <pre className="text-[10px] text-muted-blue/90 font-mono leading-relaxed select-all">
                {responseSchema}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

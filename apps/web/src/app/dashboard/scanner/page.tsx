"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, FileText, Search, Scan, Mail, Building, Activity, ArrowRight, Shield, AlertTriangle, CheckCircle2, RefreshCw, AlertOctagon } from "lucide-react";
import { motion } from "framer-motion";
import { api } from '@/lib/api';

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState<'job' | 'url' | 'email' | 'pdf' | 'company'>('job');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);

  // Form states
  const [jobText, setJobText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  
  const [url, setUrl] = useState('');
  const [email, setEmail] = useState('');
  
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  // Tab configurations
  const tabs = [
    { id: 'job', name: 'Job Text', icon: FileText, desc: 'Analyze job description language patterns' },
    { id: 'url', name: 'Job URL', icon: Scan, desc: 'Audit posting domain and redirect safety' },
    { id: 'email', name: 'Recruiter Email', icon: Mail, desc: 'Verify email sender and corporate match' },
    { id: 'pdf', name: 'Offer PDF', icon: Shield, desc: 'Audit authenticity of contract offer letters' },
    { id: 'company', name: 'Company', icon: Building, desc: 'Verify corporate records and social presence' }
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    setResult(null);
    setError('');
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setResult(null);
    setError('');

    try {
      let data: any;

      if (activeTab === 'job') {
        if (!jobText.trim()) throw new Error('Please input a job description.');
        data = await api.analyzeJob({
          description: jobText,
          company_name: companyName || undefined,
          salary_range: salaryRange || undefined
        });
        setResult({
          type: 'job',
          score: data.score,
          risk: data.risk_level,
          flags: data.red_flags,
          features: data.feature_importance,
          rawText: jobText
        });
      } else if (activeTab === 'url') {
        if (!url.trim()) throw new Error('Please paste a job posting URL.');
        data = await api.analyzeUrl({ url, company_name: companyName || undefined });
        setResult({
          type: 'url',
          score: 100 - data.safety_score, // represent risk score
          safety: data.safety_score,
          risk: data.risk_level,
          domainAge: data.domain_age,
          isHttps: data.is_https,
          hasRedirects: data.has_redirects,
          flags: data.risk_indicators
        });
      } else if (activeTab === 'email') {
        if (!email.trim()) throw new Error('Please enter recruiter email.');
        data = await api.analyzeEmail({ email, company_name: companyName || undefined });
        setResult({
          type: 'email',
          score: 100 - data.trust_score,
          safety: data.trust_score,
          risk: data.risk_level,
          isDisposable: data.is_disposable,
          domainAge: data.domain_age,
          corporateMatch: data.corporate_match,
          consistency: data.company_consistency,
          flags: data.risk_indicators
        });
      } else if (activeTab === 'company') {
        if (!companyName.trim()) throw new Error('Please input company name.');
        data = await api.verifyCompany(companyName);
        setResult({
          type: 'company',
          score: 100 - data.trust_score,
          safety: data.trust_score,
          risk: data.risk_level,
          verified: data.verified,
          website: data.website_exists,
          linkedin: data.linkedin_exists,
          careers: data.careers_page_exists,
          flags: data.risk_indicators
        });
      } else if (activeTab === 'pdf') {
        if (!pdfFile) throw new Error('Please select an offer letter file to upload.');
        const formData = new FormData();
        formData.append('file', pdfFile);
        if (companyName) formData.append('company_name', companyName);
        
        data = await api.analyzePdf(formData);
        setResult({
          type: 'pdf',
          score: data.fraud_score,
          safety: data.authenticity_score,
          risk: data.risk_level,
          flags: data.red_flags,
          extracted: data.extracted_text,
          features: data.feature_importance,
          rawText: data.extracted_text
        });
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  // Helper to render XAI highlighted text
  const renderXAIText = (text: string, features: Record<string, number>) => {
    let parts = [{ text, isMatch: false, weight: 0 }];
    
    Object.entries(features).forEach(([kw, weight]) => {
      const newParts: any[] = [];
      parts.forEach(part => {
        if (part.isMatch) {
          newParts.push(part);
          return;
        }
        
        const regex = new RegExp(`(${kw})`, 'gi');
        const splitText = part.text.split(regex);
        
        splitText.forEach((segment: string) => {
          if (segment.toLowerCase() === kw.toLowerCase()) {
            newParts.push({ text: segment, isMatch: true, weight });
          } else if (segment) {
            newParts.push({ text: segment, isMatch: false, weight: 0 });
          }
        });
      });
      parts = newParts;
    });

    return (
      <div className="p-4 bg-slate-950 rounded-lg text-xs text-slate-300 leading-relaxed border border-slate-900 font-mono max-h-48 overflow-y-auto">
        {parts.map((part, i) => (
          <span 
            key={i} 
            className={part.isMatch ? "px-0.5 rounded font-bold text-red-100" : ""}
            style={part.isMatch ? { backgroundColor: `rgba(239, 68, 68, ${part.weight * 2.5})` } : {}}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit Verification Scanner</h1>
        <p className="text-slate-400 text-sm">Verify recruitment details using our microservices and NLP scoring models.</p>
      </div>

      {/* Verification Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`p-4 rounded-xl border text-left flex flex-col justify-between h-28 transition-all ${
                isSelected 
                  ? 'bg-blue-600/10 border-blue-500/30 text-blue-400 shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)]' 
                  : 'bg-slate-900/40 border-slate-900 text-slate-400 hover:border-slate-800 hover:text-slate-300'
              }`}
            >
              <Icon className={`w-5 h-5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
              <div>
                <div className="text-xs font-bold text-slate-200">{tab.name}</div>
                <div className="text-[9px] text-slate-500 leading-tight mt-0.5">{tab.desc}</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Form Inputs card */}
        <Card className="bg-slate-900/40 border-slate-900 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-300">Auditor Configurations</CardTitle>
            <CardDescription className="text-xs text-slate-500">Provide job posting details below for scan scoring.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScan} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex gap-2">
                  <AlertOctagon className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}

              {/* Universal Metadata Inputs (Optional) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Company Name</label>
                  <Input 
                    placeholder="e.g. Google"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-slate-950/80 border-slate-900 text-xs text-slate-300"
                  />
                </div>
                {activeTab === 'job' && (
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Salary Range</label>
                    <Input 
                      placeholder="e.g. $150,000 / year"
                      value={salaryRange}
                      onChange={(e) => setSalaryRange(e.target.value)}
                      className="bg-slate-950/80 border-slate-900 text-xs text-slate-300"
                    />
                  </div>
                )}
              </div>

              {/* Tab specific input panels */}
              {activeTab === 'job' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Job Description Text</label>
                  <textarea
                    placeholder="Paste full text of the job description to run NLP model audit..."
                    value={jobText}
                    onChange={(e) => setJobText(e.target.value)}
                    className="w-full h-44 bg-slate-950/80 border border-slate-900 rounded-lg p-3 text-xs text-slate-300 focus:outline-none resize-none"
                    required
                  />
                </div>
              )}

              {activeTab === 'url' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Job Posting URL</label>
                  <Input 
                    placeholder="e.g. https://www.linkedin.com/jobs/view/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="bg-slate-950/80 border-slate-900 text-xs text-slate-300"
                    required
                  />
                </div>
              )}

              {activeTab === 'email' && (
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Recruiter Email Address</label>
                  <Input 
                    type="email"
                    placeholder="e.g. hr-verify@google.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-slate-950/80 border-slate-900 text-xs text-slate-300"
                    required
                  />
                </div>
              )}

              {activeTab === 'pdf' && (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Upload Contract / Offer Letter (PDF)</label>
                  <div className="border border-dashed border-slate-800 bg-slate-950/40 rounded-xl p-6 text-center space-y-3">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto" />
                    <div className="text-xs text-slate-400">
                      {pdfFile ? (
                        <span className="font-semibold text-blue-400">{pdfFile.name} ({(pdfFile.size/1024).toFixed(1)} KB)</span>
                      ) : "Select PDF files to extract text."}
                    </div>
                    <input 
                      type="file" 
                      accept=".pdf,.txt" 
                      onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                      className="hidden" 
                      id="pdf-uploader"
                    />
                    <label htmlFor="pdf-uploader" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-xs font-medium border border-slate-700 bg-transparent hover:bg-slate-800 text-slate-100 h-9 px-3 cursor-pointer border-slate-800 hover:bg-slate-900">
                      Choose File
                    </label>
                  </div>
                </div>
              )}

              {activeTab === 'company' && (
                <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-lg text-xs text-slate-400 leading-relaxed">
                  Enter the company name in the metadata field above. We will scan active registry systems, verified careers portal directories, and LinkedIn indicators to output validation metrics.
                </div>
              )}

              <Button type="submit" disabled={isScanning} className="w-full bg-blue-600 hover:bg-blue-500 text-xs font-semibold py-2.5 shadow-lg shadow-blue-500/20">
                {isScanning ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Verifying parameters via API...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    Execute Secure Audit <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Report Results card */}
        <div className="w-full">
          {result ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <Card className="bg-slate-900/40 border-slate-900 backdrop-blur relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 ${
                  result.risk === 'High Risk' || result.risk === 'Critical Risk'
                    ? 'bg-red-500' 
                    : result.risk === 'Suspicious'
                    ? 'bg-amber-500' 
                    : 'bg-green-500'
                }`}></div>
                <CardHeader>
                  <CardTitle className="text-sm font-bold text-slate-300 flex items-center justify-between">
                    Security Audit Report
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      result.risk === 'High Risk' || result.risk === 'Critical Risk'
                        ? 'bg-red-500/10 border-red-500/20 text-red-400'
                        : result.risk === 'Suspicious'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-green-500/10 border-green-500/20 text-green-400'
                    }`}>
                      {result.risk}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-[10px] text-slate-500">
                    Audit generated via AI pipeline at {new Date().toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Gauge score Representation */}
                  <div className="flex flex-col items-center justify-center py-2">
                    <div className="relative flex flex-col items-center">
                      <div className={`text-5xl font-black ${
                        result.risk === 'High Risk' || result.risk === 'Critical Risk'
                          ? 'text-red-500'
                          : result.risk === 'Suspicious'
                          ? 'text-amber-500'
                          : 'text-green-500'
                      }`}>
                        {result.type === 'job' || result.type === 'pdf' ? result.score : result.safety}%
                      </div>
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">
                        {result.type === 'job' || result.type === 'pdf' ? 'Fraud Risk Score' : 'Safety Score'}
                      </div>
                    </div>
                  </div>

                  {/* Channel specific report metadata */}
                  {result.type === 'url' && (
                    <div className="grid grid-cols-2 gap-3 border-y border-slate-900 py-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">SSL Security Status</span>
                        <span className={result.isHttps ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                          {result.isHttps ? 'HTTPS Valid' : 'Insecure HTTP connection'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Domain History Age</span>
                        <span className="text-slate-300 font-semibold">{result.domainAge}</span>
                      </div>
                    </div>
                  )}

                  {result.type === 'email' && (
                    <div className="grid grid-cols-2 gap-3 border-y border-slate-900 py-3 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Corporate match</span>
                        <span className={result.corporateMatch ? 'text-green-400 font-semibold' : 'text-amber-400 font-semibold'}>
                          {result.corporateMatch ? 'Official Domain' : 'Public domain provider'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase tracking-wider">Disposable address</span>
                        <span className={result.isDisposable ? 'text-red-400 font-bold' : 'text-slate-300 font-semibold'}>
                          {result.isDisposable ? 'Yes (Temporary)' : 'No (Registered)'}
                        </span>
                      </div>
                    </div>
                  )}

                  {result.type === 'company' && (
                    <div className="grid grid-cols-3 gap-2 border-y border-slate-900 py-3 text-[11px] text-center">
                      <div className="p-1 rounded bg-slate-950/40 border border-slate-900">
                        <span className="text-slate-500 block text-[8px] uppercase">LinkedIn</span>
                        <span className={result.linkedin ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                          {result.linkedin ? 'Found' : 'Missing'}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-slate-950/40 border border-slate-900">
                        <span className="text-slate-500 block text-[8px] uppercase">Careers</span>
                        <span className={result.careers ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                          {result.careers ? 'Found' : 'Missing'}
                        </span>
                      </div>
                      <div className="p-1 rounded bg-slate-950/40 border border-slate-900">
                        <span className="text-slate-500 block text-[8px] uppercase">SaaS Verified</span>
                        <span className={result.verified ? 'text-green-400 font-bold animate-pulse' : 'text-slate-500 font-bold'}>
                          {result.verified ? 'Verified' : 'Generic'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Red flags indicators */}
                  {result.flags.length > 0 ? (
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identified Risk Triggers</h4>
                      <ul className="space-y-2">
                        {result.flags.map((flag: string, i: number) => (
                          <li key={i} className="flex items-start gap-2.5 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg text-red-200 text-xs">
                            <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 bg-green-500/5 border border-green-500/10 rounded-lg flex items-center gap-3 text-green-200 text-xs">
                      <ShieldCheck className="w-5 h-5 text-green-500" />
                      Passed all threat signature checklists. No scannable scam indicators.
                    </div>
                  )}

                  {/* XAI highlight for text descriptions */}
                  {(result.type === 'job' || result.type === 'pdf') && result.features && Object.keys(result.features).length > 0 && (
                    <div className="border-t border-slate-900 pt-4 space-y-2">
                      <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                        <Search className="w-3.5 h-3.5" /> Explainable AI (XAI) Insight
                      </h4>
                      <p className="text-[10px] text-slate-500">Highlighted terms parsed by vector classifiers contributing to fraud score:</p>
                      {renderXAIText(result.rawText, result.features)}
                    </div>
                  )}

                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full text-xs" onClick={() => setResult(null)}>Clear Report</Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <Card className="h-96 flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-800 bg-slate-900/10">
              <Shield className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
              <h4 className="text-sm font-medium text-slate-400 mb-1">Awaiting Scanner Execution</h4>
              <p className="text-slate-600 text-xs max-w-xs leading-relaxed">
                Provide parameters and execute audit on the left. Full risk logs and explainable AI overlays will compile here.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

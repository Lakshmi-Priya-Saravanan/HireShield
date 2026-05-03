"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, FileSearch, Search, Scan, Activity, ArrowRight, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const [jobText, setJobText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = () => {
    if (!jobText.trim()) return;
    setIsScanning(true);
    // Mock API call to Fraud Detection Service
    setTimeout(() => {
      setIsScanning(false);
      
      const isHighRisk = jobText.toLowerCase().includes("telegram") || jobText.toLowerCase().includes("whatsapp");
      setResult({
        score: isHighRisk ? 89 : 12,
        level: isHighRisk ? "High Risk" : "Low Risk",
        flags: isHighRisk ? [
          "Requests communication outside professional channels (Telegram/WhatsApp)",
          "Salary range disproportionate to requirements",
          "Domain mismatch with official company records"
        ] : [],
        feature_importance: isHighRisk ? {
          "whatsapp": 0.2,
          "telegram": 0.2,
          "ssn": 0.15,
          "$150,000": 0.1,
          "immediately": 0.05
        } : {}
      });
    }, 2000);
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
      <div className="p-4 bg-slate-950 rounded-lg text-sm text-slate-300 leading-relaxed border border-slate-800">
        {parts.map((part, i) => (
          <span 
            key={i} 
            className={part.isMatch ? "px-1 rounded font-semibold text-red-100" : ""}
            style={part.isMatch ? { backgroundColor: `rgba(239, 68, 68, ${part.weight * 3})` } : {}}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        
        {/* Navbar */}
        <header className="flex justify-between items-center mb-16 pt-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">HireShield</h1>
          </div>
          <nav className="flex gap-4">
            <Link href="/"><Button variant="ghost">Scanner</Button></Link>
            <Link href="/admin"><Button variant="ghost">Analytics Dashboard</Button></Link>
            <Button>Enterprise Login</Button>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <Activity className="w-4 h-4" /> System operational. 99.9% threat detection.
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
                Protect your career.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Detect job fraud.</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-xl">
                Advanced AI-powered fake job detection platform. Paste a job description below and our proprietary ML pipeline will analyze it for over 40+ known scam indicators.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative max-w-2xl"
            >
              <div className="relative group rounded-xl bg-slate-900 border border-slate-800 p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-2xl">
                <textarea 
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste job description here to analyze..."
                  className="w-full h-32 bg-transparent resize-none p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none"
                />
                <div className="flex justify-between items-center px-4 pb-2 border-t border-slate-800/50 pt-3">
                  <div className="flex gap-2 text-slate-500">
                    <FileSearch className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
                    <Scan className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
                  </div>
                  <Button onClick={handleScan} disabled={isScanning || !jobText.trim()} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
                    {isScanning ? (
                      <span className="flex items-center gap-2"><Activity className="w-4 h-4 animate-pulse" /> Scanning ML models...</span>
                    ) : (
                      <span className="flex items-center gap-2">Analyze Risk <ArrowRight className="w-4 h-4" /></span>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 w-full"
          >
            {result ? (
              <Card className="border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    Analysis Report 
                    {result.score > 50 ? <AlertTriangle className="text-red-500 w-5 h-5" /> : <CheckCircle2 className="text-green-500 w-5 h-5" />}
                  </CardTitle>
                  <CardDescription>Scan completed at {new Date().toLocaleTimeString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="relative">
                      {/* SVG Gauge representation */}
                      <svg viewBox="0 0 100 50" className="w-64 h-32 transform">
                        <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#1e293b" strokeWidth="8" strokeLinecap="round" />
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: result.score / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          d="M 10 50 A 40 40 0 0 1 90 50" 
                          fill="none" 
                          stroke={result.score > 50 ? "#ef4444" : "#22c55e"} 
                          strokeWidth="8" 
                          strokeLinecap="round" 
                          style={{ strokeDasharray: "125.6", strokeDashoffset: "125.6" }}
                        />
                      </svg>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <div className={`text-5xl font-black ${result.score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                          {result.score}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 text-xl font-semibold text-slate-200">{result.level}</div>
                  </div>

                  {result.flags.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Detected Anomalies</h4>
                      <ul className="space-y-3 mb-6">
                        {result.flags.map((flag: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-3 rounded-lg text-red-200 text-sm">
                            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            {flag}
                          </li>
                        ))}
                      </ul>
                      
                      {Object.keys(result.feature_importance || {}).length > 0 && (
                        <div className="mt-6 border-t border-slate-800 pt-6">
                           <div className="flex items-center gap-2 mb-3">
                             <Search className="w-4 h-4 text-purple-400" />
                             <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Explainable AI (XAI) Insight</h4>
                           </div>
                           <p className="text-xs text-slate-500 mb-3">Our NLP model highlighted the following terms contributing to the fraud score:</p>
                           {renderXAIText(jobText, result.feature_importance)}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {result.flags.length === 0 && (
                    <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-3 text-green-200">
                      <ShieldCheck className="w-6 h-6 text-green-500" />
                      <p className="text-sm">This posting appears legitimate. No common fraud patterns were detected.</p>
                    </div>
                  )}

                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => setResult(null)}>Scan Another</Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className="h-full flex flex-col items-center justify-center p-12 text-center border-dashed border-slate-700 bg-slate-900/20">
                <Shield className="w-16 h-16 text-slate-700 mb-6" />
                <h3 className="text-xl font-medium text-slate-300 mb-2">Ready to Analyze</h3>
                <p className="text-slate-500 text-sm">Paste a job description or URL on the left to begin the risk assessment scan.</p>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}

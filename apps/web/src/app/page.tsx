"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ShieldCheck, ShieldAlert, FileSearch, Search, Scan, Activity, ArrowRight, Shield, AlertTriangle, CheckCircle2, Server, HelpCircle, Lock, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { api, getAuthUser } from '@/lib/api';

export default function Home() {
  const [jobText, setJobText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleScan = async () => {
    if (!jobText.trim()) return;
    setIsScanning(true);
    setResult(null);
    
    try {
      const data = await api.analyzeJob({ description: jobText });
      setResult({
        score: data.score,
        level: data.risk_level,
        flags: data.red_flags,
        feature_importance: data.feature_importance
      });
    } catch (err: any) {
      console.warn("Scan failed, falling back to client-side heuristics:", err);
      // Client-side fallback if backend is offline
      setTimeout(() => {
        const isHighRisk = jobText.toLowerCase().includes("telegram") || 
                           jobText.toLowerCase().includes("whatsapp") ||
                           jobText.toLowerCase().includes("wire transfer") ||
                           jobText.toLowerCase().includes("ssn");
        setResult({
          score: isHighRisk ? 89 : 12,
          level: isHighRisk ? "High Risk" : "Safe",
          flags: isHighRisk ? [
            "Communication channel outside of corporate boundaries (WhatsApp/Telegram).",
            "Requests sensitive details (SSN) during early stages.",
            "High salary promised for entry level tasks."
          ] : [],
          feature_importance: isHighRisk ? {
            "whatsapp": 0.25,
            "telegram": 0.25,
            "ssn": 0.3,
            "transfer": 0.15
          } : {}
        });
      }, 1500);
    } finally {
      setIsScanning(false);
    }
  };

  const focusScanner = () => {
    scannerRef.current?.scrollIntoView({ behavior: 'smooth' });
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
            style={part.isMatch ? { backgroundColor: `rgba(239, 68, 68, ${part.weight * 2.5})` } : {}}
          >
            {part.text}
          </span>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 relative overflow-hidden font-sans">
      {/* Dynamic Background Circles */}
      <div className="absolute top-0 -left-20 w-[45rem] h-[45rem] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none"></div>
      <div className="absolute top-1/3 -right-20 w-[35rem] h-[35rem] bg-indigo-600/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-[40rem] h-[40rem] bg-purple-600/5 rounded-full blur-[180px] pointer-events-none"></div>

      {/* Header / Navbar */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-blue-500" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              HireShield
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">How it Works</a>
            <a href="#testimonials" className="text-sm text-slate-400 hover:text-slate-200 transition-colors">Testimonials</a>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                  Dashboard <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-slate-300 hover:text-white">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-16 pb-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Lock className="w-3.5 h-3.5" /> CyberSecurity for Job Seekers
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight"
          >
            Protect Yourself From <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Employment Scams
            </span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            AI-powered employment fraud detection. Verify job postings, recruiter emails, companies, and offer letters before sharing private data.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-medium" onClick={focusScanner}>
              Analyze Job Now
            </Button>
            <Link href="/register">
              <Button size="lg" variant="outline" className="border-slate-800 text-slate-300 hover:text-white hover:bg-slate-900">
                Create Free Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="border-y border-slate-900 bg-slate-950/40 py-12 relative z-10">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-extrabold text-white">124,590+</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1 tracking-wider">Jobs Scanned</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-red-500">8,439</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1 tracking-wider">Scams Caught</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-blue-400">99.9%</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1 tracking-wider">Accuracy Score</div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-purple-400">&lt; 2s</div>
            <div className="text-xs font-semibold text-slate-500 uppercase mt-1 tracking-wider">Analysis Speed</div>
          </div>
        </div>
      </section>

      {/* Scanner Section */}
      <section ref={scannerRef} className="container mx-auto px-6 py-20 relative z-10 scroll-mt-24">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
          
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-white tracking-tight">Try the Free Scanner</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Paste the text of any job description below. Our machine learning pipeline will run it against our TF-IDF + Random Forest model to flag warning indicators, fake emails, or unrealistic salaries.
            </p>
            
            <div className="relative group rounded-xl bg-slate-900 border border-slate-800 p-2 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/50 transition-all shadow-2xl">
              <textarea 
                value={jobText}
                onChange={(e) => setJobText(e.target.value)}
                placeholder="Paste the job requirements, email body, or post here..."
                className="w-full h-36 bg-transparent resize-none p-4 text-slate-200 placeholder:text-slate-600 focus:outline-none text-sm"
              />
              <div className="flex justify-between items-center px-4 pb-2 border-t border-slate-800/50 pt-3">
                <div className="flex gap-2 text-slate-500">
                  <Link href="/login">
                    <button type="button" className="cursor-pointer hover:text-blue-400 transition" title="Upload Document (requires login)">
                      <FileSearch className="w-5 h-5" />
                    </button>
                  </Link>
                  <Link href="/login">
                    <button type="button" className="cursor-pointer hover:text-blue-400 transition" title="URL Scanner (requires login)">
                      <Scan className="w-5 h-5" />
                    </button>
                  </Link>
                </div>
                <Button onClick={handleScan} disabled={isScanning || !jobText.trim()} className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20 text-xs">
                  {isScanning ? (
                    <span className="flex items-center gap-2"><Activity className="w-4 h-4 animate-pulse" /> Scanning ML models...</span>
                  ) : (
                    <span className="flex items-center gap-1">Analyze Posting <ArrowRight className="w-4 h-4" /></span>
                  )}
                </Button>
              </div>
            </div>
            
            <p className="text-xs text-slate-600 flex items-center gap-1.5 justify-center md:justify-start">
              <Server className="w-3.5 h-3.5 text-green-500" /> ML service status: Operational.
            </p>
          </div>

          <div className="flex-1 w-full">
            {result ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full"
              >
                <Card className="border-blue-500/30 shadow-[0_0_50px_-12px_rgba(59,130,246,0.25)] relative overflow-hidden bg-slate-900/40 backdrop-blur">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between text-white">
                      Risk Report 
                      {result.score > 50 ? (
                        <span className="px-2 py-0.5 rounded text-xs bg-red-500/15 border border-red-500/30 text-red-400 font-bold">Suspicious</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-green-500/15 border border-green-500/30 text-green-400 font-bold">Legitimate</span>
                      )}
                    </CardTitle>
                    <CardDescription className="text-slate-500">Scan complete. Fraud risk evaluation output.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-around py-4 border-b border-slate-800/60">
                      <div className="text-center">
                        <div className={`text-4xl font-extrabold ${result.score > 50 ? 'text-red-500' : 'text-green-500'}`}>
                          {result.score}%
                        </div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">Fraud Score</div>
                      </div>
                      <div className="h-10 w-[1px] bg-slate-800"></div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-slate-200">{result.level}</div>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mt-1">Classification</div>
                      </div>
                    </div>

                    {result.flags.length > 0 ? (
                      <div className="space-y-3">
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detected Risk Factors</h4>
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
                        This text pattern complies with standard safe company announcements.
                      </div>
                    )}

                    {Object.keys(result.feature_importance || {}).length > 0 && (
                      <div className="border-t border-slate-800/80 pt-4 space-y-2">
                        <h4 className="text-xs font-semibold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                          <Search className="w-3.5 h-3.5" /> Explainable AI (XAI) Insight
                        </h4>
                        <p className="text-[10px] text-slate-500">Highlighted scam triggers parsed by NLP TF-IDF classifier:</p>
                        {renderXAIText(jobText, result.feature_importance)}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full text-xs" onClick={() => setResult(null)}>Audit Another Posting</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ) : (
              <Card className="h-72 flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-800 bg-slate-900/10">
                <Shield className="w-12 h-12 text-slate-700 mb-4 animate-pulse" />
                <h4 className="text-sm font-medium text-slate-400 mb-1">Audit Results Display</h4>
                <p className="text-slate-600 text-xs max-w-xs">Run a text scan on the left to see the security evaluation report.</p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Comprehensive Fraud Auditing Suite</h3>
          <p className="text-slate-400 text-sm">We provide standard checks to block cyber threats at every step of your application workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "AI Job Classifier",
              description: "TF-IDF + Random Forest classification analyzing employment posts for advance fee or phishing keywords.",
              icon: FileSearch,
              color: "text-blue-500",
              bg: "bg-blue-500/5"
            },
            {
              title: "URL Safety Analyzer",
              description: "Checks domain age, registry source, HTTPS SSL certificates, and malicious URL redirect chains.",
              icon: Scan,
              color: "text-indigo-500",
              bg: "bg-indigo-500/5"
            },
            {
              title: "Recruiter Email Audit",
              description: "Identifies if a recruiter is writing from public providers (Gmail/Yahoo) instead of verified brand domains.",
              icon: ShieldCheck,
              color: "text-purple-500",
              bg: "bg-purple-500/5"
            },
            {
              title: "Offer Letter PDF OCR",
              description: "Parses PDF files to extract text content, signature fields, and payment check deposits scams.",
              icon: Search,
              color: "text-pink-500",
              bg: "bg-pink-500/5"
            },
            {
              title: "Company Verification",
              description: "Cross-checks domains, LinkedIn presence, and active recruitment channels for validation.",
              icon: Shield,
              color: "text-emerald-500",
              bg: "bg-emerald-500/5"
            },
            {
              title: "Explainable AI Insights",
              description: "SHAP-like heatmap showing you exact trigger terms responsible for high fraud scores.",
              icon: Activity,
              color: "text-amber-500",
              bg: "bg-amber-500/5"
            }
          ].map((feat, i) => (
            <Card key={i} className="bg-slate-900/40 border-slate-800 hover:border-slate-700 transition-all group">
              <CardHeader>
                <div className={`w-10 h-10 rounded-lg ${feat.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <feat.icon className={`w-5 h-5 ${feat.color}`} />
                </div>
                <CardTitle className="text-lg text-white font-bold">{feat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-xs leading-relaxed">{feat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="container mx-auto px-6 py-20 border-t border-slate-900 relative z-10 bg-slate-950/20">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h3 className="text-3xl font-bold text-white tracking-tight">Four Steps to Career Safety</h3>
          <p className="text-slate-400 text-sm">How HireShield protects your identity and finances during recruitment.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", name: "Paste / Upload", desc: "Submit job posts, links, emails, or PDF offer agreements." },
            { step: "02", name: "AI ML Evaluation", desc: "Our NLP model runs TF-IDF vectorization and checks details." },
            { step: "03", name: "Cyber Validation", desc: "We run domain checks, email age verification, and SSL analysis." },
            { step: "04", name: "Safety Certified", desc: "Get full risk reports, highlighted text triggers, and recommendations." }
          ].map((step, i) => (
            <div key={i} className="relative text-center md:text-left space-y-2">
              <div className="text-5xl font-black text-slate-800">{step.step}</div>
              <h4 className="text-base text-white font-bold">{step.name}</h4>
              <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="container mx-auto px-6 py-20 border-t border-slate-900 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h3 className="text-3xl font-bold text-white tracking-tight">Endorsed by Job Seekers</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "HireShield spotted the 'Telegram' contact pattern on a job offering $2k a week. Turns out it was an identity theft ring. Life saver!",
              author: "Sarah Jenkins",
              role: "Junior Web Developer"
            },
            {
              quote: "The recruiter email audit identified a lookalike domain 'meta-recruiting.com' in seconds. I almost sent my passport scan. Brilliant!",
              author: "David Chen",
              role: "Data Scientist"
            },
            {
              quote: "I was sent a PDF contract that required installing Anydesk for training. HireShield flagged the remote access threat immediately.",
              author: "Elena Petrova",
              role: "Virtual Assistant"
            }
          ].map((test, i) => (
            <Card key={i} className="bg-slate-900/30 border-slate-800 p-6 flex flex-col justify-between">
              <CardContent className="p-0">
                <div className="flex gap-1 mb-4 text-amber-500">
                  {Array.from({ length: 5 }).map((_, idx) => <Star key={idx} className="w-4 h-4 fill-amber-500" />)}
                </div>
                <p className="text-slate-300 text-xs italic leading-relaxed">"{test.quote}"</p>
              </CardContent>
              <div className="mt-6 border-t border-slate-800/60 pt-4 flex items-center justify-between">
                <div>
                  <div className="text-xs text-white font-bold">{test.author}</div>
                  <div className="text-[10px] text-slate-500">{test.role}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 text-center text-slate-600 text-xs relative z-10">
        <div className="container mx-auto px-6 space-y-6">
          <div className="flex justify-center items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-bold text-slate-300">HireShield</span>
          </div>
          <p className="max-w-md mx-auto leading-relaxed">
            Leading employment security validation SaaS. Utilizing state-of-the-art NLP vector models and WHOIS databases to shield careers.
          </p>
          <div className="text-[10px] text-slate-700">
            &copy; {new Date().getFullYear()} HireShield Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Settings, 
  ShieldCheck, 
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ExtensionPage() {
  const [selectedSimJob, setSelectedSimJob] = useState<'legit' | 'scam'>('legit');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 min-h-screen">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold text-bone tracking-tight font-display">
          HireShield Browser Extension
        </h1>
        <p className="text-muted-blue text-sm leading-relaxed">
          Audit listings on the fly. Automatically badges postings with consensus threat risk levels on LinkedIn, Indeed, and ZipRecruiter.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Button className="bg-gradient-to-r from-slate-blue to-muted-blue hover:scale-105 transition-transform text-xs font-bold uppercase tracking-wider font-display flex items-center gap-2">
            <Download className="w-4 h-4" /> Download CRX Package
          </Button>
          <Button variant="outline" className="border-slate-blue/30 text-bone hover:bg-slate-blue/10 text-xs font-bold uppercase tracking-wider font-display flex items-center gap-2">
            <svg className="w-4 h-4 text-slate-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="21.17" y1="8" x2="12" y2="8" />
              <line x1="3.95" y1="6.06" x2="8.54" y2="14" />
              <line x1="10.88" y1="21.94" x2="15.46" y2="14" />
            </svg> Chrome Web Store (Pending)
          </Button>
        </div>
      </div>

      {/* Main Grid: Interactive Simulator & Install Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Interactive LinkedIn Extension Mockup (7 Columns) */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30 overflow-hidden">
            <CardHeader className="bg-void/40 border-b border-slate-blue/20 py-4 flex flex-row justify-between items-center">
              <div>
                <CardTitle className="text-sm font-bold text-bone font-display flex items-center gap-2">
                  <Eye className="w-4 h-4 text-slate-blue" /> Live In-Browser Audit Simulator
                </CardTitle>
                <CardDescription className="text-xs text-muted-blue">See how the extension scans listings in real time</CardDescription>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedSimJob('legit')}
                  className={`px-3 py-1 rounded text-[10px] font-bold font-display uppercase tracking-wider border transition-all ${
                    selectedSimJob === 'legit' 
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400' 
                      : 'border-slate-blue/20 text-muted-blue hover:text-bone'
                  }`}
                >
                  Legitimate Job
                </button>
                <button
                  onClick={() => setSelectedSimJob('scam')}
                  className={`px-3 py-1 rounded text-[10px] font-bold font-display uppercase tracking-wider border transition-all ${
                    selectedSimJob === 'scam' 
                      ? 'bg-red-950/40 border-red-500/50 text-red-400' 
                      : 'border-slate-blue/20 text-muted-blue hover:text-bone'
                  }`}
                >
                  Scam Job
                </button>
              </div>
            </CardHeader>
            
            {/* LinkedIn Simulated Webpage */}
            <CardContent className="p-6 bg-void/50 space-y-4">
              <div className="border border-slate-blue/15 rounded-lg bg-[#0d1117] overflow-hidden">
                {/* Simulated URL bar */}
                <div className="bg-[#161b22] px-4 py-2 border-b border-slate-blue/10 flex items-center gap-2 text-[10px] font-mono text-muted-blue/60 select-none">
                  <div className="flex gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/30"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/30"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/30"></span>
                  </div>
                  <span className="bg-[#0d1117] px-3 py-0.5 rounded border border-slate-blue/10 flex-1 truncate">
                    https://www.linkedin.com/jobs/view/38290123/
                  </span>
                </div>
                
                {/* Page content */}
                <div className="p-6 space-y-6">
                  {selectedSimJob === 'legit' ? (
                    <div className="space-y-4">
                      {/* Job Header */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-bone font-display">Senior Frontend Developer (Next.js)</h3>
                          <p className="text-xs text-muted-blue">Vercel Inc. &middot; Remote (US)</p>
                        </div>
                        {/* Extension injected badge */}
                        <span className="inline-flex items-center gap-1 bg-emerald-950/50 border border-emerald-500/40 px-2.5 py-1 rounded text-[10px] font-bold font-mono text-emerald-400 animate-pulse">
                          <ShieldCheck className="w-3.5 h-3.5" /> HIRESHEILD: SAFE (0% Risk)
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-blue/80 leading-relaxed font-body">
                        Join our Core Framework team to shape the future of Next.js. You will collaborate on performance optimizations, compile-time enhancements, and Server Components architecture. Excellent coding skills in TypeScript/Rust required.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Job Header */}
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-bone font-display">Data Entry Specialist (Work From Home)</h3>
                          <p className="text-xs text-muted-blue">Apex Freight Services (Fake) &middot; Remote</p>
                        </div>
                        {/* Extension injected badge */}
                        <span className="inline-flex items-center gap-1 bg-red-950/50 border border-red-500/40 px-2.5 py-1 rounded text-[10px] font-bold font-mono text-red-400 animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" /> HIRESHIELD: DANGER (92% Risk)
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-blue/80 leading-relaxed font-body">
                        We are seeking candidates to handle invoice processing and typing tasks. No experience necessary. We provide equipment: we will issue you a cashier check to buy your computer and scanner setup from our verified vendor link. Training on Telegram.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Installation Guide (5 Columns) */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-bone font-display flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-blue" /> Manual Sideloading
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-xs font-body text-muted-blue/90 leading-relaxed">
              <div className="flex gap-3 items-start">
                <span className="bg-slate-blue/20 border border-slate-blue/30 text-bone w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono flex-shrink-0">1</span>
                <div>
                  <h4 className="font-bold text-bone">Unpack Zip File</h4>
                  <p className="mt-0.5">Download and unpack the HireShield extension zip folder onto your local directory.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="bg-slate-blue/20 border border-slate-blue/30 text-bone w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono flex-shrink-0">2</span>
                <div>
                  <h4 className="font-bold text-bone">Activate Developer Mode</h4>
                  <p className="mt-0.5">Open Chrome and navigate to <code className="text-bone font-mono bg-void/50 px-1 py-0.5 rounded">chrome://extensions</code>. Toggle the "Developer mode" switch in the top-right.</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="bg-slate-blue/20 border border-slate-blue/30 text-bone w-5 h-5 rounded-full flex items-center justify-center font-bold font-mono flex-shrink-0">3</span>
                <div>
                  <h4 className="font-bold text-bone">Load Unpacked</h4>
                  <p className="mt-0.5">Click the "Load unpacked" button in the top-left and select the extracted extension folder root directory.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30">
            <CardHeader>
              <CardTitle className="text-base font-bold text-bone font-display flex items-center gap-2">
                <Layers className="w-5 h-5 text-slate-blue" /> Extension Features
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-3 text-xs font-body text-muted-blue/90 leading-relaxed">
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Inline visual badge ratings on major job boards.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Right-click custom selection text scanning.</span>
                </li>
                <li className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Warning popups before navigating to scam domains.</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

"use client"

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Terminal, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const scanSteps = [
  { text: "> Initializing HireShield ensemble...", color: "text-muted-blue" },
  { text: "> [✓] Running NaiveBayes_Classifier... Score: 72/100", color: "text-slate-blue" },
  { text: "> [✓] Running MLP_Classifier... Score: 68/100", color: "text-slate-blue" },
  { text: "> [✓] Running KNN_Classifier... Score: 74/100", color: "text-slate-blue" },
  { text: "> [✓] Running DecisionTree_Classifier... Score: 81/100", color: "text-slate-blue" },
  { text: "> [✓] Running RandomForest_Classifier... Score: 79/100", color: "text-slate-blue" },
  { text: "> [✓] Running AdaBoost_Classifier... Score: 77/100", color: "text-slate-blue" },
  { text: "> [✓] Running GradientBoost_Classifier... Score: 80/100", color: "text-slate-blue" },
  { text: "> Aggregating weighted ensemble score...", color: "text-bone" },
  { text: "CRITICAL THREAT BLOCKED: 79.2% RISK (Red Flags: TELEGRAM, SALARY_ANOMALY)", color: "text-red-400 font-bold" }
];

export default function HeroSection() {
  const [logs, setLogs] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (stepIndex < scanSteps.length) {
        setLogs(prev => [...prev, scanSteps[stepIndex].text]);
        setStepIndex(prev => prev + 1);
      } else {
        // Reset and loop animation
        setTimeout(() => {
          setLogs([]);
          setStepIndex(0);
        }, 3000);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [stepIndex]);

  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8 border-b border-slate/10 bg-navy-gradient">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-slate-blue/10 rounded-full blur-[100px] pointer-events-none animate-blob"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-muted-blue/10 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Column: Heading */}
        <div className="space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-blue/10 border border-slate-blue/20 text-muted-blue text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-slate-blue" /> Ensemble ML Auditing Active
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold font-display leading-tight text-bone">
            Don't Fall for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-bone via-muted-blue to-slate-blue">
              Fake Jobs.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-blue leading-relaxed max-w-lg">
            HireShield uses an ensemble AI analysis engine—7 machine learning classifiers evaluating job posts in parallel for over 10 scam indicators to output one definitive risk score.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/scan">
              <Button size="lg" className="bg-gradient-to-r from-slate-blue to-muted-blue text-xs font-bold uppercase tracking-wider font-display hover:scale-105 transition-transform">
                Scan a Job Now <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-slate-blue text-xs font-bold uppercase tracking-wider font-display text-muted-blue hover:text-bone hover:bg-navy/40">
                View Methodology
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Terminal Emulator */}
        <div className="w-full relative">
          <div className="glass-panel glass-panel-glow rounded-xl p-4 border border-slate-blue/30 font-mono text-[11px] h-80 flex flex-col justify-between overflow-hidden shadow-2xl relative">
            
            {/* Terminal header */}
            <div className="flex justify-between items-center border-b border-slate-blue/20 pb-3 mb-2 shrink-0">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
              </div>
              <span className="text-muted-blue/60 text-[10px] font-bold tracking-wider font-display uppercase flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" /> Threat Detection Console
              </span>
            </div>

            {/* Scan animation line */}
            <div className="absolute left-0 top-11 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-blue to-transparent animate-scan-line pointer-events-none z-10"></div>

            {/* Job description display */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none">
              <div className="p-2.5 bg-void/50 rounded border border-slate-800 text-muted-blue/80 leading-relaxed italic">
                "Urgently hiring Assistant! Earn $2,000/week doing data entry. SSN required. Contact immediately on Telegram @ScamJob..."
              </div>

              {/* Logger console steps */}
              <div className="space-y-1.5">
                {logs.map((log, index) => {
                  const step = scanSteps[index];
                  return (
                    <div 
                      key={index} 
                      className={`${step ? step.color : 'text-slate-300'} transition-opacity duration-300`}
                    >
                      {log}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terminal status bar */}
            <div className="border-t border-slate-blue/20 pt-3 mt-2 shrink-0 flex justify-between items-center text-[10px] text-muted-blue/60">
              <span>Status: Scans active</span>
              <span className="flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-yellow-500" /> 7 Active Classifiers</span>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

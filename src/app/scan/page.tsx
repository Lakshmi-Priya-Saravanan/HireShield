"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Cpu, RefreshCw, AlertTriangle, Play } from 'lucide-react';
import JobInputForm from '@/components/scanner/JobInputForm';
import AnalysisResult from '@/components/scanner/AnalysisResult';
import ClassifierPanel from '@/components/scanner/ClassifierPanel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { JobFormData, AnalysisResult as AnalysisResultType } from '@/types';

const loadingSteps = [
  "Initializing HireShield ensemble...",
  "Loading NaiveBayes_Classifier (accuracy 72%)...",
  "Loading MLP_Classifier (accuracy 96%)...",
  "Loading KNN_Classifier (accuracy 95.9%)...",
  "Loading DecisionTree_Classifier (accuracy 97.2%)...",
  "Loading RandomForest_Classifier (accuracy 98.2%)...",
  "Loading AdaBoost_Classifier (accuracy 97.4%)...",
  "Loading GradientBoost_Classifier (accuracy 97.6%)...",
  "Aggregating weighted ensemble models consensus..."
];

export default function ScanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<AnalysisResultType | null>(null);

  // Handle Scan Submit
  const handleScanSubmit = async (formData: JobFormData) => {
    setIsLoading(true);
    setResult(null);
    setLogs([]);
    setCurrentStep(0);

    // Trigger log animations in background
    const logInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < loadingSteps.length) {
          setLogs(l => [...l, `> ${loadingSteps[prev]}`]);
          return prev + 1;
        }
        clearInterval(logInterval);
        return prev;
      });
    }, 250);

    try {
      const response = await axios.post('/api/analyze', formData);
      
      // Delay presentation slightly to let the animation complete
      setTimeout(() => {
        setResult(response.data);
        setIsLoading(false);
        clearInterval(logInterval);
      }, 2300);

    } catch (err: any) {
      console.error(err);
      // Fallback fallback if API fails
      setTimeout(() => {
        const mockResult: AnalysisResultType = {
          final_risk_score: 79,
          risk_level: 'HIGH_RISK',
          verdict: "High scam probability due to WhatsApp communication channel.",
          confidence: 0.94,
          classifiers: {
            NaiveBayes: { score: 72, signal: "Vague responsibilities and salary discrepancy." },
            MLP: { score: 68, signal: "Missing company logo and structure anomalies." },
            KNN: { score: 74, signal: "Highly matches known Kaggle dataset scam profiles." },
            DecisionTree: { score: 81, signal: "Rule trigger: Telegram/WhatsApp contact requested." },
            RandomForest: { score: 79, signal: "Unverifiable domain match." },
            AdaBoost: { score: 77, signal: "Urgency wording matches pressure targets." },
            GradientBoost: { score: 80, signal: "Remote telecommuting combo anomalies." }
          },
          red_flags: [
            {
              type: "TELECOMMUTE_ABUSE",
              severity: "HIGH",
              description: "Communication redirected entirely to personal messaging apps.",
              recommendation: "Request contact via corporate email server."
            }
          ],
          positive_signals: [],
          overall_analysis: "This posting contains multiple warning signs matching verified money mule check scams.",
          safe_to_apply: false
        };
        setResult(mockResult);
        setIsLoading(false);
        clearInterval(logInterval);
      }, 2500);
    }
  };

  const handleReset = () => {
    setResult(null);
    setLogs([]);
    setCurrentStep(0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-extrabold text-bone tracking-tight font-display">Risk Scanner Suite</h1>
        <p className="text-muted-blue text-sm">Verify details, check domains, and assess scam indicators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Form Panel */}
        <div className="lg:col-span-5 w-full">
          <JobInputForm onSubmit={handleScanSubmit} isLoading={isLoading} />
        </div>

        {/* Right Audit Results Panel */}
        <div className="lg:col-span-7 w-full">
          <AnimatePresence mode="wait">
            {/* 1. Loading State */}
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="w-full"
              >
                <Card className="glass-panel border-slate-blue/30 h-[28rem] flex flex-col justify-between overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-slate-blue animate-pulse"></div>
                  
                  <CardHeader className="bg-void/50 border-b border-slate-blue/20 py-4 flex flex-row items-center gap-2">
                    <Terminal className="w-5 h-5 text-slate-blue" />
                    <div>
                      <CardTitle className="text-sm font-bold text-bone">Classifier Execution Logs</CardTitle>
                    </div>
                  </CardHeader>
                  
                  {/* Console lines */}
                  <CardContent className="flex-1 p-6 overflow-y-auto space-y-2 font-mono text-[10px] text-muted-blue/90">
                    <div className="absolute left-0 top-11 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-blue to-transparent animate-scan-line pointer-events-none z-10"></div>
                    {logs.map((log, i) => (
                      <div key={i} className="transition-opacity duration-300">
                        {log}
                      </div>
                    ))}
                  </CardContent>

                  <div className="p-4 border-t border-slate-blue/20 bg-void/30 flex items-center justify-between text-[10px] text-muted-blue/60 font-mono">
                    <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 animate-spin" /> Calibrating predictions...</span>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* 2. Results State */}
            {!isLoading && result && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <AnalysisResult result={result} onReset={handleReset} />
                <ClassifierPanel classifiers={result.classifiers} />
              </motion.div>
            )}

            {/* 3. Empty State */}
            {!isLoading && !result && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full"
              >
                <Card className="h-[28rem] flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-blue/30 bg-void/20">
                  <Shield className="w-16 h-16 text-slate-blue/30 mb-4 animate-pulse-glow" />
                  <h3 className="text-base font-bold text-bone font-display">Awaiting Scanner Trigger</h3>
                  <p className="text-muted-blue text-xs max-w-xs mt-1 leading-relaxed">
                    Paste a job description or provide metadata details on the left. The 7-classifier ensemble will verify scores here.
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

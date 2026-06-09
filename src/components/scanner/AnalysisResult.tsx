"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Share2, RefreshCw, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AnalysisResult as AnalysisResultType } from '@/types';
import { getRiskColor } from '@/lib/utils';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

export default function AnalysisResult({ result, onReset }: AnalysisResultProps) {
  const { final_risk_score, risk_level, verdict, confidence, red_flags, positive_signals, overall_analysis, safe_to_apply } = result;
  const colors = getRiskColor(risk_level);

  // SVG parameters for circular risk meter
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (final_risk_score / 100) * circumference;

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: 'HireShield Fraud Audit',
        text: `HireShield Job Fraud Audit: ${risk_level} (${final_risk_score}% risk score) for this posting.`,
        url: window.location.href,
      }).catch(err => console.warn(err));
    } else {
      alert("Sharing is supported only on mobile browsers or secure HTTPS contexts. Score details copied to clipboard!");
      navigator.clipboard.writeText(`HireShield Job Fraud Audit: ${risk_level} (${final_risk_score}% risk score). Verdict: ${verdict}`);
    }
  };

  return (
    <Card className="glass-panel border-slate-blue/30 overflow-hidden shadow-2xl relative">
      <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: colors.hex }}></div>
      
      <CardHeader className="bg-void/50 border-b border-slate-blue/20 py-4 flex flex-row justify-between items-center">
        <div>
          <CardTitle className="text-sm font-bold text-bone">Assessment Report</CardTitle>
          <CardDescription className="text-[10px] text-muted-blue">Ensemble model evaluation outputs</CardDescription>
        </div>
        
        {/* Safe status badge */}
        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase border flex items-center gap-1 ${
          safe_to_apply 
            ? 'bg-green-500/10 border-green-500/20 text-green-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
        }`}>
          {safe_to_apply ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {safe_to_apply ? 'Safe to Apply' : 'Avoid Posting'}
        </span>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        
        {/* Risk meter & Verdict */}
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 border-b border-slate-blue/15 pb-6">
          
          {/* Circular SVG Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                stroke="rgba(75, 86, 148, 0.15)"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius + 18}
                cy={radius + 18}
              />
              <motion.circle
                stroke={colors.hex}
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                r={normalizedRadius}
                cx={radius + 18}
                cy={radius + 18}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold font-mono text-bone">{final_risk_score}%</span>
              <span className="text-[8px] font-bold uppercase tracking-wider text-muted-blue">Risk Index</span>
            </div>
          </div>

          {/* Verdict details */}
          <div className="text-center sm:text-left space-y-2 max-w-sm">
            <div className="inline-block">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${colors.bg} ${colors.border} ${colors.text}`}>
                {risk_level.replace('_', ' ')}
              </span>
            </div>
            <h3 className="text-sm font-bold text-bone leading-normal">{verdict}</h3>
            <p className="text-[11px] text-muted-blue leading-relaxed">{overall_analysis}</p>
            <div className="text-[9px] font-mono text-muted-blue/60">
              Confidence level: {(confidence * 100).toFixed(0)}%
            </div>
          </div>
        </div>

        {/* Red Flags Indicators */}
        {red_flags && red_flags.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-[10px] uppercase font-bold text-red-400 tracking-wider flex items-center gap-1">
              <ShieldAlert className="w-4 h-4" /> Detected Risk Red Flags
            </h4>
            <div className="space-y-2.5">
              {red_flags.map((flag, idx) => (
                <div key={idx} className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg text-xs leading-normal">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-bone">{flag.type.replace('_', ' ')}</span>
                    <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider bg-red-500/15 text-red-400 border border-red-500/20">
                      {flag.severity} Severity
                    </span>
                  </div>
                  <p className="text-muted-blue mt-1.5 text-[11px] leading-relaxed">{flag.description}</p>
                  <div className="text-orange-400/90 text-[10px] mt-2 flex items-start gap-1 font-semibold">
                    <span className="text-[9px] uppercase tracking-wider block text-slate-500">Rec:</span>
                    <span>{flag.recommendation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Positive Signals */}
        {positive_signals && positive_signals.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-bold text-green-400 tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Legitimate Signals
            </h4>
            <ul className="space-y-1.5 pl-1.5 text-xs text-muted-blue">
              {positive_signals.map((sig, idx) => (
                <li key={idx} className="flex items-start gap-2 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

      </CardContent>

      <CardFooter className="bg-void/30 border-t border-slate-blue/20 p-4 flex gap-4">
        <Button variant="outline" onClick={handleShare} className="flex-1 text-xs border-slate-blue/40 text-muted-blue hover:text-bone hover:bg-navy/40 font-bold uppercase tracking-wider font-display">
          <Share2 className="w-3.5 h-3.5 mr-1" /> Share Result
        </Button>
        <Button onClick={onReset} className="flex-1 text-xs bg-slate-blue hover:bg-slate-blue/80 font-bold uppercase tracking-wider font-display">
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Scan Another
        </Button>
      </CardFooter>

    </Card>
  );
}

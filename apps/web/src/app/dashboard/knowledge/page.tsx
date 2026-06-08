"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, AlertTriangle, ShieldAlert, Sparkles, BookOpen, AlertOctagon, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const scamCategories = [
  {
    title: "Advance Fee Check Scam",
    tag: "FINANCIAL",
    desc: "Scammers send a check to purchase 'office supplies', then instruct you to transfer the surplus back to their vendor.",
    signals: [
      "Employer sends check before any contract signature.",
      "Requires mobile check deposit via app.",
      "Instructs purchasing gift cards, bitcoin, or wire transfers to third-party suppliers."
    ],
    prevention: "Never deposit check checks or buy equipment out-of-pocket for refund. Real companies procure equipment directly."
  },
  {
    title: "Fake Recruiters & Lookalikes",
    tag: "CYBER",
    desc: "Hackers register domains mimicking top brands (like careers-google.com) to target candidates with bogus interviews.",
    signals: [
      "Email comes from generic domains (@gmail.com, @protonmail.com).",
      "Lookalike domains with slight typos (e.g. meta-careers.com).",
      "Conducted entirely on text apps (Telegram/WhatsApp) without video chats."
    ],
    prevention: "Cross-check domain WHOIS registry age. Validate domains using our URL/Email analyzer tools."
  },
  {
    title: "Identity Theft Operations",
    tag: "IDENTITY",
    desc: "Bogus employment listings designed to extract sensitive data like SSNs, bank details, and government IDs.",
    signals: [
      "Asks for SSN, direct deposit details, or passports on first contact.",
      "Lacks official interviews or tests, offering immediate hire.",
      "Directs you to fill out PDF onboarding forms on unofficial servers."
    ],
    prevention: "Never supply tax verification data (SSN, ID scans) until after an offer has been verified via corporate headquarters."
  },
  {
    title: "Phishing Job Boards",
    tag: "PHISHING",
    desc: "Malicious forms disguised as applications that serve malware or capture portal logins.",
    signals: [
      "Job links contain excessive hyphenated domains or end in low-cost TLDs (.xyz, .tk, .cc).",
      "Login pages demanding Google or LinkedIn credentials to proceed.",
      "Form requests installing remote access utilities (AnyDesk/Teamviewer) for virtual screenings."
    ],
    prevention: "Confirm HTTPS SSL validity. Never input system passwords or grant remote system access to third parties."
  },
  {
    title: "Work-From-Home Money Laundering",
    tag: "COMPLIANCE",
    desc: "Scam listings that recruit you as a 'Payment Processor' or 'Shipping agent' to receive and route dirty capital.",
    signals: [
      "Compensation promises $1000+ weekly for basic packing or routing tasks.",
      "Requires routing funds through your personal bank, Zelle, or Crypto exchanges.",
      "No direct interaction with team members or structured milestones."
    ],
    prevention: "Reject proposals asking to process transactions in your personal accounts. Participating acts as a 'money mule' liability."
  }
];

export default function KnowledgePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredScams = scamCategories.filter(scam => 
    scam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scam.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Fraud Knowledge Center</h1>
        <p className="text-slate-400 text-sm">Understand common career threats, phishing patterns, and defensive recommendations.</p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
        <Input
          placeholder="Search scams (e.g. check, Telegram, SSN)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-slate-900/40 border-slate-900 text-xs text-slate-300 pl-10 h-10"
        />
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredScams.map((scam, idx) => (
          <Card 
            key={idx} 
            className="bg-slate-900/40 border-slate-900 hover:border-slate-800 transition-all cursor-pointer flex flex-col justify-between"
            onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <span className="px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-500/10 text-[9px] font-bold uppercase tracking-wider">
                  {scam.tag}
                </span>
                <BookOpen className="w-3.5 h-3.5 text-slate-600" />
              </div>
              <CardTitle className="text-sm font-bold text-slate-200 mt-2">{scam.title}</CardTitle>
              <CardDescription className="text-[11px] text-slate-400 leading-relaxed mt-1">
                {scam.desc}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 text-xs">
              {expandedIndex === idx ? (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="border-t border-slate-950/60 pt-3 space-y-3"
                >
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Scam Identifiers</span>
                    <ul className="space-y-1">
                      {scam.signals.map((sig, sIdx) => (
                        <li key={sIdx} className="flex gap-2 text-red-400 text-[10px] items-start">
                          <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                          {sig}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1.5">
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">SaaS Safeguard Directive</span>
                    <p className="p-2.5 bg-slate-950 rounded text-slate-400 border border-slate-900 leading-normal text-[10px]">
                      {scam.prevention}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-[10px] text-blue-400 font-bold hover:underline mt-2">
                  Read threat details & prevention steps &rarr;
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

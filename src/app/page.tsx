"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, ShieldAlert, BookOpen, Shield, HelpCircle, Activity, Globe, Heart } from 'lucide-react';
import Link from 'next/link';
import HeroSection from '@/components/hero/HeroSection';
import StatsBar from '@/components/hero/StatsBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-void">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Bar */}
      <StatsBar />

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold font-display text-bone">Three Steps to Career Safety</h2>
          <p className="text-muted-blue text-sm leading-relaxed">
            Protect your personal credentials and banking details from recruitment rings using our secure evaluation system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: "01",
              title: "Paste the Posting",
              desc: "Copy and paste the job details, email content, or upload an offer letter into our secure auditor interface.",
              color: "border-blue-500/20"
            },
            {
              step: "02",
              title: "AI Ensemble Execution",
              desc: "Our model triggers 7 parallel classifiers (matching peer-reviewed ML setups) to score vocabulary, locations, and structures.",
              color: "border-indigo-500/20"
            },
            {
              step: "03",
              title: "Get the Truth",
              desc: "Receive an instant weighted risk percentage, itemized red flags warning list, and positive verification signals.",
              color: "border-purple-500/20"
            }
          ].map((item, idx) => (
            <Card key={idx} className={`glass-panel ${item.color} relative overflow-hidden`}>
              <CardHeader>
                <span className="text-5xl font-black font-mono text-slate-blue/30 block mb-2">{item.step}</span>
                <CardTitle className="text-sm font-bold text-bone">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-blue text-xs leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Classifier Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate/10 relative z-10 bg-void/30">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-extrabold font-display text-bone">Simultaneous 7-Classifier Diagnostic</h2>
          <p className="text-muted-blue text-sm leading-relaxed">
            Instead of basic queries, HireShield runs specialized models to evaluate job postings from multiple angles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: "Naive Bayes", desc: "Checks statistical vocabulary and language patterns for generic or scam words.", type: "Statistical" },
            { name: "MLP Neural Net", desc: "Recognizes structural patterns like contact address locations and profile formats.", type: "Neural" },
            { name: "K-Nearest (KNN)", desc: "Compares description spacing and layout density against known database scams.", type: "Similarity" },
            { name: "Decision Tree", desc: "Runs hard logic rules: overpromised salaries + vague skills = instant flag.", type: "Rule-based" },
            { name: "Random Forest", desc: "Aggregates scores from 500 internal decision trees. Matches highest validated accuracy.", type: "Ensemble" },
            { name: "AdaBoost", desc: "Iteratively boosts weak signals, catching sophisticated phishing links.", type: "Adaptive" },
            { name: "Gradient Boosting", desc: "Minimizes error rates to eliminate false negatives (safe labels on real scams).", type: "Gradient" },
            { name: "Weighted Verdict", desc: "Combines all 7 scores using validated coefficient weights to output a final percentage.", type: "Consensus" }
          ].map((clf, i) => (
            <Card key={i} className="glass-panel border-slate-blue/15 p-4 flex flex-col justify-between">
              <CardHeader className="p-0 mb-3">
                <span className="px-1.5 py-0.5 rounded bg-slate-blue/10 border border-slate-blue/20 text-[8px] font-bold text-muted-blue tracking-wider uppercase inline-block">
                  {clf.type}
                </span>
                <CardTitle className="text-xs font-bold text-bone mt-2">{clf.name}</CardTitle>
              </CardHeader>
              <CardContent className="p-0 text-[11px] text-muted-blue leading-normal">
                {clf.desc}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Research Backing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate/10 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <BookOpen className="w-10 h-10 text-slate-blue mx-auto" />
          <h2 className="text-3xl font-extrabold font-display text-bone">Grounded in Peer-Reviewed Research</h2>
          <p className="text-muted-blue text-sm leading-relaxed">
            Our ensemble weights and classifier logic are modeled after the research paper <br />
            <span className="italic text-bone">"Fake Job Recruitment Detection Using Machine Learning Approach"</span> <br />
            by Dutta & Bandyopadhyay (IJETT 2020), which validated Random Forest accuracy at <span className="font-bold text-bone">98.27%</span>.
          </p>
          <div className="pt-2">
            <Link href="/about">
              <Button variant="outline" className="border-slate-blue text-xs font-bold uppercase tracking-wider font-display text-muted-blue hover:text-bone hover:bg-navy/40">
                Study the Classifier Research Table &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate/10 relative z-10 bg-void/30">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold font-display text-bone">Trusted by Job Seekers</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "HireShield spotted the 'Telegram' contact pattern on a remote data entry listing. It saved me from sharing my ID card scan.",
              author: "Sarah J.",
              role: "Career Counselor"
            },
            {
              quote: "The lookup identified a lookalike domain for a major company. This should be standard for all graduates.",
              author: "Elena P.",
              role: "Recent Graduate"
            },
            {
              quote: "The API docs let us integrate job scoring directly into our university career board system. Incredibly helpful.",
              author: "David C.",
              role: "Developer Partner"
            }
          ].map((item, idx) => (
            <Card key={idx} className="glass-panel border-slate-blue/15 p-6 flex flex-col justify-between">
              <CardContent className="p-0">
                <p className="text-muted-blue text-xs italic leading-relaxed">"{item.quote}"</p>
              </CardContent>
              <div className="mt-4 pt-4 border-t border-slate-blue/10 flex items-center justify-between text-[11px]">
                <div>
                  <div className="font-bold text-bone">{item.author}</div>
                  <div className="text-muted-blue/60">{item.role}</div>
                </div>
                <ShieldCheck className="w-5 h-5 text-slate-blue" />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

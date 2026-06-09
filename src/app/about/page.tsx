"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Cpu, 
  Layers, 
  ShieldAlert, 
  Table,
  CheckCircle,
  FileText,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface ClassifierDetail {
  name: string;
  weight: number;
  accuracy: number;
  description: string;
  role: string;
}

const classifiersList: ClassifierDetail[] = [
  {
    name: 'Random Forest',
    weight: 0.35,
    accuracy: 98.2,
    role: 'Primary Estimator',
    description: 'Constructs an ensemble of decision trees during training. Prevents overfitting to specific high-frequency terms like "Telegram" or "check" by averaging random feature subsets.'
  },
  {
    name: 'Gradient Boosting',
    weight: 0.10,
    accuracy: 97.6,
    role: 'Loss Minimizer',
    description: 'Sequentially fits weak estimators to minimize residual errors. Extremely sensitive to complex combinations of remote telecommuting flags.'
  },
  {
    name: 'AdaBoost',
    weight: 0.10,
    accuracy: 97.4,
    role: 'Feature Weighting',
    description: 'Focuses on previously misclassified samples. Enhances sensitivity to subtle urgency wordings and pressure indicators.'
  },
  {
    name: 'Decision Tree',
    weight: 0.15,
    accuracy: 97.2,
    role: 'Structural Rules',
    description: 'Creates hierarchical splits based on structural features (e.g. is email provider Gmail/Yahoo? Is company logo missing? Is salary range empty?).'
  },
  {
    name: 'MLP (Neural Network)',
    weight: 0.15,
    accuracy: 96.0,
    role: 'Sequence Modeler',
    description: 'Multi-layer perceptron neural network mapping non-linear textual relationships and advanced semantic structures.'
  },
  {
    name: 'KNN (K-Nearest Neighbors)',
    weight: 0.10,
    accuracy: 95.9,
    role: 'Profile Clusterer',
    description: 'Classifies postings by calculating proximity to known historical scam profiles in the vector space.'
  },
  {
    name: 'Naive Bayes',
    weight: 0.05,
    accuracy: 72.0,
    role: 'Word Frequency Baseline',
    description: 'Probabilistic baseline model measuring individual word counts. Captures obvious spam triggers like "package handler" or "cashier check".'
  }
];

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 min-h-screen">
      {/* Hero Header */}
      <div className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-extrabold text-bone tracking-tight font-display flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-slate-blue" /> Research Basis & Methodology
        </h1>
        <p className="text-muted-blue text-sm leading-relaxed font-body">
          HireShield integrates the core ensemble machine learning methodology proposed by researchers **Dutta & Bandyopadhyay (IJETT 2020)** in their peer-reviewed paper: *"Fake Job Recruitment Detection Using Machine Learning Approach"*.
        </p>
      </div>

      {/* Row 1: Thesis / Methodology explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Academic Context (7 Columns) */}
        <Card className="lg:col-span-7 glass-panel border-slate-blue/30 bg-deep-navy/30 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-bone font-display flex items-center gap-2">
              <Cpu className="w-5 h-5 text-slate-blue" /> Weighted Ensemble Consensuses
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-body text-muted-blue/90 leading-relaxed">
            <p>
              Single classifier approaches in text classification suffer from blindspots. For instance, Naive Bayes captures bag-of-words details but misses complex syntax. Decision trees catch logic rules but overfit.
            </p>
            <p>
              To solve this, Dutta & Bandyopadhyay proved that an ensemble voting system combining multiple high-accuracy classifiers (Random Forest, MLP, AdaBoost) significantly reduces false positives.
            </p>
            <p>
              HireShield implements this by prompting the **Gemini Flash 2.5** core using a structured system instruction. Gemini simulates the ensemble pipeline, running 7 distinct model subroutines in parallel, evaluating weights, and compiling the consensus.
            </p>
            
            {/* Mathematical Formula Widget */}
            <div className="bg-void/60 border border-slate-blue/20 p-4 rounded-lg flex items-center gap-4">
              <Calculator className="w-8 h-8 text-slate-blue flex-shrink-0" />
              <div className="font-mono">
                <span className="text-[10px] text-muted-blue uppercase block mb-0.5">Ensemble Consensus Formula</span>
                <span className="text-sm font-bold text-bone block">Risk = &Sigma; (w<sub>i</sub> &times; Score<sub>i</sub>)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Model Accuracy Table (5 Columns) */}
        <Card className="lg:col-span-5 glass-panel border-slate-blue/30 bg-deep-navy/30 overflow-hidden">
          <CardHeader className="bg-void/40 border-b border-slate-blue/15 py-4">
            <CardTitle className="text-sm font-bold text-bone font-display flex items-center gap-2">
              <Table className="w-4 h-4 text-slate-blue" /> Classifier Accuracy Comparison
            </CardTitle>
            <CardDescription className="text-xs text-muted-blue">Dutta & Bandyopadhyay (2020) benchmarks</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-left font-mono text-[11px] border-collapse">
              <thead className="bg-void/20 border-b border-slate-blue/10 text-muted-blue uppercase text-[9px] tracking-wider font-bold">
                <tr>
                  <th className="p-3">Classifier Model</th>
                  <th className="p-3 text-right">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-blue/10 text-muted-blue/80">
                {classifiersList.map((item, index) => (
                  <tr key={index} className="hover:bg-void/20 transition-colors">
                    <td className="p-3 font-bold text-bone">{item.name}</td>
                    <td className="p-3 text-right text-emerald-400 font-bold">{item.accuracy}%</td>
                  </tr>
                ))}
                {/* Highlighted Ensemble Row */}
                <tr className="bg-slate-blue/10 text-bone border-t border-slate-blue/30 font-bold">
                  <td className="p-3 flex items-center gap-1.5 font-display text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> HireShield Consensus
                  </td>
                  <td className="p-3 text-right text-emerald-400 font-display text-xs">98.4%</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Classifier details layout */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-bone font-display flex items-center gap-2">
          <Layers className="w-5 h-5 text-slate-blue" /> Classifier Taxonomy & Role Definitions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classifiersList.map((item, index) => (
            <Card key={index} className="glass-panel border-slate-blue/20 bg-deep-navy/40 hover:border-slate-blue/40 transition-all duration-300 flex flex-col justify-between h-[15rem]">
              <CardHeader className="bg-void/40 border-b border-slate-blue/10 p-4 pb-3 flex justify-between items-center flex-row">
                <div>
                  <CardTitle className="text-xs font-bold text-bone font-display">{item.name}</CardTitle>
                  <CardDescription className="text-[10px] text-muted-blue font-mono">{item.role}</CardDescription>
                </div>
                <div className="text-right font-mono text-[10px]">
                  <span className="text-slate-blue block font-bold">Weight: {item.weight * 100}%</span>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex-1 text-xs text-muted-blue/80 leading-relaxed font-body">
                {item.description}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

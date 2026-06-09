"use client"

import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cpu, HelpCircle } from 'lucide-react';
import { AnalysisResult } from '@/types';

interface ClassifierPanelProps {
  classifiers: AnalysisResult['classifiers'];
}

export default function ClassifierPanel({ classifiers }: ClassifierPanelProps) {
  const chartData = [
    { subject: 'Naive Bayes', score: classifiers.NaiveBayes.score },
    { subject: 'MLP (NN)', score: classifiers.MLP.score },
    { subject: 'KNN', score: classifiers.KNN.score },
    { subject: 'Decision Tree', score: classifiers.DecisionTree.score },
    { subject: 'Random Forest', score: classifiers.RandomForest.score },
    { subject: 'AdaBoost', score: classifiers.AdaBoost.score },
    { subject: 'Gradient Boost', score: classifiers.GradientBoost.score }
  ];

  const classifierList = [
    { key: 'NaiveBayes', name: 'Naive Bayes', desc: 'Vocabulary anomalies', data: classifiers.NaiveBayes },
    { key: 'MLP', name: 'MLP Neural Net', desc: 'Structural pattern match', data: classifiers.MLP },
    { key: 'KNN', name: 'KNN Nearest', desc: 'Scam profile similarity', data: classifiers.KNN },
    { key: 'DecisionTree', name: 'Decision Tree', desc: 'Hard constraint check', data: classifiers.DecisionTree },
    { key: 'RandomForest', name: 'Random Forest', desc: 'Ensemble majority vote', data: classifiers.RandomForest },
    { key: 'AdaBoost', name: 'AdaBoost Learner', desc: 'Weak signal boosting', data: classifiers.AdaBoost },
    { key: 'GradientBoost', name: 'Gradient Boost', desc: 'Error minimizing filter', data: classifiers.GradientBoost }
  ];

  return (
    <Card className="glass-panel border-slate-blue/30 overflow-hidden shadow-2xl">
      <CardHeader className="bg-void/50 border-b border-slate-blue/20 py-4 flex flex-row items-center gap-2">
        <Cpu className="w-5 h-5 text-slate-blue" />
        <div>
          <CardTitle className="text-sm font-bold text-bone">Ensemble Classifier Diagnostics</CardTitle>
          <CardDescription className="text-[10px] text-muted-blue">Confidence index profiles from Dutta & Bandyopadhyay (2020) classifiers</CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Recharts Radar Chart */}
        <div className="w-full h-60 flex items-center justify-center bg-void/30 rounded-xl border border-slate-blue/10 p-2">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="rgba(75, 86, 148, 0.2)" />
              <PolarAngleAxis dataKey="subject" stroke="#7288ae" fontSize={9} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#4b5694" fontSize={8} />
              <Radar
                name="Confidence Score"
                dataKey="score"
                stroke="#4b5694"
                fill="#7288ae"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Diagnostics Table */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold text-bone uppercase tracking-wider">Ensemble Breakdown</h4>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {classifierList.map((clf) => (
              <div 
                key={clf.key} 
                className="flex items-center justify-between p-2 rounded bg-void/50 border border-slate-blue/10 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-bone flex items-center gap-1">
                    {clf.name}
                    <span className="text-[9px] font-normal text-muted-blue/60">({clf.desc})</span>
                  </div>
                  <div className="text-[10px] text-muted-blue italic leading-tight">
                    {clf.data.signal || 'No significant trigger detected.'}
                  </div>
                </div>
                
                {/* Score badge */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                  clf.data.score > 60 
                    ? 'bg-red-500/10 text-red-400' 
                    : clf.data.score > 30 
                    ? 'bg-yellow-500/10 text-yellow-400' 
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {clf.data.score}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}

"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShieldAlert, 
  Globe, 
  CheckCircle, 
  Terminal, 
  AlertTriangle,
  ArrowUpRight,
  Filter,
  RefreshCw,
  Search
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

// High-fidelity threat analytics mock data
const monthlyTrendData = [
  { month: 'Jan', totalScans: 420, scamsDetected: 68, rate: 16.1 },
  { month: 'Feb', totalScans: 510, scamsDetected: 82, rate: 16.0 },
  { month: 'Mar', totalScans: 680, scamsDetected: 110, rate: 16.1 },
  { month: 'Apr', totalScans: 840, scamsDetected: 154, rate: 18.3 },
  { month: 'May', totalScans: 1100, scamsDetected: 215, rate: 19.5 },
  { month: 'Jun', totalScans: 1428, scamsDetected: 263, rate: 18.4 }
];

const channelDistributionData = [
  { name: 'Telegram', value: 85, fill: '#4b5694' },
  { name: 'WhatsApp', value: 72, fill: '#7288ae' },
  { name: 'Gmail/Yahoo', value: 58, fill: '#eae0cf' },
  { name: 'SMS/Phishing', value: 28, fill: '#111844' },
  { name: 'Indeed (Fake profiles)', value: 20, fill: '#0d1230' }
];

const riskDistributionData = [
  { name: 'Legitimate', value: 712, color: '#10b981' },
  { name: 'Suspicious', value: 254, color: '#f59e0b' },
  { name: 'High Risk', value: 312, color: '#ef4444' },
  { name: 'Critical Scam', value: 150, color: '#7f1d1d' }
];

const initialThreatFeed = [
  { id: '1', title: 'Remote Data Entry Clerk', company: 'Apex Global Logistics (Fake)', channel: 'Telegram', score: 94, time: '2 mins ago', type: 'Check Fraud / Identity Theft' },
  { id: '2', title: 'Virtual Assistant', company: 'Global Freelance Hub', channel: 'WhatsApp', score: 87, time: '14 mins ago', type: 'Task-Scam / Advance Fee' },
  { id: '3', title: 'Junior Frontend Developer', company: 'Quantum Tech Solutions', channel: 'Gmail', score: 79, time: '38 mins ago', type: 'Credentials Harvesting' },
  { id: '4', title: 'Customer Support Representative', company: 'Express Courier Inc.', channel: 'WhatsApp', score: 91, time: '1 hr ago', type: 'Package Mule Delivery' },
  { id: '5', title: 'Social Media Manager', company: 'Targeted Growth Agency', channel: 'Telegram', score: 83, time: '2 hrs ago', type: 'Identity Theft' }
];

export default function DashboardPage() {
  const [threats, setThreats] = useState(initialThreatFeed);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTitles = [
        'Billing Assistant', 'Entry Level Recruiter', 'Data Processor', 'Online Typist', 'Amazon Review Auditor'
      ];
      const randomCompanies = [
        'Logistics Flow Corp', 'Creative Staffing LLC', 'Global Digital Outreach', 'Direct Solutions Ltd'
      ];
      const randomChannels = ['Telegram', 'WhatsApp', 'Gmail', 'SMS'];
      const randomTypes = ['Advance Fee Scam', 'Identity Theft', 'Check Laundering', 'Mule Recruitment'];
      
      const newThreat = {
        id: Math.random().toString(),
        title: randomTitles[Math.floor(Math.random() * randomTitles.length)],
        company: randomCompanies[Math.floor(Math.random() * randomCompanies.length)],
        channel: randomChannels[Math.floor(Math.random() * randomChannels.length)],
        score: Math.floor(Math.random() * 25) + 75, // Scores 75-99
        time: 'Just now',
        type: randomTypes[Math.floor(Math.random() * randomTypes.length)]
      };

      setThreats(prev => [newThreat, ...prev.slice(0, 4)]);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-bone tracking-tight font-display">Threat Intelligence</h1>
          <p className="text-muted-blue text-sm">Real-time global insights, scam trends, and ensemble scoring breakdowns.</p>
        </div>
        <button 
          onClick={handleManualRefresh}
          className={`flex items-center gap-2 px-4 py-2 rounded-md bg-deep-navy border border-slate-blue/30 text-xs font-bold text-bone font-display hover:bg-slate-blue/20 transition-all uppercase tracking-wider ${isRefreshing ? 'opacity-75' : ''}`}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Synchronizing...' : 'Refresh Feed'}
        </button>
      </div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="glass-panel border-slate-blue/30 bg-deep-navy/40 relative overflow-hidden group hover:border-slate-blue/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-blue/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-blue font-display">Total Scans Audited</span>
              <TrendingUp className="w-5 h-5 text-slate-blue" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-bone tracking-tight font-display">1,428</h3>
              <p className="text-[10px] text-emerald-500 flex items-center gap-1 mt-1 font-mono">
                <span>+24.8%</span> this month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-blue/30 bg-deep-navy/40 relative overflow-hidden group hover:border-slate-blue/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-blue font-display">Scams Flagged</span>
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-bone tracking-tight font-display">263</h3>
              <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1 font-mono">
                <span>18.4%</span> active threat rate
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-blue/30 bg-deep-navy/40 relative overflow-hidden group hover:border-slate-blue/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-blue/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-blue font-display">Malicious Domains</span>
              <Globe className="w-5 h-5 text-slate-blue" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-bone tracking-tight font-display">312</h3>
              <p className="text-[10px] text-muted-blue/60 flex items-center gap-1 mt-1 font-mono">
                Isolated domain registry
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel border-slate-blue/30 bg-deep-navy/40 relative overflow-hidden group hover:border-slate-blue/60 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500"></div>
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-blue font-display">Ensemble Confidence</span>
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-bone tracking-tight font-display">98.4%</h3>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                Peer-reviewed benchmark
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Trend Area Chart (8 Columns) */}
        <Card className="lg:col-span-8 glass-panel border-slate-blue/30 bg-deep-navy/30">
          <CardHeader>
            <CardTitle className="text-base font-bold text-bone font-display">Audit & Interception Trends</CardTitle>
            <CardDescription className="text-xs text-muted-blue">Monthly overview of total analyzed postings vs. detected scams</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7288ae" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#7288ae" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorScams" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4b5694" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#4b5694" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5694/20" vertical={false} />
                <XAxis dataKey="month" stroke="#7288ae" fontSize={10} tickLine={false} />
                <YAxis stroke="#7288ae" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111844', borderColor: '#4b5694', borderRadius: '8px', color: '#eae0cf' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                <Area type="monotone" dataKey="totalScans" name="Total Jobs Analyzed" stroke="#7288ae" fillOpacity={1} fill="url(#colorScans)" strokeWidth={2} />
                <Area type="monotone" dataKey="scamsDetected" name="Scams Intercepted" stroke="#4b5694" fillOpacity={1} fill="url(#colorScams)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Breakdown Pie Chart (4 Columns) */}
        <Card className="lg:col-span-4 glass-panel border-slate-blue/30 bg-deep-navy/30 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base font-bold text-bone font-display">Risk Distribution</CardTitle>
            <CardDescription className="text-xs text-muted-blue">Consensus verdicts classification breakdown</CardDescription>
          </CardHeader>
          <CardContent className="h-60 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111844', borderColor: '#4b5694', borderRadius: '8px', color: '#eae0cf' }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-10">
              <span className="text-2xl font-extrabold text-bone font-display">1,428</span>
              <span className="text-[10px] text-muted-blue uppercase font-bold tracking-wider">Scans</span>
            </div>
          </CardContent>
          
          <div className="p-6 border-t border-slate-blue/10 grid grid-cols-2 gap-2 text-[10px] font-mono">
            {riskDistributionData.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                <span className="text-muted-blue">{item.name}</span>
                <span className="text-bone ml-auto">{item.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Row 3: Threat Channel Split (5 Columns) & Live Threat Feed (7 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Source Channels Bar Chart (5 Columns) */}
        <Card className="lg:col-span-5 glass-panel border-slate-blue/30 bg-deep-navy/30">
          <CardHeader>
            <CardTitle className="text-base font-bold text-bone font-display">Communication Vectors</CardTitle>
            <CardDescription className="text-xs text-muted-blue">Most common channels utilized by verified scam recruiters</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelDistributionData} layout="vertical" margin={{ top: 5, right: 10, left: 15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5694/10" horizontal={false} />
                <XAxis type="number" stroke="#7288ae" fontSize={9} />
                <YAxis dataKey="name" type="category" stroke="#7288ae" fontSize={9} width={90} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#111844', borderColor: '#4b5694', borderRadius: '8px', color: '#eae0cf' }}
                />
                <Bar dataKey="value" name="Threat Incidence Rate" radius={[0, 4, 4, 0]}>
                  {channelDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Live Threat Feed Terminal (7 Columns) */}
        <Card className="lg:col-span-7 glass-panel border-slate-blue/30 bg-deep-navy/30 flex flex-col justify-between overflow-hidden">
          <CardHeader className="bg-void/40 border-b border-slate-blue/10 flex flex-row items-center justify-between py-4">
            <div>
              <CardTitle className="text-base font-bold text-bone font-display flex items-center gap-2">
                <Terminal className="w-5 h-5 text-slate-blue" /> Live Threat Ticker
              </CardTitle>
              <CardDescription className="text-xs text-muted-blue">Real-time interceptions across the ensemble nodes</CardDescription>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-950/50 border border-red-500/30 text-[9px] font-mono text-red-400 font-bold uppercase tracking-wider animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping"></span> Live Feed
            </span>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 overflow-y-auto max-h-[18rem] divide-y divide-slate-blue/10">
            {threats.map((threat) => (
              <div key={threat.id} className="p-4 flex items-center justify-between hover:bg-void/40 transition-colors font-mono text-xs">
                <div className="space-y-1 max-w-[70%]">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-bone truncate">{threat.title}</span>
                    <span className="text-[10px] text-muted-blue/60">at</span>
                    <span className="text-[10px] text-muted-blue truncate">{threat.company}</span>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] text-muted-blue/60">
                    <span className="flex items-center gap-1 text-slate-blue">
                      <Globe className="w-3 h-3" /> {threat.channel}
                    </span>
                    <span>&middot;</span>
                    <span className="text-red-400/80">{threat.type}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-[10px] text-muted-blue/40">{threat.time}</span>
                  <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                    threat.score >= 90 
                      ? 'bg-red-950/30 border border-red-500/40 text-red-400' 
                      : 'bg-amber-950/30 border border-amber-500/40 text-amber-400'
                  }`}>
                    {threat.score}% Risk
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
          
          <div className="p-3 bg-void/50 border-t border-slate-blue/10 text-center">
            <span className="text-[10px] text-muted-blue/60 font-mono">Consensus algorithm running Dutta & Bandyopadhyay MLP-RF model definitions.</span>
          </div>
        </Card>
      </div>
    </div>
  );
}

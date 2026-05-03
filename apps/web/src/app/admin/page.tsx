"use client"

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Activity, Users, AlertTriangle, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { motion } from "framer-motion";

const data = [
  { name: 'Mon', scans: 400, fraud: 240 },
  { name: 'Tue', scans: 300, fraud: 139 },
  { name: 'Wed', scans: 200, fraud: 980 },
  { name: 'Thu', scans: 278, fraud: 390 },
  { name: 'Fri', scans: 189, fraud: 480 },
  { name: 'Sat', scans: 239, fraud: 380 },
  { name: 'Sun', scans: 349, fraud: 430 },
];

const platformData = [
  { name: 'LinkedIn', detected: 420 },
  { name: 'Indeed', detected: 380 },
  { name: 'Glassdoor', detected: 150 },
  { name: 'Direct Email', detected: 650 },
];

export default function AdminDashboard() {
  const [threats, setThreats] = React.useState<{time: string, ip: string}[]>([]);

  React.useEffect(() => {
    const generated = Array.from({ length: 20 }).map((_, i) => ({
      time: new Date(Date.now() - i * 14000).toISOString().split('T')[1].slice(0, 8),
      ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
    }));
    setThreats(generated);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Enterprise Analytics</h1>
          <p className="text-slate-400">Monitor platform threat detection and system health.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 rounded-lg p-2 px-4 shadow-lg">
          <Activity className="w-5 h-5 text-green-500 animate-pulse" />
          <span className="text-sm font-medium">System Status: Optimal</span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Scans (30d)", value: "124,592", icon: Activity, color: "text-blue-500", trend: "+12.5%" },
          { title: "Fraud Prevented", value: "8,439", icon: ShieldCheck, color: "text-green-500", trend: "+24.1%" },
          { title: "Active Users", value: "45,231", icon: Users, color: "text-purple-500", trend: "+8.2%" },
          { title: "Critical Alerts", value: "12", icon: AlertTriangle, color: "text-red-500", trend: "-2.4%" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{kpi.title}</CardTitle>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value}</div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" /> {kpi.trend} from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="col-span-1 lg:col-span-2 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Threat Detection Volume</CardTitle>
            <CardDescription>Daily scans vs detected fraudulent postings.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} />
                <Area type="monotone" dataKey="scans" stroke="#3b82f6" fillOpacity={1} fill="url(#colorScans)" />
                <Area type="monotone" dataKey="fraud" stroke="#ef4444" fillOpacity={1} fill="url(#colorFraud)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="col-span-1 bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle>Threat Origins</CardTitle>
            <CardDescription>Sources of fraudulent listings.</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={platformData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#475569" />
                <YAxis dataKey="name" type="category" stroke="#475569" width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} cursor={{fill: '#1e293b'}} />
                <Bar dataKey="detected" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Live Threat Feed */}
      <div className="mt-6">
        <Card className="bg-slate-900/50 border-slate-800 overflow-hidden">
          <CardHeader className="bg-slate-900/80 border-b border-slate-800 pb-4">
            <CardTitle className="flex items-center gap-2 text-red-400">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Live Threat Interceptions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-48 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/90 z-10 pointer-events-none"></div>
              <motion.div 
                className="flex flex-col"
                animate={{ y: ["0%", "-50%"] }}
                transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
              >
                {threats.map((threat, i) => (
                  <div key={i} className="flex items-center justify-between px-6 py-3 border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-mono text-slate-500">{threat.time}</span>
                      <span className="text-sm font-medium text-slate-300">Suspicious IP: {threat.ip}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-xs font-semibold border border-red-500/20">BLOCKED</span>
                      <span className="text-xs text-slate-500">Pattern: Phishing URI</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

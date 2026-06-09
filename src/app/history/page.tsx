"use client"

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, 
  Search, 
  Trash2, 
  ArrowUpRight, 
  AlertTriangle, 
  ShieldCheck, 
  X,
  FileText,
  Calendar,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScanRecord } from '@/types';

export default function HistoryPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');

  // Detail Modal state
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  // Fetch scans from API and sync with LocalStorage
  const fetchScans = async () => {
    setLoading(true);
    let apiScans: ScanRecord[] = [];
    
    try {
      const response = await axios.get('/api/history');
      apiScans = response.data || [];
    } catch (err) {
      console.warn("Failed to fetch API history, using client-side fallback.");
    }

    // Load local storage scans
    let localScans: ScanRecord[] = [];
    try {
      const stored = localStorage.getItem('hireshield_local_scans');
      if (stored) {
        localScans = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    // Combine scans and sort
    const combined = [...apiScans, ...localScans];
    const unique = combined.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
    unique.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    setScans(unique);
    setLoading(false);
  };

  useEffect(() => {
    fetchScans();
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local scan history? This does not delete server logs.")) {
      try {
        localStorage.removeItem('hireshield_local_scans');
        fetchScans();
      } catch (e) {
        console.error(e);
      }
    }
  };

  const filteredScans = scans.filter(scan => {
    const matchesSearch = 
      scan.job_title.toLowerCase().includes(search.toLowerCase()) ||
      (scan.company && scan.company.toLowerCase().includes(search.toLowerCase()));
    
    const matchesRisk = riskFilter === 'ALL' || scan.risk_level === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL_SCAM': return 'text-red-400 bg-red-950/40 border-red-500/30';
      case 'HIGH_RISK': return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
      case 'SUSPICIOUS': return 'text-blue-400 bg-blue-950/40 border-blue-500/30';
      default: return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-bone tracking-tight font-display flex items-center gap-2">
            <History className="w-8 h-8 text-slate-blue" /> Scans Audit Log
          </h1>
          <p className="text-muted-blue text-sm">Review previous submissions, consensus scoring logs, and red flags records.</p>
        </div>
        {scans.length > 0 && (
          <Button 
            onClick={handleClearHistory}
            variant="outline"
            className="border-red-500/30 text-red-400 hover:text-red-300 hover:bg-red-950/20 text-xs font-bold uppercase tracking-wider font-display flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Clear Local History
          </Button>
        )}
      </div>

      {/* Filter Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-8 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-blue/60" />
          </span>
          <Input 
            placeholder="Search by job title or company name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-deep-navy/40 border-slate-blue/30 text-bone focus-visible:ring-slate-blue placeholder:text-muted-blue/50 text-xs"
          />
        </div>

        {/* Risk Level Filter */}
        <div className="md:col-span-4">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-slate-blue/30 bg-deep-navy/60 text-xs text-bone font-mono px-3 py-1.5 focus:border-slate-blue focus:outline-none"
          >
            <option value="ALL">All Risk Verdicts</option>
            <option value="CRITICAL_SCAM">Critical Scams</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="SUSPICIOUS">Suspicious</option>
            <option value="LEGITIMATE">Legitimate</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <Card className="glass-panel border-slate-blue/30 bg-deep-navy/30 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-16 flex flex-col items-center justify-center text-muted-blue/70">
              <span className="animate-spin rounded-full h-8 w-8 border-t-2 border-slate-blue mb-4"></span>
              <span className="text-xs font-mono">Synchronizing audit registry logs...</span>
            </div>
          ) : filteredScans.length > 0 ? (
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead className="bg-void/40 border-b border-slate-blue/20 text-muted-blue uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="p-4">Job Title / Company</th>
                  <th className="p-4">Risk Verdict</th>
                  <th className="p-4 text-center">Flags</th>
                  <th className="p-4">Scan Date</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-blue/10">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-void/35 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-bone truncate max-w-xs">{scan.job_title}</div>
                      <div className="text-[10px] text-muted-blue/70 truncate max-w-xs">{scan.company || 'Unknown Company'}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getRiskColor(scan.risk_level)}`}>
                        {scan.risk_level.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-muted-blue/60 ml-2">({scan.risk_score}%)</span>
                    </td>
                    <td className="p-4 text-center font-bold text-bone">
                      {scan.red_flags_count > 0 ? (
                        <span className="text-red-400 flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" /> {scan.red_flags_count}
                        </span>
                      ) : (
                        <span className="text-emerald-400 flex items-center justify-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> 0
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-muted-blue/60">
                      <span className="flex items-center gap-1.5 text-[10px]">
                        <Calendar className="w-3.5 h-3.5" /> {new Date(scan.created_at).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedScan(scan)}
                        className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-slate-blue hover:text-muted-blue transition-colors font-display"
                      >
                        Details <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <History className="w-12 h-12 text-slate-blue/30 mb-2" />
              <h4 className="text-sm font-bold text-bone font-display">No Audit Records Found</h4>
              <p className="text-muted-blue text-xs max-w-sm mt-1 leading-relaxed">
                You have not executed any job fraud scans yet. Head over to the Scan Auditor page to check your first job posting.
              </p>
              <Button 
                onClick={() => window.location.href = '/scan'}
                className="mt-4 bg-gradient-to-r from-slate-blue to-muted-blue text-xs font-bold uppercase tracking-wider font-display"
              >
                Scan A Job Now
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Details Inspector Modal */}
      {selectedScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg glass-panel border-slate-blue/30 bg-deep-navy shadow-2xl rounded-xl overflow-hidden font-mono"
          >
            <div className="p-5 border-b border-slate-blue/20 bg-void/50 flex justify-between items-center">
              <div>
                <h3 className="text-sm font-bold text-bone font-display">Audit Record Details</h3>
                <p className="text-[10px] text-muted-blue">Record UUID: {selectedScan.id}</p>
              </div>
              <button 
                onClick={() => setSelectedScan(null)}
                className="text-muted-blue hover:text-bone transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 border-b border-slate-blue/10 pb-4">
                <div>
                  <span className="text-[10px] text-muted-blue uppercase block mb-1">Job Title</span>
                  <span className="font-bold text-bone block truncate">{selectedScan.job_title}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-blue uppercase block mb-1">Company</span>
                  <span className="font-bold text-bone block truncate">{selectedScan.company || 'Unknown Company'}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 border-b border-slate-blue/10 pb-4">
                <div>
                  <span className="text-[10px] text-muted-blue uppercase block mb-1">Consensus Score</span>
                  <span className="font-bold text-bone text-base block">{selectedScan.risk_score}%</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-blue uppercase block mb-1">Risk Verdict</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border inline-block ${getRiskColor(selectedScan.risk_level)}`}>
                    {selectedScan.risk_level.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-blue uppercase block mb-1">Safe to Apply</span>
                  <span className={`font-bold block text-sm ${selectedScan.safe_to_apply ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selectedScan.safe_to_apply ? 'YES' : 'NO'}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] text-muted-blue uppercase block">Ensemble Summary</span>
                <p className="bg-void/45 border border-slate-blue/15 rounded p-3 text-[11px] text-muted-blue/90 leading-relaxed font-body">
                  {selectedScan.verdict || "This scan verified risk levels across the 7 independent ML classifiers (MLP, Decision Tree, Random Forest, KNN, Naive Bayes, AdaBoost, and Gradient Boosting) to deliver weighted ensemble consensus verdicts."}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Button 
                  onClick={() => setSelectedScan(null)}
                  className="bg-gradient-to-r from-slate-blue to-muted-blue text-xs font-bold uppercase tracking-wider font-display"
                >
                  Close Audit Inspector
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

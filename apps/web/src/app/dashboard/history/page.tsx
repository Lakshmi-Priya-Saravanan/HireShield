"use client"

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, ShieldAlert, Activity, Search, Calendar, FileText, Filter, AlertTriangle, Eye } from 'lucide-react';
import { api } from '@/lib/api';

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [scans, setScans] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<'ALL' | 'HIGH' | 'SUSPICIOUS' | 'SAFE'>('ALL');
  const [selectedScan, setSelectedScan] = useState<any | null>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await api.getHistory();
      setScans(data);
    } catch (e) {
      console.warn("Failed to load audit history:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredScans = scans.filter(scan => {
    const textMatch = scan.jobDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      (scan.companyName && scan.companyName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterLevel === 'ALL') return textMatch;
    if (filterLevel === 'HIGH') return textMatch && (scan.riskLevel === 'High Risk' || scan.riskLevel === 'Critical Risk');
    if (filterLevel === 'SUSPICIOUS') return textMatch && scan.riskLevel === 'Suspicious';
    if (filterLevel === 'SAFE') return textMatch && scan.riskLevel === 'Safe';
    return textMatch;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Audit History Logs</h1>
        <p className="text-slate-400 text-sm">Review previous employment security scans, logs, and triggers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Logs List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input
                placeholder="Search by keyword or company name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-slate-900/40 border-slate-900 text-xs text-slate-300 pl-10 h-10"
              />
            </div>
            <div className="flex gap-1.5 overflow-x-auto">
              {(['ALL', 'HIGH', 'SUSPICIOUS', 'SAFE'] as const).map((level) => (
                <Button
                  key={level}
                  variant={filterLevel === level ? 'default' : 'outline'}
                  onClick={() => setFilterLevel(level)}
                  className={`text-[10px] uppercase font-bold tracking-wider h-10 px-3 ${
                    filterLevel === level 
                      ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                      : 'border-slate-900 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  {level === 'ALL' ? 'All Logs' : level}
                </Button>
              ))}
            </div>
          </div>

          {/* Logs List Container */}
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400 text-xs">
              <Activity className="w-4 h-4 animate-spin mr-2" /> Indexing data registries...
            </div>
          ) : filteredScans.length === 0 ? (
            <Card className="h-60 flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-800 bg-slate-900/10">
              <FileText className="w-10 h-10 text-slate-700 mb-3" />
              <h4 className="text-xs font-semibold text-slate-400 mb-1">No matching log records found</h4>
              <p className="text-[10px] text-slate-500 max-w-xs leading-relaxed">
                Refine your filters, or execute a new verification in the analyzer.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredScans.map((scan) => (
                <div 
                  key={scan.id}
                  onClick={() => setSelectedScan(scan)}
                  className={`p-4 rounded-xl border bg-slate-900/30 backdrop-blur cursor-pointer hover:border-slate-800 transition-all flex justify-between items-center ${
                    selectedScan?.id === scan.id ? 'border-blue-500/40 ring-1 ring-blue-500/20' : 'border-slate-900'
                  }`}
                >
                  <div className="space-y-2 min-w-0 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                        scan.riskLevel === 'High Risk' || scan.riskLevel === 'Critical Risk'
                          ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                          : scan.riskLevel === 'Suspicious'
                          ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                          : 'bg-green-500/10 border-green-500/20 text-green-400'
                      }`}>
                        {scan.riskLevel} ({scan.fraudScore}%)
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(scan.scannedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-slate-200 truncate">
                      {scan.companyName ? `${scan.companyName} Posting` : 'Job Description Audit'}
                    </h4>
                    <p className="text-[11px] text-slate-400 truncate leading-relaxed">
                      {scan.jobDescription}
                    </p>
                  </div>
                  <Eye className="w-4 h-4 text-slate-500 shrink-0" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detailed Inspection Panel */}
        <div className="w-full">
          {selectedScan ? (
            <Card className="bg-slate-900/40 border-slate-900 backdrop-blur sticky top-24">
              <CardHeader>
                <CardTitle className="text-sm font-bold text-slate-300">Detailed Risk Record</CardTitle>
                <CardDescription className="text-[10px] text-slate-500">Full audit specifications for the selected entity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Classification</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs font-semibold text-slate-200">{selectedScan.riskLevel} ({selectedScan.fraudScore}%)</span>
                    <span className="text-[10px] text-slate-500">{new Date(selectedScan.scannedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {selectedScan.companyName && (
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Reference Employer</span>
                    <p className="text-xs text-slate-300 font-semibold mt-0.5">{selectedScan.companyName}</p>
                  </div>
                )}

                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider">Audit Text Segment</span>
                  <p className="text-xs text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-900 leading-relaxed max-h-36 overflow-y-auto mt-1">
                    {selectedScan.jobDescription}
                  </p>
                </div>

                {/* Decode serialized redFlags list */}
                {(() => {
                  try {
                    const flags = JSON.parse(selectedScan.redFlags || '[]');
                    if (flags.length > 0) {
                      return (
                        <div className="space-y-2">
                          <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Red Flag Indicators</span>
                          <ul className="space-y-2">
                            {flags.map((flag: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2 bg-red-500/5 border border-red-500/10 p-2 rounded-lg text-red-200 text-xs">
                                <ShieldAlert className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                                {flag}
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    }
                  } catch (e) {}
                  return (
                    <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg flex items-center gap-2 text-green-200 text-xs">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> Standard compliant content patterns.
                    </div>
                  );
                })()}

              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full text-xs" onClick={() => setSelectedScan(null)}>Close Inspection</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="h-72 flex flex-col items-center justify-center p-8 text-center border-dashed border-slate-800 bg-slate-900/10 sticky top-24">
              <Eye className="w-12 h-12 text-slate-700 mb-4" />
              <h4 className="text-sm font-medium text-slate-400 mb-1">Awaiting Inspection</h4>
              <p className="text-slate-600 text-xs max-w-xs">Select any verification item on the left to inspect red flags and NLP outputs.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

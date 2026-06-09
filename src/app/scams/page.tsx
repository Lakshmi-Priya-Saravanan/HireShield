"use client"

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  PlusCircle, 
  AlertTriangle, 
  ShieldCheck, 
  Globe, 
  Server, 
  Mail, 
  Calendar,
  X,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ScamEntry {
  id: string;
  target: string; // company or recruiter name
  domain: string;
  scam_type: string;
  verdict: string;
  severity: 'HIGH_RISK' | 'CRITICAL_SCAM' | 'SUSPICIOUS';
  status: 'ACTIVE' | 'DOWN';
  detected_at: string;
}

const initialRegistry: ScamEntry[] = [
  {
    id: '1',
    target: 'Apex Global Logistics (Impersonation)',
    domain: 'careers-apexlogistics.com',
    scam_type: 'Fake Check Scam',
    verdict: 'Recruiters directing targets to buy home office gear via check cash deposits. Completely fraudulent domain registered 4 days ago.',
    severity: 'CRITICAL_SCAM',
    status: 'ACTIVE',
    detected_at: '2026-06-05'
  },
  {
    id: '2',
    target: 'Innovative Freelance Hub LLC',
    domain: 'freelancehub-tasks.org',
    scam_type: 'Advance Fee Tasks',
    verdict: 'Asks users to complete rating tasks and deposit USDT crypto to withdraw earnings. Classic rating/task scam model.',
    severity: 'CRITICAL_SCAM',
    status: 'ACTIVE',
    detected_at: '2026-06-04'
  },
  {
    id: '3',
    target: 'Horizon Solar Solutions (Fake)',
    domain: 'horizon-solarcareers.net',
    scam_type: 'Identity Theft / Phishing',
    verdict: 'Recruiter requesting SSN, driver license photos, and bank accounts prior to standard video interview rounds.',
    severity: 'HIGH_RISK',
    status: 'ACTIVE',
    detected_at: '2026-06-02'
  },
  {
    id: '4',
    target: 'United Courier Services Inc.',
    domain: 'us-courierservice.cc',
    scam_type: 'Package Mule / Reshipping',
    verdict: 'Recruiting for remote "Quality Control Manager" position. The actual job is reshipping stolen merchandise purchased with stolen credit cards.',
    severity: 'CRITICAL_SCAM',
    status: 'DOWN',
    detected_at: '2026-05-28'
  },
  {
    id: '5',
    target: 'Prime Tech Recruiting Inc.',
    domain: 'recruitment-primetech.info',
    scam_type: 'Credentials Harvesting',
    verdict: 'Links targets to a spoofed Google/Microsoft login panel under the guise of an assessment exam to steal passwords.',
    severity: 'HIGH_RISK',
    status: 'DOWN',
    detected_at: '2026-05-25'
  },
  {
    id: '6',
    target: 'Remote Operations Group',
    domain: 'remote-ops-dataentry.com',
    scam_type: 'Check Laundering',
    verdict: 'Sending counterfeit cashier checks for equipment purchase, requesting leftovers returned via Apple Gift Cards.',
    severity: 'CRITICAL_SCAM',
    status: 'ACTIVE',
    detected_at: '2026-06-01'
  }
];

export default function ScamRegistryPage() {
  const [registry, setRegistry] = useState<ScamEntry[]>(initialRegistry);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Submit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTarget, setNewTarget] = useState('');
  const [newDomain, setNewDomain] = useState('');
  const [newType, setNewType] = useState('Fake Check Scam');
  const [newVerdict, setNewVerdict] = useState('');
  const [newSeverity, setNewSeverity] = useState<'HIGH_RISK' | 'CRITICAL_SCAM' | 'SUSPICIOUS'>('HIGH_RISK');

  const filteredRegistry = registry.filter(item => {
    const matchesSearch = 
      item.target.toLowerCase().includes(search.toLowerCase()) || 
      item.domain.toLowerCase().includes(search.toLowerCase()) || 
      item.scam_type.toLowerCase().includes(search.toLowerCase());
    
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTarget || !newDomain || !newVerdict) return;

    const newEntry: ScamEntry = {
      id: Math.random().toString(),
      target: newTarget,
      domain: newDomain.replace(/^(https?:\/\/)?(www\.)?/, ''), // strip protocol
      scam_type: newType,
      verdict: newVerdict,
      severity: newSeverity,
      status: 'ACTIVE',
      detected_at: new Date().toISOString().split('T')[0]
    };

    setRegistry([newEntry, ...registry]);
    setIsModalOpen(false);
    
    // Clear inputs
    setNewTarget('');
    setNewDomain('');
    setNewVerdict('');
    setNewSeverity('HIGH_RISK');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-bone tracking-tight font-display">Scam Registry</h1>
          <p className="text-muted-blue text-sm">Searchable blacklist of verified fraudulent recruiter domains, domains and fake employers.</p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-slate-blue to-muted-blue hover:scale-105 transition-transform text-xs font-bold uppercase tracking-wider font-display flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Report Scam Domain
        </Button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Search */}
        <div className="md:col-span-6 relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-blue/60" />
          </span>
          <Input 
            placeholder="Search company, domain, or scam type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-deep-navy/40 border-slate-blue/30 text-bone focus-visible:ring-slate-blue placeholder:text-muted-blue/50 text-xs"
          />
        </div>

        {/* Severity filter */}
        <div className="md:col-span-3">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-slate-blue/30 bg-deep-navy/60 text-xs text-bone font-mono px-3 py-1.5 focus:border-slate-blue focus:outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL_SCAM">Critical Scams</option>
            <option value="HIGH_RISK">High Risk</option>
            <option value="SUSPICIOUS">Suspicious</option>
          </select>
        </div>

        {/* Status filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-9 rounded-md border border-slate-blue/30 bg-deep-navy/60 text-xs text-bone font-mono px-3 py-1.5 focus:border-slate-blue focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active Threats</option>
            <option value="DOWN">Offline / Down</option>
          </select>
        </div>
      </div>

      {/* Registry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRegistry.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="glass-panel border-slate-blue/20 bg-deep-navy/40 hover:border-slate-blue/50 transition-all duration-300 flex flex-col justify-between h-[18rem] overflow-hidden">
                <CardHeader className="bg-void/40 border-b border-slate-blue/10 p-4 pb-3 flex flex-row justify-between items-start">
                  <div className="space-y-1 max-w-[75%]">
                    <CardTitle className="text-xs font-bold text-bone font-display truncate leading-tight">
                      {item.target}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-blue font-mono">
                      <Globe className="w-3.5 h-3.5 text-slate-blue" />
                      <span className="truncate">{item.domain}</span>
                    </div>
                  </div>
                  
                  {/* Status Badges */}
                  <div className="flex flex-col items-end gap-1 font-mono text-[9px] font-bold">
                    <span className={`px-2 py-0.5 rounded-full border ${
                      item.status === 'ACTIVE'
                        ? 'bg-red-950/40 border-red-500/30 text-red-400'
                        : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400'
                    }`}>
                      {item.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full border ${
                      item.severity === 'CRITICAL_SCAM'
                        ? 'bg-red-950/60 border-red-700/50 text-red-300'
                        : item.severity === 'HIGH_RISK'
                        ? 'bg-amber-950/40 border-amber-500/30 text-amber-400'
                        : 'bg-blue-950/40 border-blue-500/30 text-blue-400'
                    }`}>
                      {item.severity.replace('_', ' ')}
                    </span>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 flex-1 flex flex-col justify-between text-xs text-muted-blue leading-relaxed">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider font-display text-slate-blue">
                      <AlertTriangle className="w-3.5 h-3.5" /> {item.scam_type}
                    </div>
                    <p className="line-clamp-4 text-[11px] text-muted-blue/95">{item.verdict}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[10px] text-muted-blue/50 font-mono mt-2 pt-2 border-t border-slate-blue/10">
                    <Calendar className="w-3.5 h-3.5" /> Detected: {item.detected_at}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredRegistry.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center border border-dashed border-slate-blue/30 rounded-xl bg-void/10 text-center">
            <ShieldCheck className="w-12 h-12 text-emerald-500/30 mb-2" />
            <h4 className="text-sm font-bold text-bone font-display">No Flagged Domain Matches</h4>
            <p className="text-muted-blue text-xs mt-1">Try modifying your search queries or filter categories.</p>
          </div>
        )}
      </div>

      {/* Submit Scam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg glass-panel border-slate-blue/30 bg-deep-navy shadow-2xl overflow-hidden rounded-xl"
          >
            <div className="p-5 border-b border-slate-blue/20 bg-void/50 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-bone font-display">Report Fraudulent Recruiter/Domain</h3>
                <p className="text-xs text-muted-blue">Help protect others by reporting fake postings.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-muted-blue hover:text-bone transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="p-5 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider font-display text-muted-blue">Company / Recruiter Name</label>
                <Input 
                  required
                  placeholder="e.g. Apex Global Logistics (Fake recruiter)"
                  value={newTarget}
                  onChange={(e) => setNewTarget(e.target.value)}
                  className="bg-void border-slate-blue/30 text-bone placeholder:text-muted-blue/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider font-display text-muted-blue">Malicious Domain Name</label>
                <Input 
                  required
                  placeholder="e.g. careers-apexlogistics.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="bg-void border-slate-blue/30 text-bone placeholder:text-muted-blue/40 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider font-display text-muted-blue">Scam Classification</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    className="w-full h-9 rounded-md border border-slate-blue/30 bg-void text-bone font-mono px-3 focus:border-slate-blue focus:outline-none"
                  >
                    <option value="Fake Check Scam">Fake Check Scam</option>
                    <option value="Advance Fee Tasks">Advance Fee Tasks</option>
                    <option value="Credentials Harvesting">Credentials Harvesting</option>
                    <option value="Identity Theft / Phishing">Identity Theft / Phishing</option>
                    <option value="Package Mule Recruitment">Package Mule Recruitment</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider font-display text-muted-blue">Threat Severity</label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full h-9 rounded-md border border-slate-blue/30 bg-void text-bone font-mono px-3 focus:border-slate-blue focus:outline-none"
                  >
                    <option value="CRITICAL_SCAM">Critical Scam (Active Loss)</option>
                    <option value="HIGH_RISK">High Risk (Phishing)</option>
                    <option value="SUSPICIOUS">Suspicious (Awaiting Audit)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider font-display text-muted-blue">Audit Verdict / Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the warning signs (e.g. sending a check for home office supplies, requested a WhatsApp interview)..."
                  value={newVerdict}
                  onChange={(e) => setNewVerdict(e.target.value)}
                  className="w-full rounded-md border border-slate-blue/30 bg-void text-bone p-3 placeholder:text-muted-blue/40 focus:border-slate-blue focus:outline-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsModalOpen(false)}
                  className="border-slate-blue/20 text-muted-blue hover:text-bone hover:bg-slate-blue/15 text-xs font-bold uppercase tracking-wider font-display"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-slate-blue to-muted-blue text-xs font-bold uppercase tracking-wider font-display"
                >
                  Submit Registry Record
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { ShieldAlert, ShieldCheck, Activity, Target } from 'lucide-react';

export default function StatsBar() {
  const stats = [
    { label: "Jobs Audited", value: "47,291+", icon: Activity, color: "text-blue-400" },
    { label: "Fraudulent Flags", value: "5,816", icon: ShieldAlert, color: "text-red-400" },
    { label: "Ensemble Accuracy", value: "98.27%", icon: Target, color: "text-green-400" },
    { label: "Verification Speed", value: "< 2s", icon: ShieldCheck, color: "text-purple-400" }
  ];

  return (
    <div className="bg-void/40 border-y border-slate/30 py-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-center mb-1">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold font-display text-bone">{stat.value}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-muted-blue">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

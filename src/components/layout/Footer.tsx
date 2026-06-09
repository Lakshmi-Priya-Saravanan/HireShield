import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate/30 bg-void py-12 text-xs text-muted-blue font-body relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-slate-blue" />
            <span className="text-lg font-bold font-display text-bone">HireShield</span>
          </div>
          <p className="max-w-sm leading-relaxed text-muted-blue/80">
            A peer-reviewed research-backed Online Recruitment Fraud (ORF) detection suite. Protecting job seekers from identity theft, advance fee scams, and credentials harvesting.
          </p>
          <p className="text-[10px] text-muted-blue/60">
            Inspired by Dutta & Bandyopadhyay (2020) ensemble NLP classifier methodologies.
          </p>
        </div>

        {/* Navigation links */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-wider font-display text-bone">Platform Suite</h4>
          <ul className="space-y-2">
            <li><Link href="/scan" className="hover:text-bone transition-colors">Risk Scanner</Link></li>
            <li><Link href="/dashboard" className="hover:text-bone transition-colors">Threat Intelligence</Link></li>
            <li><Link href="/scams" className="hover:text-bone transition-colors">Scam Registry</Link></li>
            <li><Link href="/extension" className="hover:text-bone transition-colors">Chrome Extension</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div className="space-y-3">
          <h4 className="text-xs uppercase font-bold tracking-wider font-display text-bone">Resources</h4>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-bone transition-colors">Research Methodology</Link></li>
            <li><Link href="/docs" className="hover:text-bone transition-colors">Developer API Portal</Link></li>
            <li>
              <a 
                href="https://github.com/lakshmipriyasaravanan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-1.5 hover:text-bone transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg> Github Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-8 border-t border-slate/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[10px] text-muted-blue/50">
          &copy; {new Date().getFullYear()} HireShield. All rights reserved. Deployed under MIT license.
        </p>
        <div className="flex gap-4 text-[10px] text-muted-blue/50">
          <span className="hover:text-bone cursor-pointer">Privacy Policy</span>
          <span>&middot;</span>
          <span className="hover:text-bone cursor-pointer">Terms of Service</span>
        </div>
      </div>
    </footer>
  );
}

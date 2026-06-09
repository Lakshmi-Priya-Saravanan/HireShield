"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, Menu, X, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Scan Auditor', href: '/scan' },
    { name: 'Analytics', href: '/dashboard' },
    { name: 'Scam Registry', href: '/scams' },
    { name: 'API Docs', href: '/docs' },
    { name: 'Extension', href: '/extension' },
    { name: 'Research Basis', href: '/about' }
  ];

  return (
    <nav className="border-b border-slate/30 bg-void/80 backdrop-blur-md sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <ShieldCheck className="w-8 h-8 text-slate-blue group-hover:text-muted-blue transition-colors" />
              <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-bone via-muted-blue to-slate-blue">
                HireShield
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`text-xs uppercase font-bold tracking-wider font-display transition-colors ${
                    isActive 
                      ? 'text-bone border-b-2 border-slate-blue pb-1' 
                      : 'text-muted-blue hover:text-bone'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link href="/scan">
              <Button size="sm" className="bg-gradient-to-r from-slate-blue to-muted-blue hover:scale-105 transition-transform text-xs font-bold uppercase tracking-wider font-display">
                <Terminal className="w-3.5 h-3.5 mr-1" /> Start Scan
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-blue hover:text-bone focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate/20 bg-void px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-bold uppercase tracking-wider font-display ${
                  isActive ? 'bg-slate-blue/20 text-bone' : 'text-muted-blue hover:bg-navy/40 hover:text-bone'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          <div className="pt-2">
            <Link href="/scan" onClick={() => setIsOpen(false)} className="block w-full">
              <Button size="sm" className="w-full bg-gradient-to-r from-slate-blue to-muted-blue text-xs font-bold uppercase tracking-wider font-display">
                <Terminal className="w-3.5 h-3.5 mr-1" /> Start Scan
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

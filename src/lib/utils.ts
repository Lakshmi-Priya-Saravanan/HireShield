import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function getRiskLevel(score: number): 'LEGITIMATE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL_SCAM' {
  if (score <= 25) return 'LEGITIMATE';
  if (score <= 50) return 'SUSPICIOUS';
  if (score <= 75) return 'HIGH_RISK';
  return 'CRITICAL_SCAM';
}

export function getRiskColor(level: 'LEGITIMATE' | 'SUSPICIOUS' | 'HIGH_RISK' | 'CRITICAL_SCAM'): { text: string; bg: string; border: string; hex: string } {
  switch (level) {
    case 'LEGITIMATE':
      return { text: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', hex: '#22c55e' };
    case 'SUSPICIOUS':
      return { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', hex: '#f59e0b' };
    case 'HIGH_RISK':
      return { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', hex: '#ea580c' };
    case 'CRITICAL_SCAM':
      return { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', hex: '#ef4444' };
  }
}

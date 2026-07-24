import React from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, Flame } from 'lucide-react';

export default function ThreatLevelMeter({ threatLevel, severityCounts }) {
  const getThreatDetails = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return {
          title: 'DEFCON 1 • CRITICAL THREAT IN PROGRESS',
          desc: 'Active high-volume attack detected (DDoS, Ransomware, or C2 Malware). Immediate containment required.',
          bg: 'bg-gradient-to-r from-red-950 via-slate-900 to-rose-950/80',
          borderColor: 'border-red-500',
          textColor: 'text-red-400 text-glow-red',
          iconBg: 'bg-gradient-to-tr from-red-600 to-pink-600 text-white shadow-[0_0_25px_rgba(239,68,68,0.7)]',
          glow: 'soc-card-glow-red',
          icon: Flame
        };
      case 'SEVERE':
        return {
          title: 'DEFCON 2 • SEVERE THREAT LEVEL',
          desc: 'High severity SQL injection or exploit attempts identified. WAF rules actively blocking malicious payloads.',
          bg: 'bg-gradient-to-r from-rose-950 via-slate-900 to-pink-950/80',
          borderColor: 'border-rose-500',
          textColor: 'text-rose-400',
          iconBg: 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.5)]',
          glow: 'soc-card-glow-red',
          icon: AlertOctagon
        };
      case 'ELEVATED':
        return {
          title: 'DEFCON 3 • ELEVATED WARNING',
          desc: 'Suspicious scanning & authentication brute force attempts detected. Firewall monitoring active.',
          bg: 'bg-gradient-to-r from-amber-950 via-slate-900 to-yellow-950/80',
          borderColor: 'border-amber-500',
          textColor: 'text-amber-400 text-glow-amber',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)]',
          glow: 'soc-card-glow-amber',
          icon: ShieldAlert
        };
      default:
        return {
          title: 'DEFCON 5 • NORMAL OPERATIONAL CONDITION',
          desc: 'All systems operating nominally. Low background noise & routine network operations.',
          bg: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950/80',
          borderColor: 'border-emerald-500/80',
          textColor: 'text-emerald-400 text-glow-emerald',
          iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.5)]',
          glow: 'soc-card-glow-emerald',
          icon: ShieldCheck
        };
    }
  };

  const details = getThreatDetails();
  const Icon = details.icon;

  const total = (severityCounts.LOW || 0) + (severityCounts.MEDIUM || 0) + (severityCounts.HIGH || 0) + (severityCounts.CRITICAL || 0);

  return (
    <div className={`p-6 rounded-2xl border ${details.bg} ${details.borderColor} ${details.glow} transition-all duration-500 relative overflow-hidden soc-card`}>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Gauge Title & Description */}
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${details.iconBg}`}>
            <Icon className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-extrabold uppercase tracking-widest ${details.textColor}`}>
                GLOBAL THREAT STATUS
              </span>
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white tracking-wide mt-0.5">
              {details.title}
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 font-medium leading-relaxed">
              {details.desc}
            </p>
          </div>
        </div>

        {/* Color-Coded Distribution Meter */}
        <div className="w-full lg:w-80 flex flex-col gap-2 bg-slate-950/90 p-4 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-slate-300 font-extrabold">SEVERITY SPECTRUM</span>
            <span className="text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
              {total} EVENTS
            </span>
          </div>

          {/* Multi-Color Progress Bar */}
          <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden flex border border-slate-800 p-0.5 gap-1">
            <div 
              style={{ width: `${total ? (severityCounts.LOW / total) * 100 : 25}%` }} 
              className="bg-gradient-to-r from-emerald-500 to-teal-400 rounded-sm transition-all duration-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
              title={`Low/Normal: ${severityCounts.LOW || 0}`}
            />
            <div 
              style={{ width: `${total ? (severityCounts.MEDIUM / total) * 100 : 25}%` }} 
              className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-sm transition-all duration-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" 
              title={`Medium: ${severityCounts.MEDIUM || 0}`}
            />
            <div 
              style={{ width: `${total ? (severityCounts.HIGH / total) * 100 : 25}%` }} 
              className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-sm transition-all duration-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" 
              title={`High: ${severityCounts.HIGH || 0}`}
            />
            <div 
              style={{ width: `${total ? (severityCounts.CRITICAL / total) * 100 : 25}%` }} 
              className="bg-gradient-to-r from-red-600 to-red-500 rounded-sm transition-all duration-500 animate-pulse shadow-[0_0_12px_rgba(239,68,68,0.9)]" 
              title={`Critical: ${severityCounts.CRITICAL || 0}`}
            />
          </div>

          <div className="grid grid-cols-4 text-center text-[10px] font-mono font-bold mt-1">
            <span className="text-emerald-400">LOW ({severityCounts.LOW || 0})</span>
            <span className="text-amber-400">MED ({severityCounts.MEDIUM || 0})</span>
            <span className="text-rose-400">HIGH ({severityCounts.HIGH || 0})</span>
            <span className="text-red-400 animate-pulse">CRIT ({severityCounts.CRITICAL || 0})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

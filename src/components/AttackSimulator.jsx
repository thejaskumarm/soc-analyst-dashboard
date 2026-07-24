import React from 'react';
import { Zap, Database, Lock, Radio, Cpu, Skull, Sparkles } from 'lucide-react';
import { ATTACK_TYPES } from '../mock/logGenerator';

export default function AttackSimulator({ onTriggerAttack }) {
  const attacks = [
    { 
      type: ATTACK_TYPES.SQL_INJECTION, 
      label: 'SQL Injection', 
      icon: Database, 
      color: 'bg-gradient-to-r from-rose-950 to-pink-950 border-rose-500/60 text-rose-300 hover:from-rose-900 hover:to-pink-900 hover:border-rose-400 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
    },
    { 
      type: ATTACK_TYPES.BRUTE_FORCE, 
      label: 'SSH Brute Force', 
      icon: Lock, 
      color: 'bg-gradient-to-r from-amber-950 to-yellow-950 border-amber-500/60 text-amber-300 hover:from-amber-900 hover:to-yellow-900 hover:border-amber-400 hover:shadow-[0_0_15px_rgba(245,158,11,0.4)]' 
    },
    { 
      type: ATTACK_TYPES.DDOS, 
      label: 'DDoS Flood', 
      icon: Zap, 
      color: 'bg-gradient-to-r from-red-950 to-rose-900 border-red-500 text-red-200 hover:from-red-900 hover:to-rose-800 hover:border-red-400 hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] font-extrabold animate-pulse' 
    },
    { 
      type: ATTACK_TYPES.PORT_SCAN, 
      label: 'Recon Port Scan', 
      icon: Radio, 
      color: 'bg-gradient-to-r from-purple-950 to-indigo-950 border-purple-500/60 text-purple-300 hover:from-purple-900 hover:to-indigo-900 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]' 
    },
    { 
      type: ATTACK_TYPES.MALWARE, 
      label: 'C2 Malware Beacon', 
      icon: Skull, 
      color: 'bg-gradient-to-r from-pink-950 to-purple-950 border-pink-500/70 text-pink-300 hover:from-pink-900 hover:to-purple-900 hover:border-pink-400 hover:shadow-[0_0_18px_rgba(236,72,153,0.5)] font-bold' 
    },
    { 
      type: ATTACK_TYPES.NORMAL, 
      label: 'Normal Web Traffic', 
      icon: Cpu, 
      color: 'bg-gradient-to-r from-emerald-950 to-teal-950 border-emerald-500/60 text-emerald-300 hover:from-emerald-900 hover:to-teal-900 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]' 
    }
  ];

  return (
    <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-md">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
            Threat Vector Injection Console
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/40 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-cyan-400" /> Interactive Simulation
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {attacks.map((attack) => {
          const Icon = attack.icon;
          return (
            <button
              key={attack.type}
              onClick={() => onTriggerAttack(attack.type)}
              className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 active:scale-95 shadow-md ${attack.color}`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate">{attack.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

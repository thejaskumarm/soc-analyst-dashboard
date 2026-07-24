import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StatCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  trend, 
  trendValue, 
  color = 'cyan'
}) {
  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return {
          card: 'border-red-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-red-950/40 soc-card-glow-red hover:border-red-500',
          iconBg: 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]',
          value: 'text-red-400 text-glow-red',
          badge: 'bg-red-950/80 text-red-300 border-red-500/50'
        };
      case 'amber':
        return {
          card: 'border-amber-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/40 soc-card-glow-amber hover:border-amber-500',
          iconBg: 'bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(245,158,11,0.5)]',
          value: 'text-amber-400 text-glow-amber',
          badge: 'bg-amber-950/80 text-amber-300 border-amber-500/50'
        };
      case 'emerald':
        return {
          card: 'border-emerald-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40 soc-card-glow-emerald hover:border-emerald-500',
          iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)]',
          value: 'text-emerald-400 text-glow-emerald',
          badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
        };
      case 'purple':
        return {
          card: 'border-purple-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-purple-950/40 soc-card-glow-purple hover:border-purple-500',
          iconBg: 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]',
          value: 'text-purple-300',
          badge: 'bg-purple-950/80 text-purple-300 border-purple-500/50'
        };
      default:
        return {
          card: 'border-cyan-500/40 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 soc-card-glow-cyan hover:border-cyan-400',
          iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-[0_0_20px_rgba(6,182,212,0.5)]',
          value: 'text-cyan-300 text-glow-cyan',
          badge: 'bg-cyan-950/80 text-cyan-300 border-cyan-500/50'
        };
    }
  };

  const theme = getColorClasses();

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 soc-card relative overflow-hidden group ${theme.card}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wider text-slate-300">{title}</p>
          <h3 className={`text-3xl lg:text-4xl font-extrabold font-mono mt-1 tracking-tight ${theme.value}`}>
            {value}
          </h3>
        </div>
        <div className={`p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110 ${theme.iconBg}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-slate-300 font-medium">{subtext}</span>
        {trend && (
          <span className={`flex items-center gap-1 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg border ${theme.badge}`}>
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5 text-red-400" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5 text-slate-400" />}
            {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Play, 
  Pause, 
  FastForward, 
  LayoutDashboard, 
  ScrollText, 
  AlertTriangle, 
  BarChart3, 
  ShieldCheck,
  Globe,
  Sparkles
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  isStreaming, 
  setIsStreaming, 
  streamSpeed, 
  setStreamSpeed,
  stats,
  threatLevel
}) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getThreatBadge = () => {
    switch (threatLevel) {
      case 'CRITICAL':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-red-950 via-rose-950 to-red-900 border-2 border-red-500 rounded-full text-red-200 font-extrabold text-xs animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)] text-glow-red">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
            DEFCON 1 • CRITICAL THREAT
          </div>
        );
      case 'SEVERE':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-rose-950 to-pink-950 border border-rose-500 rounded-full text-rose-200 font-bold text-xs shadow-[0_0_15px_rgba(244,63,94,0.5)]">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
            DEFCON 2 • SEVERE RISKS
          </div>
        );
      case 'ELEVATED':
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-amber-950 to-yellow-950 border border-amber-500 rounded-full text-amber-200 font-bold text-xs shadow-[0_0_15px_rgba(245,158,11,0.4)]">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            DEFCON 3 • ELEVATED WATCH
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-emerald-950 to-teal-950 border border-emerald-500/60 rounded-full text-emerald-300 font-bold text-xs shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            DEFCON 5 • NORMAL OPS
          </div>
        );
    }
  };

  const tabs = [
    { id: 'dashboard', label: 'SOC Overview', icon: LayoutDashboard, gradient: 'from-cyan-500 to-blue-600' },
    { id: 'logs', label: 'Live Log Feed', icon: ScrollText, badge: stats.totalLogs, badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40', gradient: 'from-blue-500 to-indigo-600' },
    { id: 'alerts', label: 'Threat Alerts', icon: AlertTriangle, badge: stats.unhandledAlerts > 0 ? stats.unhandledAlerts : null, badgeBg: 'bg-red-500 text-white font-bold animate-pulse', gradient: 'from-red-500 to-rose-600' },
    { id: 'grafana', label: 'Grafana Visualizer', icon: BarChart3, gradient: 'from-orange-500 to-amber-600' },
    { id: 'firewall', label: 'Firewall & IP Bans', icon: ShieldCheck, badge: stats.blockedIPs, badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40', gradient: 'from-purple-500 to-pink-600' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/90 px-4 lg:px-6 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Brand & Threat Badge */}
        <div className="flex items-center gap-4 w-full lg:w-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-cyan-900 via-blue-900 to-indigo-900 border-2 border-cyan-400 rounded-2xl text-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.5)]">
              <ShieldAlert className="w-6 h-6 animate-pulse text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-teal-300 via-blue-400 to-purple-400 text-glow-cyan">
                  AEGIS SOC COMMAND
                </h1>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gradient-to-r from-cyan-950 to-blue-950 text-cyan-300 border border-cyan-400/50 font-bold shadow-sm flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> v2.4 VIBRANT
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-mono mt-0.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Real-Time Security Operations Center
              </p>
            </div>
          </div>

          <div className="hidden sm:block">
            {getThreatBadge()}
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto max-w-full shadow-inner">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all duration-300 whitespace-nowrap ${
                  isActive 
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-lg shadow-cyan-500/20 border border-white/20 scale-[1.02]` 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {tab.label}
                {tab.badge !== null && tab.badge !== undefined && tab.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold border ${
                    isActive ? 'bg-black/40 text-white border-white/30' : (tab.badgeBg || 'bg-slate-800 text-slate-300 border-slate-700')
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Live Controller & UTC Clock */}
        <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
          {/* Streaming Controls */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setIsStreaming(!isStreaming)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all duration-200 shadow-md ${
                isStreaming 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border border-emerald-400/50 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-500/20' 
                  : 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white border border-amber-400/50 hover:from-amber-500 hover:to-yellow-500 shadow-amber-500/20'
              }`}
            >
              {isStreaming ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" /> PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" /> STREAM
                </>
              )}
            </button>

            <div className="flex items-center gap-1 text-slate-300 text-xs font-mono px-1">
              <FastForward className="w-3.5 h-3.5 text-cyan-400" />
              <select 
                value={streamSpeed} 
                onChange={(e) => setStreamSpeed(Number(e.target.value))}
                className="bg-slate-950 text-cyan-300 font-bold text-xs rounded-lg border border-slate-700 px-2 py-1 outline-none focus:border-cyan-400"
              >
                <option value={1000}>1x Speed</option>
                <option value={500}>2x Speed</option>
                <option value={200}>5x Speed</option>
                <option value={100}>10x Speed</option>
              </select>
            </div>
          </div>

          {/* Clock */}
          <div className="hidden xl:flex flex-col text-right font-mono text-xs text-slate-400 border-l border-slate-800 pl-4">
            <span className="text-cyan-300 font-bold text-glow-cyan">{time.toLocaleTimeString()} UTC</span>
            <span className="text-[10px] text-slate-400">{time.toISOString().slice(0, 10)}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

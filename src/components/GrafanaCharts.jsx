import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  CartesianGrid 
} from 'recharts';
import { BarChart3, PieChart as PieIcon, Activity, Globe, ShieldAlert } from 'lucide-react';

const SEVERITY_COLORS = {
  LOW: '#10b981',     // Emerald Green
  MEDIUM: '#f59e0b',  // Cyber Amber
  HIGH: '#f43f5e',    // Neon Rose
  CRITICAL: '#ef4444' // Crimson Red
};

const ATTACK_TYPE_COLORS = [
  '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#3b82f6'
];

// Vibrant Custom Tooltip
const CustomGrafanaTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-950/95 border-2 border-slate-700 p-3.5 rounded-xl shadow-2xl font-mono text-xs backdrop-blur-xl">
        <p className="text-cyan-300 font-bold mb-1.5 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>{label}</span>
          <span className="text-[10px] text-slate-500">LIVE FEED</span>
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} className="flex items-center gap-3 my-1">
            <span className="w-3 h-3 rounded-full shadow-md" style={{ backgroundColor: entry.color }}></span>
            <span className="text-slate-300 font-medium">{entry.name}:</span>
            <span className="font-extrabold text-white ml-auto text-sm" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function GrafanaCharts({ timeSeriesData, attackTypeCounts, severityCounts, logs }) {
  // Format attack distribution data
  const attackData = Object.keys(attackTypeCounts).map((key) => ({
    name: key,
    value: attackTypeCounts[key]
  }));

  // Format severity breakdown
  const severityData = [
    { name: 'Low', count: severityCounts.LOW || 0, color: SEVERITY_COLORS.LOW },
    { name: 'Medium', count: severityCounts.MEDIUM || 0, color: SEVERITY_COLORS.MEDIUM },
    { name: 'High', count: severityCounts.HIGH || 0, color: SEVERITY_COLORS.HIGH },
    { name: 'Critical', count: severityCounts.CRITICAL || 0, color: SEVERITY_COLORS.CRITICAL }
  ];

  // Top malicious origin IPs
  const ipCounts = logs.reduce((acc, log) => {
    if (log.severity !== 'LOW') {
      acc[log.sourceIP] = (acc[log.sourceIP] || 0) + 1;
    }
    return acc;
  }, {});

  const topIPs = Object.keys(ipCounts)
    .map(ip => ({ ip, count: ipCounts[ip] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Panel Row 1: Grafana Time Series Area Chart */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card soc-card-glow-cyan">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-cyan-600 to-blue-600 border border-cyan-400/50 rounded-xl text-slate-950 font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.4)]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                Live Network Throughput & Malicious Threat Spikes
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Grafana Panel • Real-time event rate comparison (Total vs Malicious Threat Events)
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 shadow-sm">
            AUTO-REFRESH: 1s
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timeSeriesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.6}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
              <XAxis dataKey="time" stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
              <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} />
              <Tooltip content={<CustomGrafanaTooltip />} />
              <Legend wrapperStyle={{ fontSize: 12, color: '#cbd5e1', paddingTop: 10, fontWeight: 700 }} />
              <Area 
                type="monotone" 
                dataKey="total" 
                name="Total Traffic Rate" 
                stroke="#06b6d4" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
              <Area 
                type="monotone" 
                dataKey="threats" 
                name="Malicious Threat Spikes" 
                stroke="#ef4444" 
                strokeWidth={3.5}
                fillOpacity={1} 
                fill="url(#colorThreats)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Panel Row 2: Attack Distribution, Severity Breakdown & Top Attacker IPs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attack Vector Distribution */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card soc-card-glow-purple lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white font-bold shadow-md">
              <PieIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">Attack Type Distribution</h3>
          </div>
          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attackData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {attackData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ATTACK_TYPE_COLORS[index % ATTACK_TYPE_COLORS.length]} stroke="#0f172a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomGrafanaTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold mt-2 text-slate-300 border-t border-slate-800 pt-3">
            {attackData.slice(0, 4).map((item, idx) => (
              <div key={item.name} className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: ATTACK_TYPE_COLORS[idx % ATTACK_TYPE_COLORS.length] }}></span>
                <span className="truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Severity Bar Chart */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card soc-card-glow-amber lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-slate-950 font-bold shadow-md">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">Severity Level Breakdown</h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 700 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 11, fontWeight: 700 }} />
                <Tooltip content={<CustomGrafanaTooltip />} />
                <Bar dataKey="count" name="Event Count" radius={[6, 6, 0, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Malicious Source IPs */}
        <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card soc-card-glow-red lg:col-span-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-bold shadow-md">
              <Globe className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-white">Top Malicious Source IPs</h3>
          </div>
          
          <div className="space-y-3 mt-3">
            {topIPs.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono py-8 text-center">No malicious IPs recorded yet</p>
            ) : (
              topIPs.map((item, idx) => (
                <div key={item.ip} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-gradient-to-tr from-red-600 to-rose-500 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                      #{idx + 1}
                    </span>
                    <span className="text-slate-100 font-bold">{item.ip}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-rose-400 font-extrabold bg-rose-950/80 px-2 py-0.5 rounded border border-rose-500/40">
                      {item.count} attacks
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

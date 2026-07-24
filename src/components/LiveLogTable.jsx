import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Copy, 
  Check, 
  Ban, 
  ArrowDownCircle, 
  PauseCircle,
  Terminal
} from 'lucide-react';
import { getSeverityStyle, SEVERITY } from '../mock/logGenerator';

export default function LiveLogTable({ 
  logs, 
  onSelectLog, 
  onBlockIP,
  autoScroll,
  setAutoScroll 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [copiedIp, setCopiedIp] = useState(null);

  const tableBottomRef = useRef(null);

  useEffect(() => {
    if (autoScroll && tableBottomRef.current) {
      tableBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const handleCopyIp = (ip, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesSeverity = severityFilter === 'ALL' || log.severity === severityFilter;
    const matchesSearch = 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.sourceIP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetHost.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.attackType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.payload.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.geo.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSeverity && matchesSearch;
  });

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 soc-card flex flex-col h-full overflow-hidden shadow-2xl">
      {/* Header Bar with Search & Filters */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-slate-950 font-bold shadow-md">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Real-Time SOC Event Stream
            </h2>
            <span className="font-mono text-[11px] text-cyan-300 font-bold">
              {filteredLogs.length} Events Buffered
            </span>
          </div>
        </div>

        {/* Search & Severity Filter Pills */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Filter IP, Payload, Rule..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono placeholder-slate-500 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          {/* Color Coded Severity Filter Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs font-mono">
            {[
              { id: 'ALL', label: 'ALL', activeBg: 'bg-cyan-600 text-white shadow-cyan-500/20' },
              { id: SEVERITY.LOW, label: 'LOW', activeBg: 'bg-emerald-600 text-white shadow-emerald-500/20' },
              { id: SEVERITY.MEDIUM, label: 'MED', activeBg: 'bg-amber-500 text-slate-950 font-bold shadow-amber-500/20' },
              { id: SEVERITY.HIGH, label: 'HIGH', activeBg: 'bg-rose-600 text-white shadow-rose-500/20' },
              { id: SEVERITY.CRITICAL, label: 'CRIT', activeBg: 'bg-red-600 text-white font-extrabold animate-pulse shadow-red-500/40' }
            ].map((sev) => {
              const isActive = severityFilter === sev.id;

              return (
                <button
                  key={sev.id}
                  onClick={() => setSeverityFilter(sev.id)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all duration-200 ${
                    isActive ? `${sev.activeBg} shadow-md scale-105` : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                  }`}
                >
                  {sev.label}
                </button>
              );
            })}
          </div>

          {/* Auto Scroll Button */}
          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
              autoScroll 
                ? 'bg-cyan-950 border-cyan-500/60 text-cyan-300 shadow-md shadow-cyan-500/10' 
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {autoScroll ? (
              <>
                <ArrowDownCircle className="w-4 h-4 text-cyan-400 animate-bounce" /> AUTO-SCROLL ON
              </>
            ) : (
              <>
                <PauseCircle className="w-4 h-4 text-slate-400" /> PAUSED
              </>
            )}
          </button>
        </div>
      </div>

      {/* Table Body */}
      <div className="flex-1 overflow-y-auto max-h-[550px] scrollbar-thin">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead className="sticky top-0 bg-slate-950/95 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px] z-10 backdrop-blur-md">
            <tr>
              <th className="py-3 px-4">Severity</th>
              <th className="py-3 px-4">Timestamp (UTC)</th>
              <th className="py-3 px-4">Source IP & Location</th>
              <th className="py-3 px-4">Attack / Rule</th>
              <th className="py-3 px-4">Target Host</th>
              <th className="py-3 px-4">Payload Preview</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-slate-500 font-mono">
                  No log entries match the selected search criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const style = getSeverityStyle(log.severity);
                return (
                  <tr 
                    key={log.id} 
                    onClick={() => onSelectLog(log)}
                    className={`hover:bg-slate-800/70 cursor-pointer transition-colors ${
                      log.severity === SEVERITY.CRITICAL ? 'bg-red-950/30' : 
                      log.severity === SEVERITY.HIGH ? 'bg-rose-950/20' : 
                      log.severity === SEVERITY.MEDIUM ? 'bg-amber-950/15' : ''
                    }`}
                  >
                    {/* Severity Badge */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-extrabold ${style.badge}`}>
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        {log.severity}
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-3 px-4 text-slate-300 font-bold whitespace-nowrap">
                      {log.timestamp.slice(11, 19)}
                    </td>

                    {/* Source IP & GEO */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                          {log.sourceIP}
                        </span>
                        <button 
                          onClick={(e) => handleCopyIp(log.sourceIP, e)}
                          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 transition-colors"
                          title="Copy IP"
                        >
                          {copiedIp === log.sourceIP ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{log.geo}</div>
                    </td>

                    {/* Attack Type */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`font-extrabold ${style.text}`}>
                        {log.attackType}
                      </span>
                      <div className="text-[10px] text-slate-500">{log.ruleTriggered}</div>
                    </td>

                    {/* Target Host */}
                    <td className="py-3 px-4 text-slate-200 font-semibold whitespace-nowrap">
                      {log.targetHost}
                    </td>

                    {/* Payload Preview */}
                    <td className="py-3 px-4 max-w-xs truncate text-slate-300" title={log.payload}>
                      <span className="text-cyan-400 mr-1.5 font-bold">[{log.method}]</span>
                      {log.payload}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        {log.severity !== SEVERITY.LOW && (
                          <button
                            onClick={() => onBlockIP(log.sourceIP)}
                            className="p-1.5 rounded-lg bg-red-950/80 text-red-200 border border-red-500/50 hover:bg-red-900 transition-all text-[11px] flex items-center gap-1 font-bold shadow-sm"
                            title="Block Source IP"
                          >
                            <Ban className="w-3.5 h-3.5 text-red-400" /> Block
                          </button>
                        )}
                        <button
                          onClick={() => onSelectLog(log)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all text-[11px] flex items-center gap-1 font-bold"
                          title="Inspect Log Payload"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" /> Inspect
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
            <tr ref={tableBottomRef} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

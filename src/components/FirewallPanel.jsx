import React, { useState } from 'react';
import { ShieldCheck, Ban, Plus, Globe, Clock, CheckCircle } from 'lucide-react';

export default function FirewallPanel({ blockedIPs, onUnblockIP, onBlockIP }) {
  const [manualIp, setManualIp] = useState('');
  const [reason, setReason] = useState('Manual SOC Analyst Rule');

  const handleAddBan = (e) => {
    e.preventDefault();
    if (!manualIp) return;
    onBlockIP(manualIp, reason);
    setManualIp('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Ban Form */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card soc-card-glow-purple flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-gradient-to-tr from-purple-600 to-pink-600 rounded-2xl text-white font-bold shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white uppercase tracking-wider">
              Automated Ingress Firewall & IP Blacklist Control
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Active IP block rules enforced at edge gateway ({blockedIPs.length} IPs currently blacklisted).
            </p>
          </div>
        </div>

        {/* Manual Ban Input Form */}
        <form onSubmit={handleAddBan} className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto font-mono text-xs">
          <input
            type="text"
            placeholder="IP Address (e.g. 45.142.214.12)"
            value={manualIp}
            onChange={(e) => setManualIp(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-100 font-bold outline-none focus:border-red-400 w-full sm:w-60 shadow-inner"
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold hover:from-red-500 hover:to-rose-500 transition-all shadow-lg flex items-center justify-center gap-2 whitespace-nowrap shadow-red-500/25"
          >
            <Ban className="w-4 h-4 text-white" /> Enforce Ban
          </button>
        </form>
      </div>

      {/* Blacklist Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 soc-card overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs font-extrabold text-white uppercase font-mono tracking-wider">
            Active Blacklisted IP Enforcement Table
          </span>
          <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-3 py-1 rounded-full border border-red-500/40">
            ACTION: DROP PACKETS (REJECT)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">Blacklisted IP</th>
                <th className="py-3.5 px-5">Ban Timestamp</th>
                <th className="py-3.5 px-5">Trigger Reason</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {blockedIPs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-slate-500 font-mono">
                    No IP addresses are currently blacklisted.
                  </td>
                </tr>
              ) : (
                blockedIPs.map((item) => (
                  <tr key={item.ip} className="hover:bg-slate-800/60">
                    <td className="py-3.5 px-5 font-extrabold text-red-400 flex items-center gap-2">
                      <Ban className="w-4 h-4 text-red-500" />
                      {item.ip}
                    </td>
                    <td className="py-3.5 px-5 text-slate-300 font-bold">
                      {item.timestamp ? item.timestamp.slice(11, 19) + ' UTC' : 'Just now'}
                    </td>
                    <td className="py-3.5 px-5 text-slate-200 font-medium">
                      {item.reason || 'Automated Threat Mitigation'}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="px-2.5 py-1 rounded-md bg-red-950 text-red-300 border border-red-500/50 text-[10px] font-extrabold shadow-sm">
                        ENFORCED (DROP)
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => onUnblockIP(item.ip)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold"
                      >
                        Unblock IP
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

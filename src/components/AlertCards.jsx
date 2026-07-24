import React from 'react';
import { ShieldAlert, Ban, CheckCircle, ExternalLink, Clock, Sparkles } from 'lucide-react';
import { getSeverityStyle } from '../mock/logGenerator';

export default function AlertCards({ alerts, onBlockIP, onAcknowledge, onEscalate, onSelectLog }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="p-12 rounded-2xl border border-slate-800 bg-slate-900/90 text-center soc-card soc-card-glow-emerald">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-slate-950 font-bold flex items-center justify-center mx-auto mb-4 shadow-[0_0_25px_rgba(16,185,129,0.5)]">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-extrabold text-white">All Security Threats Triaged & Controlled</h3>
        <p className="text-xs text-slate-300 max-w-md mx-auto mt-1 font-mono leading-relaxed">
          No unhandled high or critical severity alerts are pending analyst action.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white font-bold shadow-md">
            <ShieldAlert className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-base font-extrabold text-white uppercase tracking-wider">
            Active Threat Triage Center ({alerts.length} Pending)
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          Sorted by Highest Severity
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);

          return (
            <div 
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all duration-300 ${style.bg} ${style.border} ${
                alert.severity === 'CRITICAL' ? 'soc-card-glow-red' : 
                alert.severity === 'HIGH' ? 'soc-card-glow-red' : 'soc-card-glow-amber'
              } flex flex-col justify-between space-y-4 soc-card`}
            >
              {/* Card Top Header */}
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-md border text-[11px] font-extrabold shadow-sm ${style.badge}`}>
                      {alert.severity}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {alert.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/40">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    {alert.timestamp.slice(11, 19)} UTC
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-white mt-2.5 flex items-center gap-2">
                  {alert.attackType}
                </h3>

                <p className="text-xs text-slate-200 font-sans mt-1.5 leading-relaxed font-medium">
                  {alert.description}
                </p>
              </div>

              {/* Technical Attributes Box */}
              <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 font-mono text-xs space-y-1.5 shadow-inner">
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Source IP:</span>
                  <span className="text-cyan-300 font-extrabold">{alert.sourceIP} ({alert.geo})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Target Host:</span>
                  <span className="text-slate-200 font-bold">{alert.targetHost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Rule Triggered:</span>
                  <span className="text-amber-300 font-bold">{alert.ruleTriggered}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={() => onSelectLog(alert)}
                  className="text-cyan-400 hover:text-cyan-300 font-mono text-xs font-bold flex items-center gap-1 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Full Inspector
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onBlockIP(alert.sourceIP)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold hover:from-red-500 hover:to-rose-500 transition-all text-xs flex items-center gap-1 shadow-md shadow-red-500/20"
                  >
                    <Ban className="w-3.5 h-3.5" /> Block IP
                  </button>

                  <button
                    onClick={() => onEscalate(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold hover:from-amber-400 hover:to-yellow-400 transition-all text-xs shadow-md shadow-amber-500/20"
                  >
                    Escalate
                  </button>

                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-bold text-xs flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Dismiss
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

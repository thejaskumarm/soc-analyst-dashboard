import React from 'react';
import { X, ShieldAlert, Ban, CheckCircle, AlertTriangle, Terminal, Globe, Server, FileCode, Sparkles } from 'lucide-react';
import { getSeverityStyle } from '../mock/logGenerator';

export default function LogDetailModal({ log, onClose, onBlockIP, onAcknowledgeAlert, onEscalateAlert }) {
  if (!log) return null;

  const style = getSeverityStyle(log.severity);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl animate-fadeIn">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden soc-card">
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${style.bg} ${style.border}`}>
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-xl border ${style.badge} shadow-lg`}>
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-slate-300">{log.id}</span>
                <span className={`px-2.5 py-0.5 rounded-md border text-[10px] font-extrabold ${style.badge}`}>
                  {log.severity} SEVERITY
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white mt-0.5 tracking-wide">{log.attackType}</h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto font-mono text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Timestamp (UTC)</span>
              <span className="text-cyan-300 font-extrabold text-sm">{log.timestamp}</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Source IP & Location</span>
              <span className="text-white font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                <Globe className="w-4 h-4 text-cyan-400" /> {log.sourceIP}
              </span>
              <span className="text-[11px] text-slate-400 block mt-0.5 font-semibold">{log.geo}</span>
            </div>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Host</span>
              <span className="text-purple-300 font-extrabold text-sm flex items-center gap-1.5 mt-0.5">
                <Server className="w-4 h-4 text-purple-400" /> {log.targetHost}
              </span>
            </div>
          </div>

          {/* Security Rule & Event Details */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2 shadow-inner">
            <div className="flex items-center justify-between">
              <span className="text-slate-200 font-extrabold flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" /> SIEM Security Rule Triggered
              </span>
              <span className="text-cyan-300 font-bold px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700">
                {log.ruleTriggered}
              </span>
            </div>
            <p className="text-slate-300 font-sans text-xs leading-relaxed font-medium">
              {log.description}
            </p>
          </div>

          {/* Raw Payload Inspection */}
          <div className="space-y-2">
            <label className="text-slate-300 font-extrabold flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" /> Raw HTTP Request / Security Event Payload
            </label>
            <pre className="p-4 bg-slate-950 text-emerald-400 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap break-all text-[11px] leading-relaxed shadow-inner font-mono font-bold">
{`METHOD: ${log.method}
PROTOCOL: ${log.protocol}
STATUS_CODE: ${log.statusCode}
USER_AGENT: ${log.userAgent}
PAYLOAD: ${log.payload}`}
            </pre>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {log.severity !== 'LOW' && (
              <button
                onClick={() => {
                  onBlockIP(log.sourceIP);
                  onClose();
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold hover:from-red-500 hover:to-rose-500 transition-all text-xs flex items-center gap-2 shadow-lg shadow-red-500/20"
              >
                <Ban className="w-4 h-4" /> Block IP ({log.sourceIP})
              </button>
            )}

            <button
              onClick={() => {
                onEscalateAlert(log.id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-extrabold hover:from-amber-400 hover:to-yellow-400 transition-all text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <AlertTriangle className="w-4 h-4" /> Escalate Incident
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onAcknowledgeAlert(log.id);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors font-bold text-xs flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Acknowledge
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

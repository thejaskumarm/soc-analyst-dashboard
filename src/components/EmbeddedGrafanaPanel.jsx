import React, { useState } from 'react';
import { BarChart3, Download, ExternalLink, Globe, Settings, Check, Sparkles } from 'lucide-react';
import { downloadGrafanaJsonFile } from '../utils/exportGrafanaJson';

export default function EmbeddedGrafanaPanel() {
  const [grafanaUrl, setGrafanaUrl] = useState('https://play.grafana.org/d-solo/000000012/grafana-play-home?orgId=1&panelId=2&theme=dark&kiosk');
  const [currentUrl, setCurrentUrl] = useState('https://play.grafana.org/d-solo/000000012/grafana-play-home?orgId=1&panelId=2&theme=dark&kiosk');
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'Grafana Live Demo', url: 'https://play.grafana.org/d-solo/000000012/grafana-play-home?orgId=1&panelId=2&theme=dark&kiosk' },
    { label: 'Prometheus Network Throughput', url: 'https://play.grafana.org/d-solo/000000029/prometheus-stats?orgId=1&panelId=1&theme=dark&kiosk' },
    { label: 'Custom Local Grafana (http://localhost:3000)', url: 'http://localhost:3000/d-solo/soc-analyst-dashboard?orgId=1&theme=dark&kiosk' }
  ];

  const handleApplyUrl = (e) => {
    e.preventDefault();
    setCurrentUrl(grafanaUrl);
  };

  const handleDownloadJson = () => {
    downloadGrafanaJsonFile();
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/90 soc-card soc-card-glow-amber flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-gradient-to-tr from-orange-600 to-amber-500 rounded-2xl text-slate-950 font-bold shadow-[0_0_25px_rgba(249,115,22,0.5)]">
            <BarChart3 className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              GRAFANA MONITORING INTEGRATION & JSON EXPORTER
            </h2>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              Embed external Grafana dashboards or download pre-configured SOC JSON dashboards for Loki/Prometheus.
            </p>
          </div>
        </div>

        {/* Action Button: Export Grafana JSON */}
        <button
          onClick={handleDownloadJson}
          className="w-full md:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-extrabold text-xs transition-all shadow-lg hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap shadow-orange-500/25"
        >
          {copied ? <Check className="w-4 h-4 text-slate-950" /> : <Download className="w-4 h-4" />}
          {copied ? 'Dashboard JSON Exported!' : 'Export Grafana Dashboard JSON'}
        </button>
      </div>

      {/* Embedded Grafana Configurator */}
      <div className="p-5 rounded-2xl border border-slate-800 bg-slate-950 font-mono text-xs shadow-inner">
        <form onSubmit={handleApplyUrl} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="url"
              value={grafanaUrl}
              onChange={(e) => setGrafanaUrl(e.target.value)}
              placeholder="Enter Grafana Embed URL (e.g. http://localhost:3000/d-solo/...)"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-3 py-2.5 text-slate-100 outline-none focus:border-orange-400 font-bold text-xs"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-gradient-to-r from-slate-800 to-slate-700 hover:from-slate-700 hover:to-slate-600 text-slate-100 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-600 shadow-md"
          >
            <Settings className="w-4 h-4 text-orange-400" /> Load Embed Panel
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-900 text-xs">
          <span className="text-slate-400 font-bold">Quick Presets:</span>
          {presets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setGrafanaUrl(preset.url);
                setCurrentUrl(preset.url);
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grafana IFrame Display Window */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl relative min-h-[500px] flex flex-col soc-card">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between font-mono text-xs text-slate-400">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-white font-extrabold">Grafana Live Viewport Stream</span>
          </div>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline flex items-center gap-1.5 text-xs font-bold"
          >
            Open in New Window <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="flex-1 w-full h-[520px] bg-slate-950 relative">
          <iframe
            src={currentUrl}
            title="Embedded Grafana SOC Dashboard"
            className="w-full h-full border-0"
            allow="fullscreen"
          />
        </div>
      </div>
    </div>
  );
}

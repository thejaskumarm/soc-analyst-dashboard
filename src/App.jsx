import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import ThreatLevelMeter from './components/ThreatLevelMeter';
import StatCard from './components/StatCard';
import AttackSimulator from './components/AttackSimulator';
import GrafanaCharts from './components/GrafanaCharts';
import LiveLogTable from './components/LiveLogTable';
import LogDetailModal from './components/LogDetailModal';
import AlertCards from './components/AlertCards';
import EmbeddedGrafanaPanel from './components/EmbeddedGrafanaPanel';
import FirewallPanel from './components/FirewallPanel';

import { 
  generateLogEntry, 
  generateInitialLogs, 
  SEVERITY, 
  ATTACK_TYPES 
} from './mock/logGenerator';

import { 
  Activity, 
  ShieldAlert, 
  AlertTriangle, 
  Ban, 
  Radio, 
  Layers,
  Cpu,
  RefreshCw
} from 'lucide-react';

export default function App() {
  // Main State
  const [logs, setLogs] = useState(() => generateInitialLogs(30));
  const [isStreaming, setIsStreaming] = useState(true);
  const [streamSpeed, setStreamSpeed] = useState(1000);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedLog, setSelectedLog] = useState(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Blacklisted IPs
  const [blockedIPs, setBlockedIPs] = useState([
    { ip: '45.142.214.12', timestamp: new Date(Date.now() - 3600000).toISOString(), reason: 'Automated DDoS Mitigation' },
    { ip: '103.251.170.89', timestamp: new Date(Date.now() - 7200000).toISOString(), reason: 'SQL Injection WAF Trigger' }
  ]);

  // Real-time Time Series for Grafana Chart
  const [timeSeriesData, setTimeSeriesData] = useState(() => {
    const data = [];
    const now = Date.now();
    for (let i = 15; i >= 0; i--) {
      const timeStr = new Date(now - i * 5000).toLocaleTimeString();
      data.push({
        time: timeStr,
        total: Math.floor(Math.random() * 15 + 10),
        threats: Math.floor(Math.random() * 4)
      });
    }
    return data;
  });

  // Calculate Statistics
  const totalLogs = logs.length;
  
  const severityCounts = logs.reduce((acc, log) => {
    acc[log.severity] = (acc[log.severity] || 0) + 1;
    return acc;
  }, { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 });

  const attackTypeCounts = logs.reduce((acc, log) => {
    if (log.attackType !== ATTACK_TYPES.NORMAL) {
      acc[log.attackType] = (acc[log.attackType] || 0) + 1;
    }
    return acc;
  }, {});

  const activeAlerts = logs.filter(log => (log.severity === SEVERITY.HIGH || log.severity === SEVERITY.CRITICAL) && !log.acknowledged);

  // Determine Global Threat Level (DEFCON)
  const getThreatLevel = () => {
    const criticalCount = severityCounts.CRITICAL || 0;
    const highCount = severityCounts.HIGH || 0;

    if (criticalCount >= 3) return 'CRITICAL';
    if (criticalCount >= 1 || highCount >= 5) return 'SEVERE';
    if (highCount >= 2 || (severityCounts.MEDIUM || 0) >= 6) return 'ELEVATED';
    return 'NORMAL';
  };

  const threatLevel = getThreatLevel();

  // Handle adding new log
  const pushNewLog = (newLog) => {
    setLogs(prevLogs => {
      const updated = [...prevLogs, newLog];
      if (updated.length > 100) updated.shift(); // keep max 100 logs in memory
      return updated;
    });

    // Update Grafana Time-Series Data Point
    setTimeSeriesData(prev => {
      const timeStr = new Date().toLocaleTimeString();
      const lastPoint = prev[prev.length - 1] || { total: 0, threats: 0 };
      const isThreat = newLog.severity === SEVERITY.HIGH || newLog.severity === SEVERITY.CRITICAL;
      
      const newPoint = {
        time: timeStr,
        total: lastPoint.total + 1,
        threats: isThreat ? lastPoint.threats + 1 : lastPoint.threats
      };

      const updated = [...prev.slice(1), newPoint];
      return updated;
    });
  };

  // Streaming Interval Effect
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newLog = generateLogEntry();
      pushNewLog(newLog);
    }, streamSpeed);

    return () => clearInterval(interval);
  }, [isStreaming, streamSpeed]);

  // Actions
  const handleTriggerAttack = (attackType) => {
    const attackLog = generateLogEntry(attackType);
    pushNewLog(attackLog);
  };

  const handleBlockIP = (ip, reason = 'Analyst Manual Block') => {
    if (blockedIPs.some(item => item.ip === ip)) return;
    setBlockedIPs(prev => [{ ip, timestamp: new Date().toISOString(), reason }, ...prev]);
    
    // mark matching logs as blocked
    setLogs(prev => prev.map(log => log.sourceIP === ip ? { ...log, blocked: true } : log));
  };

  const handleUnblockIP = (ip) => {
    setBlockedIPs(prev => prev.filter(item => item.ip !== ip));
  };

  const handleAcknowledgeAlert = (logId) => {
    setLogs(prev => prev.map(log => log.id === logId ? { ...log, acknowledged: true } : log));
  };

  const handleEscalateAlert = (logId) => {
    setLogs(prev => prev.map(log => log.id === logId ? { ...log, escalated: true, acknowledged: true } : log));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans scanline-overlay">
      {/* Header Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isStreaming={isStreaming}
        setIsStreaming={setIsStreaming}
        streamSpeed={streamSpeed}
        setStreamSpeed={setStreamSpeed}
        threatLevel={threatLevel}
        stats={{
          totalLogs,
          unhandledAlerts: activeAlerts.length,
          blockedIPs: blockedIPs.length
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Top Section: Threat Meter Banner & Attack Simulator */}
        <ThreatLevelMeter threatLevel={threatLevel} severityCounts={severityCounts} />

        <AttackSimulator onTriggerAttack={handleTriggerAttack} />

        {/* Dynamic Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total Events Analyzed"
            value={totalLogs}
            subtext="Live streaming log buffer"
            icon={Activity}
            color="cyan"
            trend={isStreaming ? 'up' : 'neutral'}
            trendValue={isStreaming ? 'LIVE STREAM' : 'PAUSED'}
          />
          <StatCard 
            title="Critical Threat Alerts"
            value={severityCounts.CRITICAL + severityCounts.HIGH}
            subtext="High severity attacks detected"
            icon={ShieldAlert}
            color="red"
            trend="up"
            trendValue={`${activeAlerts.length} Active`}
          />
          <StatCard 
            title="Medium Risk Probes"
            value={severityCounts.MEDIUM}
            subtext="Brute-force & port scans"
            icon={AlertTriangle}
            color="amber"
            trend="neutral"
            trendValue="Monitoring"
          />
          <StatCard 
            title="Firewall Blacklisted IPs"
            value={blockedIPs.length}
            subtext="Mitigated threat actors"
            icon={Ban}
            color="purple"
            trend="down"
            trendValue="Enforced"
          />
        </div>

        {/* Tab View Switching */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Grafana Interactive Visualization Panels */}
            <GrafanaCharts 
              timeSeriesData={timeSeriesData}
              attackTypeCounts={attackTypeCounts}
              severityCounts={severityCounts}
              logs={logs}
            />

            {/* Quick Live Table Preview */}
            <div className="h-[450px]">
              <LiveLogTable 
                logs={logs}
                onSelectLog={setSelectedLog}
                onBlockIP={handleBlockIP}
                autoScroll={autoScroll}
                setAutoScroll={setAutoScroll}
              />
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="h-[700px]">
            <LiveLogTable 
              logs={logs}
              onSelectLog={setSelectedLog}
              onBlockIP={handleBlockIP}
              autoScroll={autoScroll}
              setAutoScroll={setAutoScroll}
            />
          </div>
        )}

        {activeTab === 'alerts' && (
          <AlertCards 
            alerts={activeAlerts}
            onBlockIP={handleBlockIP}
            onAcknowledge={handleAcknowledgeAlert}
            onEscalate={handleEscalateAlert}
            onSelectLog={setSelectedLog}
          />
        )}

        {activeTab === 'grafana' && (
          <EmbeddedGrafanaPanel />
        )}

        {activeTab === 'firewall' && (
          <FirewallPanel 
            blockedIPs={blockedIPs}
            onUnblockIP={handleUnblockIP}
            onBlockIP={handleBlockIP}
          />
        )}
      </main>

      {/* Log Detail Inspector Modal */}
      <LogDetailModal 
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        onBlockIP={handleBlockIP}
        onAcknowledgeAlert={handleAcknowledgeAlert}
        onEscalateAlert={handleEscalateAlert}
      />

      {/* Footer Status Bar */}
      <footer className="border-t border-slate-800 bg-slate-950 px-6 py-3 text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>SOC Node Status: OPERATIONAL</span>
          <span className="text-slate-700">•</span>
          <span>SIEM Engine: ONLINE</span>
        </div>
        <div>
          AEGIS SOC Security Operations Control • React & Grafana Analytics Engine
        </div>
      </footer>
    </div>
  );
}

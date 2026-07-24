import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const docsDir = path.join(projectRoot, 'docs', 'screenshots');

if (!fs.existsSync(docsDir)) {
  fs.mkdirSync(docsDir, { recursive: true });
}

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function generateReport() {
  console.log('🚀 Starting PDF Report Generation Workflow...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950, deviceScaleFactor: 2 });

  console.log('🌐 Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));

  // Screenshot 1: SOC Overview
  console.log('📸 Capturing 01_soc_overview.png ...');
  const path1 = path.join(docsDir, '01_soc_overview.png');
  await page.screenshot({ path: path1, fullPage: false });

  // Screenshot 2: Trigger Attack Simulation
  console.log('⚡ Triggering DDoS attack simulation...');
  const attackButtons = await page.$$('button');
  for (const btn of attackButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('DDoS Flood')) {
      await btn.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));
  console.log('📸 Capturing 02_attack_simulation.png ...');
  const path2 = path.join(docsDir, '02_attack_simulation.png');
  await page.screenshot({ path: path2, fullPage: false });

  // Screenshot 3: Live Log Feed
  console.log('📜 Navigating to Live Log Feed tab...');
  const tabs = await page.$$('nav button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Live Log Feed')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 800)));
  console.log('📸 Capturing 03_log_inspector.png ...');
  const path3 = path.join(docsDir, '03_log_inspector.png');
  await page.screenshot({ path: path3, fullPage: false });

  // Screenshot 4: Log Detail Modal
  console.log('🔍 Inspecting log row payload...');
  const inspectBtns = await page.$$('button');
  for (const btn of inspectBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Inspect')) {
      await btn.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 800)));
  console.log('📸 Capturing 04_payload_modal.png ...');
  const path4 = path.join(docsDir, '04_payload_modal.png');
  await page.screenshot({ path: path4, fullPage: false });

  // Close modal
  const closeBtns = await page.$$('button');
  for (const btn of closeBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.trim() === 'Close') {
      await btn.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 500)));

  // Screenshot 5: Threat Alerts Tab
  console.log('🚨 Navigating to Threat Alerts tab...');
  const tabs2 = await page.$$('nav button');
  for (const tab of tabs2) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Threat Alerts')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 800)));
  console.log('📸 Capturing 05_alert_triage.png ...');
  const path5 = path.join(docsDir, '05_alert_triage.png');
  await page.screenshot({ path: path5, fullPage: false });

  // Screenshot 6: Grafana Visualizer Tab
  console.log('📊 Navigating to Grafana Visualizer tab...');
  const tabs3 = await page.$$('nav button');
  for (const tab of tabs3) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Grafana Visualizer')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
  console.log('📸 Capturing 06_grafana_embed.png ...');
  const path6 = path.join(docsDir, '06_grafana_embed.png');
  await page.screenshot({ path: path6, fullPage: false });

  // Screenshot 7: Firewall & IP Bans Tab
  console.log('🛡️ Navigating to Firewall & IP Bans tab...');
  const tabs4 = await page.$$('nav button');
  for (const tab of tabs4) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Firewall')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 800)));
  console.log('📸 Capturing 07_firewall_rules.png ...');
  const path7 = path.join(docsDir, '07_firewall_rules.png');
  await page.screenshot({ path: path7, fullPage: false });

  // Read images as base64 for embedding in HTML
  const img1 = fs.readFileSync(path1).toString('base64');
  const img2 = fs.readFileSync(path2).toString('base64');
  const img3 = fs.readFileSync(path3).toString('base64');
  const img4 = fs.readFileSync(path4).toString('base64');
  const img5 = fs.readFileSync(path5).toString('base64');
  const img6 = fs.readFileSync(path6).toString('base64');
  const img7 = fs.readFileSync(path7).toString('base64');

  console.log('📄 Building Enhanced PDF HTML Document...');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AEGIS SOC Analyst Dashboard - Comprehensive Technical Project Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');
    
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }

    body {
      font-family: 'Outfit', sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.6;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }

    .cover {
      background: linear-gradient(135deg, #050811 0%, #0f172a 50%, #1e1b4b 100%);
      color: #ffffff;
      padding: 45px;
      border-radius: 20px;
      margin-bottom: 30px;
      box-shadow: 0 15px 35px rgba(0,0,0,0.4);
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 880px;
      box-sizing: border-box;
      position: relative;
    }

    .cover-title {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 1.5px;
      background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc, #f43f5e);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 12px 0;
      line-height: 1.2;
    }

    .cover-subtitle {
      font-size: 18px;
      color: #cbd5e1;
      font-weight: 600;
      margin-bottom: 25px;
    }

    .badge {
      display: inline-block;
      padding: 6px 16px;
      background: rgba(56, 189, 248, 0.2);
      border: 1px solid rgba(56, 189, 248, 0.5);
      color: #38bdf8;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: 1px;
    }

    .meta-table {
      width: 100%;
      margin-top: auto;
      border-top: 1px solid #334155;
      padding-top: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: #cbd5e1;
    }

    .meta-table td {
      padding: 4px 0;
    }

    .section-header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 35px;
      margin-bottom: 18px;
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 8px;
      page-break-before: always;
    }

    .section-header:first-of-type {
      page-break-before: avoid;
    }

    p {
      color: #334155;
      margin-bottom: 12px;
      text-align: justify;
    }

    .feature-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 14px;
      margin-bottom: 22px;
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 14px 18px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.03);
    }

    .feature-card h4 {
      margin: 0 0 6px 0;
      color: #0284c7;
      font-size: 14px;
      font-weight: 700;
    }

    .feature-card p {
      margin: 0;
      font-size: 12px;
      color: #475569;
    }

    .screenshot-container {
      background: #090d16;
      padding: 12px;
      border-radius: 14px;
      border: 1px solid #334155;
      margin-bottom: 22px;
      box-shadow: 0 6px 20px rgba(0,0,0,0.2);
      page-break-inside: avoid;
    }

    .screenshot-container img {
      width: 100%;
      height: auto;
      border-radius: 10px;
      display: block;
    }

    .screenshot-title {
      font-weight: 700;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      margin-bottom: 8px;
      padding-left: 4px;
    }

    .code-block {
      background: #0f172a;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      padding: 14px;
      border-radius: 10px;
      font-size: 11px;
      overflow-x: auto;
      margin-bottom: 16px;
      border-left: 4px solid #0284c7;
    }

    .steps-list {
      padding-left: 20px;
      color: #334155;
    }

    .steps-list li {
      margin-bottom: 10px;
    }

    .severity-pill {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 11px;
    }
    .sev-low { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .sev-med { background: #fef3c7; color: #b45309; border: 1px solid #fde047; }
    .sev-high { background: #ffe4e6; color: #be123c; border: 1px solid #f43f5e; }
    .sev-crit { background: #fee2e2; color: #b91c1c; border: 1px solid #ef4444; }

    .arch-box {
      background: #f1f5f9;
      border-left: 4px solid #818cf8;
      padding: 14px 18px;
      border-radius: 0 10px 10px 0;
      margin-bottom: 20px;
    }

    .arch-box h4 {
      margin: 0 0 6px 0;
      color: #4338ca;
      font-size: 14px;
    }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    <div class="badge">SECURITY OPERATIONS CENTER (SOC) CONTROL PANEL</div>
    <h1 class="cover-title">AEGIS SOC Analyst Dashboard</h1>
    <div class="cover-subtitle">Detailed Project Documentation, Technical Architecture, Real-Time Threat Analysis & User Manual</div>
    
    <div style="margin-top: 30px; color: #cbd5e1; font-size: 13px; line-height: 1.8;">
      <p style="color: #cbd5e1;"><strong style="color: #38bdf8;">Executive Overview:</strong> In modern enterprise computing, Security Operations Centers (SOC) require centralized visual dashboards to process high-velocity telemetry logs, classify threat severity, manage active security incidents, and execute immediate firewall containment. The AEGIS SOC Analyst Dashboard fulfills this role with a user-friendly, vibrant React GUI backed by real-time metric visualizers and Grafana integration.</p>
    </div>

    <table class="meta-table">
      <tr>
        <td><strong>GitHub Repository:</strong> github.com/thejaskumarm/soc-analyst-dashboard</td>
        <td><strong>Version:</strong> v2.4 Vibrant</td>
      </tr>
      <tr>
        <td><strong>Tech Stack:</strong> React 18, Recharts, Tailwind CSS v4, Lucide Icons, Vite</td>
        <td><strong>Document Date:</strong> ${new Date().toISOString().slice(0,10)}</td>
      </tr>
    </table>
  </div>

  <!-- SECTION 1: DETAILED PROJECT EXPLANATION -->
  <h2 class="section-header">1. Detailed Project Explanation & Architecture</h2>
  
  <h3>1.1 What is a SOC Analyst Dashboard?</h3>
  <p>A <strong>Security Operations Center (SOC)</strong> is a centralized function within an organization employing people, processes, and technology to continuously monitor and improve an organization's security posture while preventing, detecting, analyzing, and responding to cybersecurity incidents.</p>

  <p>The <strong>AEGIS SOC Analyst Dashboard</strong> serves as the primary operational user interface (GUI) for security analysts. It consolidates security telemetry from web application firewalls (WAF), intrusion detection systems (IDS/IPS), authentication services, and operating system endpoints into a unified, interactive dashboard.</p>

  <div class="arch-box">
    <h4>💡 Core Problem Solved by This Dashboard</h4>
    <p>Security teams process millions of daily event logs. Without intelligent visual color-coding and automated SIEM rule correlation, analysts face severe <em>alert fatigue</em> and delayed incident response. AEGIS solves this by filtering raw streams, computing an instant DEFCON threat level rating, highlighting malicious payloads, and offering one-click IP containment.</p>
  </div>

  <h3>1.2 Core Subsystems & Components</h3>
  <div class="feature-grid">
    <div class="feature-card">
      <h4>⚡ Real-Time Log Engine (logGenerator.js)</h4>
      <p>Simulates live high-throughput network telemetry including normal GET/POST requests, SSH brute-force attempts, port scans, SQL injections, DDoS floods, and C2 malware beacons.</p>
    </div>
    <div class="feature-card">
      <h4>🚨 Global Threat Level (DEFCON Engine)</h4>
      <p>Dynamically aggregates event frequency and alert density to transition between DEFCON 5 (Normal Ops) up to DEFCON 1 (Critical Threat) with pulsing alert indicators.</p>
    </div>
    <div class="feature-card">
      <h4>📊 Grafana Visualizer & JSON Exporter</h4>
      <p>Interactive Recharts throughput graphs and a built-in exporter generating pre-built Grafana Dashboard JSON schemas for Grafana Loki / Prometheus setups.</p>
    </div>
    <div class="feature-card">
      <h4>🛡️ Automated Ingress Firewall</h4>
      <p>Enables analysts to enforce immediate IP blacklisting rules at the edge gateway, blocking malicious actors with a single click.</p>
    </div>
    <div class="feature-card">
      <h4>🔍 Payload Inspection Drawer</h4>
      <p>Allows analysts to open any log record to examine raw HTTP payloads, headers, user-agent strings, SIEM rule triggers, and GEO-IP origin locations.</p>
    </div>
    <div class="feature-card">
      <h4>⚡ Threat Vector Simulator</h4>
      <p>An interactive attack simulator enabling SOC teams to inject synthetic attack vectors (DDoS, SQLi, Malware, Brute Force) on demand to observe live system response.</p>
    </div>
  </div>

  <h3 style="color:#0f172a; margin-top:20px;">Color-Coding Severity Standard</h3>
  <table style="width:100%; border-collapse:collapse; margin-bottom:20px; font-size:12px;">
    <tr style="background:#f1f5f9; text-align:left;">
      <th style="padding:8px; border:1px solid #cbd5e1;">Severity</th>
      <th style="padding:8px; border:1px solid #cbd5e1;">Visual Cue</th>
      <th style="padding:8px; border:1px solid #cbd5e1;">Description & Event Types</th>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #cbd5e1;"><span class="severity-pill sev-low">LOW</span></td>
      <td style="padding:8px; border:1px solid #cbd5e1; color:#16a34a; font-weight:bold;">Laser Emerald</td>
      <td style="padding:8px; border:1px solid #cbd5e1;">Standard HTTP 200 GET/POST traffic, background noise, low bandwidth.</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #cbd5e1;"><span class="severity-pill sev-med">MEDIUM</span></td>
      <td style="padding:8px; border:1px solid #cbd5e1; color:#d97706; font-weight:bold;">Cyber Amber</td>
      <td style="padding:8px; border:1px solid #cbd5e1;">SSH authentication brute force attempts, reconnaissance port scans.</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #cbd5e1;"><span class="severity-pill sev-high">HIGH</span></td>
      <td style="padding:8px; border:1px solid #cbd5e1; color:#e11d48; font-weight:bold;">Neon Rose</td>
      <td style="padding:8px; border:1px solid #cbd5e1;">SQL Injection attempts, Cross-Site Scripting (XSS) reflected payloads.</td>
    </tr>
    <tr>
      <td style="padding:8px; border:1px solid #cbd5e1;"><span class="severity-pill sev-crit">CRITICAL</span></td>
      <td style="padding:8px; border:1px solid #cbd5e1; color:#dc2626; font-weight:bold;">Crimson Red</td>
      <td style="padding:8px; border:1px solid #cbd5e1;">DDoS volumetric floods, C2 malware domain beaconing, ransomware mass file locks.</td>
    </tr>
  </table>

  <!-- SECTION 2: SCREENSHOTS & PROJECT WORKINGS -->
  <h2 class="section-header">2. Live Project Workings & Interface Screenshots</h2>
  <p>The following high-resolution screenshots demonstrate the live functionality, components, and real-time operations of the AEGIS SOC Analyst Dashboard.</p>

  <!-- SCREENSHOT 1 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.1: Main SOC Overview Dashboard & Live Visualizer</div>
    <img src="data:image/png;base64,${img1}" alt="SOC Overview">
  </div>

  <!-- SCREENSHOT 2 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.2: Live Threat Attack Simulator Injection & DEFCON 1 Critical Alert Response</div>
    <img src="data:image/png;base64,${img2}" alt="Attack Simulator">
  </div>

  <!-- SCREENSHOT 3 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.3: Real-Time Log Stream Table with Multi-Filter Severity Pills</div>
    <img src="data:image/png;base64,${img3}" alt="Live Log Table">
  </div>

  <!-- SCREENSHOT 4 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.4: Log Payload Inspection Drawer (Raw HTTP Headers & GEO-IP Data)</div>
    <img src="data:image/png;base64,${img4}" alt="Log Detail Modal">
  </div>

  <!-- SCREENSHOT 5 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.5: Active Threat Triage Cards with One-Click IP Blocking</div>
    <img src="data:image/png;base64,${img5}" alt="Threat Triage Cards">
  </div>

  <!-- SCREENSHOT 6 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.6: Embedded Grafana Panel & Dashboard JSON Export Controller</div>
    <img src="data:image/png;base64,${img6}" alt="Grafana Visualizer">
  </div>

  <!-- SCREENSHOT 7 -->
  <div class="screenshot-container">
    <div class="screenshot-title">Figure 2.7: Ingress Firewall & Blacklisted IP Enforcement Manager</div>
    <img src="data:image/png;base64,${img7}" alt="Firewall Rules">
  </div>

  <!-- SECTION 3: HOW TO USE THIS TOOL -->
  <h2 class="section-header">3. How to Install & Use This Tool on Your Computer</h2>
  <p>Follow these step-by-step instructions to install and run the AEGIS SOC Analyst Dashboard locally on macOS, Linux, or Windows.</p>

  <h3>Prerequisites</h3>
  <p>Ensure you have <strong>Node.js (v18 or higher)</strong> and <strong>npm</strong> installed on your machine:</p>
  <ul class="steps-list">
    <li>Check Node version: <code>node -v</code></li>
    <li>Check npm version: <code>npm -v</code></li>
  </ul>

  <h3>Step 1: Clone the Repository</h3>
  <div class="code-block">git clone https://github.com/thejaskumarm/soc-analyst-dashboard.git</div>

  <h3>Step 2: Navigate to Project Folder</h3>
  <div class="code-block">cd soc-analyst-dashboard</div>

  <h3>Step 3: Install Required Dependencies</h3>
  <div class="code-block">npm install</div>

  <h3>Step 4: Launch the Local Development Server</h3>
  <div class="code-block">npm run dev</div>

  <h3>Step 5: Access in Browser</h3>
  <p>Open your web browser and navigate to: <a href="http://localhost:5173/" style="color:#0284c7; font-weight:bold;">http://localhost:5173/</a></p>

  <h3>Step 6: Build for Production Deployment</h3>
  <div class="code-block">npm run build</div>
  <p>The compiled production assets will be generated in the <code>dist/</code> directory, ready to deploy to Vercel, Netlify, or Docker containers.</p>

  <!-- SECTION 4: GRAFANA INTEGRATION GUIDE -->
  <h2 class="section-header">4. Connecting to External Grafana Instances</h2>
  <p>To connect the dashboard with a live Grafana server (e.g. running Grafana Loki or Prometheus):</p>

  <ol class="steps-list">
    <li>Navigate to the <strong>Grafana Visualizer</strong> tab in the dashboard.</li>
    <li>Click <strong>Export Grafana Dashboard JSON</strong> to download the pre-configured JSON template (<code>soc-analyst-grafana-dashboard.json</code>).</li>
    <li>Open your Grafana web interface (e.g. <code>http://localhost:3000</code>).</li>
    <li>Go to <strong>Dashboards -> Import</strong> and upload the exported JSON file.</li>
    <li>Select your Loki or Elasticsearch datasource and click <strong>Import</strong>.</li>
    <li>Copy your panel embed URL from Grafana and paste it into the AEGIS dashboard embed viewport!</li>
  </ol>

  <!-- SECTION 5: CONCLUSION -->
  <h2 class="section-header">5. Technical Conclusion & Project Summary</h2>
  <p>The AEGIS SOC Analyst Dashboard successfully combines modern frontend engineering with practical cybersecurity workflows. By offering real-time streaming feeds, color-coded threat triage, attack simulation capabilities, automated firewall control, and Grafana ecosystem integration, it provides an intuitive and responsive control panel for SOC analysts.</p>

  <div style="margin-top: 35px; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b;">
    AEGIS SOC Security Operations Center Control Panel • Project Documentation Report Generated Automatically
  </div>

</body>
</html>
  `;

  const reportHtmlPath = path.join(projectRoot, 'docs', 'report.html');
  fs.writeFileSync(reportHtmlPath, htmlContent);
  console.log(`📄 Report HTML saved to ${reportHtmlPath}`);

  await browser.close();
  console.log('🎉 Screenshots and HTML generation complete!');
}

generateReport().catch(err => {
  console.error('❌ Error generating report:', err);
  process.exit(1);
});

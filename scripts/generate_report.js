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

  console.log('📄 Building PDF HTML Document...');
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>SOC Analyst Dashboard - Project Report</title>
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
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }

    .cover {
      background: linear-gradient(135deg, #090d16 0%, #0f172a 100%);
      color: #ffffff;
      padding: 40px;
      border-radius: 16px;
      margin-bottom: 30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: center;
      min-height: 880px;
      box-sizing: border-box;
    }

    .cover-title {
      font-size: 36px;
      font-weight: 800;
      letter-spacing: 1px;
      background: linear-gradient(90deg, #38bdf8, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 0 10px 0;
    }

    .cover-subtitle {
      font-size: 18px;
      color: #94a3b8;
      font-weight: 600;
      margin-bottom: 30px;
    }

    .badge {
      display: inline-block;
      padding: 6px 14px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      border-radius: 20px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 700;
      margin-bottom: 20px;
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

    .section-header {
      border-bottom: 3px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 16px;
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
    }

    .feature-grid {
      display: grid;
      grid-template-cols: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 12px 16px;
    }

    .feature-card h4 {
      margin: 0 0 4px 0;
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
      padding: 10px;
      border-radius: 12px;
      border: 1px solid #334155;
      margin-bottom: 20px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.15);
      page-break-inside: avoid;
    }

    .screenshot-container img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
    }

    .screenshot-title {
      font-weight: 700;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      margin-bottom: 6px;
      padding-left: 4px;
    }

    .code-block {
      background: #0f172a;
      color: #38bdf8;
      font-family: 'JetBrains Mono', monospace;
      padding: 14px;
      border-radius: 8px;
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
      margin-bottom: 8px;
    }

    .severity-pill {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 11px;
    }
    .sev-low { background: #dcfce7; color: #15803d; }
    .sev-med { background: #fef3c7; color: #b45309; }
    .sev-high { background: #ffe4e6; color: #be123c; }
    .sev-crit { background: #fee2e2; color: #b91c1c; }
  </style>
</head>
<body>

  <!-- COVER PAGE -->
  <div class="cover">
    <div class="badge">SECURITY OPERATIONS CONTROL PANEL</div>
    <h1 class="cover-title">AEGIS SOC Analyst Dashboard</h1>
    <div class="cover-subtitle">Real-Time Threat Monitoring, Live SIEM Log Stream Analysis, & Grafana Security Visualizer</div>
    
    <div style="margin-top: 40px; color: #94a3b8; font-size: 14px; line-height: 1.8;">
      <p style="color: #cbd5e1;"><strong style="color: #38bdf8;">Project Purpose:</strong> Comprehensive Security Operations Center (SOC) control panel enabling cybersecurity teams to monitor real-time network logs, identify attacks using color-coded severity rating, perform incident alert triage, block malicious IPs, and visualize metric analytics.</p>
    </div>

    <table class="meta-table">
      <tr>
        <td><strong>Repository:</strong> github.com/thejaskumarm/soc-analyst-dashboard</td>
        <td><strong>Version:</strong> v2.4 Vibrant</td>
      </tr>
      <tr>
        <td><strong>Technology:</strong> React 18, Recharts, Tailwind CSS, Vite</td>
        <td><strong>Date:</strong> ${new Date().toISOString().slice(0,10)}</td>
      </tr>
    </table>
  </div>

  <!-- SECTION 1: WHAT IS THE USE OF THIS TOOL -->
  <h2 class="section-header">1. Purpose & Core Operational Value</h2>
  <p>A <strong>Security Operations Center (SOC)</strong> is the command center responsible for monitoring, detecting, analyzing, and mitigating cybersecurity threats. The <strong>AEGIS SOC Analyst Dashboard</strong> equips security teams with a unified control panel to observe live system logs, analyze threat severity in real-time, and execute automated containment actions.</p>

  <div class="feature-grid">
    <div class="feature-card">
      <h4>⚡ Real-Time Log Streaming</h4>
      <p>Streams live event feeds with configurable velocity (1x to 10x speed), auto-scrolling, and multi-field keyword search.</p>
    </div>
    <div class="feature-card">
      <h4>🎨 Color-Coded Threat System</h4>
      <p>Instant visual threat rating: Green for Low/Normal, Yellow for Medium Risk, and Red for High/Critical Threats.</p>
    </div>
    <div class="feature-card">
      <h4>📊 Grafana Analytics & Export</h4>
      <p>Dual-series area charts, attack distribution donuts, and direct Grafana JSON Dashboard export capability.</p>
    </div>
    <div class="feature-card">
      <h4>🛡️ Automated Ingress Firewall</h4>
      <p>One-click IP blacklisting for high/critical threats to enforce drop packet rules at gateway level.</p>
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
  <h2 class="section-header">3. How to Use & Install This Tool on Your Computer</h2>
  <p>Follow these step-by-step instructions to install and run the SOC Analyst Dashboard locally on macOS, Linux, or Windows.</p>

  <h3>Prerequisites</h3>
  <p>Ensure you have <strong>Node.js (v18 or higher)</strong> and <strong>npm</strong> installed on your machine.</p>

  <h3>Step 1: Clone the Repository</h3>
  <div class="code-block">git clone https://github.com/thejaskumarm/soc-analyst-dashboard.git</div>

  <h3>Step 2: Navigate to Project Folder</h3>
  <div class="code-block">cd soc-analyst-dashboard</div>

  <h3>Step 3: Install Required Dependencies</h3>
  <div class="code-block">npm install</div>

  <h3>Step 4: Launch the Local Development Server</h3>
  <div class="code-block">npm run dev</div>

  <h3>Step 5: Access in Browser</h3>
  <p>Open your browser and navigate to: <a href="http://localhost:5173/" style="color:#0284c7; font-weight:bold;">http://localhost:5173/</a></p>

  <h3>Step 6: Build for Production Deployment</h3>
  <div class="code-block">npm run build</div>
  <p>The compiled production assets will be generated in the <code>dist/</code> directory.</p>

  <!-- SECTION 4: ARCHITECTURE & CONCLUSION -->
  <h2 class="section-header">4. Architecture & Technical Summary</h2>
  <p>The project follows a clean, modular React architecture engineered for high performance and low rendering latency under high log stream throughput:</p>
  
  <ul class="steps-list">
    <li><strong>React 18 + Vite:</strong> Fast modular component architecture with instant HMR.</li>
    <li><strong>Recharts Engine:</strong> Renders smooth time-series area graphs and dynamic attack vector donut charts.</li>
    <li><strong>Tailwind CSS v4:</strong> Cyber glassmorphic theme with neon borders and radial ambient glow effects.</li>
    <li><strong>Grafana JSON Exporter:</strong> Generates ready-to-import dashboard schemas for Loki/Prometheus security monitors.</li>
  </ul>

  <div style="margin-top: 30px; text-align: center; border-top: 1px solid #cbd5e1; padding-top: 15px; font-size: 11px; color: #64748b;">
    AEGIS SOC Security Operations Center Control Panel • Documentation Report Generated Automatically
  </div>

</body>
</html>
  `;

  const reportHtmlPath = path.join(projectRoot, 'docs', 'report.html');
  fs.writeFileSync(reportHtmlPath, htmlContent);
  console.log(`📄 Report HTML saved to ${reportHtmlPath}`);

  console.log('🖨️ Printing PDF via Headless Chrome...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfPath = path.join(projectRoot, 'SOC_Analyst_Dashboard_Documentation.pdf');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' }
  });

  console.log(`✅ PDF Generated Successfully: ${pdfPath}`);

  await browser.close();
  console.log('🎉 Workflow complete!');
}

generateReport().catch(err => {
  console.error('❌ Error generating report:', err);
  process.exit(1);
});

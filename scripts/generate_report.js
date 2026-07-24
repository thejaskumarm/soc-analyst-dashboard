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

async function captureScreenshots(browser) {
  console.log('📸 Phase 1: Capturing Live Dashboard Screenshots...');

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950, deviceScaleFactor: 2 });

  console.log('🌐 Navigating to http://localhost:5173/ ...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 30000 });
  await page.evaluate(() => new Promise(r => setTimeout(r, 2000)));

  // Screenshot 1: SOC Overview
  console.log('  📸 1/7 - SOC Overview Dashboard');
  const path1 = path.join(docsDir, '01_soc_overview.png');
  await page.screenshot({ path: path1, fullPage: false, type: 'png' });

  // Screenshot 2: Attack Simulation
  console.log('  ⚡ Triggering DDoS attack simulation...');
  const attackButtons = await page.$$('button');
  for (const btn of attackButtons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('DDoS Flood')) {
      await btn.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
  console.log('  📸 2/7 - Attack Simulation Response');
  const path2 = path.join(docsDir, '02_attack_simulation.png');
  await page.screenshot({ path: path2, fullPage: false, type: 'png' });

  // Screenshot 3: Live Log Feed
  console.log('  📜 Navigating to Live Log Feed...');
  const tabs = await page.$$('nav button');
  for (const tab of tabs) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Live Log Feed')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
  console.log('  📸 3/7 - Live Log Inspector');
  const path3 = path.join(docsDir, '03_log_inspector.png');
  await page.screenshot({ path: path3, fullPage: false, type: 'png' });

  // Screenshot 4: Log Detail Modal
  console.log('  🔍 Opening log payload inspection...');
  const inspectBtns = await page.$$('button');
  for (const btn of inspectBtns) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Inspect')) {
      await btn.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
  console.log('  📸 4/7 - Payload Inspection Modal');
  const path4 = path.join(docsDir, '04_payload_modal.png');
  await page.screenshot({ path: path4, fullPage: false, type: 'png' });

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

  // Screenshot 5: Threat Alerts
  console.log('  🚨 Navigating to Threat Alerts...');
  const tabs2 = await page.$$('nav button');
  for (const tab of tabs2) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Threat Alerts')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
  console.log('  📸 5/7 - Active Threat Triage Cards');
  const path5 = path.join(docsDir, '05_alert_triage.png');
  await page.screenshot({ path: path5, fullPage: false, type: 'png' });

  // Screenshot 6: Grafana Visualizer
  console.log('  📊 Navigating to Grafana Visualizer...');
  const tabs3 = await page.$$('nav button');
  for (const tab of tabs3) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Grafana Visualizer')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1200)));
  console.log('  📸 6/7 - Grafana Embed Panel');
  const path6 = path.join(docsDir, '06_grafana_embed.png');
  await page.screenshot({ path: path6, fullPage: false, type: 'png' });

  // Screenshot 7: Firewall Panel
  console.log('  🛡️  Navigating to Firewall & IP Bans...');
  const tabs4 = await page.$$('nav button');
  for (const tab of tabs4) {
    const text = await page.evaluate(el => el.textContent, tab);
    if (text && text.includes('Firewall')) {
      await tab.click();
      break;
    }
  }
  await page.evaluate(() => new Promise(r => setTimeout(r, 1000)));
  console.log('  📸 7/7 - Firewall IP Blacklist Manager');
  const path7 = path.join(docsDir, '07_firewall_rules.png');
  await page.screenshot({ path: path7, fullPage: false, type: 'png' });

  await page.close();

  console.log('✅ All 7 screenshots captured successfully!\n');
  return [path1, path2, path3, path4, path5, path6, path7];
}

function buildReportHTML(screenshotPaths) {
  console.log('📄 Phase 2: Building PDF Report HTML...');

  // Read all images and convert to base64 data URIs
  const images = screenshotPaths.map(p => {
    const data = fs.readFileSync(p);
    return `data:image/png;base64,${data.toString('base64')}`;
  });

  const screenshotEntries = [
    { title: 'Figure 2.1: Main SOC Overview Dashboard & Live Visualizer', desc: 'The primary command view showing DEFCON threat level, stat cards (total events, critical alerts, medium-risk probes, firewall blocks), the Attack Vector Simulator, Grafana-style real-time throughput charts, and the live scrolling log table.' },
    { title: 'Figure 2.2: Live Threat Attack Simulator & DEFCON 1 Critical Alert', desc: 'Demonstrates the on-demand attack injection system. After triggering a DDoS Flood simulation, the dashboard instantly reflects elevated threat levels, updated stat counters, and new critical log entries in the stream.' },
    { title: 'Figure 2.3: Real-Time Log Stream Table with Multi-Filter Severity Pills', desc: 'The full-screen Live Log Feed view with severity color-coding (green/yellow/red), search bar, severity filter pills, auto-scroll toggle, and one-click "Inspect" buttons for each log entry.' },
    { title: 'Figure 2.4: Log Payload Inspection Drawer (Raw HTTP Headers & GEO-IP)', desc: 'The modal inspector showing raw HTTP method, user-agent, payload body, SIEM rule ID, GEO-IP origin location, and SOC triage action buttons (Block IP, Acknowledge, Escalate).' },
    { title: 'Figure 2.5: Active Threat Triage Cards with One-Click IP Blocking', desc: 'The Threat Alerts tab displaying active HIGH and CRITICAL incident cards with severity badges, source IP, attack vector classification, and instant action buttons.' },
    { title: 'Figure 2.6: Embedded Grafana Panel & Dashboard JSON Export Controller', desc: 'The Grafana Visualizer integration tab featuring a configurable iframe embed viewport and a one-click Grafana Dashboard JSON export button for Loki/Prometheus setups.' },
    { title: 'Figure 2.7: Ingress Firewall & Blacklisted IP Enforcement Manager', desc: 'The Firewall panel showing the active IP blacklist table, manual IP block input form, and unblock controls for false positive remediation.' },
  ];

  const screenshotHTML = screenshotEntries.map((entry, i) => `
    <div class="screenshot-block">
      <div class="screenshot-label">${entry.title}</div>
      <div class="screenshot-frame">
        <img src="${images[i]}" alt="${entry.title}">
      </div>
      <p class="screenshot-desc">${entry.desc}</p>
    </div>
  `).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AEGIS SOC Analyst Dashboard - Project Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }

    @page {
      size: A4 portrait;
      margin: 14mm 16mm;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.65;
      font-size: 12.5px;
    }

    /* ===== COVER PAGE ===== */
    .cover {
      background: linear-gradient(145deg, #020617 0%, #0f172a 45%, #1e1b4b 100%);
      color: #ffffff;
      padding: 50px 45px;
      border-radius: 16px;
      margin-bottom: 10px;
      min-height: 860px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      page-break-after: always;
    }

    .cover-badge {
      display: inline-block;
      padding: 7px 18px;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38bdf8;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1.5px;
      margin-bottom: 24px;
      font-family: 'Courier New', monospace;
    }

    .cover h1 {
      font-size: 42px;
      font-weight: 800;
      color: #38bdf8;
      margin-bottom: 14px;
      line-height: 1.15;
    }

    .cover-sub {
      font-size: 17px;
      color: #94a3b8;
      font-weight: 500;
      margin-bottom: 30px;
    }

    .cover-overview {
      color: #cbd5e1;
      font-size: 13px;
      line-height: 1.75;
      margin-bottom: 40px;
    }

    .cover-overview strong { color: #38bdf8; }

    .cover-meta {
      margin-top: auto;
      border-top: 1px solid #334155;
      padding-top: 20px;
      font-family: 'Courier New', monospace;
      font-size: 11px;
      color: #94a3b8;
    }

    .cover-meta td { padding: 3px 0; }

    /* ===== SECTION HEADERS ===== */
    h2.section-title {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      border-bottom: 3px solid #0284c7;
      padding-bottom: 6px;
      margin-top: 30px;
      margin-bottom: 18px;
      page-break-after: avoid;
    }

    h3 {
      font-size: 14.5px;
      font-weight: 700;
      color: #1e293b;
      margin-top: 18px;
      margin-bottom: 8px;
    }

    p {
      color: #334155;
      margin-bottom: 10px;
      text-align: justify;
    }

    /* ===== FEATURE GRID ===== */
    .feature-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-bottom: 20px;
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 14px 16px;
    }

    .feature-card h4 {
      margin: 0 0 5px 0;
      color: #0284c7;
      font-size: 13px;
      font-weight: 700;
    }

    .feature-card p {
      margin: 0;
      font-size: 11.5px;
      color: #475569;
      text-align: left;
    }

    /* ===== SEVERITY TABLE ===== */
    .sev-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 18px;
      font-size: 11.5px;
    }

    .sev-table th {
      background: #f1f5f9;
      padding: 8px 10px;
      border: 1px solid #cbd5e1;
      text-align: left;
      font-weight: 700;
    }

    .sev-table td {
      padding: 7px 10px;
      border: 1px solid #cbd5e1;
    }

    .pill {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 10.5px;
      font-family: 'Courier New', monospace;
    }

    .pill-low { background: #dcfce7; color: #15803d; border: 1px solid #86efac; }
    .pill-med { background: #fef3c7; color: #b45309; border: 1px solid #fde047; }
    .pill-high { background: #ffe4e6; color: #be123c; border: 1px solid #fda4af; }
    .pill-crit { background: #fee2e2; color: #b91c1c; border: 1px solid #fca5a5; }

    /* ===== ARCHITECTURE BOX ===== */
    .arch-box {
      background: #f1f5f9;
      border-left: 4px solid #818cf8;
      padding: 14px 18px;
      border-radius: 0 10px 10px 0;
      margin-bottom: 18px;
    }

    .arch-box h4 {
      margin: 0 0 6px 0;
      color: #4338ca;
      font-size: 13px;
    }

    .arch-box p { margin: 0; font-size: 12px; }

    /* ===== SCREENSHOTS ===== */
    .screenshot-block {
      page-break-inside: avoid;
      margin-bottom: 24px;
    }

    .screenshot-label {
      font-weight: 700;
      color: #0284c7;
      font-size: 12px;
      margin-bottom: 8px;
      font-family: 'Courier New', monospace;
    }

    .screenshot-frame {
      background: #0a0e1a;
      padding: 10px;
      border-radius: 12px;
      border: 1px solid #334155;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
    }

    .screenshot-frame img {
      width: 100%;
      height: auto;
      border-radius: 8px;
      display: block;
    }

    .screenshot-desc {
      font-size: 11px;
      color: #64748b;
      margin-top: 6px;
      font-style: italic;
    }

    /* ===== CODE BLOCKS ===== */
    .code-block {
      background: #0f172a;
      color: #38bdf8;
      font-family: 'Courier New', monospace;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 11px;
      margin-bottom: 14px;
      border-left: 4px solid #0284c7;
    }

    /* ===== STEPS LIST ===== */
    ol.steps, ul.steps {
      padding-left: 22px;
      color: #334155;
      margin-bottom: 14px;
    }

    ol.steps li, ul.steps li {
      margin-bottom: 8px;
    }

    /* ===== FOOTER ===== */
    .doc-footer {
      margin-top: 40px;
      text-align: center;
      border-top: 1px solid #cbd5e1;
      padding-top: 14px;
      font-size: 10px;
      color: #94a3b8;
    }
  </style>
</head>
<body>

  <!-- ==================== COVER PAGE ==================== -->
  <div class="cover">
    <div class="cover-badge">SECURITY OPERATIONS CENTER (SOC) CONTROL PANEL</div>
    <h1>AEGIS SOC Analyst Dashboard</h1>
    <div class="cover-sub">Detailed Project Documentation, Technical Architecture, Real-Time Threat Analysis & User Manual</div>

    <div class="cover-overview">
      <strong>Executive Overview:</strong> In modern enterprise computing, Security Operations Centers (SOC) require centralized visual dashboards to process high-velocity telemetry logs, classify threat severity, manage active security incidents, and execute immediate firewall containment. The AEGIS SOC Analyst Dashboard fulfills this role with a user-friendly, vibrant React GUI backed by real-time metric visualizers and Grafana integration.
    </div>

    <table class="cover-meta">
      <tr>
        <td><strong>GitHub:</strong> github.com/thejaskumarm/soc-analyst-dashboard</td>
        <td><strong>Version:</strong> v2.4</td>
      </tr>
      <tr>
        <td><strong>Stack:</strong> React 18, Recharts, Tailwind CSS v4, Lucide Icons, Vite</td>
        <td><strong>Date:</strong> ${new Date().toISOString().slice(0, 10)}</td>
      </tr>
      <tr>
        <td><strong>Author:</strong> Thejas Kumar M</td>
        <td><strong>License:</strong> MIT</td>
      </tr>
    </table>
  </div>

  <!-- ==================== SECTION 1: PROJECT EXPLANATION ==================== -->
  <h2 class="section-title">1. Detailed Project Explanation & Architecture</h2>

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

  <h3>Color-Coding Severity Standard</h3>
  <table class="sev-table">
    <tr>
      <th>Severity</th>
      <th>Visual Cue</th>
      <th>Description & Event Types</th>
    </tr>
    <tr>
      <td><span class="pill pill-low">LOW</span></td>
      <td style="color:#16a34a; font-weight:bold;">Laser Emerald</td>
      <td>Standard HTTP 200 GET/POST traffic, background noise, low bandwidth.</td>
    </tr>
    <tr>
      <td><span class="pill pill-med">MEDIUM</span></td>
      <td style="color:#d97706; font-weight:bold;">Cyber Amber</td>
      <td>SSH authentication brute force attempts, reconnaissance port scans.</td>
    </tr>
    <tr>
      <td><span class="pill pill-high">HIGH</span></td>
      <td style="color:#e11d48; font-weight:bold;">Neon Rose</td>
      <td>SQL Injection attempts, Cross-Site Scripting (XSS) reflected payloads.</td>
    </tr>
    <tr>
      <td><span class="pill pill-crit">CRITICAL</span></td>
      <td style="color:#dc2626; font-weight:bold;">Crimson Red</td>
      <td>DDoS volumetric floods, C2 malware domain beaconing, ransomware mass file locks.</td>
    </tr>
  </table>

  <!-- ==================== SECTION 2: SCREENSHOTS ==================== -->
  <h2 class="section-title">2. Live Project Workings & Interface Screenshots</h2>
  <p>The following high-resolution screenshots demonstrate the live functionality, components, and real-time operations of the AEGIS SOC Analyst Dashboard.</p>

  ${screenshotHTML}

  <!-- ==================== SECTION 3: HOW TO USE ==================== -->
  <h2 class="section-title">3. How to Install & Use This Tool on Your Computer</h2>
  <p>Follow these step-by-step instructions to install and run the AEGIS SOC Analyst Dashboard locally on macOS, Linux, or Windows.</p>

  <h3>Prerequisites</h3>
  <p>Ensure you have <strong>Node.js (v18 or higher)</strong> and <strong>npm</strong> installed on your machine:</p>
  <ul class="steps">
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
  <p>Open your web browser and navigate to: <strong style="color:#0284c7;">http://localhost:5173/</strong></p>

  <h3>Step 6: Build for Production Deployment</h3>
  <div class="code-block">npm run build</div>
  <p>The compiled production assets will be generated in the <code>dist/</code> directory, ready to deploy to Vercel, Netlify, or Docker containers.</p>

  <!-- ==================== SECTION 4: GRAFANA ==================== -->
  <h2 class="section-title">4. Connecting to External Grafana Instances</h2>
  <p>To connect the dashboard with a live Grafana server (e.g. running Grafana Loki or Prometheus):</p>

  <ol class="steps">
    <li>Navigate to the <strong>Grafana Visualizer</strong> tab in the dashboard.</li>
    <li>Click <strong>Export Grafana Dashboard JSON</strong> to download the pre-configured JSON template (<code>soc-analyst-grafana-dashboard.json</code>).</li>
    <li>Open your Grafana web interface (e.g. <code>http://localhost:3000</code>).</li>
    <li>Go to <strong>Dashboards → Import</strong> and upload the exported JSON file.</li>
    <li>Select your Loki or Elasticsearch datasource and click <strong>Import</strong>.</li>
    <li>Copy your panel embed URL from Grafana and paste it into the AEGIS dashboard embed viewport!</li>
  </ol>

  <!-- ==================== SECTION 5: CONCLUSION ==================== -->
  <h2 class="section-title">5. Technical Conclusion & Project Summary</h2>
  <p>The AEGIS SOC Analyst Dashboard successfully combines modern frontend engineering with practical cybersecurity workflows. By offering real-time streaming feeds, color-coded threat triage, attack simulation capabilities, automated firewall control, and Grafana ecosystem integration, it provides an intuitive and responsive control panel for SOC analysts.</p>

  <div class="arch-box">
    <h4>🏗️ Technical Architecture Summary</h4>
    <p><strong>Frontend:</strong> React 18 with Vite build system, component-based architecture with 10 modular JSX components.<br>
    <strong>Visualization:</strong> Recharts library for responsive area, bar, and pie charts with real-time data binding.<br>
    <strong>Styling:</strong> Tailwind CSS v4 with custom cyber-glassmorphism theme, JetBrains Mono & Outfit fonts.<br>
    <strong>Data Layer:</strong> Mock log generator engine with 6 attack vectors and configurable stream velocity.<br>
    <strong>Export:</strong> One-click Grafana Dashboard JSON export for production SIEM integration.</p>
  </div>

  <div class="doc-footer">
    AEGIS SOC Security Operations Center Control Panel • Project Documentation by Thejas Kumar M • Generated ${new Date().toISOString().slice(0, 10)}
  </div>

</body>
</html>`;
}

async function generatePDF(browser, html) {
  console.log('📄 Phase 3: Rendering PDF with Puppeteer...');

  const pdfPage = await browser.newPage();

  const reportHtmlPath = path.join(projectRoot, 'docs', 'report.html');
  await pdfPage.goto(`file://${reportHtmlPath}`, { waitUntil: 'load', timeout: 30000 });

  // Wait extra time for all base64 images to render fully
  await pdfPage.evaluate(() => {
    return new Promise((resolve) => {
      const images = document.querySelectorAll('img');
      let loaded = 0;
      if (images.length === 0) return resolve();
      images.forEach(img => {
        if (img.complete) {
          loaded++;
          if (loaded === images.length) resolve();
        } else {
          img.onload = () => { loaded++; if (loaded === images.length) resolve(); };
          img.onerror = () => { loaded++; if (loaded === images.length) resolve(); };
        }
      });
    });
  });

  // Additional safety wait
  await pdfPage.evaluate(() => new Promise(r => setTimeout(r, 2000)));

  const pdfPath = path.join(projectRoot, 'SOC_Analyst_Dashboard_Documentation.pdf');

  await pdfPage.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '14mm', right: '16mm', bottom: '14mm', left: '16mm' },
    displayHeaderFooter: false,
    scale: 1,
  });

  await pdfPage.close();

  const sizeMB = (fs.statSync(pdfPath).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ PDF saved: ${pdfPath} (${sizeMB} MB)`);

  return pdfPath;
}

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  🚀 AEGIS SOC Dashboard — PDF Report Generator');
  console.log('═══════════════════════════════════════════════════════\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--window-size=1400,950',
    ]
  });

  try {
    // Step 1: Capture screenshots from running app
    const screenshotPaths = await captureScreenshots(browser);

    // Step 2: Build HTML report with embedded images
    const html = buildReportHTML(screenshotPaths);

    // Save HTML for reference
    const htmlPath = path.join(projectRoot, 'docs', 'report.html');
    fs.writeFileSync(htmlPath, html);
    console.log(`📄 HTML report saved: ${htmlPath}`);

    // Step 3: Generate PDF from the HTML
    const pdfPath = await generatePDF(browser, html);

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('  🎉 Report generation complete!');
    console.log(`  📄 PDF: ${pdfPath}`);
    console.log('═══════════════════════════════════════════════════════\n');
  } finally {
    await browser.close();
  }
}

main().catch(err => {
  console.error('❌ Error generating report:', err);
  process.exit(1);
});

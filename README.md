# 🛡️ AEGIS SOC Analyst Dashboard

> A high-performance, real-time Security Operations Center (SOC) control panel & SIEM analytics engine built with **React**, **Recharts**, **Lucide Icons**, and **Tailwind CSS**.

![SOC Dashboard Banner](src/assets/hero.png)

---

## 🎯 What is the Use of this Tool?

In a modern enterprise organization, a **Security Operations Center (SOC)** is the command hub responsible for monitoring, detecting, analyzing, and responding to cybersecurity incidents 24/7. 

The **AEGIS SOC Analyst Dashboard** provides security teams with a unified, real-time control panel to:

1. **Monitor Live System Logs & Traffic Throughput**: Watch streaming log entries across microservices, databases, authentication servers, and ingress proxies in real time.
2. **Detect Attacks Instantly via Color-Coding**: Identify threats at a glance using intuitive color cues:
   - 🟢 **Green (Low / Normal)**: Standard operational requests (`200 OK`, nominal load).
   - 🟡 **Yellow (Medium Risk)**: Suspicious probes, repeated SSH authentication failures, and port scans.
   - 🔴 **Red / Rose (High & Critical Threat)**: SQL injection attempts, XSS attacks, DDoS volumetric floods, C2 malware beaconing, and ransomware signals.
3. **Calculate Global Threat Status (DEFCON Level)**: Automatically aggregate event frequency to determine the global threat condition (`DEFCON 5 NORMAL` to `DEFCON 1 CRITICAL`).
4. **Triage Active Incident Alerts**: Inspect raw HTTP payloads, user-agents, SIEM rule triggers, and GEO-IP locations to acknowledge or escalate incident tickets.
5. **Enforce Firewall IP Blacklists**: Instantly ban malicious source IP addresses at the ingress gateway level with a single click.
6. **Visualize Security Metrics with Grafana**: View live interactive area charts and export pre-configured **Grafana Dashboard JSON** templates for Prometheus and Grafana Loki setups.

---

## ✨ Key Features & Screenshots

```
+-----------------------------------------------------------------------------------+
|  AEGIS SOC COMMAND [v2.4]              DEFCON 1 • CRITICAL THREAT  [LIVE STREAM] |
+-----------------------------------------------------------------------------------+
|  [ STAT CARDS ]                                                                   |
|  Total Events: 1,420 | Critical: 14 | Medium: 32 | Firewall Blacklisted IPs: 12   |
+-----------------------------------------------------------------------------------+
|  [ THREAT ATTACK VECTOR SIMULATOR ]                                               |
|  [DDoS Flood]  [SQL Injection]  [SSH Brute Force]  [Port Scan]  [C2 Malware]      |
+-----------------------------------------------------------------------------------+
|  [ GRAFANA LIVE VISUALIZER & TIME SERIES ]                                        |
|  - Real-time Traffic Throughput vs Malicious Threat Spikes                        |
|  - Attack Type Distribution (Pie Chart) & Severity Breakdown (Bar Chart)          |
+-----------------------------------------------------------------------------------+
|  [ REAL-TIME LOG STREAM TABLE ]                                                   |
|  [CRIT]  LOG-1042  192.168.1.105  DDoS Flood      smb-share-finance  [INSPECT] |
|  [HIGH]  LOG-1041  45.142.214.12   SQL Injection   api.auth-service   [INSPECT] |
|  [MED ]  LOG-1040  103.251.170.89  Port Scan       web-frontend-01    [INSPECT] |
|  [LOW ]  LOG-1039  10.0.4.12       Normal Traffic  k8s-ingress        [INSPECT] |
+-----------------------------------------------------------------------------------+
```

### 1. 🚨 Global DEFCON Threat Meter
- **DEFCON 5 (Normal)**: Green operational state when background noise is low.
- **DEFCON 3 (Elevated Watch)**: Yellow warning when brute-force or port scan activity spikes.
- **DEFCON 1 (Critical Threat)**: Crimson red alert when active DDoS, SQLi, malware, or ransomware activity is detected.

### 2. 📜 Live Log Inspector & Multi-Filter Table
- **Stream Controls**: Play, pause, or adjust log feed velocity from `1x` to `10x`.
- **Search & Filter**: Search by IP, payload content, rule ID, or filter by severity level.
- **Payload Inspection Drawer**: Inspect raw HTTP payloads, headers, user-agents, and GEO-IP origins.

### 3. 📊 Grafana Interactive Visualizer & JSON Exporter
- **Live Event Rate Chart**: Dual-series area chart tracking normal throughput vs threat spikes.
- **Grafana Export**: Includes a built-in **Export Grafana Dashboard JSON** button to export dashboard configurations for Grafana Loki / Prometheus setups.

### 4. 🛡️ Ingress Firewall & IP Blacklist Manager
- Review blacklisted IP addresses.
- Add custom manual IP block rules or unblock false positives.

### 5. ⚡ On-Demand Threat Simulator
- Inject attack vectors on demand (DDoS, SQL Injection, SSH Brute Force, Recon Port Scan, C2 Malware, Normal Traffic) to observe instant dashboard response.

---

## 💻 How to Install and Run on Your Computer

Follow these quick steps to get the SOC Analyst Dashboard running locally on your computer (macOS, Linux, or Windows).

### Prerequisites
Make sure you have **Node.js (v18 or higher)** and **npm** installed:
- Check Node version: `node -v`
- Check npm version: `npm -v`

---

### Step 1: Clone the Repository
Open your terminal (or Command Prompt) and run:
```bash
git clone https://github.com/thejaskumarm/soc-analyst-dashboard.git
```

### Step 2: Navigate to the Directory
```bash
cd soc-analyst-dashboard
```

### Step 3: Install Dependencies
Install all required packages (`React`, `Vite`, `Recharts`, `Lucide Icons`, `Tailwind CSS`):
```bash
npm install
```

### Step 4: Start the Local Development Server
Launch the application:
```bash
npm run dev
```

### Step 5: Open in Your Web Browser
Once started, open your web browser and navigate to:
👉 **`http://localhost:5173/`**

---

## 🏗️ Production Build Instructions

To generate an optimized, minified production build:
```bash
npm run build
```
The compiled output will be generated in the `dist/` directory, ready to deploy to Vercel, Netlify, GitHub Pages, or Docker containers.

---

## 📈 Connecting to a Real Grafana Server

1. Open the **Grafana Visualizer** tab in the dashboard.
2. Click **Export Grafana Dashboard JSON** to download `soc-analyst-grafana-dashboard.json`.
3. In your Grafana instance (`http://localhost:3000`), go to **Dashboards -> Import**.
4. Upload the JSON file and select your **Loki** or **Elasticsearch** datasource.
5. Paste your Grafana embed URL into the dashboard's **Grafana Live Viewport** tab!

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 (Vite)
- **Styling & Theme**: Tailwind CSS v4, Custom Cyber Glassmorphism
- **Charts & Visualization**: Recharts (Responsive Area, Bar, and Pie Charts)
- **Icons**: Lucide React
- **Typography**: JetBrains Mono & Outfit (Google Fonts)

---

## 📄 License

Distributed under the **MIT License**. Free for personal, educational, and commercial security operations use.

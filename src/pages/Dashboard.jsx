import { useState, useEffect } from "react";

const metrics = [
  { id: "revenue", label: "Total Revenue", value: "$32,400", delta: "+8.2%", up: true, span: 2 },
  { id: "users", label: "Total Users", value: "1,240", delta: "+5.1%", up: true, span: 1 },
  { id: "active", label: "Active Now", value: "320", delta: "-2.3%", up: false, span: 1 },
];

const activity = [
  { icon: "U", color: "#6366f1", label: "New user registered", time: "2m ago" },
  { icon: "O", color: "#10b981", label: "Order #4821 placed", time: "14m ago" },
  { icon: "S", color: "#f59e0b", label: "Server config updated", time: "1h ago" },
  { icon: "R", color: "#ef4444", label: "Refund processed", time: "3h ago" },
];

const channels = [
  { label: "Organic", pct: 44, color: "#6366f1" },
  { label: "Referral", pct: 28, color: "#10b981" },
  { label: "Paid", pct: 18, color: "#f59e0b" },
  { label: "Direct", pct: 10, color: "#94a3b8" },
];

const sparkPoints = [30, 42, 38, 55, 47, 63, 58, 72, 65, 80, 74, 88];

function Spark({ points, color }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const h = 40;
  const w = 120;
  const step = w / (points.length - 1);
  const coords = points.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / (max - min)) * h;
    return `${x},${y}`;
  });
  const path = `M ${coords.join(" L ")}`;
  const area = `M 0,${h} L ${coords.join(" L ")} L ${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: "100%", height: 40, overflow: "visible" }}>
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#sg-${color.replace("#","")})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Bar({ pct, color, animated }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (animated) setTimeout(() => setWidth(pct), 100);
  }, [pct, animated]);
  return (
    <div style={{ height: 6, background: "#1e293b", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        height: "100%",
        width: `${width}%`,
        background: color,
        borderRadius: 99,
        transition: "width 0.8s cubic-bezier(0.16,1,0.3,1)",
      }} />
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080c14; }
  .db-root {
    min-height: 100vh;
    background: #080c14;
    font-family: 'DM Sans', sans-serif;
    color: #e2e8f0;
    padding: 28px 32px;
  }
  .db-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .db-wordmark {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #475569;
  }
  .db-title {
    font-size: 22px;
    font-weight: 600;
    color: #f1f5f9;
    letter-spacing: -0.02em;
  }
  .db-badge {
    font-size: 11px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 99px;
    background: #0f172a;
    border: 1px solid #1e293b;
    color: #64748b;
    letter-spacing: 0.04em;
  }
  .db-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: auto;
    gap: 14px;
  }
  .db-card {
    background: #0d1625;
    border: 1px solid #1a2640;
    border-radius: 16px;
    padding: 20px 22px;
  }
  .db-card-label {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #475569;
    margin-bottom: 8px;
  }
  .db-card-value {
    font-size: 28px;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: #f1f5f9;
    font-family: 'DM Mono', monospace;
    line-height: 1;
  }
  .db-delta-up {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 500;
    color: #10b981;
    background: rgba(16,185,129,0.08);
    padding: 3px 8px;
    border-radius: 99px;
    margin-top: 10px;
  }
  .db-delta-down {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 11px;
    font-weight: 500;
    color: #f87171;
    background: rgba(248,113,113,0.08);
    padding: 3px 8px;
    border-radius: 99px;
    margin-top: 10px;
  }
  .db-divider {
    height: 1px;
    background: #1a2640;
    margin: 14px 0;
  }
  .db-activity-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }
  .db-activity-row + .db-activity-row {
    border-top: 1px solid #1a2640;
  }
  .db-avatar {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
  }
  .db-activity-label {
    font-size: 13px;
    color: #cbd5e1;
    flex: 1;
  }
  .db-activity-time {
    font-size: 11px;
    color: #475569;
    font-family: 'DM Mono', monospace;
  }
  .db-section-title {
    font-size: 11px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #475569;
    margin-bottom: 16px;
  }
  .db-channel-row {
    margin-bottom: 12px;
  }
  .db-channel-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;
  }
  .db-channel-name {
    font-size: 13px;
    color: #94a3b8;
  }
  .db-channel-pct {
    font-size: 13px;
    font-weight: 500;
    font-family: 'DM Mono', monospace;
    color: #cbd5e1;
  }
  .db-perf-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  .db-stat-mini {
    text-align: center;
  }
  .db-stat-mini-val {
    font-size: 20px;
    font-weight: 600;
    font-family: 'DM Mono', monospace;
    color: #f1f5f9;
    letter-spacing: -0.03em;
  }
  .db-stat-mini-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #475569;
    margin-top: 2px;
  }
  .db-pill-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .db-pill {
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 99px;
    font-weight: 500;
  }
`;

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <style>{css}</style>
      <div className="db-root">
        <div className="db-header">
          <div>
            <div className="db-wordmark">Analytics</div>
            <div className="db-title">Overview</div>
          </div>
          <div className="db-badge">Mar 2026</div>
        </div>

        <div className="db-grid">
          {metrics.map((m) => (
            <div
              key={m.id}
              className="db-card"
              style={{ gridColumn: `span ${m.span}` }}
            >
              <div className="db-card-label">{m.label}</div>
              <div className="db-card-value">{m.value}</div>
              <div style={{ marginTop: 12 }}>
                <Spark points={sparkPoints} color={m.up ? "#6366f1" : "#f87171"} />
              </div>
              <div className={m.up ? "db-delta-up" : "db-delta-down"}>
                {m.up ? "↑" : "↓"} {m.delta}
              </div>
            </div>
          ))}

          <div className="db-card" style={{ gridColumn: "span 2" }}>
            <div className="db-section-title">Recent Activity</div>
            {activity.map((a, i) => (
              <div className="db-activity-row" key={i}>
                <div
                  className="db-avatar"
                  style={{ background: a.color + "20", color: a.color }}
                >
                  {a.icon}
                </div>
                <span className="db-activity-label">{a.label}</span>
                <span className="db-activity-time">{a.time}</span>
              </div>
            ))}
          </div>

          <div className="db-card" style={{ gridColumn: "span 2" }}>
            <div className="db-section-title">Traffic Sources</div>
            {channels.map((c, i) => (
              <div className="db-channel-row" key={i}>
                <div className="db-channel-meta">
                  <span className="db-channel-name">{c.label}</span>
                  <span className="db-channel-pct">{c.pct}%</span>
                </div>
                <Bar pct={c.pct} color={c.color} animated={mounted} />
              </div>
            ))}
          </div>

          <div className="db-card">
            <div className="db-section-title">Performance</div>
            <div style={{ display: "flex", justifyContent: "space-around", margin: "8px 0 16px" }}>
              {[
                { val: "98.4%", label: "Uptime" },
                { val: "142ms", label: "Latency" },
                { val: "0.3%", label: "Error rate" },
              ].map((s) => (
                <div className="db-stat-mini" key={s.label}>
                  <div className="db-stat-mini-val">{s.val}</div>
                  <div className="db-stat-mini-label">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="db-divider" />
            <div className="db-pill-row">
              {["API", "CDN", "DB", "Auth"].map((tag) => (
                <div
                  key={tag}
                  className="db-pill"
                  style={{ background: "#0f172a", color: "#10b981", border: "1px solid #10b98130" }}
                >
                  ● {tag}
                </div>
              ))}
            </div>
          </div>

          <div className="db-card">
            <div className="db-section-title">Growth</div>
            <div className="db-card-value" style={{ fontSize: 34, color: "#10b981" }}>+12.5%</div>
            <div style={{ marginTop: 14 }}>
              <Spark points={[20, 28, 25, 35, 30, 42, 38, 50, 46, 58, 55, 68]} color="#10b981" />
            </div>
            <div style={{ marginTop: 10, fontSize: 12, color: "#475569" }}>vs last quarter</div>
          </div>
        </div>
      </div>
    </>
  );
}
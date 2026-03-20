import { useState } from "react";

const insights = [
  {
    id: 1,
    flag: "MAJOR RED FLAG",
    flagColor: "#ff4d4d",
    icon: "",
    title: "Profitability is Inconsistent",
    metric: "23%",
    metricLabel: "transactions losing money",
    body: "Average profit stands at ₱2,802 — but 344 transactions are bleeding money. Some losses reach as deep as -₱4,642. Sales are being generated, but costs and expenses are running unchecked.",
    stat1: { label: "Avg Profit", value: "₱2,802" },
    stat2: { label: "Max Loss", value: "-₱4,642" },
    stat3: { label: "Loss Txns", value: "344" },
  },
  {
    id: 2,
    flag: "COST PROBLEM",
    flagColor: "#f97316",
    icon: "",
    title: "Cost & Expense Overrun",
    metric: "₱6,531",
    metricLabel: "costs vs ₱4,176 in sales",
    body: "In negative-profit transactions, costs and expenses routinely exceed sales. A single example: ₱4,176 in sales — ₱6,531 in costs — a ₱2,355 loss. Pricing strategy and operational efficiency need urgent review.",
    stat1: { label: "Sample Sales", value: "₱4,176" },
    stat2: { label: "Sample Costs", value: "₱6,531" },
    stat3: { label: "Net Loss", value: "-₱2,355" },
  },
  {
    id: 3,
    flag: "EXPERIENCE RISK",
    flagColor: "#a855f7",
    icon: "",
    title: "Customer Satisfaction Is Low",
    metric: "5.5",
    metricLabel: "out of 10 satisfaction score",
    body: "Customers are coming in — 66 per transaction period on average — but the experience is mediocre. A 5.5/10 score signals a real risk to repeat business and long-term revenue growth.",
    stat1: { label: "Avg Score", value: "5.5/10" },
    stat2: { label: "Avg Customers", value: "66/period" },
    stat3: { label: "Top Driver", value: "Service" },
  },
];

const recommendations = [
  {
    priority: "TOP PRIORITY",
    priorityColor: "#ff4d4d",
    number: "01",
    title: "Fix Profit Leakage Immediately",
    description:
      "Focus on the 23% of transactions generating losses. Set a minimum profit margin rule across all products. Review costs, expenses, pricing strategy, and discount policies. Stop selling items that consistently lose money unless they serve a clear strategic purpose.",
    actions: [
      "Set minimum margin thresholds per SKU",
      "Audit high-loss transaction records",
      "Review discount & promo structures",
      "Eliminate or reprice loss-leaders",
    ],
    impact: "High",
    effort: "Medium",
  },
  {
    priority: "CRITICAL",
    priorityColor: "#f97316",
    number: "02",
    title: "Improve Customer Satisfaction",
    description:
      "A 5.5/10 score is a warning sign. Focus on the four key drivers: Service, Hygiene, Quality, and Availability. Better experience drives repeat customers — and repeat customers drive sustainable revenue without acquisition costs.",
    actions: [
      "Launch staff training program",
      "Enforce store cleanliness standards",
      "Track product availability in real-time",
      "Implement satisfaction feedback loop",
    ],
    impact: "High",
    effort: "Low–Medium",
  },
  {
    priority: "STRATEGIC",
    priorityColor: "#22c55e",
    number: "03",
    title: "Branch Performance Optimization",
    description:
      "Pangasinan leads with a 42.6% margin. Replicate its playbook across Manila, Pampanga, and Bulacan. Identify what makes top branches succeed and systematize it. Use Branch at a Glance data to drive quarterly reviews.",
    actions: [
      "Benchmark Pangasinan best practices",
      "Set margin targets per branch",
      "Monthly branch performance reviews",
      "Cross-branch knowledge sharing",
    ],
    impact: "Medium–High",
    effort: "Medium",
  },
];

const execSummary = [
  { icon: "", label: "Generating strong sales", status: "positive" },
  { icon: "", label: "Losing profit due to poor cost control", status: "negative" },
  { icon: "", label: "At risk due to low customer satisfaction", status: "warning" },
];

export default function Insights() {
  const [activeInsight, setActiveInsight] = useState(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0d1117",
        color: "#e6edf3",
        fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        padding: "32px 40px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        * { box-sizing: border-box; }

        .insight-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          padding: 24px;
          cursor: pointer;
          transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .insight-card:hover {
          border-color: #30363d;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
        }
        .insight-card.active {
          border-color: var(--card-color);
          box-shadow: 0 0 0 1px var(--card-color), 0 8px 32px rgba(0,0,0,0.5);
        }
        .insight-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 4px; height: 100%;
          background: var(--card-color);
          border-radius: 12px 0 0 12px;
        }

        .reco-card {
          background: #161b22;
          border: 1px solid #21262d;
          border-radius: 12px;
          padding: 28px;
          transition: border-color 0.2s;
        }
        .reco-card:hover {
          border-color: #30363d;
        }

        .action-pill {
          background: #0d1117;
          border: 1px solid #30363d;
          border-radius: 6px;
          padding: 6px 12px;
          font-size: 12px;
          color: #8b949e;
          font-family: 'DM Mono', monospace;
          display: inline-block;
          margin: 4px 4px 4px 0;
        }

        .stat-box {
          background: #0d1117;
          border: 1px solid #21262d;
          border-radius: 8px;
          padding: 12px 16px;
          flex: 1;
          text-align: center;
        }

        .exec-row {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-radius: 10px;
          background: #161b22;
          border: 1px solid #21262d;
        }

        .tag {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
        }

        .badge-impact {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
        }
        .badge-effort {
          background: rgba(139, 148, 158, 0.1);
          color: #8b949e;
          border: 1px solid rgba(139, 148, 158, 0.2);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 12px;
          font-family: 'DM Mono', monospace;
        }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: "0.12em", color: "#8b949e", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
            ANALYTICS · INSIGHTS
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, color: "#e6edf3", letterSpacing: "-0.02em" }}>
          Insights & Recommendations
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 14, color: "#8b949e", fontWeight: 400 }}>
          Data-driven analysis across 1,500 records · 2022–2025 · 4 branches
        </p>
      </div>

      {/* ── INSIGHTS SECTION ── */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "#8b949e", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
          KEY FINDINGS
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 40 }}>
        {insights.map((ins) => (
          <div
            key={ins.id}
            className={`insight-card ${activeInsight === ins.id ? "active" : ""}`}
            style={{ "--card-color": ins.flagColor }}
            onClick={() => setActiveInsight(activeInsight === ins.id ? null : ins.id)}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <span
                className="tag"
                style={{ background: ins.flagColor + "18", color: ins.flagColor, border: `1px solid ${ins.flagColor}30` }}
              >
                {ins.flag}
              </span>
              <span style={{ fontSize: 22 }}>{ins.icon}</span>
            </div>

            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: ins.flagColor, lineHeight: 1, fontFamily: "'DM Mono', monospace" }}>
                {ins.metric}
              </div>
              <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>{ins.metricLabel}</div>
            </div>

            <h3 style={{ margin: "0 0 10px", fontSize: 15, fontWeight: 600, color: "#e6edf3" }}>{ins.title}</h3>
            <p style={{ margin: "0 0 16px", fontSize: 13, color: "#8b949e", lineHeight: 1.6 }}>{ins.body}</p>

            <div style={{ display: "flex", gap: 8 }}>
              {[ins.stat1, ins.stat2, ins.stat3].map((s, i) => (
                <div key={i} className="stat-box">
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e6edf3", fontFamily: "'DM Mono', monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#8b949e", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── RECOMMENDATIONS SECTION ── */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "#8b949e", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
          RECOMMENDATIONS
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 40 }}>
        {recommendations.map((rec) => (
          <div key={rec.number} className="reco-card">
            <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
              {/* Number */}
              <div
                style={{
                  fontSize: 48,
                  fontWeight: 700,
                  color: "#21262d",
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {rec.number}
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
                  <span
                    className="tag"
                    style={{ background: rec.priorityColor + "18", color: rec.priorityColor, border: `1px solid ${rec.priorityColor}30` }}
                  >
                    {rec.priority}
                  </span>
                  <span className="badge-impact">Impact: {rec.impact}</span>
                  <span className="badge-effort">Effort: {rec.effort}</span>
                </div>

                <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 600, color: "#e6edf3" }}>{rec.title}</h3>
                <p style={{ margin: "0 0 14px", fontSize: 13, color: "#8b949e", lineHeight: 1.65, maxWidth: 640 }}>{rec.description}</p>

                <div>
                  {rec.actions.map((a, i) => (
                    <span key={i} className="action-pill">→ {a}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── EXECUTIVE SUMMARY ── */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.1em", color: "#8b949e", fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
          EXECUTIVE SUMMARY
        </span>
      </div>

      <div
        style={{
          background: "#161b22",
          border: "1px solid #21262d",
          borderRadius: 12,
          padding: 28,
        }}
      >
        <h3 style={{ margin: "0 0 6px", fontSize: 17, fontWeight: 600, color: "#e6edf3" }}>
           Final Assessment
        </h3>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#8b949e" }}>
          Your business is at an inflection point. Two targeted fixes can unlock significant profitability.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {execSummary.map((item, i) => (
            <div key={i} className="exec-row">
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 500,
                  color:
                    item.status === "positive" ? "#22c55e" :
                    item.status === "negative" ? "#ff4d4d" :
                    "#f97316",
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, rgba(34,197,94,0.06) 0%, rgba(34,197,94,0.02) 100%)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 10,
            padding: "18px 22px",
          }}
        >
          <div style={{ fontSize: 13, color: "#8b949e", marginBottom: 10, fontFamily: "'DM Mono', monospace", letterSpacing: "0.05em" }}>
            IF YOU FIX JUST 2 THINGS:
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "#e6edf3" }}>Eliminate negative-profit transactions</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: 14, color: "#e6edf3" }}>Improve customer experience</span>
            </div>
          </div>
          <div style={{ marginTop: 14, fontSize: 15, fontWeight: 600, color: "#22c55e" }}>
             You can significantly increase overall profitability fast.
          </div>
        </div>
      </div>
    </div>
  );
}
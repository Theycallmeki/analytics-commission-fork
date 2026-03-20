import { useNavigate } from "react-router-dom";

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

/* ── Animations ── */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}
@keyframes navGlow {
  0%, 100% { text-shadow: 0 0 12px rgba(99,102,241,.3), 0 0 0px rgba(99,102,241,0); }
  50%       { text-shadow: 0 0 28px rgba(99,102,241,.6), 0 0 48px rgba(99,102,241,.18); }
}
@keyframes dotPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,.5); }
  50%       { box-shadow: 0 0 0 5px rgba(99,102,241,0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.home { min-height: 100vh; background: #080c14; color: #e2e8f0; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

/* NAV */
.home-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 22px 32px;
  border-bottom: 1px solid #1a2640;
  position: sticky;
  top: 0;
  background: #080c14;
  z-index: 100;
}
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #6366f1;
  flex-shrink: 0;
  animation: dotPulse 2.4s ease-in-out infinite;
}
.nav-logo {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.03em;
  background: linear-gradient(90deg, #f1f5f9 0%, #818cf8 35%, #f1f5f9 55%, #818cf8 100%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear 0.5s infinite, navGlow 3.5s ease-in-out 0.5s infinite;
}

/* HERO */
.hero { padding: 72px 32px 56px; max-width: 900px; margin: 0 auto; text-align: center; position: relative; }
.hero::before { content: ''; position: absolute; top: 40px; left: 50%; transform: translateX(-50%); width: 600px; height: 300px; background: radial-gradient(ellipse at center, rgba(99,102,241,.08) 0%, transparent 70%); pointer-events: none; border-radius: 50%; }
.hero-title { font-size: 52px; font-weight: 600; color: #f1f5f9; letter-spacing: -.04em; line-height: 1.1; margin-bottom: 20px; }
.hero-title span { color: #6366f1; }
.hero-sub { font-size: 16px; color: #64748b; line-height: 1.7; max-width: 560px; margin: 0 auto 36px; }
.hero-actions { display: flex; align-items: center; justify-content: center; gap: 12px; }
.btn-primary { font-size: 13px; font-weight: 500; padding: 11px 26px; border-radius: 99px; background: #6366f1; border: none; color: #fff; cursor: pointer; transition: .15s; font-family: 'DM Sans', sans-serif; }
.btn-primary:hover { background: #818cf8; }
.btn-ghost { font-size: 13px; font-weight: 500; padding: 11px 26px; border-radius: 99px; background: transparent; border: 1px solid #1a2640; color: #64748b; cursor: pointer; transition: .15s; font-family: 'DM Sans', sans-serif; }
.btn-ghost:hover { border-color: #2d3f5c; color: #94a3b8; }

/* STATS STRIP */
.stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #1a2640; border: 1px solid #1a2640; border-radius: 16px; overflow: hidden; margin: 0 32px 48px; }
.stat { background: #0d1625; padding: 24px 28px; text-align: center; }
.stat-val { font-size: 28px; font-weight: 600; font-family: 'DM Mono', monospace; color: #f1f5f9; letter-spacing: -.04em; line-height: 1; }
.stat-lbl { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #334155; margin-top: 6px; }

/* SECTION */
.home-section { padding: 0 32px 56px; }
.section-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; color: #475569; font-family: 'DM Mono', monospace; margin-bottom: 6px; }
.section-title { font-size: 26px; font-weight: 600; color: #f1f5f9; letter-spacing: -.03em; margin-bottom: 32px; }

/* BRANCH CARDS */
.branch-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 48px; }
.branch-card {
  background: #0d1625;
  border: 1px solid #1a2640;
  border-radius: 14px;
  padding: 18px 20px;
  border-left-width: 3px;
  cursor: pointer;
  transition: transform .18s, border-color .18s, box-shadow .18s;
  position: relative;
}
.branch-card:hover {
  transform: translateY(-3px);
  border-color: #2d3f5c;
  box-shadow: 0 8px 24px rgba(0,0,0,.35);
}
.branch-card:active { transform: translateY(-1px); }
.branch-card-arrow {
  position: absolute;
  top: 14px;
  right: 14px;
  font-size: 13px;
  color: #334155;
  transition: color .18s, transform .18s;
  line-height: 1;
}
.branch-card:hover .branch-card-arrow {
  color: #64748b;
  transform: translate(2px, -2px);
}
.branch-hint {
  font-size: 10px;
  color: #334155;
  font-family: 'DM Mono', monospace;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #1a2640;
  letter-spacing: .06em;
  transition: color .18s;
}
.branch-card:hover .branch-hint { color: #475569; }
.branch-name { font-size: 12px; font-weight: 600; color: #94a3b8; margin-bottom: 10px; }
.branch-val { font-size: 20px; font-weight: 600; font-family: 'DM Mono', monospace; color: #f1f5f9; letter-spacing: -.03em; line-height: 1; margin-bottom: 10px; }
.branch-meta { display: flex; flex-direction: column; gap: 5px; }
.bm-row { display: flex; justify-content: space-between; align-items: center; }
.bm-lbl { font-size: 11px; color: #334155; }
.bm-val { font-size: 11px; font-family: 'DM Mono', monospace; color: #64748b; }
.pill { font-size: 10px; font-weight: 500; padding: 2px 7px; border-radius: 99px; font-family: 'DM Mono', monospace; }
.pill-g { background: rgba(16,185,129,.1); color: #10b981; border: 1px solid rgba(16,185,129,.2); }
.pill-a { background: rgba(245,158,11,.1); color: #f59e0b; border: 1px solid rgba(245,158,11,.2); }

/* FEATURES */
.feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.feat-card { background: #0d1625; border: 1px solid #1a2640; border-radius: 16px; padding: 24px; transition: .2s; }
.feat-card:hover { border-color: #2d3f5c; transform: translateY(-2px); }
.feat-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.feat-title { font-size: 14px; font-weight: 600; color: #f1f5f9; margin-bottom: 8px; }
.feat-desc { font-size: 13px; color: #475569; line-height: 1.6; }

/* FOOTER */
.home-footer { border-top: 1px solid #1a2640; padding: 20px 32px; display: flex; align-items: center; justify-content: space-between; }
.footer-txt { font-size: 12px; color: #334155; font-family: 'DM Mono', monospace; }
.footer-links { display: flex; gap: 20px; }
.footer-link { font-size: 12px; color: #334155; cursor: pointer; transition: .15s; background: none; border: none; font-family: 'DM Mono', monospace; }
.footer-link:hover { color: #475569; }
`;

const BRANCHES = [
  { name: "Bulacan",    color: "#6366f1", sales: "₱2.41M", margin: "28.4%", marginColor: "#10b981", score: "7.82", target: "103%", pill: "pill-g" },
  { name: "Manila",     color: "#10b981", sales: "₱3.07M", margin: "31.2%", marginColor: "#10b981", score: "8.14", target: "111%", pill: "pill-g" },
  { name: "Pampanga",   color: "#f59e0b", sales: "₱1.88M", margin: "22.7%", marginColor: "#f59e0b", score: "7.41", target: "89%",  pill: "pill-a" },
  { name: "Pangasinan", color: "#f43f5e", sales: "₱2.23M", margin: "26.9%", marginColor: "#10b981", score: "7.96", target: "97%",  pill: "pill-a" },
];

const FEATURES = [
  {
    bg: "rgba(99,102,241,.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="8" width="3" height="8" rx="1" fill="#6366f1"/>
        <rect x="7" y="5" width="3" height="11" rx="1" fill="#6366f1" opacity=".7"/>
        <rect x="12" y="2" width="3" height="14" rx="1" fill="#6366f1" opacity=".45"/>
      </svg>
    ),
    title: "Sales vs Target",
    desc: "Compare actual sales against branch targets with hit-rate indicators. Instantly spot which branches are over- or under-performing.",
  },
  {
    bg: "rgba(16,185,129,.1)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 13L6 8L9 11L13 5L16 8" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Monthly Trends",
    desc: "Track sales and profit trends across all 12 months. Identify seasonality patterns and growth trajectories for each branch.",
  },
  {
    bg: "rgba(245,158,11,.1)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="6" stroke="#f59e0b" strokeWidth="1.5"/>
        <path d="M9 6v3l2 2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Yearly Performance",
    desc: "Year-over-year comparison from 2022 to 2025. See how each branch has grown and where investment is paying off.",
  },
  {
    bg: "rgba(244,63,94,.1)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L9 16M5 6L9 2L13 6" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Profit Margins",
    desc: "Per-branch margin analysis with high, low, and average breakdowns. Understand which branches are most operationally efficient.",
  },
  {
    bg: "rgba(99,102,241,.12)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="7" r="3" stroke="#6366f1" strokeWidth="1.5"/>
        <path d="M3 16c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Customer Satisfaction",
    desc: "Score breakdowns by satisfaction category on a 1–10 scale. Understand what drives customer loyalty across branches.",
  },
  {
    bg: "rgba(16,185,129,.1)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="6" height="6" rx="2" stroke="#10b981" strokeWidth="1.5"/>
        <rect x="10" y="2" width="6" height="6" rx="2" stroke="#10b981" strokeWidth="1.5" opacity=".5"/>
        <rect x="2" y="10" width="6" height="6" rx="2" stroke="#10b981" strokeWidth="1.5" opacity=".5"/>
        <rect x="10" y="10" width="6" height="6" rx="2" stroke="#10b981" strokeWidth="1.5" opacity=".3"/>
      </svg>
    ),
    title: "Branch Filter",
    desc: "Toggle between branches with a single click. Every chart and KPI updates instantly to reflect the selected branch's data.",
  },
];

export default function Home() {
  const navigate = useNavigate();

  const goToBranch = (branchName) => {
    navigate("/dashboard", { state: { branch: branchName } });
  };

  return (
    <>
      <style>{css}</style>
      <div className="home">

        {/* NAV — centered, shimmer + glow on brand name */}
        <nav className="home-nav">
          <div className="nav-brand">
            <div className="nav-dot" />
            <span className="nav-logo">Likha Organika</span>
          </div>
        </nav>

        {/* HERO */}
        <div className="hero">
          <h1 className="hero-title">
            Sales & Profit<br />
            <span>Dashboard</span>
          </h1>
          <p className="hero-sub">
            Unified analytics across Bulacan, Manila, Pampanga, and Pangasinan.
            Track sales, profit margins, customer satisfaction, and target hit
            rates — all in one place.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/dashboard")}>
              View Dashboard
            </button>
            <button className="btn-ghost" onClick={() => navigate("/about")}>
              Learn More
            </button>
          </div>
        </div>

        {/* BRANCH CARDS */}
        <div className="home-section">
          <div className="section-eyebrow">Branch Overview</div>
          <div className="section-title">All Locations at a Glance</div>

          <div className="branch-grid">
            {BRANCHES.map((b) => (
              <div
                className="branch-card"
                key={b.name}
                style={{ borderLeftColor: b.color }}
                onClick={() => goToBranch(b.name)}
                title={`View ${b.name} in dashboard`}
              >
                <span className="branch-card-arrow">↗</span>

                <div className="branch-name">{b.name}</div>
                <div className="branch-val">{b.sales}</div>
                <div className="branch-meta">
                  <div className="bm-row">
                    <span className="bm-lbl">Margin</span>
                    <span className="bm-val" style={{ color: b.marginColor }}>{b.margin}</span>
                  </div>
                  <div className="bm-row">
                    <span className="bm-lbl">Score</span>
                    <span className="bm-val">{b.score}</span>
                  </div>
                  <div className="bm-row">
                    <span className="bm-lbl">Target</span>
                    <span className={`pill ${b.pill}`}>{b.target}</span>
                  </div>
                </div>

                <div className="branch-hint">Click to view in dashboard</div>
              </div>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        <div className="home-section">
          <div className="section-eyebrow">What's Inside</div>
          <div className="section-title">Everything you need</div>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div className="feat-card" key={f.title}>
                <div className="feat-icon" style={{ background: f.bg }}>
                  {f.icon}
                </div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER */}
        <footer className="home-footer">
          <div className="nav-brand">
            <div className="nav-dot" style={{ width: 6, height: 6 }} />
            <span className="footer-txt">Likha Organika · Analytics Dashboard</span>
          </div>
          <div className="footer-links">
            <button className="footer-link" onClick={() => navigate("/dashboard")}>Dashboard</button>
            <button className="footer-link" onClick={() => navigate("/about")}>About</button>
          </div>
        </footer>

      </div>
    </>
  );
}
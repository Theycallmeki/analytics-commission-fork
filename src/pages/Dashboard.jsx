import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
} from "recharts";

import excelFile from "../assets/exempted latest.xlsm?url";
import logoSrc    from "../assets/business logo.jpeg";

const PALETTE = {
  Bulacan:    "#6366f1",
  Manila:     "#10b981",
  Pampanga:   "#f59e0b",
  Pangasinan: "#f43f5e",
};

const MONTH_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt  = (v) => v >= 1_000_000 ? `₱${(v/1_000_000).toFixed(2)}M` : v >= 1_000 ? `₱${(v/1_000).toFixed(1)}K` : `₱${v}`;
const fmtN = (v) => v >= 1_000 ? `${(v/1_000).toFixed(1)}K` : String(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:"10px 14px", fontFamily:"'DM Mono',monospace", fontSize:12 }}>
      <div style={{ color:"#64748b", marginBottom:6, fontWeight:500 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color, marginBottom:3 }}>
          {p.name}: <strong>{typeof p.value === "number" && p.value > 10000 ? fmt(p.value) : p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

function processSheet(rows) {
  const headers = rows[0];
  const data = rows.slice(1)
    .map(row => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? null])))
    .filter(r => r["Branch"]);

  const totals = {
    sales:     data.reduce((s, r) => s + (r["Sales"]          || 0), 0),
    profit:    data.reduce((s, r) => s + (r["Profit"]         || 0), 0),
    cost:      data.reduce((s, r) => s + (r["Cost"]           || 0), 0),
    expenses:  data.reduce((s, r) => s + (r["Expenses"]       || 0), 0),
    customers: data.reduce((s, r) => s + (r["Customer Count"] || 0), 0),
    target:    data.reduce((s, r) => s + (r["Target Sales"]   || 0), 0),
    avgScore:  +(data.reduce((s, r) => s + (r["Score"] || 0), 0) / data.length).toFixed(2),
  };

  const byBranch = {};
  data.forEach(r => {
    const b = r["Branch"];
    if (!byBranch[b]) byBranch[b] = { name:b, sales:0, target:0, profit:0, cost:0, expenses:0, customers:0, scoreSum:0, count:0 };
    byBranch[b].sales     += r["Sales"]          || 0;
    byBranch[b].target    += r["Target Sales"]   || 0;
    byBranch[b].profit    += r["Profit"]         || 0;
    byBranch[b].cost      += r["Cost"]           || 0;
    byBranch[b].expenses  += r["Expenses"]       || 0;
    byBranch[b].customers += r["Customer Count"] || 0;
    byBranch[b].scoreSum  += r["Score"]          || 0;
    byBranch[b].count     += 1;
  });
  const branches = Object.values(byBranch).map(b => ({
    ...b,
    score:   +(b.scoreSum / b.count).toFixed(2),
    margin:  +((b.profit / b.sales) * 100).toFixed(1),
    hitRate: +((b.sales  / b.target) * 100).toFixed(1),
  }));

  const byMonth = {};
  data.forEach(r => {
    const m = r["Month"];
    if (!byMonth[m]) byMonth[m] = { sales:0, profit:0, target:0, customers:0, cost:0, expenses:0 };
    byMonth[m].sales     += r["Sales"]          || 0;
    byMonth[m].profit    += r["Profit"]         || 0;
    byMonth[m].target    += r["Target Sales"]   || 0;
    byMonth[m].customers += r["Customer Count"] || 0;
    byMonth[m].cost      += r["Cost"]           || 0;
    byMonth[m].expenses  += r["Expenses"]       || 0;
  });
  const monthly = MONTH_ORDER.map((m, i) => ({
    m: MONTH_SHORT[i],
    sales:     byMonth[m]?.sales     || 0,
    profit:    byMonth[m]?.profit    || 0,
    target:    byMonth[m]?.target    || 0,
    customers: byMonth[m]?.customers || 0,
    cost:      byMonth[m]?.cost      || 0,
    expenses:  byMonth[m]?.expenses  || 0,
  }));

  const bySat = {};
  data.forEach(r => {
    const c = r["Customer Satisfaction"];
    if (!c) return;
    if (!bySat[c]) bySat[c] = { cat:c, scoreSum:0, count:0 };
    bySat[c].scoreSum += r["Score"] || 0;
    bySat[c].count    += 1;
  });
  const satisfaction = Object.values(bySat)
    .map(s => ({ cat: s.cat, score: +(s.scoreSum / s.count).toFixed(2) }))
    .sort((a, b) => b.score - a.score);

  const byYear = {};
  data.forEach(r => {
    const raw = r["Date"]; if (!raw) return;
    let year;
    if (typeof raw === "number") {
      year = new Date(Math.round((raw - 25569) * 86400 * 1000)).getFullYear();
    } else {
      const parts = String(raw).split("/");
      year = parts.length === 3 ? parseInt(parts[2]) : parseInt(String(raw).slice(0, 4));
    }
    if (!byYear[year]) byYear[year] = { year: String(year), sales:0, profit:0 };
    byYear[year].sales  += r["Sales"]  || 0;
    byYear[year].profit += r["Profit"] || 0;
  });
  const yearly = Object.values(byYear).sort((a, b) => a.year - b.year);

  return { totals, branches, monthly, satisfaction, yearly, rowCount: data.length };
}

/* ─── CSS ─────────────────────────────────────────────────── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(12px); }
  to   { opacity:1; transform:translateY(0);    }
}
@keyframes kpiPop {
  0%   { opacity:0; transform:scale(.94) translateY(8px); }
  100% { opacity:1; transform:scale(1)   translateY(0);   }
}

*  { box-sizing:border-box; margin:0; padding:0; }
body { background:#060a12; }

/* ── SHELL ── */
.db  { min-height:100vh; background:#060a12; font-family:'DM Sans',sans-serif; color:#e2e8f0; }

/* ── TOP HEADER ── */
.db-topbar {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 16px 28px;
  background: #080c14;
  border-bottom: 1px solid #1a2640;
  position: sticky; top:0; z-index:50;
}
.db-logo-ring {
  width: 52px; height: 52px;
  border-radius: 50%;
  padding: 2px;
  background: linear-gradient(135deg,#6366f1,#1a2640,#6366f1);
  flex-shrink: 0;
}
.db-logo-inner {
  width:100%; height:100%;
  border-radius:50%; overflow:hidden;
  border:2px solid #060a12;
}
.db-logo-inner img { width:100%; height:100%; object-fit:cover; display:block; }
.db-topbar-center { flex:1; text-align:center; }
.db-top-eyebrow {
  font-size:10px; font-weight:500; letter-spacing:.18em;
  text-transform:uppercase; color:#475569;
  font-family:'DM Mono',monospace; margin-bottom:2px;
}
.db-top-title {
  font-size:22px; font-weight:700; letter-spacing:-.02em;
  background: linear-gradient(90deg,#f1f5f9 0%,#818cf8 40%,#f1f5f9 60%,#818cf8 100%);
  background-size:200% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  background-clip:text;
  animation: shimmer 5s linear .5s infinite;
}
.db-topbar-right { display:flex; align-items:center; gap:10px; }
.db-badge {
  font-size:11px; padding:5px 12px; border-radius:99px;
  background:#0d1625; border:1px solid #1a2640;
  color:#475569; font-family:'DM Mono',monospace;
}
.db-live-dot {
  width:8px; height:8px; border-radius:50%; background:#10b981;
  animation: pulse 2s ease-in-out infinite;
}
@keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.4);} 50%{box-shadow:0 0 0 5px rgba(16,185,129,0);} }

/* ── BODY ── */
.db-body { padding:22px 28px; }

/* ── FILTER ROW ── */
.filter-bar {
  display:flex; align-items:center; gap:8px;
  margin-bottom:20px; flex-wrap:wrap;
}
.filter-label {
  font-size:10px; font-weight:500; letter-spacing:.12em;
  text-transform:uppercase; color:#334155;
  font-family:'DM Mono',monospace; margin-right:4px;
}
.fbtn {
  font-size:12px; font-weight:500; padding:6px 16px;
  border-radius:99px; background:#0d1625;
  border:1px solid #1a2640; color:#64748b;
  cursor:pointer; transition:.15s; font-family:'DM Sans',sans-serif;
}
.fbtn:hover { border-color:#2d3f5c; color:#94a3b8; }
.fbtn.on          { background:rgba(99,102,241,.1);  border-color:rgba(99,102,241,.4); color:#818cf8; }
.fbtn.on-bulacan  { background:rgba(99,102,241,.12); border-color:rgba(99,102,241,.5); color:#818cf8; }
.fbtn.on-manila   { background:rgba(16,185,129,.1);  border-color:rgba(16,185,129,.4); color:#34d399; }
.fbtn.on-pampanga { background:rgba(245,158,11,.1);  border-color:rgba(245,158,11,.4); color:#fbbf24; }
.fbtn.on-pangasinan{background:rgba(244,63,94,.1);  border-color:rgba(244,63,94,.4);  color:#fb7185; }

/* ── KPI ROW ── */
.kpi-row {
  display:grid; grid-template-columns:repeat(4,1fr);
  gap:14px; margin-bottom:20px;
}
.kpi-card {
  background:#0d1625; border:1px solid #1a2640;
  border-radius:16px; padding:18px 20px;
  display:flex; align-items:center; gap:16px;
  animation: kpiPop .45s ease both;
  transition: border-color .2s, transform .2s;
}
.kpi-card:hover { border-color:#2d3f5c; transform:translateY(-2px); }
.kpi-icon {
  width:44px; height:44px; border-radius:12px;
  display:flex; align-items:center; justify-content:center;
  flex-shrink:0; font-size:20px;
}
.kpi-text {}
.kpi-label {
  font-size:10px; font-weight:500; text-transform:uppercase;
  letter-spacing:.1em; color:#334155; margin-bottom:5px;
}
.kpi-value {
  font-size:22px; font-weight:700; font-family:'DM Mono',monospace;
  color:#f1f5f9; letter-spacing:-.04em; line-height:1;
}
.kpi-sub { font-size:11px; color:#475569; margin-top:4px; }

/* ── CHART GRID ── */
.chart-grid-top {
  display:grid; grid-template-columns:2fr 1fr 1fr;
  gap:14px; margin-bottom:14px;
}
.chart-grid-bottom {
  display:grid; grid-template-columns:1fr 1fr 1fr;
  gap:14px;
}
.card {
  background:#0d1625; border:1px solid #1a2640;
  border-radius:16px; padding:20px 22px;
  animation: fadeUp .4s ease both;
}
.card-header {
  display:flex; align-items:center;
  justify-content:space-between; margin-bottom:16px;
}
.card-label {
  font-size:10px; font-weight:600; letter-spacing:.14em;
  text-transform:uppercase; color:#475569;
}
.card-sub { font-size:11px; color:#334155; font-family:'DM Mono',monospace; }

/* ── BRANCH VS TARGET BARS ── */
.br-row { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #0f1c2e; }
.br-row:last-child { border-bottom:none; }
.br-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.br-name { font-size:12px; font-weight:500; color:#94a3b8; width:82px; flex-shrink:0; }
.br-track { flex:1; height:6px; background:#1a2640; border-radius:99px; overflow:hidden; }
.br-fill  { height:100%; border-radius:99px; transition:width .6s ease; }
.br-val   { font-size:11px; font-family:'DM Mono',monospace; color:#f1f5f9; width:72px; text-align:right; }
.br-pill  { font-size:10px; font-weight:500; padding:2px 8px; border-radius:99px; font-family:'DM Mono',monospace; white-space:nowrap; }
.pill-g   { background:rgba(16,185,129,.1);  color:#10b981; border:1px solid rgba(16,185,129,.2); }
.pill-a   { background:rgba(245,158,11,.1);  color:#f59e0b; border:1px solid rgba(245,158,11,.2); }

/* ── SATISFACTION ── */
.sat-row  { display:flex; align-items:center; gap:10px; padding:8px 0; border-bottom:1px solid #0f1c2e; }
.sat-row:last-child { border-bottom:none; }
.sat-name { font-size:12px; color:#64748b; width:80px; flex-shrink:0; }
.sat-track{ flex:1; height:6px; background:#1a2640; border-radius:99px; overflow:hidden; }
.sat-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#6366f1,#818cf8); }
.sat-val  { font-size:12px; font-family:'DM Mono',monospace; color:#94a3b8; width:28px; text-align:right; }

/* ── GLANCE MINI CARDS ── */
.glance-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.glance-card {
  border-radius:12px; padding:13px 14px;
  cursor:pointer; transition:.15s;
}
.glance-card:hover { filter:brightness(1.1); }
.glance-name  { font-size:11px; font-weight:600; color:#94a3b8; margin-bottom:6px; }
.glance-val   { font-size:17px; font-weight:700; font-family:'DM Mono',monospace; color:#f1f5f9; letter-spacing:-.03em; }
.glance-meta  { display:flex; justify-content:space-between; margin-top:6px; }
.glance-lbl   { font-size:10px; color:#475569; }
.glance-num   { font-size:10px; font-family:'DM Mono',monospace; color:#64748b; }

/* ── STAT SUMMARY ── */
.stat-summary { display:flex; gap:0; margin-top:14px; padding-top:12px; border-top:1px solid #1a2640; }
.stat-item    { flex:1; text-align:center; padding:0 6px; }
.stat-item + .stat-item { border-left:1px solid #1a2640; }
.stat-v       { font-size:16px; font-weight:700; font-family:'DM Mono',monospace; color:#f1f5f9; letter-spacing:-.03em; }
.stat-l       { font-size:9px; text-transform:uppercase; letter-spacing:.08em; color:#334155; margin-top:3px; }

/* ── LOADING ── */
.loading { display:flex; align-items:center; justify-content:center; min-height:80vh; flex-direction:column; gap:12px; }
.loading-dots { display:flex; gap:6px; }
.loading-dot  { width:8px; height:8px; border-radius:50%; background:#6366f1; animation:ldot 1.2s ease-in-out infinite; }
.loading-dot:nth-child(2){ animation-delay:.2s; }
.loading-dot:nth-child(3){ animation-delay:.4s; }
@keyframes ldot { 0%,100%{opacity:.2;} 50%{opacity:1;} }
.loading-txt { font-size:12px; color:#475569; font-family:'DM Mono',monospace; }
`;

/* ─── KPI icon components ─────────────────────────────────── */
const SalesIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const ProfitIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
  </svg>
);
const CustomerIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
  </svg>
);

/* ─── COMPONENT ───────────────────────────────────────────── */
export default function Dashboard() {
  const location      = useLocation();
  const initialBranch = location.state?.branch ?? "All";

  const [data,   setData]   = useState(null);
  const [branch, setBranch] = useState(initialBranch);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    fetch(excelFile)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const wb   = XLSX.read(buf, { type:"array" });
        const ws   = wb.Sheets["Raw Data"];
        const rows = XLSX.utils.sheet_to_json(ws, { header:1, defval:null });
        setData(processSheet(rows));
      })
      .catch(e => setError(String(e)));
  }, []);

  useEffect(() => {
    if (location.state?.branch) setBranch(location.state.branch);
  }, [location.state]);

  /* ── loading / error ── */
  if (error) return (
    <div className="db"><style>{css}</style>
      <div className="loading">
        <div style={{ color:"#f87171", fontFamily:"'DM Mono',monospace", fontSize:13 }}>Failed to load Excel file</div>
        <div style={{ color:"#475569", fontFamily:"'DM Mono',monospace", fontSize:11 }}>{error}</div>
      </div>
    </div>
  );
  if (!data) return (
    <div className="db"><style>{css}</style>
      <div className="loading">
        <div className="loading-dots">
          <div className="loading-dot"/><div className="loading-dot"/><div className="loading-dot"/>
        </div>
        <div className="loading-txt">Loading Excel data…</div>
      </div>
    </div>
  );

  const { totals, branches, monthly, satisfaction, yearly, rowCount } = data;
  const active     = branch === "All" ? null : branches.find(b => b.name === branch);
  const maxSales   = Math.max(...branches.map(b => b.sales));
  const branchRows = active ? [active] : branches;
  const margins    = branches.map(b => b.margin);
  const avgMargin  = +(margins.reduce((s, v) => s + v, 0) / margins.length).toFixed(1);

  const activeBtnClass = (b) => {
    if (branch !== b) return "";
    if (b === "All")  return "on";
    return `on on-${b.toLowerCase()}`;
  };

  const kpis = [
    {
      label: "Total Sales", icon: <SalesIcon />, iconBg: "rgba(99,102,241,.12)",
      value: fmt(active ? active.sales    : totals.sales),
      sub:   active ? `Target ${fmt(active.target)}` : `Target ${fmt(totals.target)}`,
    },
    {
      label: "Total Profit", icon: <ProfitIcon />, iconBg: "rgba(16,185,129,.1)",
      value: fmt(active ? active.profit   : totals.profit),
      sub:   `Margin ${active ? active.margin : ((totals.profit/totals.sales)*100).toFixed(1)}%`,
    },
    {
      label: "Customer Count", icon: <CustomerIcon />, iconBg: "rgba(245,158,11,.1)",
      value: fmtN(active ? active.customers : totals.customers),
      sub:   "Total served",
    },
    {
      label: "Target Sales", icon: <TargetIcon />, iconBg: "rgba(244,63,94,.1)",
      value: fmt(active ? active.target   : totals.target),
      sub:   active
        ? `Hit rate ${active.hitRate}%`
        : `Hit rate ${((totals.sales/totals.target)*100).toFixed(1)}%`,
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="db">

        {/* ── TOP HEADER ── */}
        <div className="db-topbar">
          <div className="db-logo-ring">
            <div className="db-logo-inner">
              <img src={logoSrc} alt="Likha Organika" />
            </div>
          </div>

          <div className="db-topbar-center">
            <div className="db-top-eyebrow">Analytics · Exempted Records</div>
            <div className="db-top-title">Sales &amp; Profit Dashboard</div>
          </div>

          <div className="db-topbar-right">
            <div className="db-live-dot" />
            <div className="db-badge">2022 – 2025 · {rowCount.toLocaleString()} records</div>
          </div>
        </div>

        <div className="db-body">

          {/* ── FILTER BAR ── */}
          <div className="filter-bar">
            <span className="filter-label">Branch</span>
            {["All", ...branches.map(b => b.name)].map(b => (
              <button
                key={b}
                className={`fbtn ${activeBtnClass(b)}`}
                onClick={() => setBranch(b)}
              >
                {b !== "All" && (
                  <span style={{
                    display:"inline-block", width:7, height:7,
                    borderRadius:"50%", background:PALETTE[b],
                    marginRight:6, verticalAlign:"middle",
                  }}/>
                )}
                {b}
              </button>
            ))}
          </div>

          {/* ── 4 KPI CARDS ── */}
          <div className="kpi-row">
            {kpis.map((k, i) => (
              <div className="kpi-card" key={i} style={{ animationDelay:`${i * 0.07}s` }}>
                <div className="kpi-icon" style={{ background: k.iconBg }}>
                  {k.icon}
                </div>
                <div className="kpi-text">
                  <div className="kpi-label">{k.label}</div>
                  <div className="kpi-value">{k.value}</div>
                  <div className="kpi-sub">{k.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── TOP CHART ROW: Sales vs Target | Customer Count | Cost & Expenses ── */}
          <div className="chart-grid-top">

            {/* Sales vs Target per Month */}
            <div className="card">
              <div className="card-header">
                <span className="card-label">Sales vs Target per Month</span>
                <span className="card-sub">
                  <span style={{ display:"inline-block", width:8, height:8, borderRadius:2, background:"#6366f1", marginRight:5, verticalAlign:"middle" }}/>Sales &nbsp;
                  <span style={{ display:"inline-block", width:8, height:8, borderRadius:2, background:"#334155", marginRight:5, verticalAlign:"middle" }}/>Target
                </span>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={monthly} margin={{ top:4, right:4, left:-18, bottom:0 }} barGap={2}>
                  <XAxis dataKey="m" tick={{ fill:"#475569", fontSize:9, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:9, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="target" name="Target" fill="#1e3a5f" radius={[3,3,0,0]} />
                  <Bar dataKey="sales"  name="Sales"  fill="#6366f1" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Count by Month */}
            <div className="card">
              <div className="card-header">
                <span className="card-label">Customer Count by Month</span>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={monthly} margin={{ top:4, right:8, left:-18, bottom:0 }}>
                  <XAxis dataKey="m" tick={{ fill:"#475569", fontSize:9, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:9, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="customers" name="Customers" stroke="#f59e0b" strokeWidth={2} dot={{ r:3, fill:"#f59e0b" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Cost & Expenses */}
            <div className="card">
              <div className="card-header">
                <span className="card-label">Cost &amp; Expenses</span>
                <span className="card-sub">
                  <span style={{ display:"inline-block", width:8, height:8, borderRadius:2, background:"#6366f1", marginRight:5, verticalAlign:"middle" }}/>Cost &nbsp;
                  <span style={{ display:"inline-block", width:8, height:8, borderRadius:2, background:"#334155", marginRight:5, verticalAlign:"middle" }}/>Expenses
                </span>
              </div>
              <ResponsiveContainer width="100%" height={190}>
                <BarChart data={monthly} margin={{ top:4, right:4, left:-18, bottom:0 }} barGap={2}>
                  <XAxis dataKey="m" tick={{ fill:"#475569", fontSize:9, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#475569", fontSize:9, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="cost"     name="Cost"     fill="#6366f1" radius={[3,3,0,0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#334155" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── BOTTOM CHART ROW ── */}
          <div className="chart-grid-bottom">

            {/* Customer Satisfaction Score */}
            <div className="card">
              <div className="card-header">
                <span className="card-label">Customer Satisfaction Score</span>
              </div>
              {satisfaction.map(s => (
                <div className="sat-row" key={s.cat}>
                  <span className="sat-name">{s.cat}</span>
                  <div className="sat-track">
                    <div className="sat-fill" style={{ width:`${(s.score/10)*100}%` }} />
                  </div>
                  <span className="sat-val">{s.score.toFixed(1)}</span>
                </div>
              ))}
            </div>

            {/* Profit vs Sales by Branch */}
            <div className="card">
              <div className="card-header">
                <span className="card-label">Profit vs Sales by Branch</span>
              </div>
              {branchRows.map(b => (
                <div className="br-row" key={b.name}>
                  <div className="br-dot" style={{ background:PALETTE[b.name] }} />
                  <span className="br-name">{b.name}</span>
                  <div className="br-track">
                    <div className="br-fill" style={{ width:`${(b.sales/maxSales)*100}%`, background:PALETTE[b.name] }} />
                  </div>
                  <span className="br-val">{fmt(b.sales)}</span>
                  <span className={`br-pill ${b.hitRate >= 100 ? "pill-g" : "pill-a"}`}>{b.hitRate}%</span>
                </div>
              ))}
              <div className="stat-summary">
                <div className="stat-item">
                  <div className="stat-v">{fmt(active ? active.profit : totals.profit)}</div>
                  <div className="stat-l">Total Profit</div>
                </div>
                <div className="stat-item">
                  <div className="stat-v">{active ? active.margin : ((totals.profit/totals.sales)*100).toFixed(1)}%</div>
                  <div className="stat-l">Margin</div>
                </div>
                <div className="stat-item">
                  <div className="stat-v">{Math.max(...margins).toFixed(1)}%</div>
                  <div className="stat-l">Best</div>
                </div>
              </div>
            </div>

            {/* Branch at a Glance */}
            <div className="card">
              <div className="card-header">
                <span className="card-label">Branch at a Glance</span>
              </div>
              <div className="glance-grid">
                {branches.map(b => (
                  <div
                    key={b.name}
                    className="glance-card"
                    onClick={() => setBranch(b.name)}
                    style={{
                      background: branch === b.name ? "#0f1e35" : "#0f172a",
                      border: `1px solid ${branch === b.name ? PALETTE[b.name]+"66" : "#1a2640"}`,
                      borderLeft: `3px solid ${PALETTE[b.name]}`,
                    }}
                  >
                    <div className="glance-name">{b.name}</div>
                    <div className="glance-val">{fmt(b.sales)}</div>
                    <div className="glance-meta">
                      <span className="glance-lbl">Score</span>
                      <span className="glance-num" style={{ color:PALETTE[b.name] }}>{b.score.toFixed(2)}</span>
                    </div>
                    <div className="glance-meta">
                      <span className="glance-lbl">Margin</span>
                      <span className="glance-num" style={{ color:"#10b981" }}>{b.margin}%</span>
                    </div>
                    <div className="glance-meta">
                      <span className="glance-lbl">Customers</span>
                      <span className="glance-num">{fmtN(b.customers)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
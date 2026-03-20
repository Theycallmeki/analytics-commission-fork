import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import { CartesianGrid } from 'recharts';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
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

/* ── Tooltip ── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0a1628", border:"1px solid #1e3a5f", borderRadius:10, padding:"10px 14px", fontFamily:"'DM Mono',monospace", fontSize:12, minWidth:150 }}>
      <div style={{ color:"#94a3b8", marginBottom:7, fontWeight:600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color:p.color, marginBottom:4, display:"flex", justifyContent:"space-between", gap:16 }}>
          <span>{p.name}</span>
          <strong>{typeof p.value === "number" && p.value > 10000 ? fmt(p.value) : p.value?.toLocaleString()}</strong>
        </div>
      ))}
    </div>
  );
};

/* ── Data processing ── */
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
    scoreSum:  data.reduce((s, r) => s + (r["Score"]          || 0), 0),
    scoreCount:data.length,
  };
  totals.avgScore   = +(totals.scoreSum / totals.scoreCount).toFixed(2);
  totals.profitPct  = +((totals.profit / totals.sales) * 100).toFixed(1);

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

  return { totals, branches, monthly, satisfaction, rowCount: data.length };
}

/* ── CSS ── */
const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

@keyframes shimmer {
  0%   { background-position:-200% center; }
  100% { background-position: 200% center; }
}
@keyframes fadeUp {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes kpiPop {
  0%   { opacity:0; transform:scale(.93) translateY(10px); }
  100% { opacity:1; transform:scale(1)   translateY(0); }
}
@keyframes pulse {
  0%,100% { box-shadow:0 0 0 0 rgba(16,185,129,.4); }
  50%     { box-shadow:0 0 0 6px rgba(16,185,129,0); }
}

*, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
body { background:#060a12; }
.db  { min-height:100vh; background:#060a12; font-family:'DM Sans',sans-serif; color:#e2e8f0; }

/* ── TOPBAR ── */
.db-topbar {
  display:flex; align-items:center; gap:18px;
  padding:14px 28px; background:#080c14;
  border-bottom:1px solid #1a2640;
  position:sticky; top:0; z-index:50;
}
.db-logo-ring {
  width:50px; height:50px; border-radius:50%; padding:2px; flex-shrink:0;
  background:linear-gradient(135deg,#6366f1,#1a2640,#6366f1);
}
.db-logo-inner { width:100%; height:100%; border-radius:50%; overflow:hidden; border:2px solid #060a12; }
.db-logo-inner img { width:100%; height:100%; object-fit:cover; display:block; }
.db-topbar-center { flex:1; text-align:center; }
.db-top-eyebrow {
  font-size:10px; font-weight:500; letter-spacing:.18em;
  text-transform:uppercase; color:#475569;
  font-family:'DM Mono',monospace; margin-bottom:2px;
}
.db-top-title {
  font-size:21px; font-weight:700; letter-spacing:-.02em;
  background:linear-gradient(90deg,#f1f5f9 0%,#818cf8 38%,#f1f5f9 58%,#818cf8 100%);
  background-size:200% auto;
  -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  animation:shimmer 5s linear .5s infinite;
}
.db-topbar-right { display:flex; align-items:center; gap:10px; }
.db-live-dot { width:8px; height:8px; border-radius:50%; background:#10b981; animation:pulse 2s ease-in-out infinite; }
.db-badge {
  font-size:11px; padding:5px 12px; border-radius:99px;
  background:#0d1625; border:1px solid #1a2640;
  color:#475569; font-family:'DM Mono',monospace;
}

/* ── BODY ── */
.db-body { padding:20px 28px 32px; }

/* ── FILTER ── */
.filter-bar { display:flex; align-items:center; gap:8px; margin-bottom:18px; flex-wrap:wrap; }
.filter-label {
  font-size:11px; font-weight:500; letter-spacing:.12em;
  text-transform:uppercase; color:#475569;
  font-family:'DM Mono',monospace; margin-right:4px;
}
.fbtn {
  font-size:12px; font-weight:500; padding:6px 16px;
  border-radius:99px; background:#0d1625; border:1px solid #1a2640;
  color:#64748b; cursor:pointer; transition:.15s; font-family:'DM Sans',sans-serif;
}
.fbtn:hover { border-color:#2d3f5c; color:#94a3b8; }
.fbtn.on           { background:rgba(99,102,241,.1);  border-color:rgba(99,102,241,.45); color:#818cf8; }
.fbtn.on-bulacan   { background:rgba(99,102,241,.12); border-color:rgba(99,102,241,.55); color:#818cf8; }
.fbtn.on-manila    { background:rgba(16,185,129,.1);  border-color:rgba(16,185,129,.45); color:#34d399; }
.fbtn.on-pampanga  { background:rgba(245,158,11,.1);  border-color:rgba(245,158,11,.45); color:#fbbf24; }
.fbtn.on-pangasinan{ background:rgba(244,63,94,.1);   border-color:rgba(244,63,94,.45);  color:#fb7185; }

/* ── KPI ROW — 6 cards ── */
.kpi-row {
  display:grid; grid-template-columns:repeat(6,1fr);
  gap:12px; margin-bottom:18px;
}
.kpi-card {
  background:#0d1625; border:1px solid #1a2640; border-radius:16px;
  padding:16px 18px;
  animation:kpiPop .45s ease both;
  transition:border-color .2s, transform .2s, box-shadow .2s;
}
.kpi-card:hover { border-color:#2d3f5c; transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.3); }
.kpi-icon-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.kpi-icon { width:36px; height:36px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.kpi-label { font-size:10px; font-weight:600; text-transform:uppercase; letter-spacing:.1em; color:#64748b; }
.kpi-value { font-size:20px; font-weight:700; font-family:'DM Mono',monospace; color:#f1f5f9; letter-spacing:-.04em; line-height:1; margin-bottom:4px; }
.kpi-sub   { font-size:11px; color:#64748b; }

/* ── CHART GRIDS ── */
.chart-row-top    { display:grid; grid-template-columns:2fr 1fr 1fr; gap:14px; margin-bottom:14px; }
.chart-row-bottom { display:grid; grid-template-columns:1fr 1fr 1fr; gap:14px; }

/* ── CARD ── */
.card {
  background:#0d1625; border:1px solid #1a2640; border-radius:16px;
  padding:20px 22px; animation:fadeUp .4s ease both;
}
.card-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:16px; gap:8px; }
.card-title  { font-size:11px; font-weight:600; letter-spacing:.14em; text-transform:uppercase; color:#94a3b8; line-height:1.4; }
.legend-row  { display:flex; align-items:center; gap:12px; flex-wrap:wrap; }
.legend-item { display:flex; align-items:center; gap:5px; font-size:11px; color:#94a3b8; font-family:'DM Mono',monospace; white-space:nowrap; }
.legend-dot  { width:9px; height:9px; border-radius:2px; flex-shrink:0; }

/* ── BRANCH BAR ROWS ── */
.br-row  { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid #0f1c2e; }
.br-row:last-child { border-bottom:none; }
.br-dot  { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.br-name { font-size:13px; font-weight:600; color:#f1f5f9; width:82px; flex-shrink:0; }
.br-track{ flex:1; height:6px; background:#1a2640; border-radius:99px; overflow:hidden; }
.br-fill { height:100%; border-radius:99px; }
.br-val  { font-size:12px; font-family:'DM Mono',monospace; color:#f1f5f9; width:72px; text-align:right; }
.br-pill { font-size:11px; font-weight:600; padding:2px 8px; border-radius:99px; font-family:'DM Mono',monospace; white-space:nowrap; }
.pill-g  { background:rgba(16,185,129,.15); color:#10b981; border:1px solid rgba(16,185,129,.3); }
.pill-a  { background:rgba(245,158,11,.15); color:#f59e0b; border:1px solid rgba(245,158,11,.3); }

/* ── SATISFACTION ── */
.sat-row  { display:flex; align-items:center; gap:10px; padding:9px 0; border-bottom:1px solid #0f1c2e; }
.sat-row:last-child { border-bottom:none; }
.sat-name { font-size:13px; font-weight:500; color:#f1f5f9; width:82px; flex-shrink:0; }
.sat-track{ flex:1; height:7px; background:#1a2640; border-radius:99px; overflow:hidden; }
.sat-fill { height:100%; border-radius:99px; background:linear-gradient(90deg,#4f46e5,#818cf8); }
.sat-val  { font-size:13px; font-weight:600; font-family:'DM Mono',monospace; color:#f1f5f9; width:32px; text-align:right; }

/* ── GLANCE GRID ── */
.glance-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
.glance-card { border-radius:12px; padding:13px 14px; cursor:pointer; transition:.15s; }
.glance-card:hover { filter:brightness(1.12); }
.glance-name { font-size:12px; font-weight:700; color:#ffffff; margin-bottom:6px; }
.glance-val  { font-size:18px; font-weight:700; font-family:'DM Mono',monospace; color:#ffffff; letter-spacing:-.03em; margin-bottom:6px; }
.glance-row  { display:flex; justify-content:space-between; margin-top:5px; }
.glance-lbl  { font-size:11px; color:#ffffff; font-weight:500; }
.glance-num  { font-size:11px; font-family:'DM Mono',monospace; color:#ffffff; font-weight:600; }

/* ── STAT STRIP ── */
.stat-strip { display:flex; margin-top:14px; padding-top:12px; border-top:1px solid #1a2640; }
.stat-item  { flex:1; text-align:center; padding:0 6px; }
.stat-item + .stat-item { border-left:1px solid #1a2640; }
.stat-v { font-size:15px; font-weight:700; font-family:'DM Mono',monospace; color:#f1f5f9; letter-spacing:-.03em; }
.stat-l { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:#64748b; margin-top:3px; }

/* ── LOADING ── */
.loading { display:flex; align-items:center; justify-content:center; min-height:80vh; flex-direction:column; gap:12px; }
.loading-dots { display:flex; gap:6px; }
.loading-dot  { width:8px; height:8px; border-radius:50%; background:#6366f1; animation:ldot 1.2s ease-in-out infinite; }
.loading-dot:nth-child(2){ animation-delay:.2s; }
.loading-dot:nth-child(3){ animation-delay:.4s; }
@keyframes ldot { 0%,100%{opacity:.2;} 50%{opacity:1;} }
.loading-txt { font-size:12px; color:#475569; font-family:'DM Mono',monospace; }
`;

/* ── KPI Icons ── */
const SalesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const ProfitIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);
const CustomerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fb7185" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);
const MarginIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="5" x2="5" y2="19"/>
    <circle cx="6.5" cy="6.5" r="2.5"/>
    <circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const ScoreIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

/* ── COMPONENT ── */
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

  const { totals, branches, monthly, satisfaction, rowCount } = data;
  const active     = branch === "All" ? null : branches.find(b => b.name === branch);
  const maxSales   = Math.max(...branches.map(b => b.sales));
  const branchRows = active ? [active] : branches;
  const margins    = branches.map(b => b.margin);

  /* Profit vs Sales grouped bar data */
  const branchBarData = branchRows.map(b => ({
    name:   b.name,
    Sales:  b.sales,
    Profit: b.profit,
    color:  PALETTE[b.name],
  }));

  const activeBtnClass = (b) => {
    if (branch !== b) return "";
    if (b === "All")  return "on";
    return `on on-${b.toLowerCase()}`;
  };

  const activeMargin   = active ? active.margin   : totals.profitPct;
  const activeScore    = active ? active.score     : totals.avgScore;
  const activeCustomers= active ? active.customers : totals.customers;

  const kpis = [
    {
      label:"Total Sales",    icon:<SalesIcon/>,    iconBg:"rgba(99,102,241,.14)",
      value: fmt(active ? active.sales   : totals.sales),
      sub:   `Target ${fmt(active ? active.target : totals.target)}`,
    },
    {
      label:"Total Profit",   icon:<ProfitIcon/>,   iconBg:"rgba(16,185,129,.12)",
      value: fmt(active ? active.profit  : totals.profit),
      sub:   `Hit rate ${active ? active.hitRate : ((totals.sales/totals.target)*100).toFixed(1)}%`,
    },
    {
      label:"Customer Count", icon:<CustomerIcon/>, iconBg:"rgba(245,158,11,.12)",
      value: fmtN(activeCustomers),
      sub:   "Total served",
    },
    {
      label:"Target Sales",   icon:<TargetIcon/>,   iconBg:"rgba(244,63,94,.12)",
      value: fmt(active ? active.target  : totals.target),
      sub:   `${active ? active.hitRate : ((totals.sales/totals.target)*100).toFixed(1)}% achieved`,
    },
    {
      label:"Profit Margin",  icon:<MarginIcon/>,   iconBg:"rgba(167,139,250,.12)",
      value: `${activeMargin}%`,
      sub:   "Net margin rate",
    },
    {
      label:"Avg Satisfaction",icon:<ScoreIcon/>,   iconBg:"rgba(244,114,182,.12)",
      value: activeScore.toFixed(2),
      sub:   "Out of 10 scale",
    },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="db">

        {/* TOPBAR */}
        <div className="db-topbar">
          <div className="db-logo-ring">
            <div className="db-logo-inner">
              <img src={logoSrc} alt="Likha Organika"/>
            </div>
          </div>
          <div className="db-topbar-center">
            <div className="db-top-eyebrow">Analytics · Exempted Records</div>
            <div className="db-top-title">Sales &amp; Profit Dashboard</div>
          </div>
          <div className="db-topbar-right">
            <div className="db-live-dot"/>
            <div className="db-badge">2022 – 2025 · {rowCount.toLocaleString()} records</div>
          </div>
        </div>

        <div className="db-body">

          {/* FILTER */}
          <div className="filter-bar">
            <span className="filter-label">Branch</span>
            {["All", ...branches.map(b => b.name)].map(b => (
              <button key={b} className={`fbtn ${activeBtnClass(b)}`} onClick={() => setBranch(b)}>
                {b !== "All" && (
                  <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:PALETTE[b], marginRight:6, verticalAlign:"middle" }}/>
                )}
                {b}
              </button>
            ))}
          </div>

          {/* 6 KPI CARDS */}
          <div className="kpi-row">
            {kpis.map((k, i) => (
              <div className="kpi-card" key={i} style={{ animationDelay:`${i * 0.06}s` }}>
                <div className="kpi-icon-row">
                  <div className="kpi-icon" style={{ background:k.iconBg }}>{k.icon}</div>
                  <div className="kpi-label">{k.label}</div>
                </div>
                <div className="kpi-value">{k.value}</div>
                <div className="kpi-sub">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* TOP CHART ROW */}
          <div className="chart-row-top">

           {/* ① Sales vs Target */}
              <div className="card" style={{ animationDelay:"0s" }}>
                <div className="card-header">
                  <span className="card-title">Sales vs Target per Month</span>
                  <div className="legend-row">
                    <span className="legend-item"><span className="legend-dot" style={{ background:"#6366f1" }}/>Sales</span>
                    <span className="legend-item"><span className="legend-dot" style={{ background:"#10b981" }}/>Target</span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={monthly} margin={{ top:4, right:4, left:-14, bottom:0 }} barCategoryGap="25%" barGap={3}>
                    <XAxis dataKey="m" tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,.03)" }} />

                    <Bar dataKey="target" name="Target" fill="#10b981" radius={[3,3,0,0]} opacity={0.5} maxBarSize={14} />
                    <Bar dataKey="sales"  name="Sales"  fill="#6366f1" radius={[3,3,0,0]} maxBarSize={14} />

                  </BarChart>
                </ResponsiveContainer>
              </div>
            {/* ② Customer Count */}
            <div className="card" style={{ animationDelay:".06s" }}>
              <div className="card-header">
                <span className="card-title">Customer Count by Month</span>
                <div className="legend-row">
                  <span className="legend-item"><span className="legend-dot" style={{ background:"#f59e0b", borderRadius:"50%" }}/>Customers</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={monthly} margin={{ top:4, right:8, left:-14, bottom:0 }}>
                  <XAxis dataKey="m" tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke:"rgba(245,158,11,.2)", strokeWidth:1 }} />
                  <Line type="monotone" dataKey="customers" name="Customers" stroke="#f59e0b" strokeWidth={2.5} dot={{ r:3, fill:"#f59e0b", strokeWidth:0 }} activeDot={{ r:5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

 {/* ③ Cost & Expenses — stacked layout so both are always visible */}
<div className="card" style={{ animationDelay:".12s" }}>
  <div className="card-header">
    <span className="card-title">Cost &amp; Expenses</span>
    <div className="legend-row">
      <span className="legend-item"><span className="legend-dot" style={{ background:"#6366f1" }}/>Cost</span>
      <span className="legend-item"><span className="legend-dot" style={{ background:"#10b981" }}/>Expenses</span>
    </div>
  </div>

  <ResponsiveContainer width="100%" height={200}>
    <BarChart
      data={monthly}
      margin={{ top:4, right:4, left:-14, bottom:0 }}
      barCategoryGap="25%"
      barGap={3}
    >
      {/* Horizontal grid lines */}
      <CartesianGrid horizontal={true} vertical={false} stroke="#334155" strokeDasharray="3 3" />

      <XAxis 
        dataKey="m" 
        tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }} 
        axisLine={false} 
        tickLine={false} 
      />
      <YAxis 
        tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }} 
        axisLine={false} 
        tickLine={false} 
        tickFormatter={v => `${(v/1000).toFixed(0)}K`} 
      />

      <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,.03)" }} />

      <Bar dataKey="cost"     name="Cost"     fill="#6366f1" radius={[3,3,0,0]} maxBarSize={14} />
      <Bar dataKey="expenses" name="Expenses" fill="#10b981" radius={[3,3,0,0]} maxBarSize={14} opacity={0.85} />

    </BarChart>
  </ResponsiveContainer>
</div>
          </div>

          {/* BOTTOM CHART ROW */}
          <div className="chart-row-bottom">

            {/* ④ Customer Satisfaction */}
            <div className="card" style={{ animationDelay:".18s" }}>
              <div className="card-header">
                <span className="card-title">Customer Satisfaction Score</span>
                <span style={{ fontSize:11, color:"#64748b", fontFamily:"'DM Mono',monospace" }}>out of 10</span>
              </div>
              {satisfaction.map(s => (
                <div className="sat-row" key={s.cat}>
                  <span className="sat-name">{s.cat}</span>
                  <div className="sat-track">
                    <div className="sat-fill" style={{ width:`${(s.score/10)*100}%` }}/>
                  </div>
                  <span className="sat-val">{s.score.toFixed(1)}</span>
                </div>
              ))}
            </div>

          {/* ⑤ Profit vs Sales by Branch — grouped horizontal bar chart */}
<div className="card" style={{ animationDelay:".24s" }}>
  <div className="card-header">
    <span className="card-title">Profit vs Sales by Branch</span>
    <div className="legend-row">
      <span className="legend-item"><span className="legend-dot" style={{ background:"#6366f1" }}/>Sales</span>
      <span className="legend-item"><span className="legend-dot" style={{ background:"#10b981" }}/>Profit</span>
    </div>
  </div>

  {/* Responsive container restored */}
  <ResponsiveContainer width="100%" height={200}>
    <BarChart
      data={branchBarData}
      layout="vertical"
      margin={{ top:0, right:8, left:0, bottom:0 }}
      barCategoryGap="20%"
      barGap={4}
    >
      {/* Vertical grid lines */}
      <CartesianGrid vertical={true} horizontal={false} stroke="#334155" strokeDasharray="3 3" />

      <XAxis
        type="number"
        tick={{ fill:"#64748b", fontSize:10, fontFamily:"'DM Mono'" }}
        axisLine={false}
        tickLine={false}
        tickFormatter={v => `${(v/1_000_000).toFixed(1)}M`}
      />

      <YAxis
        type="category"
        dataKey="name"
        tick={{ fill:"#f1f5f9", fontSize:12, fontFamily:"'DM Sans'", fontWeight:600 }}
        axisLine={false}
        tickLine={false}
        width={80}
      />

      <Tooltip content={<CustomTooltip />} cursor={{ fill:"rgba(255,255,255,.03)" }} />

      {/* Sales */}
      <Bar dataKey="Sales" fill="#6366f1" radius={[0,4,4,0]} maxBarSize={13} />

      {/* Profit */}
      <Bar dataKey="Profit" fill="#10b981" radius={[0,4,4,0]} maxBarSize={13} opacity={0.85} />

    </BarChart>
  </ResponsiveContainer>

  <div className="stat-strip">
    <div className="stat-item">
      <div className="stat-v">{fmt(active ? active.profit : totals.profit)}</div>
      <div className="stat-l">Total Profit</div>
    </div>
    <div className="stat-item">
      <div className="stat-v">{activeMargin}%</div>
      <div className="stat-l">Avg Margin</div>
    </div>
    <div className="stat-item">
      <div className="stat-v">{Math.max(...margins).toFixed(1)}%</div>
      <div className="stat-l">Best Branch</div>
    </div>
  </div>
</div>
           {/* ⑥ Branch at a Glance — all text white */}
<div className="card" style={{ animationDelay:".3s" }}>
  <div className="card-header">
    <span className="card-title">Branch at a Glance</span>
    <span style={{ fontSize:11, color:"#64748b", fontFamily:"'DM Mono',monospace" }}>click to filter</span>
  </div>

  <div className="glance-grid">
    {branches.map(b => (
      <div
        key={b.name}
        className="glance-card"
        onClick={() => setBranch(b.name)}
        style={{
          background: branch === b.name ? "#0f1e35" : "#0f172a",
          border: `1px solid ${branch === b.name ? PALETTE[b.name]+"FF" : "#1a2640"}`,
          borderLeft: `3px solid ${branch === b.name ? PALETTE[b.name]+"FF" : PALETTE[b.name]+"88"}`,
          color: "#fff"
        }}
      >
        <div className="glance-name">{b.name}</div>
        <div className="glance-val">{fmt(b.sales)}</div>
        <div className="glance-row">
          <span className="glance-lbl">Score</span>
          <span className="glance-num">{b.score.toFixed(2)}</span>
        </div>
        <div className="glance-row">
          <span className="glance-lbl">Margin</span>
          <span className="glance-num">{b.margin}%</span>
        </div>
        <div className="glance-row">
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
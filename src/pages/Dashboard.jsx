import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import * as XLSX from "xlsx";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

import excelFile from "../assets/exempted latest.xlsm?url";

const PALETTE = {
  Bulacan: "#6366f1",
  Manila: "#10b981",
  Pampanga: "#f59e0b",
  Pangasinan: "#f43f5e",
};

const MONTH_ORDER = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT  = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const fmt  = (v) => v >= 1000000 ? `₱${(v/1000000).toFixed(2)}M` : v >= 1000 ? `₱${(v/1000).toFixed(1)}K` : `₱${v}`;
const fmtN = (v) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : String(v);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#0d1625", border:"1px solid #1a2640", borderRadius:10, padding:"10px 14px", fontFamily:"'DM Mono',monospace", fontSize:12 }}>
      <div style={{ color:"#475569", marginBottom:6 }}>{label}</div>
      {payload.map((p,i) => (
        <div key={i} style={{ color:p.color, marginBottom:2 }}>
          {p.name}: {typeof p.value === "number" && p.value > 10000 ? fmt(p.value) : p.value?.toLocaleString()}
        </div>
      ))}
    </div>
  );
};

function processSheet(rows) {
  const headers = rows[0];
  const data = rows.slice(1).map(row =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? null]))
  ).filter(r => r["Branch"]);

  const totals = {
    sales:      data.reduce((s,r) => s + (r["Sales"]          || 0), 0),
    profit:     data.reduce((s,r) => s + (r["Profit"]         || 0), 0),
    cost:       data.reduce((s,r) => s + (r["Cost"]           || 0), 0),
    expenses:   data.reduce((s,r) => s + (r["Expenses"]       || 0), 0),
    customers:  data.reduce((s,r) => s + (r["Customer Count"] || 0), 0),
    avgScore:   +(data.reduce((s,r) => s + (r["Score"] || 0), 0) / data.length).toFixed(2),
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
    score:   +( b.scoreSum / b.count).toFixed(2),
    margin:  +((b.profit   / b.sales) * 100).toFixed(1),
    hitRate: +((b.sales    / b.target)* 100).toFixed(1),
  }));

  const byMonth = {};
  data.forEach(r => {
    const m = r["Month"];
    if (!byMonth[m]) byMonth[m] = { month:m, sales:0, profit:0, customers:0 };
    byMonth[m].sales     += r["Sales"]          || 0;
    byMonth[m].profit    += r["Profit"]         || 0;
    byMonth[m].customers += r["Customer Count"] || 0;
  });
  const monthly = MONTH_ORDER.map((m, i) => ({
    m: MONTH_SHORT[i],
    sales:     byMonth[m]?.sales     || 0,
    profit:    byMonth[m]?.profit    || 0,
    customers: byMonth[m]?.customers || 0,
  }));

  const bySat = {};
  data.forEach(r => {
    const c = r["Customer Satisfaction"];
    if (!c) return;
    if (!bySat[c]) bySat[c] = { cat:c, scoreSum:0, customers:0, count:0 };
    bySat[c].scoreSum  += r["Score"]          || 0;
    bySat[c].customers += r["Customer Count"] || 0;
    bySat[c].count     += 1;
  });
  const satisfaction = Object.values(bySat).map(s => ({
    cat:       s.cat,
    score:     +(s.scoreSum / s.count).toFixed(2),
    customers: s.customers,
  })).sort((a,b) => b.score - a.score);

  const byYear = {};
  data.forEach(r => {
    const raw = r["Date"];
    if (!raw) return;
    let year;
    if (typeof raw === "number") {
      year = new Date(Math.round((raw - 25569) * 86400 * 1000)).getFullYear();
    } else {
      const parts = String(raw).split("/");
      year = parts.length === 3 ? parseInt(parts[2]) : parseInt(String(raw).slice(0,4));
    }
    if (!byYear[year]) byYear[year] = { year: String(year), sales:0, profit:0 };
    byYear[year].sales  += r["Sales"]  || 0;
    byYear[year].profit += r["Profit"] || 0;
  });
  const yearly = Object.values(byYear).sort((a,b) => a.year - b.year);

  return { totals, branches, monthly, satisfaction, yearly, rowCount: data.length };
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{background:#080c14;}
.db{min-height:100vh;background:#080c14;font-family:'DM Sans',sans-serif;color:#e2e8f0;padding:28px 32px;}
.db-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:24px;}
.eyebrow{font-size:11px;font-weight:500;letter-spacing:.14em;text-transform:uppercase;color:#475569;font-family:'DM Mono',monospace;margin-bottom:4px;}
.db-title{font-size:22px;font-weight:600;color:#f1f5f9;letter-spacing:-.02em;}
.db-badge{font-size:11px;padding:5px 12px;border-radius:99px;background:#0d1625;border:1px solid #1a2640;color:#475569;font-family:'DM Mono',monospace;}
.filter-row{display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap;}
.fbtn{font-size:12px;font-weight:500;padding:6px 16px;border-radius:99px;background:#0d1625;border:1px solid #1a2640;color:#64748b;cursor:pointer;transition:.15s;font-family:'DM Sans',sans-serif;}
.fbtn:hover{border-color:#2d3f5c;color:#94a3b8;}
.fbtn.on{background:rgba(99,102,241,.1);border-color:rgba(99,102,241,.4);color:#818cf8;}
.kpi-grid{display:grid;grid-template-columns:repeat(6,1fr);gap:12px;margin-bottom:14px;}
.kpi{background:#0d1625;border:1px solid #1a2640;border-radius:14px;padding:18px 20px;}
.kpi-label{font-size:10px;font-weight:500;text-transform:uppercase;letter-spacing:.1em;color:#334155;margin-bottom:8px;}
.kpi-value{font-size:21px;font-weight:600;font-family:'DM Mono',monospace;letter-spacing:-.03em;color:#f1f5f9;line-height:1;}
.kpi-sub{font-size:11px;color:#475569;margin-top:5px;}
.row2{display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:14px;}
.row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;margin-bottom:14px;}
.row-bottom{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.card{background:#0d1625;border:1px solid #1a2640;border-radius:16px;padding:20px 22px;}
.card-label{font-size:10px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#334155;margin-bottom:16px;}
.divider{height:1px;background:#1a2640;margin:12px 0;}
.br-row{display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid #0f1c2e;}
.br-row:last-child{border-bottom:none;}
.br-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;}
.br-name{font-size:13px;font-weight:500;color:#94a3b8;width:88px;flex-shrink:0;}
.br-track{flex:1;height:5px;background:#1a2640;border-radius:99px;overflow:hidden;}
.br-fill{height:100%;border-radius:99px;}
.br-val{font-size:12px;font-family:'DM Mono',monospace;color:#f1f5f9;width:76px;text-align:right;}
.br-pill{font-size:11px;font-weight:500;padding:3px 8px;border-radius:99px;font-family:'DM Mono',monospace;white-space:nowrap;}
.pill-g{background:rgba(16,185,129,.1);color:#10b981;border:1px solid rgba(16,185,129,.2);}
.pill-a{background:rgba(245,158,11,.1);color:#f59e0b;border:1px solid rgba(245,158,11,.2);}
.sat-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #0f1c2e;}
.sat-row:last-child{border-bottom:none;}
.sat-name{font-size:12px;color:#64748b;width:84px;flex-shrink:0;}
.sat-track{flex:1;height:5px;background:#1a2640;border-radius:99px;overflow:hidden;}
.sat-fill{height:100%;border-radius:99px;background:#6366f1;}
.sat-score{font-size:12px;font-family:'DM Mono',monospace;color:#94a3b8;width:28px;text-align:right;}
.big-num{font-size:34px;font-weight:600;font-family:'DM Mono',monospace;color:#f1f5f9;letter-spacing:-.04em;line-height:1;}
.big-sub{font-size:11px;color:#475569;margin-top:5px;}
.stat-row{display:flex;gap:0;margin-top:16px;}
.stat-item{flex:1;text-align:center;padding:0 8px;}
.stat-item+.stat-item{border-left:1px solid #1a2640;}
.stat-val{font-size:18px;font-weight:600;font-family:'DM Mono',monospace;color:#f1f5f9;letter-spacing:-.03em;}
.stat-lbl{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:#475569;margin-top:3px;}
.status-row{display:flex;align-items:center;gap:7px;margin-top:14px;}
.sdot{width:6px;height:6px;border-radius:50%;background:#10b981;}
.stxt{font-size:11px;color:#475569;font-family:'DM Mono',monospace;}
.loading{display:flex;align-items:center;justify-content:center;min-height:60vh;flex-direction:column;gap:12px;}
.loading-dot{width:8px;height:8px;border-radius:50%;background:#6366f1;animation:pulse 1.2s ease-in-out infinite;}
.loading-dot:nth-child(2){animation-delay:.2s;}
.loading-dot:nth-child(3){animation-delay:.4s;}
@keyframes pulse{0%,100%{opacity:.2;}50%{opacity:1;}}
.loading-dots{display:flex;gap:6px;}
.loading-txt{font-size:12px;color:#475569;font-family:'DM Mono',monospace;}

/* Branch filter — highlight the active branch pill with its own color */
.fbtn.on-bulacan  { background:rgba(99,102,241,.12); border-color:rgba(99,102,241,.45); color:#818cf8; }
.fbtn.on-manila   { background:rgba(16,185,129,.1);  border-color:rgba(16,185,129,.4);  color:#34d399; }
.fbtn.on-pampanga { background:rgba(245,158,11,.1);  border-color:rgba(245,158,11,.4);  color:#fbbf24; }
.fbtn.on-pangasinan{ background:rgba(244,63,94,.1);  border-color:rgba(244,63,94,.4);   color:#fb7185; }
`;

export default function Dashboard() {
  const location = useLocation();

  // If navigated from Home with a branch in state, pre-select it
  const initialBranch = location.state?.branch ?? "All";

  const [data,   setData]   = useState(null);
  const [branch, setBranch] = useState(initialBranch);
  const [error,  setError]  = useState(null);

  useEffect(() => {
    fetch(excelFile)
      .then(r => r.arrayBuffer())
      .then(buf => {
        const wb   = XLSX.read(buf, { type: "array" });
        const ws   = wb.Sheets["Raw Data"];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null });
        setData(processSheet(rows));
      })
      .catch(e => setError(String(e)));
  }, []);

  // If the router state changes (e.g. user clicks another branch card from Home),
  // update the active filter
  useEffect(() => {
    if (location.state?.branch) {
      setBranch(location.state.branch);
    }
  }, [location.state]);

  if (error) return (
    <div className="db">
      <style>{css}</style>
      <div className="loading">
        <div style={{ color:"#f87171", fontFamily:"'DM Mono',monospace", fontSize:13 }}>Failed to load Excel file</div>
        <div style={{ color:"#475569", fontFamily:"'DM Mono',monospace", fontSize:11 }}>{error}</div>
      </div>
    </div>
  );

  if (!data) return (
    <div className="db">
      <style>{css}</style>
      <div className="loading">
        <div className="loading-dots">
          <div className="loading-dot" />
          <div className="loading-dot" />
          <div className="loading-dot" />
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
  const avgMargin  = +(margins.reduce((s,v) => s+v,0) / margins.length).toFixed(1);

  const kpis = [
    { label:"Total Sales",  value: fmt(active ? active.sales    : totals.sales),    sub: active ? `Target ${fmt(active.target)}` : "All branches" },
    { label:"Total Profit", value: fmt(active ? active.profit   : totals.profit),   sub: `Margin ${active ? active.margin : ((totals.profit/totals.sales)*100).toFixed(1)}%` },
    { label:"Total Cost",   value: fmt(active ? active.cost     : totals.cost),     sub: "Operating cost" },
    { label:"Expenses",     value: fmt(active ? active.expenses : totals.expenses), sub: "Total expenses" },
    { label:"Customers",    value: fmtN(active ? active.customers : totals.customers), sub: "Total served" },
    { label:"Avg Score",    value: (active ? active.score : totals.avgScore).toFixed(2), sub: "Out of 10" },
  ];

  // Returns the coloured .on-* class for the active filter button
  const activeBtnClass = (b) => {
    if (branch !== b) return "";
    if (b === "All") return "on";
    return `on on-${b.toLowerCase()}`;
  };

  return (
    <>
      <style>{css}</style>
      <div className="db">

        <div className="db-header">
          <div>
            <div className="eyebrow">Analytics · Exempted Records</div>
            <div className="db-title">Branch Performance Dashboard</div>
          </div>
          <div className="db-badge">2022 – 2025 &nbsp;·&nbsp; {rowCount.toLocaleString()} records</div>
        </div>

        <div className="filter-row">
          {["All", ...branches.map(b => b.name)].map(b => (
            <button
              key={b}
              className={`fbtn ${activeBtnClass(b)}`}
              onClick={() => setBranch(b)}
            >
              {b !== "All" && (
                <span style={{
                  display: "inline-block",
                  width: 7, height: 7,
                  borderRadius: "50%",
                  background: PALETTE[b],
                  marginRight: 6,
                  verticalAlign: "middle",
                }} />
              )}
              {b}
            </button>
          ))}
        </div>

        <div className="kpi-grid">
          {kpis.map((k,i) => (
            <div className="kpi" key={i}>
              <div className="kpi-label">{k.label}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-sub">{k.sub}</div>
            </div>
          ))}
        </div>

        <div className="row2">
          <div className="card">
            <div className="card-label">Monthly Sales & Profit Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthly} margin={{ top:4, right:8, left:-16, bottom:0 }}>
                <XAxis dataKey="m" tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="sales"  name="Sales"  stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-label">Yearly Performance</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={yearly} margin={{ top:4, right:4, left:-16, bottom:0 }}>
                <XAxis dataKey="year" tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales"  name="Sales"  fill="#6366f1" radius={[5,5,0,0]} />
                <Bar dataKey="profit" name="Profit" fill="#10b981" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="row3">
          <div className="card">
            <div className="card-label">Branch Sales vs Target</div>
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
          </div>

          <div className="card">
            <div className="card-label">Customer Satisfaction</div>
            <div className="big-num">{totals.avgScore.toFixed(2)}</div>
            <div className="big-sub">Overall avg score · 1–10 scale</div>
            <div className="divider" />
            {satisfaction.map(s => (
              <div className="sat-row" key={s.cat}>
                <span className="sat-name">{s.cat}</span>
                <div className="sat-track">
                  <div className="sat-fill" style={{ width:`${(s.score/10)*100}%` }} />
                </div>
                <span className="sat-score">{s.score.toFixed(1)}</span>
              </div>
            ))}
            <div className="status-row">
              <div className="sdot" />
              <span className="stxt">Service leads all categories</span>
            </div>
          </div>

          <div className="card">
            <div className="card-label">Branch Profit Margins</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={branches} layout="vertical" margin={{ top:0, right:16, left:4, bottom:0 }}>
                <XAxis type="number" tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} domain={[0,50]} />
                <YAxis type="category" dataKey="name" tick={{ fill:"#64748b", fontSize:11, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} width={72} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="margin" name="Margin %" radius={[0,5,5,0]}>
                  {branches.map(b => <Cell key={b.name} fill={PALETTE[b.name]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="divider" />
            <div className="stat-row">
              <div className="stat-item">
                <div className="stat-val">{Math.max(...margins).toFixed(1)}%</div>
                <div className="stat-lbl">Highest</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{Math.min(...margins).toFixed(1)}%</div>
                <div className="stat-lbl">Lowest</div>
              </div>
              <div className="stat-item">
                <div className="stat-val">{avgMargin}%</div>
                <div className="stat-lbl">Average</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row-bottom">
          <div className="card">
            <div className="card-label">Monthly Customer Volume</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthly} margin={{ top:4, right:4, left:-16, bottom:0 }}>
                <XAxis dataKey="m" tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill:"#475569", fontSize:10, fontFamily:"'DM Mono'" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(1)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="customers" name="Customers" fill="#6366f1" radius={[4,4,0,0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="card-label">Branch at a Glance</div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {branches.map(b => (
                <div
                  key={b.name}
                  onClick={() => setBranch(b.name)}
                  style={{
                    background: branch === b.name ? "#0f1e35" : "#0f172a",
                    border: `1px solid ${branch === b.name ? PALETTE[b.name] + "55" : "#1a2640"}`,
                    borderRadius: 12,
                    padding: "14px 16px",
                    borderLeft: `3px solid ${PALETTE[b.name]}`,
                    cursor: "pointer",
                    transition: ".15s",
                  }}
                >
                  <div style={{ fontSize:12, fontWeight:600, color:"#94a3b8", marginBottom:8 }}>{b.name}</div>
                  <div style={{ fontSize:18, fontWeight:600, fontFamily:"'DM Mono',monospace", color:"#f1f5f9", letterSpacing:"-.03em" }}>{fmt(b.sales)}</div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:8 }}>
                    <span style={{ fontSize:11, color:"#475569" }}>Score</span>
                    <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:PALETTE[b.name] }}>{b.score.toFixed(2)}</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    <span style={{ fontSize:11, color:"#475569" }}>Margin</span>
                    <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"#10b981" }}>{b.margin}%</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
                    <span style={{ fontSize:11, color:"#475569" }}>Customers</span>
                    <span style={{ fontSize:11, fontFamily:"'DM Mono',monospace", color:"#94a3b8" }}>{fmtN(b.customers)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
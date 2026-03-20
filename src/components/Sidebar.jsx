import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const navItems = [
  {
    to: "/",
    label: "Home",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    to: "/about",
    label: "About",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

  .sb-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
  }
  .sb-overlay.visible {
    opacity: 1;
    pointer-events: all;
  }
  .sb-rail {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 220px;
    background: #080c14;
    border-right: 1px solid #1a2640;
    padding: 0;
    z-index: 100;
    display: flex;
    flex-direction: column;
    transform: translateX(-100%);
    transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
    font-family: 'DM Sans', sans-serif;
  }
  .sb-rail.open {
    transform: translateX(0);
  }
  .sb-top {
    padding: 24px 20px 20px;
    border-bottom: 1px solid #1a2640;
  }
  .sb-wordmark {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #475569;
    margin-bottom: 4px;
  }
  .sb-brand {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: #f1f5f9;
  }
  .sb-nav {
    flex: 1;
    padding: 16px 12px;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .sb-section-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #334155;
    padding: 0 8px;
    margin: 8px 0 6px;
  }
  .sb-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border-radius: 10px;
    text-decoration: none;
    color: #64748b;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.15s, color 0.15s;
    position: relative;
  }
  .sb-link:hover {
    background: #0d1625;
    color: #94a3b8;
  }
  .sb-link.active {
    background: #0d1625;
    color: #f1f5f9;
    border: 1px solid #1a2640;
  }
  .sb-link.active::before {
    content: '';
    position: absolute;
    left: 0;
    top: 25%;
    height: 50%;
    width: 3px;
    background: #6366f1;
    border-radius: 0 3px 3px 0;
  }
  .sb-link-icon {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }
  .sb-footer {
    padding: 16px 20px;
    border-top: 1px solid #1a2640;
  }
  .sb-status {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .sb-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10b981;
    flex-shrink: 0;
  }
  .sb-status-text {
    font-size: 11px;
    color: #475569;
    font-family: 'DM Mono', monospace;
  }
  .sb-toggle {
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 200;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: #0d1625;
    border: 1px solid #1a2640;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, left 0.35s cubic-bezier(0.16,1,0.3,1);
  }
  .sb-toggle:hover {
    background: #1a2640;
    border-color: #2d3f5c;
  }
  .sb-toggle.shifted {
    left: 232px;
  }
`;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const location = useLocation();

  return (
    <>
      <style>{css}</style>

      <div
        className={`sb-overlay ${open ? "visible" : ""}`}
        onClick={() => setOpen(false)}
      />

      <div className={`sb-toggle ${open ? "shifted" : ""}`} onClick={() => setOpen(!open)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round">
          {open ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </div>

      <div className={`sb-rail ${open ? "open" : ""}`}>
        <div className="sb-top">
          <div className="sb-wordmark">Workspace</div>
          <div className="sb-brand">Analytics</div>
        </div>

        <nav className="sb-nav">
          <div className="sb-section-label">Navigation</div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`sb-link ${location.pathname === item.to ? "active" : ""}`}
            >
              <span className="sb-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sb-footer">
          <div className="sb-status">
            <div className="sb-status-dot" />
            <span className="sb-status-text">All systems normal</span>
          </div>
        </div>
      </div>
    </>
  );
}
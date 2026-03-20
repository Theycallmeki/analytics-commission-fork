import logoSrc from "../assets/business logo.jpeg";

export default function About() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

    /* ── Logo pop-in animation ── */
    @keyframes logoPop {
      0%   { opacity: 0; transform: scale(0.6) rotate(-6deg); }
      60%  { opacity: 1; transform: scale(1.08) rotate(1.5deg); }
      80%  { transform: scale(0.97) rotate(-0.5deg); }
      100% { opacity: 1; transform: scale(1) rotate(0deg); }
    }
    @keyframes logoGlow {
      0%, 100% { box-shadow: 0 0 24px rgba(99,102,241,.25), 0 0 0px rgba(99,102,241,0); }
      50%       { box-shadow: 0 0 48px rgba(99,102,241,.45), 0 0 80px rgba(99,102,241,.12); }
    }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }

    .ab-root {
      min-height: 100vh;
      background: #080c14;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      padding: 60px 40px;
    }
    .ab-inner {
      max-width: 680px;
      margin: 0 auto;
      width: 100%;
    }

    /* eyebrow */
    .ab-eyebrow {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 48px;
      font-family: 'DM Mono', monospace;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: fadeUp .5s ease both;
    }
    .ab-eyebrow::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #1a2640;
    }

    /* logo block */
    .ab-logo-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 44px;
      animation: fadeUp .55s ease .08s both;
    }
    .ab-logo-ring {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      padding: 4px;
      background: linear-gradient(135deg, #6366f1 0%, #1a2640 50%, #6366f1 100%);
      animation: logoPop .7s cubic-bezier(.34,1.56,.64,1) .15s both,
                 logoGlow 3.5s ease-in-out 1s infinite;
    }
    .ab-logo-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      border: 3px solid #080c14;
      background: #0d1625;
    }
    .ab-logo-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .ab-logo-name {
      margin-top: 20px;
      font-size: 28px;
      font-weight: 600;
      letter-spacing: -0.03em;
      background: linear-gradient(90deg, #f1f5f9 0%, #818cf8 40%, #f1f5f9 60%, #818cf8 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear 1s infinite;
    }
    .ab-logo-sub {
      margin-top: 6px;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #475569;
      font-family: 'DM Mono', monospace;
    }
    .ab-logo-pills {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .ab-pill {
      font-size: 10px;
      font-weight: 500;
      padding: 4px 12px;
      border-radius: 99px;
      background: rgba(99,102,241,.1);
      border: 1px solid rgba(99,102,241,.25);
      color: #818cf8;
      font-family: 'DM Mono', monospace;
      letter-spacing: .06em;
    }

    /* divider */
    .ab-divider {
      height: 1px;
      background: #1a2640;
      margin: 36px 0;
      animation: fadeUp .5s ease .3s both;
    }

    /* origin story */
    .ab-section {
      animation: fadeUp .5s ease .35s both;
    }
    .ab-section-label {
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .14em;
      text-transform: uppercase;
      color: #334155;
      font-family: 'DM Mono', monospace;
      margin-bottom: 14px;
    }
    .ab-body {
      font-size: 15px;
      color: #64748b;
      line-height: 1.85;
      font-weight: 400;
    }
    .ab-body p + p {
      margin-top: 16px;
    }
    .ab-body strong {
      color: #94a3b8;
      font-weight: 500;
    }

    /* what we make card */
    .ab-product-card {
      margin-top: 28px;
      background: #0d1625;
      border: 1px solid #1a2640;
      border-left: 3px solid #6366f1;
      border-radius: 14px;
      padding: 20px 22px;
      animation: fadeUp .5s ease .45s both;
    }
    .ab-product-title {
      font-size: 13px;
      font-weight: 600;
      color: #f1f5f9;
      margin-bottom: 8px;
      letter-spacing: -.01em;
    }
    .ab-product-desc {
      font-size: 13px;
      color: #475569;
      line-height: 1.7;
    }
    .ab-product-desc strong {
      color: #64748b;
      font-weight: 500;
    }
    .ab-product-tags {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .ab-tag {
      font-size: 10px;
      font-weight: 500;
      padding: 3px 10px;
      border-radius: 99px;
      font-family: 'DM Mono', monospace;
      letter-spacing: .06em;
    }
    .ab-tag-green  { background: rgba(16,185,129,.1);  color: #10b981; border: 1px solid rgba(16,185,129,.2); }
    .ab-tag-indigo { background: rgba(99,102,241,.1);  color: #818cf8; border: 1px solid rgba(99,102,241,.2); }
    .ab-tag-amber  { background: rgba(245,158,11,.1);  color: #f59e0b; border: 1px solid rgba(245,158,11,.2); }

    /* footer row */
    .ab-footer {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation: fadeUp .5s ease .55s both;
    }
    .ab-status {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ab-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      animation: logoPop .5s ease 1.2s both;
    }
    .ab-status-text {
      font-size: 12px;
      color: #475569;
      font-family: 'DM Mono', monospace;
    }
    .ab-badge {
      font-size: 11px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 99px;
      background: #0d1625;
      border: 1px solid #1a2640;
      color: #475569;
      font-family: 'DM Mono', monospace;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div className="ab-root">
        <div className="ab-inner">

          <div className="ab-eyebrow">About the Brand</div>

          {/* LOGO BLOCK */}
          <div className="ab-logo-wrap">
            <div className="ab-logo-ring">
              <div className="ab-logo-inner">
                <img src={logoSrc} alt="Likha Organika Logo" />
              </div>
            </div>
            <div className="ab-logo-name">Likha Organika</div>
            <div className="ab-logo-sub">Est. 2025 · Philippines</div>
            <div className="ab-logo-pills">
              <span className="ab-pill">Natural</span>
              <span className="ab-pill">Organic</span>
              <span className="ab-pill">Gentle</span>
            </div>
          </div>

          <div className="ab-divider" />

          {/* ORIGIN STORY */}
          <div className="ab-section">
            <div className="ab-section-label">Our Story</div>
            <div className="ab-body">
              <p>
                The idea of Likha Organika started from a{" "}
                <strong>personal need for gentler, more natural skincare</strong>.
                We noticed that many commercial soaps caused dryness and irritation,
                especially for sensitive skin. Wanting a safer and more natural
                alternative, we began experimenting with simple ingredients and
                traditional soap-making methods.
              </p>
              <p>
                What started as a small passion project at home eventually grew into
                a business built on the belief that{" "}
                <strong>
                  skincare should be effective, honest, and kind to both the skin
                  and the environment
                </strong>
                .
              </p>
            </div>
          </div>

          {/* PRODUCT CARD */}
          <div className="ab-product-card">
            <div className="ab-product-title">Handmade Natural Soaps</div>
            <div className="ab-product-desc">
              Small-batch soaps made using{" "}
              <strong>natural oils, plant extracts, and essential oils</strong>.
              Gentle on the skin, free from harsh chemicals, and carefully crafted
              to moisturize, cleanse, and nourish naturally. Each bar is made by
              hand — making it eco-friendly, skin-safe, and ideal for people who
              prefer simple, natural skincare.
            </div>
            <div className="ab-product-tags">
              <span className="ab-tag ab-tag-green">Eco-Friendly</span>
              <span className="ab-tag ab-tag-green">Skin-Safe</span>
              <span className="ab-tag ab-tag-indigo">Small-Batch</span>
              <span className="ab-tag ab-tag-indigo">Handmade</span>
              <span className="ab-tag ab-tag-amber">Honey</span>
              <span className="ab-tag ab-tag-amber">Oatmeal</span>
              <span className="ab-tag ab-tag-amber">Tea Tree</span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="ab-footer">
            <div className="ab-status">
              <div className="ab-dot" />
              <span className="ab-status-text">Handcrafted with care</span>
            </div>
            <div className="ab-badge">Philippines 🇵🇭</div>
          </div>

        </div>
      </div>
    </>
  );
}
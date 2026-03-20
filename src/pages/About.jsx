export default function About() {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

    .ab-root {
      min-height: 100vh;
      background: #080c14;
      font-family: 'DM Sans', sans-serif;
      color: #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 60px 40px;
    }
    .ab-inner {
      max-width: 640px;
      width: 100%;
    }
    .ab-eyebrow {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #475569;
      margin-bottom: 32px;
      font-family: 'DM Mono', monospace;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .ab-eyebrow::after {
      content: '';
      flex: 1;
      height: 1px;
      background: #1a2640;
    }
    .ab-hero {
      display: flex;
      align-items: center;
      gap: 32px;
      margin-bottom: 32px;
    }
    .ab-photo-wrap {
      flex-shrink: 0;
      width: 110px;
      height: 110px;
      border-radius: 50%;
      padding: 3px;
      background: linear-gradient(135deg, #6366f1, #1a2640);
    }
    .ab-photo-inner {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
      background: #0d1625;
      border: 2px solid #080c14;
    }
    .ab-photo-inner img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .ab-photo-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 30px;
      font-weight: 600;
      color: #6366f1;
      font-family: 'DM Mono', monospace;
      letter-spacing: -0.04em;
    }
    .ab-hero-text {}
    .ab-greeting {
      font-size: 14px;
      color: #475569;
      margin-bottom: 6px;
      font-weight: 400;
    }
    .ab-name {
      font-size: 38px;
      font-weight: 600;
      letter-spacing: -0.04em;
      color: #f1f5f9;
      line-height: 1.05;
      margin-bottom: 10px;
    }
    .ab-name span {
      color: #6366f1;
    }
    .ab-tagline {
      font-size: 14px;
      color: #64748b;
      font-weight: 400;
      line-height: 1.6;
      letter-spacing: -0.01em;
    }
    .ab-tagline strong {
      color: #94a3b8;
      font-weight: 500;
    }
    .ab-divider {
      height: 1px;
      background: #1a2640;
      margin: 28px 0;
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
    .ab-footer {
      margin-top: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
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

  const photoSrc = null;

  return (
    <>
      <style>{css}</style>
      <div className="ab-root">
        <div className="ab-inner">
          <div className="ab-eyebrow">Introduction</div>

          <div className="ab-hero">
            <div className="ab-photo-wrap">
              <div className="ab-photo-inner">
                {photoSrc ? (
                  <img src={photoSrc} alt="Jaemark Dayrit" />
                ) : (
                  <div className="ab-photo-placeholder">JD</div>
                )}
              </div>
            </div>

            <div className="ab-hero-text">
              <div className="ab-greeting">Hi, I'm</div>
              <div className="ab-name">
                Jaemark <span>Dayrit.</span>
              </div>
              <div className="ab-tagline">
                A <strong>developer, builder, and data enthusiast</strong> passionate
                about turning complex problems into clean, purposeful experiences.
              </div>
            </div>
          </div>

          <div className="ab-divider" />

          <div className="ab-body">
            <p>
              I'm Jaemark Dayrit — someone who finds meaning in the details.
              Whether it's crafting a seamless interface or making sense of raw data,
              I believe that <strong>good work speaks through clarity and intention</strong>.
            </p>
            <p>
              This platform is a reflection of how I approach everything I build —
              thoughtful, precise, and designed with purpose. I'm driven by curiosity
              and a desire to create things that <strong>actually matter to the people
              using them</strong>.
            </p>
            <p>
              When I'm not building, I'm exploring ideas at the edge of technology
              and design — always asking how things can be made better, simpler, and
              more human.
            </p>
          </div>

          <div className="ab-footer">
            <div className="ab-status">
              <div className="ab-dot" />
              <span className="ab-status-text">Open to opportunities</span>
            </div>
            <div className="ab-badge">Philippines 🇵🇭</div>
          </div>
        </div>
      </div>
    </>
  );
}
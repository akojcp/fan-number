import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ARTISTS = [
  {
    id: "a1", name: "Mara Voss", genre: "Indie Folk", city: "Nashville, TN",
    bio: "Storyteller. Guitar-slinger. Coffee addict. Writing songs about the spaces between things.",
    price: 5, fanCount: 312, image: "https://i.pravatar.cc/300?img=47",
    coverColor: "#1a1a2e", accentColor: "#7B2FFF", spotifyUrl: "#",
    posts: [
      { id: "p1", content: "Just finished tracking vocals for the new EP. It's raw and it's real. Can't wait for you all to hear it.", fanOnly: false, date: "Feb 14" },
      { id: "p2", content: "🔒 Behind-the-scenes: The story behind 'Hollow Road' — why I almost scrapped it and what made me keep going.", fanOnly: true, date: "Feb 10" },
      { id: "p3", content: "🔒 Unreleased demo: 'Glass Season' — first listen for fans only.", fanOnly: true, date: "Feb 5" },
    ]
  },
  {
    id: "a2", name: "Circuit Bloom", genre: "Electronic / Ambient", city: "Los Angeles, CA",
    bio: "Producer. Sound designer. Finding beauty in digital noise and analog warmth.",
    price: 8, fanCount: 87, image: "https://i.pravatar.cc/300?img=12",
    coverColor: "#0d0d0d", accentColor: "#00f5d4", spotifyUrl: "#",
    posts: [
      { id: "p4", content: "New single dropping Friday. 4 years in the making. No more hints.", fanOnly: false, date: "Feb 15" },
      { id: "p5", content: "🔒 Full album stems pack — remix anything you want. Fans only.", fanOnly: true, date: "Feb 8" },
    ]
  },
  {
    id: "a3", name: "The Olvera Duo", genre: "Latin Jazz", city: "Miami, FL",
    bio: "Two brothers, two guitars, one sound. Playing the music our grandfather taught us.",
    price: 4, fanCount: 1204, image: "https://i.pravatar.cc/300?img=65",
    coverColor: "#1b1b1b", accentColor: "#f4a261", spotifyUrl: "#",
    posts: [
      { id: "p6", content: "Tour announcement coming Monday. You already know where we're going 🌴", fanOnly: false, date: "Feb 13" },
      { id: "p7", content: "🔒 Live set from Havana — full 90 minute recording. Fans only, forever.", fanOnly: true, date: "Feb 1" },
    ]
  },
  {
    id: "a4", name: "Yuki Tanaka", genre: "Neo-Soul / R&B", city: "New York, NY",
    bio: "Vocalist. Producer. Writing love songs for people who don't believe in love anymore.",
    price: 6, fanCount: 43, image: "https://i.pravatar.cc/300?img=29",
    coverColor: "#12001f", accentColor: "#c77dff", spotifyUrl: "#",
    posts: [
      { id: "p8", content: "First show in 2 years is booked. Small venue. Intimate. The way it should be.", fanOnly: false, date: "Feb 16" },
      { id: "p9", content: "🔒 Handwritten lyrics to 'Softer Now' — with all the crossed-out parts.", fanOnly: true, date: "Feb 12" },
    ]
  },
];

const INITIAL_USER_FANS = [{ artistId: "a3", fanNumber: 847, date: "Jan 2025" }];
const GENRES = ["Indie Folk","Electronic","Hip-Hop","R&B / Soul","Jazz","Pop","Rock","Classical","Country","Latin","Ambient","Metal","Punk","Alternative","Other"];
const STEP_LABELS = ["Basic Info","Genre & City","Set Price","Your Look","Connect Stripe","Preview"];

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0a; --surface: #111111; --surface2: #1a1a1a; --border: #2a2a2a;
    --text: #f0f0f0; --muted: #777; --accent: #7B2FFF; --accent2: #ffcc00; --green: #4ade80;
    --font-display: 'Bebas Neue', cursive; --font-body: 'DM Sans', sans-serif; --font-mono: 'DM Mono', monospace;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  .nav { background: rgba(10,10,10,0.95); border-bottom: 1px solid var(--border); padding: 0 24px; height: 56px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(12px); }
  .nav-logo { font-family: var(--font-display); font-size: 28px; letter-spacing: 2px; color: var(--text); cursor: pointer; }
  .nav-logo span { color: var(--accent); }
  .nav-links { display: flex; gap: 8px; align-items: center; }
  .nav-btn { background: none; border: none; color: var(--muted); font-family: var(--font-body); font-size: 14px; font-weight: 500; padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all 0.15s; }
  .nav-btn:hover { color: var(--text); background: var(--surface2); }
  .nav-btn.active { color: var(--text); background: var(--surface2); }
  .nav-btn.primary { background: var(--accent); color: white; font-weight: 600; }
  .nav-btn.primary:hover { background: #9B5FFF; }
  .nav-divider { width: 1px; height: 20px; background: var(--border); margin: 0 6px; }
  .mode-switcher { display: flex; align-items: center; gap: 6px; background: var(--surface2); border-radius: 8px; padding: 4px; }
  .mode-btn { padding: 5px 12px; border-radius: 6px; border: none; font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--font-body); color: var(--muted); background: none; transition: all 0.15s; }
  .mode-btn.active { background: var(--surface); color: var(--text); }
  .mode-label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); margin-right: 4px; }

  .page { flex: 1; padding: 32px 24px; max-width: 1100px; margin: 0 auto; width: 100%; }
  .btn { border: none; padding: 14px 28px; border-radius: 8px; font-family: var(--font-body); font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #9B5FFF; transform: translateY(-1px); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
  .btn-secondary:hover { border-color: #555; transform: translateY(-1px); }
  .btn-sm { padding: 8px 18px; font-size: 13px; border-radius: 6px; }

  .hero { text-align: center; padding: 80px 24px 60px; position: relative; overflow: hidden; }
  .hero::before { content: ''; position: absolute; top: -100px; left: 50%; transform: translateX(-50%); width: 600px; height: 400px; background: radial-gradient(ellipse, rgba(123,47,255,0.15) 0%, transparent 70%); pointer-events: none; }
  .hero-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; }
  .hero-title { font-family: var(--font-display); font-size: clamp(64px, 10vw, 120px); line-height: 0.9; letter-spacing: 4px; margin-bottom: 24px; }
  .hero-title span { color: var(--accent); }
  .hero-sub { font-size: 18px; color: var(--muted); max-width: 480px; margin: 0 auto 40px; line-height: 1.6; font-weight: 300; }
  .hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  .section-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 24px; }
  .section-title { font-family: var(--font-display); font-size: 36px; letter-spacing: 2px; }
  .section-link { font-size: 13px; color: var(--accent); cursor: pointer; font-weight: 500; }
  .section-link:hover { text-decoration: underline; }

  .artist-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
  .artist-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.2s; position: relative; }
  .artist-card:hover { border-color: #444; transform: translateY(-2px); }
  .artist-card-cover { height: 120px; position: relative; overflow: hidden; }
  .artist-card-avatar { width: 64px; height: 64px; border-radius: 50%; border: 3px solid var(--bg); position: absolute; bottom: -20px; left: 16px; object-fit: cover; }
  .artist-card-body { padding: 28px 16px 16px; }
  .artist-card-name { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; margin-bottom: 2px; }
  .artist-card-genre { font-size: 12px; color: var(--muted); margin-bottom: 12px; font-family: var(--font-mono); }
  .artist-card-footer { display: flex; align-items: center; justify-content: space-between; }
  .fan-badge { font-family: var(--font-mono); font-size: 11px; color: var(--muted); }
  .fan-badge strong { color: var(--text); font-size: 15px; }
  .price-tag { font-family: var(--font-mono); font-size: 13px; font-weight: 500; }
  .subscribed-ribbon { position: absolute; top: 10px; right: 10px; background: var(--accent); color: white; font-size: 10px; font-family: var(--font-mono); font-weight: 500; padding: 3px 8px; border-radius: 20px; letter-spacing: 1px; }

  .profile-wrap { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; margin-bottom: 32px; }
  .artist-profile-hero { height: 200px; position: relative; overflow: hidden; }
  .artist-profile-hero::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 60%; background: linear-gradient(to bottom, transparent, rgba(17,17,17,0.9)); }
  .profile-info-row { padding: 0 24px 24px; display: flex; align-items: flex-end; gap: 16px; margin-top: -40px; position: relative; z-index: 2; flex-wrap: wrap; }
  .profile-avatar { width: 96px; height: 96px; border-radius: 50%; border: 4px solid var(--surface); object-fit: cover; flex-shrink: 0; }
  .profile-meta { flex: 1; }
  .profile-name { font-family: var(--font-display); font-size: 40px; letter-spacing: 2px; line-height: 1; margin-bottom: 4px; }
  .profile-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
  .tag { font-size: 11px; font-family: var(--font-mono); padding: 3px 10px; border-radius: 20px; background: var(--surface2); color: var(--muted); border: 1px solid var(--border); }
  .profile-stats { padding: 16px 24px; border-top: 1px solid var(--border); display: flex; gap: 32px; }
  .stat { text-align: center; }
  .stat-num { font-family: var(--font-display); font-size: 28px; letter-spacing: 1px; }
  .stat-label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 1px; }

  .subscribe-box { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; margin-bottom: 24px; position: relative; overflow: hidden; }
  .subscribe-box h3 { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; margin-bottom: 6px; }
  .subscribe-box p { font-size: 14px; color: var(--muted); margin-bottom: 20px; line-height: 1.5; }
  .next-fan-number { font-family: var(--font-display); font-size: 64px; letter-spacing: 2px; line-height: 1; margin-bottom: 4px; }
  .next-fan-label { font-size: 11px; font-family: var(--font-mono); color: var(--muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; }

  .fan-number-card { border-radius: 12px; padding: 20px; display: flex; align-items: center; gap: 16px; border: 1px solid; }
  .fn-number { font-family: var(--font-display); font-size: 48px; letter-spacing: 2px; line-height: 1; }
  .fn-prefix { font-size: 14px; font-family: var(--font-mono); opacity: 0.6; }
  .fn-artist { font-weight: 600; font-size: 16px; }
  .fn-since { font-size: 12px; opacity: 0.6; font-family: var(--font-mono); margin-top: 2px; }

  .posts-list { display: flex; flex-direction: column; gap: 12px; }
  .post-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 18px; }
  .post-locked { opacity: 0.5; cursor: not-allowed; }
  .post-lock-badge { font-size: 11px; font-family: var(--font-mono); color: var(--accent2); margin-bottom: 8px; }
  .post-date { font-size: 11px; color: var(--muted); font-family: var(--font-mono); float: right; }
  .post-content { font-size: 15px; line-height: 1.6; clear: both; }

  .tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--border); margin-bottom: 24px; }
  .tab { padding: 10px 18px; font-size: 14px; font-weight: 500; color: var(--muted); cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; background: none; border-left: none; border-right: none; border-top: none; font-family: var(--font-body); }
  .tab:hover { color: var(--text); }
  .tab.active { color: var(--text); border-bottom-color: var(--accent); }

  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 640px) { .grid2 { grid-template-columns: 1fr; } }

  .dashboard-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
  .dashboard-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); }
  .dashboard-title { font-family: var(--font-display); font-size: 36px; letter-spacing: 2px; }
  .dashboard-sub { font-size: 14px; color: var(--muted); }
  .metric-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px; margin-bottom: 32px; }
  .metric-card { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; }
  .metric-val { font-family: var(--font-display); font-size: 36px; letter-spacing: 1px; margin-bottom: 2px; }
  .metric-label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); text-transform: uppercase; letter-spacing: 1px; }
  .metric-card.accent { background: var(--accent); border-color: var(--accent); }
  .metric-card.accent .metric-val, .metric-card.accent .metric-label { color: white; }

  .fan-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-bottom: 1px solid var(--border); }
  .fan-row:last-child { border-bottom: none; }
  .fan-row-num { font-family: var(--font-display); font-size: 22px; letter-spacing: 1px; width: 60px; flex-shrink: 0; }
  .fan-row-avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; color: var(--muted); flex-shrink: 0; }
  .fan-row-name { font-weight: 500; font-size: 14px; }
  .fan-row-date { font-size: 11px; color: var(--muted); font-family: var(--font-mono); }

  .toast { position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%) translateY(80px); background: var(--text); color: var(--bg); padding: 14px 24px; border-radius: 10px; font-weight: 600; font-size: 15px; z-index: 999; transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); white-space: nowrap; pointer-events: none; }
  .toast.show { transform: translateX(-50%) translateY(0); }

  .post-form { background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 20px; margin-bottom: 24px; }
  .post-form textarea { width: 100%; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--font-body); font-size: 15px; border-radius: 8px; padding: 12px; resize: vertical; min-height: 80px; outline: none; }
  .post-form textarea:focus { border-color: #555; }
  .post-form-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 10px; }
  .toggle-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); cursor: pointer; }
  .toggle { width: 36px; height: 20px; background: var(--surface2); border-radius: 20px; position: relative; cursor: pointer; transition: background 0.2s; border: 1px solid var(--border); }
  .toggle.on { background: var(--accent); }
  .toggle::after { content: ''; position: absolute; width: 14px; height: 14px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: transform 0.2s; }
  .toggle.on::after { transform: translateX(16px); }

  .empty { text-align: center; padding: 48px; color: var(--muted); }
  .empty h3 { font-family: var(--font-display); font-size: 28px; letter-spacing: 1px; margin-bottom: 8px; color: var(--text); opacity: 0.4; }
  .back-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-family: var(--font-body); font-size: 14px; margin-bottom: 24px; display: flex; align-items: center; gap: 6px; padding: 0; }
  .back-btn:hover { color: var(--text); }

  /* FORM */
  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 8px; font-family: var(--font-mono); letter-spacing: 1px; text-transform: uppercase; }
  .field input, .field textarea, .field select { width: 100%; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--font-body); font-size: 15px; border-radius: 8px; padding: 12px 14px; outline: none; transition: border-color 0.15s; appearance: none; }
  .field input:focus, .field textarea:focus { border-color: #555; }
  .field textarea { resize: vertical; min-height: 100px; }
  .field-hint { font-size: 12px; color: var(--muted); margin-top: 6px; font-family: var(--font-mono); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .field-row { grid-template-columns: 1fr; } }

  /* ONBOARDING */
  .onboarding-wrap { min-height: calc(100vh - 0px); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; background: var(--bg); }
  .onboarding-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 40px; width: 100%; max-width: 560px; }
  .step-indicator { display: flex; align-items: center; gap: 6px; margin-bottom: 32px; }
  .step-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border); transition: all 0.25s; flex-shrink: 0; }
  .step-dot.active { background: var(--accent); width: 24px; border-radius: 4px; }
  .step-dot.done { background: var(--accent); opacity: 0.35; }
  .onboarding-title { font-family: var(--font-display); font-size: 34px; letter-spacing: 2px; margin-bottom: 8px; line-height: 1; }
  .onboarding-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .onboarding-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 28px; padding-top: 20px; border-top: 1px solid var(--border); }

  .price-options { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
  .price-opt { background: var(--surface2); border: 2px solid var(--border); border-radius: 10px; padding: 14px 8px; text-align: center; cursor: pointer; transition: all 0.15s; }
  .price-opt:hover { border-color: #555; }
  .price-opt.selected { border-color: var(--accent); background: rgba(123,47,255,0.08); }
  .price-opt-val { font-family: var(--font-display); font-size: 26px; letter-spacing: 1px; }
  .price-opt-label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); }

  .genre-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .genre-pill { padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); font-size: 13px; cursor: pointer; transition: all 0.15s; background: var(--surface2); color: var(--muted); }
  .genre-pill:hover { border-color: #555; color: var(--text); }
  .genre-pill.selected { border-color: var(--accent); background: rgba(123,47,255,0.1); color: var(--text); }

  .stripe-box { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 28px; text-align: center; }
  .stripe-logo { font-family: var(--font-display); font-size: 28px; letter-spacing: 3px; color: #635bff; margin-bottom: 12px; }
  .stripe-desc { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; }
  .stripe-connected { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; background: rgba(74,222,128,0.08); border: 1px solid rgba(74,222,128,0.25); border-radius: 10px; color: var(--green); font-weight: 600; font-size: 15px; }

  .preview-frame { background: var(--bg); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  .preview-cover { height: 110px; position: relative; }
  .preview-avatar { width: 64px; height: 64px; border-radius: 50%; border: 3px solid var(--bg); position: absolute; bottom: -20px; left: 16px; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-size: 26px; overflow: hidden; }
  .preview-info { padding: 28px 16px 16px; }
  .preview-name { font-family: var(--font-display); font-size: 26px; letter-spacing: 2px; margin-bottom: 4px; }
  .preview-bio { font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 10px; }

  /* ARTIST LANDING */
  .artist-hero { padding: 96px 24px 72px; text-align: center; position: relative; overflow: hidden; }
  .artist-hero::before { content: ''; position: absolute; top: -80px; left: 50%; transform: translateX(-50%); width: 800px; height: 500px; background: radial-gradient(ellipse, rgba(123,47,255,0.12) 0%, transparent 65%); pointer-events: none; }
  .artist-hero-eyebrow { font-family: var(--font-mono); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; }
  .artist-hero-title { font-family: var(--font-display); font-size: clamp(52px, 8vw, 92px); line-height: 0.9; letter-spacing: 3px; margin-bottom: 24px; }
  .artist-hero-title span { color: var(--accent); }
  .artist-hero-sub { font-size: 18px; color: var(--muted); max-width: 520px; margin: 0 auto 44px; line-height: 1.6; font-weight: 300; }

  .hiw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-top: 28px; }
  .hiw-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 28px 24px; }
  .hiw-num { font-family: var(--font-display); font-size: 44px; color: var(--accent); opacity: 0.25; line-height: 1; margin-bottom: 12px; }
  .hiw-title { font-weight: 600; font-size: 15px; margin-bottom: 8px; }
  .hiw-desc { font-size: 14px; color: var(--muted); line-height: 1.6; }

  .earnings-section { padding: 60px 24px; background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .earnings-inner { max-width: 1100px; margin: 0 auto; }
  .earnings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
  @media (max-width: 680px) { .earnings-grid { grid-template-columns: 1fr; } }
  .earnings-title { font-family: var(--font-display); font-size: 38px; letter-spacing: 2px; margin-bottom: 14px; line-height: 1; }
  .earnings-desc { font-size: 15px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
  .earnings-calc { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }
  .calc-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid var(--border); }
  .calc-row:last-child { border-bottom: none; padding-top: 14px; }
  .calc-label { font-size: 14px; color: var(--muted); }
  .calc-val { font-family: var(--font-mono); font-size: 15px; }
  .calc-val.highlight { color: var(--accent); font-size: 24px; font-weight: 600; }

  .quotes-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 32px; text-align: left; }
  .quote-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 24px; }

  /* LIVE CONFIRMATION */
  .live-wrap { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 40px 24px; background: var(--bg); }
  .live-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 48px 40px; max-width: 520px; width: 100%; text-align: center; }
  .live-icon { font-size: 60px; margin-bottom: 20px; display: block; animation: pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
  @keyframes pop { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .live-title { font-family: var(--font-display); font-size: 56px; letter-spacing: 3px; margin-bottom: 12px; line-height: 1; }
  .live-title span { color: var(--accent); }
  .live-sub { font-size: 16px; color: var(--muted); line-height: 1.6; margin-bottom: 28px; }
  .live-profile-preview { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; margin-bottom: 24px; display: flex; align-items: center; gap: 14px; text-align: left; }
  .live-share { background: var(--surface2); border: 1px solid var(--border); border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
  .live-share-url { font-family: var(--font-mono); font-size: 13px; color: var(--muted); }
  .live-share-copy { font-size: 12px; font-family: var(--font-mono); color: var(--accent); cursor: pointer; font-weight: 500; border: none; background: none; }
  .live-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

  .profile-page-header { display: flex; align-items: flex-end; gap: 20px; margin-bottom: 32px; flex-wrap: wrap; }
  .profile-page-avatar { width: 80px; height: 80px; border-radius: 50%; background: var(--surface2); display: flex; align-items: center; justify-content: center; font-family: var(--font-display); font-size: 36px; color: var(--accent); border: 3px solid var(--accent); flex-shrink: 0; }
  .profile-page-name { font-family: var(--font-display); font-size: 40px; letter-spacing: 2px; }
  .profile-page-sub { font-size: 13px; color: var(--muted); font-family: var(--font-mono); }
`;

// ─── Shared ───────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return <div className={`toast ${show ? "show" : ""}`}>{message}</div>;
}

function ArtistCard({ artist, userFans, onClick }) {
  const myFan = userFans.find(f => f.artistId === artist.id);
  return (
    <div className="artist-card" onClick={() => onClick(artist)}>
      {myFan && <div className="claimed-ribbon">FAN #{myFan.fanNumber}</div>}
      <div className="artist-card-cover" style={{ background: artist.coverColor }}>
        <div style={{ position:"absolute",inset:0,opacity:0.3,background:`radial-gradient(circle at 70% 30%, ${artist.accentColor}, transparent 60%)` }} />
        <img src={artist.image} alt={artist.name} className="artist-card-avatar" />
      </div>
      <div className="artist-card-body">
        <div className="artist-card-name">{artist.name}</div>
        <div className="artist-card-genre">{artist.genre} · {artist.city}</div>
        <div className="artist-card-footer">
          <div className="fan-badge"><strong>{artist.fanCount.toLocaleString()}</strong> fans</div>
          <div className="price-tag">${artist.price}/month</div>
        </div>
      </div>
    </div>
  );
}

// ─── Fan Pages ────────────────────────────────────────────────────────────────
function HomePage({ setPage, userFans }) {
  return (
    <div>
      <div className="hero">
        <div className="hero-eyebrow">Invest early. Own your number. Watch it rise.</div>
        <div className="hero-title">FAN<span>#</span></div>
        <div className="hero-sub">Claim your number before anyone else. The earlier you are, the more it means — to you, to the artist, and to everyone who finds them later.</div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => setPage("discover")}>Claim Your Number</button>
          <button className="btn btn-secondary" onClick={() => setPage("artist-landing")}>For Artists →</button>
        </div>
      </div>
      <div className="page" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="section-title">TRENDING NOW</div>
          <span className="section-link" onClick={() => setPage("discover")}>See all →</span>
        </div>
        <div className="artist-grid">
          {ARTISTS.map(a => <ArtistCard key={a.id} artist={a} userFans={userFans} onClick={() => setPage({ type:"artist", id:a.id })} />)}
        </div>
      </div>
    </div>
  );
}

function DiscoverPage({ setPage, userFans }) {
  const [search, setSearch] = useState("");
  const filtered = ARTISTS.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.genre.toLowerCase().includes(search.toLowerCase()) ||
    a.city.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="page">
      <div className="section-header"><div className="section-title">FIND YOUR ARTISTS</div></div>
      <input value={search} onChange={e => setSearch(e.target.value)} placefan="Search artists, genres, cities — claim early, claim low..."
        style={{ width:"100%",background:"var(--surface)",border:"1px solid var(--border)",color:"var(--text)",fontFamily:"var(--font-body)",fontSize:"15px",borderRadius:"8px",padding:"12px 16px",outline:"none",marginBottom:"24px" }} />
      <div className="artist-grid">
        {filtered.map(a => <ArtistCard key={a.id} artist={a} userFans={userFans} onClick={() => setPage({ type:"artist", id:a.id })} />)}
      </div>
    </div>
  );
}

function ArtistProfilePage({ artistId, setPage, userFans, onSubscribe, onUnsubscribe }) {
  const artist = ARTISTS.find(a => a.id === artistId);
  const myFan = userFans.find(f => f.artistId === artistId);
  const isSubscribed = !!myFan;
  const [tab, setTab] = useState("posts");
  if (!artist) return null;
  const mockFans = [
    { num:1, name:"Jordan K.", initial:"J", since:"Dec 2024" },
    { num:2, name:"Sam Rivers", initial:"S", since:"Dec 2024" },
    { num:3, name:"Alex P.", initial:"A", since:"Jan 2025" },
    { num:5, name:"Taylor M.", initial:"T", since:"Feb 2025" },
  ];
  return (
    <div className="page">
      <button className="back-btn" onClick={() => setPage("discover")}>← Back to Discover</button>
      <div className="profile-wrap">
        <div className="artist-profile-hero" style={{ background: artist.coverColor }}>
          <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 30% 50%, ${artist.accentColor}44, transparent 60%)` }} />
        </div>
        <div className="profile-info-row">
          <img src={artist.image} alt={artist.name} className="profile-avatar" />
          <div className="profile-meta">
            <div className="profile-name">{artist.name}</div>
            <div style={{ fontSize:14,color:"var(--muted)",marginTop:4 }}>{artist.bio}</div>
            <div className="profile-tags">
              <span className="tag">{artist.genre}</span>
              <span className="tag">📍 {artist.city}</span>
            </div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat"><div className="stat-num">{artist.fanCount.toLocaleString()}</div><div className="stat-label">Fans</div></div>
          <div className="stat"><div className="stat-num">${artist.price}</div><div className="stat-label">Per Month</div></div>
          <div className="stat"><div className="stat-num">{artist.posts.length}</div><div className="stat-label">Posts</div></div>
        </div>
      </div>
      <div className="grid2">
        <div>
          <div className="subscribe-box">
            <div style={{ position:"absolute",top:-40,right:-40,width:160,height:160,borderRadius:"50%",background:artist.accentColor,opacity:0.1 }} />
            {!isSubscribed ? (
              <>
                <h3>Claim Fan #{artist.fanCount + 1}</h3>
                <p>Once you hold this number, it's yours forever — no matter how big {artist.name} gets. The lower your number, the more it means.</p>
                <div className="next-fan-number" style={{ color: artist.accentColor }}>#{artist.fanCount + 1}</div>
                <div className="next-fan-label">Available right now</div>
                <button className="btn btn-primary" style={{ background:artist.accentColor,width:"100%",fontSize:16 }} onClick={() => onSubscribe(artist)}>
                  Claim for ${artist.price}/month
                </button>
              </>
            ) : (
              <>
                <h3>You hold this number</h3>
                <p>You invested in {artist.name} in {myFan.date}. That number is permanently yours — and it only gets more meaningful as they grow.</p>
                <div className="next-fan-number" style={{ color: artist.accentColor }}>#{myFan.fanNumber}</div>
                <div className="next-fan-label">Your permanent fan number</div>
                <button className="btn btn-secondary" style={{ width:"100%",fontSize:13,marginTop:8 }} onClick={() => onUnsubscribe(artist)}>Release My Number</button>
              </>
            )}
          </div>
          {!isSubscribed && artist.posts.filter(p => p.fanOnly).length > 0 && (
            <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px",fontSize:14,color:"var(--muted)" }}>
              🔒 {artist.posts.filter(p=>p.fanOnly).length} posts for fans only — claim your number to unlock
            </div>
          )}
        </div>
        <div>
          <div className="tabs">
            <button className={`tab ${tab==="posts"?"active":""}`} onClick={() => setTab("posts")}>Posts</button>
            <button className={`tab ${tab==="fans"?"active":""}`} onClick={() => setTab("fans")}>Top Fans</button>
          </div>
          {tab === "posts" && (
            <div className="posts-list">
              {artist.posts.map(post => (
                <div key={post.id} className={`post-card ${post.fanOnly && !isSubscribed ? "post-locked" : ""}`}>
                  {post.fanOnly && <div className="post-lock-badge">🔒 Fans only</div>}
                  <span className="post-date">{post.date}</span>
                  <div className="post-content">{post.content}</div>
                </div>
              ))}
            </div>
          )}
          {tab === "fans" && (
            <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,overflow:"hidden" }}>
              {[...mockFans, ...(isSubscribed ? [{num:myFan.fanNumber,name:"You",initial:"Y",since:myFan.date}] : [])]
                .sort((a,b) => a.num - b.num).slice(0,6).map(fan => (
                <div key={fan.num} className="fan-row" style={fan.name==="You"?{background:"rgba(123,47,255,0.05)"}:{}}>
                  <div className="fan-row-num" style={{ color:fan.name==="You"?"var(--accent)":"var(--text)" }}>#{fan.num}</div>
                  <div className="fan-row-avatar">{fan.initial}</div>
                  <div><div className="fan-row-name">{fan.name==="You"?"You ✦":fan.name}</div><div className="fan-row-date">Since {fan.since}</div></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MyProfilePage({ userFans, setPage }) {
  return (
    <div className="page">
      <div className="profile-page-header">
        <div className="profile-page-avatar">Y</div>
        <div>
          <div className="profile-page-name">YOUR PORTFOLIO</div>
          <div className="profile-page-sub">{userFans.length} artist{userFans.length!==1?"s":""} you've invested in</div>
        </div>
      </div>
      <div className="section-header"><div className="section-title">MY NUMBERS</div></div>
      {userFans.length === 0 ? (
        <div className="empty">
          <h3>No numbers held yet</h3>
          <p style={{ marginTop:8 }}>Find an artist you believe in. Claim low. Watch them grow.</p>
          <button className="btn btn-primary" style={{ marginTop:20 }} onClick={() => setPage("discover")}>Find Artists to Invest In</button>
        </div>
      ) : (
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {userFans.map(fan => {
            const artist = ARTISTS.find(a => a.id === fan.artistId);
            if (!artist) return null;
            return (
              <div key={fan.artistId} className="fan-number-card" style={{ background:artist.coverColor,borderColor:artist.accentColor+"44",cursor:"pointer" }} onClick={() => setPage({ type:"artist",id:artist.id })}>
                <img src={artist.image} alt={artist.name} style={{ width:56,height:56,borderRadius:"50%",objectFit:"cover",border:`2px solid ${artist.accentColor}` }} />
                <div style={{ flex:1 }}>
                  <div className="fn-prefix">FAN</div>
                  <div className="fn-number" style={{ color:artist.accentColor }}>#{fan.fanNumber}</div>
                  <div className="fn-artist">{artist.name}</div>
                  <div className="fn-since">Since {fan.date} · {artist.genre}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11,fontFamily:"var(--font-mono)",color:"rgba(255,255,255,0.4)",marginBottom:4 }}>RANK</div>
                  <div style={{ fontFamily:"var(--font-display)",fontSize:22,color:"rgba(255,255,255,0.7)" }}>#{fan.fanNumber} of {artist.fanCount}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Artist Landing Page ──────────────────────────────────────────────────────
function ArtistLandingPage({ setPage }) {
  const [fans, setFans] = useState(150);
  const monthly = Math.round(fans * 5 * 0.88);
  return (
    <div>
      <div className="artist-hero">
        <div className="artist-hero-eyebrow">For Artists</div>
        <div className="artist-hero-title">Turn fans into<br /><span>investors.</span></div>
        <div className="artist-hero-sub">Your earliest fans are your most valuable. Give them a number that proves it — and watch FOMO do the rest.</div>
        <div className="hero-actions">
          <button className="btn btn-primary" style={{ fontSize:16,padding:"16px 36px" }} onClick={() => setPage("onboarding")}>Get Your Artist Page →</button>
          <button className="btn btn-secondary" onClick={() => setPage("discover")}>See Examples</button>
        </div>
        <div style={{ marginTop:40,display:"flex",gap:40,justifyContent:"center",flexWrap:"wrap" }}>
          {[["Free to start","No upfront cost"],["88% to you","Every month, direct deposit"],["Numbers never reset","Fan #1 is gone forever once claimed"]].map(([t,s]) => (
            <div key={t} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-display)",fontSize:18,letterSpacing:1 }}>{t}</div>
              <div style={{ fontSize:12,color:"var(--muted)",fontFamily:"var(--font-mono)",marginTop:2 }}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding:"60px 24px",maxWidth:1100,margin:"0 auto" }}>
        <div style={{ textAlign:"center",marginBottom:4 }}><div style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:3,color:"var(--accent)",textTransform:"uppercase" }}>How It Works</div></div>
        <div style={{ textAlign:"center",marginBottom:0 }}><div style={{ fontFamily:"var(--font-display)",fontSize:40,letterSpacing:2 }}>SIMPLE BY DESIGN</div></div>
        <div className="hiw-grid">
          {[
            { n:"01", t:"Create your page", d:"Set your price, write your bio, choose your look. Takes 5 minutes." },
            { n:"02", t:"Share your link", d:"Drop it in your bio, at merch tables, in your newsletter. Every share is a chance for someone to claim early." },
            { n:"03", t:"Fans invest in you", d:"Each person who claims a number is putting real money behind your rise. Fan #1 is gone the moment it's claimed — forever." },
            { n:"04", t:"FOMO drives growth", d:"As numbers climb, latecomers see proof of your momentum. Low numbers become social currency. New fans rush to claim before it's too late." },
          ].map(s => (
            <div key={s.n} className="hiw-card">
              <div className="hiw-num">{s.n}</div>
              <div className="hiw-title">{s.t}</div>
              <div className="hiw-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Earnings Calculator */}
      <div className="earnings-section">
        <div className="earnings-inner">
          <div className="earnings-grid">
            <div>
              <div style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:3,color:"var(--accent)",textTransform:"uppercase",marginBottom:12 }}>What You Earn</div>
              <div className="earnings-title">REAL MONEY.<br />EVERY MONTH.</div>
              <div className="earnings-desc">Each fan holding a number is investing in your career — $4, $5, $8 a month. Small individually. Transformative together. And as your numbers rise, new fans feel the urgency to claim before it's too late.</div>
              <div>
                <div style={{ fontSize:13,color:"var(--muted)",marginBottom:8,fontFamily:"var(--font-mono)" }}>FANS: {fans}</div>
                <input type="range" min={10} max={1000} value={fans} onChange={e => setFans(Number(e.target.value))}
                  style={{ width:"100%",accentColor:"var(--accent)",cursor:"pointer" }} />
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",marginTop:4 }}>
                  <span>10</span><span>1,000</span>
                </div>
              </div>
            </div>
            <div className="earnings-calc">
              {[
                { label:"Fans", val: fans.toString() },
                { label:"Price per fan", val:"$5 / mo" },
                { label:"Gross", val:`$${(fans*5).toLocaleString()}` },
                { label:"Platform fee (12%)", val:`−$${Math.round(fans*5*0.12).toLocaleString()}`, muted:true },
              ].map(r => (
                <div key={r.label} className="calc-row">
                  <div className="calc-label">{r.label}</div>
                  <div className="calc-val" style={r.muted ? {color:"var(--muted)"} : {}}>{r.val}</div>
                </div>
              ))}
              <div className="calc-row">
                <div className="calc-label" style={{ fontWeight:600,color:"var(--text)" }}>You take home</div>
                <div className="calc-val highlight">${monthly.toLocaleString()}/mo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quotes */}
      <div style={{ padding:"60px 24px",maxWidth:1100,margin:"0 auto",textAlign:"center" }}>
        <div style={{ fontFamily:"var(--font-display)",fontSize:40,letterSpacing:2,marginBottom:8 }}>WHAT ARTISTS SAY</div>
        <div style={{ fontSize:15,color:"var(--muted)",marginBottom:32 }}>From artists already on FAN#</div>
        <div className="quotes-grid">
          {[
            { q:"Fan #1 through #50 each reached out when I hit my first milestone. They don't feel like fans — they feel like early investors who believed before anyone else did.", n:"Mara Voss", g:"Indie Folk", img:"https://i.pravatar.cc/300?img=47" },
            { q:"Three people in the front row at my last show held up their fan numbers. They weren't just attendees. They were there before I was anyone. That means something different.", n:"Yuki Tanaka", g:"Neo-Soul / R&B", img:"https://i.pravatar.cc/300?img=29" },
            { q:"Predictable income changed what I make. I stopped chasing gigs that paid the bills and started making the music I actually care about. My fans made that possible.", n:"Circuit Bloom", g:"Electronic / Ambient", img:"https://i.pravatar.cc/300?img=12" },
          ].map(q => (
            <div key={q.n} className="quote-card">
              <div style={{ fontSize:14,color:"var(--muted)",lineHeight:1.7,marginBottom:20,fontStyle:"italic" }}>"{q.q}"</div>
              <div style={{ display:"flex",alignItems:"center",gap:12 }}>
                <img src={q.img} style={{ width:40,height:40,borderRadius:"50%",objectFit:"cover" }} />
                <div>
                  <div style={{ fontWeight:600,fontSize:14 }}>{q.n}</div>
                  <div style={{ fontSize:12,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>{q.g}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div style={{ padding:"80px 24px",textAlign:"center",borderTop:"1px solid var(--border)",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",bottom:-60,left:"50%",transform:"translateX(-50%)",width:600,height:400,background:"radial-gradient(ellipse, rgba(123,47,255,0.08) 0%, transparent 65%)",pointerEvents:"none" }} />
        <div style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:3,color:"var(--accent)",textTransform:"uppercase",marginBottom:16 }}>Ready?</div>
        <div style={{ fontFamily:"var(--font-display)",fontSize:"clamp(40px,6vw,72px)",letterSpacing:3,marginBottom:16,lineHeight:1 }}>YOUR FAN #1<br />IS WAITING</div>
        <div style={{ fontSize:16,color:"var(--muted)",marginBottom:36,maxWidth:440,margin:"0 auto 36px",lineHeight:1.6 }}>Someone out there is ready to invest in you before the world catches on. Give them the chance.</div>
        <button className="btn btn-primary" style={{ fontSize:16,padding:"16px 40px" }} onClick={() => setPage("onboarding")}>
          Get Started — It's Free →
        </button>
      </div>
    </div>
  );
}

// ─── Onboarding Wizard ────────────────────────────────────────────────────────
function OnboardingPage({ setPage, onArtistCreated }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ artistName:"", bio:"", genres:[], city:"", price:5, coverColor:"#1a1a2e", accentColor:"#e94560", profileEmoji:"🎸", stripeConnected:false });
  const upd = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const toggleGenre = g => setForm(f => ({ ...f, genres: f.genres.includes(g) ? f.genres.filter(x=>x!==g) : f.genres.length < 3 ? [...f.genres,g] : f.genres }));

  const canAdvance = () => {
    if (step === 0) return form.artistName.trim().length >= 2 && form.bio.trim().length >= 10;
    if (step === 1) return form.genres.length >= 1 && form.city.trim().length >= 2;
    return true;
  };

  const EMOJIS = ["🎸","🎹","🎤","🥁","🎷","🎻","🎺","🎵","🎶","🎧"];
  const COLORS = ["#1a1a2e","#0d0d0d","#1b1b1b","#12001f","#0a1628","#1a0a00","#001a0a","#1a1500"];
  const ACCENTS = ["#e94560","#00f5d4","#f4a261","#c77dff","#ff9f1c","#4cc9f0","#f72585","#7fff00"];

  const steps = [
    // 0: Basic Info
    <>
      <div className="onboarding-title">Tell us about you</div>
      <div className="onboarding-sub">This is what fans will see on your profile. Make it authentic.</div>
      <div className="field">
        <label>Artist / Band Name</label>
        <input value={form.artistName} onChange={e => upd("artistName",e.target.value)} placefan="e.g. Mara Voss, The Midnight, Circuit Bloom" autoFocus />
      </div>
      <div className="field">
        <label>Bio</label>
        <textarea value={form.bio} onChange={e => upd("bio",e.target.value)} placefan="Tell fans who you are. A sentence or two is perfect — keep it real." rows={4} maxLength={300} />
        <div className="field-hint">{form.bio.length} / 300 characters</div>
      </div>
    </>,

    // 1: Genre & City
    <>
      <div className="onboarding-title">Your sound & scene</div>
      <div className="onboarding-sub">Pick up to 3 genres and your city so fans can discover you.</div>
      <div className="field">
        <label>Genre — pick up to 3</label>
        <div className="genre-grid">
          {GENRES.map(g => <div key={g} className={`genre-pill ${form.genres.includes(g)?"selected":""}`} onClick={() => toggleGenre(g)}>{g}</div>)}
        </div>
        <div className="field-hint">{form.genres.length}/3 selected</div>
      </div>
      <div className="field" style={{ marginTop:16 }}>
        <label>City</label>
        <input value={form.city} onChange={e => upd("city",e.target.value)} placefan="e.g. Nashville, TN" />
      </div>
    </>,

    // 2: Price
    <>
      <div className="onboarding-title">What's your number?</div>
      <div className="onboarding-sub">This is what fans pay each month to hold their number. You can change it anytime. Most artists start at $5.</div>
      <div className="price-options">
        {[3,5,8,10].map(p => (
          <div key={p} className={`price-opt ${form.price===p?"selected":""}`} onClick={() => upd("price",p)}>
            <div className="price-opt-val">${p}</div>
            <div className="price-opt-label">per mo</div>
          </div>
        ))}
      </div>
      <div className="field">
        <label>Custom price</label>
        <input type="number" min={3} max={100} value={form.price} onChange={e => upd("price",Number(e.target.value))} style={{ maxWidth:120 }} />
        <div className="field-hint">Minimum $3/month · You keep 88%</div>
      </div>
      <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px",marginTop:16 }}>
        <div style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",textTransform:"uppercase",letterSpacing:1,marginBottom:12 }}>If fans invest at ${form.price}/month</div>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,color:"var(--muted)",marginBottom:8 }}>
          <span>100 fans</span><span style={{ color:"var(--text)",fontFamily:"var(--font-mono)" }}>${Math.round(form.price*100*0.88).toLocaleString()}/mo to you</span>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",fontSize:14,color:"var(--muted)" }}>
          <span>500 fans</span><span style={{ color:"var(--accent)",fontFamily:"var(--font-mono)",fontWeight:600 }}>${Math.round(form.price*500*0.88).toLocaleString()}/mo to you</span>
        </div>
      </div>
    </>,

    // 3: Look
    <>
      <div className="onboarding-title">Your look</div>
      <div className="onboarding-sub">Choose your profile icon and page colors. You'll be able to upload a real photo after launch.</div>
      <div className="field">
        <label>Profile Icon</label>
        <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
          {EMOJIS.map(e => (
            <div key={e} onClick={() => upd("profileEmoji",e)}
              style={{ width:46,height:46,borderRadius:"50%",background:"var(--surface2)",border:`2px solid ${form.profileEmoji===e?"var(--accent)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,cursor:"pointer",transition:"all 0.15s" }}>
              {e}
            </div>
          ))}
        </div>
      </div>
      <div className="field-row" style={{ marginTop:16 }}>
        <div className="field">
          <label>Cover Color</label>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {COLORS.map(c => <div key={c} onClick={() => upd("coverColor",c)} style={{ width:34,height:34,borderRadius:8,background:c,border:`2px solid ${form.coverColor===c?"var(--accent)":"transparent"}`,cursor:"pointer" }} />)}
          </div>
        </div>
        <div className="field">
          <label>Accent Color</label>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            {ACCENTS.map(c => <div key={c} onClick={() => upd("accentColor",c)} style={{ width:34,height:34,borderRadius:8,background:c,border:`2px solid ${form.accentColor===c?"var(--accent)":"transparent"}`,cursor:"pointer" }} />)}
          </div>
        </div>
      </div>
      {/* Live mini-preview */}
      <div style={{ marginTop:20 }}>
        <div style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>Preview</div>
        <div className="preview-frame">
          <div className="preview-cover" style={{ background:form.coverColor }}>
            <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 30% 50%, ${form.accentColor}44, transparent 60%)` }} />
            <div className="preview-avatar">{form.profileEmoji}</div>
          </div>
          <div className="preview-info">
            <div className="preview-name">{form.artistName||"Your Name"}</div>
            <div className="preview-bio">{form.bio||"Your bio will appear here..."}</div>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {form.genres.slice(0,2).map(g => <span key={g} className="tag">{g}</span>)}
              {form.city && <span className="tag">📍 {form.city}</span>}
            </div>
          </div>
        </div>
      </div>
    </>,

    // 4: Stripe
    <>
      <div className="onboarding-title">Connect Stripe</div>
      <div className="onboarding-sub">This is how you get paid. Stripe handles all payment processing and deposits directly to your bank.</div>
      <div className="stripe-box">
        {!form.stripeConnected ? (
          <>
            <div className="stripe-logo">STRIPE</div>
            <div className="stripe-desc">You'll be redirected to Stripe to set up a free account (or connect an existing one). Takes about 3 minutes. Have your bank info and ID handy.</div>
            <button className="btn btn-primary" style={{ background:"#635bff",marginBottom:16,width:"100%" }} onClick={() => upd("stripeConnected",true)}>Connect with Stripe →</button>
            <div style={{ fontSize:12,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>You can skip this and connect later, but fans can't claim a number until it's done.</div>
          </>
        ) : (
          <div className="stripe-connected">
            <span style={{ fontSize:20 }}>✓</span> Stripe account connected
          </div>
        )}
      </div>
      {!form.stripeConnected && (
        <button style={{ background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontSize:13,marginTop:16,fontFamily:"var(--font-body)",textDecoration:"underline" }}
          onClick={() => setStep(s => s+1)}>Skip for now →</button>
      )}
    </>,

    // 5: Preview
    <>
      <div className="onboarding-title">You're almost live</div>
      <div className="onboarding-sub">This is what fans see when they land on your page. Happy with it? Everything is editable after launch.</div>
      <div className="preview-frame" style={{ marginBottom:16 }}>
        <div className="preview-cover" style={{ background:form.coverColor,height:130 }}>
          <div style={{ position:"absolute",inset:0,background:`radial-gradient(circle at 30% 50%, ${form.accentColor}44, transparent 60%)` }} />
          <div className="preview-avatar" style={{ width:72,height:72,fontSize:30 }}>{form.profileEmoji}</div>
        </div>
        <div className="preview-info" style={{ paddingTop:36 }}>
          <div className="preview-name">{form.artistName||"Your Artist Name"}</div>
          <div className="preview-bio">{form.bio||"Your bio appears here."}</div>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
            {form.genres.map(g => <span key={g} className="tag">{g}</span>)}
            {form.city && <span className="tag">📍 {form.city}</span>}
          </div>
          <div style={{ display:"flex",gap:16,marginBottom:14 }}>
            <div className="stat"><div className="stat-num">0</div><div className="stat-label">Fans</div></div>
            <div className="stat"><div className="stat-num">${form.price}</div><div className="stat-label">Per Month</div></div>
          </div>
          <button className="btn btn-primary" style={{ background:form.accentColor,width:"100%",fontSize:14 }}>
            Claim Fan #1 — ${form.price}/month
          </button>
        </div>
      </div>
      {!form.stripeConnected && (
        <div style={{ background:"rgba(255,204,0,0.08)",border:"1px solid rgba(255,204,0,0.2)",borderRadius:10,padding:"12px 16px",fontSize:13,color:"var(--accent2)" }}>
          ⚠️ Stripe not connected — fans can see your page but can't claim a number yet
        </div>
      )}
    </>,
  ];

  const isLast = step === steps.length - 1;

  return (
    <div className="onboarding-wrap">
      <div className="onboarding-card">
        <div className="step-indicator">
          {steps.map((_,i) => <div key={i} className={`step-dot ${i===step?"active":i<step?"done":""}`} />)}
          <div style={{ marginLeft:"auto",fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>{step+1} / {steps.length}</div>
        </div>
        {steps[step]}
        <div className="onboarding-footer">
          <button style={{ background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--font-body)",fontSize:14,padding:0 }}
            onClick={() => step===0 ? setPage("artist-landing") : setStep(s=>s-1)}>
            {step===0 ? "← Back" : "← Previous"}
          </button>
          <div style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>{STEP_LABELS[step]}</div>
          <button className="btn btn-primary btn-sm"
            disabled={!canAdvance() && step<2}
            style={{ opacity:!canAdvance()&&step<2?0.4:1,cursor:!canAdvance()&&step<2?"not-allowed":"pointer" }}
            onClick={() => { if(isLast){ onArtistCreated(form); setPage("artist-live"); } else { setStep(s=>s+1); } }}>
            {isLast ? "Go Live 🚀" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── You're Live Page ─────────────────────────────────────────────────────────
function ArtistLivePage({ artistForm, setPage }) {
  const [copied, setCopied] = useState(false);
  const slug = (artistForm?.artistName||"your-name").toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"");
  const url = `fannumber.com/artists/${slug}`;
  return (
    <div className="live-wrap">
      <div className="live-card">
        <span className="live-icon">🎉</span>
        <div className="live-title">YOU'RE <span>LIVE</span></div>
        <div className="live-sub">Fan #1 is unclaimed and waiting. Share your link — the moment someone claims it, the clock starts on your story.</div>
        {artistForm && (
          <div className="live-profile-preview">
            <div style={{ width:52,height:52,borderRadius:"50%",background:artistForm.coverColor,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,border:`2px solid ${artistForm.accentColor}`,flexShrink:0 }}>
              {artistForm.profileEmoji}
            </div>
            <div>
              <div style={{ fontFamily:"var(--font-display)",fontSize:22,letterSpacing:1 }}>{artistForm.artistName}</div>
              <div style={{ fontSize:13,color:"var(--muted)",marginTop:2 }}>
                {artistForm.genres.slice(0,2).join(", ")}{artistForm.city?` · ${artistForm.city}`:""}
              </div>
              <div style={{ fontSize:13,color:"var(--muted)",marginTop:2 }}>${artistForm.price}/month · 0 fans so far</div>
            </div>
          </div>
        )}
        <div style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",textAlign:"left",marginBottom:8,textTransform:"uppercase",letterSpacing:1 }}>Your Link</div>
        <div className="live-share">
          <div className="live-share-url">{url}</div>
          <button className="live-share-copy" onClick={() => { setCopied(true); setTimeout(()=>setCopied(false),2000); }}>
            {copied ? "Copied ✓" : "Copy"}
          </button>
        </div>
        <div className="live-actions">
          <button className="btn btn-primary" onClick={() => setPage("artist-dashboard")}>Go to Dashboard →</button>
          <button className="btn btn-secondary btn-sm" onClick={() => setPage("discover")}>Browse Artists</button>
        </div>
        {!artistForm?.stripeConnected && (
          <div style={{ marginTop:20,background:"rgba(255,204,0,0.08)",border:"1px solid rgba(255,204,0,0.2)",borderRadius:10,padding:"12px 16px",fontSize:13,color:"var(--accent2)",textAlign:"left" }}>
            ⚠️ Connect Stripe before sharing — fans can see your page but can't claim a number yet.
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Artist Dashboard ─────────────────────────────────────────────────────────
function ArtistDashboardPage({ setPage }) {
  const artist = ARTISTS[0];
  const [postContent, setPostContent] = useState("");
  const [isFanOnly, setIsFanOnly] = useState(false);
  const [posts, setPosts] = useState(artist.posts);
  const [tab, setTab] = useState("overview");
  const mockEarnings = artist.fanCount * artist.price * 0.88;
  const handlePost = () => {
    if (!postContent.trim()) return;
    setPosts([{ id:"new-"+Date.now(), content:postContent, fanOnly:isFanOnly, date:"Today" }, ...posts]);
    setPostContent("");
  };
  return (
    <div className="page">
      <div className="dashboard-header">
        <img src={artist.image} alt={artist.name} className="dashboard-avatar" />
        <div>
          <div className="dashboard-title">ARTIST DASHBOARD</div>
          <div className="dashboard-sub">Welcome back, {artist.name}</div>        </div>
      </div>
      <div className="tabs">
        <button className={`tab ${tab==="overview"?"active":""}`} onClick={() => setTab("overview")}>Overview</button>
        <button className={`tab ${tab==="fans"?"active":""}`} onClick={() => setTab("fans")}>Fan Roster</button>
        <button className={`tab ${tab==="posts"?"active":""}`} onClick={() => setTab("posts")}>Posts</button>
      </div>
      {tab === "overview" && (
        <>
          <div className="metric-grid">
            <div className="metric-card accent"><div className="metric-val">{artist.fanCount}</div><div className="metric-label">Fans</div></div>
            <div className="metric-card"><div className="metric-val">${mockEarnings.toFixed(0)}</div><div className="metric-label">Monthly Income</div></div>
            <div className="metric-card"><div className="metric-val">{artist.posts.length}</div><div className="metric-label">Posts</div></div>
            <div className="metric-card"><div className="metric-val">88%</div><div className="metric-label">You Keep</div></div>
          </div>
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px",marginBottom:24 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:600,marginBottom:4 }}>{artist.name}</div>
                <div style={{ fontSize:13,color:"var(--muted)" }}>{artist.genre} · ${artist.price}/month</div>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage({ type:"artist",id:artist.id })}>View Public Page →</button>
            </div>
          </div>
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px" }}>
            <div style={{ fontFamily:"var(--font-display)",fontSize:18,letterSpacing:1,marginBottom:12 }}>RECENT ACTIVITY</div>
            {[
              { text:"Fan #312 claimed — new fan joined", time:"2h ago", color:"var(--accent)" },
              { text:"Fan #7 Jordan K. commented on your post", time:"5h ago", color:"var(--accent2)" },
              { text:"Fan #299 Sam W. claimed their number", time:"Yesterday", color:"var(--accent)" },
              { text:"Your post got 47 likes", time:"2 days ago", color:"var(--muted)" },
            ].map((item,i) => (
              <div key={i} style={{ display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<3?"1px solid var(--border)":"none" }}>
                <div style={{ width:8,height:8,borderRadius:"50%",background:item.color,flexShrink:0 }} />
                <div style={{ flex:1,fontSize:14 }}>{item.text}</div>
                <div style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>{item.time}</div>
              </div>
            ))}
          </div>
        </>
      )}
      {tab === "fans" && (
        <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,overflow:"hidden" }}>
          <div style={{ padding:"14px 20px",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
            <div style={{ fontFamily:"var(--font-display)",fontSize:18,letterSpacing:1 }}>FAN ROSTER</div>
            <div style={{ fontSize:13,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>{artist.fanCount} fans</div>
          </div>
          {[
            { num:1, name:"Jordan K.", initial:"J", since:"Dec 2024", active:true },
            { num:2, name:"Sam Rivers", initial:"S", since:"Dec 2024", active:true },
            { num:3, name:"Alex P.", initial:"A", since:"Jan 2025", active:true },
            { num:7, name:"Taylor M.", initial:"T", since:"Jan 2025", active:true },
            { num:23, name:"Chris L.", initial:"C", since:"Feb 2025", active:true },
            { num:100, name:"Morgan R.", initial:"M", since:"Mar 2025", active:false },
            { num:311, name:"Jamie S.", initial:"J", since:"Jan 2026", active:true },
            { num:312, name:"New Fan", initial:"N", since:"Feb 2026", active:true },
          ].map(fan => (
            <div key={fan.num} className="fan-row">
              <div className="fan-row-num" style={{ color:fan.num<=10?"var(--accent)":"var(--text)" }}>#{fan.num}</div>
              <div className="fan-row-avatar">{fan.initial}</div>
              <div style={{ flex:1 }}><div className="fan-row-name">{fan.name}</div><div className="fan-row-date">Fan since {fan.since}</div></div>
              <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                <div style={{ width:6,height:6,borderRadius:"50%",background:fan.active?"var(--green)":"var(--muted)" }} />
                <div style={{ fontSize:11,fontFamily:"var(--font-mono)",color:fan.active?"var(--green)":"var(--muted)" }}>{fan.active?"Active":"Inactive"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {tab === "posts" && (
        <>
          <div className="post-form">
            <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placefan="Share something with your fans..." />
            <div className="post-form-footer">
              <label className="toggle-label">
                <div className={`toggle ${isFanOnly?"on":""}`} onClick={() => setIsFanOnly(!isFanOnly)} />
                Fans only
              </label>
              <button className="btn btn-primary btn-sm" onClick={handlePost}>Post</button>
            </div>
          </div>
          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                {post.fanOnly && <div className="post-lock-badge">🔒 Fans only</div>}
                <span className="post-date">{post.date}</span>
                <div className="post-content">{post.content}</div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [mode, setMode] = useState("fan");
  const [userFans, setUserFans] = useState(INITIAL_USER_FANS);
  const [toast, setToast] = useState({ show:false, message:"" });
  const [newArtistForm, setNewArtistForm] = useState(null);

  const showToast = msg => { setToast({ show:true,message:msg }); setTimeout(() => setToast({ show:false,message:msg }),3000); };
  const handleSubscribe = artist => {
    if (userFans.find(f => f.artistId===artist.id)) return;
    const n = artist.fanCount + 1;
    setUserFans(prev => [...prev,{ artistId:artist.id,fanNumber:n,date:"Feb 2026" }]);
    showToast(`🎉 You're Fan #${n} of ${artist.name}!`);
  };
  const handleUnsubscribe = artist => { setUserFans(prev => prev.filter(f => f.artistId!==artist.id)); showToast(`Released number for ${artist.name}`); };
  const switchMode = m => { setMode(m); setPage(m==="artist"?"artist-dashboard":"home"); };
  const currentPage = typeof page==="object" ? page.type : page;
  const hideNav = currentPage==="onboarding" || currentPage==="artist-live";

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {!hideNav && (
          <nav className="nav">
            <div className="nav-logo" onClick={() => { setPage("home"); setMode("fan"); }}>FAN<span>#</span></div>
            <div className="nav-links">
              {mode==="fan" && (
                <>
                  <button className={`nav-btn ${currentPage==="home"?"active":""}`} onClick={() => setPage("home")}>Home</button>
                  <button className={`nav-btn ${currentPage==="discover"?"active":""}`} onClick={() => setPage("discover")}>Discover</button>
                  <button className={`nav-btn ${currentPage==="profile"?"active":""}`} onClick={() => setPage("profile")}>
                    My Numbers{userFans.length>0?` (${userFans.length})`:""}
                  </button>
                  <div className="nav-divider" />
                  <button className="nav-btn primary" onClick={() => setPage("artist-landing")}>For Artists</button>
                </>
              )}
              {mode==="artist" && <button className="nav-btn active">Dashboard</button>}
              <div className="nav-divider" />
              <div className="mode-switcher">
                <span className="mode-label">View as:</span>
                <button className={`mode-btn ${mode==="fan"?"active":""}`} onClick={() => switchMode("fan")}>FAN</button>
                <button className={`mode-btn ${mode==="artist"?"active":""}`} onClick={() => switchMode("artist")}>ARTIST</button>
              </div>
            </div>
          </nav>
        )}

        {mode==="fan" && currentPage==="home"     && <HomePage setPage={setPage} userFans={userFans} />}
        {mode==="fan" && currentPage==="discover"  && <DiscoverPage setPage={setPage} userFans={userFans} />}
        {mode==="fan" && currentPage==="artist"    && <ArtistProfilePage artistId={page.id} setPage={setPage} userFans={userFans} onSubscribe={handleSubscribe} onUnsubscribe={handleUnsubscribe} />}
        {mode==="fan" && currentPage==="profile"   && <MyProfilePage userFans={userFans} setPage={setPage} />}
        {currentPage==="artist-landing"            && <ArtistLandingPage setPage={setPage} />}
        {currentPage==="onboarding"                && <OnboardingPage setPage={setPage} onArtistCreated={f => setNewArtistForm(f)} />}
        {currentPage==="artist-live"               && <ArtistLivePage artistForm={newArtistForm} setPage={setPage} />}
        {(mode==="artist" || currentPage==="artist-dashboard") && <ArtistDashboardPage setPage={setPage} />}

        <Toast message={toast.message} show={toast.show} />
      </div>
    </>
  );
}

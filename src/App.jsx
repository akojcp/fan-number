import { useState } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ARTISTS = [
  {
    id: "a1", name: "Mara Voss", genre: "Indie Folk", vibes: ["Raw","Nostalgic","Intimate"], city: "Nashville, TN",
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
    id: "a2", name: "Circuit Bloom", genre: "Electronic / Ambient", vibes: ["Experimental","Chill","Dreamy"], city: "Los Angeles, CA",
    bio: "Producer. Sound designer. Finding beauty in digital noise and analog warmth.",
    price: 8, fanCount: 87, image: "https://i.pravatar.cc/300?img=12",
    coverColor: "#0d0d0d", accentColor: "#00f5d4", spotifyUrl: "#",
    posts: [
      { id: "p4", content: "New single dropping Friday. 4 years in the making. No more hints.", fanOnly: false, date: "Feb 15" },
      { id: "p5", content: "🔒 Full album stems pack — remix anything you want. Fans only.", fanOnly: true, date: "Feb 8" },
    ]
  },
  {
    id: "a3", name: "The Olvera Duo", genre: "Latin Jazz", vibes: ["Warm","Groovy","Nostalgic"], city: "Miami, FL",
    bio: "Two brothers, two guitars, one sound. Playing the music our grandfather taught us.",
    price: 4, fanCount: 1204, image: "https://i.pravatar.cc/300?img=65",
    coverColor: "#1b1b1b", accentColor: "#f4a261", spotifyUrl: "#",
    posts: [
      { id: "p6", content: "Tour announcement coming Monday. You already know where we're going 🌴", fanOnly: false, date: "Feb 13" },
      { id: "p7", content: "🔒 Live set from Havana — full 90 minute recording. Fans only, forever.", fanOnly: true, date: "Feb 1" },
    ]
  },
  {
    id: "a4", name: "Yuki Tanaka", genre: "Neo-Soul / R&B", vibes: ["Intimate","Melancholic","Polished"], city: "New York, NY",
    bio: "Vocalist. Producer. Writing love songs for people who don't believe in love anymore.",
    price: 6, fanCount: 43, image: "https://i.pravatar.cc/300?img=29",
    coverColor: "#12001f", accentColor: "#c77dff", spotifyUrl: "#",
    posts: [
      { id: "p8", content: "First show in 2 years is booked. Small venue. Intimate. The way it should be.", fanOnly: false, date: "Feb 16" },
      { id: "p9", content: "🔒 Handwritten lyrics to 'Softer Now' — with all the crossed-out parts.", fanOnly: true, date: "Feb 12" },
    ]
  },
];

const INITIAL_USER_FANS = [{ artistId: "a3", ogNumber: 847, currentStanding: 831, isOG: true, date: "Jan 2025" }];
const VIBES = [
  "Chill","Energetic","Dark","Uplifting","Melancholic","Aggressive","Dreamy",
  "Groovy","Raw","Polished","Experimental","Nostalgic","Intimate","Chaotic","Warm",
  "Sharp","Absurd","Storytelling","Political","Clean","Edgy","Observational","Dry","Silly","Provocative"
];
const GENRES = [
  "Indie Folk","Singer-Songwriter","Alternative","Rock","Punk","Metal","Pop","Synth-Pop",
  "Electronic","Ambient","Hip-Hop","R&B / Soul","Jazz","Blues","Country","Americana",
  "Latin","Reggae","Classical","Experimental","Stand-up Comedy","Sketch Comedy","Improv"
];

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
  .og-badge { display: inline-flex; align-items: center; gap: 4px; background: rgba(255,204,0,0.12); border: 1px solid rgba(255,204,0,0.35); color: var(--accent2); font-family: var(--font-mono); font-size: 10px; font-weight: 500; padding: 2px 8px; border-radius: 20px; letter-spacing: 0.5px; margin-top: 4px; }

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

  .field { margin-bottom: 20px; }
  .field label { display: block; font-size: 12px; font-weight: 600; color: var(--muted); margin-bottom: 8px; font-family: var(--font-mono); letter-spacing: 1px; text-transform: uppercase; }
  .field input, .field textarea, .field select { width: 100%; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--font-body); font-size: 15px; border-radius: 8px; padding: 12px 14px; outline: none; transition: border-color 0.15s; appearance: none; }
  .field input:focus, .field textarea:focus { border-color: #555; }
  .field textarea { resize: vertical; min-height: 100px; }
  .field-hint { font-size: 12px; color: var(--muted); margin-top: 6px; font-family: var(--font-mono); }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  @media (max-width: 560px) { .field-row { grid-template-columns: 1fr; } }

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
  .price-opt { background: var(--surface2); border: 2px solid var(--border); border-radius: 10px; padding: 14px 8px; text-align: center; cursor: pointer; transition: all 0.15s; position: relative; }
  .price-opt:hover { border-color: #555; }
  .price-opt.selected { border-color: var(--accent); background: rgba(123,47,255,0.08); }
  .price-opt-val { font-family: var(--font-display); font-size: 26px; letter-spacing: 1px; }
  .price-opt-label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); }
  .price-opt-badge { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); font-size: 9px; font-family: var(--font-mono); color: var(--accent); background: var(--bg); border: 1px solid var(--accent); border-radius: 10px; padding: 1px 6px; letter-spacing: 0.5px; text-transform: uppercase; white-space: nowrap; }

  .vibe-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .vibe-pill { padding: 7px 16px; border-radius: 20px; border: 1px solid var(--border); font-size: 13px; cursor: pointer; transition: all 0.15s; background: var(--surface2); color: var(--muted); user-select: none; }
  .vibe-pill:hover { border-color: #555; color: var(--text); }
  .vibe-pill.selected { border-color: var(--accent); background: rgba(123,47,255,0.12); color: var(--text); }
  .vibe-pill.disabled { opacity: 0.35; cursor: not-allowed; }
  .custom-vibe-row { display: flex; gap: 8px; margin-top: 10px; }
  .custom-vibe-input { flex: 1; background: var(--surface2); border: 1px solid var(--border); color: var(--text); font-family: var(--font-body); font-size: 14px; border-radius: 20px; padding: 7px 16px; outline: none; transition: border-color 0.15s; }
  .custom-vibe-input:focus { border-color: #555; }
  .custom-vibe-input::placeholder { color: var(--muted); }
  .custom-vibe-add { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); font-family: var(--font-body); font-size: 13px; padding: 7px 16px; border-radius: 20px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
  .custom-vibe-add:hover { border-color: #555; color: var(--text); }

  .photo-upload-row { display: flex; gap: 16px; margin-bottom: 4px; }
  .photo-upload-box { flex: 1; border: 1.5px dashed var(--border); border-radius: 12px; padding: 20px 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: border-color 0.15s; background: var(--surface2); text-align: center; }
  .photo-upload-box:hover { border-color: #555; }
  .photo-upload-box .upload-icon { font-size: 24px; }
  .photo-upload-box .upload-label { font-size: 12px; color: var(--muted); }
  .photo-upload-box .upload-title { font-size: 13px; font-weight: 500; }
  .photo-preview { width: 100%; height: 80px; object-fit: cover; border-radius: 8px; }
  .banner-preview { width: 100%; height: 60px; object-fit: cover; border-radius: 8px; }
  .member-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
  .member-row input { flex: 1; }
  .icon-btn { background: var(--surface2); border: 1px solid var(--border); color: var(--muted); width: 34px; height: 34px; border-radius: 8px; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .icon-btn:hover { border-color: #555; color: var(--text); }
  .icon-btn.danger:hover { border-color: #ff4444; color: #ff4444; }
  .benefit-row { display: flex; gap: 8px; align-items: center; margin-bottom: 8px; }
  .benefit-row input { flex: 1; }
  .links-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .link-field { display: flex; flex-direction: column; gap: 4px; }
  .link-field label { font-size: 11px; color: var(--muted); font-family: var(--font-mono); display: flex; align-items: center; gap: 6px; }
  .section-label { font-size: 13px; font-weight: 600; color: var(--text); margin: 18px 0 10px; display: flex; align-items: center; gap: 8px; }
  .section-label span { font-size: 16px; }
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

  .split-bar { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin: 12px 0 8px; }
  .split-bar-artist { background: var(--accent); transition: width 0.3s; }
  .split-bar-platform { background: var(--border); }
  .split-labels { display: flex; justify-content: space-between; font-size: 11px; font-family: var(--font-mono); }
`;

// ─── Shared ───────────────────────────────────────────────────────────────────
function Toast({ message, show }) {
  return <div className={`toast ${show ? "show" : ""}`}>{message}</div>;
}

function ArtistCard({ artist, userFans, onClick }) {
  const myFan = userFans.find(f => f.artistId === artist.id);
  return (
    <div className="artist-card" onClick={() => onClick(artist)}>
      {myFan && <div className="claimed-ribbon">FAN #{myFan.currentStanding}</div>}
      <div className="artist-card-cover" style={{ background: artist.coverColor }}>
        <div style={{ position:"absolute",inset:0,opacity:0.3,background:`radial-gradient(circle at 70% 30%, ${artist.accentColor}, transparent 60%)` }} />
        <img src={artist.image} alt={artist.name} className="artist-card-avatar" />
      </div>
      <div className="artist-card-body">
        <div className="artist-card-name">{artist.name}</div>
        <div className="artist-card-genre" style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {artist.vibes.slice(0,2).map(v => (
            <span key={v} style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:20,padding:"2px 8px",fontSize:11,fontFamily:"var(--font-mono)",color:"var(--muted)"}}>{v}</span>
          ))}
          <span style={{fontSize:11,fontFamily:"var(--font-mono)",color:"var(--muted)"}}>· {artist.city}</span>
        </div>
        <div className="artist-card-footer">
          <div className="fan-badge"><strong>{artist.fanCount.toLocaleString()}</strong> fans</div>
          <div className="price-tag">${artist.price}/mo <span style={{fontSize:10,color:"var(--muted)"}}>+ tax</span></div>
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
    a.vibes.some(v => v.toLowerCase().includes(search.toLowerCase())) ||
    a.city.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="page">
      <div className="section-header"><div className="section-title">FIND YOUR ARTISTS</div></div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artists, vibes, cities — claim early, claim low..."
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
    { num:1,  ogNum:1,  name:"Jordan K.", initial:"J", since:"Dec 2024", isOG:true  },
    { num:2,  ogNum:2,  name:"Sam Rivers", initial:"S", since:"Dec 2024", isOG:true  },
    { num:3,  ogNum:5,  name:"Alex P.",   initial:"A", since:"Jan 2025", isOG:true  },
    { num:4,  ogNum:9,  name:"Taylor M.", initial:"T", since:"Feb 2025", isOG:false },
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
              {artist.vibes.map(v => <span key={v} className="tag">{v}</span>)}
              <span className="tag">📍 {artist.city}</span>
            </div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat"><div className="stat-num">{artist.fanCount.toLocaleString()}</div><div className="stat-label">Fans</div></div>
          <div className="stat"><div className="stat-num">${artist.price}/mo</div><div className="stat-label">Per Month</div></div>
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
                <p>Invest in {artist.name} early. Hold for 6 months to earn your OG badge. The longer you stay, the higher you can rise.</p>
                <div className="next-fan-number" style={{ color: artist.accentColor }}>#{artist.fanCount + 1}</div>
                <div className="next-fan-label">Available right now</div>
                <button className="btn btn-primary" style={{ background:artist.accentColor,width:"100%",fontSize:16 }} onClick={() => onSubscribe(artist)}>
                  Claim for ${artist.price}/mo <span style={{fontSize:12,fontWeight:400,opacity:0.7}}>+ tax</span>
                </button>
              </>
            ) : (
              <>
                <h3>You hold this number</h3>
                <p>You invested in {artist.name} in {myFan.date}. Keep holding — the longer you stay, the higher you rise.</p>
                <div className="next-fan-number" style={{ color: artist.accentColor }}>#{myFan.currentStanding}</div>
                <div className="next-fan-label">Your current standing</div>
                {myFan.isOG && (
                  <div style={{ display:"flex",justifyContent:"center",marginBottom:12 }}>
                    <div className="og-badge" style={{ fontSize:12,padding:"4px 12px" }}>OG #{myFan.ogNumber}</div>
                  </div>
                )}
                {!myFan.isOG && (
                  <div style={{ fontSize:12,color:"var(--muted)",fontFamily:"var(--font-mono)",textAlign:"center",marginBottom:12 }}>
                    Hold for 6 months to earn your OG badge
                  </div>
                )}
                <button className="btn btn-secondary" style={{ width:"100%",fontSize:13,marginTop:8 }} onClick={() => onUnsubscribe(artist)}>Cancel Subscription</button>
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
              {[...mockFans, ...(isSubscribed ? [{num:myFan.currentStanding,ogNum:myFan.ogNumber,name:"You",initial:"Y",since:myFan.date,isOG:myFan.isOG}] : [])]
                .sort((a,b) => a.num - b.num).slice(0,6).map(fan => (
                <div key={fan.num} className="fan-row" style={fan.name==="You"?{background:"rgba(123,47,255,0.05)"}:{}}>
                  <div className="fan-row-num" style={{ color:fan.name==="You"?"var(--accent)":"var(--text)" }}>#{fan.num}</div>
                  <div className="fan-row-avatar">{fan.initial}</div>
                  <div style={{ flex:1 }}>
                    <div className="fan-row-name">{fan.name==="You"?"You ✦":fan.name}</div>
                    <div className="fan-row-date">Since {fan.since}</div>
                  </div>
                  {fan.isOG && (
                    <div className="og-badge">{fan.ogNum !== fan.num ? `OG #${fan.ogNum}` : "OG"}</div>
                  )}
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
                  <div className="fn-number" style={{ color:artist.accentColor }}>#{fan.currentStanding}</div>
                  <div className="fn-artist">{artist.name}</div>
                  <div className="fn-since">Since {fan.date} · {artist.vibes[0]}</div>
                  {fan.isOG && fan.ogNumber !== fan.currentStanding && (
                    <div className="og-badge">OG #{fan.ogNumber}</div>
                  )}
                  {fan.isOG && fan.ogNumber === fan.currentStanding && (
                    <div className="og-badge">OG #{fan.ogNumber} · Never moved</div>
                  )}
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:11,fontFamily:"var(--font-mono)",color:"rgba(255,255,255,0.4)",marginBottom:4 }}>STANDING</div>
                  <div style={{ fontFamily:"var(--font-display)",fontSize:22,color:"rgba(255,255,255,0.7)" }}>#{fan.currentStanding} of {artist.fanCount}</div>
                  {fan.isOG && fan.ogNumber !== fan.currentStanding && (
                    <div style={{ fontSize:10,fontFamily:"var(--font-mono)",color:"var(--accent2)",marginTop:4 }}>↑ {fan.ogNumber - fan.currentStanding} spots</div>
                  )}
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
  const [calcPrice, setCalcPrice] = useState(5);
  const gross = fans * calcPrice;
  const platformFee = Math.round(gross * 0.12);
  const takeHome = gross - platformFee;
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
          {[["Free to start","No upfront cost"],["88% is yours","Every dollar, every month"],["Numbers never reset","Fan #1 is gone forever once claimed"]].map(([t,s]) => (
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
              <div className="earnings-desc">Fans pay a simple monthly price to hold their number. You keep 88% — deposited directly to your bank via Stripe. The other 12% keeps FAN# running. That's it. No hidden fees, no middlemen.</div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize:13,color:"var(--muted)",marginBottom:8,fontFamily:"var(--font-mono)" }}>FANS: {fans}</div>
                <input type="range" min={10} max={1000} value={fans} onChange={e => setFans(Number(e.target.value))}
                  style={{ width:"100%",accentColor:"var(--accent)",cursor:"pointer" }} />
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",marginTop:4 }}>
                  <span>10</span><span>1,000</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize:13,color:"var(--muted)",marginBottom:8,fontFamily:"var(--font-mono)" }}>YOUR PRICE: ${calcPrice}/mo</div>
                <input type="range" min={3} max={25} value={calcPrice} onChange={e => setCalcPrice(Number(e.target.value))}
                  style={{ width:"100%",accentColor:"var(--accent)",cursor:"pointer" }} />
                <div style={{ display:"flex",justifyContent:"space-between",fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",marginTop:4 }}>
                  <span>$3 (min)</span><span>$25</span>
                </div>
              </div>
            </div>
            <div className="earnings-calc">
              <div className="calc-row">
                <div className="calc-label">Fans</div>
                <div className="calc-val">{fans.toLocaleString()}</div>
              </div>
              <div className="calc-row">
                <div className="calc-label">Price per fan</div>
                <div className="calc-val">${calcPrice}/mo</div>
              </div>
              <div className="calc-row">
                <div className="calc-label">Gross monthly</div>
                <div className="calc-val">${gross.toLocaleString()}</div>
              </div>
              <div className="calc-row">
                <div className="calc-label">Platform fee (12%)</div>
                <div className="calc-val" style={{color:"var(--muted)"}}>−${platformFee.toLocaleString()}</div>
              </div>
              <div className="calc-row" style={{ borderBottom:"none",paddingTop:14 }}>
                <div className="calc-label" style={{ fontWeight:600,color:"var(--text)" }}>You take home</div>
                <div className="calc-val highlight">${takeHome.toLocaleString()}/mo</div>
              </div>
              <div className="split-bar">
                <div className="split-bar-artist" style={{ width:"88%" }} />
                <div className="split-bar-platform" style={{ width:"12%" }} />
              </div>
              <div className="split-labels">
                <span style={{ color:"var(--accent)" }}>88% yours</span>
                <span style={{ color:"var(--muted)" }}>12% platform</span>
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

// ─── Onboarding Page ──────────────────────────────────────────────────────────
function OnboardingPage({ setPage, onArtistCreated }) {
  const [form, setForm] = useState({
    artistName:"", bio:"", genres:[], vibes:[], customVibe:"", city:"", price:5,
    coverColor:"#1a1a2e", accentColor:"#e94560", profileEmoji:"🎸", stripeConnected:false,
    profilePhoto:null, bannerImage:null, dateFormed:"", label:"",
    bandMembers:[{ name:"", role:"" }],
    fanBenefits:[""],
    links:{ spotify:"", appleMusic:"", youtube:"", instagram:"", tiktok:"", x:"", soundcloud:"", bandcamp:"" }
  });
  const upd = (k, v) => setForm(f => ({ ...f, [k]:v }));
  const toggleGenre = g => setForm(f => ({ ...f, genres: f.genres.includes(g) ? f.genres.filter(x=>x!==g) : f.genres.length < 3 ? [...f.genres, g] : f.genres }));
  const toggleVibe = v => setForm(f => ({ ...f, vibes: f.vibes.includes(v) ? f.vibes.filter(x=>x!==v) : f.vibes.length < 3 ? [...f.vibes, v] : f.vibes }));
  const addCustomVibe = () => {
    const v = form.customVibe.trim();
    if (!v || form.vibes.includes(v) || form.vibes.length >= 3) return;
    setForm(f => ({ ...f, vibes: [...f.vibes, v], customVibe: "" }));
  };

  const handlePriceChange = (val) => {
    const num = Number(val);
    if (num >= 3 || val === "") upd("price", num || 3);
    else upd("price", 3);
  };

  const canGoLive = form.artistName.trim().length >= 2 && form.bio.trim().length >= 10;

  const EMOJIS = ["🎸","🎹","🎤","🥁","🎷","🎻","🎺","🎵","🎶","🎧"];
  const COLORS = ["#1a1a2e","#0d0d0d","#1b1b1b","#12001f","#0a1628","#1a0a00","#001a0a","#1a1500"];
  const ACCENTS = ["#e94560","#00f5d4","#f4a261","#c77dff","#ff9f1c","#4cc9f0","#f72585","#7fff00"];

  const SectionHeader = ({ emoji, title, subtitle, optional }) => (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10,marginBottom:4 }}>
        <span style={{ fontSize:18 }}>{emoji}</span>
        <div style={{ fontFamily:"var(--font-display)",fontSize:22,letterSpacing:1 }}>{title}</div>
        {optional && <span style={{ fontSize:11,color:"var(--muted)",fontFamily:"var(--font-mono)",background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:20,padding:"2px 8px" }}>optional</span>}
      </div>
      {subtitle && <div style={{ fontSize:13,color:"var(--muted)",paddingLeft:28 }}>{subtitle}</div>}
    </div>
  );

  return (
    <div style={{ maxWidth:680,margin:"0 auto",padding:"40px 24px 80px" }}>
      <button style={{ background:"none",border:"none",color:"var(--muted)",cursor:"pointer",fontFamily:"var(--font-body)",fontSize:14,padding:0,marginBottom:32,display:"flex",alignItems:"center",gap:6 }}
        onClick={() => setPage("artist-landing")}>← Back</button>

      <div style={{ marginBottom:40 }}>
        <div style={{ fontFamily:"var(--font-mono)",fontSize:11,letterSpacing:3,color:"var(--accent)",textTransform:"uppercase",marginBottom:8 }}>Create your artist page</div>
        <div style={{ fontFamily:"var(--font-display)",fontSize:48,letterSpacing:3,lineHeight:1,marginBottom:12 }}>BUILD YOUR<br /><span style={{ color:"var(--accent)" }}>PAGE</span></div>
        <div style={{ fontSize:15,color:"var(--muted)",lineHeight:1.6 }}>Fill out what you can — you can always edit everything after launch. Only your name and bio are required to go live.</div>
      </div>

      {/* ── Section 1: Basic Info ─── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:16 }}>
        <SectionHeader emoji="✏️" title="Basic Info" subtitle="This is the first thing fans see." />
        <div className="field">
          <label>Artist / Band Name <span style={{ color:"var(--accent)",fontSize:11 }}>*</span></label>
          <input value={form.artistName} onChange={e => upd("artistName",e.target.value)} placeholder="e.g. Mara Voss, The Midnight, Circuit Bloom" autoFocus />
        </div>
        <div className="field" style={{ marginBottom:0 }}>
          <label>Bio <span style={{ color:"var(--accent)",fontSize:11 }}>*</span></label>
          <textarea value={form.bio} onChange={e => upd("bio",e.target.value)} placeholder="Tell fans who you are. A sentence or two is perfect — keep it real." rows={4} maxLength={300} />
          <div className="field-hint">{form.bio.length} / 300 characters</div>
        </div>
      </div>

      {/* ── Section 2: Genre ─── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:16 }}>
        <SectionHeader emoji="🎵" title="Genre" subtitle="Pick up to 3. Skip if it doesn't apply." optional />
        <div className="vibe-grid">
          {GENRES.map(g => (
            <div key={g} className={`vibe-pill ${form.genres.includes(g)?"selected":""} ${!form.genres.includes(g)&&form.genres.length>=3?"disabled":""}`}
              onClick={() => toggleGenre(g)}>{g}</div>
          ))}
        </div>
        {form.genres.length > 0 && (
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginTop:12 }}>
            {form.genres.map(g => (
              <div key={g} className="vibe-pill selected" style={{ display:"flex",alignItems:"center",gap:6 }}>
                {g}<span onClick={() => toggleGenre(g)} style={{ cursor:"pointer",opacity:0.6,fontSize:11 }}>✕</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Section 3: Vibe & City ─── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:16 }}>
        <SectionHeader emoji="✨" title="Vibe & City" subtitle="Pick up to 3 vibes that describe your style." />
        <div className="vibe-grid" style={{ marginBottom:12 }}>
          {VIBES.map(v => (
            <div key={v} className={`vibe-pill ${form.vibes.includes(v)?"selected":""} ${!form.vibes.includes(v)&&form.vibes.length>=3?"disabled":""}`}
              onClick={() => toggleVibe(v)}>{v}</div>
          ))}
        </div>
        <div className="field-hint" style={{ marginBottom:10 }}>{form.vibes.length}/3 selected</div>
        <div className="custom-vibe-row" style={{ marginBottom: form.vibes.length > 0 ? 10 : 0 }}>
          <input className="custom-vibe-input" value={form.customVibe} onChange={e => upd("customVibe",e.target.value)}
            onKeyDown={e => e.key==="Enter" && addCustomVibe()}
            placeholder="Or type your own vibe..." disabled={form.vibes.length >= 3} />
          <button className="custom-vibe-add" onClick={addCustomVibe} disabled={form.vibes.length >= 3}>+ Add</button>
        </div>
        {form.vibes.length > 0 && (
          <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:16 }}>
            {form.vibes.map(v => (
              <div key={v} className="vibe-pill selected" style={{ display:"flex",alignItems:"center",gap:6 }}>
                {v}<span onClick={() => toggleVibe(v)} style={{ cursor:"pointer",opacity:0.6,fontSize:11 }}>✕</span>
              </div>
            ))}
          </div>
        )}
        <div className="field" style={{ marginBottom:0 }}>
          <label>City</label>
          <input value={form.city} onChange={e => upd("city",e.target.value)} placeholder="e.g. Nashville, TN" />
        </div>
      </div>

      {/* ── Section 4: Your Profile ─── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:16 }}>
        <SectionHeader emoji="🎭" title="Your Profile" subtitle="Photos, history, and links. All optional." optional />

        <div className="photo-upload-row" style={{ marginBottom:16 }}>
          <div className="photo-upload-box" style={{ maxWidth:110 }} onClick={() => document.getElementById('profilePhotoInput').click()}>
            {form.profilePhoto
              ? <img src={form.profilePhoto} alt="profile" style={{width:80,height:80,borderRadius:'50%',objectFit:'cover'}} />
              : <><div className="upload-icon">🎭</div><div className="upload-title">Photo</div><div className="upload-label">Tap to upload</div></>}
            <input id="profilePhotoInput" type="file" accept="image/*" style={{display:'none'}}
              onChange={e => { const f=e.target.files[0]; if(f){const r=new FileReader();r.onload=ev=>upd('profilePhoto',ev.target.result);r.readAsDataURL(f);} }} />
          </div>
          <div className="photo-upload-box" onClick={() => document.getElementById('bannerInput').click()}>
            {form.bannerImage
              ? <img src={form.bannerImage} alt="banner" style={{width:'100%',height:80,objectFit:'cover',borderRadius:8}} />
              : <><div className="upload-icon">🖼️</div><div className="upload-title">Banner Image</div><div className="upload-label">Appears at the top of your page</div></>}
            <input id="bannerInput" type="file" accept="image/*" style={{display:'none'}}
              onChange={e => { const f=e.target.files[0]; if(f){const r=new FileReader();r.onload=ev=>upd('bannerImage',ev.target.result);r.readAsDataURL(f);} }} />
          </div>
        </div>

        <div className="field">
          <label>Profile Icon</label>
          <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
            {EMOJIS.map(e => (
              <div key={e} onClick={() => upd("profileEmoji",e)}
                style={{ width:44,height:44,borderRadius:"50%",background:"var(--surface2)",border:`2px solid ${form.profileEmoji===e?"var(--accent)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,cursor:"pointer",transition:"all 0.15s" }}>
                {e}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
          <div className="field" style={{ marginBottom:0 }}>
            <label>Cover Color</label>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {COLORS.map(c => <div key={c} onClick={() => upd("coverColor",c)} style={{ width:34,height:34,borderRadius:8,background:c,border:`2px solid ${form.coverColor===c?"var(--accent)":"transparent"}`,cursor:"pointer" }} />)}
            </div>
          </div>
          <div className="field" style={{ marginBottom:0 }}>
            <label>Accent Color</label>
            <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
              {ACCENTS.map(c => <div key={c} onClick={() => upd("accentColor",c)} style={{ width:34,height:34,borderRadius:8,background:c,border:`2px solid ${form.accentColor===c?"var(--accent)":"transparent"}`,cursor:"pointer" }} />)}
            </div>
          </div>
        </div>

        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
          <div className="field" style={{ marginBottom:0 }}>
            <label>Date Formed</label>
            <input value={form.dateFormed} onChange={e => upd('dateFormed',e.target.value)} placeholder="e.g. 2018 or March 2019" />
          </div>
          <div className="field" style={{ marginBottom:0 }}>
            <label>Label</label>
            <input value={form.label} onChange={e => upd('label',e.target.value)} placeholder="e.g. Independent" />
          </div>
        </div>

        <div className="section-label"><span>👥</span> Band Members</div>
        {form.bandMembers.map((m,i) => (
          <div key={i} className="member-row">
            <input value={m.name} onChange={e => { const arr=[...form.bandMembers]; arr[i]={...arr[i],name:e.target.value}; upd('bandMembers',arr); }} placeholder="Name" />
            <input value={m.role} onChange={e => { const arr=[...form.bandMembers]; arr[i]={...arr[i],role:e.target.value}; upd('bandMembers',arr); }} placeholder="Role (e.g. Guitar)" />
            {form.bandMembers.length > 1 && <button className="icon-btn danger" onClick={() => upd('bandMembers', form.bandMembers.filter((_,j)=>j!==i))}>✕</button>}
          </div>
        ))}
        <button className="icon-btn" style={{width:'auto',padding:'0 14px',fontSize:13,display:'flex',alignItems:'center',gap:6,marginBottom:16}}
          onClick={() => upd('bandMembers',[...form.bandMembers,{name:'',role:''}])}>+ Add Member</button>

        <div className="section-label"><span>🎁</span> Fan Benefits</div>
        <div style={{fontSize:12,color:"var(--muted)",marginBottom:10}}>What do fans get? e.g. "Early access to new releases"</div>
        {form.fanBenefits.map((b,i) => (
          <div key={i} className="benefit-row">
            <input value={b} onChange={e => { const arr=[...form.fanBenefits]; arr[i]=e.target.value; upd('fanBenefits',arr); }} placeholder={`Benefit ${i+1}`} />
            {form.fanBenefits.length > 1 && <button className="icon-btn danger" onClick={() => upd('fanBenefits', form.fanBenefits.filter((_,j)=>j!==i))}>✕</button>}
          </div>
        ))}
        <button className="icon-btn" style={{width:'auto',padding:'0 14px',fontSize:13,display:'flex',alignItems:'center',gap:6,marginBottom:16}}
          onClick={() => upd('fanBenefits',[...form.fanBenefits,''])}>+ Add Benefit</button>

        <div className="section-label"><span>🔗</span> Streaming & Social Links</div>
        <div className="links-grid">
          {[
            {key:'spotify',label:'Spotify',icon:'🎵',placeholder:'open.spotify.com/...'},
            {key:'appleMusic',label:'Apple Music',icon:'🍎',placeholder:'music.apple.com/...'},
            {key:'youtube',label:'YouTube',icon:'▶️',placeholder:'youtube.com/...'},
            {key:'instagram',label:'Instagram',icon:'📸',placeholder:'instagram.com/...'},
            {key:'tiktok',label:'TikTok',icon:'🎶',placeholder:'tiktok.com/@...'},
            {key:'x',label:'X / Twitter',icon:'✖️',placeholder:'x.com/...'},
            {key:'soundcloud',label:'SoundCloud',icon:'☁️',placeholder:'soundcloud.com/...'},
            {key:'bandcamp',label:'Bandcamp',icon:'🏕️',placeholder:'bandcamp.com/...'},
          ].map(({key,label,icon,placeholder}) => (
            <div key={key} className="link-field">
              <label><span>{icon}</span>{label}</label>
              <input value={form.links[key]} onChange={e => upd('links',{...form.links,[key]:e.target.value})} placeholder={placeholder} style={{fontSize:12}} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 5: Price ─── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:16 }}>
        <SectionHeader emoji="💰" title="Set Your Price" subtitle="What fans pay each month to hold their number. You keep 88% of every dollar." />
        <div className="price-options">
          {[
            { val:3, label:"min" },
            { val:5, label:"popular" },
            { val:8, label:null },
            { val:10, label:null },
          ].map(p => (
            <div key={p.val} className={`price-opt ${form.price===p.val?"selected":""}`} onClick={() => upd("price",p.val)}>
              {p.label && <div className="price-opt-badge">{p.label}</div>}
              <div className="price-opt-val">${p.val}</div>
              <div className="price-opt-label">per mo</div>
            </div>
          ))}
        </div>
        <div className="field" style={{ marginBottom:8 }}>
          <label>Custom price</label>
          <input type="number" min={3} max={100} value={form.price}
            onChange={e => handlePriceChange(e.target.value)}
            onBlur={() => { if (form.price < 3) upd("price", 3); }}
            style={{ maxWidth:120 }} />
          <div className="field-hint">Minimum $3/month · Fans pay this + applicable tax</div>
        </div>
        <div style={{ background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:10,padding:"14px 16px",marginTop:12 }}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <span style={{ fontSize:13,color:"var(--muted)" }}>You earn per fan</span>
            <span style={{ fontFamily:"var(--font-mono)",fontSize:15,color:"var(--accent)",fontWeight:600 }}>${(form.price * 0.88).toFixed(2)}/mo</span>
          </div>
          <div className="split-bar">
            <div className="split-bar-artist" style={{ width:"88%" }} />
            <div className="split-bar-platform" style={{ width:"12%" }} />
          </div>
          <div className="split-labels">
            <span style={{ color:"var(--accent)" }}>${(form.price * 0.88).toFixed(2)} to you (88%)</span>
            <span style={{ color:"var(--muted)" }}>${(form.price * 0.12).toFixed(2)} platform (12%)</span>
          </div>
        </div>
        <div style={{ display:"flex",gap:24,padding:"12px 0",borderTop:"1px solid var(--border)",marginTop:16 }}>
          <div style={{ fontSize:13,color:"var(--muted)" }}>At 100 fans: <span style={{ color:"var(--text)",fontFamily:"var(--font-mono)" }}>${Math.round(form.price*100*0.88).toLocaleString()}/mo</span></div>
          <div style={{ fontSize:13,color:"var(--muted)" }}>At 500 fans: <span style={{ color:"var(--accent)",fontFamily:"var(--font-mono)",fontWeight:600 }}>${Math.round(form.price*500*0.88).toLocaleString()}/mo</span></div>
        </div>
      </div>

      {/* ── Section 6: Stripe ─── */}
      <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:16,padding:28,marginBottom:32 }}>
        <SectionHeader emoji="💳" title="Connect Stripe" subtitle="How you get paid. You can connect now or after launch." optional />
        <div className="stripe-box">
          {!form.stripeConnected ? (
            <>
              <div className="stripe-logo">STRIPE</div>
              <div className="stripe-desc">You'll be redirected to Stripe to set up a free account (or connect an existing one). Takes about 3 minutes.</div>
              <button className="btn btn-primary" style={{ background:"#635bff",marginBottom:12,width:"100%" }} onClick={() => upd("stripeConnected",true)}>Connect with Stripe →</button>
              <div style={{ fontSize:12,color:"var(--muted)",fontFamily:"var(--font-mono)" }}>Fans can see your page without Stripe, but can't claim a number until it's connected.</div>
            </>
          ) : (
            <div className="stripe-connected"><span style={{ fontSize:20 }}>✓</span> Stripe account connected</div>
          )}
        </div>
      </div>

      {/* ── Go Live Button ─── */}
      {!canGoLive && (
        <div style={{ background:"rgba(255,204,0,0.08)",border:"1px solid rgba(255,204,0,0.2)",borderRadius:10,padding:"12px 16px",fontSize:13,color:"var(--accent2)",marginBottom:16 }}>
          ⚠️ Add your artist name and bio to go live
        </div>
      )}
      {!form.stripeConnected && canGoLive && (
        <div style={{ background:"rgba(255,204,0,0.08)",border:"1px solid rgba(255,204,0,0.2)",borderRadius:10,padding:"12px 16px",fontSize:13,color:"var(--accent2)",marginBottom:16 }}>
          ⚠️ Stripe not connected — fans can see your page but can't claim a number yet
        </div>
      )}
      <button className="btn btn-primary"
        disabled={!canGoLive}
        style={{ width:"100%",fontSize:18,padding:"18px",opacity:canGoLive?1:0.4,cursor:canGoLive?"pointer":"not-allowed" }}
        onClick={() => { if(canGoLive){ onArtistCreated(form); setPage("artist-live"); } }}>
        Go Live 🚀
      </button>
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
                {artistForm.genres.length > 0 && <span style={{color:"var(--accent)"}}>{artistForm.genres.slice(0,2).join(" · ")} · </span>}
                {artistForm.vibes.slice(0,2).join(" · ")}{artistForm.city?` · ${artistForm.city}`:""}
              </div>
              <div style={{ fontSize:13,color:"var(--muted)",marginTop:2 }}>${artistForm.price}/mo + tax · 0 fans so far</div>
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
          <div className="dashboard-sub">Welcome back, {artist.name}</div>
        </div>
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
            <div className="metric-card"><div className="metric-val">${mockEarnings.toFixed(0)}</div><div className="metric-label">Monthly (88%)</div></div>
            <div className="metric-card"><div className="metric-val">{artist.posts.length}</div><div className="metric-label">Posts</div></div>
            <div className="metric-card"><div className="metric-val">${artist.price}/mo</div><div className="metric-label">Fan Price</div></div>
          </div>
          <div style={{ background:"var(--surface)",border:"1px solid var(--border)",borderRadius:10,padding:"16px 20px",marginBottom:24 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
              <div>
                <div style={{ fontWeight:600,marginBottom:4 }}>{artist.name}</div>
                <div style={{ fontSize:13,color:"var(--muted)" }}>{artist.genre} · ${artist.price}/mo · You keep ${(artist.price * 0.88).toFixed(2)}</div>
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
            <textarea value={postContent} onChange={e => setPostContent(e.target.value)} placeholder="Share something with your fans..." />
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
    setUserFans(prev => [...prev,{ artistId:artist.id, ogNumber:n, currentStanding:n, isOG:false, date:"Feb 2026" }]);
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

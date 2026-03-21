<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>IndianGovToday — Logo Kit</title>
<style>
  /* ── Reset ── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
--green-primary: #1D9E75;
--green-dark: #085041;
--green-deep: #071912;
--green-light: #E1F5EE;
--green-mid: #5DCAA5;
--cream: #F5F0E8;
--ink: #0D2B22;
--muted: #888780;
--white: #FFFFFF;

    /* Spin durations — change these to adjust speed globally */
    --spin-idle:   10s;
    --spin-hover:  2s;
    --spin-load:   1s;

}

body {
font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
background: #F0EDE6;
color: var(--ink);
padding: 2rem 1rem 4rem;
}

/_ ─────────────────────────────────────────
PAGE HEADER
───────────────────────────────────────── _/
.page-title {
font-size: clamp(13px, 2vw, 15px);
font-weight: 500;
letter-spacing: 0.12em;
text-transform: uppercase;
color: var(--muted);
margin-bottom: 0.4rem;
}
.page-sub {
font-size: clamp(11px, 1.5vw, 13px);
color: var(--muted);
margin-bottom: 3rem;
}

/_ ─────────────────────────────────────────
SECTION
───────────────────────────────────────── _/
.section { margin-bottom: 3rem; }
.section-label {
font-size: 10px;
font-weight: 600;
letter-spacing: 0.14em;
text-transform: uppercase;
color: var(--muted);
margin-bottom: 1rem;
padding-bottom: 6px;
border-bottom: 0.5px solid rgba(0,0,0,0.12);
}

/_ ─────────────────────────────────────────
LOGO CARDS GRID
───────────────────────────────────────── _/
.logo-grid {
display: grid;
gap: 12px;
grid-template-columns: repeat(3, 1fr);
}
@media (max-width: 768px) {
.logo-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
.logo-grid { grid-template-columns: 1fr; }
}

.logo-card {
border-radius: 14px;
overflow: hidden;
border: 0.5px solid rgba(0,0,0,0.1);
background: #fff;
}
.logo-card.featured {
border: 1.5px solid var(--green-primary);
}

.logo-preview {
display: flex;
align-items: center;
justify-content: center;
padding: 2rem 1.5rem;
min-height: 160px;
}
.logo-preview.on-cream { background: var(--cream); }
.logo-preview.on-dark { background: var(--green-deep); }
.logo-preview.on-white { background: #fff; }
.logo-preview.on-green { background: var(--green-primary); }

.logo-meta {
padding: 10px 14px 12px;
border-top: 0.5px solid rgba(0,0,0,0.08);
}
.logo-meta strong {
display: block;
font-size: 12px;
font-weight: 600;
color: var(--ink);
margin-bottom: 2px;
}
.logo-meta span {
font-size: 11px;
color: var(--muted);
line-height: 1.5;
}

/_ ─────────────────────────────────────────
SCALE ROW
───────────────────────────────────────── _/
.scale-row {
display: flex;
align-items: flex-end;
gap: clamp(12px, 3vw, 28px);
flex-wrap: wrap;
padding: 1.5rem;
background: #fff;
border-radius: 14px;
border: 0.5px solid rgba(0,0,0,0.1);
}
.scale-item {
display: flex;
flex-direction: column;
align-items: center;
gap: 8px;
}
.scale-item span {
font-size: 10px;
color: var(--muted);
letter-spacing: 0.05em;
}

/_ ─────────────────────────────────────────
NAVBAR DEMO
───────────────────────────────────────── _/
.navbar-demo {
background: var(--green-deep);
border-radius: 14px;
overflow: hidden;
border: 0.5px solid rgba(255,255,255,0.08);
margin-bottom: 12px;
}
.navbar {
display: flex;
align-items: center;
justify-content: space-between;
padding: 0 clamp(16px, 4vw, 32px);
height: clamp(54px, 7vw, 68px);
}
.nav-logo { display: flex; align-items: center; gap: clamp(10px, 2vw, 16px); }
.nav-wordmark { display: flex; flex-direction: column; gap: 1px; }
.nav-sup {
font-size: clamp(7px, 1vw, 9px);
letter-spacing: 0.2em;
color: var(--green-mid);
font-weight: 400;
text-transform: uppercase;
}
.nav-name {
font-size: clamp(14px, 2.2vw, 20px);
font-weight: 700;
color: var(--white);
letter-spacing: 0.02em;
line-height: 1;
}
.nav-links {
display: flex;
gap: clamp(16px, 3vw, 32px);
list-style: none;
}
.nav-links li a {
font-size: clamp(11px, 1.4vw, 13px);
color: rgba(255,255,255,0.55);
text-decoration: none;
letter-spacing: 0.03em;
transition: color 0.2s;
}
.nav-links li a:hover { color: var(--white); }
@media (max-width: 600px) {
.nav-links { display: none; }
}
.nav-cta {
padding: clamp(6px,1vw,8px) clamp(12px,2vw,20px);
background: var(--green-primary);
color: var(--white);
border: none;
border-radius: 20px;
font-size: clamp(11px, 1.4vw, 13px);
font-weight: 500;
cursor: pointer;
letter-spacing: 0.02em;
white-space: nowrap;
}

/_ ─────────────────────────────────────────
MOBILE HEADER DEMO
───────────────────────────────────────── _/
.mobile-frame {
width: min(320px, 100%);
margin: 0 auto;
border: 0.5px solid rgba(0,0,0,0.1);
border-radius: 24px;
overflow: hidden;
background: var(--cream);
box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.mobile-nav {
display: flex;
align-items: center;
justify-content: space-between;
padding: 14px 18px;
background: var(--green-deep);
}
.mobile-logo { display: flex; align-items: center; gap: 10px; }
.mobile-wordmark { display: flex; flex-direction: column; gap: 1px; }
.mobile-sup { font-size: 7px; letter-spacing: 0.18em; color: var(--green-mid); text-transform: uppercase; }
.mobile-name { font-size: 14px; font-weight: 700; color: var(--white); line-height: 1; }
.hamburger { display: flex; flex-direction: column; gap: 4px; padding: 4px; cursor: pointer; }
.hamburger span { display: block; width: 20px; height: 1.5px; background: rgba(255,255,255,0.7); border-radius: 1px; }
.mobile-hero {
padding: 24px 18px 18px;
background: var(--cream);
}
.mobile-search {
display: flex;
align-items: center;
gap: 8px;
padding: 10px 14px;
background: #fff;
border-radius: 24px;
border: 0.5px solid rgba(0,0,0,0.1);
margin-bottom: 14px;
}
.mobile-search input {
border: none;
outline: none;
background: transparent;
font-size: 12px;
color: var(--ink);
flex: 1;
}
.mobile-card {
background: #fff;
border-radius: 10px;
padding: 12px;
border: 0.5px solid rgba(0,0,0,0.08);
margin-bottom: 8px;
}
.mobile-badge {
display: inline-block;
font-size: 9px;
font-weight: 600;
padding: 2px 8px;
border-radius: 8px;
background: #C0DD97;
color: #173404;
margin-bottom: 6px;
}
.mobile-card-title { font-size: 12px; font-weight: 500; color: var(--ink); line-height: 1.4; }

/_ ─────────────────────────────────────────
LOADING STATE DEMO
───────────────────────────────────────── _/
.loading-demo {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 16px;
padding: 2.5rem;
background: var(--green-deep);
border-radius: 14px;
}
.loading-text {
font-size: 12px;
color: rgba(255,255,255,0.4);
letter-spacing: 0.06em;
animation: textBlink 1.5s ease-in-out infinite;
}

/_ ─────────────────────────────────────────
COLOUR PALETTE
───────────────────────────────────────── _/
.palette {
display: flex;
gap: 10px;
flex-wrap: wrap;
}
.swatch {
display: flex;
flex-direction: column;
align-items: center;
gap: 6px;
}
.swatch-dot {
width: clamp(36px, 6vw, 48px);
height: clamp(36px, 6vw, 48px);
border-radius: 50%;
}
.swatch-label { font-size: 10px; color: var(--muted); text-align: center; line-height: 1.4; }

/_ ─────────────────────────────────────────
KEYFRAMES
───────────────────────────────────────── _/
@keyframes spinIdle {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
@keyframes spinLoad {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
@keyframes textBlink {
0%, 100% { opacity: 0.35; }
50% { opacity: 1; }
}
@keyframes fadeIn {
from { opacity: 0; transform: scale(0.85); }
to { opacity: 1; transform: scale(1); }
}

/_ ─────────────────────────────────────────
RESPONSIVE CHAKRA SVG COMPONENT
Usage: <svg class="chakra-svg" …>
Size controlled by width/height attributes
or a wrapping CSS class.
───────────────────────────────────────── _/
.chakra-ring-group {
transform-origin: 50% 50%;
animation: spinIdle var(--spin-idle, 10s) linear infinite;
}
.chakra-ring-group.loading {
animation: spinLoad var(--spin-load, 1s) cubic-bezier(0.4,0,0.2,1) infinite;
}

/_ ── respect reduced motion ── _/
@media (prefers-reduced-motion: reduce) {
.chakra-ring-group,
.chakra-ring-group.loading { animation: none; }
}

/_ ─────────────────────────────────────────
COPY BOX
───────────────────────────────────────── _/
.copy-box {
background: #1a1a1a;
border-radius: 10px;
padding: 1rem 1.25rem;
overflow-x: auto;
}
.copy-box pre {
font-family: 'SFMono-Regular', Consolas, monospace;
font-size: clamp(10px, 1.5vw, 12px);
color: #a8e6cf;
line-height: 1.7;
white-space: pre;
}
.copy-btn {
display: inline-block;
margin-top: 10px;
padding: 6px 16px;
background: var(--green-primary);
color: #fff;
border: none;
border-radius: 20px;
font-size: 12px;
font-weight: 500;
cursor: pointer;
letter-spacing: 0.02em;
}
.copy-btn:active { opacity: 0.8; }
</style>

</head>
<body>

<p class="page-title">IndianGovToday — Logo Kit</p>
<p class="page-sub">Responsive animated Chakra logo · All breakpoints · SVG source included</p>

<!-- ═══════════════════════════════════════
     1. LIVE LOGO VARIANTS
════════════════════════════════════════ -->
<div class="section">
  <div class="section-label">1 · Logo variants</div>
  <div class="logo-grid">

    <!-- A: Primary — cream bg -->
    <div class="logo-card featured">
      <div class="logo-preview on-cream">
        <svg width="clamp(160px,22vw,220px)" viewBox="0 0 220 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IndianGovToday logo">
          <!-- Animated ring group -->
          <g class="chakra-ring-group" style="transform-origin:32px 32px;">
            <circle cx="32" cy="32" r="24" stroke="#1D9E75" stroke-width="1.4" fill="none"/>
            <!-- 8 spokes -->
            <line x1="32" y1="8"  x2="32" y2="56" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="8"  y1="32" x2="56" y2="32" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="15.0" y1="15.0" x2="49.0" y2="49.0" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="49.0" y1="15.0" x2="15.0" y2="49.0" stroke="#1D9E75" stroke-width="1.1"/>
            <!-- Tip dots -->
            <circle cx="32"  cy="8"    r="2.2" fill="#1D9E75"/>
            <circle cx="32"  cy="56"   r="2.2" fill="#1D9E75"/>
            <circle cx="8"   cy="32"   r="2.2" fill="#1D9E75"/>
            <circle cx="56"  cy="32"   r="2.2" fill="#1D9E75"/>
            <circle cx="15.0" cy="15.0" r="2.2" fill="#1D9E75"/>
            <circle cx="49.0" cy="49.0" r="2.2" fill="#1D9E75"/>
            <circle cx="49.0" cy="15.0" r="2.2" fill="#1D9E75"/>
            <circle cx="15.0" cy="49.0" r="2.2" fill="#1D9E75"/>
          </g>
          <!-- Static hub -->
          <circle cx="32" cy="32" r="5.5" fill="#1D9E75"/>
          <circle cx="32" cy="32" r="2.5" fill="#F5F0E8"/>
          <!-- Wordmark -->
          <text x="74" y="26" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="9" font-weight="500" fill="#888780" letter-spacing="3">INDIAN</text>
          <text x="72" y="46" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="20" font-weight="700" fill="#0D2B22" letter-spacing="0.4">GovToday</text>
          <line x1="72" y1="50" x2="216" y2="50" stroke="#1D9E75" stroke-width="1.2"/>
        </svg>
      </div>
      <div class="logo-meta">
        <strong>Primary — cream</strong>
        <span>Homepage hero, card headers, email</span>
      </div>
    </div>

    <!-- B: Dark bg -->
    <div class="logo-card">
      <div class="logo-preview on-dark">
        <svg width="clamp(140px,18vw,200px)" viewBox="0 0 200 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="chakra-ring-group" style="transform-origin:32px 32px;">
            <circle cx="32" cy="32" r="24" stroke="#1D9E75" stroke-width="1.4" fill="none"/>
            <line x1="32" y1="8"  x2="32" y2="56" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="8"  y1="32" x2="56" y2="32" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="15" y1="15" x2="49" y2="49" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="49" y1="15" x2="15" y2="49" stroke="#1D9E75" stroke-width="1.1"/>
            <circle cx="32" cy="8"  r="2.2" fill="#1D9E75"/>
            <circle cx="32" cy="56" r="2.2" fill="#1D9E75"/>
            <circle cx="8"  cy="32" r="2.2" fill="#1D9E75"/>
            <circle cx="56" cy="32" r="2.2" fill="#1D9E75"/>
            <circle cx="15" cy="15" r="2.2" fill="#1D9E75"/>
            <circle cx="49" cy="49" r="2.2" fill="#1D9E75"/>
            <circle cx="49" cy="15" r="2.2" fill="#1D9E75"/>
            <circle cx="15" cy="49" r="2.2" fill="#1D9E75"/>
          </g>
          <circle cx="32" cy="32" r="5.5" fill="#1D9E75"/>
          <circle cx="32" cy="32" r="2.5" fill="#071912"/>
          <text x="70" y="26" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="9" font-weight="500" fill="#5DCAA5" letter-spacing="3">INDIAN</text>
          <text x="68" y="46" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="20" font-weight="700" fill="#FFFFFF" letter-spacing="0.4">GovToday</text>
          <line x1="68" y1="50" x2="196" y2="50" stroke="#1D9E75" stroke-width="1.2"/>
        </svg>
      </div>
      <div class="logo-meta">
        <strong>Dark — navy</strong>
        <span>Navbar, splash, dark mode</span>
      </div>
    </div>

    <!-- C: White bg -->
    <div class="logo-card">
      <div class="logo-preview on-white">
        <svg width="clamp(140px,18vw,200px)" viewBox="0 0 200 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="chakra-ring-group" style="transform-origin:32px 32px;">
            <circle cx="32" cy="32" r="24" stroke="#1D9E75" stroke-width="1.4" fill="none"/>
            <line x1="32" y1="8"  x2="32" y2="56" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="8"  y1="32" x2="56" y2="32" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="15" y1="15" x2="49" y2="49" stroke="#1D9E75" stroke-width="1.1"/>
            <line x1="49" y1="15" x2="15" y2="49" stroke="#1D9E75" stroke-width="1.1"/>
            <circle cx="32" cy="8"  r="2.2" fill="#1D9E75"/>
            <circle cx="32" cy="56" r="2.2" fill="#1D9E75"/>
            <circle cx="8"  cy="32" r="2.2" fill="#1D9E75"/>
            <circle cx="56" cy="32" r="2.2" fill="#1D9E75"/>
            <circle cx="15" cy="15" r="2.2" fill="#1D9E75"/>
            <circle cx="49" cy="49" r="2.2" fill="#1D9E75"/>
            <circle cx="49" cy="15" r="2.2" fill="#1D9E75"/>
            <circle cx="15" cy="49" r="2.2" fill="#1D9E75"/>
          </g>
          <circle cx="32" cy="32" r="5.5" fill="#1D9E75"/>
          <circle cx="32" cy="32" r="2.5" fill="#FFFFFF"/>
          <text x="70" y="26" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="9" font-weight="500" fill="#888780" letter-spacing="3">INDIAN</text>
          <text x="68" y="46" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="20" font-weight="700" fill="#0D2B22" letter-spacing="0.4">GovToday</text>
          <line x1="68" y1="50" x2="196" y2="50" stroke="#1D9E75" stroke-width="1.2"/>
        </svg>
      </div>
      <div class="logo-meta">
        <strong>Light — white</strong>
        <span>Cards, modals, print</span>
      </div>
    </div>

    <!-- D: Mark only — green bg (app icon) -->
    <div class="logo-card">
      <div class="logo-preview on-green">
        <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="72" height="72" rx="16" fill="#1D9E75"/>
          <g class="chakra-ring-group" style="transform-origin:36px 36px;">
            <circle cx="36" cy="36" r="26" stroke="white" stroke-width="1.6" fill="none"/>
            <line x1="36" y1="10" x2="36" y2="62" stroke="white" stroke-width="1.3"/>
            <line x1="10" y1="36" x2="62" y2="36" stroke="white" stroke-width="1.3"/>
            <line x1="17.6" y1="17.6" x2="54.4" y2="54.4" stroke="white" stroke-width="1.3"/>
            <line x1="54.4" y1="17.6" x2="17.6" y2="54.4" stroke="white" stroke-width="1.3"/>
            <circle cx="36" cy="10"  r="2.5" fill="white"/>
            <circle cx="36" cy="62"  r="2.5" fill="white"/>
            <circle cx="10" cy="36"  r="2.5" fill="white"/>
            <circle cx="62" cy="36"  r="2.5" fill="white"/>
            <circle cx="17.6" cy="17.6" r="2.5" fill="white"/>
            <circle cx="54.4" cy="54.4" r="2.5" fill="white"/>
            <circle cx="54.4" cy="17.6" r="2.5" fill="white"/>
            <circle cx="17.6" cy="54.4" r="2.5" fill="white"/>
          </g>
          <circle cx="36" cy="36" r="7" fill="white"/>
          <circle cx="36" cy="36" r="3.5" fill="#1D9E75"/>
        </svg>
      </div>
      <div class="logo-meta">
        <strong>App icon</strong>
        <span>PWA, Android, iOS, Chrome tab</span>
      </div>
    </div>

    <!-- E: Monochrome / stamp -->
    <div class="logo-card">
      <div class="logo-preview on-cream">
        <svg width="clamp(140px,18vw,200px)" viewBox="0 0 200 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g class="chakra-ring-group" style="transform-origin:32px 32px;">
            <circle cx="32" cy="32" r="24" stroke="#0D2B22" stroke-width="1.4" fill="none"/>
            <line x1="32" y1="8"  x2="32" y2="56" stroke="#0D2B22" stroke-width="1.1"/>
            <line x1="8"  y1="32" x2="56" y2="32" stroke="#0D2B22" stroke-width="1.1"/>
            <line x1="15" y1="15" x2="49" y2="49" stroke="#0D2B22" stroke-width="1.1"/>
            <line x1="49" y1="15" x2="15" y2="49" stroke="#0D2B22" stroke-width="1.1"/>
            <circle cx="32" cy="8"  r="2.2" fill="#0D2B22"/>
            <circle cx="32" cy="56" r="2.2" fill="#0D2B22"/>
            <circle cx="8"  cy="32" r="2.2" fill="#0D2B22"/>
            <circle cx="56" cy="32" r="2.2" fill="#0D2B22"/>
            <circle cx="15" cy="15" r="2.2" fill="#0D2B22"/>
            <circle cx="49" cy="49" r="2.2" fill="#0D2B22"/>
            <circle cx="49" cy="15" r="2.2" fill="#0D2B22"/>
            <circle cx="15" cy="49" r="2.2" fill="#0D2B22"/>
          </g>
          <circle cx="32" cy="32" r="5.5" fill="#0D2B22"/>
          <circle cx="32" cy="32" r="2.5" fill="#F5F0E8"/>
          <text x="70" y="26" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="9" font-weight="500" fill="#888780" letter-spacing="3">INDIAN</text>
          <text x="68" y="46" font-family="-apple-system,'Helvetica Neue',sans-serif" font-size="20" font-weight="700" fill="#0D2B22" letter-spacing="0.4">GovToday</text>
          <line x1="68" y1="50" x2="196" y2="50" stroke="#0D2B22" stroke-width="1.2"/>
        </svg>
      </div>
      <div class="logo-meta">
        <strong>Monochrome</strong>
        <span>Print, PDF, letterhead, fax</span>
      </div>
    </div>

    <!-- F: Loading spinner -->
    <div class="logo-card">
      <div class="logo-preview on-dark">
        <div style="display:flex;flex-direction:column;align-items:center;gap:14px;">
          <svg width="52" height="52" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g class="chakra-ring-group loading" style="transform-origin:36px 36px;">
              <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="1.6" stroke-dasharray="5 3.5" fill="none"/>
              <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="1.3"/>
              <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.3"/>
              <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.3"/>
              <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.3"/>
              <circle cx="36"  cy="8"    r="2.5" fill="#1D9E75"/>
              <circle cx="36"  cy="64"   r="2.5" fill="#1D9E75"/>
              <circle cx="8"   cy="36"   r="2.5" fill="#1D9E75"/>
              <circle cx="64"  cy="36"   r="2.5" fill="#1D9E75"/>
              <circle cx="15.7" cy="15.7" r="2.5" fill="#1D9E75"/>
              <circle cx="56.3" cy="56.3" r="2.5" fill="#1D9E75"/>
              <circle cx="56.3" cy="15.7" r="2.5" fill="#1D9E75"/>
              <circle cx="15.7" cy="56.3" r="2.5" fill="#1D9E75"/>
            </g>
            <circle cx="36" cy="36" r="6.5" fill="#1D9E75"/>
            <circle cx="36" cy="36" r="3"   fill="#071912"/>
          </svg>
          <span class="loading-text">Fetching announcements…</span>
        </div>
      </div>
      <div class="logo-meta">
        <strong>Loading state</strong>
        <span>Dashed ring + fast spin while data loads</span>
      </div>
    </div>

  </div><!-- /logo-grid -->
</div>

<!-- ═══════════════════════════════════════
     2. NAVBAR DEMO
════════════════════════════════════════ -->
<div class="section">
  <div class="section-label">2 · Desktop navbar</div>
  <div class="navbar-demo">
    <nav class="navbar" role="navigation" aria-label="Main navigation">
      <div class="nav-logo">
        <svg width="36" height="36" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <g class="chakra-ring-group" style="transform-origin:36px 36px;">
            <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="1.6" fill="none"/>
            <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="1.2"/>
            <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.2"/>
            <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.2"/>
            <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.2"/>
            <circle cx="36"  cy="8"  r="2.5" fill="#1D9E75"/>
            <circle cx="36"  cy="64" r="2.5" fill="#1D9E75"/>
            <circle cx="8"   cy="36" r="2.5" fill="#1D9E75"/>
            <circle cx="64"  cy="36" r="2.5" fill="#1D9E75"/>
            <circle cx="15.7" cy="15.7" r="2.5" fill="#1D9E75"/>
            <circle cx="56.3" cy="56.3" r="2.5" fill="#1D9E75"/>
            <circle cx="56.3" cy="15.7" r="2.5" fill="#1D9E75"/>
            <circle cx="15.7" cy="56.3" r="2.5" fill="#1D9E75"/>
          </g>
          <circle cx="36" cy="36" r="6.5" fill="#1D9E75"/>
          <circle cx="36" cy="36" r="3"   fill="#071912"/>
        </svg>
        <div class="nav-wordmark">
          <span class="nav-sup">Indian</span>
          <span class="nav-name">GovToday</span>
        </div>
      </div>
      <ul class="nav-links">
        <li><a href="#">Announcements</a></li>
        <li><a href="#">Ministries</a></li>
        <li><a href="#">States</a></li>
        <li><a href="#">About</a></li>
      </ul>
      <button class="nav-cta">Subscribe</button>
    </nav>
  </div>
</div>

<!-- ═══════════════════════════════════════
     3. MOBILE DEMO
════════════════════════════════════════ -->
<div class="section">
  <div class="section-label">3 · Mobile view</div>
  <div class="mobile-frame">
    <div class="mobile-nav">
      <div class="mobile-logo">
        <svg width="28" height="28" viewBox="0 0 72 72" fill="none" aria-hidden="true">
          <g class="chakra-ring-group" style="transform-origin:36px 36px;">
            <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="2" fill="none"/>
            <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="1.5"/>
            <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.5"/>
            <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.5"/>
            <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.5"/>
            <circle cx="36"  cy="8"  r="3" fill="#1D9E75"/>
            <circle cx="36"  cy="64" r="3" fill="#1D9E75"/>
            <circle cx="8"   cy="36" r="3" fill="#1D9E75"/>
            <circle cx="64"  cy="36" r="3" fill="#1D9E75"/>
            <circle cx="15.7" cy="15.7" r="3" fill="#1D9E75"/>
            <circle cx="56.3" cy="56.3" r="3" fill="#1D9E75"/>
            <circle cx="56.3" cy="15.7" r="3" fill="#1D9E75"/>
            <circle cx="15.7" cy="56.3" r="3" fill="#1D9E75"/>
          </g>
          <circle cx="36" cy="36" r="7" fill="#1D9E75"/>
          <circle cx="36" cy="36" r="3.5" fill="#071912"/>
        </svg>
        <div class="mobile-wordmark">
          <span class="mobile-sup">Indian</span>
          <span class="mobile-name">GovToday</span>
        </div>
      </div>
      <div class="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </div>
    </div>
    <div class="mobile-hero">
      <div class="mobile-search">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="#888780" stroke-width="1.5">
          <circle cx="6.5" cy="6.5" r="4.5"/><path d="M10.5 10.5L14 14"/>
        </svg>
        <input placeholder="Search circulars…" readonly/>
      </div>
      <div class="mobile-card">
        <span class="mobile-badge">Finance</span>
        <p class="mobile-card-title">GST rates updated on 47 items — effective April 1</p>
      </div>
      <div class="mobile-card">
        <span class="mobile-badge" style="background:#9FE1CB;color:#04342C;">Health</span>
        <p class="mobile-card-title">New TB treatment: 4 months instead of 6</p>
      </div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════
     4. SIZE SCALE
════════════════════════════════════════ -->
<div class="section">
  <div class="section-label">4 · Mark at every size</div>
  <div class="scale-row">
    <!-- 80px -->
    <div class="scale-item">
      <svg width="80" height="80" viewBox="0 0 72 72" fill="none">
        <g class="chakra-ring-group" style="transform-origin:36px 36px;">
          <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="1.5" fill="none"/>
          <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="1.2"/>
          <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.2"/>
          <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.2"/>
          <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.2"/>
          <circle cx="36"  cy="8"  r="2.5" fill="#1D9E75"/>
          <circle cx="36"  cy="64" r="2.5" fill="#1D9E75"/>
          <circle cx="8"   cy="36" r="2.5" fill="#1D9E75"/>
          <circle cx="64"  cy="36" r="2.5" fill="#1D9E75"/>
          <circle cx="15.7" cy="15.7" r="2.5" fill="#1D9E75"/>
          <circle cx="56.3" cy="56.3" r="2.5" fill="#1D9E75"/>
          <circle cx="56.3" cy="15.7" r="2.5" fill="#1D9E75"/>
          <circle cx="15.7" cy="56.3" r="2.5" fill="#1D9E75"/>
        </g>
        <circle cx="36" cy="36" r="6.5" fill="#1D9E75"/>
        <circle cx="36" cy="36" r="3"   fill="#F5F0E8"/>
      </svg>
      <span>80px</span>
    </div>
    <!-- 48px -->
    <div class="scale-item">
      <svg width="48" height="48" viewBox="0 0 72 72" fill="none">
        <g class="chakra-ring-group" style="transform-origin:36px 36px;">
          <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="1.5" fill="none"/>
          <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="1.2"/>
          <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.2"/>
          <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.2"/>
          <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.2"/>
          <circle cx="36"  cy="8"  r="2.5" fill="#1D9E75"/>
          <circle cx="36"  cy="64" r="2.5" fill="#1D9E75"/>
          <circle cx="8"   cy="36" r="2.5" fill="#1D9E75"/>
          <circle cx="64"  cy="36" r="2.5" fill="#1D9E75"/>
          <circle cx="15.7" cy="15.7" r="2.5" fill="#1D9E75"/>
          <circle cx="56.3" cy="56.3" r="2.5" fill="#1D9E75"/>
          <circle cx="56.3" cy="15.7" r="2.5" fill="#1D9E75"/>
          <circle cx="15.7" cy="56.3" r="2.5" fill="#1D9E75"/>
        </g>
        <circle cx="36" cy="36" r="6.5" fill="#1D9E75"/>
        <circle cx="36" cy="36" r="3"   fill="#F5F0E8"/>
      </svg>
      <span>48px</span>
    </div>
    <!-- 32px -->
    <div class="scale-item">
      <svg width="32" height="32" viewBox="0 0 72 72" fill="none">
        <g class="chakra-ring-group" style="transform-origin:36px 36px;">
          <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="2" fill="none"/>
          <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="1.8"/>
          <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.8"/>
          <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.8"/>
          <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.8"/>
          <circle cx="36"  cy="8"  r="3" fill="#1D9E75"/>
          <circle cx="36"  cy="64" r="3" fill="#1D9E75"/>
          <circle cx="8"   cy="36" r="3" fill="#1D9E75"/>
          <circle cx="64"  cy="36" r="3" fill="#1D9E75"/>
          <circle cx="15.7" cy="15.7" r="3" fill="#1D9E75"/>
          <circle cx="56.3" cy="56.3" r="3" fill="#1D9E75"/>
          <circle cx="56.3" cy="15.7" r="3" fill="#1D9E75"/>
          <circle cx="15.7" cy="56.3" r="3" fill="#1D9E75"/>
        </g>
        <circle cx="36" cy="36" r="7" fill="#1D9E75"/>
        <circle cx="36" cy="36" r="3.5" fill="#F5F0E8"/>
      </svg>
      <span>32px</span>
    </div>
    <!-- 24px -->
    <div class="scale-item">
      <svg width="24" height="24" viewBox="0 0 72 72" fill="none">
        <g class="chakra-ring-group" style="transform-origin:36px 36px;">
          <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="2.5" fill="none"/>
          <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="2"/>
          <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="2"/>
          <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="2"/>
          <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="2"/>
          <circle cx="36"  cy="8"  r="4" fill="#1D9E75"/>
          <circle cx="36"  cy="64" r="4" fill="#1D9E75"/>
          <circle cx="8"   cy="36" r="4" fill="#1D9E75"/>
          <circle cx="64"  cy="36" r="4" fill="#1D9E75"/>
          <circle cx="15.7" cy="15.7" r="4" fill="#1D9E75"/>
          <circle cx="56.3" cy="56.3" r="4" fill="#1D9E75"/>
          <circle cx="56.3" cy="15.7" r="4" fill="#1D9E75"/>
          <circle cx="15.7" cy="56.3" r="4" fill="#1D9E75"/>
        </g>
        <circle cx="36" cy="36" r="8" fill="#1D9E75"/>
      </svg>
      <span>24px</span>
    </div>
    <!-- 16px favicon -->
    <div class="scale-item">
      <svg width="16" height="16" viewBox="0 0 72 72" fill="none">
        <g class="chakra-ring-group" style="transform-origin:36px 36px;">
          <circle cx="36" cy="36" r="28" stroke="#1D9E75" stroke-width="3" fill="none"/>
          <line x1="36" y1="8"  x2="36" y2="64" stroke="#1D9E75" stroke-width="2.5"/>
          <line x1="8"  y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="2.5"/>
          <line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="2.5"/>
          <line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="2.5"/>
          <circle cx="36" cy="36" r="10" fill="#1D9E75"/>
        </g>
      </svg>
      <span>16px</span>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════
     5. COLOUR PALETTE
════════════════════════════════════════ -->
<div class="section">
  <div class="section-label">5 · Brand palette</div>
  <div class="palette">
    <div class="swatch">
      <div class="swatch-dot" style="background:#1D9E75;"></div>
      <div class="swatch-label">#1D9E75<br>Primary</div>
    </div>
    <div class="swatch">
      <div class="swatch-dot" style="background:#085041;"></div>
      <div class="swatch-label">#085041<br>Dark green</div>
    </div>
    <div class="swatch">
      <div class="swatch-dot" style="background:#071912;"></div>
      <div class="swatch-label">#071912<br>Deep navy</div>
    </div>
    <div class="swatch">
      <div class="swatch-dot" style="background:#5DCAA5;"></div>
      <div class="swatch-label">#5DCAA5<br>Accent</div>
    </div>
    <div class="swatch">
      <div class="swatch-dot" style="background:#F5F0E8; border:0.5px solid #D3D1C7;"></div>
      <div class="swatch-label">#F5F0E8<br>Cream bg</div>
    </div>
    <div class="swatch">
      <div class="swatch-dot" style="background:#0D2B22;"></div>
      <div class="swatch-label">#0D2B22<br>Ink</div>
    </div>
    <div class="swatch">
      <div class="swatch-dot" style="background:#888780; "></div>
      <div class="swatch-label">#888780<br>Muted</div>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════
     6. COPY-PASTE SVG SOURCE
════════════════════════════════════════ -->
<div class="section">
  <div class="section-label">6 · Copy-paste SVG — drop into your &lt;head&gt; as a symbol or inline</div>
  <div class="copy-box">
    <pre id="svgSource">&lt;!-- IndianGovToday Chakra Logo — animated, responsive --&gt;
&lt;!-- Paste inline in your HTML. Adjust width/height to resize. --&gt;

&lt;style&gt;
:root {
--igt-spin-idle: 10s; /_ idle rotation speed _/
--igt-spin-load: 1s; /_ loading spin speed _/
}
.igt-spin {
transform-origin: 50% 50%;
animation: igtSpinIdle var(--igt-spin-idle) linear infinite;
}
.igt-spin.loading {
animation: igtSpinLoad var(--igt-spin-load)
cubic-bezier(0.4,0,0.2,1) infinite;
}
@keyframes igtSpinIdle {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
@keyframes igtSpinLoad {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
.igt-spin { animation: none; }
}
&lt;/style&gt;

&lt;!-- FULL LOGO (dark bg) — use in navbar --&gt;
&lt;svg width="200" height="64" viewBox="0 0 200 64"
fill="none" xmlns="http://www.w3.org/2000/svg"
role="img" aria-label="IndianGovToday"&gt;
&lt;g class="igt-spin" style="transform-origin:32px 32px;"&gt;
&lt;circle cx="32" cy="32" r="24"
stroke="#1D9E75" stroke-width="1.4" fill="none"/&gt;
&lt;line x1="32" y1="8" x2="32" y2="56"
stroke="#1D9E75" stroke-width="1.1"/&gt;
&lt;line x1="8" y1="32" x2="56" y2="32"
stroke="#1D9E75" stroke-width="1.1"/&gt;
&lt;line x1="15" y1="15" x2="49" y2="49"
stroke="#1D9E75" stroke-width="1.1"/&gt;
&lt;line x1="49" y1="15" x2="15" y2="49"
stroke="#1D9E75" stroke-width="1.1"/&gt;
&lt;circle cx="32" cy="8" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="32" cy="56" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="8" cy="32" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="56" cy="32" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="15" cy="15" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="49" cy="49" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="49" cy="15" r="2.2" fill="#1D9E75"/&gt;
&lt;circle cx="15" cy="49" r="2.2" fill="#1D9E75"/&gt;
&lt;/g&gt;
&lt;circle cx="32" cy="32" r="5.5" fill="#1D9E75"/&gt;
&lt;circle cx="32" cy="32" r="2.5" fill="#071912"/&gt;
&lt;text x="70" y="26"
font-family="-apple-system,'Helvetica Neue',sans-serif"
font-size="9" font-weight="500"
fill="#5DCAA5" letter-spacing="3"&gt;INDIAN&lt;/text&gt;
&lt;text x="68" y="46"
font-family="-apple-system,'Helvetica Neue',sans-serif"
font-size="20" font-weight="700"
fill="#FFFFFF" letter-spacing="0.4"&gt;GovToday&lt;/text&gt;
&lt;line x1="68" y1="50" x2="196" y2="50"
stroke="#1D9E75" stroke-width="1.2"/&gt;
&lt;/svg&gt;

&lt;!-- MARK ONLY (app icon / favicon) --&gt;
&lt;svg width="72" height="72" viewBox="0 0 72 72"
fill="none" xmlns="http://www.w3.org/2000/svg"
role="img" aria-label="IndianGovToday"&gt;
&lt;rect width="72" height="72" rx="16" fill="#1D9E75"/&gt;
&lt;g class="igt-spin" style="transform-origin:36px 36px;"&gt;
&lt;circle cx="36" cy="36" r="26"
stroke="white" stroke-width="1.6" fill="none"/&gt;
&lt;line x1="36" y1="10" x2="36" y2="62" stroke="white" stroke-width="1.3"/&gt;
&lt;line x1="10" y1="36" x2="62" y2="36" stroke="white" stroke-width="1.3"/&gt;
&lt;line x1="17.6" y1="17.6" x2="54.4" y2="54.4" stroke="white" stroke-width="1.3"/&gt;
&lt;line x1="54.4" y1="17.6" x2="17.6" y2="54.4" stroke="white" stroke-width="1.3"/&gt;
&lt;circle cx="36" cy="10" r="2.5" fill="white"/&gt;
&lt;circle cx="36" cy="62" r="2.5" fill="white"/&gt;
&lt;circle cx="10" cy="36" r="2.5" fill="white"/&gt;
&lt;circle cx="62" cy="36" r="2.5" fill="white"/&gt;
&lt;circle cx="17.6" cy="17.6" r="2.5" fill="white"/&gt;
&lt;circle cx="54.4" cy="54.4" r="2.5" fill="white"/&gt;
&lt;circle cx="54.4" cy="17.6" r="2.5" fill="white"/&gt;
&lt;circle cx="17.6" cy="54.4" r="2.5" fill="white"/&gt;
&lt;/g&gt;
&lt;circle cx="36" cy="36" r="7" fill="white"/&gt;
&lt;circle cx="36" cy="36" r="3.5" fill="#1D9E75"/&gt;
&lt;/svg&gt;

&lt;!-- LOADING SPINNER — add class="loading" to .igt-spin --&gt;
&lt;svg width="52" height="52" viewBox="0 0 72 72"
fill="none" xmlns="http://www.w3.org/2000/svg"
role="status" aria-label="Loading"&gt;
&lt;g class="igt-spin loading" style="transform-origin:36px 36px;"&gt;
&lt;circle cx="36" cy="36" r="28"
stroke="#1D9E75" stroke-width="1.6"
stroke-dasharray="5 3.5" fill="none"/&gt;
&lt;line x1="36" y1="8" x2="36" y2="64" stroke="#1D9E75" stroke-width="1.3"/&gt;
&lt;line x1="8" y1="36" x2="64" y2="36" stroke="#1D9E75" stroke-width="1.3"/&gt;
&lt;line x1="15.7" y1="15.7" x2="56.3" y2="56.3" stroke="#1D9E75" stroke-width="1.3"/&gt;
&lt;line x1="56.3" y1="15.7" x2="15.7" y2="56.3" stroke="#1D9E75" stroke-width="1.3"/&gt;
&lt;circle cx="36" cy="8" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="36" cy="64" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="8" cy="36" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="64" cy="36" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="15.7" cy="15.7" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="56.3" cy="56.3" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="56.3" cy="15.7" r="2.5" fill="#1D9E75"/&gt;
&lt;circle cx="15.7" cy="56.3" r="2.5" fill="#1D9E75"/&gt;
&lt;/g&gt;
&lt;circle cx="36" cy="36" r="6.5" fill="#1D9E75"/&gt;
&lt;circle cx="36" cy="36" r="3" fill="#071912"/&gt;
&lt;/svg&gt;</pre>
<button class="copy-btn" onclick="
      navigator.clipboard.writeText(document.getElementById('svgSource').innerText);
      this.textContent='Copied!';
      setTimeout(()=>this.textContent='Copy SVG code',2000);
    ">Copy SVG code</button>

  </div>
</div>

</body>
</html>

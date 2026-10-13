/* ================================================================
   Vedant Dhangar — Portfolio
   script.js
   ================================================================ */

/* ── Theme toggle ────────────────────────────────────────────────── */
const themeBtn = document.getElementById('themeToggle');
const root     = document.documentElement;

// Load saved theme (default: dark)
let theme = 'dark';
try { theme = localStorage.getItem('vd-theme') || 'dark'; } catch {}

function applyTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀' : '🌙';
  try { localStorage.setItem('vd-theme', t); } catch {}
}
applyTheme(theme);

themeBtn.addEventListener('click', () => {
  theme = theme === 'dark' ? 'light' : 'dark';
  applyTheme(theme);
});

/* ── Smooth scroll ───────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── Copy email ──────────────────────────────────────────────────── */
document.getElementById('copyEmail').addEventListener('click', function () {
  const email = document.getElementById('emailText').textContent;
  navigator.clipboard.writeText(email)
    .then(() => {
      this.textContent = 'Copied!';
      setTimeout(() => { this.textContent = 'Copy'; }, 1800);
    })
    .catch(() => {
      // Fallback: select the text
      const sel   = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('emailText'));
      sel.removeAllRanges();
      sel.addRange(range);
      this.textContent = 'Selected';
      setTimeout(() => { this.textContent = 'Copy'; }, 1800);
    });
});

/* ── Resume button ───────────────────────────────────────────────── */
// Replace '#' with your actual resume PDF URL, e.g.:
//   resumeBtn.href = 'https://yourdomain.com/resume.pdf';
document.getElementById('resumeBtn').addEventListener('click', e => {
  e.preventDefault();
  const btn = document.getElementById('resumeBtn');
  btn.textContent = 'Add your PDF link!';
  setTimeout(() => {
    btn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" stroke-width="2">
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/>
      </svg> Resume`;
  }, 2000);
});

/* ── Canvas project thumbnails ───────────────────────────────────── */
function drawThumb(id, palette, drawFn) {
  const canvas = document.getElementById(id);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, W, H);
  drawFn(ctx, W, H, palette);
}

const P1 = { bg: '#0f1420', a: '#4f9eff', b: '#a78bfa', c: '#1a2035' };
const P2 = { bg: '#0f1a1a', a: '#5ee6c8', b: '#4f9eff', c: '#0d2020' };
const P3 = { bg: '#1a0f20', a: '#a78bfa', b: '#ec5fa0', c: '#1d0f25' };
const P4 = { bg: '#0f1a10', a: '#6ee86e', b: '#4f9eff', c: '#0d1f0e' };

// Project 1 — App UI mockup
drawThumb('c1', P1, (ctx, W, H, p) => {
  // sidebar
  ctx.fillStyle = p.c;
  ctx.fillRect(0, 0, 160, H);
  const items = ['Dashboard', 'Projects', 'Messages', 'Settings'];
  items.forEach((text, i) => {
    ctx.fillStyle = i === 0 ? p.a : '#3a4a6a';
    ctx.fillRect(16, 24 + i * 44, 128, 32);
    ctx.fillStyle = i === 0 ? '#fff' : '#6b7080';
    ctx.font = '500 13px DM Sans, sans-serif';
    ctx.fillText(text, 30, 45 + i * 44);
  });
  // main header bars
  ctx.fillStyle = p.a; ctx.fillRect(180, 20, 200, 36);
  ctx.fillStyle = p.b; ctx.fillRect(395, 20, 140, 36);
  // content cards
  for (let col = 0; col < 3; col++) {
    const cx = 180 + col * 215, cy = 80, cw = 190, ch = 100;
    ctx.fillStyle = '#1c2235';
    ctx.beginPath(); ctx.roundRect(cx, cy, cw, ch, 8); ctx.fill();
    ctx.fillStyle = p.a;    ctx.fillRect(cx + 16, cy + 16, 80, 10);
    ctx.fillStyle = '#3a4a6a'; ctx.fillRect(cx + 16, cy + 36, 130, 7);
    ctx.fillStyle = '#3a4a6a'; ctx.fillRect(cx + 16, cy + 52, 100, 7);
  }
});

// Project 2 — Chart / data dashboard
drawThumb('c2', P2, (ctx, W, H, p) => {
  // horizontal grid lines
  ctx.strokeStyle = '#1c3030'; ctx.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = 24 + i * 54;
    ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(W - 20, y); ctx.stroke();
  }
  // bars
  const vals = [0.5, 0.82, 0.63, 0.91, 0.44, 0.73, 0.85];
  const bw = 68, gap = 24, base = 240;
  vals.forEach((v, i) => {
    const bh = v * 170;
    const x  = 60 + i * (bw + gap);
    const grad = ctx.createLinearGradient(x, base - bh, x, base);
    grad.addColorStop(0, p.a);
    grad.addColorStop(1, p.b + '44');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.roundRect(x, base - bh, bw, bh, [5, 5, 0, 0]); ctx.fill();
  });
  // line overlay
  ctx.strokeStyle = p.b; ctx.lineWidth = 2.5;
  ctx.beginPath();
  vals.forEach((v, i) => {
    const x = 60 + i * (bw + gap) + bw / 2;
    const y = base - v * 170;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
});

// Project 3 — Cards grid
drawThumb('c3', P3, (ctx, W, H, p) => {
  const cards = [
    [20, 20, 350, 110],
    [390, 20, 390, 110],
    [20, 148, 200, 140],
    [238, 148, 200, 140],
    [456, 148, 324, 140],
  ];
  cards.forEach(([x, y, w, h]) => {
    ctx.fillStyle = p.c;
    ctx.beginPath(); ctx.roundRect(x, y, w, h, 8); ctx.fill();
    ctx.fillStyle = p.a;      ctx.fillRect(x + 14, y + 14, w * 0.45, 9);
    ctx.fillStyle = '#3a3050'; ctx.fillRect(x + 14, y + 32, w * 0.70, 7);
    ctx.fillStyle = '#3a3050'; ctx.fillRect(x + 14, y + 47, w * 0.55, 7);
  });
});

// Project 4 — Landing page mockup
drawThumb('c4', P4, (ctx, W, H, p) => {
  // nav
  ctx.fillStyle = p.c; ctx.fillRect(0, 0, W, 42);
  ctx.fillStyle = p.a; ctx.fillRect(18, 13, 70, 16);
  [520, 600, 680].forEach(x => {
    ctx.fillStyle = '#2a4030'; ctx.fillRect(x, 14, 60, 14);
  });
  // hero text
  ctx.fillStyle = p.a;
  ctx.font = 'bold 40px Syne, sans-serif';
  ctx.fillText('Build.', 40, 120);
  ctx.fillStyle = p.b;
  ctx.fillText('Ship.', 40, 165);
  ctx.fillStyle = '#4a5060';
  ctx.font = '14px DM Sans, sans-serif';
  ctx.fillText('Full stack products, end to end.', 40, 195);
  // CTA button
  ctx.fillStyle = p.a; ctx.beginPath(); ctx.roundRect(40, 215, 140, 36, 6); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.font = '500 13px DM Sans, sans-serif';
  ctx.fillText('See My Work', 70, 239);
  // decorative radial glow
  const glow = ctx.createRadialGradient(680, 160, 0, 680, 160, 140);
  glow.addColorStop(0, p.a + '40'); glow.addColorStop(1, 'transparent');
  ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(680, 160, 140, 0, Math.PI * 2); ctx.fill();
});
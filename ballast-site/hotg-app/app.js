/* HOTG fan app. One page, hash routes, no build step.
   Today (feed) · Lockers (#/lockers, #/p/<slug>) · Shows (#/shows, #/s/<id>) · XP (#/xp)
   Data: data/app.json (build_data.py). Progress: localStorage 'hotg-app-v1' (this browser). */
(() => {
'use strict';
const INK = '#1A1716', RED = '#B3202E', PAPER = '#F2EBDD', BALL = '#B04B1C';
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = n => Math.round(n).toLocaleString('en-US');
const fmtV = n => n >= 1e6 ? (n / 1e6).toFixed(n >= 1e7 ? 0 : 1).replace(/\.0$/, '') + 'M' : n >= 1e3 ? Math.round(n / 1e3) + 'K' : String(n || 0);
const slugify = s => String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619); return h >>> 0 };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 };
const shuffle = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a };
const initials = n => String(n || '?').replace(/^the\s+/i, '').split(/[\s-]+/).filter(w => /^[A-Za-z0-9]/.test(w)).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const firstName = n => n.split(' ')[0];
const lastName = n => n.replace(/ (Jr\.|Sr\.|II|III)$/, '').split(' ').slice(-1)[0];
const thumb = id => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
const mmss = s => { s = Math.max(0, Math.round(s || 0)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') };
const ago = t => { const m = (Date.now() - new Date(t)) / 6e4; if (m < 60) return Math.max(1, Math.round(m)) + 'm ago'; const h = m / 60; if (h < 24) return Math.round(h) + 'h ago'; return h < 48 ? 'Yesterday' : Math.floor(h / 24) + 'd ago' };
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const ICON = {
  play: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5v13l11-6.5z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 1.5h3.6v13H3zM9.4 1.5H13v13H9.4z" fill="currentColor"/></svg>',
  save: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 1.5h9v13L8 11l-4.5 3.5z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
  back: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 2 4 8l6 6" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
  search: '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="m13 13 5.5 5.5" stroke="currentColor" stroke-width="2.8"/></svg>',
  today: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4.5" width="18" height="16" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M3 9.5h18M8 2v5M16 2v5" stroke="currentColor" stroke-width="2.4"/><rect x="7" y="13" width="4" height="4" fill="currentColor"/></svg>',
  lockers: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="2.5" width="8" height="19" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="13" y="2.5" width="8" height="19" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M5.5 6.5h3M5.5 9h3M15.5 6.5h3M15.5 9h3" stroke="currentColor" stroke-width="1.8"/><path d="M9 14v2M15 14v2" stroke="currentColor" stroke-width="2.4"/></svg>',
  shows: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="2" width="8" height="12" rx="4" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M4.5 11a7.5 7.5 0 0 0 15 0M12 18.5V22M8 22h8" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>',
  xp: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2" fill="currentColor"/><g fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 7.8C9.6 5.6 10.2 2.6 12 1.8c1.8.8 2.4 3.8 0 6M12 16.2c-2.4 2.2-1.8 5.2 0 6 1.8-.8 2.4-3.8 0-6M7.8 12c-2.2-2.4-5.2-1.8-6 0 .8 1.8 3.8 2.4 6 0M16.2 12c2.2-2.4 5.2-1.8 6 0-.8 1.8-3.8 2.4-6 0"/></g></svg>',
};

/* ---------- XP ladder (hotg/brand/showcase/xp/build_xp.py) ---------- */
const TIERS = [
  { k: 'red', mat: 'Red', lv: 'Rookie', a: 0, b: 2000, col: '#B3202E', pin: 'img/rw/hero-mat-met-red.webp' },
  { k: 'gold', mat: 'Gold', lv: 'Starter', a: 2000, b: 6000, col: '#C98A16', pin: 'img/rw/hero-mat-gold.webp' },
  { k: 'chrome', mat: 'Chrome', lv: 'All-Star', a: 6000, b: 14000, col: '#7D8590', pin: 'img/rw/hero-mat-chrome.webp' },
  { k: 'jade', mat: 'Jade', lv: 'Legend', a: 14000, b: 30000, col: '#2F7A5E', pin: 'img/rw/hero-mat-jade.webp' }];
const MAXX = 30000;
const REWARDS = [
  { xp: 1000, t: 'Your fan card', d: 'Printed, numbered and mailed to you', img: 'img/rw/live3-2x-card-front.webp', fit: 'contain' },
  { xp: 2000, t: 'Silicone keychains', d: 'The bloom in all four colours', img: 'img/rw/merch-goods-keys-moulded.webp' },
  { xp: 4000, t: 'History of the Game tee', d: 'Black tee, stacked four-bloom lockup', img: 'img/rw/merch-tees-tee-f-solid.webp' },
  { xp: 6000, t: 'Holo bloom card, slabbed', d: 'Graded and sealed, your name on the label', img: 'img/rw/relic-round2-card_1.webp' },
  { xp: 10000, t: 'Mesh shorts, your colourway', d: 'Plus double XP on trivia nights', img: 'img/rw/merch-mesh-solid-out-blue.webp' },
  { xp: 14000, t: 'Signed chenille patch', d: 'Sew it on a varsity jacket', img: 'img/rw/relic-r2-patch.webp', signed: 1 },
  { xp: 22000, t: 'HOTG ring', d: 'Gold, enamel bloom on the face', img: 'img/rw/relic-r2-ring.webp' },
  { xp: 30000, t: 'Signed framed jersey', d: 'And a Legend calls you live on the show', img: 'img/rw/relic-r2-jersey-signed.webp', signed: 1 }];
const RULES = [['Animated story watched', 50], ['Told story heard', 30], ['Who said it, right', 25], ['Follow a player', 20], ['Daily check-in', 15], ['Clip watched', 10], ['Line played', 5], ['Save anything', 2]];
const tierOf = x => { for (let t = 0; t < 4; t++) if (x < TIERS[t].b) return t; return 3 };
const nextReward = x => REWARDS.find(r => x < r.xp);
const ORD = [4, 5, 6, 7, 0, 1, 2, 3];   // bloom wedges clockwise from 12 o'clock

/* ---------- blooms (lib/x/bloom.js), rendered as self-contained SVG images ---------- */
const GRAD = '<defs>' +
  '<linearGradient id="t0" x1="120" y1="80" x2="520" y2="560" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#D23A45"/><stop offset=".55" stop-color="#B3202E"/><stop offset="1" stop-color="#7E1220"/></linearGradient>' +
  '<linearGradient id="t1" x1="60" y1="60" x2="580" y2="580" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7A4C0C"/><stop offset=".22" stop-color="#E2A632"/><stop offset=".36" stop-color="#FFF1B8"/><stop offset=".5" stop-color="#D6982A"/><stop offset=".72" stop-color="#8E5A10"/><stop offset=".86" stop-color="#F4C860"/><stop offset="1" stop-color="#6E440A"/></linearGradient>' +
  '<linearGradient id="t2" x1="80" y1="40" x2="560" y2="600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#F7F9FB"/><stop offset=".18" stop-color="#8C939C"/><stop offset=".32" stop-color="#E9EDF1"/><stop offset=".46" stop-color="#4E555E"/><stop offset=".58" stop-color="#FFFFFF"/><stop offset=".74" stop-color="#9AA2AC"/><stop offset=".88" stop-color="#DDE2E8"/><stop offset="1" stop-color="#5A616B"/></linearGradient>' +
  '<linearGradient id="t3" x1="80" y1="60" x2="560" y2="600" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7FC3A1"/><stop offset=".3" stop-color="#2C6B54"/><stop offset=".55" stop-color="#5FA585"/><stop offset=".8" stop-color="#1D4A3A"/><stop offset="1" stop-color="#3F8F6E"/></linearGradient></defs>';
const uriCache = new Map();
function bloomURI(o, ow = 2) {
  const key = JSON.stringify(o) + ow;
  if (uriCache.has(key)) return uriCache.get(key);
  let svg = window.bloom({ ...o, extra: GRAD }).replace('<svg ', '<svg width="524" height="524" ');
  svg = svg.replace(/stroke-width="6\.5" vector-effect/g, `stroke-width="${ow}" vector-effect`);
  const u = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  uriCache.set(key, u); return u;
}
const tfill = t => `url(#t${t})`;
function xpState(x) {
  x = Math.max(0, Math.min(MAXX, x)); const t = tierOf(x), T = TIERS[t], sp = (T.b - T.a) / 8;
  const done = x >= MAXX ? 8 : Math.min(8, Math.floor((x - T.a) / sp)), frac = x >= MAXX ? 0 : (x - T.a - done * sp) / sp;
  return { x, t, T, done, frac, p: x >= MAXX ? 1 : (x - T.a) / (T.b - T.a) };
}
function xpBloom(x, { bg = PAPER, out = '#BDB2A2', ow = 1.4 } = {}) {
  const s = xpState(x), petals = Array(8).fill(null);
  ORD.forEach((k, i) => { petals[k] = i < s.done ? tfill(s.t) : (s.t > 0 ? tfill(s.t - 1) : null) });
  return bloomURI({ petals, ball: BALL, bg, out }, ow);
}
function xpBloomPartial(x, { bg = PAPER } = {}) {
  const s = xpState(x); if (s.done >= 8) return null;
  const petals = Array(8).fill(null); petals[ORD[s.done]] = tfill(s.t);
  return { src: bloomURI({ petals, ball: BALL, bg, out: 'none' }, 0), r: (135 + 129 * s.frac) / 524 * 100 };
}
let BL = {};
function makeMarks() {
  BL.mark = bloomURI({ petals: Array(8).fill(RED), ball: BALL, bg: PAPER });
  BL.face = BL.mark;
  BL.mono = bloomURI({ petals: Array(8).fill(RED), ball: INK, bg: PAPER, solidBall: true });
  BL.ink = bloomURI({ petals: Array(8).fill(RED), ball: BALL, bg: INK });
}

/* ---------- state ---------- */
const KEY = 'hotg-app-v1';
const S = (() => { let s = {}; try { s = JSON.parse(localStorage.getItem(KEY)) || {} } catch (e) { s = {} }
  s.xp = +s.xp || 0; for (const k of ['done', 'follow', 'saved', 'pe', 'who']) s[k] = s[k] && typeof s[k] === 'object' ? s[k] : {};
  s.log = Array.isArray(s.log) ? s.log : []; s.days = Array.isArray(s.days) ? s.days : []; return s })();
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)) } catch (e) { /* private mode: progress lives for this visit */ } };
function earn(key, n, label, players = [], detail = '') {
  if (!key || S.done[key]) return false;
  S.done[key] = Date.now(); const before = S.xp; S.xp = Math.min(MAXX + 50000, S.xp + n);
  S.log.unshift({ k: key, n, l: label, d: detail, t: Date.now() }); S.log.length = Math.min(S.log.length, 300);
  for (const p of players) if (P[p]) (S.pe[p] ||= {})[key] = 1;
  save(); toast(n, label, before); paintXP(); paintPlayerBlooms(players);
  return true;
}

/* ---------- data ---------- */
let D, P = {}, SHOWS = [], SH = {}, DROPS = [], DROP = {}, ANIM = [], LINES = [], TOLD = [], SLUGS = [];
const showName = id => SH[id] ? SH[id].name : (id || '').replace(/-/g, ' ');
const plName = k => P[k] ? P[k].name : k;
function prep() {
  P = D.players; SHOWS = D.shows; DROPS = D.drops; ANIM = D.anim || [];
  for (const s of SHOWS) SH[s.id] = s;
  for (const d of DROPS) DROP[d.id] = d;
  const rich = k => { const p = P[k]; return (p.img ? 1000 : 0) + p.stories.length * 8 + p.lines.length * 4 + p.drops.length * 2 + p.clips.length };
  SLUGS = Object.keys(P).sort((a, b) => (b === 'baron-davis') - (a === 'baron-davis') || rich(b) - rich(a));
  for (const k of SLUGS) {
    P[k].lines.forEach((l, i) => LINES.push({ k, i, ...l }));
    P[k].stories.forEach((s, i) => TOLD.push({ k, i, ...s, key: 'told:' + k + ':' + slugify(s.title) }));
  }
  // who appears in whose stories
  const terms = k => { const n = P[k].name, t = [n]; const ln = lastName(n);
    if (!['Green', 'Smith', 'Williams', 'Johnson', 'Young', 'Thomas', 'White', 'Allen', 'James', 'Miles', 'Rivers', 'Scott', 'Hart', 'Gay', 'Bell', 'Davis', 'Jackson', 'Carter', 'Wade', 'Pierce', 'George'].includes(ln)) t.push(ln);
    return t.concat({ 'tracy-mcgrady': ['T-Mac'], 'kevin-garnett': ['KG'], 'stephen-jackson': ['Jack', 'Stak'], 'jason-richardson': ['J-Rich'], 'shaquille-o-neal': ['Shaq'], 'baron-davis': ['Baron'], 'dwyane-wade': ['D-Wade'], 'kevin-durant': ['KD'], 'paul-pierce': ['Paul Pierce'], 'lebron-james': ['LeBron'] }[k] || []) };
  const T = Object.fromEntries(SLUGS.map(k => [k, terms(k).map(x => new RegExp('(?<![A-Za-z])' + x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?![A-Za-z])'))]));
  for (const k of SLUGS) { P[k].mentions = new Set(); P[k].about = [] }
  for (const s of TOLD) {
    const text = [s.title, ...s.beats, s.quote].join(' ');
    for (const k of SLUGS) if (k !== s.k && T[k].some(r => r.test(text))) { P[s.k].mentions.add(k); P[k].about.push(s) }
  }
}

/* ---------- time (Eastern), schedules from each show's own release history ---------- */
const etOff = d => { const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', timeZoneName: 'shortOffset' }).formatToParts(d).find(x => x.type === 'timeZoneName').value; const m = p.match(/GMT([+-]\d+)/); return m ? +m[1] : -5 };
const etParts = d => { const f = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short' }).formatToParts(d); const g = t => f.find(x => x.type === t).value; return { y: +g('year'), m: +g('month'), d: +g('day'), wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')) } };
const etAt = (y, m, d, h, mi) => { const guess = new Date(Date.UTC(y, m - 1, d, h, mi)); return new Date(guess - etOff(guess) * 36e5) };
const etDay = (d = new Date()) => { const p = etParts(d); return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}` };
const PYDAY = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
function nextDrop(s, now = new Date()) {
  const c = s.sched; if (!c || s.status !== 'active') return null;
  if (c.days) {
    const js = c.days.map(w => (w + 1) % 7);
    for (let i = 0; i < 9; i++) { const p = etParts(new Date(+now + i * 864e5)); if (!js.includes(p.wd)) continue;
      const t = etAt(p.y, p.m, p.d, c.h, c.m); if (t > now) return t }
  } else if (c.every) { let t = new Date(c.last); const step = c.every * 864e5; if (isNaN(t)) return null; while (t <= now) t = new Date(+t + step); return t }
  return null;
}
const hm = c => { const h = c.h % 12 || 12; return `${h}${c.m ? ':' + String(c.m).padStart(2, '0') : ''} ${c.h < 12 ? 'AM' : 'PM'} ET` };
const andList = a => a.length < 2 ? a.join('') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1];
function ruleText(s) {
  const c = s.sched; if (s.status === 'hiatus') return 'On a break';
  if (s.status === 'development') return 'In development';
  if (!c) return 'Drops when it drops';
  if (c.days) return c.days.length >= 6 ? `Almost daily, around ${hm(c)}` : `${andList(c.days.map(w => PYDAY[w]))}, around ${hm(c)}`;
  return `About every ${Math.round(c.every)} days, around ${hm(c)}`;
}
function droppingToday() {
  const now = new Date(), p = etParts(now), start = etAt(p.y, p.m, p.d, 0, 0), end = new Date(+start + 864e5);
  const out = [];
  for (const s of SHOWS) {
    const t = nextDrop(s, new Date(+start - 1000)); if (!t || t >= end) continue;
    const dropped = DROPS.find(d => d.show === s.id && new Date(d.t) >= start);
    out.push({ s, t, out: t <= now || !!dropped, drop: dropped });
  }
  return out.sort((a, b) => (a.s.kind !== 'players') - (b.s.kind !== 'players') || a.t - b.t);
}
function cdText(ms, long) {
  if (ms <= 0) return long ? 'Due now' : 'Due';
  const d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4), s = Math.floor(ms % 6e4 / 1e3);
  if (d) return `${d}d ${h}h ${String(m).padStart(2, '0')}m`;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
function tick() { $$('[data-to]').forEach(el => { const t = cdText(+el.dataset.to - Date.now(), el.dataset.long); if (el.textContent !== t) el.textContent = t }) }
setInterval(tick, 1000);

/* ---------- faces: the single place a player's picture is drawn (illustrated faces swap in here) ---------- */
const INKF = new Set(["andre-iguodala","austin-rivers","baron-davis","blake-griffin","cam-johnson","carmelo-anthony","chandler-parsons","channing-frye","charles-barkley","charlie-villanueva","danny-green","darius-miles","demarcus-cousins","deron-williams","derrick-white","draymond-green","dwight-howard","dwyane-wade","evan-turner","fred-vanvleet","gilbert-arenas","iman-shumpert","isaiah-thomas","j-r-smith","jalen-brunson","jason-williams","jeff-teague","josh-hart","kendrick-perkins","kevin-durant","kevin-garnett","kyle-kuzma","lebron-james","lou-williams","matt-barnes","michael-porter-jr","nick-young","patrick-beverley","paul-george","paul-pierce","raymond-felton","richard-jefferson","rudy-gay","shaquille-o-neal","steve-nash","thanasis-antetokounmpo","theo-pinson","tony-allen","tracy-mcgrady","trae-young","vince-carter","zach-randolph"]);   // ink portraits drawn for the lockers (img/f/<slug>.jpg)
function face(k, size = 'md', extra = '') {
  const p = P[k], n = p ? p.name : k;
  if (INKF.has(k)) return `<span class="face ink ${size} ${extra}" role="img" aria-label="${esc(n)}"><img class="fx" src="img/f/${esc(k)}.jpg" alt="" loading="lazy" decoding="async"></span>`;
  const inner = p && p.img ? `<img class="fi" src="${esc(p.img)}" alt="" loading="lazy" decoding="async">` : `<span class="fm">${esc(initials(n))}</span>`;
  return `<span class="face ${size} ${extra}" role="img" aria-label="${esc(n)}"><img class="fb" src="${p && p.img ? BL.face : BL.mono}" alt="">${inner}</span>`;
}
const showPic = (s, cls = 'av') => { const u = s && (s.art || s.avatar), alt = s && s.art && s.avatar ? s.avatar : '';
  return u ? `<img class="${cls}" src="${esc(u)}" alt="" loading="lazy" data-fb="${esc(initials(s.name))}"${alt ? ` data-alt="${esc(alt)}"` : ''}>` : s && s.kind === 'original' ? `<img class="${cls}" src="${BL.ink}" alt="" style="background:var(--ink)">` : `<span class="${cls} mono">${esc(initials(s ? s.name : '?'))}</span>` };
document.addEventListener('error', e => { const t = e.target; if (t.tagName !== 'IMG') return;
  if (t.dataset.alt) { const a = t.dataset.alt; delete t.dataset.alt; t.src = a; return }
  if (t.dataset.fb != null) { const sp = document.createElement('span'); sp.className = t.className + ' mono'; sp.textContent = t.dataset.fb; t.replaceWith(sp) }
  else if (t.closest('.th,.tile,.an-p,.rw')) t.style.visibility = 'hidden';
}, true);
const chip = k => `<a class="pc" href="#/p/${esc(k)}">${face(k, 'xs')}<span>${esc(P[k] ? P[k].name : k)}</span></a>`;
const chipsFor = (ks, max = 4) => { ks = (ks || []).filter(k => P[k]); if (!ks.length) return '';
  return `<div class="pcs">${ks.slice(0, max).map(chip).join('')}${ks.length > max ? `<span class="pc n">+${ks.length - max}</span>` : ''}</div>` };

/* ---------- small parts ---------- */
const saveBtn = (key, type, ref) => { const on = !!S.saved[key];
  return `<button type="button" class="sv${on ? ' on' : ''}" data-save="${esc(key)}" data-type="${type}" data-ref="${esc(ref)}" aria-pressed="${on}">${ICON.save}<span>${on ? 'Saved' : 'Save'}</span></button>` };
const followBtn = (k, cls = 'btn red') => { const on = !!S.follow[k];
  return `<button type="button" class="${cls}${on ? ' on' : ''}" data-follow="${esc(k)}" aria-pressed="${on}">${on ? 'Following' : S.done['follow:' + k] ? 'Follow' : 'Follow <small>+20 XP</small>'}</button>` };
function bars(seed, n = 34) { const r = rng(hash(seed)); let h = '';
  for (let i = 0; i < n; i++) { const env = Math.sin(Math.PI * (i + .5) / n) * .5 + .5; h += `<i style="--h:${Math.round(18 + 82 * env * (.35 + .65 * r()))}%;--d:${(r() * -.5).toFixed(2)}s"></i>` } return h }
function aud(o) {
  const done = o.key && S.done[o.key], b = bars(o.src);
  return `<div class="aud" data-src="${esc(o.src)}" data-key="${esc(o.key || '')}" data-xp="${o.xp || 0}" data-label="${esc(o.label || '')}" data-pl="${esc((o.pl || []).join(','))}" data-kind="${o.kind}" data-d="${esc(o.detail || '')}">
  <button type="button" class="pb" aria-label="Play">${ICON.play.replace('<svg', '<svg class="pl"')}${ICON.pause.replace('<svg', '<svg class="pa"')}</button>
  <div class="wave">${b}<div class="w2">${b}</div></div><span class="at${!done && o.xp ? ' x' : ''}">${!done && o.xp ? '+' + o.xp + ' XP' : o.dur ? mmss(o.dur) : 'Play'}</span></div>`;
}
const ytBtn = (label, id, start, end, title, pl, tall) => `<button type="button" class="lnk" data-yt="${esc(id)}" data-start="${start != null ? Math.floor(start) : ''}" data-end="${end || ''}" data-title="${esc(title || '')}" data-pl="${esc((pl || []).join(','))}"${tall ? ' data-tall="1"' : ''}>${esc(label)}</button>`;
const shortEra = e => (e || '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+/g, ' ').trim();

/* drop cards */
function dropCard(d) {
  const s = SH[d.show];
  const head = `<div class="dh">${showPic(s)}<div><a class="sn" href="#/s/${esc(d.show)}">${esc(trunc(showName(d.show), 24))}</a><span>${ago(d.t)}${d.views ? ' · ' + fmtV(d.views) + ' views' : ''}</span></div><span class="tg ${d.short ? 'clip' : 'ep'}">${d.short ? 'Clip' : 'Episode'}</span></div>`;
  const th = `<button type="button" class="th${d.short ? '' : ' w'}" data-drop="${esc(d.id)}" aria-label="Play: ${esc(d.title)}"><img src="${thumb(d.id)}" alt="" loading="lazy"><span class="pls">${ICON.play}</span></button>`;
  const acts = `<div class="acts">${saveBtn('drop:' + d.id, 'drop', d.id)}<span class="sp"></span><span class="k mute">${S.done['watch:' + d.id] ? 'Watched' : '+10 XP'}</span></div>`;
  if (d.short) return `<article class="card drop cl">${head}${th}<div><h3>${esc(d.title)}</h3>${chipsFor(d.p, 3)}${acts}</div></article>`;
  return `<article class="card drop">${head}${th}<h3>${esc(d.title)}</h3>${chipsFor(d.p)}${acts}</article>`;
}
const trunc = (t, n) => { t = String(t || ''); if (t.length <= n) return t; const c = t.slice(0, n); return c.slice(0, c.lastIndexOf(' ') > n * .6 ? c.lastIndexOf(' ') : n).replace(/[\s,.;:–-]+$/, '') + '…' };
const tile = (d, sub) => `<button type="button" class="tile" data-drop="${esc(d.id)}"><img src="${thumb(d.id)}" alt="" loading="lazy">${d.views ? `<span class="vw">${fmtV(d.views)}</span>` : ''}<span class="tt">${esc(trunc(d.title, 58))}</span><span class="ts">${esc(sub || showName(d.show) + ' · ' + ago(d.t))}</span></button>`;
const clipTile = (c, k) => `<button type="button" class="tile" data-yt="${esc(c.id)}" data-tall="1" data-title="${esc(c.title)}" data-pl="${esc(k)}"${c.start ? ` data-start="${c.start}"` : ''}><img src="${thumb(c.id)}" alt="" loading="lazy">${c.views ? `<span class="vw">${fmtV(c.views)}</span>` : ''}<span class="tt">${esc(trunc(c.title, 58))}</span><span class="ts">${esc(showName(c.show))}</span></button>`;
const rail = (title, items, more) => `<section class="rail"><div class="sech"><h2>${esc(title)}</h2>${more || ''}</div><div class="rs">${items.join('')}</div></section>`;

function saidCard(l) {
  const p = P[l.k];
  return `<article class="card said"><span class="tab">Said</span>
  <div class="sa-h"><a href="#/p/${esc(l.k)}">${face(l.k, 'md')}</a><div><a class="sa-n" href="#/p/${esc(l.k)}">${esc(p.name)}</a><span class="sa-s">${esc(showName(l.show))}</span></div></div>
  <blockquote class="sa-q">“${esc(l.line)}”</blockquote>
  ${aud({ src: l.v, key: 'line:' + l.v, xp: 5, label: 'Line played', pl: [l.k], kind: 'line', detail: p.name })}
  ${l.tags && l.tags.length ? `<div class="tags">${l.tags.slice(0, 4).map(t => `<span>${esc(t)}</span>`).join('')}</div>` : ''}
  <div class="acts">${l.yt ? ytBtn('Hear it in context', l.yt, l.start, null, l.line, [l.k]) : ''}<span class="sp"></span>${saveBtn('line:' + l.v, 'line', l.k + '|' + l.i)}</div></article>`;
}
function toldCard(s) {
  const p = P[s.k];
  return `<article class="card told"><span class="tab">Told</span>
  <div class="k">${esc(p.name)}${s.era ? ' · ' + esc(shortEra(s.era)) : ''}</div><h3>${esc(s.title)}</h3>
  <ol class="beats">${s.beats.slice(0, 3).map(b => `<li>${esc(b)}</li>`).join('')}</ol>
  ${s.quote ? `<blockquote>“${esc(s.quote)}”</blockquote>` : ''}
  ${s.audio ? aud({ src: s.audio, key: s.key, xp: 30, label: 'Told story heard', pl: [s.k, ...P[s.k].mentions].slice(0, 1), kind: 'told', detail: s.title }) : ''}
  <div class="acts"><a class="whoby" href="#/p/${esc(s.k)}">${face(s.k, 'xs')}${esc(p.name)}</a>${s.yt ? ytBtn('Watch him tell it', s.yt, s.start, s.end, s.title, [s.k]) : ''}<span class="sp"></span>${saveBtn(s.key, 'story', s.k + '|' + s.i)}</div></article>`;
}
function toldRow(s, showWho) {
  const p = P[s.k];
  return `<article class="trow"><div class="k">${showWho ? esc(p.name) + ' · ' : ''}${esc(shortEra(s.era) || 'Told on ' + showName(p.shows[0]))}</div><h3>${esc(s.title)}</h3>
  ${s.audio ? aud({ src: s.audio, key: s.key, xp: 30, label: 'Told story heard', pl: [s.k], kind: 'told', detail: s.title }) : ''}
  <details><summary>How it goes</summary><ol class="beats">${s.beats.map(b => `<li>${esc(b)}</li>`).join('')}</ol></details>
  <div class="acts">${showWho ? `<a class="whoby" href="#/p/${esc(s.k)}">${face(s.k, 'xs')}${esc(p.name)}</a>` : ''}${s.yt ? ytBtn('Watch him tell it', s.yt, s.start, s.end, s.title, [s.k]) : ''}<span class="sp"></span>${saveBtn(s.key, 'story', s.k + '|' + s.i)}</div></article>`;
}
function lineRow(l) {
  return `<div class="ln"><q>${esc(l.line)}</q>${aud({ src: l.v, key: 'line:' + l.v, xp: 5, label: 'Line played', pl: [l.k], kind: 'line', detail: plName(l.k) })}
  <div class="acts">${l.yt ? ytBtn('In context', l.yt, l.start, null, l.line, [l.k]) : ''}<span class="k mute">${esc(showName(l.show))}</span><span class="sp"></span>${saveBtn('line:' + l.v, 'line', l.k + '|' + l.i)}</div></div>`;
}

/* who said it */
const WHOPOOL = () => LINES.filter(l => P[l.k].img && l.line.length > 24 && l.line.length < 150);
function whoCard(l, r) {
  const faces = SLUGS.filter(k => k !== l.k && P[k].img && P[k].lines.length);
  const opts = shuffle([l.k, ...shuffle(faces, r).slice(0, 2)], r);
  const st = S.who[l.v];
  const res = st ? (st.ok ? `Right. <em>${esc(P[l.k].name)}</em>.` : `It was <em>${esc(P[l.k].name)}</em>.`) : 'Get it right for +25 XP.';
  return `<article class="card who" data-v="${esc(l.v)}" data-k="${esc(l.k)}"><span class="tab">Who said it?</span>
  <h3>Play it. Pick the voice.</h3><p class="sub">One line, three players. Trust your ears.</p>
  ${aud({ src: l.v, key: '', xp: 0, kind: 'who' })}
  <div class="opts">${opts.map(o => `<button type="button" class="opt${st ? (o === l.k ? ' right' : o === st.pick ? ' wrong' : ' dim') : ''}" data-pick="${esc(o)}">${face(o, 'lg')}<span>${esc(P[o].name)}</span></button>`).join('')}</div>
  <p class="wres">${res}</p><blockquote class="wq"${st ? '' : ' hidden'}>“${esc(l.line)}”${st ? ` <a class="lnk" href="#/p/${esc(l.k)}">His locker</a>` : ''}</blockquote></article>`;
}
function followCard() {
  const pick = SLUGS.filter(k => P[k].img).slice(0, 6);
  return `<article class="card fol"><span class="tab">Lockers</span><h3>Pick your players</h3><p>Follow them and My players fills with their drops, lines and stories.</p>
  <div class="fgrid">${pick.map(k => `<div><a href="#/p/${esc(k)}">${face(k, 'lg')}<b>${esc(P[k].name)}</b></a>${followBtn(k, 'fbtn')}</div>`).join('')}</div>
  <div class="acts"><a class="lnk" href="#/lockers">All ${SLUGS.length} lockers</a></div></article>`;
}

/* animated story */
function animCard(a) {
  if (!a) return '';
  const p = P[a.player], miss = !a.ok;
  const art = a.posterOk ? `<img src="${esc(a.poster)}" alt="">` : `<img src="${BL.ink}" alt="" style="object-fit:contain;padding:18%">`;
  return `<article class="card anim"><button type="button" class="an-p" data-anim="${esc(a.id)}" ${miss ? 'disabled' : ''} aria-label="Watch ${esc(a.title)}">${art}
   ${miss ? `<span class="soon"><img src="${BL.ink}" alt=""><b>New episode coming</b></span>` : `<span class="plbig">${ICON.play}</span><span class="an-d">${mmss(a.dur)}</span>`}</button>
  <div class="an-t"><span class="tab">Animated</span><div class="k">${esc(p ? p.name : '')} · ${esc(a.show)}</div><h2>${esc(a.title)}</h2><p>${esc(a.place)}</p>${a.teaser ? `<p class="tz"><em>How he tells it</em>${esc(a.teaser)}</p>` : ''}
   <div class="acts">${miss ? '<button type="button" class="btn on" disabled>Redrawing now</button>' : `<button type="button" class="btn${S.done['anim:' + a.id] ? ' on' : ''}" data-anim="${esc(a.id)}">${S.done['anim:' + a.id] ? 'Watch again' : 'Watch <small>+50 XP</small>'}</button>`}</div></div></article>`;
}

/* ---------- lazy lists ---------- */
let IO = null;
function lazyList(el, makePage) {
  if (IO) IO.disconnect();
  let page = 0, busy = false;
  const sent = document.createElement('div'); sent.style.height = '1px';
  const more = () => { if (busy) return; busy = true; const h = makePage(page++); if (!h) { IO && IO.disconnect(); sent.remove(); return }
    sent.insertAdjacentHTML('beforebegin', h); busy = false };
  el.append(sent); more();
  IO = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { more(); more() } }, { rootMargin: '900px 0px' });
  IO.observe(sent);
}

/* ---------- views ---------- */
const main = () => $('#main');
let FEED = 'all';
const FILTERS = [['all', 'All'], ['clips', 'Clips'], ['episodes', 'Episodes'], ['said', 'Said'], ['stories', 'Stories'], ['mine', 'My players']];
function dayPick(arr, salt) { return shuffle(arr, rng(hash(etDay() + salt))) }

function vToday() {
  const a = ANIM.find(x => x.ok) || ANIM[0];
  const bd = TOLD.filter(s => s.audio && s.k === 'baron-davis'), oth = dayPick(TOLD.filter(s => s.audio && s.k !== 'baron-davis'), 'rail');
  const told = []; while (bd.length || oth.length) { if (bd.length) told.push(bd.shift()); if (oth.length) told.push(oth.shift()); if (bd.length) told.push(bd.shift()) }
  const who = dayPick(WHOPOOL(), 'today-who')[0];
  const fresh = DROPS.slice(0, 40);
  main().innerHTML = `
  ${heroStory(a)}
  <section class="earn" data-earn></section>
  <section class="blk"><div class="sech"><h2>Told on the pods</h2><span>${told.length} stories</span></div>
   <div class="rs trail">${told.slice(0, 12).map(tcard).join('')}</div></section>
  ${who ? `<section class="blk">${whoCard(who, rng(hash(who.v)))}</section>` : ''}
  <section class="blk"><div class="sech"><h2>New on the pods</h2><span>${DROPS.length} this week</span></div>
   <div class="drows" id="drows"></div><button type="button" class="more" data-more>More drops</button></section>`;
  let n = 0; const paint = () => { $('#drows').insertAdjacentHTML('beforeend', fresh.slice(n, n + 10).map(dropRow).join('')); n += 10; if (n >= fresh.length) $('[data-more]').remove() };
  paint(); $('[data-more]').addEventListener('click', paint);
  paintEarn(); wireHero();
}
function heroStory(a) {
  if (!a) return '';
  const p = P[a.player], done = S.done['anim:' + a.id];
  const media = a.ok ? `<video src="${esc(a.video)}#t=3.3"${a.posterOk ? ` poster="${esc(a.poster)}"` : ''} muted autoplay loop playsinline preload="auto" data-hv="${esc(a.id)}"></video>
`
    : `<div class="hsoon"><img src="${BL.ink}" alt=""><b>Drawing the next one</b></div>`;
  return `<section class="hero"><div class="hvw"><div class="hv">${media}</div>
   <div class="hbar">${a.ok ? `<button type="button" class="snd" data-snd>${ICON.play}<span>Watch with sound</span></button>` : '<span></span>'}
   <div class="hx${done ? ' done' : ''}" data-hx><svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="19"/><circle class="pg" cx="22" cy="22" r="19" pathLength="1"/></svg><b>${done ? 'Earned' : '+50'}</b><small>XP</small></div></div></div>
  <div class="hm"><a class="hby" href="#/p/${esc(a.player)}">${face(a.player, 'sm')}<span><b>${esc(p ? p.name : '')}</b><em>Told on ${esc(a.show)}</em></span></a>
   <h1>${esc(a.title)}</h1><p>${esc(a.place)}. Traced from the real broadcast, in his own words.</p></div></section>`;
}
function wireHero() {
  const v = $('[data-hv]'); if (!v) return;
  const a = ANIM.find(x => x.id === v.dataset.hv), ring = $('[data-hx] .pg');
  const snd = $('[data-snd]');
  const skip = () => { if (v.muted && v.currentTime < 3.2) v.currentTime = 3.3 };   // muted preview starts on the first drawing, past the title card
  v.addEventListener('loadedmetadata', skip); v.addEventListener('seeked', () => {}); if (v.readyState >= 1) skip();
  snd && snd.addEventListener('click', () => { v.muted = false; v.currentTime = 0; v.loop = false; v.play(); snd.innerHTML = '<span>Playing with sound</span>'; snd.disabled = true });
  v.addEventListener('timeupdate', () => { if (!v.duration) return; const f = v.currentTime / v.duration;
    if (ring) ring.style.strokeDashoffset = 1 - f;
    if (!v.muted && f > .9 && earn('anim:' + a.id, 50, 'Story watched', [a.player], a.title)) { const x = $('[data-hx]'); x.classList.add('done'); $('b', x).textContent = 'Earned' } });
  v.addEventListener('ended', () => { v.loop = true; v.muted = true; v.currentTime = 3.3; v.play() });
}
function paintEarn() {
  const el = $('[data-earn]'); if (!el) return;
  const s = xpState(S.xp), nr = nextReward(S.xp), lo = prevRewardXP(S.xp);
  el.innerHTML = `<a href="#/xp" class="earn-in"><img class="bl" data-xpb src="${xpBloom(S.xp)}" alt="">
   <span class="ev"><b><span data-xpn>${fmt(S.xp)}</span> XP</b><em style="color:${s.T.col}">${esc(s.T.lv)}</em>
   <i class="bar"><i style="width:${(nr ? (S.xp - lo) / (nr.xp - lo) : 1) * 100}%"></i></i>
   <small>${nr ? `${fmt(nr.xp - S.xp)} XP to <u>${esc(nr.t.toLowerCase())}</u>` : 'Full jade bloom. Chase #1.'}</small></span>
   ${nr ? `<img class="rw" src="${esc(nr.img)}" alt="${esc(nr.t)}">` : ''}</a>`;
}
function tcard(s) {
  const p = P[s.k], done = S.done[s.key];
  return `<button type="button" class="tc" data-told="${esc(s.key)}">${face(s.k, 'tc')}<span class="tcb"><em>${esc(p.name)}</em><b>${esc(trunc(s.title, 52))}</b>
   <span class="tcx">${ICON.play}${done ? 'Heard' : '+30 XP'}</span></span></button>`;
}
function dropRow(d) {
  const s = SH[d.show];
  return `<button type="button" class="drow" data-drop="${esc(d.id)}"><span class="th${d.short ? ' sh' : ''}"><img src="${thumb(d.id)}" alt="" loading="lazy"></span>
   <span class="dr"><em>${esc(trunc(showName(d.show), 28))}${d.t ? ' · ' + esc(ago(d.t)) : d.views ? ' · ' + fmtV(d.views) + ' views' : ''}</em><b>${esc(trunc(d.title, 78))}</b></span><span class="dx">${S.done['drop:' + d.id] ? 'Seen' : '+10'}</span></button>`;
}
function openTold(key) {
  const s = TOLD.find(x => x.key === key); if (!s) return;
  openSheet(`<div class="sh-told">${toldCard(s)}</div>`);
}
const dtTile = x => `<a class="dt${x.out ? ' out' : ''}" href="#/s/${esc(x.s.id)}">${showPic(x.s)}<b>${esc(trunc(x.s.name, 26))}</b><span class="tm">${esc(hm({ h: +etHour(x.t), m: etMin(x.t) }))}</span>${x.out ? '<span class="cdn">Out now</span>' : `<span class="cdn" data-to="${+x.t}">${cdText(x.t - Date.now())}</span>`}</a>`;
const etHour = t => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', hour12: false }).format(t) % 24;
const etMin = t => t.getUTCMinutes();

function paintYou() {
  const el = $('[data-you]'); if (!el) return;
  const s = xpState(S.xp), nr = nextReward(S.xp), st = streak();
  const wk = weekDots();
  el.innerHTML = `<img class="bl" data-xpb src="${xpBloom(S.xp)}" alt="Your bloom">
  <div><div class="lv" style="color:${s.T.col}">Level ${s.t + 1} · ${s.T.lv}</div><b class="x"><span data-xpn>${fmt(S.xp)}</span> XP</b>
  <div class="bar"><i style="width:${(nr ? (S.xp - prevRewardXP(S.xp)) / (nr.xp - prevRewardXP(S.xp)) : 1) * 100}%"></i></div>
  <div class="nx">${nr ? `${fmt(nr.xp - S.xp)} XP to ${esc(nr.t.charAt(0).toLowerCase() + nr.t.slice(1))}` : 'Full jade bloom. Chase #1.'}</div></div>
  <div class="streak"><b>${st}-day streak</b><div class="wk">${wk}</div></div>`;
}
const prevRewardXP = x => { let p = 0; for (const r of REWARDS) if (r.xp <= x) p = r.xp; return p };
function streak() { const set = new Set(S.days); let n = 0; let d = new Date(); while (set.has(etDay(d))) { n++; d = new Date(+d - 864e5) } return n }
function weekDots() {
  const p = etParts(new Date()), mon = (p.wd + 6) % 7, set = new Set(S.days); let h = '';
  for (let i = 0; i < 7; i++) { const d = new Date(Date.now() + (i - mon) * 864e5), k = etDay(d); h += `<i class="${set.has(k) ? 'on' : ''}${i === mon ? ' td' : ''}" title="${PYDAY[i]}">${PYDAY[i][0]}</i>` }
  return h;
}

function renderFeed() {
  const el = $('#feed'); el.innerHTML = '';
  const eps = DROPS.filter(d => !d.short), shorts = DROPS.filter(d => d.short);
  if (FEED === 'clips') { el.innerHTML = '<div class="tgrid" id="tg"></div>'; lazyList($('#tg'), pg => { const a = shorts.slice(pg * 18, pg * 18 + 18); return a.length ? a.map(d => tile(d)).join('') : null }); return }
  if (FEED === 'episodes') { lazyList(el, pg => { const a = eps.slice(pg * 8, pg * 8 + 8); return a.length ? a.map(dropCard).join('') : null }); return }
  if (FEED === 'said') { const L = [LINES.find(l => l.k === 'baron-davis'), ...dayPick(LINES.filter(l => l.k !== 'baron-davis'), 'said')].filter(Boolean);
    lazyList(el, pg => { const a = L.slice(pg * 8, pg * 8 + 8); return a.length ? a.map((l, i) => (pg * 8 + i) % 6 === 5 ? whoCard(l, rng(hash(l.v))) : saidCard(l)).join('') : null }); return }
  if (FEED === 'stories') { const withA = TOLD.filter(s => s.audio), noA = TOLD.filter(s => !s.audio);
    lazyList(el, pg => { if (pg === 0) return animCard(ANIM[0]) + withA.slice(0, 5).map(toldCard).join('');
      const rest = [...withA.slice(5), ...noA], a = rest.slice((pg - 1) * 6, pg * 6); return a.length ? a.map(s => toldRow(s, true)).join('') : null }); return }
  if (FEED === 'mine') { renderMine(el); return }
  // All: episodes, a rail of clips, a module. Repeat.
  const said = [LINES.find(l => l.k === 'baron-davis'), ...dayPick(LINES.filter(l => l.k !== 'baron-davis' && P[l.k].img), 'feed-said')].filter(Boolean);
  const who = dayPick(WHOPOOL(), 'feed-who'), told = [...TOLD.filter(s => s.audio && s.k === 'baron-davis'), ...TOLD.filter(s => s.audio && s.k !== 'baron-davis')];
  const MODS = ['said', 'who', 'told', 'follow'];
  let ei = 0, si = 0, mi = 0, c = { said: 0, who: 0, told: 0 };
  lazyList(el, pg => {
    if (ei >= eps.length && si >= shorts.length) return null;
    let h = '';
    for (let b = 0; b < 2; b++) {
      h += eps.slice(ei, ei + 2).map(dropCard).join(''); ei += 2;
      const sh = shorts.slice(si, si + 8); si += 8;
      if (sh.length) h += rail(mi === 0 ? 'Fresh clips' : 'More clips', sh.map(d => tile(d)), `<button type="button" class="lnk" data-filter="clips">See all</button>`);
      let m = MODS[mi % MODS.length]; if (m === 'follow' && mi > 3) m = 'said'; mi++;
      if (m === 'said' && said[c.said]) h += saidCard(said[c.said++]);
      else if (m === 'who' && who[c.who]) { const l = who[c.who++]; h += whoCard(l, rng(hash(l.v))) }
      else if (m === 'told' && told[c.told]) h += toldCard(told[c.told++]);
      else if (m === 'follow') h += followCard();
    }
    return h;
  });
}
function renderMine(el) {
  const F = Object.keys(S.follow).filter(k => P[k]);
  if (!F.length) { el.innerHTML = followCard(); return }
  const set = new Set(F), ds = DROPS.filter(d => d.p.some(k => set.has(k)));
  const ls = dayPick(LINES.filter(l => set.has(l.k)), 'mine'), ts = TOLD.filter(s => set.has(s.k) && s.audio);
  let h = `<section><div class="sech"><h2>Your players</h2><a class="lnk" href="#/lockers">Add more</a></div><div class="fwrap">${F.map(k => `<a href="#/p/${esc(k)}">${face(k, 'lg')}${esc(P[k].name)}</a>`).join('')}</div></section>`;
  el.innerHTML = h;
  let di = 0, li = 0, ti = 0;
  lazyList(el, pg => {
    let o = '';
    for (let i = 0; i < 3; i++) {
      o += ds.slice(di, di + 2).map(dropCard).join(''); di += 2;
      if (ts[ti] && i === 1) o += toldCard(ts[ti++]); else if (ls[li]) o += saidCard(ls[li++]);
    }
    if (!o) return pg === 0 ? '<p class="empty">Nothing new from your players this week. Their lockers still hold every story and line.</p>' : null;
    return o;
  });
}

/* lockers */
let LQ = '', LF = 'all';
function vLockers() {
  main().innerHTML = `<header class="ph"><div class="k">${SLUGS.length} players · ${TOLD.length} stories · ${LINES.length} lines</div><h1>Lockers</h1><p>Every player with a mic. His stories, his lines, his week.</p></header>
  <label class="srch">${ICON.search}<input type="search" placeholder="Search players or shows" value="${esc(LQ)}" aria-label="Search players or shows" data-lq></label>
  <div class="chips lchips">${[['all', 'All'], ['f', 'Following'], ['told', 'Has stories'], ['new', 'Dropped this week']].map(([k, l]) => `<button type="button" class="chip${LF === k ? ' on' : ''}" data-lf="${k}">${l}</button>`).join('')}</div>
  <div class="lgrid" id="lg"></div>`;
  paintLockers();
}
function paintLockers() {
  const q = LQ.trim().toLowerCase();
  const ks = SLUGS.filter(k => { const p = P[k]; if (LF === 'f' && !S.follow[k]) return false; if (LF === 'told' && !p.stories.length) return false; if (LF === 'new' && !p.drops.length) return false;
    return !q || p.name.toLowerCase().includes(q) || p.shows.some(s => showName(s).toLowerCase().includes(q)) });
  $('#lg').innerHTML = ks.length ? ks.map(k => lockerCard(k, k === 'baron-davis' && !q && LF === 'all')).join('') : `<p class="empty" style="grid-column:1/-1">${LF === 'f' ? 'No one followed yet. Tap Follow in any locker.' : 'No player matches that.'}</p>`;
}
function lockerCard(k, big) {
  const p = P[k], c = [];
  if (p.stories.length) c.push(plural(p.stories.length, 'story').replace('storys', 'stories'));
  if (p.lines.length) c.push(plural(p.lines.length, 'line'));
  if (p.drops.length) c.push(p.drops.length + ' this week');
  else if (p.clips.length) c.push(plural(p.clips.length, 'clip'));
  const sh = p.shows.map(showName).join(' · ') || 'Guest';
  return `<a class="card lk${big ? ' big' : ''}" href="#/p/${esc(k)}">${big ? '<span class="tab">Founder</span>' : ''}${S.follow[k] ? '<span class="fw">Following</span>' : ''}${face(k, 'lg')}<div class="lk-t"><b>${esc(p.name)}</b><span>${esc(big ? 'Host of The Locker Room. Two-time All-Star. We Believe.' : trunc(sh, 24))}</span><span class="lc">${esc(c.slice(0, 2).join(' · '))}</span></div></a>`;
}

function vLocker(k) {
  const p = P[k], a = ANIM.filter(x => x.player === k && x.ok);
  const drops = p.drops.map(id => DROP[id]).filter(Boolean);
  const lines = LINES.filter(l => l.k === k), told = TOLD.filter(s => s.k === k).sort((x, y) => (!!y.audio - !!x.audio) || y.strength - x.strength);
  const clips = p.clips.slice().sort((x, y) => y.views - x.views);
  const ment = [...p.mentions].filter(x => P[x]), about = p.about;
  const n = Math.min(8, Object.keys(S.pe[k] || {}).length);
  let h = `<a class="back" href="#/lockers">${ICON.back}Lockers</a>
  <section class="lk2"><div class="lk2-f">${face(k, 'xl')}</div>
   <div class="lk2-m"><div class="k">${p.shows.map(s => `<a href="#/s/${esc(s)}">${esc(showName(s))}</a>`).join(' · ') || 'Guest on the shows'}</div>
   <h1>${esc(p.name)}</h1></div>
   <div class="lk2-b"><span class="pbl" data-pbl="${esc(k)}">${pBloomInner(k)}</span>${followBtn(k)}</div></section>`;
  if (a.length) h += `<section class="blk">${heroStory(a[0])}</section>`;
  if (told.length) h += `<section class="blk"><div class="sech"><h2>Told</h2><span>${told.length} stories · +30 XP each</span></div><div class="srows">${told.map(srow).join('')}</div></section>`;
  if (lines.length) h += `<section class="blk"><div class="sech"><h2>Said</h2><span>${plural(lines.length, 'line')} · +5 XP each</span></div><div class="lines">${lines.map(lineRow).join('')}</div></section>`;
  if (about.length) h += `<section class="blk"><div class="sech"><h2>Told about him</h2><span>${about.length} by others</span></div><div class="srows">${about.slice(0, 8).map(s => srow(s, true)).join('')}</div></section>`;
  if (ment.length) h += `<section class="blk"><div class="sech"><h2>In his stories</h2><span>${ment.length} players</span></div><div class="fwrap">${ment.slice(0, 8).map(x => `<a href="#/p/${esc(x)}">${face(x, 'lg')}${esc(P[x].name)}</a>`).join('')}</div></section>`;
  const vids = [...drops, ...clips.map(c => ({ id: c.id, title: c.title, show: c.show, t: null, short: true, views: c.views }))];
  if (vids.length) h += `<section class="blk"><div class="sech"><h2>On the pods</h2><span>${plural(vids.length, 'video')}</span></div><div class="drows">${vids.slice(0, 12).map(dropRow).join('')}</div></section>`;
  main().innerHTML = h; wireHero();
}
function srow(s, who) {
  const d = s.end && s.start != null ? s.end - s.start : 0, done = S.done[s.key];
  return `<button type="button" class="srow${done ? ' done' : ''}" data-told="${esc(s.key)}"><span class="sp2">${ICON.play}</span>
   <span class="sm"><em>${who ? esc(P[s.k].name) + ' · ' : ''}${esc(shortEra(s.era) || 'Told on the pods')}${d ? ' · ' + mmss(d) : ''}</em><b>${esc(s.title)}</b></span>
   <span class="dx">${done ? 'Heard' : s.audio ? '+30' : ''}</span></button>`;
}
function pBloomInner(k) {
  const n = Math.min(8, Object.keys(S.pe[k] || {}).length), petals = Array(8).fill(null);
  ORD.forEach((w, i) => { if (i < n) petals[w] = RED });
  const nm = firstName(P[k].name);
  return `<img src="${bloomURI({ petals, ball: BALL, bg: '#FBF6EC', out: '#BDB2A2' }, 1.6)}" alt="Your bloom with ${esc(nm)}: ${n} of 8"><div><b>${n} of 8 petals</b><span>${n >= 8 ? `Full bloom with ${esc(nm)}.` : `Your bloom with ${esc(nm)}. Hear his stories, play his lines, watch his drops.`}</span></div>`;
}
function paintPlayerBlooms(ks) { for (const k of ks) $$(`[data-pbl="${CSS.escape(k)}"]`).forEach(el => { el.innerHTML = pBloomInner(k) }) }

/* shows */
function vShows() {
  const lr = SH['locker-room'];
  const active = SHOWS.filter(s => s.id !== 'locker-room');
  const wk = id => DROPS.filter(d => d.show === id && Date.now() - new Date(d.t) < 7 * 864e5).length;
  const order = list => list.map(s => ({ s, t: nextDrop(s) })).sort((a, b) => (a.s.status === 'hiatus') - (b.s.status === 'hiatus') || (!a.t) - (!b.t) || (a.t || 0) - (b.t || 0) || wk(b.s.id) - wk(a.s.id));
  const pl = order(active.filter(s => s.kind === 'players')), md = order(active.filter(s => s.kind !== 'players'));
  const card = ({ s, t }) => `<a class="card shc" href="#/s/${esc(s.id)}">${showPic(s)}<div><b>${esc(s.name)}</b><span class="hs">${esc(s.hosts.slice(0, 4).join(', '))}${s.hosts.length > 4 ? ' +' + (s.hosts.length - 4) : ''}</span><span class="ru">${esc(ruleText(s))}</span></div>
   <div class="shn">${t ? `<div><div class="k">Next drop</div><span class="cd" data-to="${+t}">${cdText(t - Date.now())}</span></div>` : `<span class="cd idle">${s.status === 'hiatus' ? 'On a break' : 'No set day'}</span>`}<span class="wc">${wk(s.id)} this week</span></div></a>`;
  main().innerHTML = `<header class="ph"><div class="k">${SHOWS.length} shows · ${DROPS.length} drops in 10 days</div><h1>Shows</h1><p>Every show where players talk. When the next one drops, to the minute.</p></header>
  ${lr ? `<a class="card orig" href="#/p/baron-davis"><span class="tab">HOTG Original</span><img src="${BL.ink}" alt=""><div><div class="k">Baron Davis · ${TOLD.filter(s => s.k === 'baron-davis').length} stories so far</div><h2>${esc(lr.name)}</h2><p>Current and retired players, one room. In development.</p></div></a>` : ''}
  <section><div class="sech"><h2>Player shows</h2><span>${pl.length}</span></div><div class="shl">${pl.map(card).join('')}</div></section>
  <section class="sec"><div class="sech"><h2>Around the league</h2><span>${md.length}</span></div><div class="shl">${md.map(card).join('')}</div></section>`;
  tick();
}
function vShow(id) {
  const s = SH[id], t = nextDrop(s), ds = DROPS.filter(d => d.show === id);
  const hosts = s.hosts.map(n => ({ n, k: slugify(n) }));
  const links = [s.yt && ['YouTube', s.yt], s.apple && ['Apple Podcasts', s.apple], s.spotify && ['Spotify', s.spotify]].filter(Boolean);
  main().innerHTML = `<a class="back" href="#/shows">${ICON.back}Shows</a>
  <section class="card shh"><span class="tab">${s.kind === 'players' ? 'Player show' : s.kind === 'original' ? 'HOTG Original' : 'Media'}</span>
   <div class="top">${showPic(s)}<div><div class="k">${ds.length} drops this week</div><h1>${esc(s.name)}</h1></div></div>
   <div class="showline">${hosts.map(h => P[h.k] ? `<a href="#/p/${esc(h.k)}">${face(h.k, 'xs')}${esc(h.n)}</a>` : `<a style="pointer-events:none;padding-left:10px">${esc(h.n)}</a>`).join('')}</div>
   <p class="ru">${esc(ruleText(s))}</p>
   <div class="nd"><span class="k mute">${t ? 'Next drop' : 'Schedule'}</span>${t ? `<span class="cd" data-to="${+t}">${cdText(t - Date.now())}</span>` : `<span class="cd idle">${s.status === 'hiatus' ? 'On a break' : 'No set day'}</span>`}</div>
   ${links.length ? `<div class="links">${links.map(([l, u]) => `<a class="lnk" href="${esc(u)}" target="_blank" rel="noopener">${l}</a>`).join('')}</div>` : ''}</section>
  ${ds.filter(d => !d.short).length ? `<section class="sec"><div class="sech"><h2>Episodes</h2><span>${ds.filter(d => !d.short).length}</span></div><div class="stack">${ds.filter(d => !d.short).map(dropCard).join('')}</div></section>` : ''}
  ${ds.filter(d => d.short).length ? `<section class="sec"><div class="sech"><h2>Clips</h2><span>${ds.filter(d => d.short).length}</span></div><div class="tgrid">${ds.filter(d => d.short).map(d => tile(d, ago(d.t))).join('')}</div></section>` : ''}
  ${!ds.length ? `<p class="empty" style="margin-top:30px">No uploads in the last 10 days.</p>` : ''}`;
  tick();
}

/* XP */
function vXP() {
  const s = xpState(S.xp), nr = nextReward(S.xp), part = xpPartial();
  const savedK = Object.keys(S.saved).sort((a, b) => S.saved[b].t - S.saved[a].t);
  main().innerHTML = `<header class="ph"><div class="k">Fan progression</div><h1>Your bloom</h1><p>Every story, line and clip fills a petal. Fill all eight to level up. Four materials, real rewards.</p></header>
  <section class="card xh"><div class="xb"><img src="${xpBloom(S.xp, { bg: INK, out: '#4A433E', ow: 2.4 })}" alt="Your bloom" data-xbig>${part ? `<img class="ov" src="${part.src}" alt="" style="clip-path:circle(${part.r}% at 50% 50%)" data-xov>` : ''}</div>
   <div class="pips">${Array.from({ length: 8 }, (_, i) => `<i class="${i < s.done ? 'on' : ''}" style="--c:${s.T.col}"></i>`).join('')}</div>
   <div class="x"><b class="num">${fmt(S.xp)}</b><div class="lv" style="color:${s.t === 0 ? '#F08A93' : s.T.col === '#7D8590' ? '#CFD5DC' : s.T.col}">Level ${s.t + 1} · ${s.T.mat} · ${s.T.lv}</div></div>
   <div class="bar"><i style="width:${s.p * 100}%;background:${s.T.col}"></i></div>
   <p class="nx">${S.xp >= MAXX ? 'Full jade bloom. You are a Legend.' : `${s.done} of 8 ${s.T.mat.toLowerCase()} petals · ${fmt(s.T.b - S.xp)} XP to ${s.t < 3 ? TIERS[s.t + 1].lv : 'a full jade bloom'}${nr ? ` · next reward at ${fmt(nr.xp)}` : ''}`}</p></section>
  <section class="sec"><div class="sech"><h2>Earn XP</h2><span>Once per item</span></div><div class="rules">${RULES.map(([l, n]) => `<div><span>${l}</span><b>+${n} XP</b></div>`).join('')}</div></section>
  <section class="sec"><div class="sech"><h2>Levels</h2><span>Four blooms</span></div><div class="tiers">${TIERS.map((T, i) => {
    const st = S.xp >= T.b ? 'done' : i === s.t ? 'now' : '', p = Math.max(0, Math.min(1, (S.xp - T.a) / (T.b - T.a)));
    return `<div class="card tier${st === 'now' ? ' cur' : ''}"><div class="hd"><img src="${T.pin}" alt="${T.mat} pin"><div><b>${T.lv}</b><span>Level ${i + 1} · ${T.mat} · ${fmt(T.a)}–${fmt(T.b)} XP</span></div><span class="st ${st}">${st === 'done' ? 'Complete' : st === 'now' ? 'Current' : 'Locked'}</span></div>
    <div class="bar"><i style="width:${p * 100}%;background:${T.col}"></i></div>
    <div class="rws">${REWARDS.filter(r => r.xp > T.a && r.xp <= T.b).map(r => `<div class="rw${S.xp >= r.xp ? ' got' : ''}"><figure class="${r.fit || ''}"><img src="${r.img}" alt="${esc(r.t)}" loading="lazy"><span class="lock">${S.xp >= r.xp ? 'Unlocked' : 'Locked'}</span>${r.signed ? '<span class="sig">Signed</span>' : ''}</figure><div><b>${fmt(r.xp)} XP</b><span>${esc(r.t)}</span><em>${esc(r.d)}</em></div></div>`).join('')}</div></div>` }).join('')}</div></section>
  <section class="sec"><div class="card cap"><span class="tab">After Legend</span><figure><img src="img/rw/relic-r2-sculpture-signed.webp" alt="Chrome HOTG award, signed" loading="lazy"></figure><div><div class="k">One fan each season</div><h3>#1 HOTG</h3><p>Most XP at season's end wins the chrome HOTG award, signed on every petal by eight Legends and presented live on the show.</p><span class="st">${S.xp >= MAXX ? 'You are in the running' : `Unlocks at Legend · ${fmt(MAXX - S.xp)} XP to go`}</span></div></div></section>
  <section class="sec"><div class="sech"><h2>History</h2><span>${S.log.length} entries</span></div>${S.log.length ? `<div class="log">${S.log.slice(0, 40).map(e => `<div><b>${esc(e.l)}</b><span>${esc(e.d ? e.d + ' · ' : '')}${ago(e.t)}</span><em>+${fmt(e.n)}</em></div>`).join('')}</div>` : '<p class="empty">Nothing yet. Play a line on Today.</p>'}</section>
  <section class="sec"><div class="sech"><h2>Saved</h2><span>${savedK.length}</span></div>${savedK.length ? `<div class="saved">${savedK.map(savedItem).join('')}</div>` : '<p class="empty">Tap Save on any drop, line or story.</p>'}</section>
  <button type="button" class="reset" data-reset>Reset progress on this device</button>`;
}
function xpPartial() { return xpBloomPartial(S.xp, { bg: INK }) }
function savedItem(key) {
  const v = S.saved[key];
  if (v.type === 'drop') { const d = DROP[v.ref]; if (!d) return '';
    return `<div class="svi"><button type="button" class="th" data-drop="${esc(d.id)}" aria-label="Play"><img src="${thumb(d.id)}" alt="" loading="lazy"></button><div><b>${esc(d.title)}</b><span>${esc(showName(d.show))} · ${d.short ? 'Clip' : 'Episode'}</span></div></div>` }
  const [k, i] = String(v.ref).split('|'); const p = P[k]; if (!p) return '';
  if (v.type === 'line') { const l = p.lines[+i]; if (!l) return '';
    return `<div class="svi"><a href="#/p/${esc(k)}">${face(k, 'sm')}</a><div><b>“${esc(l.line)}”</b><span>${esc(p.name)} · Said</span></div></div>` }
  const s = p.stories[+i]; if (!s) return '';
  return `<div class="svi"><a href="#/p/${esc(k)}">${face(k, 'sm')}</a><div><b>${esc(s.title)}</b><span>${esc(p.name)} · Told</span></div></div>`;
}

/* rails and nav */
function paintNav() {
  const r = route().name, items = [['today', '#/', 'Today'], ['lockers', '#/lockers', 'Lockers'], ['shows', '#/shows', 'Shows'], ['xp', '#/xp', 'XP']];
  const on = r === 'locker' ? 'lockers' : r === 'show' ? 'shows' : r;
  $$('[data-nav]').forEach(n => { n.innerHTML = items.map(([k, h, l]) => `<a href="${h}" class="${on === k ? 'on' : ''}"${on === k ? ' aria-current="page"' : ''}>${ICON[k]}<span>${l}</span></a>`).join('') });
}
function paintRail() {
  const el = $('#rail'); if (!el || getComputedStyle(el).display === 'none') return;
  const s = xpState(S.xp), nr = nextReward(S.xp), dt = droppingToday().slice(0, 5);
  const F = Object.keys(S.follow).filter(k => P[k]);
  const ps = (F.length ? F : SLUGS.filter(k => P[k].img).slice(0, 6)).slice(0, 6);
  el.innerHTML = `${route().name === 'today' ? '' : `<a class="rcard rxp" href="#/xp" style="display:grid"><img class="bl" data-xpb src="${xpBloom(S.xp)}" alt="Your bloom"><div><div class="k">Your bloom</div><b><span data-xpn>${fmt(S.xp)}</span></b><div class="lv" style="color:${s.T.col}">${s.T.lv} · ${streak()}-day streak</div></div>
   <div class="nx"><div class="bar" style="margin:0 0 8px"><i style="width:${s.p * 100}%;background:${s.T.col}"></i></div>${nr ? `${fmt(nr.xp - S.xp)} XP to ${esc(nr.t.charAt(0).toLowerCase() + nr.t.slice(1))}` : 'Full jade bloom'}</div></a>
  `}<section class="rcard"><div class="rh2"><span class="k">Dropping today</span><a href="#/shows">All shows</a></div><div class="rlist">${dt.length ? dt.map(x => `<a class="rdrop" href="#/s/${esc(x.s.id)}">${showPic(x.s)}<div><b>${esc(x.s.name)}</b><span>${esc(hm({ h: etHour(x.t), m: etMin(x.t) }))}</span></div>${x.out ? '<span class="cdn out">Out</span>' : `<span class="cdn" data-to="${+x.t}">${cdText(x.t - Date.now())}</span>`}</a>`).join('') : '<span class="mute">Quiet day. Catch up in Lockers.</span>'}</div></section>
  <section class="rcard"><div class="rh2"><span class="k">${F.length ? 'Your players' : 'Start with'}</span><a href="#/lockers">Lockers</a></div><div class="rplayers">${ps.map(k => `<a href="#/p/${esc(k)}">${face(k, 'lg')}${esc(P[k].name)}</a>`).join('')}</div></section>`;
  tick();
}
function paintXP() {
  const u = xpBloom(S.xp), s = xpState(S.xp);
  $$('img[data-xpb]').forEach(i => { if (i.src !== u) i.src = u });
  $$('[data-xpn]').forEach(e => { e.textContent = fmt(S.xp) });
  $$('[data-xplv]').forEach(e => { e.textContent = `Level ${s.t + 1} · ${s.T.lv}` });
  paintYou(); paintEarn(); paintRail();
  const big = $('[data-xbig]'); if (big) { big.src = xpBloom(S.xp, { bg: INK, out: '#4A433E', ow: 2.4 }); const pt = xpPartial(), ov = $('[data-xov]'); if (ov && pt) { ov.src = pt.src; ov.style.clipPath = `circle(${pt.r}% at 50% 50%)` } }
}

/* ---------- toast ---------- */
function toast(n, label, before) {
  const el = $('#toast'), r = REWARDS.find(x => before < x.xp && S.xp >= x.xp), lv = tierOf(before) !== tierOf(S.xp);
  el.innerHTML = `<b>+${fmt(n)} XP</b><span>${esc(label)}${r ? `<small>Unlocked: ${esc(r.t)}</small>` : lv ? `<small>Level up: ${esc(TIERS[tierOf(S.xp)].lv)}</small>` : ''}</span>`;
  el.classList.remove('on'); void el.offsetWidth; el.classList.add('on');
  clearTimeout(toast.h); toast.h = setTimeout(() => el.classList.remove('on'), r || lv ? 3600 : 2200);
}

/* ---------- audio ---------- */
const AU = { el: new Audio(), w: null };
AU.el.preload = 'auto';
function audToggle(w) {
  if (AU.w === w && !AU.el.paused) { AU.el.pause(); return }
  if (AU.w !== w) { if (AU.w) { AU.w.classList.remove('playing'); setAt(AU.w) } AU.w = w; AU.el.src = w.dataset.src; AU.half = false }
  AU.el.play().then(() => { w.classList.add('playing');
    if (w.dataset.kind === 'line') earn(w.dataset.key, +w.dataset.xp, w.dataset.label, (w.dataset.pl || '').split(',').filter(Boolean), w.dataset.d);
  }).catch(() => { w.classList.remove('playing') });
}
function setAt(w, t) { const at = $('.at', w); if (!at) return; if (t != null) { at.textContent = t; at.classList.remove('x') } }
AU.el.addEventListener('timeupdate', () => {
  const w = AU.w; if (!w || !AU.el.duration) return;
  const p = AU.el.currentTime / AU.el.duration; $('.wave', w).style.setProperty('--p', p.toFixed(4));
  setAt(w, mmss(AU.el.currentTime) + ' / ' + mmss(AU.el.duration));
  if (w.dataset.kind === 'told' && (p >= .5 || AU.el.currentTime >= 90)) earn(w.dataset.key, 30, w.dataset.label, (w.dataset.pl || '').split(',').filter(Boolean), w.dataset.d);
});
AU.el.addEventListener('pause', () => AU.w && AU.w.classList.remove('playing'));
AU.el.addEventListener('play', () => AU.w && AU.w.classList.add('playing'));
AU.el.addEventListener('ended', () => { const w = AU.w; if (!w) return; w.classList.remove('playing'); $('.wave', w).style.setProperty('--p', 1);
  if (w.dataset.kind === 'told') earn(w.dataset.key, 30, w.dataset.label, (w.dataset.pl || '').split(',').filter(Boolean), w.dataset.d) });
const stopAudio = () => { AU.el.pause(); AU.w = null };

/* ---------- sheet (YouTube, animated story) ---------- */
let WT = null;
function openSheet(html, tall, onClose) {
  const sh = $('#sheet'); $('.sh-in', sh).innerHTML = `<div class="sh-top"><span class="k">Now playing</span><button type="button" class="sh-x" data-close>Close</button></div>` + html;
  $('.sh-p', sh).classList.toggle('tallp', !!tall);
  sh.setAttribute('aria-hidden', 'false'); requestAnimationFrame(() => sh.classList.add('on'));
  document.body.style.overflow = 'hidden'; stopAudio(); openSheet.onClose = onClose;
}
function closeSheet() {
  const sh = $('#sheet'); if (!sh.classList.contains('on')) return;
  sh.classList.remove('on'); sh.setAttribute('aria-hidden', 'true'); document.body.style.overflow = '';
  clearInterval(WT); WT = null; openSheet.onClose && openSheet.onClose();
  setTimeout(() => { if (!sh.classList.contains('on')) $('.sh-in', sh).innerHTML = '' }, 320);
}
function watchTimer(key, players, label, detail) {
  clearInterval(WT); const t0 = Date.now(), done = !!S.done[key];
  const bar = $('#sheet .wbar i'), note = $('#sheet .wnote');
  if (done) { if (bar) bar.style.width = '100%'; if (note) note.textContent = 'XP earned for this one'; return }
  WT = setInterval(() => { const p = Math.min(1, (Date.now() - t0) / 15000); if (bar) bar.style.width = p * 100 + '%';
    if (p >= 1) { clearInterval(WT); WT = null; earn(key, 10, label, players, detail); if (note) note.textContent = '+10 XP earned'; refreshWatched(key) } }, 250);
}
const embed = (id, start, end) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0&modestbranding=1${start ? '&start=' + start : ''}${end ? '&end=' + end : ''}`;
function openDrop(id) {
  const d = DROP[id]; if (!d) return;
  openSheet(`<div class="sh-v${d.short ? ' tall' : ''}"><iframe src="${embed(id)}" title="${esc(d.title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
  <div class="sh-c"><div class="k">${esc(showName(d.show))} · ${d.short ? 'Clip' : 'Episode'} · ${ago(d.t)}</div><h3>${esc(d.title)}</h3>${chipsFor(d.p, 6)}
  <div class="wbar"><i></i></div><div class="wnote">Stay 15 seconds for +10 XP</div>
  <div class="acts">${saveBtn('drop:' + d.id, 'drop', d.id)}<span class="sp"></span><a class="lnk" href="https://www.youtube.com/watch?v=${esc(id)}" target="_blank" rel="noopener">Open on YouTube</a></div></div>`, d.short);
  watchTimer('watch:' + id, d.p, 'Clip watched', d.title);
}
function openYT(b) {
  const id = b.dataset.yt, st = b.dataset.start ? +b.dataset.start : 0, en = b.dataset.end ? +b.dataset.end : 0, title = b.dataset.title || '', pl = (b.dataset.pl || '').split(',').filter(Boolean), tall = b.dataset.tall === '1';
  openSheet(`<div class="sh-v${tall ? ' tall' : ''}"><iframe src="${embed(id, st, en)}" title="${esc(title)}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div>
  <div class="sh-c"><div class="k">${esc(pl.map(plName).join(' · '))}</div><h3>${esc(title)}</h3><div class="wbar"><i></i></div><div class="wnote">Stay 15 seconds for +10 XP</div>
  <div class="acts"><span class="sp"></span><a class="lnk" href="https://www.youtube.com/watch?v=${esc(id)}${st ? '&t=' + st + 's' : ''}" target="_blank" rel="noopener">Open on YouTube</a></div></div>`, tall);
  watchTimer('watch:' + id + (st ? ':' + st : ''), pl, 'Clip watched', title);
}
function openAnim(id) {
  const a = ANIM.find(x => x.id === id); if (!a || !a.ok) return;
  openSheet(`<div class="sh-v tall"><video src="${esc(a.video)}#t=3.3"${a.posterOk ? ` poster="${esc(a.poster)}"` : ''} controls autoplay playsinline></video></div>
  <div class="sh-c"><div class="k">Animated · ${esc(plName(a.player))} · ${esc(a.show)}</div><h3>${esc(a.title)}</h3><p class="meta">${esc(a.place)}</p>
  <div class="wbar"><i></i></div><div class="wnote">${S.done['anim:' + id] ? 'XP earned for this one' : 'Watch to the end for +50 XP'}</div></div>`, true);
  const v = $('#sheet video'), bar = $('#sheet .wbar i');
  v.addEventListener('timeupdate', () => { if (!v.duration) return; const p = v.currentTime / v.duration; bar.style.width = p * 100 + '%';
    if (p >= .9 && earn('anim:' + id, 50, 'Story watched', [a.player], a.title)) { $('#sheet .wnote').textContent = '+50 XP earned'; refreshAnim() } });
}
function refreshAnim() { if (route().name === 'today' || route().name === 'locker') $$('.anim').forEach(el => { const a = ANIM[0]; if (a) el.outerHTML = animCard(a) }) }
function refreshWatched(key) { const id = key.split(':')[1]; $$(`[data-drop="${CSS.escape(id)}"]`).forEach(b => { const c = b.closest('.drop'); const k = c && c.querySelector('.acts .k'); if (k) k.textContent = 'Watched' }) }

/* ---------- events ---------- */
document.addEventListener('click', e => {
  const t = e.target;
  let b;
  if ((b = t.closest('[data-close]'))) { closeSheet(); return }
  if ((b = t.closest('.aud .pb'))) { audToggle(b.closest('.aud')); return }
  if ((b = t.closest('[data-drop]'))) { e.preventDefault(); openDrop(b.dataset.drop); return }
  if ((b = t.closest('[data-yt]'))) { e.preventDefault(); openYT(b); return }
  if ((b = t.closest('[data-anim]'))) { openAnim(b.dataset.anim); return }
  if ((b = t.closest('[data-told]'))) { openTold(b.dataset.told); return }
  if ((b = t.closest('[data-pick]'))) { pickWho(b); return }
  if ((b = t.closest('[data-follow]'))) { e.preventDefault(); toggleFollow(b.dataset.follow); return }
  if ((b = t.closest('[data-save]'))) { e.preventDefault(); toggleSave(b); return }
  if ((b = t.closest('[data-filter]'))) { FEED = b.dataset.filter; if (route().name !== 'today') { location.hash = '#/' } else { $$('[data-filter].chip').forEach(c => { const on = c.dataset.filter === FEED; c.classList.toggle('on', on); c.setAttribute('aria-selected', on) }); stopAudio(); renderFeed(); const y = $('#feed').getBoundingClientRect().top + scrollY - 150; if (scrollY > y) scrollTo({ top: Math.max(0, y) }) } return }
  if ((b = t.closest('[data-lf]'))) { LF = b.dataset.lf; $$('[data-lf]').forEach(c => c.classList.toggle('on', c.dataset.lf === LF)); paintLockers(); return }
  if ((b = t.closest('[data-more]'))) { const r = b.previousElementSibling; if (r) r.hidden = false; b.remove(); return }
  if ((b = t.closest('[data-reset]'))) { if (confirm('Reset XP, follows and saves on this device?')) { try { localStorage.removeItem(KEY) } catch (e2) {} location.href = location.pathname + '#/' ; location.reload() } return }
});
document.addEventListener('input', e => { if (e.target.matches('[data-lq]')) { LQ = e.target.value; paintLockers() } });
addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet() });

function pickWho(b) {
  const card = b.closest('.who'), v = card.dataset.v, k = card.dataset.k, pick = b.dataset.pick;
  if (S.who[v]) return;
  const ok = pick === k; S.who[v] = { pick, ok }; save();
  $$('.opt', card).forEach(o => o.classList.add(o.dataset.pick === k ? 'right' : o.dataset.pick === pick ? 'wrong' : 'dim'));
  $('.wres', card).innerHTML = ok ? `Right. <em>${esc(P[k].name)}</em>.` : `It was <em>${esc(P[k].name)}</em>.`;
  const q = $('.wq', card); q.hidden = false; q.insertAdjacentHTML('beforeend', ` <a class="lnk" href="#/p/${esc(k)}">His locker</a>`);
  if (ok) earn('who:' + v, 25, 'Who said it', [k], P[k].name);
}
function toggleFollow(k) {
  if (S.follow[k]) delete S.follow[k]; else { S.follow[k] = Date.now(); earn('follow:' + k, 20, 'Followed', [k], P[k].name) }
  save();
  $$(`[data-follow="${CSS.escape(k)}"]`).forEach(b => { const cls = b.classList.contains('fbtn') ? 'fbtn' : 'btn red'; b.outerHTML = followBtn(k, cls) });
  paintRail(); const mc = $('.chip[data-filter="mine"]'); if (mc) { const n = Object.keys(S.follow).length; mc.innerHTML = 'My players' + (n ? `<em>${n}</em>` : '') }
}
function toggleSave(b) {
  const key = b.dataset.save;
  if (S.saved[key]) delete S.saved[key]; else { S.saved[key] = { type: b.dataset.type, ref: b.dataset.ref, t: Date.now() }; earn('save:' + key, 2, 'Saved', savePlayers(b.dataset.type, b.dataset.ref)) }
  save();
  $$(`[data-save="${CSS.escape(key)}"]`).forEach(x => { x.outerHTML = saveBtn(key, b.dataset.type, b.dataset.ref) });
}
const savePlayers = (type, ref) => type === 'drop' ? (DROP[ref] ? DROP[ref].p : []) : [String(ref).split('|')[0]];

/* ---------- router ---------- */
function route() { const h = location.hash.replace(/^#\/?/, ''), [a, b] = h.split('/');
  if (a === 'lockers') return { name: 'lockers' }; if (a === 'p' && P[b]) return { name: 'locker', k: b }; if (a === 'shows') return { name: 'shows' };
  if (a === 's' && SH[b]) return { name: 'show', id: b }; if (a === 'xp') return { name: 'xp' }; return { name: 'today' } }
function go() {
  closeSheet(); stopAudio(); if (IO) { IO.disconnect(); IO = null }
  const r = route();
  if (r.name === 'lockers') vLockers(); else if (r.name === 'locker') vLocker(r.k); else if (r.name === 'shows') vShows(); else if (r.name === 'show') vShow(r.id); else if (r.name === 'xp') vXP(); else vToday();
  const t = { lockers: 'Lockers', locker: r.k && P[r.k] ? P[r.k].name : '', shows: 'Shows', show: r.id && SH[r.id] ? SH[r.id].name : '', xp: 'Your XP', today: 'Today' }[r.name];
  document.title = `${t} · HOTG`;
  paintNav(); paintRail(); window.scrollTo(0, 0);
}
addEventListener('hashchange', go);
let lastWide = innerWidth >= 1024;
addEventListener('resize', () => { const w = innerWidth >= 1024; if (w !== lastWide) { lastWide = w; paintRail() } });

/* ---------- boot ---------- */
async function head(u) { try { const r = await fetch(u, { method: 'HEAD', cache: 'no-store' }); return r.ok } catch (e) { return false } }
async function boot() {
  const [data] = await Promise.all([fetch('data/app.json').then(r => r.json()), window.bloomReady, document.fonts && document.fonts.load('700 40px Heros').catch(() => {})]);
  D = data; makeMarks(); prep();
  $$('img[data-mark]').forEach(i => { i.src = BL.mark });
  for (const a of ANIM) { const w = (a.place || '').split(' ')[0].toLowerCase(), st = w && TOLD.find(s => s.k === a.player && s.title.toLowerCase().includes(w)); if (st) a.teaser = st.beats.slice(1, 3).join(' ') }
  await Promise.all(ANIM.map(async a => { a.ok = !!a.video && await head(a.video); a.posterOk = !!a.poster && await head(a.poster) }));
  // demo presets: ?xp=5200 sets XP once (reloads keep progress), ?reset=1 clears this device
  const q = new URLSearchParams(location.search);
  if (q.has('reset')) { for (const k of Object.keys(S)) delete S[k]; Object.assign(S, { xp: 0, done: {}, follow: {}, saved: {}, pe: {}, who: {}, log: [], days: [] }); save() }
  if (q.has('xp')) { const v = Math.max(0, Math.min(MAXX, parseInt(q.get('xp'), 10) || 0)); if (S.preset !== v) { S.preset = v; S.xp = v; S.log.unshift({ k: 'preset', n: v, l: 'Season so far', d: '', t: Date.now() }); save() } }
  if (q.has('streak')) { const n = Math.min(30, parseInt(q.get('streak'), 10) || 0); for (let i = 1; i < n; i++) { const d = etDay(new Date(Date.now() - i * 864e5)); if (!S.days.includes(d)) S.days.push(d) } save() }
  const today = etDay();
  if (!S.days.includes(today)) { S.days.push(today); S.days = S.days.slice(-60); save() }
  go(); paintXP();
  setTimeout(() => earn('day:' + today, 15, 'Daily check-in'), 700);
}
window.__hotg = { state: S, audio: AU.el };
boot().catch(err => { console.error(err); $('#main').innerHTML = '<p class="empty">Could not load today. Pull to refresh.</p>' });
})();

/* app.js — Micrositio "Burgers Anormales · Carpa Arganda"
   Router por hash + pantallas. Réplica fiel del diseño de Claude Design.
   Datos: data/burgers.json (editable). Estado: localStorage (store.js). */

import { store } from './store.js';
import { icons, gameIcons, mascota, confettiHTML, toast, fmt } from './ui.js';
import { startGame } from './games/engine.js';
import { qrSoportado, iniciarScanner, parseCodigoSello } from './qr.js';

import parrillero from './games/parrillero.js';
import cana from './games/cana.js';
import ninja from './games/ninja.js';
import fuego from './games/fuego.js';
import bus from './games/bus.js';
import imprenta from './games/imprenta.js';

const GAMES = { parrillero, cana, ninja, fuego, bus, imprenta };

let DATA = null;
let engine = null;        // partida en curso
let scanner = null;       // cámara en curso
let timers = [];          // intervalos de pantalla (countdown)

const root = () => document.getElementById('screen-root');
const tabroot = () => document.getElementById('tabbar-root');

/* ================= Utilidades de datos ================= */

const burgers = () => DATA.burgers;
const ids = () => burgers().map((b) => b.id);
const byId = (id) => burgers().find((b) => b.id === id) || burgers()[0];
const byGame = (gid) => burgers().find((b) => b.juego.id === gid);

function votos() {
  const v = { ...DATA.votosBase };
  if (store.votado) v[store.votado] = (v[store.votado] || 0) + 1;
  return v;
}

function boardDe(juegoId, miScore) {
  const yo = Math.max(miScore ?? 0, store.mejorPuntuacion(juegoId));
  const rows = [...DATA.rankingSemilla, { nick: 'TÚ', score: yo, me: true }]
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
  return { rows, miPuesto: rows.findIndex((r) => r.me) + 1 };
}

function recordDelDia(juegoId) {
  const top = Math.max(...DATA.rankingSemilla.map((r) => r.score), store.mejorPuntuacion(juegoId));
  return fmt(top);
}

/* Logo del patrón (si hay archivo) con fallback al placeholder de inicial.
   El onerror cubre el caso de que falte el archivo del logo. */
function logoPatron(p, size, radius = 12) {
  if (!p.logo) return '';
  return `<span style="width:${size}px;height:${size}px;flex:none;border-radius:${radius}px;display:flex;align-items:center;justify-content:center;background:#F6F3EE;overflow:hidden;padding:${Math.max(3, Math.round(size * 0.08))}px"><img src="${p.logo}" alt="${p.nombre}" draggable="false" style="max-width:100%;max-height:100%;object-fit:contain" onerror="this.parentElement.style.background='${p.color}';this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="width:100%;height:100%;display:none;align-items:center;justify-content:center;font-family:var(--font-display);font-size:${Math.round(size * 0.42)}px;color:var(--ba-ink)">${p.nombre[0]}</span></span>`;
}

/* ================= Navegación ================= */

function go(hash) { location.hash = hash; }

function limpiar() {
  if (engine) { engine.stop(); engine = null; }
  if (scanner) { scanner.parar(); scanner = null; }
  timers.forEach(clearInterval);
  timers = [];
}

function route() {
  limpiar();
  const h = (location.hash || '#/').replace(/^#\/?/, '');
  const seg = h.split('/').filter(Boolean);

  if (seg.length === 0) return scrHome();
  switch (seg[0]) {
    case 'carta': return scrCarta();
    case 'burger': return scrDetalle(seg[1]);
    case 'patron': return scrPatron(seg[1]);
    case 'juega': return scrJuega();
    case 'juego':
      if (seg[2] === 'play') return scrJugando(seg[1]);
      if (seg[2] === 'fin') return scrResultado(seg[1]);
      return scrJuegoInicio(seg[1]);
    case 'pasaporte': return scrPasaporte();
    case 'premio': return scrPremio();
    case 'vota': return scrVota();
    case 'votado': return scrVotaOk();
    case 'sorteo': return scrSorteo();
    case 'registro': return scrRegistro();
    case 'scan': return scrScan(seg[1]);
    case 'sello': return doSello(seg[1]);
    default: return scrHome();
  }
}

/* ================= Tab bar ================= */

const TABS = [
  { id: 'home', l: 'Inicio', icon: icons.home, hash: '#/' },
  { id: 'carta', l: 'Carta', icon: icons.carta, hash: '#/carta' },
  { id: 'juega', l: 'Juega', icon: icons.juega, hash: '#/juega' },
  { id: 'pasaporte', l: 'Pasa', icon: icons.pasaporte, hash: '#/pasaporte' },
  { id: 'vota', l: 'Vota', icon: icons.vota, hash: '#/vota' },
];

function seccion(pantalla) {
  if (['carta', 'detalle'].includes(pantalla)) return 'carta';
  if (['juega', 'jini', 'jplay', 'jres'].includes(pantalla)) return 'juega';
  if (['pasaporte', 'premio'].includes(pantalla)) return 'pasaporte';
  if (['vota', 'votado', 'sorteo', 'registro'].includes(pantalla)) return 'vota';
  return pantalla;
}

function tabbar(pantalla) {
  const visible = ['home', 'carta', 'juega', 'pasaporte', 'vota', 'sorteo'].includes(pantalla);
  if (!visible) { tabroot().innerHTML = ''; return; }
  const sec = seccion(pantalla);
  tabroot().innerHTML = `<nav class="tabbar">${TABS.map((t) =>
    `<button class="tab ${sec === t.id ? 'on' : ''}" data-go="${t.hash}"><span class="i">${t.icon}</span><span class="l">${t.l}</span></button>`
  ).join('')}</nav>`;
}

/* ================= Render base ================= */

function render(pantalla, html) {
  root().innerHTML = html;
  tabbar(pantalla);
  // delegación de navegación
  root().querySelectorAll('[data-go]').forEach((el) =>
    el.addEventListener('click', () => go(el.dataset.go)));
  tabroot().querySelectorAll('[data-go]').forEach((el) =>
    el.addEventListener('click', () => go(el.dataset.go)));
}

/* ================= Pantallas ================= */

function scrHome() {
  render('home', `
  <div class="screen" style="padding:40px 22px 96px">
    <img src="assets/splash-pink.png" alt="" style="position:absolute;top:0;right:-70px;width:230px;opacity:.3;pointer-events:none">
    <div style="display:flex;align-items:center;gap:7px;font-weight:900;text-transform:uppercase;letter-spacing:.09em;font-size:11.5px;color:var(--ba-bone-dim);position:relative">
      <span>Pegasus</span><span style="color:var(--ba-pink);font-size:14px">&times;</span><span>Black Bull</span>
      <span class="tag" style="margin-left:auto;font-size:13px;color:var(--ba-bone-faint);letter-spacing:0;text-transform:none">Carpa Arganda</span>
    </div>
    <p class="tag" style="color:var(--ba-pink);font-size:16px;margin:18px 0 0;position:relative">Escaneaste el QR de tu mesa.</p>
    <div style="display:flex;justify-content:center;margin-top:6px"><span style="display:block;width:150px;filter:drop-shadow(0 14px 30px rgba(247,46,183,.35));animation:floaty 4.6s ease-in-out infinite">${mascota(150)}</span></div>
    <h1 class="h-display" style="font-size:34px;line-height:1.08;text-align:center;margin-top:10px">
      <span style="display:block"><span style="color:var(--ba-bone)">Lo tuyo</span> <span style="color:var(--ba-pink)">no es</span> <span style="color:var(--ba-coral)">normal.</span></span>
      <span style="display:block"><span style="color:var(--ba-bone)">Lo nuestro</span> <span style="color:var(--ba-gold)">tampoco.</span></span>
    </h1>
    <p style="text-align:center;font-size:15px;line-height:1.5;color:var(--ba-bone-dim);margin:18px auto 0;max-width:300px">Burgers con chuletón y actitud de calle. Come rico, juega, sella tu pasaporte y llévate la tuya <b style="color:var(--ba-bone)">gratis</b>.</p>
    <div style="max-width:320px;margin:22px auto 0">
      <button class="btn btn--primary btn--lg btn--block" data-go="#/carta">Ver la carta</button>
    </div>

    <p style="font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:12px;color:var(--ba-bone-faint);margin:30px 0 12px">Explora la carpa</p>
    <div style="display:flex;flex-direction:column;gap:11px">
      ${homeRow('#/carta', 'var(--ba-pink)', icons.carta, 'Carta', '6 burgers con chuletón')}
      ${homeRow('#/juega', 'var(--ba-coral)', icons.juega, 'Juega', '6 minijuegos, 1 por patrón')}
      ${homeRow('#/pasaporte', 'var(--ba-gold)', icons.pasaporte, 'Pasaporte', 'Complétalo &rarr; burger gratis')}
      <div style="display:flex;gap:11px">
        ${homeMini('#/vota', 'var(--ba-pink)', icons.vota, 'Vota', 'Tu favorita')}
        ${homeMini('#/sorteo', 'var(--ba-coral)', icons.sorteo, 'Sorteo', 'Ranking en vivo')}
      </div>
    </div>

    <div class="causa">
      <p class="t">Burgers con causa</p>
      <p class="b">Cada burger echa una mano: inserción laboral real y el sueño de un centro ocupacional de Fundación Pegasus. Comer rico nunca fue tan poco normal.</p>
    </div>
  </div>`);
}

function homeRow(goTo, color, icon, titulo, sub) {
  return `<div class="row-card" data-go="${goTo}" style="border-left:5px solid ${color}">
    <span class="r-icon" style="color:${color}">${icon}</span>
    <span style="flex:1"><span class="r-title">${titulo}</span><span class="r-sub">${sub}</span></span>
    <span class="r-chev">&rsaquo;</span>
  </div>`;
}

function homeMini(goTo, color, icon, titulo, sub) {
  return `<div data-go="${goTo}" style="flex:1;display:flex;flex-direction:column;gap:6px;background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-top:5px solid ${color};border-radius:var(--radius-md);padding:14px;cursor:pointer;box-shadow:2px 2px 0 var(--ba-black)">
    <span style="width:30px;height:30px;color:${color}">${icon}</span>
    <span style="font-family:var(--font-display);text-transform:uppercase;font-size:18px;line-height:1">${titulo}</span>
    <span style="font-size:11.5px;color:var(--ba-bone-dim)">${sub}</span>
  </div>`;
}

function scrCarta() {
  render('carta', `
  <div class="screen">
    <p class="kicker">6 burgers &middot; 6 patrones</p>
    <h2 class="h-display" style="font-size:34px;line-height:1;margin-top:4px;white-space:nowrap">La carta <span style="color:var(--ba-pink)">anormal</span></h2>
    <p class="sub">Todas con chuletón. Cada una con su patrón y su minijuego. Toca para verla.</p>
    <div style="display:flex;flex-direction:column;gap:13px;margin-top:16px">
      ${burgers().map((b) => `
      <div data-go="#/burger/${b.id}" style="display:flex;gap:13px;align-items:center;background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-radius:var(--radius-lg);padding:12px;cursor:pointer;box-shadow:4px 4px 0 var(--ba-black)">
        <span class="thumb" style="width:70px;height:70px">${mascota(62)}</span>
        <span style="flex:1;min-width:0">
          <span style="display:block;font-family:var(--font-display);text-transform:uppercase;font-size:21px;line-height:1;color:${b.tint}">${b.nombre}</span>
          <span class="tag" style="display:block;font-size:13px;color:var(--ba-bone-dim);margin:3px 0 5px">${b.mote}</span>
          <span style="display:inline-block;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:10px;color:${b.patron.color}">Patrón &middot; ${b.patron.nombre}</span>
        </span>
        <span style="flex:none;text-align:right">
          <span style="display:block;font-family:var(--font-display);font-size:22px;color:var(--ba-bone)">${DATA.evento.precioBurger}&euro;</span>
          <span style="color:var(--ba-bone-faint);font-size:22px">&rsaquo;</span>
        </span>
      </div>`).join('')}
    </div>
  </div>`);
}

function scrDetalle(id) {
  const b = byId(id);
  render('detalle', `
  <div class="screen" style="padding:36px 20px 110px">
    <button class="back" data-go="#/carta"><span class="chev">&lsaquo;</span> Carta</button>
    <div style="position:relative;border-radius:var(--radius-xl);overflow:hidden;border:2px solid var(--ba-ink-3);background-color:var(--ba-black);background-image:var(--damero);padding:22px 18px 18px;text-align:center">
      <div style="position:absolute;top:50%;left:50%;width:220px;height:220px;transform:translate(-50%,-50%);border-radius:50%;background:${b.tint};opacity:.16;filter:blur(30px)"></div>
      <span style="position:relative;display:inline-block;width:170px;animation:floaty 4.5s ease-in-out infinite">${mascota(170)}</span>
      <h2 class="h-display" style="position:relative;font-size:35px;line-height:1.05;margin-top:6px;color:${b.tint};white-space:nowrap">${b.nombre}</h2>
      <p class="tag" style="position:relative;font-size:15px;color:var(--ba-bone);margin:6px 0 0">${b.mote}</p>
    </div>
    <div style="display:flex;align-items:center;gap:10px;margin-top:16px">
      <span style="font-family:var(--font-display);font-size:34px;color:var(--ba-bone)">${DATA.evento.precioBurger}&euro;</span>
      <span class="pill">+ bebida ${DATA.evento.precioMenu}&euro;</span>
    </div>
    <p style="font-size:15px;line-height:1.55;color:var(--ba-bone-dim);margin:14px 0 0">${b.desc}</p>

    <div data-go="#/patron/${b.patron.id}" style="display:flex;align-items:center;gap:12px;margin-top:18px;background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-radius:var(--radius-lg);padding:13px 14px;cursor:pointer">
      ${logoPatron(b.patron, 44, 10) || `<span style="width:44px;height:44px;flex:none;border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:20px;color:var(--ba-ink);background:${b.patron.color}">${b.patron.nombre[0]}</span>`}
      <span style="flex:1">
        <span style="display:block;font-weight:800;text-transform:uppercase;letter-spacing:.04em;font-size:10px;color:var(--ba-bone-faint)">Patrocinada por</span>
        <span style="display:block;font-family:var(--font-display);text-transform:uppercase;font-size:19px;line-height:1;color:${b.patron.color}">${b.patron.nombre}</span>
      </span>
      <span style="color:var(--ba-bone-faint);font-size:20px">&rsaquo;</span>
    </div>

    <div style="display:flex;flex-direction:column;gap:11px;margin-top:20px">
      <button class="btn btn--primary btn--lg btn--block" data-go="#/juego/${b.id}">Juega &middot; ${b.juego.nombre}</button>
      <button class="btn btn--outline btn--lg btn--block" data-go="#/scan/${b.id}">Sella tu pasaporte</button>
    </div>
  </div>`);
}

function scrPatron(pid) {
  const b = burgers().find((x) => x.patron.id === pid) || burgers()[0];
  const p = b.patron;
  render('detalle', `
  <div class="screen screen--flush">
    <div style="position:relative;padding:44px 22px 26px;background:linear-gradient(160deg, ${p.color}, ${p.deep})">
      <button class="back" data-go="#/burger/${b.id}" style="color:rgba(255,255,255,.85);margin-bottom:0"><span class="chev">&lsaquo;</span> Volver</button>
      <div style="display:flex;align-items:center;gap:13px;margin-top:16px">
        ${p.logo
          ? `<span style="width:56px;height:56px;flex:none;border-radius:12px;background:#F6F3EE;border:2px solid rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;overflow:hidden;padding:5px"><img src="${p.logo}" alt="${p.nombre}" draggable="false" style="max-width:100%;max-height:100%;object-fit:contain" onerror="this.parentElement.style.background='rgba(255,255,255,.16)';this.style.display='none';this.nextElementSibling.style.display='flex'"><span style="width:100%;height:100%;display:none;align-items:center;justify-content:center;font-family:var(--font-display);font-size:26px;color:#fff">${p.nombre[0]}</span></span>`
          : `<span style="width:56px;height:56px;flex:none;border-radius:12px;background:rgba(255,255,255,.16);border:2px solid rgba(255,255,255,.5);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:26px;color:#fff">${p.nombre[0]}</span>`}
        <div>
          <h2 class="h-display" style="font-size:26px;line-height:1.1;color:#fff;white-space:nowrap">${p.nombre}</h2>
          <p style="font-size:12.5px;font-weight:700;color:rgba(255,255,255,.9);margin:3px 0 0">${p.tipo}</p>
        </div>
      </div>
      <span style="display:inline-block;margin-top:14px;background:rgba(0,0,0,.28);color:#fff;font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:11px;padding:5px 12px;border-radius:var(--radius-pill)">${p.sello}</span>
    </div>
    <div style="padding:22px 22px 0">
      <h3 class="h-display" style="font-size:26px;line-height:.98">Un patrón que <span style="color:${p.color}">no es normal</span></h3>
      <p style="font-size:14.5px;line-height:1.55;color:var(--ba-bone-dim);margin:10px 0 0">${p.bio}</p>

      <div data-go="#/burger/${b.id}" style="display:flex;align-items:center;gap:13px;margin-top:20px;background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-radius:var(--radius-lg);padding:12px;cursor:pointer;box-shadow:3px 3px 0 var(--ba-black)">
        <span class="thumb" style="width:56px;height:56px">${mascota(50)}</span>
        <span style="flex:1">
          <span style="display:block;font-weight:800;text-transform:uppercase;font-size:10px;letter-spacing:.04em;color:var(--ba-bone-faint)">Su burger</span>
          <span style="display:block;font-family:var(--font-display);text-transform:uppercase;font-size:20px;line-height:1;color:${b.tint}">${b.nombre}</span>
        </span>
        <span style="color:var(--ba-bone-faint);font-size:20px">&rsaquo;</span>
      </div>
      <div data-go="#/juego/${b.id}" style="display:flex;align-items:center;gap:13px;margin-top:11px;background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-top:4px solid ${p.color};border-radius:var(--radius-lg);padding:12px;cursor:pointer;box-shadow:3px 3px 0 var(--ba-black)">
        <span style="width:56px;height:56px;flex:none;border-radius:10px;display:flex;align-items:center;justify-content:center;color:${p.color};background:var(--ba-ink)"><span style="width:34px;height:34px">${gameIcons[b.juego.id]}</span></span>
        <span style="flex:1">
          <span style="display:block;font-weight:800;text-transform:uppercase;font-size:10px;letter-spacing:.04em;color:var(--ba-bone-faint)">Su minijuego</span>
          <span style="display:block;font-family:var(--font-display);text-transform:uppercase;font-size:20px;line-height:1;color:var(--ba-bone)">${b.juego.nombre}</span>
        </span>
        <span style="color:var(--ba-bone-faint);font-size:20px">&rsaquo;</span>
      </div>
      <p class="tag" style="font-size:14px;color:var(--ba-bone-faint);margin:20px 0 0;text-align:center">Gracias a ${p.nombre} por sumarse a lo anormal.</p>
    </div>
  </div>`);
}

function scrJuega() {
  render('juega', `
  <div class="screen">
    <p class="kicker">6 minijuegos</p>
    <h2 class="h-display" style="font-size:32px;line-height:1;margin-top:4px;white-space:nowrap">Juega y <span style="color:var(--ba-coral)">no es normal</span></h2>
    <p class="sub">Cada patrón trae el suyo. Puntúa alto y sube al ranking del día.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px">
      ${burgers().map((b) => `
      <div data-go="#/juego/${b.id}" style="display:flex;flex-direction:column;gap:8px;background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-top:5px solid ${b.juego.color};border-radius:var(--radius-lg);padding:15px 13px;cursor:pointer;box-shadow:4px 4px 0 var(--ba-black);min-height:150px">
        <span style="width:40px;height:40px;color:${b.juego.color}">${gameIcons[b.juego.id]}</span>
        <span style="flex:1;font-family:var(--font-display);text-transform:uppercase;font-size:18px;line-height:.98;color:var(--ba-bone)">${b.juego.nombre}</span>
        <span style="font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.03em;color:var(--ba-bone-faint)">${b.patron.nombre}</span>
        <span style="font-family:var(--font-display);font-size:13px;letter-spacing:.04em;color:${b.juego.color}">Jugar &rsaquo;</span>
      </div>`).join('')}
    </div>
  </div>`);
}

function scrJuegoInicio(id) {
  const b = byId(id);
  const j = b.juego;
  render('jini', `
  <div class="screen screen--center">
    <div style="position:absolute;top:0;left:0;right:0;height:38%;background:linear-gradient(180deg, ${j.color}, transparent);opacity:.22;pointer-events:none"></div>
    <button class="back" data-go="#/burger/${b.id}" style="position:absolute;top:38px;left:20px;margin:0"><span class="chev">&lsaquo;</span> Volver</button>
    ${b.patron.logo ? `<img src="${b.patron.logo}" alt="${b.patron.nombre}" draggable="false" style="position:relative;height:30px;max-width:130px;object-fit:contain;background:#F6F3EE;border-radius:8px;padding:4px 10px;margin-bottom:9px" onerror="this.style.display='none'">` : ''}
    <p style="position:relative;font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:${j.color};margin:0">${b.patron.nombre} presenta</p>
    <div style="position:relative;width:120px;height:120px;margin:16px 0 4px;border-radius:26px;border:3px solid ${j.color};display:flex;align-items:center;justify-content:center;color:${j.color};box-shadow:0 0 30px ${j.glow};background:var(--ba-ink-2)">
      <span style="width:62px;height:62px">${gameIcons[j.id]}</span>
    </div>
    <h1 class="h-display" style="position:relative;font-size:32px;line-height:1.05;margin-top:12px;white-space:nowrap">${j.nombre}</h1>
    <p style="position:relative;font-size:15px;line-height:1.5;color:var(--ba-bone-dim);max-width:290px;margin:12px 0 0">${j.verbo}</p>
    <p style="position:relative;font-size:12.5px;line-height:1.5;color:var(--ba-bone-faint);max-width:290px;margin:8px 0 0">${j.como}</p>
    <p class="tag" style="position:relative;font-size:14px;color:var(--ba-bone-faint);margin:14px 0 0">Récord de hoy &middot; ${recordDelDia(j.id)} pts</p>
    <div style="position:relative;margin-top:22px;width:100%;max-width:300px">
      <button class="btn btn--primary btn--lg btn--block" data-go="#/juego/${b.id}/play">Jugar ya</button>
    </div>
  </div>`);
}

function scrJugando(id) {
  const b = byId(id);
  const j = b.juego;
  const def = GAMES[j.id];
  render('jplay', `
  <div class="screen screen--game">
    <div class="ghud">
      <span><span class="cap">Puntos</span><span class="score" id="g-score" style="color:${j.color}">0</span></span>
      <span class="gname">${j.nombre}</span>
      <span style="text-align:right"><span class="cap">Vidas</span><span class="lives" id="g-lives">&hearts;&hearts;&hearts;</span></span>
    </div>
    <div class="gtimer"><i id="g-timer" style="background:${j.color}"></i></div>
    <div class="gcanvas-wrap" style="background:radial-gradient(circle at 50% 45%, ${hexA(j.color, 0.14)}, transparent 62%)">
      <canvas id="g-canvas"></canvas>
    </div>
    <div class="gfoot">
      <button class="btn btn--secondary btn--lg btn--block" id="g-end">Terminar</button>
    </div>
  </div>`);

  const scoreEl = document.getElementById('g-score');
  const livesEl = document.getElementById('g-lives');
  const timerEl = document.getElementById('g-timer');

  engine = startGame(document.getElementById('g-canvas'), { ...def, logo: b.patron.logo }, {
    setScore(s) { scoreEl.textContent = fmt(s); },
    setLives(v) { livesEl.innerHTML = '&hearts;'.repeat(Math.max(0, v)) || '&mdash;'; },
    setTime(f) { timerEl.style.width = `${(f * 100).toFixed(1)}%`; },
    onEnd(score) {
      store.guardarPuntuacion(j.id, score);
      store.ultimoResultado = { juegoId: j.id, burgerId: b.id, score };
      engine = null;
      go(`#/juego/${b.id}/fin`);
    },
  });

  document.getElementById('g-end').addEventListener('click', () => {
    if (engine) engine.finishNow();
  });
}

function scrResultado(id) {
  const b = byId(id);
  const j = b.juego;
  const res = store.ultimoResultado;
  const score = res && res.juegoId === j.id ? res.score : store.mejorPuntuacion(j.id);
  const { rows, miPuesto } = boardDe(j.id, score);

  render('jres', `
  <div class="screen" style="padding:40px 22px 40px;text-align:center">
    ${confettiHTML()}
    <p style="position:relative;font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:${j.color};margin:0">${j.nombre}</p>
    <p style="position:relative;font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:13px;color:var(--ba-bone-dim);margin:16px 0 2px">Tu puntuación</p>
    <h1 style="position:relative;font-family:var(--font-display);font-size:70px;line-height:.9;margin:0;color:${j.color};text-shadow:0 0 26px ${j.glow}">${fmt(score)}</h1>
    <p class="tag" style="position:relative;font-size:16px;color:var(--ba-coral);margin:6px 0 0">Puesto #${miPuesto} de hoy</p>

    <div style="position:relative;text-align:left;margin:22px 0 0;display:flex;flex-direction:column;gap:8px">
      <p style="font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:11px;color:var(--ba-bone-faint);margin:0 0 2px">Ranking del día</p>
      ${rows.map((r, i) => `
      <div class="lb-row ${r.me ? 'me' : ''}">
        <span class="n">${i + 1}</span>
        <span class="nick">${r.nick}</span>
        <span class="sc">${fmt(r.score)}</span>
      </div>`).join('')}
    </div>

    <div style="position:relative;display:flex;flex-direction:column;gap:11px;margin-top:22px">
      <button class="btn btn--primary btn--lg btn--block" data-go="#/juego/${b.id}/play">Otra partida</button>
      <button class="btn btn--outline btn--md btn--block" data-go="#/scan/${b.id}">Sella tu pasaporte</button>
      <button class="linklike" data-go="#/juega">Elegir otro juego</button>
    </div>
  </div>`);
}

function scrPasaporte(reciente) {
  const sellados = store.sellos;
  const n = store.contarSellos(ids());
  const completo = n === 6;

  render('pasaporte', `
  <div class="screen">
    <p class="kicker">Colecciona las 6</p>
    <h2 class="h-display" style="font-size:36px;line-height:.94;margin-top:4px">Tu <span style="color:var(--ba-pink)">pasaporte</span></h2>
    <div style="display:flex;align-items:center;gap:12px;margin-top:14px">
      <div class="meter" style="flex:1"><i style="width:${Math.round((n / 6) * 100)}%"></i></div>
      <span style="font-family:var(--font-display);font-size:20px;color:var(--ba-bone)">${n}/6</span>
    </div>
    <div class="stamps">
      ${burgers().map((b) => {
        const on = !!sellados[b.id];
        return `<div class="stamp-cell ${on ? 'on' : ''}" style="${on ? `border-color:${b.tint}` : ''}">
          ${mascota(56)}
          <span class="s-name">${b.nombre}</span>
          <span class="s-label">${on ? 'Sellada' : 'Sin sellar'}</span>
          ${on ? `<span class="s-ok" style="background:${b.tint === 'var(--ba-bone)' ? 'var(--ba-gold)' : b.tint}">OK</span>` : ''}
        </div>`;
      }).join('')}
    </div>

    ${completo ? `
    <div style="margin-top:18px;text-align:center;background:var(--ba-ink-2);border:2px solid var(--ba-pink);border-radius:var(--radius-lg);padding:16px;box-shadow:0 0 26px rgba(247,46,183,.28)">
      <p style="font-family:var(--font-display);text-transform:uppercase;font-size:20px;color:var(--ba-bone);margin:0 0 12px">¡Las tienes las 6!</p>
      <button class="btn btn--primary btn--lg btn--block" data-go="#/premio">Reclamar burger gratis</button>
    </div>` : `
    <div style="margin-top:18px">
      <p style="font-size:13.5px;line-height:1.5;color:var(--ba-bone-dim);margin:0 0 12px">Sella una casilla por cada burger que te comas, escaneando su QR. Cuando tengas las 6, <b style="color:var(--ba-bone)">tu burger es gratis</b>.</p>
      <div style="display:flex;flex-direction:column;gap:9px">
        <button class="btn btn--outline btn--md btn--block" data-go="#/scan">Escanear QR de tu burger</button>
        <button class="btn btn--ghost btn--md btn--block" id="demo-fill">Demo: completar pasaporte</button>
      </div>
    </div>`}
  </div>`);

  document.getElementById('demo-fill')?.addEventListener('click', () => {
    store.sellarTodo(ids());
    scrPasaporte();
    toast('Demo: pasaporte completado');
  });
}

function scrPremio() {
  const n = store.contarSellos(ids());
  if (n < 6) return go('#/pasaporte');
  render('premio', `
  <div class="screen screen--center">
    ${confettiHTML()}
    <img src="assets/splash-pink.png" alt="" style="position:absolute;bottom:20px;left:-50px;width:210px;opacity:.3;pointer-events:none">
    <span style="position:relative;display:inline-block;width:135px;animation:floaty 4s ease-in-out infinite">${mascota(135)}</span>
    <p style="position:relative;font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:12px;color:var(--ba-bone-dim);margin:16px 0 0">Pasaporte completo</p>
    <h1 class="h-display" style="position:relative;font-size:42px;line-height:1.04;margin-top:6px"><span style="display:block">Tu burger es</span><span style="display:block;color:var(--ba-pink);text-shadow:var(--glow-pink)">gratis</span></h1>
    <p style="position:relative;font-size:14px;color:var(--ba-bone-dim);margin:12px 0 16px">Enseña este código en la barra:</p>
    <div style="position:relative;border:2px dashed var(--ba-pink);border-radius:var(--radius-lg);padding:16px 26px;background:var(--ba-ink-2);box-shadow:var(--glow-pink)">
      <span style="font-family:var(--font-display);font-size:32px;letter-spacing:.08em;color:var(--ba-bone)">${store.codigoPremio}</span>
    </div>
    <p style="position:relative;font-size:12px;color:var(--ba-bone-faint);margin:16px 0 0">Válido hoy &middot; una por persona &middot; sin trampa</p>
    <div style="position:relative;margin-top:24px;width:100%;max-width:300px">
      <button class="btn btn--outline btn--lg btn--block" data-go="#/">Volver al inicio</button>
    </div>
  </div>`);
  // TODO BACKEND: validar el código en barra (marcar como canjeado, una por persona).
}

function scrVota() {
  const votado = store.votado;
  render('vota', `
  <div class="screen">
    <p class="kicker">Vota una. Solo una.</p>
    <h2 class="h-display" style="font-size:32px;line-height:1.06;margin-top:4px"><span style="display:block">¿Cuál es la más</span><span style="display:block;color:var(--ba-coral)">anormal?</span></h2>
    <p class="sub">${votado ? 'Ya has votado. Tu voto suma al ranking en vivo.' : 'Tu voto suma al ranking en vivo y te mete en el sorteo.'}</p>
    <div style="display:flex;flex-direction:column;gap:11px;margin-top:16px">
      ${burgers().map((b) => {
        const esMiVoto = votado === b.id;
        return `
      <div class="vote-row" data-vote="${b.id}" style="display:flex;align-items:center;gap:13px;background:var(--ba-ink-2);border:2px solid ${esMiVoto ? 'var(--ba-pink)' : 'var(--border-hairline)'};border-radius:var(--radius-lg);padding:12px 13px;cursor:${votado ? 'default' : 'pointer'};box-shadow:3px 3px 0 var(--ba-black);${votado && !esMiVoto ? 'opacity:.55' : ''}">
        <span class="thumb" style="width:50px;height:50px">${mascota(44)}</span>
        <span style="flex:1;min-width:0">
          <span style="display:block;font-family:var(--font-display);text-transform:uppercase;font-size:19px;line-height:1;color:${b.tint}">${b.nombre}</span>
          <span class="tag" style="display:block;font-size:12.5px;color:var(--ba-bone-dim);margin-top:2px">${b.mote}</span>
        </span>
        <span style="flex:none;font-family:var(--font-display);text-transform:uppercase;font-size:14px;color:var(--ba-ink);background:${esMiVoto ? 'var(--ba-gold)' : 'var(--ba-pink)'};padding:7px 14px;border-radius:var(--radius-pill);box-shadow:2px 2px 0 var(--ba-black)">${esMiVoto ? 'Tu voto' : 'Votar'}</span>
      </div>`;
      }).join('')}
    </div>
    ${votado ? `<div style="margin-top:16px"><button class="btn btn--outline btn--md btn--block" data-go="#/sorteo">Ver ranking en vivo</button></div>` : ''}
  </div>`);

  if (!votado) {
    root().querySelectorAll('[data-vote]').forEach((el) =>
      el.addEventListener('click', () => {
        if (store.votar(el.dataset.vote)) go('#/votado');
        // TODO BACKEND: registrar el voto en servidor (control 1 voto/persona real).
      }));
  }
}

function scrVotaOk() {
  const b = byId(store.votado || burgers()[0].id);
  render('votado', `
  <div class="screen screen--center">
    ${confettiHTML()}
    <img src="assets/smiley-spray.png" alt="" style="position:relative;width:116px;animation:pulse 1.2s ease-in-out infinite">
    <p style="position:relative;font-weight:800;text-transform:uppercase;letter-spacing:.06em;font-size:13px;color:var(--ba-bone-dim);margin:18px 0 6px">Has votado a</p>
    <h1 class="h-display" style="position:relative;font-size:42px;line-height:.92;color:var(--ba-pink);text-shadow:var(--glow-pink)">${b.nombre}</h1>
    <p class="tag" style="position:relative;font-size:17px;color:var(--ba-coral);margin:10px 0 0">Gracias por mojarte.</p>
    <div style="position:relative;display:flex;flex-direction:column;gap:11px;margin-top:26px;width:100%;max-width:300px">
      <button class="btn btn--primary btn--lg btn--block" data-go="#/sorteo">Ver ranking en vivo</button>
      <button class="btn btn--outline btn--md btn--block" data-go="#/carta">Volver a la carta</button>
    </div>
  </div>`);
}

function scrSorteo() {
  const v = votos();
  const total = Object.values(v).reduce((a, c) => a + c, 0);
  const orden = [...burgers()].sort((a, b) => v[b.id] - v[a.id]);
  const maxV = v[orden[0].id];
  const reg = store.registro;
  const apuntados = DATA.sorteo.apuntadosBase + (reg ? 1 : 0);

  render('sorteo', `
  <div class="screen">
    <p class="kicker kicker--coral"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--ba-coral);animation:blink 1.2s infinite;margin-right:6px"></span>En directo</p>
    <h2 class="h-display" style="font-size:34px;line-height:.94;margin-top:4px">Ranking <span style="color:var(--ba-pink)">+ sorteo</span></h2>

    ${reg ? `<div class="okbox">Ya estás dentro del sorteo. Tu número: <b>nº ${String(reg.numero).padStart(3, '0')}</b>.</div>` : ''}

    <div style="margin-top:14px;background:var(--ba-ink-2);border:2px solid var(--ba-gold);border-radius:var(--radius-lg);padding:16px;box-shadow:4px 4px 0 var(--ba-black)">
      <p style="font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:11px;color:var(--ba-gold);margin:0">Sorteo de hoy</p>
      <p style="font-family:var(--font-display);text-transform:uppercase;font-size:24px;line-height:1;margin:6px 0 0;color:var(--ba-bone)">${DATA.sorteo.premio}</p>
      <p style="font-size:13px;color:var(--ba-bone-dim);margin:5px 0 0">${DATA.sorteo.extra}</p>
      <div style="display:flex;gap:10px;margin-top:14px;text-align:center">
        <div style="flex:1;background:var(--ba-ink);border:2px solid var(--ba-ink-3);border-radius:var(--radius-md);padding:8px 4px"><span style="display:block;font-family:var(--font-display);font-size:22px;color:var(--ba-bone)">${apuntados}</span><span style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--ba-bone-faint)">Apuntados</span></div>
        <div style="flex:1;background:var(--ba-ink);border:2px solid var(--ba-ink-3);border-radius:var(--radius-md);padding:8px 4px"><span style="display:block;font-family:var(--font-display);font-size:22px;color:var(--ba-gold)" id="cuenta">--:--:--</span><span style="font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--ba-bone-faint)">Cierra en</span></div>
      </div>
      <div style="margin-top:12px">
        ${reg
          ? `<button class="btn btn--primary btn--md btn--block" disabled>Ya estás dentro</button>`
          : `<button class="btn btn--primary btn--md btn--block" data-go="#/registro">Entrar al sorteo</button>`}
      </div>
    </div>

    <p style="font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:11px;color:var(--ba-bone-faint);margin:24px 0 12px">Ranking en vivo &middot; ${fmt(total)} votos</p>
    <div style="display:flex;flex-direction:column;gap:14px">
      ${orden.map((b, i) => `
      <div>
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px">
          <span style="font-family:var(--font-display);text-transform:uppercase;font-size:16px;color:var(--ba-bone)">${i + 1} &middot; ${b.nombre}</span>
          <span style="font-family:var(--font-display);font-size:17px;color:var(--ba-bone)">${Math.round((v[b.id] / total) * 100)}%</span>
        </div>
        <div class="meter meter--rank"><i style="width:${Math.round((v[b.id] / maxV) * 100)}%;background:${b.tint};animation-duration:1s"></i></div>
      </div>`).join('')}
    </div>
    <p style="font-size:12px;color:var(--ba-bone-faint);margin:18px 0 0;text-align:center">Último ganador &middot; ${DATA.sorteo.ultimoGanador}</p>
  </div>`);

  // cuenta atrás hasta el cierre de hoy (23:59)
  const el = document.getElementById('cuenta');
  const tick = () => {
    const now = new Date();
    const fin = new Date(now); fin.setHours(23, 59, 59, 999);
    let s = Math.max(0, Math.floor((fin - now) / 1000));
    const hh = String(Math.floor(s / 3600)).padStart(2, '0');
    const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
    const ss = String(s % 60).padStart(2, '0');
    if (el) el.textContent = `${hh}:${mm}:${ss}`;
  };
  tick();
  timers.push(setInterval(tick, 1000));
  // TODO BACKEND: nº de apuntados y ranking reales en vivo (websocket/polling).
}

function scrRegistro() {
  if (store.registro) return go('#/sorteo');
  render('registro', `
  <div class="screen" style="padding:36px 22px 40px">
    <button class="back" data-go="#/sorteo"><span class="chev">&lsaquo;</span> Sorteo</button>
    <h2 class="h-display" style="font-size:36px;line-height:.92">Entra al <span style="color:var(--ba-pink)">sorteo</span></h2>
    <p style="font-size:14px;line-height:1.5;color:var(--ba-bone-dim);margin:10px 0 20px">Déjanos un contacto y estás dentro. Nada de spam, palabra.</p>
    <form id="reg-form" style="display:flex;flex-direction:column;gap:16px" novalidate>
      <div class="field">
        <label for="reg-email">Email</label>
        <input id="reg-email" type="email" inputmode="email" autocomplete="email" placeholder="tucorreo@ejemplo.com">
      </div>
      <div class="field">
        <label for="reg-tel">Móvil (opcional)</label>
        <input id="reg-tel" type="tel" inputmode="tel" autocomplete="tel" placeholder="600 00 00 00">
      </div>
      <div style="background:var(--ba-ink-2);border:2px solid var(--border-hairline);border-radius:var(--radius-md);padding:13px">
        <label class="check">
          <input type="checkbox" id="reg-consent">
          <span class="box"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12.5 9.5 18 20 6.5"/></svg></span>
          <span>Acepto que Fundación Pegasus guarde mis datos para el sorteo y para avisarme si gano.</span>
        </label>
      </div>
      <p style="font-size:11px;line-height:1.5;color:var(--ba-bone-faint);margin:0">Responsable: Fundación Pegasus. Fines: gestión del sorteo y comunicación del evento. Legitimación: tu consentimiento. Derechos: acceso, rectificación y supresión en hola@fundacionpegasus.org. No cedemos tus datos a terceros. (RGPD / LOPDGDD)</p>
      <button class="btn btn--primary btn--lg btn--block" id="reg-submit" type="submit" disabled>Apúntame</button>
    </form>
  </div>`);

  const email = document.getElementById('reg-email');
  const tel = document.getElementById('reg-tel');
  const consent = document.getElementById('reg-consent');
  const submit = document.getElementById('reg-submit');

  const valida = () => {
    const ok = consent.checked && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
    submit.disabled = !ok;
  };
  email.addEventListener('input', valida);
  consent.addEventListener('change', valida);

  document.getElementById('reg-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (submit.disabled) return;
    const numero = DATA.sorteo.apuntadosBase + 1;
    store.registrar({ email: email.value.trim(), tel: tel.value.trim(), consentimiento: true }, numero);
    // TODO BACKEND: POST del lead + consentimiento con timestamp (prueba RGPD) y nº real de participante.
    toast(`Estás dentro. Tu número: nº ${String(numero).padStart(3, '0')}`);
    go('#/sorteo');
  });
}

function scrScan(burgerId) {
  const b = burgerId ? byId(burgerId) : null;
  const sinSellar = burgers().filter((x) => !store.sellos[x.id]);
  render('scan', `
  <div class="screen" style="padding:36px 22px 40px">
    <button class="back" data-go="${b ? `#/burger/${b.id}` : '#/pasaporte'}"><span class="chev">&lsaquo;</span> Volver</button>
    <h2 class="h-display" style="font-size:32px;line-height:.94">Sella tu <span style="color:var(--ba-pink)">pasaporte</span></h2>
    <p class="sub">Apunta al QR que viene con tu burger${b ? ` (${b.nombre})` : ''}. Un sello por burger.</p>
    <div class="scanbox" id="scanbox">
      <video id="scan-video" playsinline muted></video>
      <div class="aim"><i></i></div>
    </div>
    <p id="scan-msg" style="font-size:12.5px;color:var(--ba-bone-faint);margin:12px 0 0;text-align:center"></p>
    <div style="margin-top:18px">
      <p style="font-weight:800;text-transform:uppercase;letter-spacing:.05em;font-size:11px;color:var(--ba-bone-faint);margin:0 0 9px">Demo · simular sellado</p>
      <div style="display:flex;flex-wrap:wrap;gap:8px">
        ${sinSellar.length ? sinSellar.map((x) =>
          `<button class="pill" data-go="#/sello/${x.id}" style="cursor:pointer;color:${x.tint};border-color:var(--ba-ink-4);background:var(--ba-ink-2);font-family:var(--font-body)">${x.nombre}</button>`
        ).join('') : '<span style="font-size:12.5px;color:var(--ba-bone-faint)">Ya lo tienes todo sellado.</span>'}
      </div>
    </div>
  </div>`);

  const msg = document.getElementById('scan-msg');
  const video = document.getElementById('scan-video');

  if (!qrSoportado()) {
    document.getElementById('scanbox').style.display = 'none';
    msg.textContent = 'Este navegador no soporta el lector QR nativo. Usa la simulación de abajo (en producción: fallback jsQR).';
    return;
  }

  iniciarScanner(video, (raw) => {
    const id = parseCodigoSello(raw, ids());
    if (id) {
      go(`#/sello/${id}`);
    } else {
      msg.textContent = 'QR no reconocido. Busca el QR de tu burger.';
    }
  }).then((s) => { scanner = s; })
    .catch(() => {
      document.getElementById('scanbox').style.display = 'none';
      msg.textContent = 'No hay permiso de cámara. Usa la simulación de abajo.';
    });
}

function doSello(id) {
  if (!ids().includes(id)) return go('#/pasaporte');
  const b = byId(id);
  const nuevo = store.sellar(id);
  const n = store.contarSellos(ids());
  location.hash = '#/pasaporte';
  setTimeout(() => {
    if (!nuevo) toast(`${b.nombre} ya estaba sellada`);
    else if (n === 6) toast('¡PASAPORTE COMPLETO! Reclama tu burger gratis');
    else toast(`¡Sellada! ${b.nombre} &middot; ${n}/6`);
  }, 60);
}

/* ================= Arranque ================= */

async function init() {
  try {
    const res = await fetch('data/burgers.json');
    DATA = await res.json();
  } catch (e) {
    root().innerHTML = `<div class="screen screen--center"><p style="color:var(--ba-bone-dim);font-size:14px;max-width:280px">No se pudieron cargar los datos.<br>Sirve la web con un servidor local (ver README): <b>npx serve</b></p></div>`;
    return;
  }
  window.addEventListener('hashchange', route);
  route();
}

function hexA(hex, a) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${a})`;
}

init();

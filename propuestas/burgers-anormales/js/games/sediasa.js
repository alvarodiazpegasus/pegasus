/* A TODA MÁQUINA — Sediasa Alimentación (Grupo Fuertes)
   Sediasa fracciona y envasa carne, charcutería y elaborados para la gran
   distribución en plantas robotizadas (IFS, sin gluten).
   Mecánica: una cinta transportadora baja bandejas de producto hacia la
   selladora. TOCA (en cualquier sitio) justo cuando la bandeja entra en la
   ZONA DE SELLADO para envasarla. Sellado dentro de la zona = puntos + racha;
   clavado en el centro = "¡Sellado perfecto!" (bonus). Bandeja que pasa la
   zona sin sellar = producto no apto -> pierdes vida. Bandeja dorada
   "SIN GLUTEN / IFS" = bonus (guiño a sus certificaciones).
   Dificultad (curva global): la cinta acelera y la ventana de sellado se
   estrecha. Racha por cada bandeja sellada seguida. */

import { rr, watermark, anton, barlow } from './engine.js';

const INK2 = '#221E1E', INK3 = '#2E2929', BONE = '#F2EFEA', FAINT = '#8C8681',
  STEEL = '#2E7CB8', STEEL_LO = '#17547E', GOLD = '#F4C430', CORAL = '#F94A4A',
  MEAT = '#C0392B', MEAT_HI = '#E45C4C', CHARC = '#B65563', TRAY = '#3A3434';

const RAIL = 12;             // ancho de los raíles laterales de la cinta

/* Tipos de producto Sediasa que van en las bandejas (visual). */
const PRODUCTOS = ['carne', 'burger', 'charcuteria'];

export default {
  id: 'sediasa',
  color: STEEL,
  vidas: 3,

  init(g) {
    g.data = {
      bandejas: [],
      spawnT: 0.6,
      n: 0,
      sellados: 0,     // bandejas enviadas al lineal
      pulse: 0,        // animación de la selladora al sellar
      rungOff: 0,      // desplazamiento de los travesaños de la cinta
    };
  },

  pointer(g, ev) {
    if (ev.type !== 'down') return;
    const d = g.data;
    const hy = headY(g), tol = ventana(g);
    // bandeja viva sin sellar más centrada en la zona de sellado
    let mejor = null, md = Infinity;
    for (const b of d.bandejas) {
      if (b.sellada || b.fallada) continue;
      const dy = b.y - hy;
      if (Math.abs(dy) <= tol) {
        if (Math.abs(dy) < md) { md = Math.abs(dy); mejor = b; }
      }
    }
    d.pulse = 0.28;
    if (!mejor) return;   // sellado en vacío: sin castigo, solo baja la selladora
    mejor.sellada = true;
    mejor.sealT = 0;
    const perfecto = md < tol * 0.4;
    if (mejor.oro) {
      g.hit(perfecto ? 260 : 180, mejor.x, mejor.y, perfecto ? '¡SIN GLUTEN perfecto!' : 'SIN GLUTEN ¡bonus!');
    } else {
      g.hit(perfecto ? 150 : 90, mejor.x, mejor.y, perfecto ? '¡Sellado perfecto!' : '¡Sellada!');
    }
  },

  update(g, dt) {
    const d = g.data;
    if (d.pulse > 0) d.pulse -= dt;

    // velocidad de la cinta (acelera con la curva global)
    const v = g.esc(g.h * 0.26, g.h * 0.72);
    d.rungOff = (d.rungOff + v * dt) % 34;

    // salida de bandejas: cada vez más seguidas, pero nunca montando una
    // bandeja sobre otra (se comprueba la más alta = la recién salida).
    d.spawnT -= dt;
    const topY = Math.min(...d.bandejas.map((b) => b.y), Infinity);
    if (d.spawnT <= 0 && topY > lanzarY(g) + trayH(g) + 26) {
      lanzar(g);
      d.spawnT = g.esc(1.5, 0.62) * g.rnd(0.9, 1.1);
    }

    const hy = headY(g), tol = ventana(g);
    for (const b of d.bandejas) {
      b.y += v * dt;
      if (b.sellada && b.sealT !== undefined) b.sealT += dt;
      // ha pasado la zona sin sellar -> producto no apto (una sola vez)
      if (!b.sellada && !b.fallada && b.y - b.h / 2 > hy + tol) {
        b.fallada = true;
        g.loseLife(b.x, hy + tol + 10, '¡Sin sellar!');
      }
      // bandeja sellada que llega abajo -> al lineal
      if (b.sellada && !b.contada && b.y - b.h / 2 > g.h - 6) {
        b.contada = true;
        d.sellados += 1;
      }
    }
    d.bandejas = d.bandejas.filter((b) => b.y - b.h / 2 < g.h + 40);
  },

  draw(g, ctx) {
    const d = g.data;
    const hy = headY(g), tol = ventana(g);

    // ---- cinta transportadora ----
    ctx.fillStyle = 'rgba(46,124,184,.05)';
    ctx.fillRect(0, 0, g.w, g.h);
    // raíles laterales
    ctx.fillStyle = INK2;
    ctx.fillRect(0, 0, RAIL, g.h);
    ctx.fillRect(g.w - RAIL, 0, RAIL, g.h);
    // travesaños de la cinta (dan sensación de avance)
    ctx.strokeStyle = 'rgba(242,239,234,.06)';
    ctx.lineWidth = 3;
    for (let y = (d.rungOff % 34) - 34; y < g.h; y += 34) {
      ctx.beginPath(); ctx.moveTo(RAIL, y); ctx.lineTo(g.w - RAIL, y); ctx.stroke();
    }

    // ---- zona de sellado (guías) ----
    ctx.fillStyle = `rgba(46,124,184,${0.10 + (d.pulse > 0 ? 0.10 : 0)})`;
    ctx.fillRect(RAIL, hy - tol, g.w - RAIL * 2, tol * 2);
    ctx.strokeStyle = 'rgba(46,124,184,.55)';
    ctx.lineWidth = 2;
    for (const yy of [hy - tol, hy + tol]) {
      ctx.beginPath(); ctx.setLineDash([7, 6]); ctx.moveTo(RAIL, yy); ctx.lineTo(g.w - RAIL, yy); ctx.stroke();
    }
    ctx.setLineDash([]);

    // ---- bandejas ----
    for (const b of d.bandejas) bandeja(ctx, b, g);

    // ---- selladora (máquina que baja al sellar) ----
    const pressDown = d.pulse > 0 ? (1 - Math.abs(d.pulse - 0.14) / 0.14) * 10 : 0;
    ctx.save();
    ctx.fillStyle = INK3;
    // cabezal a cada lado, dejando ver la bandeja en el centro
    const headH = 26;
    ctx.fillStyle = STEEL_LO;
    rr(ctx, RAIL, hy - headH / 2 - pressDown, g.w - RAIL * 2, 6, 3); ctx.fill();
    // pistones
    ctx.fillStyle = '#4A4444';
    for (const px of [g.w * 0.5]) {
      ctx.fillRect(px - 3, hy - headH / 2 - pressDown - 14, 6, 14);
    }
    // etiqueta de la selladora
    ctx.fillStyle = STEEL;
    rr(ctx, g.w / 2 - 58, hy - headH / 2 - pressDown - 30, 116, 18, 5); ctx.fill();
    barlow(ctx, 10, 900);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText('SEDIASA · SELLADO', g.w / 2, hy - headH / 2 - pressDown - 17);
    ctx.restore();

    // ---- contador de producción abajo ----
    barlow(ctx, 11, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'left';
    ctx.fillText(`AL LINEAL · ${d.sellados}`, RAIL + 6, g.h - 30);

    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('TOCA AL ENTRAR EN LA ZONA DE SELLADO', g.w / 2, g.h - 12);

    watermark(g, ctx, 'Sediasa · listo para el lineal');
  },
};

/* Geometría dependiente del tamaño del canvas */
function headY(g) { return g.h * 0.60; }
function ventana(g) { return g.esc(50, 30); }   // media-altura de la ventana de sellado (se estrecha)
function trayH(g) { return Math.min(g.h * 0.13, 84); }
function lanzarY(g) { return -trayH(g) / 2 - 6; }

function lanzar(g) {
  const d = g.data;
  d.n += 1;
  const h = trayH(g);
  const w = Math.min(g.w * 0.56, 196);
  const oro = Math.random() < 0.16;   // bandeja "sin gluten / IFS"
  d.bandejas.push({
    x: g.w / 2,
    y: lanzarY(g),
    w, h,
    prod: g.pick(PRODUCTOS),
    oro,
    sellada: false,
    fallada: false,
  });
}

/* Dibuja una bandeja: base de plástico + producto Sediasa dentro.
   Sin sellar = abierta; sellada = film transparente con brillo + "OK". */
function bandeja(ctx, b, g) {
  const { w, h } = b;
  ctx.save();
  ctx.translate(b.x, b.y);

  const x = -w / 2, y = -h / 2;

  // base de la bandeja
  ctx.fillStyle = b.oro ? '#5A4A1E' : TRAY;
  rr(ctx, x, y, w, h, 9); ctx.fill();
  ctx.strokeStyle = b.oro ? GOLD : (b.fallada ? CORAL : '#4A4444');
  ctx.lineWidth = b.oro ? 3 : 2;
  rr(ctx, x, y, w, h, 9); ctx.stroke();

  // hueco interior
  ctx.fillStyle = '#151313';
  rr(ctx, x + 8, y + 8, w - 16, h - 16, 6); ctx.fill();

  // producto
  ctx.save();
  ctx.beginPath(); rr(ctx, x + 8, y + 8, w - 16, h - 16, 6); ctx.clip();
  producto(ctx, b.prod, w, h);
  ctx.restore();

  // film de sellado
  if (b.sellada) {
    const a = Math.min(1, (b.sealT ?? 1) / 0.18);
    ctx.globalAlpha = 0.42 * a;
    ctx.fillStyle = STEEL;
    rr(ctx, x + 6, y + 6, w - 12, h - 12, 7); ctx.fill();
    ctx.globalAlpha = 0.9 * a;
    // brillo diagonal del film
    ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x + w * 0.2, y + 8); ctx.lineTo(x + w * 0.44, y + h - 8); ctx.stroke();
    ctx.globalAlpha = 1;
    // sello OK
    ctx.fillStyle = b.oro ? GOLD : '#35C46A';
    rr(ctx, w / 2 - 30, -11, 34, 22, 5); ctx.fill();
    barlow(ctx, 12, 900);
    ctx.fillStyle = b.oro ? '#3A2E06' : '#0E2A18'; ctx.textAlign = 'center';
    ctx.fillText('OK', w / 2 - 13, 4);
  }

  // etiqueta lateral de marca / sin gluten
  if (b.oro) {
    ctx.fillStyle = GOLD;
    rr(ctx, x + 6, y + 6, 8, h - 12, 3); ctx.fill();
    ctx.save();
    ctx.translate(x + 4, 0); ctx.rotate(-Math.PI / 2);
    barlow(ctx, 9, 900); ctx.fillStyle = GOLD; ctx.textAlign = 'center';
    ctx.fillText('SIN GLUTEN', 0, 2);
    ctx.restore();
  } else {
    barlow(ctx, 8, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'left';
    ctx.fillText('SEDIASA', x + 12, y + h - 6);
  }

  ctx.restore();
}

/* Producto dentro de la bandeja según su tipo. */
function producto(ctx, tipo, w, h) {
  if (tipo === 'carne') {
    // dos filetes/medallones
    for (const dx of [-w * 0.16, w * 0.16]) {
      ctx.fillStyle = MEAT;
      ctx.beginPath(); ctx.ellipse(dx, 0, w * 0.16, h * 0.24, 0, 0, 7); ctx.fill();
      ctx.fillStyle = MEAT_HI;
      ctx.beginPath(); ctx.ellipse(dx - w * 0.03, -h * 0.05, w * 0.07, h * 0.09, 0, 0, 7); ctx.fill();
    }
  } else if (tipo === 'burger') {
    // hamburguesas apiladas (producto estrella)
    ctx.fillStyle = '#C98A3B';
    rr(ctx, -w * 0.24, -h * 0.22, w * 0.48, h * 0.14, 6); ctx.fill();
    ctx.fillStyle = MEAT;
    rr(ctx, -w * 0.22, -h * 0.06, w * 0.44, h * 0.14, 4); ctx.fill();
    ctx.fillStyle = '#C98A3B';
    rr(ctx, -w * 0.24, h * 0.10, w * 0.48, h * 0.12, 5); ctx.fill();
  } else {
    // charcutería: lonchas curadas
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i % 2 ? CHARC : '#C96C74';
      ctx.beginPath();
      ctx.ellipse(-w * 0.18 + i * w * 0.18, i % 2 ? -h * 0.05 : h * 0.05, w * 0.12, h * 0.2, 0.2, 0, 7);
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      ctx.beginPath();
      ctx.ellipse(-w * 0.18 + i * w * 0.18, i % 2 ? -h * 0.05 : h * 0.05, w * 0.03, h * 0.05, 0, 0, 7);
      ctx.fill();
    }
  }
}

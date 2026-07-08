/* IMPRESIÓN PERFECTA — DIN Impresores (imprenta de Arganda, desde 1973)
   Mecánica: control de calidad a pie de offset. Los pliegos salen de la
   máquina y bajan hacia la pila. Toca los DEFECTUOSOS (mancha, mal registro
   de color, tinta pálida) para retirarlos; los buenos, déjalos pasar.
   Defecto que llega a la pila o pliego bueno retirado = pierdes vida.
   Dificultad (curva global): la máquina escupe pliegos cada vez más rápido
   y los defectos son cada vez más sutiles (manchas más pequeñas, registro
   casi clavado). Racha por cada defecto cazado. */

import { rr, watermark, anton, barlow } from './engine.js';

const INK2 = '#221E1E', INK3 = '#2E2929', BONE = '#F2EFEA', FAINT = '#8C8681',
  PAPER = '#F7F4EC', DIN = '#E14E10',
  CMYK = ['#2BB3C0', '#D1348B', '#E8C531', '#2A2A2A'];

const PRESS_H = 62;          // alto de la máquina offset (arriba)
const PILA_H = 86;           // zona de la pila (abajo)

export default {
  id: 'imprenta',
  color: '#E14E10',
  vidas: 3,

  init(g) {
    g.data = {
      pliegos: [],
      fuera: [],       // pliegos retirados (animación de salida)
      spawnT: 0.7,
      n: 0,
      buenos: 0,       // pliegos buenos apilados
    };
  },

  pointer(g, ev) {
    if (ev.type !== 'down') return;
    const d = g.data;
    // pliego vivo más cercano al toque (con margen táctil generoso)
    let mejor = null, md = Infinity;
    for (const p of d.pliegos) {
      const dx = ev.x - p.x, dy = ev.y - p.y;
      if (Math.abs(dx) < p.w / 2 + 22 && Math.abs(dy) < p.h / 2 + 20) {
        const dist = dx * dx + dy * dy;
        if (dist < md) { md = dist; mejor = p; }
      }
    }
    if (!mejor) return;
    mejor.gone = true;
    if (mejor.defecto) {
      const rapido = mejor.y < g.h * 0.45;
      g.hit(rapido ? 160 : 90, mejor.x, mejor.y, rapido ? '¡Ojo de lince!' : '¡Fuera!');
      d.fuera.push({ ...mejor, vx: -g.rnd(380, 520), vr: -g.rnd(2, 4), t: 0 });
    } else {
      g.loseLife(mejor.x, mejor.y, '¡Ese era bueno!');
      d.fuera.push({ ...mejor, vx: g.rnd(380, 520), vr: g.rnd(2, 4), t: 0 });
    }
  },

  update(g, dt) {
    const d = g.data;

    d.spawnT -= dt;
    if (d.spawnT <= 0) {
      lanzar(g);
      d.spawnT = g.esc(1.35, 0.38) * g.rnd(0.9, 1.1);
    }

    // los pliegos bajan por la cinta, cada vez más rápido (curva global)
    const v = g.esc(g.h * 0.22, g.h * 0.78);
    const limY = g.h - PILA_H;
    for (const p of d.pliegos) {
      p.y += v * p.vf * dt;
      if (!p.gone && p.y + p.h / 2 > limY) {   // llega a la pila
        p.gone = true;
        if (p.defecto) {
          g.loseLife(p.x, limY - 20, '¡Defecto colado!');
        } else {
          d.buenos += 1;
          g.addScore(25, p.x, limY - 20, '+25');
        }
      }
    }
    d.pliegos = d.pliegos.filter((p) => !p.gone);

    for (const p of d.fuera) {
      p.t += dt; p.x += p.vx * dt; p.y += 60 * dt; p.rot = (p.rot || 0) + p.vr * dt;
    }
    d.fuera = d.fuera.filter((p) => p.t < 0.6);
  },

  draw(g, ctx) {
    const d = g.data;
    const limY = g.h - PILA_H;

    // cinta transportadora insinuada
    ctx.fillStyle = 'rgba(225,78,16,.05)';
    ctx.fillRect(0, 0, g.w, g.h);
    ctx.strokeStyle = 'rgba(242,239,234,.07)'; ctx.lineWidth = 2;
    for (const fx of [0.13, 0.5, 0.87]) {
      ctx.beginPath(); ctx.moveTo(g.w * fx, PRESS_H); ctx.lineTo(g.w * fx, limY); ctx.stroke();
    }

    // pliegos retirados (volando fuera)
    for (const p of d.fuera) {
      ctx.globalAlpha = Math.max(0, 1 - p.t / 0.6);
      pliego(ctx, p, g);
      ctx.globalAlpha = 1;
    }
    // pliegos en la cinta
    for (const p of d.pliegos) pliego(ctx, p, g);

    // ---- máquina offset (arriba, tapa la salida de los pliegos) ----
    ctx.fillStyle = INK2;
    ctx.fillRect(0, 0, g.w, PRESS_H);
    ctx.fillStyle = INK3;
    ctx.fillRect(0, PRESS_H - 10, g.w, 10);
    // rodillos girando
    for (let i = 0; i < 4; i++) {
      const rx = g.w * (0.14 + i * 0.24);
      ctx.save();
      ctx.translate(rx, PRESS_H - 24);
      ctx.rotate(g.t * 3 + i);
      ctx.fillStyle = '#3A3434';
      ctx.beginPath(); ctx.arc(0, 0, 13, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(242,239,234,.25)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-13, 0); ctx.lineTo(13, 0); ctx.stroke();
      ctx.restore();
    }
    // marca de la máquina + piloto
    ctx.fillStyle = DIN;
    rr(ctx, g.w / 2 - 74, 8, 148, 22, 6); ctx.fill();
    barlow(ctx, 11, 900);
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.fillText('DIN IMPRESORES · OFFSET UV', g.w / 2, 23);
    ctx.fillStyle = Math.sin(g.t * 6) > 0 ? '#35C46A' : '#1E6B3A';
    ctx.beginPath(); ctx.arc(g.w - 18, 19, 5, 0, 7); ctx.fill();

    // ---- pila de acabados (abajo) ----
    ctx.fillStyle = INK2;
    ctx.fillRect(0, limY, g.w, PILA_H);
    ctx.strokeStyle = INK3; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, limY); ctx.lineTo(g.w, limY); ctx.stroke();
    // pliegos apilados
    const alto = Math.min(8, d.buenos);
    for (let i = 0; i < alto; i++) {
      ctx.fillStyle = i === alto - 1 ? PAPER : 'rgba(247,244,236,.65)';
      rr(ctx, g.w / 2 - 52, limY + 34 - i * 3, 104, 8, 2); ctx.fill();
    }
    barlow(ctx, 11, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'left';
    ctx.fillText(`PILA · ${d.buenos} OK`, 14, limY + 20);

    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('TOCA EL DEFECTUOSO · DEJA PASAR EL BUENO', g.w / 2, g.h - 34);

    watermark(g, ctx, 'DIN Impresores · Arganda desde 1973');
  },
};

function lanzar(g) {
  const d = g.data;
  d.n += 1;
  const w = Math.min(g.w * 0.34, 122), h = w * 1.25;
  // dos calles de salida alternas para que convivan varios pliegos
  const lane = d.n % 2;
  let y = PRESS_H - h / 2 + 8;   // asoma desde debajo de la máquina
  for (const p of d.pliegos) {   // no montar un pliego encima de otro
    if (p.lane === lane) y = Math.min(y, p.y - h - 16);
  }
  const p = {
    lane,
    x: g.w * (lane ? 0.68 : 0.32) + g.rnd(-10, 10),
    y, w, h,
    vf: g.rnd(0.95, 1.05),
    defecto: null,
    rot: 0,
  };
  if (Math.random() < 0.45) {
    const tipo = g.pick(['mancha', 'registro', 'palida']);
    if (tipo === 'mancha') {
      // mancha cada vez más pequeña (curva global)
      p.defecto = { tipo, mx: g.rnd(-0.24, 0.24), my: g.rnd(-0.18, 0.28), r: g.esc(9, 3.8) * g.rnd(0.9, 1.15) };
    } else if (tipo === 'registro') {
      // desplazamiento de plancha cada vez más sutil
      p.defecto = { tipo, off: g.esc(5.5, 1.7) * g.rnd(0.9, 1.15), dir: Math.random() < 0.5 ? 1 : -1 };
    } else {
      // tinta pálida: cuanto más cerca de 1, más difícil de ver
      p.defecto = { tipo, alpha: g.esc(0.45, 0.72) };
    }
  }
  d.pliegos.push(p);
}

/* Dibuja un pliego: cartel "DIN" + líneas de texto + tira de registro CMYK.
   Los defectos se pintan encima según su tipo. */
function pliego(ctx, p, g) {
  const { w, h } = p;
  ctx.save();
  ctx.translate(p.x, p.y);
  if (p.rot) ctx.rotate(p.rot);

  // papel
  ctx.fillStyle = PAPER;
  rr(ctx, -w / 2, -h / 2, w, h, 5); ctx.fill();
  ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1.5;
  rr(ctx, -w / 2, -h / 2, w, h, 5); ctx.stroke();

  const alpha = p.defecto?.tipo === 'palida' ? p.defecto.alpha : 1;
  ctx.globalAlpha *= alpha;
  contenido(ctx, w, h);
  if (p.defecto?.tipo === 'registro') {
    // plancha magenta desplazada: el contenido "fantasma" a un lado
    ctx.globalAlpha *= 0.45;
    ctx.translate(p.defecto.off * p.defecto.dir, p.defecto.off * 0.6);
    ctx.fillStyle = CMYK[1];
    rr(ctx, -w * 0.38, -h * 0.40, w * 0.76, h * 0.20, 3); ctx.fill();
    for (let i = 0; i < 3; i++) {
      rr(ctx, -w * 0.36, -h * 0.10 + i * h * 0.11, w * (0.72 - i * 0.14), h * 0.045, 2); ctx.fill();
    }
    ctx.translate(-p.defecto.off * p.defecto.dir, -p.defecto.off * 0.6);
    ctx.globalAlpha /= 0.45;
  }
  ctx.globalAlpha /= alpha;

  // mancha de tinta
  if (p.defecto?.tipo === 'mancha') {
    const mx = p.defecto.mx * w, my = p.defecto.my * h, r = p.defecto.r;
    ctx.fillStyle = 'rgba(30,26,24,.85)';
    ctx.beginPath();
    ctx.arc(mx, my, r, 0, 7);
    ctx.arc(mx + r * 0.8, my + r * 0.4, r * 0.6, 0, 7);
    ctx.arc(mx - r * 0.6, my + r * 0.7, r * 0.45, 0, 7);
    ctx.fill();
  }

  ctx.restore();
}

/* El "arte" impreso: cabecera DIN, líneas de texto y tira CMYK de registro. */
function contenido(ctx, w, h) {
  // cabecera
  ctx.fillStyle = DIN;
  rr(ctx, -w * 0.38, -h * 0.40, w * 0.76, h * 0.20, 3); ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.font = `400 ${Math.round(h * 0.12)}px Anton, sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText('DIN', 0, -h * 0.25);
  // líneas de texto
  ctx.fillStyle = '#8C8681';
  for (let i = 0; i < 3; i++) {
    rr(ctx, -w * 0.36, -h * 0.10 + i * h * 0.11, w * (0.72 - i * 0.14), h * 0.045, 2); ctx.fill();
  }
  // tira de registro CMYK
  const s = w * 0.13;
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = CMYK[i];
    ctx.fillRect(-w * 0.36 + i * (s + 4), h * 0.28, s, h * 0.10);
  }
}

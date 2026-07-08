/* NINJA DEL SUSHI — Sushi Yoxi
   Mecánica: desliza (o toca) para cortar las piezas al vuelo.
   Sushi que cae sin cortar = vida. Bomba de wasabi cortada = vida.
   Dificultad (curva global): más frecuencia, más piezas simultáneas y más
   wasabi con el tiempo. Racha/combos: los lleva el motor. */

import { watermark, barlow } from './engine.js';

const FAINT = '#8C8681';

export default {
  id: 'ninja',
  color: '#35A65B',
  vidas: 3,

  init(g) {
    g.data = {
      piezas: [],
      trozos: [],
      trail: [],
      spawnT: 0.6,
    };
  },

  pointer(g, ev) {
    const d = g.data;
    if (ev.type === 'down' || ev.type === 'move') {
      d.trail.push({ x: ev.x, y: ev.y, t: 0 });
      if (d.trail.length > 14) d.trail.shift();
      cortar(g, ev.x, ev.y);
    }
    if (ev.type === 'up') d.trail = [];
  },

  update(g, dt) {
    const d = g.data;

    d.spawnT -= dt;
    if (d.spawnT <= 0) {
      lanzar(g);
      // ráfagas: cada vez más piezas simultáneas (curva global)
      if (Math.random() < Math.min(0.7, 0.22 + (g.nivel - 1) * 0.08)) lanzar(g);
      if (Math.random() < Math.min(0.4, (g.nivel - 1) * 0.045)) lanzar(g);
      d.spawnT = g.esc(1.15, 0.3) * g.rnd(0.85, 1.15);
    }

    for (const p of d.piezas) {
      p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 620 * dt; p.rot += p.vr * dt;
    }
    // pieza que cae sin cortar
    for (const p of d.piezas) {
      if (p.y > g.h + 40 && !p.cut) {
        if (p.tipo !== 'wasabi') g.loseLife(p.x, g.h - 60, '¡Se cayó!');
        p.gone = true;
      }
    }
    d.piezas = d.piezas.filter((p) => !p.gone && p.y < g.h + 80);

    for (const t of d.trozos) {
      t.x += t.vx * dt; t.y += t.vy * dt; t.vy += 700 * dt; t.rot += t.vr * dt; t.t += dt;
    }
    d.trozos = d.trozos.filter((t) => t.t < 1.2);

    for (const s of d.trail) s.t += dt;
    d.trail = d.trail.filter((s) => s.t < 0.22);
  },

  draw(g, ctx) {
    const d = g.data;

    // tabla de corte insinuada
    ctx.fillStyle = 'rgba(53,166,91,.05)';
    ctx.fillRect(0, 0, g.w, g.h);

    for (const t of d.trozos) dibujarPieza(ctx, t, true);
    for (const p of d.piezas) dibujarPieza(ctx, p, false);

    // estela de corte
    if (d.trail.length > 1) {
      ctx.strokeStyle = BONE;
      ctx.lineCap = 'round';
      for (let i = 1; i < d.trail.length; i++) {
        const a = d.trail[i];
        ctx.globalAlpha = Math.max(0, 1 - a.t / 0.22) * (i / d.trail.length);
        ctx.lineWidth = 2 + (i / d.trail.length) * 5;
        ctx.beginPath();
        ctx.moveTo(d.trail[i - 1].x, d.trail[i - 1].y);
        ctx.lineTo(a.x, a.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('DESLIZA PARA CORTAR · EVITA EL WASABI', g.w / 2, g.h - 34);

    watermark(g, ctx, 'Sushi Yoxi · nikkei Arganda');
  },
};

function lanzar(g) {
  const d = g.data;
  // el wasabi aparece más a menudo con el tiempo (curva global)
  const pWasabi = Math.min(0.32, 0.16 + (g.nivel - 1) * 0.02);
  const tipo = Math.random() < pWasabi ? 'wasabi' : (Math.random() < 0.5 ? 'maki' : 'nigiri');
  const x = g.rnd(g.w * 0.18, g.w * 0.82);
  d.piezas.push({
    tipo, x, y: g.h + 30,
    vx: (g.w / 2 - x) * g.rnd(0.25, 0.7) / 1.5,
    vy: -g.rnd(g.h * 0.95, g.h * 1.25),
    rot: g.rnd(0, 6.3), vr: g.rnd(-3, 3),
    r: tipo === 'wasabi' ? 24 : 26,
    cut: false,
  });
}

function cortar(g, x, y) {
  const d = g.data;
  for (const p of d.piezas) {
    if (p.cut) continue;
    const dx = p.x - x, dy = p.y - y;
    if (dx * dx + dy * dy < (p.r + 26) * (p.r + 26)) {
      p.cut = true; p.gone = true;
      if (p.tipo === 'wasabi') {
        g.loseLife(p.x, p.y, '¡WASABI!');
        g.shake = 0.4;
        continue;
      }
      g.hit(90, p.x, p.y);
      // dos mitades
      for (const s of [-1, 1]) {
        d.trozos.push({
          tipo: p.tipo, mitad: s, x: p.x, y: p.y,
          vx: s * g.rnd(60, 160), vy: -g.rnd(40, 140),
          rot: p.rot, vr: s * 4, r: p.r, t: 0,
        });
      }
    }
  }
}

function dibujarPieza(ctx, p, esTrozo) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  if (esTrozo) ctx.globalAlpha = Math.max(0, 1 - p.t / 1.2);
  const half = esTrozo ? p.mitad : 0;

  if (p.tipo === 'wasabi') {
    // bomba de wasabi: bola verde con pinchos
    ctx.fillStyle = '#57B94C';
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = p.r + (i % 2 ? 6 : 0);
      ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#1A1717';
    ctx.beginPath(); ctx.arc(-6, -4, 3, 0, 7); ctx.arc(6, -4, 3, 0, 7); ctx.fill();
    ctx.strokeStyle = '#1A1717'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 5, 6, 0.2, Math.PI - 0.2); ctx.stroke();
  } else if (p.tipo === 'nigiri') {
    // nigiri: arroz + salmón
    const w = p.r * 2, h = p.r * 1.15;
    const x0 = half ? (half < 0 ? -w / 2 : 2) : -w / 2;
    const ww = half ? w / 2 - 2 : w;
    ctx.fillStyle = '#F6F1E7';
    rrp(ctx, x0, -h / 2 + 6, ww, h - 6, 8); ctx.fill();
    ctx.fillStyle = '#F97B5C';
    rrp(ctx, x0, -h / 2 - 2, ww, h * 0.5, 7); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(x0 + 4, -h / 2 + 6); ctx.lineTo(x0 + ww - 4, -h / 2 + 6); ctx.stroke();
  } else {
    // maki: nori + arroz + centro
    const r = p.r;
    ctx.fillStyle = '#20261F';
    arcoMitad(ctx, r, half); ctx.fill();
    ctx.fillStyle = '#F6F1E7';
    arcoMitad(ctx, r * 0.72, half); ctx.fill();
    ctx.fillStyle = '#E44D4D';
    arcoMitad(ctx, r * 0.3, half); ctx.fill();
  }
  ctx.restore();
}

function arcoMitad(ctx, r, half) {
  ctx.beginPath();
  if (!half) ctx.arc(0, 0, r, 0, Math.PI * 2);
  else if (half < 0) ctx.arc(0, 0, r, Math.PI / 2, Math.PI * 1.5);
  else ctx.arc(0, 0, r, -Math.PI / 2, Math.PI / 2);
  ctx.closePath();
}

function rrp(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

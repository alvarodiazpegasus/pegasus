/* APAGA EL FUEGO — Iberex (equipos antiincendios)
   Mecánica: se prenden fuegos en las estaciones de la carpa; toca cada llama
   para descargar el extintor antes de que arrase la estación.
   Dificultad (curva global): más fuegos a la vez, crecen más rápido y dan
   menos margen antes de arrasar la estación. */

import { rr, watermark, anton, barlow } from './engine.js';

const INK2 = '#221E1E', INK3 = '#2E2929', BONE = '#F2EFEA', FAINT = '#8C8681',
  ORANGE = '#F5731F', GOLD = '#F4C430', CORAL = '#F94A4A';

const COLS = 2, ROWS = 3;

export default {
  id: 'fuego',
  color: '#F5731F',
  vidas: 3,

  init(g) {
    g.data = {
      celdas: Array.from({ length: COLS * ROWS }, () => ({ f: 0, burnT: 0, spray: 0 })),
      spawnT: 1.0,
      apagados: 0,
    };
  },

  pointer(g, ev) {
    if (ev.type !== 'down') return;
    const d = g.data;
    const { x0, y0, cw, ch } = grid(g);
    const cxi = Math.floor((ev.x - x0) / cw), cyi = Math.floor((ev.y - y0) / ch);
    if (cxi < 0 || cxi >= COLS || cyi < 0 || cyi >= ROWS) return;
    const c = d.celdas[cyi * COLS + cxi];
    const px = x0 + cxi * cw + cw / 2, py = y0 + cyi * ch + ch / 2;
    if (c.f > 0) {
      const rapido = c.f < 0.45;
      g.hit(rapido ? 150 : 70, px, py, rapido ? '¡Al vuelo!' : '');
      c.f = 0; c.burnT = 0; c.spray = 0.5;
      d.apagados += 1;
    } else {
      c.spray = 0.3;   // descarga en vacío, sin castigo
    }
  },

  update(g, dt) {
    const d = g.data;

    d.spawnT -= dt;
    if (d.spawnT <= 0) {
      const libres = d.celdas.map((c, i) => (c.f === 0 ? i : -1)).filter((i) => i >= 0);
      if (libres.length) {
        prender(d, g.pick(libres));
        // más fuegos simultáneos con el tiempo (curva global)
        if (libres.length > 1 && Math.random() < Math.min(0.85, 0.25 + (g.nivel - 1) * 0.1)) prender(d, g.pick(libres));
        if (libres.length > 2 && Math.random() < Math.min(0.6, (g.nivel - 1) * 0.06)) prender(d, g.pick(libres));
      }
      d.spawnT = g.esc(2.0, 0.4) * g.rnd(0.85, 1.15);
    }

    const growth = g.esc(0.16, 1.0);           // crecimiento de llama (curva)
    const margen = g.esc(1.6, 0.3);            // margen antes de arrasar (curva)
    for (let i = 0; i < d.celdas.length; i++) {
      const c = d.celdas[i];
      if (c.spray > 0) c.spray -= dt;
      if (c.f > 0) {
        c.f = Math.min(1, c.f + growth * dt);
        if (c.f >= 1) {
          c.burnT += dt;
          if (c.burnT > margen) {          // la estación se ha quemado
            const { x0, y0, cw, ch } = grid(g);
            const px = x0 + (i % COLS) * cw + cw / 2, py = y0 + Math.floor(i / COLS) * ch + ch / 2;
            g.loseLife(px, py, '¡Arrasada!');
            c.f = 0; c.burnT = 0;
          }
        }
      }
    }
  },

  draw(g, ctx) {
    const d = g.data;
    const { x0, y0, cw, ch } = grid(g);

    for (let i = 0; i < d.celdas.length; i++) {
      const c = d.celdas[i];
      const x = x0 + (i % COLS) * cw + 7, y = y0 + Math.floor(i / COLS) * ch + 7;
      const w = cw - 14, h = ch - 14;
      const px = x + w / 2;

      // estación (caja/parrilla de la carpa)
      ctx.fillStyle = INK2;
      rr(ctx, x, y, w, h, 12); ctx.fill();
      ctx.strokeStyle = c.f >= 1 ? CORAL : INK3;
      ctx.lineWidth = 2;
      rr(ctx, x, y, w, h, 12); ctx.stroke();

      // burger de la estación
      const by = y + h * 0.62;
      ctx.fillStyle = '#C98A3B';
      rr(ctx, px - 24, by - 8, 48, 12, 6); ctx.fill();
      ctx.fillStyle = '#5C3220';
      rr(ctx, px - 22, by + 5, 44, 7, 3); ctx.fill();
      ctx.fillStyle = '#C98A3B';
      rr(ctx, px - 24, by + 13, 48, 10, 5); ctx.fill();

      // llama
      if (c.f > 0) {
        const fh = 18 + c.f * (h * 0.6);
        const flick = Math.sin(g.t * 11 + i * 2.4) * 4;
        llama(ctx, px, by - 6, fh, flick, c.f);
      }

      // spray del extintor
      if (c.spray > 0) {
        ctx.globalAlpha = Math.min(1, c.spray * 2.4);
        ctx.fillStyle = '#EDF6F0';
        for (let k = 0; k < 7; k++) {
          const a = -Math.PI / 2 + (k - 3) * 0.28;
          const rr2 = 16 + (0.5 - c.spray) * 60 + k * 3;
          ctx.beginPath();
          ctx.arc(px + Math.cos(a) * rr2, by - 12 + Math.sin(a) * rr2, 8, 0, 7);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // aviso de estación a punto de arder
      if (c.f >= 1) {
        barlow(ctx, 11, 900);
        ctx.fillStyle = CORAL; ctx.textAlign = 'center';
        if (Math.sin(g.t * 10) > 0) ctx.fillText('¡YA!', px, y + 18);
      }
    }

    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('TOCA LA LLAMA PARA DESCARGAR EL EXTINTOR', g.w / 2, g.h - 34);

    watermark(g, ctx, 'Iberex · antiincendios');
  },
};

function prender(d, i) {
  if (d.celdas[i].f === 0) d.celdas[i].f = 0.08;
}

function grid(g) {
  const x0 = 10, y0 = 8;
  return { x0, y0, cw: (g.w - 20) / COLS, ch: (g.h - 66 - y0) / ROWS };
}

function llama(ctx, x, y, h, flick, f) {
  const w = h * 0.55;
  ctx.save();
  ctx.translate(x + flick * 0.4, y);
  // exterior
  ctx.fillStyle = f > 0.75 ? '#F94A4A' : ORANGE;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w / 2, -h * 0.25, -w * 0.42 + flick, -h * 0.7, 0, -h);
  ctx.bezierCurveTo(w * 0.42 + flick, -h * 0.7, w / 2, -h * 0.25, 0, 0);
  ctx.fill();
  // interior
  ctx.fillStyle = GOLD;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-w * 0.24, -h * 0.18, -w * 0.2 + flick * 0.5, -h * 0.42, 0, -h * 0.58);
  ctx.bezierCurveTo(w * 0.24 + flick * 0.5, -h * 0.42, w * 0.24, -h * 0.18, 0, 0);
  ctx.fill();
  ctx.restore();
}

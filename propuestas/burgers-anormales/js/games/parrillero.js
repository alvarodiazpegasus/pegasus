/* PARRILLERO PERFECTO — Cárnicas Riaño
   Mecánica: la carne se hace sola; toca (en cualquier sitio) para darle la
   vuelta justo cuando la barra esté en la zona dorada "EN SU PUNTO".
   Cruda o quemada = pierdes vida. Cada carne va más rápida. */

import { rr, watermark, anton, barlow } from './engine.js';

const INK = '#1A1717', INK2 = '#221E1E', INK3 = '#2E2929', BONE = '#F2EFEA',
  DIM = '#C9C4BC', FAINT = '#8C8681', GOLD = '#F4C430', CORAL = '#F94A4A', OK = '#35C46A';

// zonas de punto (fracción 0..1 de la barra)
const Z_CRUDA = 0.62, Z_PASADA = 0.94, PERFECTO = (Z_CRUDA + Z_PASADA) / 2;

export default {
  id: 'parrillero',
  color: '#C0392B',
  duracion: 45,
  vidas: 3,

  init(g) {
    g.data = {
      speed: 0.22,       // fracción de barra por segundo
      p: 0,              // punto de la carne 0..1(+)
      n: 1,              // nº de carne
      flip: 0,           // animación de volteo
      humo: [],
      chispas: [],
    };
  },

  pointer(g, ev) {
    if (ev.type !== 'down') return;
    const d = g.data;
    if (d.flip > 0) return;
    const cx = g.w / 2, cy = g.h * 0.40;
    if (d.p < Z_CRUDA) {
      g.loseLife(cx, cy, '¡Cruda!');
      siguiente(g, true);
    } else if (d.p <= Z_PASADA) {
      const prec = 1 - Math.abs(d.p - PERFECTO) / ((Z_PASADA - Z_CRUDA) / 2);
      const pts = prec > 0.72 ? 250 : 120;
      g.addScore(pts, cx, cy, prec > 0.72 ? '¡En su punto! +250' : '¡Buena! +120');
      for (let i = 0; i < 12; i++) d.chispas.push({ x: cx, y: cy, vx: g.rnd(-130, 130), vy: g.rnd(-220, -60), t: 0 });
      siguiente(g, false);
    } else {
      g.loseLife(cx, cy, '¡Pasada!');
      siguiente(g, true);
    }
  },

  update(g, dt) {
    const d = g.data;
    if (d.flip > 0) { d.flip = Math.max(0, d.flip - dt); return; }
    d.p += d.speed * dt;
    if (d.p > 1.06) {           // se ha quemado sin voltear
      g.loseLife(g.w / 2, g.h * 0.40, '¡Quemada!');
      siguiente(g, true);
    }
    if (d.p > Z_PASADA) {
      // humo
      if (Math.random() < 0.3) d.humo.push({ x: g.w / 2 + g.rnd(-60, 60), y: g.h * 0.36, t: 0 });
    }
    d.humo.forEach((s) => { s.t += dt; s.y -= 42 * dt; });
    d.humo = d.humo.filter((s) => s.t < 1.4);
    d.chispas.forEach((c) => { c.t += dt; c.x += c.vx * dt; c.y += c.vy * dt; c.vy += 480 * dt; });
    d.chispas = d.chispas.filter((c) => c.t < 0.8);
  },

  draw(g, ctx) {
    const d = g.data;
    const cx = g.w / 2, cy = g.h * 0.40;

    // parrilla
    const gw = Math.min(g.w * 0.86, 340), gh = gw * 0.62;
    ctx.fillStyle = INK2;
    rr(ctx, cx - gw / 2, cy - gh / 2, gw, gh, 16); ctx.fill();
    ctx.strokeStyle = INK3; ctx.lineWidth = 2;
    rr(ctx, cx - gw / 2, cy - gh / 2, gw, gh, 16); ctx.stroke();
    ctx.strokeStyle = '#0d0b0b'; ctx.lineWidth = 6;
    for (let i = 1; i <= 5; i++) {
      const y = cy - gh / 2 + (gh / 6) * i;
      ctx.beginPath(); ctx.moveTo(cx - gw / 2 + 12, y); ctx.lineTo(cx + gw / 2 - 12, y); ctx.stroke();
    }

    // brasas
    for (let i = 0; i < 7; i++) {
      const bx = cx - gw / 2 + 24 + i * (gw - 48) / 6;
      const glow = 0.35 + 0.3 * Math.sin(g.t * 5 + i * 1.7);
      ctx.fillStyle = `rgba(249,74,74,${glow.toFixed(2)})`;
      ctx.beginPath(); ctx.arc(bx, cy + gh / 2 - 8, 5, 0, 7); ctx.fill();
    }

    // carne (color según punto)
    const doneT = Math.min(d.p, 1.06);
    const col = doneT < Z_CRUDA
      ? mix('#E05252', '#A8432F', doneT / Z_CRUDA)
      : doneT <= Z_PASADA
        ? mix('#A8432F', '#5C3220', (doneT - Z_CRUDA) / (Z_PASADA - Z_CRUDA))
        : mix('#5C3220', '#221B14', Math.min(1, (doneT - Z_PASADA) / 0.12));
    const squash = d.flip > 0 ? Math.abs(Math.cos(d.flip * Math.PI * 3.3)) : 1;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(1, Math.max(0.15, squash));
    ctx.fillStyle = col;
    rr(ctx, -gw * 0.26, -gh * 0.22, gw * 0.52, gh * 0.44, 18); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.lineWidth = 3;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath(); ctx.moveTo(-gw * 0.2, i * gh * 0.11); ctx.lineTo(gw * 0.2, i * gh * 0.11); ctx.stroke();
    }
    ctx.restore();

    // humo
    for (const s of d.humo) {
      ctx.globalAlpha = Math.max(0, 0.5 - s.t * 0.35);
      ctx.fillStyle = '#9a938d';
      ctx.beginPath(); ctx.arc(s.x, s.y, 7 + s.t * 14, 0, 7); ctx.fill();
      ctx.globalAlpha = 1;
    }
    // chispas
    for (const c of d.chispas) {
      ctx.globalAlpha = Math.max(0, 1 - c.t / 0.8);
      ctx.fillStyle = GOLD;
      ctx.fillRect(c.x, c.y, 4, 4);
      ctx.globalAlpha = 1;
    }

    // nº de carne
    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText(`CARNE ${d.n}`.toUpperCase(), cx, cy - gh / 2 - 14);

    // ---- barra de punto ----
    const bw = Math.min(g.w * 0.86, 340), bh = 26;
    const bx = cx - bw / 2, by = g.h * 0.68;
    ctx.fillStyle = INK2; rr(ctx, bx, by, bw, bh, 13); ctx.fill();
    // zonas
    zona(ctx, bx, by, bw, bh, 0, Z_CRUDA, 'rgba(249,74,74,.28)');
    zona(ctx, bx, by, bw, bh, Z_CRUDA, Z_PASADA, 'rgba(244,196,48,.75)');
    zona(ctx, bx, by, bw, bh, Z_PASADA, 1, 'rgba(249,74,74,.28)');
    ctx.strokeStyle = INK3; ctx.lineWidth = 2; rr(ctx, bx, by, bw, bh, 13); ctx.stroke();
    // marcador
    const mp = Math.min(d.p, 1);
    ctx.fillStyle = BONE;
    rr(ctx, bx + mp * bw - 3, by - 7, 6, bh + 14, 3); ctx.fill();
    // etiquetas ("en su punto" arriba para no pisar "carbón")
    barlow(ctx, 11, 800);
    ctx.fillStyle = GOLD;
    ctx.textAlign = 'center'; ctx.fillText('EN SU PUNTO', bx + bw * PERFECTO, by - 12);
    ctx.fillStyle = FAINT;
    ctx.textAlign = 'left'; ctx.fillText('CRUDA', bx, by + bh + 18);
    ctx.textAlign = 'right'; ctx.fillText('CARBÓN', bx + bw, by + bh + 18);

    // CTA
    anton(ctx, 21);
    ctx.fillStyle = BONE; ctx.textAlign = 'center';
    ctx.fillText('¡TOCA PARA VOLTEAR!', cx, g.h * 0.85);

    watermark(g, ctx, 'Cárnicas Riaño · producto local');
  },
};

function siguiente(g, fallo) {
  const d = g.data;
  d.n += 1;
  d.p = 0;
  d.flip = fallo ? 0.2 : 0.45;
  d.speed = Math.min(0.62, d.speed * 1.13);
}

function zona(ctx, bx, by, bw, bh, a, b, color) {
  ctx.fillStyle = color;
  ctx.fillRect(bx + a * bw, by + 3, (b - a) * bw, bh - 6);
}

function mix(c1, c2, t) {
  t = Math.max(0, Math.min(1, t));
  const p = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const [r1, g1, b1] = p(c1), [r2, g2, b2] = p(c2);
  return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
}

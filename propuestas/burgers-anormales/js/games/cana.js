/* LA CAÑA PERFECTA — Mahou
   Mecánica: mantén pulsado para tirar la caña; suelta cuando la cerveza
   llegue a la línea. Dos dedos de espuma. Si rebosa, caña perdida. */

import { rr, watermark, anton, barlow } from './engine.js';

const INK2 = '#221E1E', INK3 = '#2E2929', BONE = '#F2EFEA', FAINT = '#8C8681',
  GOLD = '#F4C430', BEER = '#F5A623', BEER_DEEP = '#D88A0F';

const TARGET = 0.78;   // nivel objetivo de cerveza (fracción del vaso)

export default {
  id: 'cana',
  color: '#E4032E',
  duracion: 45,
  vidas: 3,

  init(g) {
    g.data = {
      nivel: 0,
      espuma: 0,
      pouring: false,
      rate: 0.34,          // velocidad de llenado
      n: 1,
      done: false,          // caña evaluada, esperando la siguiente
      doneT: 0,
      resultado: null,
      burbujas: [],
    };
  },

  pointer(g, ev) {
    const d = g.data;
    if (d.done) return;
    if (ev.type === 'down') d.pouring = true;
    if (ev.type === 'up' && d.pouring) {
      d.pouring = false;
      evaluar(g);
    }
  },

  update(g, dt) {
    const d = g.data;
    if (d.done) {
      d.doneT += dt;
      if (d.doneT > 0.9) reiniciar(g);
      return;
    }
    if (d.pouring) {
      d.nivel += d.rate * dt;
      d.espuma = Math.min(0.16, d.espuma + d.rate * 0.35 * dt);
      if (Math.random() < 0.5) d.burbujas.push({ x: Math.random(), y: 0, v: 0.25 + Math.random() * 0.4 });
      if (d.nivel + d.espuma >= 1.02) {   // rebosa
        d.pouring = false;
        d.resultado = { txt: '¡Rebosó!', pts: 0, fail: true };
        g.loseLife(g.w / 2, g.h * 0.3, '¡Se sale!');
        d.done = true; d.doneT = 0;
      }
    }
    d.burbujas.forEach((b) => { b.y += b.v * dt; });
    d.burbujas = d.burbujas.filter((b) => b.y < d.nivel);
  },

  draw(g, ctx) {
    const d = g.data;
    const cx = g.w / 2;
    const gh = Math.min(g.h * 0.52, 330), gw = gh * 0.44;
    const gx = cx - gw / 2, gy = g.h * 0.16;

    // grifo
    ctx.fillStyle = INK3;
    rr(ctx, cx - 34, gy - 46, 68, 20, 6); ctx.fill();
    rr(ctx, cx - 9, gy - 32, 18, 26, 4); ctx.fill();
    ctx.fillStyle = '#E4032E';
    rr(ctx, cx - 22, gy - 66, 44, 24, 6); ctx.fill();
    barlow(ctx, 10, 800);
    ctx.fillStyle = BONE; ctx.textAlign = 'center';
    ctx.fillText('MAHOU', cx, gy - 50);

    // chorro
    if (d.pouring && !d.done) {
      ctx.fillStyle = BEER;
      const lvlY = gy + gh - d.nivel * gh;
      ctx.fillRect(cx - 4, gy - 8, 8, Math.max(0, lvlY - (gy - 8)));
    }

    // vaso (caña)
    ctx.save();
    // cerveza
    const lvl = Math.min(d.nivel, 1);
    const grad = ctx.createLinearGradient(0, gy + gh - lvl * gh, 0, gy + gh);
    grad.addColorStop(0, BEER); grad.addColorStop(1, BEER_DEEP);
    ctx.fillStyle = grad;
    ctx.fillRect(gx + 4, gy + gh - lvl * gh, gw - 8, lvl * gh - 3);
    // burbujas
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    for (const b of d.burbujas) {
      ctx.beginPath();
      ctx.arc(gx + 8 + b.x * (gw - 16), gy + gh - b.y * gh, 2.2, 0, 7);
      ctx.fill();
    }
    // espuma
    if (d.espuma > 0.005) {
      const fy = gy + gh - (lvl + d.espuma) * gh;
      ctx.fillStyle = '#FFF7E8';
      rr(ctx, gx + 4, fy, gw - 8, d.espuma * gh + 4, 7); ctx.fill();
    }
    // cristal
    ctx.strokeStyle = 'rgba(242,239,234,.75)'; ctx.lineWidth = 3;
    rr(ctx, gx, gy, gw, gh, 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(242,239,234,.18)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(gx + 10, gy + 12); ctx.lineTo(gx + 10, gy + gh - 12); ctx.stroke();
    ctx.restore();

    // línea objetivo
    const ty = gy + gh - TARGET * gh;
    ctx.setLineDash([7, 6]);
    ctx.strokeStyle = GOLD; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(gx - 26, ty); ctx.lineTo(gx + gw + 26, ty); ctx.stroke();
    ctx.setLineDash([]);
    barlow(ctx, 11, 800);
    ctx.fillStyle = GOLD; ctx.textAlign = 'left';
    ctx.fillText('AQUÍ', gx + gw + 30, ty + 4);

    // resultado de la caña
    if (d.done && d.resultado) {
      anton(ctx, 26);
      ctx.fillStyle = d.resultado.fail ? '#F94A4A' : BONE;
      ctx.textAlign = 'center';
      ctx.fillText(d.resultado.txt.toUpperCase(), cx, gy + gh + 52);
    } else {
      anton(ctx, 20);
      ctx.fillStyle = BONE; ctx.textAlign = 'center';
      ctx.fillText(d.pouring ? '¡SUELTA EN LA LÍNEA!' : 'MANTÉN PULSADO PARA TIRAR', cx, gy + gh + 52);
    }
    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT;
    ctx.fillText(`CAÑA ${d.n}`, cx, gy + gh + 74);

    watermark(g, ctx, 'Mahou · desde 1890');
  },
};

function evaluar(g) {
  const d = g.data;
  const err = Math.abs(d.nivel - TARGET);
  let pts = 0, txt;
  if (d.nivel < 0.4) { txt = '¡Media caña!'; g.loseLife(g.w / 2, g.h * 0.3, 'Muy vacía'); }
  else if (err <= 0.025) { pts = 300; txt = '¡Caña perfecta! +300'; }
  else if (err <= 0.07) { pts = 150; txt = '¡Buena caña! +150'; }
  else if (err <= 0.14) { pts = 60; txt = 'Pasable +60'; }
  else { txt = d.nivel > TARGET ? '¡Pasada!' : 'Corta...'; g.loseLife(g.w / 2, g.h * 0.3, txt); }
  if (pts) g.addScore(pts, g.w / 2, g.h * 0.3, `+${pts}`);
  d.resultado = { txt, pts, fail: !pts };
  d.done = true;
  d.doneT = 0;
}

function reiniciar(g) {
  const d = g.data;
  d.n += 1;
  d.nivel = 0; d.espuma = 0; d.done = false; d.resultado = null; d.burbujas = [];
  d.rate = Math.min(0.75, d.rate * 1.12);   // cada caña sale con más presión
}

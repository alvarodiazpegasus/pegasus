/* AL VOLANTE DURSAN — Dursan (concesionario premium de Arganda)
   Mecánica: mantén pulsado para acelerar, suelta para frenar por inercia.
   Clava el coche dentro de la plaza, cuanto más cerca del muro más puntos.
   Tocar el muro con velocidad = rasguño (vida). Cada ronda, otro coche
   premium y suelo más resbaladizo. */

import { rr, watermark, anton, barlow } from './engine.js';

const INK2 = '#221E1E', BONE = '#F2EFEA', FAINT = '#8C8681', GOLD = '#F4C430',
  CORAL = '#F94A4A', OK = '#35C46A', BLUE = '#2C7BE5';

const MARCAS = [
  { n: 'BMW', c: '#8FA6BC' },
  { n: 'MERCEDES', c: '#C9CFD6' },
  { n: 'AUDI', c: '#3A3F4A' },
];

export default {
  id: 'volante',
  color: '#2C7BE5',
  duracion: 45,
  vidas: 3,

  init(g) {
    g.data = {
      ronda: 1,
      y: 0,             // avance del coche (0 = salida, sube hacia el muro)
      v: 0,
      holding: false,
      friction: 190,    // decel al soltar (px/s²)
      accel: 480,
      fin: null,        // resultado de la ronda
      finT: 0,
      marca: 0,
    };
  },

  pointer(g, ev) {
    const d = g.data;
    if (d.fin) return;
    if (ev.type === 'down') d.holding = true;
    if (ev.type === 'up') d.holding = false;
  },

  update(g, dt) {
    const d = g.data;
    const L = medidas(g);

    if (d.fin) {
      d.finT += dt;
      if (d.finT > 1.0) nuevaRonda(g);
      return;
    }

    if (d.holding) d.v += d.accel * dt;
    else d.v = Math.max(0, d.v - d.friction * dt);
    d.y += d.v * dt;

    const morro = L.salidaY - d.y;              // y del morro del coche (sube)
    if (morro <= L.muroY) {                      // toca el muro
      if (d.v > 30) {
        g.loseLife(g.w / 2, L.muroY + 40, '¡Rasguño!');
        terminarRonda(g, { txt: '¡AL MURO!', pts: 0, fail: true });
      } else {
        puntuar(g, 0);
      }
      d.y = L.salidaY - L.muroY; d.v = 0;
      return;
    }
    if (!d.holding && d.v === 0 && d.y > 4) {   // se ha parado
      puntuar(g, morro - L.muroY);
    }
  },

  draw(g, ctx) {
    const d = g.data;
    const L = medidas(g);
    const marca = MARCAS[d.marca % 3];

    // suelo del parking
    ctx.fillStyle = '#161313';
    ctx.fillRect(0, 0, g.w, g.h);
    if (d.ronda >= 3) {   // suelo mojado
      ctx.fillStyle = 'rgba(44,123,229,.06)';
      ctx.fillRect(0, 0, g.w, g.h);
    }

    // plazas laterales con coches aparcados
    ctx.strokeStyle = 'rgba(242,239,234,.22)'; ctx.lineWidth = 3;
    for (const side of [0.16, 0.84]) {
      for (let i = 0; i < 3; i++) {
        const y = L.muroY + 30 + i * 120;
        ctx.strokeRect(g.w * side - 34, y, 68, 100);
        ctx.fillStyle = i % 2 ? '#3A3F4A' : '#5A4A52';
        rr(ctx, g.w * side - 24, y + 12, 48, 76, 10); ctx.fill();
      }
    }

    // plaza objetivo (centro arriba)
    ctx.strokeStyle = GOLD; ctx.lineWidth = 4;
    ctx.setLineDash([10, 8]);
    ctx.strokeRect(g.w / 2 - 46, L.muroY, 92, L.bayLen);
    ctx.setLineDash([]);
    // muro
    ctx.fillStyle = CORAL;
    ctx.fillRect(g.w / 2 - 54, L.muroY - 10, 108, 8);
    ctx.fillStyle = 'rgba(249,74,74,.35)';
    for (let i = 0; i < 5; i++) ctx.fillRect(g.w / 2 - 54 + i * 24, L.muroY - 10, 12, 8);
    barlow(ctx, 10, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('MURO', g.w / 2, L.muroY - 18);

    // zona perfecta
    ctx.fillStyle = 'rgba(244,196,48,.14)';
    ctx.fillRect(g.w / 2 - 46, L.muroY, 92, 34);

    // coche
    const morro = L.salidaY - d.y;
    const carY = morro + L.carLen / 2;
    ctx.save();
    ctx.translate(g.w / 2, carY);
    ctx.fillStyle = marca.c;
    rr(ctx, -34, -L.carLen / 2, 68, L.carLen, 14); ctx.fill();
    ctx.fillStyle = 'rgba(16,14,14,.72)';
    rr(ctx, -26, -L.carLen / 2 + 14, 52, 22, 8); ctx.fill();
    rr(ctx, -26, L.carLen / 2 - 34, 52, 20, 8); ctx.fill();
    // faros
    ctx.fillStyle = d.holding ? GOLD : 'rgba(244,196,48,.4)';
    ctx.beginPath();
    ctx.arc(-20, -L.carLen / 2 + 5, 4, 0, 7); ctx.arc(20, -L.carLen / 2 + 5, 4, 0, 7);
    ctx.fill();
    ctx.fillStyle = BONE;
    ctx.font = "400 10px Anton, sans-serif"; ctx.textAlign = 'center';
    ctx.fillText(marca.n, 0, 4);
    ctx.restore();

    // velocímetro
    const vv = Math.min(1, d.v / 500);
    ctx.strokeStyle = 'rgba(242,239,234,.2)'; ctx.lineWidth = 8; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(g.w - 54, g.h - 92, 26, Math.PI * 0.75, Math.PI * 2.25); ctx.stroke();
    ctx.strokeStyle = vv > 0.7 ? CORAL : BLUE;
    ctx.beginPath(); ctx.arc(g.w - 54, g.h - 92, 26, Math.PI * 0.75, Math.PI * (0.75 + 1.5 * vv)); ctx.stroke();
    barlow(ctx, 10, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('KM/H', g.w - 54, g.h - 88);

    // resultado ronda
    if (d.fin) {
      anton(ctx, 30);
      ctx.fillStyle = d.fin.fail ? CORAL : (d.fin.pts >= 300 ? GOLD : BONE);
      ctx.textAlign = 'center';
      ctx.fillText(d.fin.txt, g.w / 2, g.h * 0.5);
    } else {
      anton(ctx, 18);
      ctx.fillStyle = BONE; ctx.textAlign = 'center';
      ctx.fillText(d.holding ? 'SUELTA PARA FRENAR' : 'MANTÉN PULSADO PARA ACELERAR', g.w / 2, L.muroY + L.bayLen + 56);
    }
    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'left';
    ctx.fillText(`RONDA ${d.ronda}${d.ronda >= 3 ? ' · SUELO MOJADO' : ''}`, 16, g.h - 88);

    watermark(g, ctx, 'Dursan · premium Arganda');
  },
};

function medidas(g) {
  const carLen = 118;
  const muroY = g.h * 0.12;
  const bayLen = 150;
  const salidaY = g.h - carLen - 46;   // y del morro en la salida (coche entero visible)
  return { carLen, muroY, bayLen, salidaY };
}

function puntuar(g, dist) {
  // dist = separación morro–muro al parar (px). Dentro de la plaza si < bayLen.
  const L = medidas(g);
  let r;
  if (dist <= 0) r = { txt: 'JUSTO AL LÍMITE +150', pts: 150 };
  else if (dist < 26) r = { txt: '¡CLAVADO! +300', pts: 300 };
  else if (dist < 70) r = { txt: '¡MUY BUENO! +180', pts: 180 };
  else if (dist < L.bayLen) r = { txt: 'DENTRO +80', pts: 80 };
  else r = { txt: 'TE QUEDASTE CORTO', pts: 0, fail: true };
  if (r.pts) g.addScore(r.pts, g.w / 2, g.h * 0.42, `+${r.pts}`);
  terminarRonda(g, r);
}

function terminarRonda(g, r) {
  g.data.fin = r;
  g.data.finT = 0;
}

function nuevaRonda(g) {
  const d = g.data;
  d.ronda += 1;
  d.marca += 1;
  d.y = 0; d.v = 0; d.holding = false; d.fin = null;
  d.accel = Math.min(660, d.accel + 40);
  d.friction = Math.max(120, d.friction - 16);   // cada vez frena peor
}

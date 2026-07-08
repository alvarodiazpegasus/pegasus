/* CONDUCTOR DE BUS — Grupo Ruiz (línea Madrid–Arganda, desde 1890)
   Mecánica: 3 carriles; toca izquierda/derecha para cambiar. Recoge
   pasajeros, esquiva conos y coches. La batería activa el BUS ECO (x2).
   Dificultad (curva global): más velocidad y más tráfico con el tiempo.
   Racha: los pasajeros suben el combo; chocar o dejar escapar uno la rompe. */

import { rr, watermark, anton, barlow } from './engine.js';

const BONE = '#F2EFEA', FAINT = '#8C8681', GREEN = '#00843D', ECO = '#35C46A',
  GOLD = '#F4C430', CORAL = '#F94A4A', ASF = '#141111';

export default {
  id: 'bus',
  color: '#00843D',
  vidas: 3,
  comboY: 84,   // el HUD de racha, debajo de la barra Madrid–Arganda

  init(g) {
    g.data = {
      lane: 1,           // 0,1,2
      x: 1,              // posición interpolada
      items: [],
      spawnT: 0.9,
      speed: 300,        // px/s de scroll
      dash: 0,
      eco: 0,            // segundos de modo eco restantes
      recogidos: 0,
      inv: 0,            // invulnerable tras golpe
    };
  },

  pointer(g, ev) {
    if (ev.type !== 'down') return;
    const d = g.data;
    if (ev.x < g.w / 2) d.lane = Math.max(0, d.lane - 1);
    else d.lane = Math.min(2, d.lane + 1);
  },

  update(g, dt) {
    const d = g.data;
    d.x += (d.lane - d.x) * Math.min(1, dt * 14);
    d.dash = (d.dash + d.speed * dt) % 64;
    d.speed = g.esc(300, 760);                 // velocidad de crucero (curva global)
    if (d.eco > 0) d.eco -= dt;
    if (d.inv > 0) d.inv -= dt;

    d.spawnT -= dt;
    if (d.spawnT <= 0) {
      const r = Math.random();
      const tipo = r < 0.42 ? 'pasajero' : r < 0.78 ? 'cono' : r < 0.9 ? 'coche' : 'bateria';
      d.items.push({ tipo, lane: Math.floor(Math.random() * 3), y: -60 });
      d.spawnT = g.esc(0.95, 0.26) * g.rnd(0.85, 1.15);
    }

    const busY = g.h * 0.78;
    for (const it of d.items) {
      it.y += d.speed * dt * (it.tipo === 'coche' ? 1.35 : 1);
      // colisión: mismo carril y solape vertical con el bus
      if (!it.hit && Math.abs(it.y - busY) < 46 && it.lane === Math.round(d.x)) {
        it.hit = true;
        const px = laneX(g, it.lane);
        if (it.tipo === 'pasajero') {
          d.recogidos += 1;
          g.hit(d.eco > 0 ? 240 : 120, px, busY - 50, d.eco > 0 ? '¡ECO!' : '');
        } else if (it.tipo === 'bateria') {
          d.eco = 5;
          g.pop(px, busY - 50, '¡BUS ECO x2!', true);
        } else if (d.inv <= 0) {
          g.loseLife(px, busY - 50, it.tipo === 'cono' ? '¡Cono!' : '¡Frenazo!');
          d.inv = 1.2;
        }
      }
      // pasajero que se escapa por abajo: media racha perdida (sin vida).
      // No la rompe entera porque a veces es físicamente inalcanzable.
      if (!it.hit && !it.missed && it.tipo === 'pasajero' && it.y > g.h + 30) {
        it.missed = true;
        if (g.combo > 1) {
          g.combo = Math.floor(g.combo / 2);
          g.mult = Math.min(10, 1 + Math.floor(g.combo / 4));
          g.pop(laneX(g, it.lane), g.h - 70, '¡Se escapó!', false);
        }
      }
    }
    d.items = d.items.filter((it) => it.y < g.h + 80 && !(it.hit && it.tipo !== 'coche'));
  },

  draw(g, ctx) {
    const d = g.data;

    // carretera
    ctx.fillStyle = ASF;
    ctx.fillRect(g.w * 0.08, 0, g.w * 0.84, g.h);
    // arcenes
    ctx.fillStyle = 'rgba(0,132,61,.25)';
    ctx.fillRect(0, 0, g.w * 0.08, g.h);
    ctx.fillRect(g.w * 0.92, 0, g.w * 0.08, g.h);
    // líneas discontinuas
    ctx.strokeStyle = 'rgba(242,239,234,.35)';
    ctx.lineWidth = 4;
    ctx.setLineDash([30, 34]);
    ctx.lineDashOffset = -d.dash;
    for (const fx of [0.36, 0.64]) {
      ctx.beginPath(); ctx.moveTo(g.w * fx, -10); ctx.lineTo(g.w * fx, g.h + 10); ctx.stroke();
    }
    ctx.setLineDash([]);

    // items
    for (const it of d.items) {
      const x = laneX(g, it.lane);
      if (it.tipo === 'pasajero') pasajero(ctx, x, it.y);
      else if (it.tipo === 'cono') cono(ctx, x, it.y);
      else if (it.tipo === 'coche') coche(ctx, x, it.y);
      else bateria(ctx, x, it.y, g.t);
    }

    // bus
    const busY = g.h * 0.78;
    const bx = laneX(g, d.x);
    if (!(d.inv > 0 && Math.sin(g.t * 22) > 0)) bus(ctx, bx, busY, d.eco > 0);

    // progreso Madrid ↔ Arganda (trayectos de ida y vuelta, sin fin)
    const leg = Math.floor(g.t / 45);
    const frac = (g.t / 45) % 1;
    const p = leg % 2 ? 1 - frac : frac;
    const px0 = g.w * 0.14, pw = g.w * 0.72, py = 26;
    barlow(ctx, 10, 800);
    ctx.fillStyle = FAINT;
    ctx.textAlign = 'left'; ctx.fillText('MADRID', px0, py - 8);
    ctx.textAlign = 'right'; ctx.fillText('ARGANDA', px0 + pw, py - 8);
    ctx.strokeStyle = 'rgba(242,239,234,.3)'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(px0, py); ctx.lineTo(px0 + pw, py); ctx.stroke();
    ctx.strokeStyle = ECO; ctx.beginPath(); ctx.moveTo(px0, py); ctx.lineTo(px0 + p * pw, py); ctx.stroke();
    ctx.fillStyle = BONE; ctx.beginPath(); ctx.arc(px0 + p * pw, py, 5, 0, 7); ctx.fill();

    if (d.eco > 0) {
      anton(ctx, 17);
      ctx.fillStyle = ECO; ctx.textAlign = 'center';
      ctx.fillText(`BUS ECO x2 · ${d.eco.toFixed(0)}s`, g.w / 2, 58);
    }

    barlow(ctx, 12, 800);
    ctx.fillStyle = FAINT; ctx.textAlign = 'center';
    ctx.fillText('TOCA IZQUIERDA / DERECHA PARA CAMBIAR DE CARRIL', g.w / 2, g.h - 34);

    watermark(g, ctx, 'Grupo Ruiz · Madrid–Arganda desde 1890');
  },
};

function laneX(g, lane) {
  return g.w * 0.08 + g.w * 0.84 * ((lane + 0.5) / 3);
}

function bus(ctx, x, y, eco) {
  ctx.save();
  ctx.translate(x, y);
  if (eco) { ctx.shadowColor = ECO; ctx.shadowBlur = 22; }
  ctx.fillStyle = eco ? ECO : GREEN;
  rr(ctx, -30, -52, 60, 104, 12); ctx.fill();
  ctx.shadowBlur = 0;
  // parabrisas y ventanas
  ctx.fillStyle = 'rgba(16,14,14,.75)';
  rr(ctx, -24, -46, 48, 18, 6); ctx.fill();
  rr(ctx, -24, -20, 48, 12, 4); ctx.fill();
  rr(ctx, -24, -2, 48, 12, 4); ctx.fill();
  rr(ctx, -24, 16, 48, 12, 4); ctx.fill();
  // banda
  ctx.fillStyle = BONE;
  ctx.font = "400 11px Anton, sans-serif";
  ctx.textAlign = 'center';
  ctx.fillText(eco ? 'ECO' : 'RUIZ', 0, 42);
  ctx.restore();
}

function pasajero(ctx, x, y) {
  // parada + persona
  ctx.fillStyle = 'rgba(242,239,234,.16)';
  ctx.beginPath(); ctx.arc(x, y, 26, 0, 7); ctx.fill();
  ctx.fillStyle = GOLD;
  ctx.beginPath(); ctx.arc(x, y - 12, 8, 0, 7); ctx.fill();      // cabeza
  rr(ctx, x - 9, y - 2, 18, 22, 7); ctx.fill();                   // cuerpo
  // mano levantada
  ctx.strokeStyle = GOLD; ctx.lineWidth = 4; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x + 8, y + 2); ctx.lineTo(x + 17, y - 12); ctx.stroke();
}

function cono(ctx, x, y) {
  ctx.fillStyle = '#F5731F';
  ctx.beginPath();
  ctx.moveTo(x, y - 22); ctx.lineTo(x + 16, y + 14); ctx.lineTo(x - 16, y + 14);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = BONE;
  ctx.fillRect(x - 9, y - 4, 18, 6);
  ctx.fillStyle = '#B8480E';
  rr(ctx, x - 20, y + 12, 40, 6, 3); ctx.fill();
}

function coche(ctx, x, y) {
  ctx.fillStyle = '#5A6B7A';
  rr(ctx, x - 24, y - 38, 48, 76, 12); ctx.fill();
  ctx.fillStyle = 'rgba(16,14,14,.7)';
  rr(ctx, x - 18, y - 28, 36, 16, 6); ctx.fill();
  rr(ctx, x - 18, y + 10, 36, 14, 6); ctx.fill();
}

function bateria(ctx, x, y, t) {
  ctx.save();
  ctx.translate(x, y);
  ctx.shadowColor = ECO; ctx.shadowBlur = 14 + Math.sin(t * 6) * 6;
  ctx.fillStyle = ECO;
  rr(ctx, -16, -22, 32, 44, 7); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = '#1A1717';
  // rayo
  ctx.beginPath();
  ctx.moveTo(4, -14); ctx.lineTo(-8, 2); ctx.lineTo(-1, 2); ctx.lineTo(-4, 14); ctx.lineTo(8, -2); ctx.lineTo(1, -2);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

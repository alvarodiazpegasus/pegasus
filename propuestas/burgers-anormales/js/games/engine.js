/* engine.js — motor común de los 6 minijuegos.
   Canvas 2D, 60 fps, vertical, una mano, controles táctiles grandes.
   Cada juego define: { duracion, vidas, init(g), update(g,dt), draw(g,ctx), pointer(g,ev) } */

export function startGame(canvas, def, hooks) {
  const ctx = canvas.getContext('2d');
  const g = {
    score: 0,
    vidas: def.vidas ?? 3,
    t: 0,
    duracion: def.duracion ?? 45,
    w: 0, h: 0,
    over: false,
    pops: [],       // textos flotantes de puntuación
    shake: 0,       // sacudida de pantalla al fallar
    color: def.color || '#F72EB7',
    data: {},       // estado propio del juego
    // --- API para los juegos ---
    addScore(n, x, y, label) {
      this.score += n;
      hooks.setScore(this.score);
      if (x !== undefined) this.pops.push({ x, y, t: 0, txt: label || `+${n}`, good: n > 0 });
    },
    pop(x, y, txt, good = true) { this.pops.push({ x, y, t: 0, txt, good }); },
    loseLife(x, y, label) {
      if (this.over) return;
      this.vidas -= 1;
      this.shake = 0.35;
      hooks.setLives(this.vidas);
      if (x !== undefined) this.pops.push({ x, y, t: 0, txt: label || '¡Fallo!', good: false });
      if (this.vidas <= 0) end();
    },
    end() { end(); },
    rnd(a, b) { return a + Math.random() * (b - a); },
    pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; },
  };

  let raf = 0;
  let last = 0;
  let stopped = false;

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.w = r.width;
    g.h = r.height;
  }

  function toXY(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onDown(e) {
    e.preventDefault();
    canvas.setPointerCapture?.(e.pointerId);
    if (!g.over) def.pointer?.(g, { type: 'down', ...toXY(e) });
  }
  function onMove(e) {
    if (e.pressure === 0 && e.buttons === 0) return;
    if (!g.over) def.pointer?.(g, { type: 'move', ...toXY(e) });
  }
  function onUp(e) {
    if (!g.over) def.pointer?.(g, { type: 'up', ...toXY(e) });
  }

  function end() {
    if (g.over) return;
    g.over = true;
    // pequeña pausa para que se vea el último frame
    setTimeout(() => { if (!stopped) hooks.onEnd(g.score); }, 550);
  }

  function frame(ts) {
    if (stopped) return;
    if (!last) last = ts;
    const dt = Math.min((ts - last) / 1000, 0.05); // clamp para pestañas en segundo plano
    last = ts;

    if (!g.over) {
      g.t += dt;
      hooks.setTime(Math.max(0, 1 - g.t / g.duracion));
      if (g.t >= g.duracion) end();
      def.update(g, dt);
    }

    // dibujo (con shake)
    ctx.save();
    if (g.shake > 0) {
      g.shake = Math.max(0, g.shake - dt);
      const s = g.shake * 14;
      ctx.translate((Math.random() - 0.5) * s, (Math.random() - 0.5) * s);
    }
    ctx.clearRect(-20, -20, g.w + 40, g.h + 40);
    def.draw(g, ctx);
    drawPops(g, ctx, dt);
    ctx.restore();

    raf = requestAnimationFrame(frame);
  }

  function drawPops(g, ctx, dt) {
    for (const p of g.pops) {
      p.t += dt;
      const a = Math.max(0, 1 - p.t / 0.9);
      ctx.globalAlpha = a;
      ctx.font = '700 17px Barlow, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = p.good ? '#F2EFEA' : '#F94A4A';
      ctx.fillText(p.txt, p.x, p.y - p.t * 46);
      ctx.globalAlpha = 1;
    }
    g.pops = g.pops.filter((p) => p.t < 0.9);
  }

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);

  def.init?.(g);
  hooks.setScore(0);
  hooks.setLives(g.vidas);

  // Asegura que Anton está disponible para el canvas
  document.fonts?.load('20px Anton').then(() => {}).catch(() => {});

  raf = requestAnimationFrame(frame);

  return {
    stop() {
      stopped = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', onDown);
      canvas.removeEventListener('pointermove', onMove);
      canvas.removeEventListener('pointerup', onUp);
      canvas.removeEventListener('pointercancel', onUp);
    },
    finishNow() { end(); },
    get score() { return g.score; },
  };
}

/* ---------- Helpers de dibujo compartidos ---------- */

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function watermark(g, ctx, texto) {
  ctx.save();
  ctx.globalAlpha = 0.22;
  ctx.font = '400 13px Anton, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = g.color;
  ctx.fillText(texto.toUpperCase(), g.w / 2, g.h - 12);
  ctx.restore();
}

export function anton(ctx, size) { ctx.font = `400 ${size}px Anton, 'Arial Narrow', sans-serif`; }
export function barlow(ctx, size, weight = 700) { ctx.font = `${weight} ${size}px Barlow, sans-serif`; }

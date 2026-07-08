/* engine.js — motor común de los 6 minijuegos.
   Canvas 2D, 60 fps, vertical, una mano, controles táctiles grandes.
   Cada juego define: { vidas, init(g), update(g,dt), draw(g,ctx), pointer(g,ev) }

   COMPETICIÓN: no hay límite de tiempo ni tope de puntuación. La partida
   acaba al perder las vidas. La dificultad la marca la CURVA GLOBAL de abajo
   (misma para los 6 juegos) y la varianza la dan los combos por racha. */

/* ---------- Curva de dificultad GLOBAL (única para todos los juegos) ----------
   dificultad(t): factor que arranca en 1 y crece acelerando (término cuadrático).
   escala(t, base, limite): interpola un parámetro de juego desde su valor de
   arranque hacia su límite asintótico siguiendo la curva. Todos los juegos
   escalan velocidad / frecuencia / ventanas SOLO con estas dos funciones. */
export function dificultad(t) {
  return 1 + 0.025 * t + 0.00045 * t * t;
}
export function escala(t, base, limite) {
  const d = dificultad(t) - 1;
  return limite + (base - limite) / (1 + d);
}

/* Combos: cada acierto seguido sube la racha; el multiplicador sube x1 por
   cada 4 aciertos hasta x10. Cualquier fallo rompe la racha. */
const COMBO_PASO = 4;
const MULT_MAX = 10;

export function startGame(canvas, def, hooks) {
  const ctx = canvas.getContext('2d');
  const g = {
    score: 0,
    vidas: def.vidas ?? 3,
    t: 0,
    w: 0, h: 0,
    over: false,
    pops: [],       // textos flotantes de puntuación
    shake: 0,       // sacudida de pantalla al fallar
    color: def.color || '#F72EB7',
    logoImg: null,  // logo del patrón (si hay), para la marca de agua
    combo: 0,
    mult: 1,
    mejorRacha: 0,
    data: {},       // estado propio del juego
    // --- API para los juegos ---
    get nivel() { return dificultad(this.t); },
    esc(base, limite) { return escala(this.t, base, limite); },
    // acierto que suma racha: puntos = base * multiplicador
    hit(base, x, y, label) {
      this.combo += 1;
      if (this.combo > this.mejorRacha) this.mejorRacha = this.combo;
      this.mult = Math.min(MULT_MAX, 1 + Math.floor(this.combo / COMBO_PASO));
      const pts = Math.round(base * this.mult);
      this.score += pts;
      hooks.setScore(this.score);
      if (x !== undefined) this.pops.push({ x, y, t: 0, txt: label ? `${label} +${pts}` : `+${pts}`, good: true });
      return pts;
    },
    rompeCombo() { this.combo = 0; this.mult = 1; },
    // puntos sueltos (sin racha)
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
      this.rompeCombo();
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
  // En móvil, mantener pulsado dispara selección de texto / callout / menú
  // contextual: se bloquea todo en la zona de juego.
  function onBlock(e) { e.preventDefault(); }

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
      // sin límite de tiempo: la barra superior se llena con la dificultad
      hooks.setTime(Math.min(1, g.t / 150));
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
    drawCombo(g, ctx, def);
    drawPops(g, ctx, dt);
    ctx.restore();

    raf = requestAnimationFrame(frame);
  }

  function drawCombo(g, ctx, def) {
    if (g.combo < 2) return;
    const y = def.comboY ?? 34;
    ctx.save();
    ctx.textAlign = 'center';
    anton(ctx, g.mult > 1 ? 21 : 15);
    ctx.fillStyle = g.color;
    ctx.shadowColor = 'rgba(0,0,0,.6)';
    ctx.shadowBlur = 6;
    ctx.fillText(g.mult > 1 ? `x${g.mult} · RACHA ${g.combo}` : `RACHA ${g.combo}`, g.w / 2, y);
    ctx.restore();
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
  // estilo anti-selección también por JS (refuerzo del CSS)
  for (const el of [canvas, canvas.parentElement]) {
    el.style.touchAction = 'none';
    el.style.userSelect = 'none';
    el.style.webkitUserSelect = 'none';
    el.style.webkitTouchCallout = 'none';
  }
  canvas.addEventListener('pointerdown', onDown);
  canvas.addEventListener('pointermove', onMove);
  canvas.addEventListener('pointerup', onUp);
  canvas.addEventListener('pointercancel', onUp);
  canvas.addEventListener('contextmenu', onBlock);
  canvas.addEventListener('touchstart', onBlock, { passive: false });
  canvas.addEventListener('touchmove', onBlock, { passive: false });
  canvas.addEventListener('selectstart', onBlock);

  // logo del patrón para la marca de agua del canvas (fallback: texto)
  if (def.logo) {
    const img = new Image();
    img.onload = () => { g.logoImg = img; };
    img.src = def.logo;
  }

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
      canvas.removeEventListener('contextmenu', onBlock);
      canvas.removeEventListener('touchstart', onBlock);
      canvas.removeEventListener('touchmove', onBlock);
      canvas.removeEventListener('selectstart', onBlock);
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
  if (g.logoImg && g.logoImg.width) {
    // logo real del patrón sobre una pastilla clara para que se lea en oscuro
    const h = 20, w = h * (g.logoImg.width / g.logoImg.height);
    const x = g.w / 2 - w / 2, y = g.h - h - 7;
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = 'rgba(242,239,234,.88)';
    rr(ctx, x - 9, y - 4, w + 18, h + 8, 8);
    ctx.fill();
    ctx.drawImage(g.logoImg, x, y, w, h);
  } else {
    ctx.globalAlpha = 0.22;
    ctx.font = '400 13px Anton, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = g.color;
    ctx.fillText(texto.toUpperCase(), g.w / 2, g.h - 12);
  }
  ctx.restore();
}

export function anton(ctx, size) { ctx.font = `400 ${size}px Anton, 'Arial Narrow', sans-serif`; }
export function barlow(ctx, size, weight = 700) { ctx.font = `${weight} ${size}px Barlow, sans-serif`; }

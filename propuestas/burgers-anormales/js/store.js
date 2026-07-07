/* store.js — estado local del prototipo.
   TODO BACKEND: todo lo que hay aquí vive en localStorage para la demo.
   En producción: ranking global, votos, leads del sorteo y validación de
   premios van contra un backend (ver PRODUCCION.md). */

const KEY = 'ba_carpa_v1';

function hoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* almacenamiento no disponible: la demo sigue en memoria */ }
  return {};
}

let state = load();

// Los datos "del día" (sellos, puntuaciones, voto, premio) caducan a medianoche,
// como el premio real ("válido hoy").
if (state.dia !== hoy()) {
  state = { dia: hoy() };
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo incógnito */ }
}

export const store = {
  // ---- Pasaporte ----
  get sellos() { return state.sellos || {}; },
  sellar(id) {
    state.sellos = state.sellos || {};
    const nuevo = !state.sellos[id];
    state.sellos[id] = true;
    save();
    return nuevo;
  },
  sellarTodo(ids) {
    state.sellos = {};
    ids.forEach((id) => { state.sellos[id] = true; });
    save();
  },
  contarSellos(ids) { return ids.filter((id) => this.sellos[id]).length; },

  // ---- Premio (pasaporte completo) ----
  get codigoPremio() {
    if (!state.codigoPremio) {
      // TODO BACKEND: el código único lo genera y valida el servidor (una por persona).
      const abc = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
      let c = '';
      for (let i = 0; i < 4; i++) c += abc[Math.floor(Math.random() * abc.length)];
      state.codigoPremio = `ANRML-${c}`;
      save();
    }
    return state.codigoPremio;
  },

  // ---- Votación (una por persona) ----
  get votado() { return state.votado || null; },
  votar(id) {
    if (state.votado) return false; // TODO BACKEND: control real de voto único (dispositivo/verificación)
    state.votado = id;
    save();
    return true;
  },

  // ---- Sorteo / registro RGPD ----
  get registro() { return state.registro || null; },
  registrar(datos, numero) {
    // TODO BACKEND: guardar el lead (email/tel + consentimiento + timestamp) en servidor.
    state.registro = { ...datos, numero, ts: Date.now() };
    save();
    return state.registro;
  },

  // ---- Puntuaciones de minijuegos (mejor del día por juego) ----
  mejorPuntuacion(juegoId) { return (state.scores || {})[juegoId] || 0; },
  guardarPuntuacion(juegoId, score) {
    state.scores = state.scores || {};
    if (score > (state.scores[juegoId] || 0)) state.scores[juegoId] = score;
    save();
    // TODO BACKEND: enviar la puntuación al ranking global del día.
  },

  // ---- Último resultado (para la pantalla de resultado) ----
  set ultimoResultado(r) { state.ultimo = r; save(); },
  get ultimoResultado() { return state.ultimo || null; },

  // ---- Utilidades demo ----
  reset() { state = { dia: hoy() }; save(); },
};

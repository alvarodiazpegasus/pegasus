/* ui.js — iconos (SVG exactos del diseño) y helpers de interfaz. */

const svg = (inner) =>
  `<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;

/* Iconos de los 6 minijuegos — paths 1:1 del diseño */
export const gameIcons = {
  parrillero: svg('<rect x="3.5" y="15" width="17" height="3.2" rx="1.4"/><path d="M6 15c0-3.3 2.2-5 6-5s6 1.7 6 5"/><path d="M8.5 6.5v2M12 5.5v3M15.5 6.5v2"/>'),
  cana: svg('<path d="M7.5 4.5h8.5l-1 14a2 2 0 0 1-2 1.9h-2.5a2 2 0 0 1-2-1.9z"/><path d="M16 8h2.5v6H15.5"/><path d="M7.5 4.5c0-1.2 1.9-2 4.2-2s4.3 .8 4.3 2"/>'),
  ninja: svg('<path d="M4 19.5 15.5 8l1 1L5.5 20.5z"/><path d="M15.5 8l3.2-3.2 1 1L16.5 9"/><circle cx="18.8" cy="5.6" r="0.5"/>'),
  fuego: svg('<path d="M12 2.5s5 4 5 9a5 5 0 0 1-10 0c0-1.6 .6-2.6 .6-2.6S6 11.5 8 12.5c0-4 4-4 4-10Z"/>'),
  bus: svg('<rect x="4" y="5" width="16" height="11" rx="2.2"/><path d="M4 10.5h16"/><path d="M8 5.2v5M12 5.2v5M16 5.2v5"/><circle cx="8" cy="18" r="1.5"/><circle cx="16" cy="18" r="1.5"/>'),
  imprenta: svg('<rect x="6" y="3" width="12" height="4.5" rx="1"/><rect x="3.5" y="7.5" width="17" height="7" rx="1.5"/><circle cx="17.5" cy="10" r="0.6" fill="currentColor"/><rect x="6" y="12.5" width="12" height="8" rx="1"/><path d="M8.5 15.5h7M8.5 18h4.5"/>'),
};

/* Iconos de navegación / secciones — 1:1 del diseño */
export const icons = {
  home: svg('<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h13V9.5"/>'),
  carta: svg('<path d="M4 9.5c0-3.3 3.6-5.5 8-5.5s8 2.2 8 5.5"/><path d="M3.5 9.5h17"/><path d="M5 13.5h14"/><path d="M4.5 13.5c.4 3 3.7 4.8 7.5 4.8s7.1-1.8 7.5-4.8"/>'),
  juega: svg('<circle cx="12" cy="12" r="9"/><path d="M10.4 8.3l5.3 3.7-5.3 3.7z" fill="currentColor" stroke="none"/>'),
  pasaporte: svg('<rect x="3.5" y="6.5" width="17" height="11" rx="2"/><path d="M8 6.5v11" stroke-dasharray="1.5 2.4"/><path d="M12.5 10.5h4M12.5 13.5h3"/>'),
  vota: svg('<path d="m12 3.2 2.5 5.3 5.8.8-4.2 4 1 5.8L12 16.4 6.9 19l1-5.8-4.2-4 5.8-.8z"/>'),
  sorteo: svg('<rect x="3.5" y="9" width="17" height="10" rx="1.5"/><path d="M3.5 13h17"/><path d="M12 9v10"/><path d="M12 9C9 9 7.5 4 12 4.5"/><path d="M12 9c3 0 4.5-5 0-4.5"/>'),
  qr: svg('<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><path d="M14 14h2.5v2.5H14zM17.5 17.5H20V20h-2.5z"/>'),
  close: svg('<path d="M18 6 6 18M6 6l12 12" stroke-width="2.4"/>'),
};

/* Mascota (marca alada simplificada del DS; en producción, PNG real) */
export const mascota = (w) =>
  `<img src="assets/mascota.svg" alt="" style="width:${w}px" draggable="false">`;

export function fmt(n) { return n.toLocaleString('es-ES'); }

/* Confetti — réplica del diseño (18 piezas, 4 colores de marca) */
export function confettiHTML() {
  const cols = ['var(--ba-pink)', 'var(--ba-coral)', 'var(--ba-bone)', 'var(--ba-gold)'];
  let out = '<div class="confetti" aria-hidden="true">';
  for (let i = 0; i < 18; i++) {
    const size = 7 + (i % 3) * 3;
    out += `<span style="left:${4 + (i * 5.4) % 92}%;width:${size}px;height:${size}px;border-radius:${i % 2 ? '50%' : '2px'};background:${cols[i % cols.length]};animation:conf ${(1.9 + (i % 4) * 0.3).toFixed(1)}s ease-in ${((i % 6) * 0.12).toFixed(2)}s infinite"></span>`;
  }
  return out + '</div>';
}

let toastTimer = null;
export function toast(msg, ms = 2200) {
  const root = document.getElementById('toast-root');
  root.innerHTML = `<div class="toast">${msg}</div>`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { root.innerHTML = ''; }, ms);
}

export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

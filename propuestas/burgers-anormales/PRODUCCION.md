# Qué falta para producción

El prototipo es 100% front (localStorage + datos mock). Los puntos de backend
están marcados con `TODO BACKEND` en el código. Lista completa:

## 1. Backend (lo gordo)

- **Ranking global del día** por minijuego (`js/store.js`, `js/app.js`):
  ahora es semilla mock + tu mejor puntuación local. Necesita API
  (POST puntuación / GET top del día) con anti-trampas básico
  (rate-limit, validación de rangos de puntuación).
- **Votación** (`scrVota`): control real de "1 voto por persona"
  (ahora es localStorage: borrar datos = volver a votar). Opciones: cookie
  firmada + fingerprint suave, o voto ligado al registro del sorteo.
- **Sorteo / leads RGPD** (`scrRegistro`): guardar email/tel + consentimiento
  con timestamp (prueba de consentimiento), asignar nº de participante real,
  y el contador de apuntados en vivo.
- **Premio del pasaporte** (`scrPremio`): el código único debe generarlo el
  servidor y canjearse en barra (marcar como usado, uno por persona).
  Ahora se genera en cliente y no se puede validar.
- **Sellado por QR**: los QRs `#/sello/<id>` son estáticos: cualquiera que
  conozca la URL puede sellarse sin comprar. Para producción: QRs con token
  firmado de un solo uso por burger vendida (se imprimen en el ticket/packaging
  por tirada) o sellado por el personal en barra.

## 2. Assets de marca

- **Mascota**: `assets/mascota.svg` es la marca alada simplificada del design
  system (la original PNG supera el límite de descarga de la API de diseño).
  Sustituir por `mascota-burger-alada.png` real en `ui.js` → `mascota()`.
- **Fotos reales de las 6 burgers** (carta, detalle, pasaporte, votación).
- **Logos reales de patrocinadores** (ahora: inicial sobre su color de marca).
- `assets/fondo-marca.png` (textura de marca) no se incluyó por el mismo
  límite; el fondo usa el damero CSS del design system (mismo look).

## 3. Datos definitivos

- **Asociación real burger ↔ patrocinador**: la actual es la del diseño
  (provisional). Se cambia en `data/burgers.json` sin tocar código.
- Precios reales, textos de las bios de patrocinadores validados con cada
  marca, y premio real del sorteo.
- Colores de marca de los patrocinadores validados (ahora aproximados).

## 4. Técnica

- **Fallback jsQR** para navegadores sin `BarcodeDetector` (iOS < 17,
  Firefox): añadir lib ligera (~10 KB) en `js/qr.js`. El modo demo ya cubre
  la presentación.
- **Fuentes offline**: Anton/Barlow/Permanent Marker cargan de Google Fonts;
  para funcionar 100% sin red, autohospedarlas (woff2 en `assets/fonts/`).
- **PWA opcional**: manifest + service worker para cachear todo (el recinto
  puede tener mala cobertura).
- Analítica simple (Plausible o similar) para medir juegos/votos por patrón
  (es parte de lo que se vende al patrocinador).

## 5. Legal

- Revisión de Débora (Legal): texto RGPD del formulario, bases legales del
  sorteo (depósito de bases), y edad mínima si hay captura de datos.

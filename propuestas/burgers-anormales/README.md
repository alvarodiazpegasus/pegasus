# Burgers Anormales — Micrositio Carpa Arganda 2026

Prototipo funcional y jugable del micrositio de gamificación de la carpa
(**Fundación Pegasus × Black Bull**). Se entra por QR desde las mesas y el
packaging. Mobile-first, web estática, sin dependencias — hosteable gratis.

Diseño visual: proyecto **"Micrositio Burgers Anormales"** de Claude Design,
sobre el **Burgers Anormales Design System** (tokens en `css/tokens.css`).

## Qué incluye

- **Home** con navegación a todo.
- **Carta** de 6 burgers → **detalle** de cada una (patrón + juego + sellado).
- **Landing de patrocinador** (una por patrón, generada desde el JSON).
- **6 minijuegos** en Canvas (60 fps, verticales, una mano, 30–60 s, con vidas
  o cronómetro, puntuación y ranking del día):
  | Juego | Patrón | Mecánica |
  |---|---|---|
  | Parrillero perfecto | Cárnicas Riaño | Toca para voltear la carne en su punto |
  | La caña perfecta | Mahou | Mantén para tirar, suelta en la línea |
  | Ninja del sushi | Sushi Yoxi | Desliza para cortar, evita el wasabi |
  | Apaga el fuego | Iberex | Toca las llamas antes de que arrasen |
  | Conductor de bus | Grupo Ruiz | Cambia de carril, recoge pasajeros, bus eco x2 |
  | Al volante Dursan | Dursan | Acelera/frena y clava el coche en la plaza |
- **Pasaporte** de 6 sellos: se sella escaneando el QR de cada burger
  (lector con cámara + modo "simular sellado" para demo). Al completarlo →
  **premio** con código único ("enséñalo en barra y tu burger es gratis").
- **Votación** a burger favorita (una por persona) + **ranking en vivo**.
- **Sorteo** con formulario y consentimiento **RGPD** → nº de participante.

## Arrancar en local

Necesita un servidor estático (usa módulos ES y `fetch`):

```bash
cd WEB_BURGERS_ANORMALES
npx serve .            # o: python -m http.server 8080
```

Abre `http://localhost:3000` (o el puerto que indique) — mejor con el modo
móvil de las DevTools (390×844) o desde el móvil en la misma red.

## Desplegar gratis

- **Vercel / Netlify**: arrastra la carpeta o `vercel deploy` / `netlify deploy`.
  No hay build: es HTML/CSS/JS plano.
- **GitHub Pages**: sube el repo y activa Pages sobre la rama principal.

> El lector QR necesita **HTTPS** (los tres proveedores lo dan de serie).

## Editar los datos

Todo el contenido vive en **`data/burgers.json`**: burgers, textos,
patrocinadores (colores de marca, bio, sello), juegos (nombres, instrucciones)
y los datos mock de votos/ranking/sorteo. Editar y recargar.

## QRs de sellado

Cada burger sella con una URL: `https://<tu-dominio>/#/sello/<id>`
(ids: `raro`, `beer`, `nikkei`, `fire`, `carne`, `anormal`).
Genera un QR por burger apuntando a esa URL e imprímelo en el packaging.
El lector también acepta QRs cuyo contenido sea solo el id.

## Estructura

```
index.html            entrada única (SPA por hash)
css/tokens.css        tokens del design system (copia 1:1)
css/app.css           estilos de la app (réplica del diseño)
js/app.js             router + pantallas
js/store.js           estado local (localStorage) — TODOs de backend
js/ui.js              iconos del diseño + helpers
js/qr.js              lector QR (BarcodeDetector)
js/games/engine.js    motor común de minijuegos (canvas, táctil)
js/games/*.js         los 6 minijuegos
data/burgers.json     datos editables
assets/               marca (splash, smiley, flechas, mascota)
```

## Qué falta para producción

Ver **`PRODUCCION.md`**. Resumen: backend real (ranking global, leads,
validación de premios), mascota/fotos/logos reales, fallback jsQR,
asociación definitiva burger↔patrocinador y revisión legal RGPD.

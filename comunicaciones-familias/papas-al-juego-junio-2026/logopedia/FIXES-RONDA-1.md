# FIXES · Ronda 1 · Gymkana "La Piedra de Te Fiti"

> Aplicar sobre `index.html`. 5 fixes consolidados de feedback del usuario.
> Los assets nuevos ya están en su sitio.

---

## FIX 1 · Pantalla de bienvenida cinematográfica

**Problema:** la pantalla inicial actual es "cutre" — Pegasusito pequeño con un bocadillo blanco soso.

**Solución:**
- Usar `assets/imagenes/mapa/isla-tefiti.png` como **fondo cinematográfico** (con un overlay oscuro `rgba(0,0,0,0.45)` para que se lea el texto).
- Pegasusito-saludando más grande (~50vh de alto) flotando a la izquierda.
- Título grande blanco con sombra fuerte: "¡UNA AVENTURA OS ESPERA!"
- Subtítulo en blanco: "El océano os ha elegido. Una piedra mágica se ha roto en cuatro fragmentos y la isla necesita vuestra ayuda. ¿Estáis preparados?"
- Botón "▶ EMPEZAR LA AVENTURA" grande y centrado debajo.
- Aprovechar el espacio: a pantalla completa, sin bocadillos blancos, todo el texto en blanco sobre el fondo del mapa con overlay.

---

## FIX 2 · Sistema de audio · 3 problemas en uno

### 2A · Parar audio anterior al cambiar de pantalla

**Problema:** al pulsar avanzar, el audio actual sigue sonando mientras empieza el siguiente. Se solapan.

**Solución:** función global `pararAudiosNarrativa()` que pause y reset todos los audios excepto los loops de música/olas. Llamarla SIEMPRE al hacer transición de escena.

```js
function pararAudiosNarrativa(){
  // Pausa todo lo que no sea música/olas en loop
  Object.values(audios.historiador).forEach(a => { a.pause(); a.currentTime = 0; });
  Object.values(audios.tefiti).forEach(a => { a.pause(); a.currentTime = 0; });
  Object.values(audios.pares).forEach(a => { a.pause(); a.currentTime = 0; });
  Object.values(audios.sfx).forEach(a => {
    if(!a.loop){ a.pause(); a.currentTime = 0; }
  });
}
// Llamar pararAudiosNarrativa() en mostrarEscena(id) antes del switch de visibilidad.
```

### 2B · Pantalla intermedia "ESCUCHAR LA HISTORIA"

**Problema:** el audio de `historiador-01-inicio.mp3` empieza al pulsar EMPEZAR pero salta directamente a la pantalla de "Elige tu guía", y el audio se solapa con esa pantalla. Mal flujo narrativo.

**Solución:** añadir una pantalla intermedia entre Bienvenida y Selección de personaje:

- **Pantalla "historia-inicial"**: fondo del mapa (igual que la bienvenida) con overlay oscuro.
- Pegasusito-curioso grande a la izquierda.
- Título: "ESCUCHAD LA LEYENDA"
- Subtítulo: "El historiador os va a contar lo que ha pasado…"
- Botón grande "▶ ESCUCHAR" que arranca `historiador-01-inicio.mp3`.
- Mientras suena el audio: animación sutil de Pegasusito moviendo la cabeza + un pequeño indicador "🔊 Escuchando…".
- Cuando termina el audio (evento `ended`), aparece el botón "▶ ELEGIR PERSONAJE" que lleva a la siguiente pantalla.
- Si el peque quiere saltarse: el botón "Saltar →" en esquina superior derecha (discreto).

**Flujo nuevo:** `bienvenida` → `historia-inicial` → `personaje` → `mapa`.

### 2C · Botón mute global

**Problema:** no hay forma de silenciar el audio sin abrir el sistema operativo.

**Solución:** botón mute fijo arriba a la derecha (al lado de "Volver al mapa" o donde no estorbe). Icono SVG o emoji 🔊/🔇. Persiste en todas las pantallas.

```html
<button class="mute-btn" id="muteBtn" title="Silenciar / Reactivar audio">🔊</button>
```

```css
.mute-btn {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 100;
  background: #fff;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 20px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.20);
  touch-action: manipulation;
}
@media (max-height: 720px) { .mute-btn { width: 36px; height: 36px; font-size: 16px; top: 8px; right: 8px; } }
```

```js
let isMuted = false;
function toggleMute(){
  isMuted = !isMuted;
  document.getElementById('muteBtn').textContent = isMuted ? '🔇' : '🔊';
  // Silenciar TODOS los audios
  Object.values(audios).forEach(grupo => {
    Object.values(grupo).forEach(a => { a.muted = isMuted; });
  });
}
// Listener
document.getElementById('muteBtn').addEventListener('click', toggleMute);
```

**Importante:** si el botón "Volver al mapa" está también arriba derecha, mover uno de los dos para que no choquen. El mute siempre tiene prioridad → mute a la derecha del todo, "Volver al mapa" un poco a la izquierda.

---

## FIX 3 · Vídeo · sustituir YouTube por vídeo local

**Problema:** el vídeo de YouTube embebido da **error 153** (el dueño desactivó el embed). El fallback aparece siempre, nunca funciona.

**Solución:** sustituir el iframe de YouTube por un `<video>` HTML5 que carga el archivo local.

**Asset disponible:** `assets/video/baile-olas.mp4` (ya está en su sitio, 7.5 MB).

**Implementación:**

```html
<div class="video-box">
  <video
    id="videoBaile"
    src="assets/video/baile-olas.mp4"
    controls
    loop
    playsinline
    style="width:100%; height:100%; object-fit:cover; border-radius:18px;">
    Tu navegador no soporta vídeo HTML5.
  </video>
</div>
```

- **Sin autoplay** (que el usuario lo arranque manualmente para no asustar).
- `loop` activado (es un loop corto, mejor que se repita).
- `controls` para que la familia pueda pausar/avanzar.
- Eliminar todo el código del fallback de iframe.

El botón "▶ HEMOS BAILADO" sigue siempre visible debajo del vídeo, igual que antes.

---

## FIX 4 · Volcán · fondo cinematográfico

**Problema:** la pantalla del volcán tiene un fondo plano de color granate, falta dramatismo.

**Solución:** usar `assets/imagenes/volcan/interior-volcan.png` como **fondo de pantalla completa** del punto 5.

```css
#punto-5 {
  background:
    linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)),
    url('assets/imagenes/volcan/interior-volcan.png') center/cover no-repeat;
}
```

- Overlay oscuro encima de la imagen (`rgba(0,0,0,0.25)` arriba, `rgba(0,0,0,0.55)` abajo) para que el texto blanco se lea.
- Las preguntas siguen en una tarjeta blanca/clara centrada para legibilidad.
- El título y los botones en blanco con sombra para que destaquen sobre la lava.

---

## FIX 5 · Final · secuenciar audios + arreglar Te Fiti

**Problema:**
1. Al juntar el último fragmento se reproducen **3 audios a la vez**: el chime de victoria del fragmento + el del historiador "habéis recuperado los 4" + el de Te Fiti.
2. La imagen `piedra-completa.png` aparece superpuesta sobre la cara de Te Fiti, tapándola.

**Solución 1 · Secuenciar audios con eventos `ended`:**

```js
function secuenciaFinal(){
  // 1. Llamar a pararAudiosNarrativa() primero
  pararAudiosNarrativa();

  // 2. Fade out musica isla loop
  fadeOut(audios.musica.isla, 800);

  // 3. SFX piedra completa
  reproducir('sfx', 'piedra', { volume: 0.7 });

  // 4. Esperar 1 seg, luego audio historiador-06-final
  setTimeout(() => {
    const histFinal = reproducir('historiador', 'final', { volume: 1 });
    if(!histFinal) return;
    histFinal.addEventListener('ended', () => {
      // 5. Cuando termine historiador, fade in musica final
      fadeIn(audios.musica.final, 1500, 0.5);
      // 6. Esperar 600ms más y arrancar voz de Te Fiti
      setTimeout(() => {
        reproducir('tefiti', 'final', { volume: 1 });
      }, 600);
    }, { once: true });
  }, 1000);
}
```

**Solución 2 · Posicionar la piedra completa en el aire, no sobre Te Fiti:**

La piedra al unirse debe aparecer **arriba a la izquierda** de Te Fiti, NO sobre su pecho/cara. Te Fiti se eleva limpia, sin tapar.

Layout sugerido en CSS:
```css
.scene-final {
  position: relative;
  background: #000;
}
.tefiti-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  height: 85vh;
  animation: tefiti-elevarse 3s ease-out forwards;
}
.piedra-completa-final {
  position: absolute;
  top: 10vh;
  left: 50%;
  transform: translateX(-50%);
  height: 22vh;
  z-index: 5;  /* Por encima del fondo pero NO sobre Te Fiti */
  animation: piedra-brillar 2s ease-in-out infinite alternate;
}
.tefiti-img { z-index: 10; }  /* Te Fiti por delante de la piedra */
```

La piedra queda **arriba del todo brillando**, Te Fiti se eleva desde abajo **delante de ella**. Cinematográfico: la piedra es como un "símbolo" en el cielo y Te Fiti la diosa que aparece.

Si la convergencia de los 4 fragmentos animados era hacia el centro y caían sobre Te Fiti, recalcular el destino: que terminen formando la piedra **arriba** (top: 10vh), no en el centro.

---

## Resumen ejecutivo de la ronda 1

| FIX | Tipo | Complejidad |
|---|---|---|
| 1 · Bienvenida cinematográfica | Diseño visual | Baja |
| 2A · Parar audios al cambiar pantalla | Bug crítico | Baja |
| 2B · Pantalla intermedia "escuchar historia" | Nueva pantalla | Media |
| 2C · Botón mute global | Feature | Baja |
| 3 · Vídeo local en lugar de YouTube | Sustitución | Baja |
| 4 · Fondo cinematográfico volcán | Diseño visual | Baja |
| 5 · Secuenciar audios final + arreglar Te Fiti | Bug + diseño | Media |

**Tras aplicar los 5 fixes, el usuario volverá a abrir en navegador y dará feedback de la ronda 2.**

---

*Documento generado: 9 junio 2026.*

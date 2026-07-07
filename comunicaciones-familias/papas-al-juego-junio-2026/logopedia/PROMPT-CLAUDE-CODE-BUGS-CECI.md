# Prompt maestro para Claude Code · bugs Logopedia tras feedback Ceci

> Copiar todo lo de abajo y pegar en Claude Code. Todo lo que necesita para arreglar los 5 bugs.

---

## CONTEXTO DEL PROYECTO

Trabajas sobre la gymkana interactiva de **Papás al Juego · Logopedia** de Fundación Pegasus. Es una web HTML autocontenida (HTML/CSS/JS puro, sin frameworks) con temática Vaiana/Moana. La gymkana tiene 5 escenas + mapa: intro, punto 2 (vídeo + memoria), punto 3 (barreño de agua), punto 4 (candado códigos secretos), punto 5 (volcán) y pantalla final con Te Fiti.

Es una versión que estaba cerrada como **10/10 (referencia de calidad Pegasus)** hasta que se aplicó una tanda de cambios pedida por Ceci (metodóloga central del equipo). Los cambios se aplicaron con un batch de sustituciones Python y quedaron **5 bugs** que hay que arreglar SIN chapuzas.

## RUTAS COMPLETAS DEL PROYECTO

Tienes acceso a toda la carpeta raíz `Metodología Pegasus`. Rutas relevantes:

**Archivo principal que hay que arreglar:**
`C:\Users\User\Desktop\Pegasus\MEGACEREBRO\Metodología Pegasus\07_papas-al-juego\junio-2026\logopedia\index.html`

**Assets de la gymkana** (todo dentro de `logopedia/assets/`):
- `assets/video/smilie-carrera.mp4` · **YA descargado y en su sitio** (bug 1 lo va a usar)
- `assets/video/baile-olas.mp4` · vídeo antiguo (por si sirve de fallback)
- `assets/audio/voz-historiador/` · locuciones ElevenLabs del narrador
- `assets/audio/musica/` · pistas Suno (isla, volcán, final)
- `assets/audio/sfx/` · efectos (chime, splash, caer, revive, candado, fuego, olas...)
- `assets/imagenes/personajes/` · Moana, Maui, Te Fiti, Pua, HeiHei
- `assets/imagenes/sopa-de-imagenes/` · iconos veraniegos (23 assets: aletas, bikini, camara, cangrejo, cesta, coral, cubo-de-arena, cucurucho-de-helado, estrella-de-mar, flor-hibisco, flotador, gafas-de-sol, gafas-snorkel, medusa, palmera, pelota-playa, pez-tropical, sandia, sol, sombrero, sombrilla-de-playa, tortuga-marina, tumbona)
- `assets/imagenes/iconos-candado/` · iconos originales (lupa, monedero, zapatos, libro, llaves, juguete, mochila, persona-adulta) · el bug 4 asumía nombres que NO existen aquí
- `assets/imagenes/fondos/` · fondos de escena
- `assets/imagenes/volcan/` · interior del volcán

**Documentación del proyecto** (para contexto si lo necesitas):
- `Metodología Pegasus\CLAUDE.md` · guía maestra del proyecto Pegasus con reglas operativas, filosofía Pegasus, protocolo de audio, estándar de calidad Ceci 10/10, lecciones aprendidas (léelo si tienes dudas de estilo/tono/paleta)
- `Metodología Pegasus\07_papas-al-juego\junio-2026\logopedia\ASSETS.md` · inventario detallado de los assets con nombres exactos
- `Metodología Pegasus\07_papas-al-juego\junio-2026\logopedia\PROMPT-CLAUDE-CODE-BUGS-CECI.md` · este mismo archivo
- `Metodología Pegasus\07_papas-al-juego\junio-2026\logopedia\index.html.pre-ceci-jul.bak` · **NO existe todavía** (házla tú antes de tocar nada)

**Kit espejo (sincronizar al terminar):**
`C:\Users\User\Desktop\Pegasus\MEGACEREBRO\Metodología Pegasus\10_METODOLOGIA-PEGASUS\07_CATALOGO-GYMKANAS-DE-REFERENCIA\01-LOGOPEDIA-La-Piedra-de-Te-Fiti-REFERENCIA-10-10\index.html`

**PDF original de Ceci con el feedback** (si necesitas confirmar algún detalle):
`C:\Users\User\AppData\Roaming\Claude\local-agent-mode-sessions\...\uploads\PAPAS AL JUEGO logo (3) (1).pdf` (probablemente no accesible desde tu sandbox · si necesitas revisar algún dato, coge el mismo listado que está más abajo en este prompt)

**Referencias visuales de identidad Pegasus:**
- `Metodología Pegasus\10_METODOLOGIA-PEGASUS\01_FILOSOFIA-Y-IDENTIDAD\` · manuales oficiales de marca
- `Metodología Pegasus\10_METODOLOGIA-PEGASUS\08_BIBLIOTECA\` · banco de assets reutilizables (fondos, personajes, música, SFX)

## REGLAS DURAS

- **Cero chapuzas.** Ceci lo pidió explícito. Si algo no puede quedar con estética Pegasus real, avísame antes de dejarlo a medias.
- **Backup previo obligatorio:** `cp index.html index.html.pre-claude-code.bak` antes de tocar nada.
- **Validar el JS con `node --check`** sobre el script extraído del HTML antes de dar por bueno un cambio. Que el archivo cierre con `</script></body></html>` y que `<script>` y `</script>` estén balanceados.
- **NO romper lo que ya funciona:** el punto 5 (volcán) está OK y el flujo intro → mapa → conseguir fragmentos → final debe seguir funcionando.
- **Identidad visual Pegasus:** paleta morado `#974694`, rosa `#E45E9B`, azul océano, dorado; tipografía **Barlow** (nunca Times / Georgia / serif por defecto), italic para títulos, border-radius generoso, curvas.

---

## BUG 1 · Vídeo YouTube da error 153

**Qué pasa:** en `#punto-2-video` hay un `<iframe src="https://www.youtube.com/embed/KXewT-mhoPk">` y el vídeo da "Error 153 · Error de configuración del reproductor" porque el dueño del vídeo desactivó el embed.

**El MP4 YA ESTÁ descargado en:**
`C:\Users\User\Desktop\Pegasus\MEGACEREBRO\Metodología Pegasus\07_papas-al-juego\junio-2026\logopedia\assets\video\smilie-carrera.mp4`

**Solución:** cambiar el iframe por una etiqueta `<video>` con el archivo local:

```html
<div class="video-box">
  <video id="videoBaile" src="assets/video/smilie-carrera.mp4" controls loop playsinline
    style="width:100%; height:100%; object-fit:cover; border-radius:18px;">
    Tu navegador no soporta vídeo HTML5.
  </video>
</div>
```

Y restaurar las referencias JS que estaban comentadas (búscalas por los comentarios `iframe YouTube maneja su propio audio` y `iframe YouTube · el usuario debe`) → volver a las originales:
```js
const v=document.getElementById('videoBaile'); if(v) v.muted=isMuted;
```
y
```js
const v=document.getElementById('videoBaile'); if(v) v.pause();
```
y en `mostrarSopa`:
```js
const v=document.getElementById('videoBaile');
if(v){ try{ v.pause(); }catch(e){} }
```

---

## BUG 2 · Sopa (punto 2) nivel bajo pide 6/10 en vez de 3/6

**Qué pasa:** al pulsar "NIVEL BAJO" en el picker de la sopa, el grid muestra correctamente 12 celdas con 3 pares, pero el contador dice "(6/10)" en vez de "(6/6)" o "(3/6)" y no salta al fragmento hasta encontrar 10 (imposible).

**Sospecha probable:** `sopaTotalPares` se establece a 3 pero `actualizarProgSopa` o `clicSopa` está usando el valor viejo de 10 por caché de closure, o la actualización de `sopaTotalPares` no se propaga.

**Solución:** revisar las funciones `iniciarSopaConNivel`, `construirSopa`, `clicSopa`, `actualizarProgSopa`. Asegurar que:
- `sopaTotalPares` es la única fuente de verdad
- `clicSopa` chequea `sopaSeleccionadas.size === sopaTotalPares * 2` (no 10 hardcoded)
- `actualizarProgSopa` muestra `size/(sopaTotalPares*2)`
- Añadir un `console.log('nivel:', sopaTotalPares)` temporal si hace falta debug

---

## BUG 3 · Actividad 3 (barreño de agua) muestra elementos HTML legacy

**Qué pasa:** al entrar en `#punto-3` sigue viéndose el HTML antiguo:
- Título "El cuenco de las palabras"
- Emoji de jarrón 🏺 en `<div class="cuenco">🏺</div>`
- Botón `<button class="btn" onclick="reproducirParActual()">🔊 ESCUCHAR</button>` (que ya no funciona porque `reproducirParActual` fue eliminada)
- Texto "Ronda 1 de 5" en `<div class="rondas">`
- Y DEBAJO se añade el picker de nivel + ruleta nuevos

**Solución:** reescribir el HTML de la escena `#punto-3` dejándolo limpio, sólo con el contenedor donde el JS va a pintar dinámicamente:

```html
<section class="scene bg-ocean" id="punto-3">
  <div class="act-host">
    <h2>El barreño de las palabras</h2>
    <p class="lead">Gira la ruleta con forma de barreño. Cada letra guarda palabras muy parecidas.</p>
    <!-- Aquí el JS inyecta picker de nivel, ruleta y palabras -->
  </div>
</section>
```

La función `montarRuletaBarreno` y `mostrarPickerNivelPunto3` ya existen · lo único que hay que hacer es que la escena arranque limpia.

---

## BUG 4 · Punto 4 nivel bajo · cards gigantes con texto duplicado, imágenes rotas

**Qué pasa:** al elegir "NIVEL BAJO" en el candado, aparecen 3 opciones (de las 4 del array) enormes, con el texto duplicado ("SOL SOL", "CONCHA CONCHA", "ESTRELLA ESTRELLA") y sin imagen.

**Causas:**
1. Las imágenes `assets/imagenes/iconos-candado/sol.png`, `concha.png`, `pez.png`, `estrella.png`, `barco.png`, `isla.png`, `remo.png`, `ola.png`, `heihei.png`, `maui.png`, `vaiana.png`, `pua.png` **NO existen** — reutilicé nombres del array original sin verificar.
2. El `onerror` handler del `<img>` inyecta un div con `this.alt` cuando falla + yo también añado un `<div>` con el mismo nombre = texto duplicado.
3. El CSS de `.picto` (grid actual) hace las cards demasiado grandes cuando solo hay 3-4.

**Solución:** rediseñar `montarHistoriaBajo` para usar SOLO TEXTO en las opciones (sin `<img>`), con estética Pegasus:
- Grid de 2×2 compacto (4 opciones en 2 filas)
- Cards con texto grande Barlow italic bold, borde morado, fondo blanco, sombra suave
- Al acertar: card verde con ✓
- Al fallar: shake + color rojo momentáneo

Ejemplo estructura del array (que se mantiene, es solo la parte visual):
```js
const HISTORIAS_BAJO = [
  { texto:'La luz del cielo: por la noche brilla...', correcto:'estrella',
    opciones:['estrella','sol','pez','concha'] },
  ...
];
```

Renderizado sugerido:
```html
<div class="opciones-texto-grid">
  <button class="opt-txt-btn" onclick="clicOpcionBajo('estrella','estrella')">ESTRELLA</button>
  <button class="opt-txt-btn" onclick="clicOpcionBajo('sol','estrella')">SOL</button>
  ...
</div>
```

Con CSS Pegasus (paleta morada, Barlow, hover, active).

---

## BUG 5 · Punto 4 nivel alto · estética es una chapuza (LO CRÍTICO)

**Qué pasa:** el nivel alto del candado carga los datos correctos (5 tarjetas con historia + código cifrado en emojis), pero visualmente está fatal:

1. **Botón "Ver clave del cifrario"** invoca `toast(claves,'ok',6000)` → aparece un toast enorme flotante encima que tapa todo el contenido durante 6 segundos.
2. **Banner "CÓDIGO CIFRADO:"** es una barra rectangular gris con letters en cursiva serif · feísimo.
3. **Input "ESCRIBE LA PALABRA..."** el placeholder aparece en cursiva serif (Times / Georgia por defecto del navegador) porque el CSS del input no fuerza font-family Barlow.
4. **Layout general:** los emojis del código cifrado quedan flotantes en una caja blanca gigante sin identidad visual, sin ambientación Vaiana/mar/piedra antigua. Es una chapuza que no combina con el resto de la gymkana.

**Referencia estética objetivo:**

El resto de la gymkana tiene identidad **Vaiana/mar polinesio**: fondos oceánicos con overlay oscuro, cards con borde redondeado y color coral/morado, Pegasusito integrado, Barlow italic para títulos.

El punto 4 debe sentirse como **una tarjeta de pergamino antiguo con códigos secretos**, no como un formulario de HTML plano.

**Especificaciones concretas para rediseñar:**

- **Wrap principal** (contenedor de la tarjeta cifrada): fondo tipo pergamino (color crema `#f4e8c8` con textura o degradado sutil), bordes redondeados gruesos (24px), borde marrón envejecido (3-4px `#8a5a2e`), sombra profunda, padding generoso 24-32px.
- **Título tarjeta** ("El objeto que devuelve la vida · 2/5"): Barlow 900 italic, tamaño clamp(20px,3vh,26px), color `#5c3618` (marrón oscuro tinta), text-shadow suave.
- **Texto historia**: Barlow 400-500 italic, tinta marrón oscuro, line-height 1.5, tamaño clamp(14px,2vh,17px).
- **Label "CÓDIGO CIFRADO"**: pequeño chip morado Pegasus (`#974694`), texto blanco Barlow 900 uppercase, letter-spacing 2px, padding 4x14, border-radius 999.
- **Zona de emojis** (código): fondo blanco/pergamino claro con borde punteado morado, padding 16-20px, emojis grandes clamp(36px,6vh,54px) con letter-spacing amplio, centrados.
- **Input de respuesta**: `font-family: 'Barlow', sans-serif !important; font-weight: 900; font-style: italic;` · borde 3px morado, background blanco, text-align center, text-transform uppercase, padding 14x24, border-radius 16px.
- **Botón COMPROBAR**: usar el `.btn.coral` existente (mismo estilo que el resto de la gymkana).
- **Botón "🔑 Ver clave"**: al pulsar, abrir un **modal decente** (fondo semitransparente que cubre pantalla, dentro una tabla con las 16 letras usadas y sus emojis, con estilo pergamino) que se cierra al pulsar fuera o en la X. NADA de `toast()`.

**Data de las 5 tarjetas** (no cambiar):
1. "El amigo más despistado" → HEIHEI
2. "El objeto que devuelve la vida" → CORAZON
3. "El arma del semidiós" → ANZUELO
4. "La guía de los navegantes" → ESTRELLA
5. "El transporte de los exploradores" → BARCO

**Cifrario letra → emoji** (constante `CIFRARIO` en el JS actual · mantener):
```js
{A:'🐠',B:'🐚',C:'🌊',D:'🐬',E:'🐢',F:'🦈',G:'🐊',H:'🦀',I:'⭐',J:'🍍',
 L:'🌴',M:'🐟',N:'🐙',O:'⛵',P:'🌸',Q:'🐳',R:'🌺',S:'🎣',T:'🏝️',U:'🌈',
 V:'🦩',Y:'🐍',Z:'⚡'}
```

---

## RECORRIDO DE VALIDACIÓN AL TERMINAR

Prueba en este orden y arregla lo que no encaje:

1. Recargar el `index.html` en Chrome (con Ctrl+F5).
2. Portada → Historia inicial → Personaje elegido → Mapa. Debe funcionar como antes.
3. Punto 2 vídeo: el vídeo local debe cargar y reproducirse. Botón "HEMOS BAILADO" abre picker de nivel de la sopa.
4. Punto 2 sopa · nivel BAJO: 12 celdas 4×3, contador (x/6), al encontrar los 3 pares → fragmento.
5. Punto 2 sopa · nivel ALTO: 25 celdas 5×5, contador (x/20), al encontrar los 10 pares → fragmento.
6. Punto 3 barreño · nivel BAJO: picker → ruleta gira → letra + palabra + imagen + botón CONSEGUIDO → fragmento. Sin elementos legacy visibles.
7. Punto 3 barreño · nivel ALTO: picker → ruleta gira → 2 palabras del par mínimo → botón ESCUCHAR pronuncia → click en la correcta → fragmento.
8. Punto 4 candado · nivel BAJO: 3 preguntas con opciones de texto en grid 2×2, sin imágenes rotas, sin duplicaciones.
9. Punto 4 candado · nivel ALTO: 5 tarjetas de pergamino con código cifrado en emojis, botón clave abre modal decente, tipografía Barlow en todo, estética Vaiana/pergamino.
10. Punto 5 volcán: NO tocar (ya funciona). Solo verificar que sigue funcionando.
11. Final: los 4 fragmentos unidos + Te Fiti + narración 1.15x + botón "🔁 VOLVER A EMPEZAR".

## CHECKLIST FINAL

Antes de dar por bueno:
- [ ] `node --check` del script del HTML pasa sin errores
- [ ] `grep -c '<script>'` = `grep -c '</script>'`
- [ ] Termina con `</html>`
- [ ] Bug 1 · vídeo local carga
- [ ] Bug 2 · contador sopa correcto en ambos niveles
- [ ] Bug 3 · punto 3 sin legacy
- [ ] Bug 4 · punto 4 nivel bajo con texto solo, 2×2, sin duplicaciones
- [ ] Bug 5 · punto 4 nivel alto con estética pergamino/Pegasus, modal para clave, Barlow en input
- [ ] Punto 5 volcán intacto
- [ ] Sincronizar al kit tras validar
- [ ] Borrar el `.bak` cuando confirmes que todo va bien

Al terminar, respóndeme con una captura de cada punto arreglado para validarlo.

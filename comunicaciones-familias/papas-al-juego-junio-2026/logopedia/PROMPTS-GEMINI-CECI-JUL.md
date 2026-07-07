# Logopedia · Prompts Gemini para completar la iteración Ceci (julio 2026)

> Todos los cambios de CÓDIGO ya están aplicados.
> Cambios de VOZ (narrador más natural/cercano) están fuera de scope (sin tiempo).
> Aquí quedan los assets de imagen opcionales/pendientes.

## PROMPT 1 · Imagen del cifrario visual (opcional pero muy recomendable)

**Contexto Ceci:** para el nivel alto del punto 4 usamos un cifrario donde cada letra = un emoji marino. El código ya funciona con emojis del propio sistema, pero una imagen del "cifrario" tipo tabla ayudaría a los peques a descifrar más fácil.

```
Product-style illustration of a "SECRET CODE KEY" chart for children, warm tropical Vaiana style. A large parchment/scroll with the Spanish alphabet arranged in a grid, each letter paired with a hand-drawn tropical/marine icon: A-fish, B-shell, C-wave, D-dolphin, E-turtle, F-shark, H-crab, I-star, L-palm, N-octopus, O-boat, R-flower, S-whale, T-island, U-rainbow, Z-lightning. Framed in wooden edges like ancient map. Text at top: "CIFRARIO DE CÓDIGOS SECRETOS". Handcrafted vintage feel, warm cream background.

STYLE: Pixar / Disney 3D rendered, warm cinematic lighting, treasure-map aesthetic.

Solid background, 4:3 horizontal composition.
```

**Guardar como:** `assets/imagenes/candado/cifrario.png`

> Con esto podríamos añadir una imagen "clave del cifrario" que se muestre al pulsar el botón "🔑 Ver clave". Ahora mismo se muestra la clave como texto/emojis. Si generas el PNG, dime y lo enchufo en el HTML.

---

## PROMPT 2 · Ruleta barreño de agua (opcional · reemplaza el div CSS actual)

**Contexto Ceci:** en el punto 3 la ruleta tiene forma de barreño de agua. Ahora mismo la hago con un div CSS con gradiente radial azul agua. Funciona · pero si quieres un asset más chulo:

```
Round wooden bucket ("barreño") full of clear blue water seen from above, top-down view, perfect circle. Wooden slats around the edge. Water surface with light ripples reflecting sunlight. The center is empty (transparent) so we can overlay a letter on top. Warm cinematic photography.

IMPORTANT: Export as PNG with the CENTER 60% empty/transparent so a letter can be overlaid on top. Wooden edges + water border only. Circular 1:1 composition.
```

**Guardar como:** `assets/imagenes/barreno-ruleta.png`

> Opcional · lo que hay ahora funciona.

---

## PROMPT 3 · Símbolos individuales (SI el cifrario no basta y quieres imagen por letra)

Si prefieres imágenes en lugar de emojis para las tarjetas cifradas, esto son las 5 palabras que hay que descifrar y las letras únicas:

- HEIHEI, CORAZON, ANZUELO, ESTRELLA, BARCO
- Letras únicas: A, B, C, D (no usada), E, F (no usada), H, I, L, N, O, R, S, T, U, Z

Prompt genérico (repetir por letra):

```
Illustrated icon for children's game, warm Vaiana / Disney style. [DESCRIBE ANIMAL/OBJETO ASOCIADO A LA LETRA]. Simple, iconic, easy to recognize at a glance. Circular vignette background in soft aqua blue.

IMPORTANT: PNG with TRANSPARENT background, 1:1 square, ~200x200px.
```

Asignaciones sugeridas (mismo cifrario ya usado en el HTML):
- A → pez tropical (🐠)
- B → concha marina (🐚)
- C → ola (🌊)
- D → delfín (🐬)
- E → tortuga marina (🐢)
- H → cangrejo (🦀)
- I → estrella de mar (⭐)
- L → palmera (🌴)
- N → pulpo (🐙)
- O → barco velero pequeño (⛵)
- R → hibisco (🌺)
- S → ballena (🐳)
- T → isla tropical (🏝️)
- U → arcoíris (🌈)
- Z → rayo eléctrico (⚡)

**Guardar como:** `assets/imagenes/candado/simbolo-A.png`, `-B.png`, etc.

> Opcional · con emojis ya se ve bien. Si generas, actualizo el HTML para usar imágenes en vez de emojis.

---

## Cambios de código YA aplicados (recap)

**Observaciones generales:**
- ❌ Voz narrador más natural/cercano · fuera de scope (sin tiempo)
- ✅ Inicio se queda igual (no había que tocar)

**Actividad 1 · Punto 2:**
- ✅ Vídeo actual sustituido por iframe YouTube integrado (Smilie · ID `KXewT-mhoPk`) sin redirigir
- ✅ Picker de nivel al terminar el vídeo:
  - Nivel bajo: 3 parejas en 12 celdas (4×3)
  - Nivel alto: 10 parejas en 25 celdas (5×5 · máximo posible)
- ✅ Al completar → paso automático al fragmento

**Actividad 2 · Punto 3 (barreño de agua):**
- ✅ Picker de nivel al entrar
- ✅ Ruleta con forma de barreño de agua (CSS gradient · animación de giro)
- ✅ Letras: TODAS del abecedario español EXCEPTO K, W, X, Y (según PDF)
- ✅ Nivel alto: pares mínimos del PDF completos (piña/niña, carta/tarta, lata/rata, oreja/oveja, cuatro/cuadro, barco/banco, cuervo/cuerpo, zorro/gorro, cama/casa, bota/gota, hueso/huevo, foca/boca, luna/lupa, jabón/jarrón, panal/pañal, saco/sapo, perla/pera, foco/coco, mesa/pesa, pato/palo, toro/loro, pino/vino, mapa/masa)
- ✅ Nivel bajo: letra grande + palabra asociada + imagen (asociación letra-imagen)
- ✅ Botón 🔊 ESCUCHAR usa Web Speech API para pronunciar la palabra

**Actividad 3 · Punto 4 (candado):**
- ✅ Estética candado (SVG que se abre al final) con picker de nivel
- ✅ Nivel alto: 5 tarjetas con historia + código cifrado (emojis) + input texto:
   1. Amigo más despistado → HEIHEI
   2. Objeto que devuelve la vida → CORAZON
   3. Arma del semidiós → ANZUELO
   4. Guía de los navegantes → ESTRELLA
   5. Transporte de exploradores → BARCO
- ✅ Botón "🔑 Ver clave del cifrario" que muestra las equivalencias letra-emoji
- ✅ Nivel bajo: 3 preguntas con pictogramas (luz del cielo · barco Vaiana · pollo travieso)
- ✅ Candado se abre visualmente al descifrar todo

**Actividad 4 · Punto 5 (volcán):**
- ✅ Picker de nivel
- ✅ Nivel alto: 6 preguntas texto + 2 "preguntas locas" (ola/roca · delfines/tortugas)
- ✅ Nivel bajo: 3 padres (2 alto + 1 loca) + 4 peques (pictogramas)
- ✅ Imagen Moana ampliada (top: 10vh, width: 28vh) · protagonismo mejorado

**Pantalla final:**
- ✅ Narración final acelerada al 1.15x (`playbackRate`)
- ✅ Botón "🔁 VOLVER A EMPEZAR" añadido junto al CTA final

**Tiempo estimado de las imágenes Gemini (todas opcionales):** 5-10 min si generas cifrario · 15-20 min si quieres símbolos individuales.

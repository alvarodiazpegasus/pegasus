# ASSETS · Gymkana "La Piedra de Te Fiti" (Logopedia · Cecilia)

> Documento maestro de TODO el material a generar o conseguir antes de montar el HTML.
> Cada bloque lleva: qué es, dónde se usa, dónde se guarda, cómo se genera/busca.
> Estructura objetivo: una vez completados todos los bloques, el HTML se ensambla en un solo paso.

---

## Estado global

| Bloque | Qué incluye | Estado |
|---|---|---|
| 1. Imágenes personajes | Moana, Maui, Hei Hei, Te Fiti, piedra (5 PNG) | 🔴 pendiente · Álvaro descarga |
| 2. Imagen del mapa | Isla aérea estilo acuarela con 5 paradas | 🔴 pendiente · Gemini o Google |
| 3. Imagen piedra fragmentada | Piedra completa + 4 fragmentos separados | 🔴 pendiente · Gemini o Google |
| 4. Iconos del candado | Persona adulta, lupa, monedero, etc. (10) | 🔴 pendiente · Google iconos planos |
| 5. Tablero sopa de imágenes | 30 iconos veraniegos (idéntico al PDF de Ceci) | 🔴 pendiente · Google o recortar PDF |
| 6. Voz del historiador (MP3 ×7) | Intros de cada punto + final | 🔴 pendiente · ElevenLabs |
| 7. Voz de Te Fiti (MP3) | Frase final de cierre | 🔴 pendiente · ElevenLabs |
| 8. Audios pares mínimos (MP3 ×16) | 8 pares × 2 palabras = 16 audios sueltos | 🔴 pendiente · ElevenLabs |
| 9. Música polinesia (MP3 ×3) | Loop oceánico + tema volcán + tema final | 🔴 pendiente · Suno |
| 10. Sound FX (MP3 ×8) | Olas, splash, candado, chime fragmento, etc. | 🔴 pendiente · ElevenLabs Sound FX |
| 11. Vídeo coreografía | YouTube embed (URL en el PDF) | ✅ tenemos URL |

---

## Bloque 1 · Imágenes personajes

**Dónde se usan:** punto 1 (elegir personaje) y como avatar que se mueve por el mapa.
**Dónde se guardan:** `assets/imagenes/personajes/`
**Formato:** PNG con fondo transparente. ~600×800 px.

| Archivo | Búsqueda Google Images | Notas |
|---|---|---|
| `moana.png` | `moana disney personaje png transparente` | Cuerpo completo, mirando al frente o de pie. Puede ser fan-art si Disney oficial no tiene transparente. |
| `maui.png` | `maui moana disney personaje png transparente` | Con su anzuelo idealmente. |
| `hei-hei.png` | `hei hei moana pollo png transparente` | El pollo. Mejor pose graciosa. |
| `te-fiti.png` | `te fiti diosa moana png transparente` | La diosa verde de la naturaleza. Sale al final. |
| `piedra-completa.png` | `corazon te fiti piedra moana png transparente` | Piedra verde con espiral. |

**Atajo:** Cecilia ya pegó las 5 en la página 5 del PDF (`referencias-pdf/REF-personajes-numerados.png`). Si Álvaro no encuentra mejores en Google, recortamos esa imagen.

---

## Bloque 2 · Imagen del mapa

**Dónde se usa:** pantalla principal de navegación. Es el corazón visual de la gymkana.
**Dónde se guarda:** `assets/imagenes/mapa/isla-tefiti.jpg` (o `.png` si tiene transparencia).
**Formato:** Horizontal 1920×1080 o 2560×1440.

**Búsqueda Google:**
```
isla moana motunui mapa ilustracion
```
o:
```
polynesian island map illustration cartoon
```

**Plan B con Gemini** (si no encontramos uno bonito):
```
A top-down view of a tropical Polynesian island in the style of a Disney
animated movie. Watercolor illustration, vibrant turquoise ocean around it.
The island has: a beach with palm trees on the south, a coral lagoon on the east,
a dense jungle in the center, and a volcano on the north. No characters, no
text labels. Soft cinematic lighting, golden hour.

IMPORTANT: Export as PNG, landscape 16:9 aspect ratio, high detail.
```

**Referencia:** boceto a mano de Ceci en `referencias-pdf/REF-mapa-dibujado-ceci.jpg` (la disposición de los 5 puntos que ella imagina).

---

## Bloque 3 · Piedra de Te Fiti + 4 fragmentos

**Dónde se usa:** indicador permanente arriba a la derecha (la piedra se va completando con cada fragmento).
**Dónde se guardan:** `assets/imagenes/piedra/`

| Archivo | Qué es |
|---|---|
| `piedra-vacia.png` | Silueta gris/transparente de la piedra entera (referencia de dónde encajan los fragmentos). |
| `fragmento-1.png` | Trozo de la piedra (esquina superior izq). Verde con espiral. |
| `fragmento-2.png` | Trozo (esquina superior dcha). |
| `fragmento-3.png` | Trozo (esquina inferior izq). |
| `fragmento-4.png` | Trozo (esquina inferior dcha). |
| `piedra-completa-brillo.png` | La piedra entera con efecto luz/brillo (cuando se reúnen los 4). |

**Si Álvaro encuentra una piedra entera buena**, yo después la troceo en 4 con Python (PIL). Solo necesitamos UNA imagen base.

**Búsqueda Google:**
```
corazon de te fiti piedra moana png
```

---

## Bloque 4 · Iconos del candado (punto 4)

**Dónde se usan:** 3 historias sociales, cada una con su código de 3 iconos. Total ~10 iconos únicos.
**Dónde se guardan:** `assets/imagenes/iconos-candado/`
**Formato:** PNG transparente, estilo plano (flat icons) o pictograma tipo Aragones / ARASAAC.

| Archivo | Búsqueda Google |
|---|---|
| `icono-persona-adulta.png` | `pictograma adulto arasaac png` |
| `icono-lupa.png` | `pictograma lupa png transparente` |
| `icono-monedero.png` | `pictograma monedero arasaac png` |
| `icono-mama.png` | `pictograma mama familia arasaac png` |
| `icono-papa.png` | `pictograma papa familia arasaac png` |
| `icono-llaves.png` | `pictograma llaves arasaac png` |
| `icono-juguete.png` | `pictograma juguete arasaac png` |
| `icono-libro.png` | `pictograma libro arasaac png` |
| `icono-zapatos.png` | `pictograma zapatos arasaac png` |
| `icono-mochila.png` | `pictograma mochila arasaac png` |

**Mejor opción:** descargar de **ARASAAC** directamente (banco de pictogramas español libre): https://arasaac.org/

---

## Bloque 5 · Tablero sopa de imágenes (punto 2B)

**Dónde se usa:** punto 2 sub-prueba B. Tablero con ~30 iconos veraniegos donde el peque tiene que encontrar las imágenes REPETIDAS.
**Dónde se guardan:** `assets/imagenes/sopa-de-imagenes/`

Ceci adjuntó referencia: `referencias-pdf/REF-sopa-imagenes-estilo.jpg` (Mi Aula Genial).

**Estrategia más eficiente:** generar los iconos sueltos como PNG transparentes y montamos el grid en HTML directamente. Así controlamos repeticiones, clicks y feedback.

Iconos necesarios (mismo estilo plano, colores pastel):

| Archivo | Búsqueda |
|---|---|
| `sopa-helado.png` | `helado verano png transparente flat icon` |
| `sopa-estrella-mar.png` | `estrella de mar png flat icon` |
| `sopa-sombrilla.png` | `sombrilla playa png flat icon` |
| `sopa-cangrejo.png` | `cangrejo png flat icon kawaii` |
| `sopa-pelota.png` | `pelota playa png flat icon` |
| `sopa-cubo.png` | `cubo arena playa png flat icon` |
| `sopa-tortuga.png` | `tortuga marina png flat icon` |
| `sopa-gafas.png` | `gafas sol corazon png flat icon` |
| `sopa-aletas.png` | `aletas buceo png flat icon` |
| `sopa-medusa.png` | `medusa png flat icon` |
| `sopa-sandia.png` | `sandia png flat icon` |
| `sopa-sombrero.png` | `sombrero paja png flat icon` |
| `sopa-tumbona.png` | `tumbona playa png flat icon` |
| `sopa-pez.png` | `pez tropical png flat icon` |
| `sopa-camara.png` | `camara fotos png flat icon` |
| `sopa-coral.png` | `coral marino png flat icon` |
| `sopa-flotador.png` | `flotador png flat icon` |
| `sopa-sol.png` | `sol sonriente png flat icon` |
| `sopa-cesta.png` | `cesta picnic playa png flat icon` |
| `sopa-gafas-buceo.png` | `gafas buceo snorkel png flat icon` |
| `sopa-bikini.png` | `bikini bañador png flat icon` |
| `sopa-flor.png` | `flor hibisco png flat icon` |
| `sopa-palmera.png` | `palmera png flat icon` |

**Si todo eso es mucho rollo**, plan B: recortamos los iconos directamente del PNG `REF-sopa-imagenes-estilo.jpg` que adjuntó Ceci (yo lo hago con Python). Es la opción rápida.

---

## Bloque 6 · Voz del historiador · ElevenLabs

**Voz elegida:** voz masculina española profunda, narrativa, tipo documental. En ElevenLabs:
- **Recomendada:** `Adam` con español, o cualquier voz custom con descripción *"deep, narrative, documentary-style Spanish male voice, like a historian"*.
- **Alternativa:** generar una voz custom en Voice Design con prompt: *"middle-aged Spanish male voice, deep and warm, like a documentary narrator or a wise historian telling an ancient legend, slow pace, dramatic"*.
- **Settings:** Stability 50, Similarity 75, Style 30 (algo de dramatismo).

**Dónde se guardan:** `assets/audio/voz-historiador/`

| Archivo | Texto a generar |
|---|---|
| `historiador-01-inicio.mp3` | Ver script abajo |
| `historiador-02-laguna.mp3` | Ver script abajo |
| `historiador-03-orilla.mp3` | Ver script abajo |
| `historiador-04-bosque.mp3` | Ver script abajo |
| `historiador-05-volcan.mp3` | Ver script abajo |
| `historiador-06-final.mp3` | Ver script abajo |
| `historiador-victoria.mp3` | "Habéis recuperado un fragmento. La isla os lo agradece." (genérico para usar tras cada fragmento) |

→ **Los scripts completos están en `SCRIPTS-ELEVENLABS.md`** (siguiente documento, listo para copy/paste).

---

## Bloque 7 · Voz de Te Fiti · ElevenLabs

**Voz elegida:** voz femenina, etérea, profunda, con eco. En ElevenLabs:
- **Recomendada:** Voice Design con prompt: *"ethereal female Spanish voice, ancient goddess of nature, deep but gentle, slightly reverberant, slow pace, warm and benevolent"*.
- **Settings:** Stability 40, Similarity 75, Style 60 (más expresiva).
- **Post-procesado opcional:** añadir reverb en Audacity gratis (5 min).

**Dónde se guarda:** `assets/audio/voz-te-fiti/te-fiti-final.mp3`

**Texto:** ver `SCRIPTS-ELEVENLABS.md`.

---

## Bloque 8 · Audios pares mínimos · ElevenLabs

**Voz elegida:** voz femenina española clara, articulada. Tipo logopeda. En ElevenLabs:
- **Recomendada:** `Bella` en español o cualquier voz femenina con dicción muy clara.
- **Settings:** Stability 70, Similarity 75, Style 0 (lo más neutro posible para que se distinga el sonido).

**Dónde se guardan:** `assets/audio/pares-minimos/`

**8 pares mínimos** (extraídos de banco de logopedia clásica española):

| Par | Audio 1 | Audio 2 |
|---|---|---|
| /p/ vs /b/ | `pala.mp3` (texto: "pala") | `bala.mp3` (texto: "bala") |
| /c/ vs /g/ | `cama.mp3` ("cama") | `gama.mp3` ("gama") |
| /t/ vs /d/ | `tos.mp3` ("tos") | `dos.mp3` ("dos") |
| /f/ vs /j/ | `foto.mp3` ("foto") | `jota.mp3` ("jota") |
| /m/ vs /n/ | `mata.mp3` ("mata") | `nata.mp3` ("nata") |
| /r/ vs /l/ | `pero.mp3` ("pero") | `pelo.mp3` ("pelo") |
| /s/ vs /z/ | `sol.mp3` ("sol") | `zol.mp3` ("zol", o cambiar a "saco/zaco" si zol suena raro) |
| /ch/ vs /y/ | `chapa.mp3` ("chapa") | `yapa.mp3` ("yapa") |

**Generar cada palabra como un MP3 independiente.** En la gymkana se reproducen al azar y el peque debe acertar cuál ha sonado clickando la tarjeta correcta.

---

## Bloque 9 · Música polinesia · Suno

**Dónde se guardan:** `assets/audio/musica/`

| Archivo | Prompt Suno |
|---|---|
| `musica-isla-loop.mp3` | "Polynesian island ambient music, ukulele and tribal percussion, gentle ocean waves background, peaceful and uplifting, instrumental, loopable, 2 minutes long" |
| `musica-volcan-epico.mp3` | "Epic tribal Polynesian battle music, intense drums, dramatic, like a volcano scene in an animated movie, instrumental, building tension, 1 minute" |
| `musica-final-tefiti.mp3` | "Emotional Polynesian choir, female voices, slow and ceremonial, like a goddess awakening, with strings and soft drums, instrumental, 1 minute" |

→ **Prompts completos en `PROMPTS-SUNO.md`** (siguiente documento).

---

## Bloque 10 · Sound FX · ElevenLabs Sound FX

ElevenLabs tiene un generador específico de sound FX (no es voz, es texto-a-sonido).

**Dónde se guardan:** `assets/audio/sound-fx/`

| Archivo | Prompt ElevenLabs Sound FX | Duración |
|---|---|---|
| `sfx-olas-loop.mp3` | "Gentle ocean waves crashing on a beach, peaceful, loopable" | 10s |
| `sfx-splash.mp3` | "Big water splash, like jumping into a lagoon" | 2s |
| `sfx-chime-fragmento.mp3` | "Magical chime, sparkling, ascending tone, like collecting a treasure" | 2s |
| `sfx-candado-abrir.mp3` | "Metal padlock clicking open with a satisfying mechanical sound" | 2s |
| `sfx-volcan-fuego.mp3` | "Volcano fire crackling and rumbling, intense" | 5s |
| `sfx-caer-volcan.mp3` | "Falling whoosh ending in fire roar, cartoon style" | 3s |
| `sfx-revive.mp3` | "Magical revive sparkle, like a phoenix rising, ascending" | 2s |
| `sfx-piedra-completa.mp3` | "Stones clicking together, magical resonance, ancient power awakening" | 4s |

---

## Bloque 11 · Vídeo coreografía

**URL del PDF:** https://www.youtube.com/watch?v=KXewT-mhoPk
**Uso:** embed directo en el punto 2 sub-prueba A.
**No necesita descarga.**

---

## Orden recomendado de trabajo (Álvaro)

1. **Personajes (Bloque 1)** — 10 min de Google Images. Es lo más visible y lo más rápido.
2. **Mapa (Bloque 2)** — 5 min Google o 1 prompt Gemini.
3. **Iconos candado (Bloque 4) + Sopa imágenes (Bloque 5)** — ARASAAC + Google Images. 20 min.
4. **Voz historiador (Bloque 6)** — ElevenLabs. 7 textos. 20 min.
5. **Voz Te Fiti (Bloque 7) + pares mínimos (Bloque 8)** — ElevenLabs. 30 min.
6. **Música (Bloque 9)** — Suno. 3 prompts. 15 min.
7. **Sound FX (Bloque 10)** — ElevenLabs Sound FX. 8 prompts. 15 min.

**Total estimado:** ~2 horas de generación.

Cuando esté todo en su sitio, montar el HTML lleva 1 día. Lo puede hacer Claude Code (es lo recomendado por volumen de líneas) o yo paso a paso aquí.

---

*Última actualización: 9 junio 2026 · Autor: Claude con Álvaro*

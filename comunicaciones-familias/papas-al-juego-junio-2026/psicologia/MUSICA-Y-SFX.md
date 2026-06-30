# Música y SFX · Psicología · El Gran Viaje del Explorador

**Total: 2 piezas de música + 6 SFX + 3 ambientes naturales (descargados).**

---

## TANDA 3 · MÚSICA

> Herramienta principal: **Suno** (https://suno.com). Si Suno bloquea descarga, alternativa: **ElevenLabs Music** (descarga directa) o **MusicFX Google Labs** (https://labs.google/fx/tools/music-fx).

> En Suno: modo **Custom** (NO Quick) + **"Instrumental" ON** + pegar el prompt en "Style of music".

Carpeta destino: `assets/audio/musica/`

### Pieza 1 · Música ambiente exploración (LOOP principal)
**Guardar como:** `musica-exploracion-loop.mp3`

```
Soft instrumental exploration adventure music, gentle acoustic guitar fingerpicking, warm strings, light flute melody, calm uplifting mood, cinematic but understated, reminiscent of a peaceful journey through nature, soft mountain travel theme, no vocals, no drums, no electric guitar, no synthesizers, only acoustic instruments, slow tempo around 70 bpm, loopable and continuous for 3 to 4 minutes
```

> **Esta es la música que suena durante TODA la gymkana en loop.** Tiene que ser muy suave, no cansar después de 10 minutos. Generad 2-3 versiones en Suno y elegid la menos invasiva.

---

### Pieza 2 · Música festiva final (CELEBRACIÓN)
**Guardar como:** `musica-celebracion-final.mp3`

```
Triumphant uplifting orchestral celebration music, soaring strings, light brass, gentle percussion (light hand drums or shaker only), epic but warm and joyful, achievement and accomplishment vibe, like reaching the summit of an adventure, cinematic family-movie ending, no vocals, no electric guitar, no synthesizers, 1 to 2 minutes
```

> Esta solo suena en la pantalla final + celebración. No tiene que loop perfecto, dura lo que dura.

---

## TANDA 4 · SFX

> Herramienta: **ElevenLabs Sound Effects** (https://elevenlabs.io/app/sound-effects). Descarga directa MP3.

> Si una opción no convence, generad 2-3 variantes y elegid.

Carpeta destino: `assets/audio/sound-fx/`

### SFX 1 · Pisada explorador
**Guardar como:** `sfx-01-pisada.mp3`

```
Single soft footstep on a forest path, light boot crunching on dry leaves and dirt, natural and warm, short duration
```

> Se usa cuando el avatar avanza entre paradas en el mapa.

---

### SFX 2 · Chime ganar insignia
**Guardar como:** `sfx-02-chime-insignia.mp3`

```
Magical achievement chime, bright bell sparkle with a small uplifting ascending tone, warm and rewarding, short duration around 1 second, cinematic family-game feel
```

> Suena al desbloquear cada insignia (5 veces en total durante la gymkana).

---

### SFX 3 · Pop sopa de letras
**Guardar como:** `sfx-03-pop-palabra.mp3`

```
Soft satisfying pop sound, like discovering a hidden item, gentle and bright, very short duration around 0.4 seconds, friendly puzzle game feel
```

> Suena al encontrar cada emoción en la sopa de letras del Valle.

---

### SFX 4 · Splash agua
**Guardar como:** `sfx-04-splash-agua.mp3`

```
Gentle water splash, like a small object dropping into a calm river, short and natural, soft and friendly, around 0.8 seconds
```

> Suena en el Río de la Cooperación cuando se mueven los globos.

---

### SFX 5 · Click número correcto
**Guardar como:** `sfx-05-click-numero.mp3`

```
Small soft confirmation click with a subtle warm tone, like tapping a wooden game piece, very short duration around 0.3 seconds, friendly and tactile
```

> Suena al pulsar cada número en la secuencia del Bosque.

---

### SFX 6 · Confetti final
**Guardar como:** `sfx-06-confetti.mp3`

```
Joyful celebration burst, soft popping confetti sound with a sparkle layer on top, bright and happy, around 1.5 seconds, family-friendly party feel
```

> Suena en la celebración final.

---

## AMBIENTES NATURALES (descargar de Pexels / Mixkit, NO generar)

> El brief de Andrea pide "pájaros, viento ligero, agua fluyendo cerca de ríos, naturaleza tranquila" como capa de ambiente sostenido. Esto es mejor descargarlo libre de derechos que generarlo.

Carpeta destino: `assets/audio/ambiente/`

### Ambiente 1 · Pájaros del bosque
**Buscar en:** https://mixkit.co/free-sound-effects/birds/ o https://pixabay.com/sound-effects/search/birds/
**Guardar como:** `ambiente-01-pajaros.mp3`

Recomendado: una pista de 2-3 minutos de canto de pájaros suave, sin gritos estridentes. Tipo "morning forest birds, gentle".

### Ambiente 2 · Viento ligero
**Buscar en:** https://mixkit.co/free-sound-effects/wind/
**Guardar como:** `ambiente-02-viento.mp3`

Recomendado: brisa suave entre hojas, 2-3 minutos. Que NO sea tormenta.

### Ambiente 3 · Agua fluyendo
**Buscar en:** https://mixkit.co/free-sound-effects/water/ o https://pixabay.com/sound-effects/search/river/
**Guardar como:** `ambiente-03-rio.mp3`

Recomendado: río calmado fluyendo, 1-2 minutos. Solo se usa en el Río de la Cooperación.

---

## Mezcla recomendada en el HTML

> Niveles base aprendidos en TO (volúmenes BAJOS):

| Tipo | Volumen recomendado |
|---|---|
| Narrador | 1.00 |
| Música ambiente (loop) | **0.10** |
| Música celebración final | **0.18** |
| SFX (chime, pop, click) | **0.22** |
| Ambientes naturales (loop) | **0.08** |

Los ambientes naturales se mezclan SUMADOS a la música ambiente (los pájaros + la música suenan a la vez). El SFX del río solo cuando entras al Río.

**Reglas innegociables que viene del estándar Ceci** (ya están en CLAUDE.md):
- Mientras suena el narrador → SFX en loop se silencian, música queda bajísima (0.05).
- Al cambiar de pantalla → SFX se paran (excepto música y ambientes).
- Mute global persistente.

Esto lo gestiono en el HTML, no tienes que tocar nada en los MP3.

---

## Resumen

| Tanda | Archivos | Herramienta | Coste |
|---|---|---|---|
| 3 · Música | 2 | Suno (free 10 canciones/día) | 0 € |
| 4 · SFX | 6 | ElevenLabs Sound FX | 0 € (plan free) |
| Ambientes | 3 | Pexels / Mixkit / Pixabay | 0 € |
| **TOTAL** | **11 archivos** | | **0 €** |

Cuando los tengas todos en sus carpetas (`musica/`, `sound-fx/`, `ambiente/`), avisas y arranco a montar el HTML de Psicología v2 estándar Ceci.

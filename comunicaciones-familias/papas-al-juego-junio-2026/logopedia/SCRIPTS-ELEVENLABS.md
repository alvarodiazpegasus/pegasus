# SCRIPTS ElevenLabs · Gymkana "La Piedra de Te Fiti"

> Cada bloque está listo para copy/paste directo en ElevenLabs.
> Recuerda configurar la voz antes de pegar el texto.

---

## Configuración de voces

### Voz 1 · El Historiador (toda la narración del recorrido)

- **Voz:** Voice Design con prompt → *"Middle-aged Spanish male voice, deep and warm, like a documentary narrator or a wise historian telling an ancient legend. Slow pace, dramatic but not theatrical, like Morgan Freeman in Spanish."*
- **Modelo:** Eleven Multilingual v2.
- **Settings:** Stability 50 · Similarity 75 · Style exaggeration 30 · Speaker boost ON.
- **Idioma:** Español.

### Voz 2 · Te Fiti (frase final)

- **Voz:** Voice Design con prompt → *"Ethereal female Spanish voice, ancient goddess of nature, deep but gentle, slow pace, warm and benevolent, slightly mystical."*
- **Settings:** Stability 40 · Similarity 75 · Style 60 · Speaker boost ON.
- **Post-procesado opcional:** añadir reverb suave en Audacity para dar sensación etérea.

### Voz 3 · Logopeda (pares mínimos)

- **Voz:** voz preset `Bella` con español, o cualquier voz femenina española clara.
- **Settings:** Stability 70 · Similarity 75 · Style 0 (lo más neutro y articulado posible).

---

## 📜 Scripts · Voz del Historiador

### `historiador-01-inicio.mp3` · Bienvenida

```
Bienvenidos, valientes exploradores.

El océano os ha elegido a vosotros.

Hace tiempo, la poderosa piedra de Te Fiti — la que da vida a todo lo que existe — se rompió en cuatro fragmentos. Y esos fragmentos quedaron desperdigados por esta isla misteriosa.

Sin la piedra, la vida desaparece poco a poco… las plantas se marchitan, los peces huyen, y la oscuridad se extiende por el mar.

Necesitamos vuestro valor.

Pero antes de partir… debéis elegir a vuestro guía.

¿Quién os acompañará en esta aventura?
```

---

### `historiador-02-laguna.mp3` · Punto 2 · La laguna submarina

```
El primer fragmento de la piedra cayó al fondo de la laguna.

Para recuperarlo, tendréis que demostrar que sois dignos del océano.

Dos pruebas os esperan bajo las olas.

La primera: bailad con las olas, sentid su ritmo.

La segunda: encontrad lo que se repite entre las imágenes del mar.

Solo así, la laguna os entregará su secreto.
```

---

### `historiador-03-orilla.mp3` · Punto 3 · La orilla encantada

```
El segundo fragmento quedó enterrado en la orilla… donde las olas hablan en secreto.

Pero las palabras del océano son traicioneras.

Suenan casi iguales… pero no lo son.

Escuchad con mucha atención. Y solo entonces, sacad la palabra correcta del cuenco.

Vuestros oídos son ahora vuestra brújula.
```

---

### `historiador-04-bosque.mp3` · Punto 4 · El bosque de los secretos

```
En lo profundo del bosque, un espíritu antiguo ha escondido el tercer fragmento.

Pero no os lo dará fácilmente.

Hay alguien que necesita ayuda… y solo vosotros podéis descubrir qué necesita.

Resolved el misterio. Encontrad las tres pistas que abren el candado secreto.

Y el bosque os recompensará.
```

---

### `historiador-05-volcan.mp3` · Punto 5 · El volcán

```
El último fragmento está en la cima del volcán.

Pero el gran Maui os advierte:

quien suba… deberá responder a las preguntas del volcán.

Quien falla… cae a la lava.

Pero no temáis. Los semidioses siempre reviven. Podéis intentarlo todas las veces que necesitéis.

¿Estáis preparados para responder?
```

---

### `historiador-06-final.mp3` · Pre-Te Fiti

```
Habéis recuperado los cuatro fragmentos.

La piedra vuelve a brillar.

Y desde el corazón de la isla… algo despierta.
```

(Tras este audio sonará la música épica + aparición visual de Te Fiti + audio de Te Fiti)

---

### `historiador-victoria.mp3` · Genérico (tras cada fragmento conseguido)

```
Habéis recuperado un fragmento.

La isla os lo agradece.

Continuad. Aún queda camino.
```

---

## 🌿 Script · Voz de Te Fiti (final)

### `te-fiti-final.mp3`

```
Valientes exploradores…

Lo habéis logrado.

La piedra vuelve a estar entera… gracias a vosotros.

Recordad siempre este camino que habéis recorrido juntos.

Guardad vuestra piedra en la maleta… como recuerdo de todo lo que habéis aprendido y vivido.

Cuidaos mucho. Disfrutad de las vacaciones.

Y llevad siempre el espíritu del océano con vosotros.

Hasta siempre.
```

(En el HTML aparecerá Te Fiti a pantalla completa mientras suena. Música final de Suno acompañando.)

---

## 🔊 Scripts · Pares mínimos (voz femenina clara)

Cada palabra es un MP3 INDIVIDUAL. Generar UNA palabra por audio.

### Par 1 · /p/ vs /b/
- `pala.mp3` → texto: `pala`
- `bala.mp3` → texto: `bala`

### Par 2 · /c/ vs /g/
- `cama.mp3` → texto: `cama`
- `gama.mp3` → texto: `gama`

### Par 3 · /t/ vs /d/
- `tos.mp3` → texto: `tos`
- `dos.mp3` → texto: `dos`

### Par 4 · /f/ vs /j/
- `foto.mp3` → texto: `foto`
- `jota.mp3` → texto: `jota`

### Par 5 · /m/ vs /n/
- `mata.mp3` → texto: `mata`
- `nata.mp3` → texto: `nata`

### Par 6 · /r/ vs /l/
- `pero.mp3` → texto: `pero`
- `pelo.mp3` → texto: `pelo`

### Par 7 · /k/ vs /t/
- `coro.mp3` → texto: `coro`
- `toro.mp3` → texto: `toro`

### Par 8 · /ch/ vs /y/
- `chapa.mp3` → texto: `chapa`
- `llapa.mp3` → texto: `llapa` (o cambiar a otro par si suena raro)

**Truco para que ElevenLabs no añada entonación rara:**
Pega cada palabra con un punto al final. Ej: `pala.` en lugar de `pala`. Eso le dice al modelo que es una unidad cerrada.

---

## 📋 Checklist de generación

Marca cuando lo hayas subido a la carpeta correspondiente:

- [ ] `historiador-01-inicio.mp3`
- [ ] `historiador-02-laguna.mp3`
- [ ] `historiador-03-orilla.mp3`
- [ ] `historiador-04-bosque.mp3`
- [ ] `historiador-05-volcan.mp3`
- [ ] `historiador-06-final.mp3`
- [ ] `historiador-victoria.mp3`
- [ ] `te-fiti-final.mp3`
- [ ] 16 pares mínimos × 1 MP3 cada uno

---

*Última actualización: 9 junio 2026*

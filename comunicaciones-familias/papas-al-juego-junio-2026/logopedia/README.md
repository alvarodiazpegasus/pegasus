# Gymkana Logopedia · "La Piedra de Te Fiti" · Cecilia

> Encargo: Cecilia (logopeda) pidió a Álvaro algo IMPOSIBLE / CINE / IDÍLICO.
> Tema: mundo Moana. Tono: épico, narrado por un historiador. Stack: multi-IA.

---

## Estado actual

**Fase:** preproducción · generación de assets.
**HTML:** todavía no construido. Se monta cuando estén todos los assets.

---

## Documentos clave de esta carpeta

| Documento | Para qué sirve |
|---|---|
| [`ASSETS.md`](./ASSETS.md) | **Documento maestro.** Inventario completo de todo lo que hay que generar/conseguir. Léelo primero. |
| [`SCRIPTS-ELEVENLABS.md`](./SCRIPTS-ELEVENLABS.md) | Textos listos para copy/paste en ElevenLabs (voz historiador, Te Fiti, pares mínimos). |
| [`PROMPTS-SUNO.md`](./PROMPTS-SUNO.md) | Prompts para Suno (3 piezas musicales). |
| [`BUSQUEDAS-GOOGLE.md`](./BUSQUEDAS-GOOGLE.md) | Lista exacta de qué buscar en Google Images y dónde guardar cada PNG. |
| `referencias-pdf/` | Las 4 imágenes que adjuntó Ceci en su PDF (referencias visuales). |
| `assets/` | Aquí van todos los archivos generados (vacío hasta que Álvaro empiece). |

---

## Estructura de `assets/`

```
assets/
├── imagenes/
│   ├── personajes/         ← Moana, Maui, Hei Hei, Te Fiti, piedra
│   ├── mapa/               ← isla aérea
│   ├── piedra/             ← piedra completa + 4 fragmentos
│   ├── iconos-candado/     ← pictogramas para historias sociales
│   └── sopa-de-imagenes/   ← iconos veraniegos del punto 2B
├── audio/
│   ├── voz-historiador/    ← MP3 narración (7 archivos)
│   ├── voz-te-fiti/        ← MP3 frase final
│   ├── pares-minimos/      ← MP3 palabras del cuenco (16 archivos)
│   ├── musica/             ← MP3 Suno (3 temas)
│   └── sound-fx/           ← MP3 ElevenLabs SFX (8 archivos)
└── video/                  ← (no usado, vídeo va embebido de YouTube)
```

---

## Próximos pasos (en orden)

1. ✅ Estructura de carpetas creada.
2. ✅ Inventario de assets cerrado.
3. 🔴 **Álvaro genera assets** (~2h en total):
   - Imágenes (45 min) → ver `BUSQUEDAS-GOOGLE.md`.
   - Voces ElevenLabs (50 min) → ver `SCRIPTS-ELEVENLABS.md`.
   - Música Suno (15 min) → ver `PROMPTS-SUNO.md`.
   - SFX ElevenLabs Sound FX (15 min) → ver `ASSETS.md` · Bloque 10.
4. 🔴 Una vez en su sitio, **construcción del HTML** (Claude Code o Claude aquí).

---

## Decisiones tomadas con Álvaro

- **Versión a construir:** la enriquecida directamente (no estricta), porque Ceci diseñó pensando en CINE.
- **Personajes:** Álvaro descarga PNGs de Disney/fan-art de Google. No se generan en Gemini.
- **Audio:** se va al máximo. Voz historiador + Te Fiti + pares mínimos + música Suno + SFX.
- **Vídeo coreografía:** embed YouTube directo (el del PDF).

---

*Última actualización: 9 junio 2026*

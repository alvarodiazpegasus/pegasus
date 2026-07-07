# BÚSQUEDAS Google · Gymkana "La Piedra de Te Fiti"

> Cada bloque te dice: QUÉ buscar en Google Images, QUÉ filtros aplicar y DÓNDE guardar el PNG.
> Filtros recomendados de Google Images: Herramientas → Tipo: **Imágenes prediseñadas** o **PNG** + Color: Transparente.

---

## 🧍 Bloque 1 · Personajes (5 PNG)

**Carpeta destino:** `assets/imagenes/personajes/`

| Búsqueda Google | Guardar como |
|---|---|
| `moana disney png transparent` | `moana.png` |
| `maui moana png transparent` | `maui.png` |
| `hei hei chicken moana png transparent` | `hei-hei.png` |
| `te fiti goddess moana png transparent` | `te-fiti.png` |
| `heart of te fiti stone png transparent` | `piedra-completa.png` |

**Tips:**
- Filtra por tamaño grande (>800px) para que se vean bien.
- Si una sale con fondo blanco, dímelo y la paso por remove.bg.
- Si el de Moana no es transparente, prueba con `moana fan art png` o `moana clipart transparent`.

**Si todo falla**, la página 5 del PDF de Ceci tiene los 5 personajes oficiales — los recorto yo de ahí.

---

## 🏝️ Bloque 2 · Mapa (1 imagen)

**Carpeta destino:** `assets/imagenes/mapa/`

| Búsqueda Google | Guardar como |
|---|---|
| `motunui island moana map illustration` | `isla-tefiti.jpg` |

**Alternativas si no te convence:**
- `polynesian island illustration top view`
- `tropical island fantasy map disney style`
- `moana movie island background`

**Lo importante:** que sea **horizontal** (panorámico, no cuadrado), **alta resolución** (>1920px), y que tenga **playa + jungla + volcán + agua** visibles. Si no encontramos uno bueno, lo generamos con Gemini (prompt ya escrito en `ASSETS.md` · Bloque 2).

---

## 🪨 Bloque 3 · Piedra fragmentada (1 imagen base)

**Carpeta destino:** `assets/imagenes/piedra/`

| Búsqueda Google | Guardar como |
|---|---|
| `heart of te fiti png transparent` | `piedra-completa.png` (la misma del Bloque 1 vale) |

**Yo después la troceo en 4 fragmentos con Python.** Solo necesito una.

Si quieres también una versión "vacía" (silueta tenue para ver dónde encajan):
- Yo la genero en 30 segundos con PIL (rebajo opacidad de la original).

---

## 🔒 Bloque 4 · Iconos del candado (10 pictogramas)

**Carpeta destino:** `assets/imagenes/iconos-candado/`

**MEJOR OPCIÓN: ARASAAC** (banco de pictogramas español, libre y oficial para logopedia).
👉 https://arasaac.org/

Buscar y descargar PNG transparente cada uno:

| Búsqueda en ARASAAC | Guardar como |
|---|---|
| `mujer` o `madre` | `icono-mama.png` |
| `hombre` o `padre` | `icono-papa.png` |
| `adulto` | `icono-persona-adulta.png` |
| `lupa` | `icono-lupa.png` |
| `monedero` o `cartera` | `icono-monedero.png` |
| `llaves` | `icono-llaves.png` |
| `juguete` o `pelota` | `icono-juguete.png` |
| `libro` | `icono-libro.png` |
| `zapatos` | `icono-zapatos.png` |
| `mochila` | `icono-mochila.png` |

**Si no te apetece ARASAAC**, Google Images con `pictograma [nombre] arasaac png` te lleva directo.

---

## 🌅 Bloque 5 · Sopa de imágenes (23 iconos veraniegos)

**Carpeta destino:** `assets/imagenes/sopa-de-imagenes/`

**Estilo:** iconos planos, colores pastel, fondo transparente. Estilo "kawaii beach".

Lista en `ASSETS.md` · Bloque 5 (son 23 iconos, te los repito aquí abreviado):

```
helado · estrella de mar · sombrilla · cangrejo · pelota playa · cubo arena ·
tortuga marina · gafas sol corazón · aletas buceo · medusa · sandía · sombrero paja ·
tumbona · pez tropical · cámara fotos · coral · flotador · sol sonriente ·
cesta picnic · gafas snorkel · bikini · flor hibisco · palmera
```

**Búsqueda genérica para Google:**
```
[ICONO] flat icon kawaii summer png transparent
```

**ATAJO: Sitios mejores que Google para esto:**
- 👉 **Flaticon.com** (gratis con atribución, gran calidad, todos los iconos en el mismo estilo)
- 👉 **FreePik.com** (gratis con atribución)
- 👉 **Iconscout.com**

En cualquiera de los tres, busca "summer beach icons pack flat" y descargas un pack entero en lugar de 23 búsquedas sueltas. **Te ahorra 30 min.**

**Plan B (yo lo hago):** Cecilia adjuntó un tablero ya hecho en el PDF. Lo recorto en 23 piezas individuales con Python en 5 minutos. Si vas mal de tiempo, dime y lo hago.

---

## 🎯 Resumen de qué tienes que descargar tú

| Carpeta | Cuántos archivos | Tiempo estimado |
|---|---|---|
| `personajes/` | 5 PNG | 10 min |
| `mapa/` | 1 JPG/PNG | 5 min |
| `iconos-candado/` | 10 PNG (ARASAAC) | 15 min |
| `sopa-de-imagenes/` | 23 PNG (Flaticon pack) | 15 min |
| **TOTAL** | **39 archivos** | **45 min** |

---

## 📋 Checklist Álvaro

Marca cuando esté:

**Personajes:**
- [ ] `personajes/moana.png`
- [ ] `personajes/maui.png`
- [ ] `personajes/hei-hei.png`
- [ ] `personajes/te-fiti.png`
- [ ] `personajes/piedra-completa.png`

**Mapa:**
- [ ] `mapa/isla-tefiti.jpg`

**Iconos candado:**
- [ ] 10 iconos en `iconos-candado/`

**Sopa imágenes:**
- [ ] 23 iconos en `sopa-de-imagenes/`

---

*Última actualización: 9 junio 2026*

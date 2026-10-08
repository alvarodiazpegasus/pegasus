# Hub Pegasus · repositorio

⚠️ **Esto es un repositorio git de verdad**, clonado de `github.com/alvarodiazpegasus/pegasus`. Es el Hub: la intranet del equipo, publicada con GitHub Pages en **hub.lomionoesnormal.com**.

**La fuente de verdad es GitHub.** Lo que hay en disco es copia de trabajo.

> Escrito el 2026-09-28. Esta carpeta llevaba 3 ficheros y 7 subcarpetas sin ninguna ficha de entrada. Este [`04_SOFTWARE/pegasus/pegasus.md`](pegasus.md) **no estaba en el repo**: aparecerá en `git status` como fichero nuevo. Decide si se commitea o se ignora.

## Qué hay aquí

| Carpeta / fichero | Qué es |
|---|---|
| [`index.html`](index.html) | La portada del Hub. Es la aplicación entera: sin build, sin `package.json` |
| [`CNAME`](CNAME) | El dominio de GitHub Pages |
| [`README.md`](README.md) | 🔴 Dos líneas. Prácticamente vacío — ver abajo |
| `assets/` | Copia de los assets de marca que usa el Hub: imagotipo, manual de identidad, colores |
| `docs/` | El design system del Hub y el manual de uso |
| `direccion/` | Piezas de dirección: dashboards, landings institucional y de inversores, memoria, pegasusland. Y `descargables/` |
| `formacion/` | Formaciones y protocolos publicados para el equipo, en HTML |
| `propuestas/` | Las landings de propuesta a cliente y ayuntamiento, publicadas |
| `proyectos-indiferente/` | Piezas de proyectos de Indiferente |
| `comunicaciones-familias/` | Comunicaciones publicadas para familias |

## Lo que NO está aquí

- **La ficha del repo** —remoto, despliegue, estado, avisos de seguridad— está en [`04_SOFTWARE/04-software.md`](../04-software.md). Léela antes de tocar nada.
- **Las fuentes** de casi todo lo publicado aquí: las propuestas viven en `03_PROYECTOS/`, la doctrina en `00_CANON/`. Esto es **publicación**, no fuente.
- **Quién manda sobre cada copia** — [`00_CANON/propagacion.md`](../../00_CANON/propagacion.md). Tocar una copia del canon obliga a leerlo antes de cerrar.

## 🔴 Es un repo público con material que no debería estar ahí

Está escrito en [`04_SOFTWARE/04-software.md`](../04-software.md) y se repite aquí porque se lee desde dentro:

- `formacion/portal-empleado.html` lleva un payload cifrado con datos internos del equipo.
- `direccion/descargables/` contiene el expediente legal de la sede.

**No añadas nada con datos personales, credenciales ni documentación legal.** Todo lo que entre aquí se publica.

## 🔴 El README no dice nada

[`README.md`](README.md) tiene dos líneas: el nombre y una frase. Quien llegue por GitHub no sabe qué es esto, cómo se despliega ni qué no puede subir. **Hay que escribirlo** — y como se commitea al repo público, se escribe desde el repo, no desde aquí.

## ⬜ Qué no consta

- ⬜ No consta la versión ni el último commit desplegado. Se comprueba con `git log`, no se declara.
- ⬜ No consta qué contiene exactamente `direccion/descargables/`: no se ha abierto.

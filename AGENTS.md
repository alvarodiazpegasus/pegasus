# AGENTS.md — repo `pegasus` (Hub)

**Estás dentro de un repositorio PÚBLICO.** Todo lo que entre aquí queda publicado en internet y en el historial de git para siempre.

Este fichero dice cómo se trabaja aquí. Vale para cualquier agente: Claude Code, Codex, Grok o el que venga. Escrito el 29/09/2026.

> 🔴 **La regla que gobierna todo lo demás: si dudas de si algo puede subirse, no se sube.** Se pregunta antes. Un fichero publicado por error no se arregla borrándolo: sigue en el historial.

---

## 1 · Qué es esto

| | |
|---|---|
| **Qué** | El Hub: la intranet del equipo de Fundación Pegasus. 55 herramientas, acceso por contraseña en tres niveles |
| **Remoto** | `github.com/alvarodiazpegasus/pegasus` · rama `main` · **público** |
| **Publicación** | GitHub Pages → **hub.lomionoesnormal.com** (CNAME en la raíz, **sin CI**) |
| **Stack** | HTML/CSS/JS estático. **Sin build, sin `package.json`, sin dependencias** |
| **Qué NO es** | No es una aplicación con servidor. No hay backend, no hay base de datos, no hay sesión real |

**Ficha del repo:** [`../04-software.md`](../04-software.md) · **Guía de esta carpeta:** [`pegasus.md`](pegasus.md) · **Normas generales:** [`../../AGENTS.md`](../../AGENTS.md)

### El mapa

| Carpeta | Qué contiene |
|---|---|
| `index.html` | La portada. Es la aplicación entera |
| `assets/` | Imagotipo, manual de identidad, colores |
| `docs/` | El design system del Hub y su manual de uso |
| `direccion/` | Dashboards, landings y memorias de dirección |
| `formacion/` | Formaciones y protocolos publicados para el equipo |
| `propuestas/` | Landings de propuesta a cliente y ayuntamiento |
| `proyectos-indiferente/` | Piezas de proyectos de Indiferente |
| `comunicaciones-familias/` | Comunicaciones publicadas para familias |

---

## 2 · ⛔ Lo que NUNCA entra aquí

Esto es lo primero que se comprueba antes de escribir un solo fichero.

⛔ **Datos personales de nadie.** Ni nombres con datos asociados, ni teléfonos, ni correos personales, ni IBAN, ni DNI, ni datos de salud, ni de menores, ni de familias, ni del equipo.

⛔ **Credenciales de ningún tipo.** Ni contraseñas, ni claves de API, ni tokens, ni cadenas de conexión — **tampoco dentro del JavaScript**, que aquí es texto plano a la vista de cualquiera.

⛔ **Documentación legal, contractual o financiera** de la fundación.

⛔ **Payloads cifrados con contenido interno.** El cifrado en cliente no protege nada publicado: el navegador lleva la clave y el fichero lo descarga cualquiera.

⛔ **Copias de ficheros de `00_CANON/`** sin haber leído antes [`../../00_CANON/propagacion.md`](../../00_CANON/propagacion.md). Aquí se publica; no se es fuente.

> **Antes de cada commit, el agente repasa esta lista fichero por fichero.** No se delega en `.gitignore`: aquí no hay build que filtre nada.

---

## 3 · 🔴 Deuda ya existente, conocida y sin resolver

Dos cosas ya están publicadas y no deberían estarlo. Están apuntadas, no son un descubrimiento.

- **`formacion/portal-empleado.html`** lleva un payload cifrado con material interno del equipo.
- **`direccion/descargables/`** contiene documentación legal y económica de la sede.

**Reglas mientras eso siga ahí:**

1. **No se toca ninguno de los dos sin orden expresa de Álvaro.** Borrarlos del árbol no los quita del historial, y hacerlo a medias da una falsa sensación de arreglo.
2. **No se replica ese patrón.** Que ya haya material así dentro no autoriza a añadir más.
3. **No se enlaza ni se cita su contenido** desde ninguna pieza nueva.

⬜ **No consta** que se haya decidido qué hacer con ellos. Hasta que Álvaro lo decida, la única regla es no empeorarlo.

---

## 4 · El acceso por contraseña no es seguridad

El Hub tiene tres niveles de acceso, resueltos en el navegador.

**Eso es una cortina, no una puerta.** Cualquiera con el navegador abierto ve el código, la lógica y todo lo que el fichero lleve dentro. Sirve para que un compañero no entre por error donde no le toca. **No sirve para proteger nada.**

Consecuencia práctica, y es la que importa:

> **Si un contenido necesitara contraseña de verdad, ese contenido no va en este repo.**

---

## 5 · Cómo se sube un cambio

**Con GitHub Desktop, no por terminal.** 📄

1. El fichero se escribe en `04_SOFTWARE\pegasus\`
2. Se repasa el §2 de este documento, fichero por fichero
3. Se abre GitHub Desktop, se escribe una línea de resumen
4. **Commit to main** y **Push**
5. GitHub Pages publica solo en un par de minutos
6. Se comprueba en **hub.lomionoesnormal.com** con **Ctrl + F5**

⚠️ **Hay dos clones de `pegasus` en el disco.** Hasta el 28/09 GitHub Desktop apuntaba al viejo, en `MEGACEREBRO\github-pegasus\`. Se quitó de la lista pero **no se borró del disco**. Si aparecen dos en el desplegable, **el bueno es el de `04_SOFTWARE\`**.

🔴 **No hay CI, no hay tests, no hay entorno de pruebas.** Lo que se empuja a `main` está publicado en dos minutos. **Push es despliegue.**

---

## 6 · Cómo se escribe una pieza

Este repo es **publicación**, no fuente. Las fuentes viven fuera: las propuestas en `03_PROYECTOS/`, la doctrina en `00_CANON/`.

- **Un fichero HTML autocontenido por pieza.** Sin build, sin dependencias, sin gestor de paquetes.
- **La identidad visual sale de `docs/` y `assets/`**, no se improvisa.
- **El copy visible va en español** y pasa por el criterio de filosofía de Pegasus antes de publicarse.
- **No se cambia lo que ya estaba bien.** Se toca lo que se ha pedido y nada más.
- **Antes de dar una ruta, se lista la carpeta** y se comprueba que no hay otro fichero de nombre parecido.

---

## 7 · Lo que hay pendiente

- 🔴 **El `README.md` está prácticamente vacío**: dos líneas. Quien llegue por GitHub no sabe qué es esto, cómo se despliega ni qué no puede subir. Hay que escribirlo, y se escribe desde el repo porque se publica.
- ⬜ **No consta la versión ni el último commit desplegado.** Se comprueba con `git log`, no se declara.
- ⬜ **No consta el contenido exacto de `direccion/descargables/`.** No se ha auditado.

---

## 8 · Antes de decir que algo se ha hecho

**Un fichero anunciado y no escrito no existe.** Se comprueba en disco antes de afirmar que se ha creado.

**El estado se comprueba, no se declara.** Aquí eso significa mirar la página publicada, no el fichero local: son cosas distintas hasta que Pages termina.

**Lo que no consta se marca ⬜ y no entra en ningún cálculo.** No se rellena con supuestos.

---

*Las reglas de este repo viven aquí, en `AGENTS.md`. Si añades una nueva, se añade en este fichero y en ningún otro.*

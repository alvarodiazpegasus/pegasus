# HUB PEGASUS — DESIGN SYSTEM & ARQUITECTURA

**Versión 2.0 — Abril 2026**  
**Fundación Pegasus**

---

## 📋 ÍNDICE

1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Principios Impeccable](#principios-impeccable)
3. [Identidad Visual Pegasus](#identidad-visual-pegasus)
4. [Sistema de Colores](#sistema-de-colores)
5. [Tipografía](#tipografía)
6. [Espaciado (Spacing System)](#espaciado-spacing-system)
7. [Animaciones y Transiciones](#animaciones-y-transiciones)
8. [Componentes](#componentes)
9. [Arquitectura de Datos](#arquitectura-de-datos)
10. [Reglas de UX](#reglas-de-ux)
11. [Checklist Pre-Deploy](#checklist-pre-deploy)

---

## 🎨 FILOSOFÍA DE DISEÑO

### **Objetivo del Hub**
Repositorio digital centralizado de herramientas, propuestas y protocolos de Fundación Pegasus. Diseñado para uso interno del equipo, clientes externos, ayuntamientos y stakeholders.

### **Principios Clave**
1. **Limpio y profesional** — No saturar, más aire que color
2. **Identidad Pegasus al 100%** — Respeta el Manual de Identidad Visual
3. **Impeccable Standards** — Código frontend de nivel profesional
4. **Funcionalidad sobre estética** — La usabilidad nunca se sacrifica por el diseño

---

## ✨ PRINCIPIOS IMPECCABLE

El Hub sigue los principios de diseño **Impeccable** (pbakaus):

### **❌ ANTI-PATTERNS (NUNCA HACER)**
- ❌ **NO usar pure black/gray** (`#000000`, `#808080`)
- ❌ **NO usar bounce easing** en animaciones
- ❌ **NO usar Inter/Roboto** (son clichés de IA)
- ❌ **NO purple gradients** por todas partes
- ❌ **NO cards dentro de cards** (nested cards)
- ❌ **NO gray text sobre fondos de color**

### **✅ BUENAS PRÁCTICAS (SIEMPRE HACER)**
- ✅ **Tinted Neutrals** — Grises con tinte azulado
- ✅ **Professional Easing Curves** — `cubic-bezier` cuidadosamente calibradas
- ✅ **Spacing System de 4px** — Consistencia matemática
- ✅ **Glassmorphism sutil** — Blur y transparencias
- ✅ **Blur gradients** en bordes de carruseles
- ✅ **Micro-interacciones pulidas** — Hover states suaves

---

## 🏛️ IDENTIDAD VISUAL PEGASUS

### **Elementos NO Negociables**

#### **1. Imagotipo Horizontal**
- **Ubicación:** Header izquierda
- **Formato:** JPEG embebido en base64
- **Altura:** 48px (desktop), 40px (mobile)
- **Archivo:** `imagotipopegasushorizontalencolorJPGE.jpg`

#### **2. Degradado Pegasus Completo**
```css
--grad: linear-gradient(90deg, #08B75B, #007EC3, #974694, #E45E9B, #D6191B, #ED7928, #F3D100);
--grad-diag: linear-gradient(135deg, #08B75B, #007EC3, #974694, #E45E9B, #D6191B, #ED7928, #F3D100);
```

**Uso permitido:**
- Texto con `.grad-text` (clip background)
- Borde superior de modales (4px height)
- Footer eslogan

**❌ NO usar como:**
- Hero banner de fondo completo (eliminado en v2.0)
- Fondo de secciones enteras
- Thumbnails de cards (cada card tiene su gradiente específico)

#### **3. Paleta de Colores Pegasus**
```css
--verde:    #08B75B;  /* Esperanza, vida */
--azul:     #007EC3;  /* Inteligencia, frescura */
--morado:   #974694;  /* Profundidad */
--rosa:     #E45E9B;  /* Dulzura, amistad */
--rojo:     #D6191B;  /* Fuerza, revolución */
--naranja:  #ED7928;  /* Optimismo */
--amarillo: #F3D100;  /* Felicidad, acción */
```

**Asignación por servicio:**
- **TPT:** Morado + Rosa
- **Inclusive Sport:** Verde + Azul
- **Indiferente:** Rojo + Naranja + Amarillo
- **Corporativo:** Degradado completo

---

## 🎨 SISTEMA DE COLORES

### **Tinted Neutrals (Impeccable)**
```css
--negro:     #0A0E14;  /* Base oscura con tinte azulado */
--gris-900:  #1C2128;
--gris-800:  #2D3441;
--gris-700:  #3E4653;
--gris-600:  #5C6370;
--gris-500:  #7C818C;
--gris-400:  #9DA1AB;
--gris-300:  #BDC1CA;
--gris-200:  #DDE0E6;
--gris-100:  #EEF0F4;
--gris-50:   #F7F8FA;
--blanco:    #FFFFFF;
```

**Reglas de Uso:**
- Texto principal: `--negro`
- Texto secundario: `--gris-600`
- Bordes: `--gris-200`
- Fondos alternados: `--blanco` / `--gris-50`
- Hover states: `--gris-50` (sobre blanco)

### **Sombras**
```css
--shadow-sm:  0 1px 3px rgba(10,14,20,0.08);
--shadow-md:  0 4px 12px rgba(10,14,20,0.1);
--shadow-lg:  0 12px 32px rgba(10,14,20,0.15);
--shadow-xl:  0 20px 48px rgba(10,14,20,0.2);
```

---

## 📝 TIPOGRAFÍA

### **Fonts**
```css
/* Títulos: Chantal (uppercase) */
font-family: 'Chantal', 'Barlow', sans-serif;
text-transform: uppercase;
letter-spacing: 0.02em;

/* Cuerpo: Barlow Regular */
font-family: 'Barlow', -apple-system, BlinkMacSystemFont, sans-serif;
```

### **Jerarquía Tipográfica**
| Elemento | Font | Size | Weight | Transform |
|----------|------|------|--------|-----------|
| Logo (si texto) | Chantal | 2rem | 700 | UPPERCASE |
| Título Sección | Chantal | 1.25rem | 700 | UPPERCASE |
| Card Nombre | Barlow | 0.95rem | 700 | — |
| Card Descripción | Barlow | 0.82rem | 400 | — |
| Body Text | Barlow | 0.9rem | 400 | — |
| Tags | Barlow | 0.7rem | 700 | — |

### **Line Heights**
- Títulos: `1.1` - `1.3`
- Cuerpo: `1.6`
- Descripciones: `1.5`

---

## 📏 ESPACIADO (SPACING SYSTEM)

**Base: 4px**

```css
--space-1:  4px;
--space-2:  8px;
--space-3:  12px;
--space-4:  16px;
--space-5:  20px;
--space-6:  24px;
--space-7:  28px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
```

**Uso:**
- Padding interno de cards: `--space-4`
- Gap entre cards: `--space-4`
- Padding de secciones: `--space-10` (vertical), `--space-12` (horizontal)
- Margin entre secciones: `--space-12`

---

## ⚡ ANIMACIONES Y TRANSICIONES

### **Easing Curves (NO bounce)**
```css
--ease-out:     cubic-bezier(0.33, 1, 0.68, 1);      /* Para salidas */
--ease-in:      cubic-bezier(0.32, 0, 0.67, 0);      /* Para entradas */
--ease-in-out:  cubic-bezier(0.65, 0, 0.35, 1);      /* Para combinadas */
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1);   /* Para efectos especiales */
```

### **Duraciones Estándar**
- Hover states: `0.25s`
- Modales: `0.3s`
- Toasts: `0.3s`
- Scroll suave: `smooth` (CSS nativo)

### **Propiedades Animadas**
```css
transition: all 0.25s var(--ease-out);
/* O específicas: */
transition: transform 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out);
```

---

## 🧩 COMPONENTES

### **1. HEADER**
```
Estructura:
├─ Logo (imagotipo 48px)
├─ Subtitle (hub.lomionoesnormal.com)
└─ Search Box (glassmorphism)

Sticky: Sí
Backdrop blur: 12px
Border bottom: 1px solid var(--gris-100)
```

### **2. SEARCH BOX**
```css
- Glassmorphism: background rgba(255,255,255,0.7) + backdrop-filter blur(8px)
- Border radius: 100px
- Icon: 🔍 (left, absolute)
- Results dropdown: white background, shadow-lg, border-radius 16px
```

### **3. CARDS NORMALES** (Propuestas, Dirección, Proyectos, Protocolos)
```
Estructura:
├─ Thumbnail (140px height, gradiente + emoji 3rem)
├─ Body (padding 16px)
│   ├─ Nombre (0.95rem, bold)
│   ├─ Descripción (0.82rem, gris-600)
│   └─ Tags (🆕 Nuevo / 📦 Archivo)
└─ Lock icon (si aplica, absolute top-right)

Width: 260px (220px mobile)
Border: 1.5px solid gris-200
Border radius: 16px
Hover: translateY(-6px) + scale(1.02)
```

### **4. CARDS COMPACTAS** (Solo Recientes)
```
Estructura:
├─ Emoji (1.8rem, inline left)
└─ Body (flex-1)
    ├─ Nombre (0.9rem, bold, ellipsis)
    └─ Descripción (0.78rem, 2 líneas max)

Width: 320px (280px mobile)
Padding: 16px
Border radius: 12px
Hover: translateY(-3px) (sin scale)
```

**⚠️ CRÍTICO:** Los Recientes SIEMPRE usan cards compactas, el resto usan cards normales.

### **5. CARRUSELES**
```css
- Gap entre cards: 16px
- Padding: 8px 48px 16px
- Scroll: smooth, hide scrollbar
- Blur gradients: 60px width, opacity fade
- Botones: 40px circle, absolute, shadow-md
```

### **6. PROGRESS DOTS**
```css
- Dot normal: 6px circle, gris-300
- Dot active: 24px width, 6px height, gris-600, border-radius 3px
- Solo visible si total cards > 4
```

### **7. MODAL**
```
├─ Overlay (backdrop-filter blur 8px, rgba(10,14,20,0.5))
├─ Container (white, border-radius 24px, padding 40px)
│   ├─ Gradient top bar (4px height)
│   ├─ Icon (3rem)
│   ├─ Título (Chantal, 1.5rem, uppercase)
│   ├─ Descripción
│   ├─ Input password (center, letter-spacing 0.15em)
│   └─ Botones (Cancel + OK)
```

### **8. TOAST**
```css
- Position: fixed bottom-right
- Background: negro
- Color: blanco
- Border-radius: 16px
- Animation: slideIn from right
- Duration: 3s auto-hide
```

### **9. FOOTER**
```
├─ Eslogan (Chantal, grad-text)
└─ GitHub link (pill shape, border gris-200)

Border top: 1px solid gris-200
Padding: 32px 48px
```

---

## 🗂️ ARQUITECTURA DE DATOS

### **Estructura de Herramienta**
```javascript
{
  id: 'nombre-unico',
  nombre: 'Título Completo',
  descripcion: 'Descripción breve de 1-2 líneas.',
  seccion: 'protocolos' | 'propuestas' | 'direccion' | 'proyectos',
  tipo: 'formacion' | 'protocolo' | 'ayuntamiento' | 'empresa' | 'institucional' | 'estrategia' | 'consultoria',
  emoji: '🔥',
  gradiente: 'linear-gradient(135deg, #color1, #color2)',
  ruta: 'carpeta/archivo.html',
  nivel: 'libre' | 'propuestas' | 'direccion',
  fecha: 'YYYY-MM-DD'
}
```

### **Secciones del Hub**
| Sección | Password | Acceso |
|---------|----------|--------|
| Protocolos Internos | — | Libre |
| Propuestas | `MIEDO` | Bloqueado |
| Dirección | `P3G4SUS2026` | Bloqueado |
| Proyectos Indiferente | — | Libre |

### **Sistema de Tags Automáticos**
```javascript
- Antigüedad < 7 días  → 🆕 Nuevo (verde claro)
- Antigüedad > 30 días → 📦 Archivo (gris)
- Entre 7-30 días      → Sin tag
```

---

## 🎯 REGLAS DE UX

### **1. Sección RECIENTES**
- **Posición:** Primera fila, antes de todo
- **Contenido:** Top 10 herramientas más recientes (por fecha)
- **Tipo de card:** **COMPACTA** (sin thumbnail)
- **Ordenamiento:** Fecha DESC (más reciente primero)
- **Scroll:** Horizontal con blur gradients

### **2. Búsqueda Universal**
- Busca en TODAS las secciones (libre + bloqueadas)
- Cards bloqueadas muestran 🔒 en resultados
- Resultados clickeables → abren modal si bloqueado

### **3. Bloqueo por Card (No por Sección)**
- Cards bloqueadas visibles con 🔒
- Click en card bloqueada → Modal de password
- Password correcto → unlocks toda la sección
- Estado unlocked persiste en sesión (Set)

### **4. Filtros en Propuestas**
- Todas / 🏛️ Aytos / 🏢 Empresas / 🌍 Institucional
- Basado en campo `tipo`
- Cards hidden con clase `.hidden`

### **5. Vista Lista/Tarjetas**
- Toggle por sección (NO aplica a Recientes)
- Vista lista: cards horizontales, sin descripción visible

### **6. Fondos Alternados**
- Secciones impares: `--blanco`
- Secciones pares: `--gris-50`
- Blur gradients se adaptan automáticamente

### **7. Responsive**
- Mobile breakpoint: `768px`
- Header: stack vertical en mobile
- Cards: width reducido (220px)
- Logo: 40px height en mobile

---

## ✅ CHECKLIST PRE-DEPLOY

### **Antes de subir a GitHub:**

#### **Identidad Visual**
- [ ] Imagotipo Pegasus en header (no texto "HUB PEGASUS")
- [ ] No hay hero banner con "TODO LO QUE NECESITAS"
- [ ] Degradado Pegasus solo en eslogan footer y borde modal
- [ ] Todos los gradientes de cards son correctos

#### **Arquitectura CSS**
- [ ] Tinted neutrals (no pure black/gray)
- [ ] Easing curves profesionales (no bounce)
- [ ] Spacing system de 4px respetado
- [ ] Sombras con rgba(10,14,20,...)

#### **Componentes**
- [ ] Cards Recientes = compactas (sin thumbnail)
- [ ] Cards resto = normales (con thumbnail)
- [ ] Blur gradients en bordes de carruseles
- [ ] Progress dots funcionan (solo si >4 cards)
- [ ] Modal con backdrop blur funciona
- [ ] Toast con animación slideIn funciona

#### **Funcionalidad**
- [ ] Buscador universal funciona
- [ ] Bloqueo por card funciona
- [ ] Filtros en Propuestas funcionan
- [ ] Vista lista/tarjetas funciona
- [ ] Tags automáticos (🆕/📦) funcionan
- [ ] Scroll suave en carruseles

#### **Datos**
- [ ] Todas las herramientas tienen fecha
- [ ] Rutas de archivos son correctas
- [ ] Passwords son correctos (MIEDO, P3G4SUS2026)
- [ ] Sección Recientes muestra las 10 más recientes

#### **Accesibilidad & Performance**
- [ ] Logo embebido en base64 (no link externo)
- [ ] Fonts cargadas desde CDN
- [ ] No hay `console.log()` en producción
- [ ] Smooth scroll activado

---

## 📦 ESTRUCTURA DE ARCHIVOS

```
/
├── index.html                    ← Hub principal (este archivo)
├── CNAME                          ← Dominio hub.lomionoesnormal.com
├── README.md                      ← Documentación repo
├── DESIGN_SYSTEM.md              ← Este documento
│
├── /formacion/
│   ├── formacion-claude-abril-2026.html
│   ├── pegasus-cuponeo-2026.html
│   └── protocolo_accidentes_pegasus.html
│
├── /propuestas/
│   ├── loeches-indiferente.html
│   ├── morata-indiferente.html
│   ├── municipios-que-te-cuidan.html
│   ├── pascual-indiferente.html
│   ├── ruiz-indiferente.html
│   ├── pegasus-blackbull-landing.html
│   ├── metro-pegasus-v5.html
│   ├── guardianes_tres_cantos_unificado.html
│   ├── rivas-espaciocalma.html
│   └── cooltra-landing.html
│
├── /direccion/
│   ├── landing-inversores.html
│   ├── briefing-cmo.html
│   ├── pegasusland.html
│   └── naming-indiferente.html
│
└── /proyectos-indiferente/
    ├── /rivas-campamentos/
    │   └── index.html
    ├── /sediasa/
    │   └── index.html
    └── landing-conflictos-COMPLETO.html
```

---

## 🚀 WORKFLOW DE ACTUALIZACIÓN

### **Para añadir una nueva herramienta:**

1. **Subir el archivo HTML**
   - Vía GitHub web: `Add file` → `Create new file`
   - Nombre: `carpeta/nombre-archivo.html`

2. **Actualizar `index.html`**
   - Añadir objeto en array `herramientas`
   - Verificar: fecha, gradiente, emoji, ruta
   - Subir index.html actualizado

3. **Verificar en vivo**
   - Esperar 1-2 minutos (GitHub Pages deploy)
   - Verificar: card aparece, link funciona, tags correctos

---

## 🎓 RECURSOS DE REFERENCIA

### **Documentos Fuente**
- `Manual_de_Identidad_Visual__Pegasus_2.pdf`
- `Colores_y_normas_de_uso.pdf`
- `hub-pegasus-manual.docx`

### **Skills Aplicadas**
- **Impeccable** (pbakaus) — Frontend design standards
- **pegasus-identidad-visual-html** — Sistema de diseño Pegasus

### **Fonts**
- Chantal: `https://fonts.cdnfonts.com/css/chantal`
- Barlow: `https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;1,700`

---

## 📞 CONTACTO Y SOPORTE

**Responsable técnico:** Álvaro Díaz (CFO / Director Indiferente)

**GitHub:** https://github.com/alvarodiazpegasus/pegasus

**Hub:** http://hub.lomionoesnormal.com

**IONOS:** Panel en my.ionos.es (acceso Marre)

---

**Fundación Pegasus — Lo mío no es normal, pero lo tuyo tampoco.**

*Última actualización: Abril 2026*

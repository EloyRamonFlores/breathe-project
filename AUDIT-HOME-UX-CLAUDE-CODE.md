# 🔍 AUDITORÍA UX HOME — ToxinFree v1.2.0
## Prompt para Claude Code: Auditar, Proponer, Implementar Mejoras

---

## 📋 CONTEXTO DEL PROYECTO

**Qué es ToxinFree:**
- Plataforma global de alerta ciudadana sobre sustancias tóxicas (asbestos, PFAS, plomo, microplásticos)
- Objetivo: Habilitar personas en 200+ países para conocer su riesgo de exposición
- Stack: Next.js 14, TypeScript, Tailwind, Leaflet (mapa), next-intl (EN/ES)
- Tono: Urgente pero accesible, data-forward, comando center visual
- Inspiración: Our World in Data meets Bloomberg Terminal

**Datos de contexto:**
- 195 países en `countries.json` (source: IBAS + EPA + WHO)
- Sustancias: Asbestos (v1.2.0), PFAS/Pb/Microplásticos (coming soon)
- Score de auditoría actual: 6.5/10 (Diseño 9/10, Datos 3/10)
- En producción desde hace 3 días con tráfico inicial en Google Search Console

---

## 🎯 ESTADO ACTUAL DEL HOME

**Estructura (revisar `/src/app/[locale]/page.tsx`):**
1. **HeroSection** — Mapa global interactivo + counters (países con/sin ban)
2. **"Understand the Risk" Bento Grid** — 4 cards educativas (2-1-2-1 layout)
3. **"Most Viewed Profiles"** — 8 países hardcodeados como botones

**Problemas UX Identificados:**

| Problema | Impacto | Severidad |
|----------|---------|-----------|
| **Sin barra de búsqueda de países** | Usuario con país pequeño debe hacer zoom x10 en mapa | 🔴 CRÍTICO |
| **200 países solo accesibles vía mapa** | Móvil: casi imposible acertar en un país pequeño | 🔴 CRÍTICO |
| **Búsqueda por "zoom → click" es ineficiente** | Carga cognitiva alta; usuarios abandonan | 🔴 CRÍTICO |
| **Países hardcodeados en "Top Profiles"** | No refleja real engagement; datos estáticos | 🟠 ALTO |
| **Sin contexto de "por qué confiar en ToxinFree"** | Usuario nuevo no entiende autoridad/rigor | 🟠 ALTO |
| **Footer desaparecido o vacío** | Falta links a documentación, legal, social | 🟠 ALTO |
| **Navbar genérico sin CTA clara** | No hay navegación ágil al Risk Checker | 🟠 ALTO |
| **Sin transiciones/animaciones en CTA** | Siente estático; no comunica urgencia | 🟡 MEDIO |
| **"Coming Soon" pills sin contexto** | ¿Cuándo llegan PFAS/Pb/etc? Confunde | 🟡 MEDIO |

---

## 🧠 CONTEXTO PREVIO — LEE ESTO PRIMERO

**Antes de empezar cualquier tarea:**

1. Lee `TOXINFREE-CONTEXTO.md` completamente
   - Entiende la MISIÓN: Empoderar ciudadanos con información verificada
   - Entiende la VISIÓN: Asbestos → PFAS/Pb/Microplásticos → Comunidades
   - Entiende el POSICIONAMIENTO: Bloomberg Terminal meets Our World in Data
   - Entiende el MODELO: Data-forward, editorial, urgente pero accesible

2. Lee todo lo en `CLAUDE.md` sobre reglas de desarrollo y stack

3. **MENTALIDAD CREATIVA:**
   - No es un nonprofit típico con colores pastel
   - No es un sitio médico asustadizo
   - SÍ es "command center" de datos, urgente, global, limpio
   - Tono: "Información crítica que necesitas saber"

---

## 💡 INNOVACIÓN LIBRE — DESPUÉS DE LA AUDITORÍA

**Esto es importante:** Una vez completes las TAREAS 1-8, **tómate libertad creativa**.

Después de auditar el home y ver el código, estructura y datos disponibles, **sugiere 3-5 ideas NUEVAS** que Koku no mencionó:

**Ejemplos de lo que podría sugerir (no limites a esto):**

- 🎯 **Sección "Impact Dashboard"** — Mostrando en tiempo real: "2.3M personas leyeron esto hoy", "57 países fueron visitados en las últimas 24h", "1,000 risk checks ejecutados" (datos ficticios pero impactantes)

- 🔬 **"Substance Timeline"** — Interactive timeline mostrando cuándo se baneó el asbesto en cada país (1920s-2020s) con animaciones que comunican progreso

- 🌡️ **"Risk Temperature"** — En lugar de colores discretos (ban/no-ban), mostrar un gradiente de 0-100 para cada país, más nuances

- 🤝 **"Join Our Mission" CTA section** — Invitando a investigadores, médicos, ciudadanos a contribuir datos

- 📱 **"Quick Stats Card"** — Mostrar estadísticas sorprendentes: "73% de países aún permiten X", "Espera de diagnóstico: 5-10 años en Latinoamérica"

- 🎨 **Micro-interactions** — Hover effects en tarjetas que revelen más contexto, badges animados, contadores que incrementan on-scroll

- 🔔 **"Alert Banner"** — Notificaciones de país: "Alerta: Nueva regulación en México" o "Tu país acaba de banear el X"

- 📊 **Comparación rápida** — Tipo toggle: "Compara dos países" (India vs. Brasil) mostrando lado a lado riesgo/regulación/contexto

- 🎓 **"Expert Quotes"** — Sección con testimonios de médicos, epidemiólogos, activistas explicando por qué ToxinFree importa

- ✨ **"Loading State Creativo"** — En lugar de skeleton screens, mostrar "Did you know?" facts sobre asbestos mientras carga

**Criterios para sugerencias:**
- ✅ Debe ser implementable con el stack actual (Next.js, Tailwind, React)
- ✅ Debe reforzar la MISIÓN y VISIÓN de ToxinFree
- ✅ Debe mejorar UX/engagement, no solo parecer bonito
- ✅ Debe respetarse el tono data-forward, no alarmista
- ✅ Debe ser mobile-first y accesible
- ✅ Debe considerarse el contexto global (multilingüe, múltiples contextos culturales)

**Formato de entrega:**
Cuando presentes ideas nuevas, hazlo así:
```
## 💡 IDEAS INNOVACIÓN

### Idea 1: [Nombre]
- **Descripción:** [Qué es, por qué importa]
- **Beneficio UX:** [Cómo mejora la experiencia]
- **Implementación:** [Componentes, librerías, esfuerzo estimado]
- **Precedentes:** [Ejemplos similares en web (si aplica)]

### Idea 2: [Nombre]
...
```

---

## ✅ TAREAS DE AUDITORÍA + IMPLEMENTACIÓN

### TAREA 1: AUDITAR (Sin código aún)
Lee y reporta en comentarios (sin modificar archivos):
- Estado actual del HeroSection: ¿qué mapas/datos muestra? ¿hay mapa 3D (globe.gl) o Leaflet?
- Accesibilidad del navbar/footer: ¿existen? ¿qué contienen?
- Performance del home: ¿SSG completo? ¿JS side effects en hero?
- Responsive: ¿funciona bien en móvil <375px? ¿mapa es clicleable?

**Entrega:** Reporte escrito en `AUDIT-HOME-VERDICT.md` con screenshot mental de la estructura.

---

### TAREA 2: DISEÑAR `<CountrySearch />` COMPONENT
**Requisitos:**

```typescript
// src/components/search/CountrySearch.tsx
interface CountrySearchProps {
  locale: string; // "en" | "es"
  onSelect?: (country: Country) => void; // Navigate to /[locale]/country/[slug]
}

export default function CountrySearch({ locale, onSelect }: CountrySearchProps) {
  // TODO: Implement
}
```

**Funcionalidad requerida:**

1. **Input + Autocomplete Dropdown**
   - Placeholder: `t("search_country_placeholder")` (multilingüe)
   - Input debería estar accesible via Tab, con aria-labels
   - Al escribir: filtrar países por nombre (EN o ES, según idioma)

2. **Datos desde `countries.json`**
   - NO duplicar países en otro archivo
   - Estructura: `{ name_en, name_es, slug, ban_status, ...}`
   - Mostrar flag emoji + nombre país en dropdown

3. **Dropdown inteligente**
   - Máx 8 resultados visibles
   - Keyboard nav: ↑↓ para navegar, Enter para seleccionar
   - Escape cierra dropdown
   - Click en resultado → navegar a `/[locale]/country/[slug]`

4. **Bilingüe**
   - Si usuario en `/es/` y busca "Alemania" → redirect `/es/country/germany`
   - Si busca "Germany" → también funciona
   - Busca en AMBOS campos (name_en + name_es)

5. **Animaciones**
   - Dropdown fade-in rápido (100ms)
   - Items slide-down suavemente
   - Hover en item: bg-slate-700 + scale(1.02) subtle

6. **Accesibilidad**
   - ARIA roles: `role="combobox"`, `aria-expanded`, `aria-controls`
   - Anunciar cantidad de resultados al screen reader
   - Keyboard-navigable completo

**Stack:** React hooks (useState, useCallback), Tailwind, sin dependencias externas (si es posible; `cmdk` optional si lo requiere)

---

### TAREA 3: INTEGRAR `<CountrySearch />` en HOME
**Ubicación:** Justo DESPUÉS del HeroSection, antes de "Understand the Risk" bento grid
**Contexto:**
- Envolver en una sección limpia con padding 12-16rem vertical
- Título: `t("search_hero_title")` — ej. "Find your country's asbestos risk"
- Subtítulo: `t("search_hero_desc")` — ej. "Search among 195 countries"

**Componente layout:**
```jsx
<section className="bg-gradient-to-b from-[#0a0f1a] to-[#060b14] px-4 py-24 border-b border-slate-800/30">
  <div className="mx-auto max-w-2xl">
    <h2 className="text-center text-3xl font-bold text-white mb-3">{title}</h2>
    <p className="text-center text-slate-400 mb-8">{subtitle}</p>
    <CountrySearch locale={locale} />
    {/* Mostrar hint: "Popular searches" con chips de banderas + nombres */}
  </div>
</section>
```

---

### TAREA 4: MEJORAR SECCIÓN "MOST VIEWED PROFILES"
**Cambios:**

1. **Dinamizar países**
   - Sacar de hardcodeado → mostrar TOP 8 por lógica TBD:
     - Opción A: Países con más población + asbestos risk
     - Opción B: Países más visitados (si hay telemetría)
     - Opción C: Mix de high-risk + high-population
   - Mantener UI igual; solo cambiar `const countries` por función

2. **Agregar "View All Countries" link**
   - Link al final: `/[locale]/countries` (nueva página opcional)
   - Muestra tabla/grid de 195 países, filtrable

---

### TAREA 5: AGREGAR SECCIÓN "WHY TOXINFREE" (Trust Signals)
**Ubicación:** Antes de "Most Viewed Profiles", después de Bento Grid
**Contenido (3 columnas):**

```
📊 Rigorous Data
"Sourced from IBAS, EPA, WHO. Updated quarterly."

🌍 195 Countries
"Real-time risk profiles for every nation on Earth."

🔓 Free & Open
"No ads, no paywall. Built for citizen empowerment."
```

**Animación:** Cada card aparecer on-scroll con stagger (100ms entre cada una)

---

### TAREA 6: MEJORAR NAVBAR
**Cambios:**

1. **Logo + Branding** (si no existe)
   - Small logo left
   - "ToxinFree" text or icon

2. **Navigation Links**
   - Home (logo click)
   - Learn / Resources (dropdown con: What is Asbestos, Where It Hides, What To Do, History, etc.)
   - Check Risk (prominent button, style = red/warning)
   - Language toggle: EN/ES

3. **Mobile**
   - Hamburger menu
   - Smooth slide-in navigation

4. **Sticky behavior**
   - Navbar sticky-top en scroll
   - Subtle bg blur + border-bottom cuando scroll > 50px

---

### TAREA 7: MEJORAR FOOTER
**Estructura:**

```
[Logo] ToxinFree

Learn More (3 col)
├─ What Is Asbestos
├─ Where It Hides
├─ What To Do

Resources (3 col)
├─ Methodology
├─ Data Sources
├─ FAQ

Legal (3 col)
├─ Privacy Policy
├─ Terms of Use
├─ Disclaimer

Social & Contact (2 col)
├─ GitHub (repo link)
├─ Email: [contact email]
├─ Twitter/LinkedIn
└─ "Subscribe to updates" input

Copyright & Attribution
"Data sources: IBAS, EPA, WHO. Last updated: [date]"
```

**Animaciones:**
- Hover en links: underline fade-in + color change
- Social icons: subtle scale on hover

**SEO/Accessibility:**
- Footer links should be semantic `<a>` tags
- Good for internal linking (country pages, learn pages)

---

### TAREA 8: AGREGAR ANIMACIONES (Subtil, No Distractoras)
**Global:**
- Fade-in on page load (hero content)
- Stagger effect en bento grid cards (50ms delay)
- Parallax subtle en mapa hero (if JS feasible)

**CountrySearch:**
- Dropdown fade-in + slide-down
- Item hover: micro-scale + highlight

**Footer:**
- Fade-in en scroll into view
- Link hover: underline animation (clip-path if smooth)

**CTA Buttons:**
- All buttons: hover state with slight lift + shadow
- "Check Risk" button: pulse or glow on first load (once per session?)

---

## 📝 DELIVERABLES ESPERADOS

1. **`AUDIT-HOME-VERDICT.md`** — Reporte escrito de estado actual + recomendaciones
2. **`src/components/search/CountrySearch.tsx`** — Component nuevo con todos los features
3. **Updated `/src/app/[locale]/page.tsx`** — Integración de CountrySearch + nuevas secciones
4. **`src/components/layout/Navbar.tsx`** (si no existe) — Mejorado con sticky + mobile
5. **`src/components/layout/Footer.tsx`** (si existe) — Completo con links + social
6. **Updated i18n** — Nuevos keys en `messages/en.json` y `messages/es.json`
7. **Screenshot/demo** — Visual de cómo se ve el nuevo home
8. **`INNOVACION-SUGERENCIAS.md`** — 3-5 ideas NUEVAS que no fueron mencionadas, con impacto UX + implementación (ver sección "INNOVACIÓN LIBRE" arriba)

---

## 🎨 DESIGN NOTES

- **Color Palette:** Keep existing (navy/amber/emerald/red accents)
- **Typography:** Keep existing (sans serif body, display for headings)
- **Spacing:** Consistent 4px grid (Tailwind default)
- **Animations:** < 300ms, easing: ease-out or cubic-bezier(0.4, 0, 0.2, 1)
- **Mobile First:** All designs assume 375px min, then scale up

---

## 🚀 APPROACH

**Step 1:** Audit (read, no code)
**Step 2:** Design CountrySearch in isolation
**Step 3:** Integrate into home + add sections
**Step 4:** Style + animate
**Step 5:** Test accessibility + i18n
**Step 6:** Verify production build works (next build)
**Step 7:** 💡 **INNOVACIÓN LIBRE** — Sugiere 3-5 ideas NUEVAS que mejoren el home más allá de las tareas listadas (ve ejemplos arriba en sección "INNOVACIÓN LIBRE")

---

## ⚠️ CONSTRAINTS

- **No breaking changes** to existing pages (country/:slug, /check, /learn/*)
- **Keep SSG fully static** (no new API routes unless critical)
- **Maintain i18n** (EN/ES in all text)
- **No external analytics** (unless already in place)
- **Responsive must work** — test at 375px, 768px, 1024px+

---

## 📞 QUESTIONS FOR CLAUDE CODE

1. ¿El HeroSection incluye globe.gl (3D) o es solo Leaflet?
2. ¿Existe Navbar/Footer ya o están vacíos?
3. ¿Qué telemetría/analytics hay? (para "Most Viewed")
4. ¿SSG incluye 195 country pages generadas statically? ¿timing?
5. ¿Hay test suite? ¿Debo agregar tests para CountrySearch?
6. **INNOVACIÓN:** Después de auditar el home y entender el stack/datos, ¿qué 3-5 IDEAS NUEVAS sugerirías que mejoren el impacto visual/UX pero que no sean las 8 tareas listadas? (Sé creativo, piensa en datos, animaciones, secciones nuevas, micro-interactions)

---

**OBJETIVO FINAL:** Un home que sea tanto **visualmente impactante** como **funcionalmente accesible** — donde cualquier persona de cualquier país en 5 segundos pueda encontrar su información de riesgo sin frustración.

Gracias, y ¡adelante con el código! 🚀

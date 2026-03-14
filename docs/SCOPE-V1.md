# SCOPE V1 — Minimum Viable Impact
## Lo que se lanza. Lo que no. Y por qué.

---

## PRINCIPIO RECTOR DE LA V1

> "La v1 no es un demo. Es un producto incompleto que ya es útil."

El objetivo no es impresionar técnicamente. Es que alguien en India, México o 
Estados Unidos llegue por Google, use el risk checker, aprenda algo que no sabía, 
y comparta el link. Si eso pasa una vez, el producto funciona. Lo demás es escala.

---

## LO QUE INCLUYE LA V1

### 1. Landing Page con Mapa Global Interactivo
**La primera impresión. El "holy shit" moment.**

- Mapa mundial con los 195 países coloreados por estatus regulatorio
- 4 colores: Banned (verde) | Partial (amarillo) | No ban (rojo) | No data (gris)
- Hover sobre cualquier país → tooltip con: nombre, año de prohibición (si existe), 
  y estatus actual en una línea
- Click → va a la página del país
- Contador animado arriba: "X countries still have NO ban on asbestos"
- Debajo del mapa: una sola línea demoledora con el dato de muertes anuales

**Datos necesarios (ya verificados que existen):**
- Lista de 72 países con ban: IBAS alpha_ban_list (scrapeado, verificado)
- Cronología de cada ban: IBAS chron_ban_list (scrapeado, verificado)
- Países sin ban pero con uso activo: USGS + UN Comtrade data
- Clasificación manual de ~30 países clave, el resto inicia en "no data"

**Tiempo estimado con Claude Code: 2-3 días**

---

### 2. Risk Checker (La Herramienta Viral)
**El producto core. Lo que la gente usa y comparte.**

**Formulario (3 pasos simples):**

```
Step 1: ¿Dónde?
→ Selector de país (dropdown con bandera)

Step 2: ¿Cuándo se construyó?
→ Slider o selector por década: Pre-1940 | 1940-1960 | 1960-1980 | 1980-2000 | 2000+

Step 3: ¿Qué tipo de propiedad?
→ Casa | Departamento | Escuela | Oficina | Fábrica
```

**Output (pantalla de resultados):**

```
╔══════════════════════════════════════╗
║  RISK LEVEL: HIGH                    ║
║  ████████████░░░ 78%                 ║
╚══════════════════════════════════════╝

Your property was built in [decade] in [country].
At that time, [country] had [no restrictions / partial restrictions / 
no ban yet] on asbestos.

MATERIALS LIKELY PRESENT:
• Roof tiles (asbestos-cement)          → HIGH risk if damaged
• Floor tiles (vinyl-asbestos 9x9")     → LOW risk if intact
• Pipe insulation                       → HIGH risk if deteriorating
• Ceiling texture (popcorn ceiling)     → MODERATE risk

WHAT TO DO:
1. Do NOT disturb suspected materials
2. Get a professional inspection (find labs near you → link)
3. If planning renovation, STOP and read this first → link

[SHARE YOUR RESULT] [CHECK ANOTHER PROPERTY]
```

**Datos necesarios:**
- Tabla de materiales por década (15-20 entradas, ya documentadas públicamente)
- Regulación por país por década (derivado de IBAS chronology)
- Recomendaciones por nivel de riesgo (3-4 templates)
- Todo cabe en un JSON estático de ~50KB

**Lo que hace compartible:**
- Resultado visual con color (rojo/amarillo/verde) diseñado para screenshot
- Botón de share que genera: "My house built in 1965 in Mexico has a HIGH 
  asbestos risk. Check yours → [link]"
- Open Graph meta tags para preview bonito en redes sociales

**Tiempo estimado con Claude Code: 2-3 días**

---

### 3. Páginas de País (Top 15)
**No las 195. Solo las que importan para SEO y tráfico inicial.**

**Países v1 (seleccionados por: población en riesgo + volumen de búsqueda):**

| País | Por qué es prioritario |
|------|----------------------|
| United States | Mayor volumen de búsqueda en inglés, ban reciente (2024) |
| India | Mayor importador mundial, sin ban, 1.4B personas |
| China | Mayor exportador, uso masivo, datos limitados |
| Russia | Mayor productor, sin ban |
| Brazil | Ban reciente (2017-2023), historia compleja |
| Mexico | Sin ban federal, construcción con asbesto-cemento masiva |
| Indonesia | Consumidor activo, sin ban |
| United Kingdom | Banned pero legacy buildings masivos |
| Australia | Líder en programas de remoción, modelo a seguir |
| Japan | Banned 2012, pero crisis de edificios legacy |
| South Korea | Programa de remoción más agresivo del mundo |
| Germany | Early ban, modelo europeo |
| South Africa | Ex-productor, ban 2008, crisis sanitaria |
| Canada | Ban 2018 después de décadas de exportar |
| Nigeria | Sin ban, crecimiento de construcción rápido |

**Cada página incluye:**
- Estatus regulatorio (banned / not banned / partial)
- Timeline visual de regulaciones
- Materiales comunes en construcciones de ese país
- Qué hacer si vives ahí
- Stats: mesothelioma mortality si el dato existe (WHO Mortality Database)

**SEO play**: Cada página targeta "[country] asbestos ban", "is asbestos banned 
in [country]", "asbestos in homes [country]". Estas búsquedas tienen competencia 
baja y resultados actuales de mala calidad.

**Tiempo estimado con Claude Code: 3-4 días** (template + datos)

---

### 4. Contenido Educativo Core (5 Páginas)
**El contenido que le da autoridad al sitio.**

1. **"What is Asbestos?"** — Explicación visual, no Wikipedia
2. **"Where Does Asbestos Hide in Your Home?"** — Diagrama interactivo de casa
3. **"The History: How Industry Hid the Truth"** — Timeline visual
4. **"What To Do If You Find Asbestos"** — Guía práctica paso a paso
5. **"Asbestos by the Numbers"** — Data visualization page (muertes, países, toneladas)

**Tiempo estimado con Claude Code: 2-3 días**

---

### 5. Infraestructura Base para i18n
**No traducir todo en v1. Solo preparar la arquitectura.**

- Todo el contenido en archivos JSON separados por idioma
- UI labels en inglés + español (tu idioma nativo, puedes verificar calidad)
- Selector de idioma visible pero con "More languages coming soon"
- Arquitectura lista para que agregar un idioma sea: 
  traducir JSONs → deploy

**Tiempo estimado con Claude Code: 1 día** (es arquitectura, no contenido)

---

### 6. SEO Foundation
**Lo que hace que la gente encuentre el sitio.**

- Static site generation (Next.js SSG o Astro)
- Meta tags optimizados por página
- Sitemap.xml automático
- Structured data: FAQ schema en páginas educativas, HowTo en guías
- Open Graph tags para social sharing
- robots.txt configurado
- Google Search Console setup
- Core Web Vitals optimizados (el sitio TIENE que ser rápido)

**Tiempo estimado con Claude Code: 1 día** (integrado en el build)

---

## LO QUE NO INCLUYE LA V1

| Feature | Por qué se difiere |
|---------|-------------------|
| Monitoring Engine (IA automatizada) | Requiere Claude API costs + infraestructura. v2. |
| Todas las 195 country pages | Las 15 iniciales validan el formato. Expandir en v1.5. |
| 10+ idiomas | Inglés + Español validan i18n. Agregar con tracción. |
| Community contributions | Necesita moderación. v2. |
| PFAS/Lead expansion | Asbestos primero. Expande cuando haya tracción. |
| Email alerts/notifications | Necesita base de usuarios primero. v2. |
| Backend/API propia | v1 funciona con datos estáticos. Backend cuando haya datos dinámicos. |
| Directorio de labs/empresas | Requiere curaduría por país. v1.5 para los 15 países. |
| Mobile app | El sitio web es responsive. App nativa es innecesaria en v1. |
| User accounts | No hay razón para login en v1. |

---

## STACK V1 (SIMPLIFICADO)

```
Frontend:    Next.js 14+ (App Router, SSG)
Styling:     Tailwind CSS
Maps:        Leaflet + react-leaflet (100% gratis, sin API key)
             GeoJSON para datos de países (archivo público disponible)
Charts:      Recharts (ya disponible en artifacts)
i18n:        next-intl
Data:        JSON estáticos (countries.json, materials.json, content/*.json)
Hosting:     Vercel (free tier: perfecto para SSG)
Domain:      ~$12/año
Analytics:   Plausible (privacy-friendly) o Google Analytics
Total cost:  $12/año (solo el dominio)
```

**Por qué no hay backend en v1:**
- Los datos cambian lentamente (bans happen ~2-3 times per year)
- Un JSON estático sirve igual y es infinitamente más rápido
- Puedes actualizar datos con un commit + deploy (< 5 minutos)
- Agregar backend en v2 cuando los datos sean dinámicos

---

## TIMELINE DE BUILD

```
Semana 1: Foundation
├── Día 1-2: Setup Next.js + Tailwind + estructura de proyecto
│            Crear JSON de datos: countries, materials, risk-matrix
│            Curar datos de IBAS para los 72 países con ban
├── Día 3-4: Landing page + Mapa global interactivo
│            Risk Checker (formulario + lógica + resultados)
├── Día 5:   i18n setup + traducción ES
│            SEO foundation (meta tags, sitemap, structured data)

Semana 2: Content + Country Pages
├── Día 6-7: Template de country page + generar 15 páginas
├── Día 8-9: 5 páginas educativas (contenido + diseño)
├── Día 10:  Testing, responsive, performance
│            Open Graph images para sharing
│            Deploy a Vercel

Semana 3: Polish + Launch
├── Día 11:  QA final, cross-browser testing
├── Día 12:  Soft launch — compartir en Reddit (r/asbestos, r/homeimprovement)
│            Submit a Google Search Console
├── Día 13+: Iterar basado en feedback
```

---

## MÉTRICAS DE ÉXITO V1

**Mes 1 post-launch:**
- [ ] Sitio indexado en Google para al menos 20 keywords
- [ ] 500+ visitantes orgánicos
- [ ] 50+ risk checks completados
- [ ] Al menos 1 share orgánico en redes sociales

**Mes 3 post-launch:**
- [ ] 5,000+ visitantes mensuales
- [ ] Top 10 Google para "is asbestos banned in [5+ countries]"
- [ ] Feedback de al menos 1 profesional del campo (médico, investigador, ONG)

**Mes 6 post-launch:**
- [ ] 20,000+ visitantes mensuales
- [ ] Contacto con IBAS o ADAO establecido
- [ ] v1.5 lanzada con 50+ country pages
- [ ] Al menos 3 idiomas funcionando

Si los números del mes 1 se cumplen, el proyecto tiene tracción real y vale la 
pena invertir en v2 (monitoring engine, más idiomas, PFAS expansion).

Si no se cumplen, pivotas el approach de distribución antes de construir más features.

---

## PRIMER PASO CONCRETO

No es abrir VS Code. No es configurar Next.js.

Es crear el archivo `countries.json` con los datos curados de los 72 países 
que ya verificamos que existen en IBAS. Esa es tu materia prima. Sin datos 
curados, todo lo demás es un cascarón bonito.

Puedes hacer esto con Claude: pasarle la cronología de IBAS y pedirle que 
estructure el JSON. Luego verificas manualmente los 15 países prioritarios.

Después de eso, Claude Code construye el sitio entero.

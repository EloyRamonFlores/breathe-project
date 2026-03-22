# INNOVACION-SUGERENCIAS.md — Ideas Creativas para ToxinFree Home

**Fecha:** 2026-03-22
**Auditor:** Claude Code (Opus 4.6)

---

## Idea 1: "Your Country in 5 Seconds" — Instant Risk Card

- **Descripcion:** Al seleccionar un pais en el CountrySearch, en vez de navegar inmediatamente a la pagina de pais, mostrar un **preview card inline** debajo del buscador con: bandera, estado de ban, ano del ban, tasa de mesotelioma, y un boton "Ver perfil completo". Esto da respuesta inmediata sin cambio de pagina.
- **Beneficio UX:** Reduce la friccion critica: el usuario obtiene la respuesta a "esta baneado en mi pais?" en 5 segundos sin salir del home. Esto es el core de la mision de ToxinFree.
- **Implementacion:** Nuevo componente `<CountryPreviewCard>` que consume `countries.json`. Se renderiza condicionalmente debajo del `<CountrySearch>` al seleccionar un pais. Datos ya existen en el JSON. ~2h de trabajo.
- **Precedentes:** Google Knowledge Panels (previsualizacion sin click). Notion page previews on hover.

---

## Idea 2: "Ban Timeline Ticker" — Scrolling Horizontal Timeline

- **Descripcion:** Una franja horizontal animada entre el hero y la busqueda, mostrando un timeline de bans: "1989 Iceland | 1999 UK | 2005 Japan | 2024 USA | ??? Your country?". Auto-scroll lento de izquierda a derecha como un ticker de noticias. Click en cualquier pais navega a su perfil.
- **Beneficio UX:** Comunica progreso global de forma visual y urgente. El "??? Your country?" al final crea urgencia y personaliza. Funciona como un "news ticker" estilo Bloomberg terminal, alineado con la identidad visual.
- **Implementacion:** Componente `<BanTicker>` con CSS `@keyframes scroll`. Datos de `countries.json` filtrados por `ban_year !== null`, ordenados cronologicamente. Usa `overflow: hidden` + `animation: scroll Xs linear infinite`. Sin librerias externas. ~3h.
- **Precedentes:** Bloomberg Terminal ticker. CNN breaking news scroller. GitHub contribution timeline.

---

## Idea 3: "Compare Two Countries" — Side-by-Side Quick Compare

- **Descripcion:** Seccion en el home con dos selectores de pais lado a lado: "Country A vs Country B". Al seleccionar ambos, se muestra una comparacion visual: ban status, ban year, mesothelioma rate, peak usage era, y un veredicto de "cual es mas seguro". Shareable como imagen.
- **Beneficio UX:** Engagement altisimo. Los usuarios comparten comparaciones ("Mexico vs USA") en redes sociales. Genera trafico organico y viralidad. Util para periodistas y activistas que necesitan datos comparativos rapidos.
- **Implementacion:** Componente `<CountryCompare>` con dos instancias de `<CountrySearch>`. Grid de comparacion con datos de `countries.json`. Share button genera URL con query params `?a=mexico&b=united-states`. ~4h.
- **Precedentes:** Google Flights side-by-side. Numbeo cost of living compare. Versus.com product comparisons.

---

## Idea 4: "Shocking Stat Rotator" — Datos Impactantes con Countdown

- **Descripcion:** Un componente que rota estadisticas impactantes cada 5 segundos con una animacion de fade suave: "Every 2 minutes, someone dies from asbestos exposure" → "73% of countries still allow asbestos imports" → "The average latency from exposure to diagnosis: 20-50 years". Cada stat tiene un icono animado y una fuente citada.
- **Beneficio UX:** Crea urgencia data-driven sin ser alarmista. Comunica la escala del problema de forma memorable. Los numeros impactantes son shareables y citables para prensa/activistas.
- **Implementacion:** Componente `<StatRotator>` con `setInterval` + CSS transitions. Array de stats con texto i18n, fuente, e icono. Respeta `prefers-reduced-motion` (sin auto-rotacion, botones manual). ~2h.
- **Precedentes:** UN climate change stats on homepage. WHO health fact rotators. Charity:Water impact counters.

---

## Idea 5: "Region Heatmap Summary" — Resumen Visual por Region

- **Descripcion:** Seccion antes del footer con 6 cards (una por region: Europe, Asia, Africa, Americas, Oceania, Middle East) mostrando un mini-resumen: "Europe: 38/44 banned", "Asia: 5/48 banned" con una barra de progreso visual (verde = % baneados, rojo = % sin ban). Click lleva a una lista filtrada de paises de esa region.
- **Beneficio UX:** Da contexto regional inmediato. Un usuario de Asia ve que solo 5/48 paises han baneado → genera urgencia localizada. Periodistas pueden citar "solo el 10% de Asia ha baneado el asbesto" directamente del sitio.
- **Implementacion:** Componente `<RegionSummary>` que agrupa `countries.json` por `region` y calcula porcentajes. Progress bars con Tailwind (`bg-gradient`). Datos ya existen, solo hay que agregarlos. ~3h.
- **Precedentes:** Our World in Data region summaries. UNICEF regional dashboards. Freedom House global freedom scores by region.

---

## Criterios Cumplidos

| Criterio | Idea 1 | Idea 2 | Idea 3 | Idea 4 | Idea 5 |
|----------|--------|--------|--------|--------|--------|
| Stack actual (Next.js, Tailwind) | Y | Y | Y | Y | Y |
| Refuerza mision/vision | Y | Y | Y | Y | Y |
| Mejora UX/engagement | Y | Y | Y | Y | Y |
| Data-forward, no alarmista | Y | Y | Y | Y | Y |
| Mobile-first y accesible | Y | Y | Y | Y | Y |
| Multilingue compatible | Y | Y | Y | Y | Y |

---

## Prioridad Recomendada

1. **Idea 1** (Instant Risk Card) — Mayor impacto con menor esfuerzo. Resuelve el core problem.
2. **Idea 5** (Region Heatmap) — Datos ya disponibles, alto valor editorial.
3. **Idea 4** (Stat Rotator) — Facil de implementar, alta viralidad.
4. **Idea 2** (Ban Timeline Ticker) — Refuerza identidad Bloomberg terminal.
5. **Idea 3** (Country Compare) — Mayor esfuerzo pero potencial viral enorme.

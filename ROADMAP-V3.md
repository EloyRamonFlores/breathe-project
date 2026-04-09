# ROADMAP V3 — SEO-Driven Growth + Content Completion

**Created**: 2026-04-05
**Baseline**: v2.9.0 (commit 62fc924)
**Data source**: Google Search Console — últimos 28 días (2026-04-05)
**Previous roadmap**: ROADMAP-V2.md (100% completado en v2.0.0)

---

## CONTEXTO: LO QUE DICEN LAS MÉTRICAS

### Hallazgos clave de Search Console

| Señal | Dato | Implicación |
|-------|------|-------------|
| **Mobile CTR** | 7.51% vs Desktop 1.10% | Mobile es el canal principal — el fix de preferencia 3D/2D es crítico |
| **China** | 92 impresiones, pos 10.65 | Investigación lista (v2.9.0) pero NO integrada al JSON — dinero sobre la mesa |
| **Kazakhstan** | 39 impresiones, 1 clic, pos 4 | Ya rankea alto — necesita research urgente para convertir |
| **South Africa** | 46 impresiones, pos 7.46 | Research existe — el CTR 0% sugiere que el snippet no engancha |
| **Russia (ES)** | 46 impresiones, pos 18.67 | Audiencia hispanohablante buscando en ruso/español — sin research |
| **Portugal** | 37 impresiones, pos 6.35 | Cerca de página 1 — sin research ni hero image |
| **UK (ES)** | 34 impresiones, pos 71.5 | Tiene el research más rico pero la versión ES está en página 7 |
| **USA** | 155 impresiones totales, 0.65% CTR | Mayor audiencia — investigadores y afectados angloparlantes |

### Prioridad de países por investigación (orden SEO)

| # | País | Impresiones | Posición | Tiene research | Tiene hero |
|---|------|-------------|----------|---------------|------------|
| 1 | China | 92 | 10.65 | ✅ (sin integrar) | ✅ |
| 2 | South Africa | 46 | 7.46 | ✅ | ✅ |
| 3 | Russia | 46 | 18.67 | ❌ | ✅ |
| 4 | Portugal | 37 | 6.35 | ❌ | ❌ |
| 5 | Kazakhstan | 39 | 3.45–4.18 | ❌ | ❌ |
| 6 | UAE | 19 | 7.37 | ❌ | ❌ |
| 7 | Turkey | 18 | 8.83 | ❌ | ✅ |
| 8 | Taiwan | 13 | 6.62 | ❌ | ❌ |
| 9 | Namibia | 11 | 7.36 | ❌ | ❌ |
| 10 | India | ~15 | ~9 | ❌ | ✅ |

---

## PHASE 1: Quick Wins (1h) ✅ COMPLETADO 2026-04-05
**Version**: v2.9.1 + v2.9.2
**Por qué primero**: Impacto inmediato en SEO y UX. China ya está investigado — solo falta integrar.

---

### PHASE 1A: Integrar China a countries.json (20 min) ✅ COMPLETADO 2026-04-05
**Version**: v2.9.1

#### Contexto
El perfil de China se investigó en v2.9.0 (`docs/research/china-research.md`) pero los campos del JSON quedaron como "draft ready for integration". Con 92 impresiones y posición 10.65, integrar los datos enriquecidos podría llevar China a página 1 rápidamente.

#### Claude Code Prompt
```
Model: sonnet | Thinking: low | Reason: Integración de datos ya investigados

Lee docs/research/china-research.md y encuentra la sección de "Data for countries.json integration" o el JSON template al final del documento.

Actualiza la entrada de China en src/data/countries.json:
1. Enriquecer el campo `timeline` con los eventos documentados (GB50574-2010, etc.)
2. Actualizar `ban_status` si el research lo confirma (de_facto_ban)
3. Agregar `resistance_stories` array (aunque sean vacíos si no hay activistas documentados con fuentes)
4. Agregar/actualizar `mesothelioma_rate`, `peak_usage_era`, `estimated_buildings_at_risk` si el research los documenta
5. Verificar coherencia interna: `ban_status` debe coincidir con `ban_details` y los eventos del `timeline`

Ejecutar: npm run type-check && npm test && npm run build
Actualizar CHANGELOG.md con entrada v2.9.1.
```

#### Verificación
- [ ] `ban_status` de China coherente con research (de_facto_ban)
- [ ] Timeline tiene al menos GB50574-2010
- [ ] Sin fabricación de datos — si algo no está en el research, no va
- [ ] 81 tests pasan
- [ ] Build genera 426+ páginas

---

### PHASE 1B: Fix Preferencia 3D/2D en Mobile (20 min) ✅ COMPLETADO 2026-04-05
**Version**: v2.9.2

#### Problema
MAntener predeterminado globo 3d por defecto.
Cuando el usuario alterna entre el globo 3D y el mapa 2D (Leaflet), al navegar a otra página o recargar, la selección se pierde y vuelve al estado por defecto. En mobile, donde el CTR es 7.51% (vs 1.10% desktop), esto interrumpe la experiencia del usuario más importante.


#### Comportamiento esperado
- Usuario activa globo 3D → se guarda preferencia
- Usuario cambia a mapa 2D → se guarda preferencia
- Al recargar o navegar de vuelta → se restaura la preferencia guardada
- Si no hay preferencia guardada → comportamiento actual (auto-detect por capacidades)

#### Claude Code Prompt
```
Model: sonnet | Thinking: low | Reason: Patrón estándar de localStorage

Lee src/components/map/Globe3DLoader.tsx (o donde esté el toggle 3D/2D).
Lee src/app/[locale]/page.tsx para ver cómo se inicializa el mapa.

Implementa persistencia de preferencia de mapa:

1. Cuando el usuario hace toggle entre 3D y 2D, guarda en localStorage:
   localStorage.setItem('toxinfree_map_preference', '3d' | '2d')

2. Al inicializar el componente, leer la preferencia guardada:
   - Si existe 'toxinfree_map_preference' en localStorage → usar esa preferencia
   - Si no existe → mantener la lógica actual de auto-detect (WebGL, memoria, conexión)

3. El localStorage solo afecta la PREFERENCIA EXPLÍCITA del usuario — si el usuario
   nunca tocó el toggle, el auto-detect sigue funcionando igual.

4. TypeScript: envolver el acceso a localStorage en try/catch (puede fallar en SSR):
   const saved = typeof window !== 'undefined' ? localStorage.getItem('toxinfree_map_preference') : null

Ejecutar: npm run type-check && npm test && npm run build
Actualizar CHANGELOG.md con entrada v2.9.2.
```

#### Verificación
- [ ] Toggle 3D→2D persiste al recargar
- [ ] Toggle 2D→3D persiste al recargar
- [ ] Sin preferencia guardada → comportamiento de auto-detect igual al actual
- [ ] No errores en SSR (acceso a localStorage envuelto correctamente)
- [ ] Build pasa

---

## PHASE 2: Bug Sprint — i18n Pendientes (1-2h) ✅ COMPLETADO 2026-04-05
**Version**: v2.10.0
**Por qué ahora**: 5 bugs de baja severidad identificados en FULL-AUDIT-V2 que afectan la mitad de la audiencia (ES).

### Claude Code Prompt
```
Model: sonnet | Thinking: medium | Reason: Múltiples archivos pero fixes bien definidos

Lee docs/FULL-AUDIT-V2.md, Sección 3 (Bugs) para el contexto completo.

Corrige estos 5 bugs en orden:

1. `formatNumber()` en src/lib/utils.ts:35
   - Agregar parámetro `locale?: string = 'en-US'`
   - Todos los callers que pasan locale deben pasarlo (buscar con grep)
   - Asegurar que en páginas con locale 'es', se use 'es-ES' como locale del formatter

2. Página 404 (`src/app/not-found.tsx`)
   - Next.js root not-found no tiene contexto de locale directamente
   - Solución: crear src/app/[locale]/not-found.tsx que SÍ tiene el locale del segmento
   - Mover el contenido de not-found.tsx a [locale]/not-found.tsx usando useTranslations
   - Agregar claves i18n: errors.not_found_title, errors.not_found_description, errors.not_found_back
   - EN: "Page Not Found", "This page doesn't exist.", "Go back home"
   - ES: "Página no encontrada", "Esta página no existe.", "Volver al inicio"

3. OG image raíz (`src/app/opengraph-image.tsx`)
   - "200 countries tracked" hardcodeado — hacer locale-aware
   - Recibe el locale del segmento dinámico; usar getTranslations para el texto del OG

4. Country OG image (`src/app/[locale]/country/[slug]/opengraph-image.tsx`)
   - Ban status labels ("Full Ban", "No Ban", etc.) hardcodeados en inglés
   - Usar getTranslations con el locale del segmento

5. `src/app/[locale]/learn/by-the-numbers/page.tsx:221`
   - Reemplazar "Loading charts..." hardcodeado con t("charts_loading")
   - Agregar clave en en.json: "charts_loading": "Loading charts..."
   - Agregar clave en es.json: "charts_loading": "Cargando gráficos..."

Ejecutar: npm run type-check && npm test && npm run build
Actualizar CHANGELOG.md con entrada v2.10.0.
```

### Verificación
- [ ] `formatNumber` muestra separadores correctos en ES (1.234 en vez de 1,234)
- [ ] `/es/` muestra 404 en español
- [ ] OG images en ES muestran texto en español
- [ ] "Cargando gráficos..." en by-the-numbers en ES
- [ ] 81 tests pasan, build OK

---

## PHASE 3: Investigación SEO-Prioritaria de Países (8-12h) ✅ COMPLETADO (3A-3F) 2026-04-09
**Version**: v2.11.0 → v2.17.0
**Orden basado en impresiones + posición + potencial de conversión.**

Usar el skill de country-research (`.skills/country-research/SKILL.md`) para cada uno.

---

### PHASE 3A: Kazakhstan (v2.11.0) ✅ COMPLETADO 2026-04-05
**Por qué primero**: 39 impresiones, 1 clic, posición 3.45–4.18 — ya está casi en el top 3. Con un perfil enriquecido puede atraer clics consistentes. Contexto único: Rusia necesita el asbesto de Kazakhstan, que es el mayor exportador mundial.

```
Model: opus | Thinking: high

Lee .skills/country-research/SKILL.md
Lee docs/research/united-kingdom-research.md como estándar de calidad.
Lee src/data/countries.json — entry de Kazakhstan.

Investiga Kazakhstan siguiendo las 7 secciones del skill:
- Énfasis especial en: Zhitikara/Kostanay mining, exportación a Rusia, movimiento "Chrysotile OK" (lobby pro-asbesto), casos de mesothelioma en mineros

Entregables:
1. docs/research/kazakhstan-research.md (30+ fuentes)
2. Actualizar countries.json: enriquecer timeline, resistance_stories, mesothelioma_rate
3. npm test

Actualizar CHANGELOG.md con v2.11.0.
```

---

### PHASE 3B: Russia (v2.12.0) ✅ COMPLETADO 2026-04-06
**Por qué**: 46 impresiones EN LA VERSIÓN ES — hay audiencia hispanohablante buscando info de Rusia en español. Además "is asbestos banned in russia" está en pos 10 con 7 impresiones. Rusia es el mayor productor mundial de asbesto con ~700,000 toneladas/año — historia poderosa.

```
Model: opus | Thinking: high

Lee .skills/country-research/SKILL.md
Lee src/data/countries.json — entry de Russia.

Investiga Rusia:
- Énfasis en: minas de Asbest (ciudad que lleva el nombre del mineral), Uralasbest company,
  lobbying internacional via Chrysotile Institute, mortalidad por mesothelioma, activistas locales

Entregables:
1. docs/research/russia-research.md (30+ fuentes)
2. Actualizar countries.json con timeline enriquecido y resistance_stories
3. Investigar por qué la versión ES rankea en pos 18.67 (puede ser falta de content en ES)
4. npm test

Actualizar CHANGELOG.md con v2.12.0.
```

---

### PHASE 3C: Portugal (v2.13.0) ✅ COMPLETADO 2026-04-07
**Por qué**: 37 impresiones, pos 6.35 — a pasos de página 1. Portugal fue centro de producción industrial importante (Eternit Portugal) y tiene lazos con Brasil por el idioma.

```
Model: opus | Thinking: high

Investiga Portugal:
- Énfasis en: Eternit Portugal (Amiantos SA), larga historia industrial en Setúbal/Seixal,
  Decreto-Lei 101/2005 (ban completo), mesothelioma en trabajadores portuarios y navales,
  conexión con Brasil por idioma compartido (ambos usaron asbesto masivamente)

Entregables:
1. docs/research/portugal-research.md (30+ fuentes)
2. countries.json: enriquecer timeline, resistance_stories si existen
3. npm test

Actualizar CHANGELOG.md con v2.13.0.
```

---

### PHASE 3D: Turkey (v2.14.0) ✅ COMPLETADO 2026-04-09
**Por qué**: 18 impresiones, pos 8.83. Ya tiene hero image. Turquía tiene el 4to depósito más grande de asbesto del mundo (Eskişehir), fue productor hasta 2010, y su transición es un caso de estudio importante.

```
Model: opus | Thinking: high

Lee .skills/country-research/SKILL.md
Investiga Turquía:
- Énfasis en: minas de Eskişehir (crisotilo), producción industrial 1930–2010,
  Regulation 2010 (ban) bajo presión de la UE para acceso, mortalidad ocupacional,
  comunidades afectadas en Anatolia

Entregables:.
1. docs/research/turkey-research.md (30+ fuentes)
2. countries.json: enriquecer timeline, datos de mortalidad, resistance_stories
3. npm test

Actualizar CHANGELOG.md con v2.14.0.
```

---

### PHASE 3E: UAE + India (v2.15.0) ✅ COMPLETADO 2026-04-07
**Por qué**: UAE tiene 19 impresiones, pos 7.37, y es el hub de búsqueda de toda la región MENA. India tiene una de las poblaciones más expuestas del mundo (~30,000 muertes/año estimadas) y está en posición ~9 con interés creciente.

Lee .skills/country-research/SKILL.md
```
Model: opus | Thinking: high

Investiga UAE e India en el mismo batch (contexto regional Asia/MENA):

UAE:
- Énfasis en: boom de construcción 1970–2000, trabajadores migrantes (India, Bangladesh, Pakistan)
  como principal población en riesgo, importaciones de asbesto, regulación inconsistente

India:
- Énfasis en: Rajasthan (mayor productor histórico), Hyderabad/Chennai como centros industriales,
  Eternit India (Visaka Industries), Collegium de Salud Ocupacional, Sethi caso judicial 2011,
  lobby pro-asbesto activo en New Delhi

Entregables:
1. docs/research/uae-research.md + docs/research/india-research.md
2. countries.json: enriquecer ambas entradas
3. npm test

Actualizar CHANGELOG.md con v2.15.0.
```

---

### PHASE 3F: Taiwan + Namibia (v2.16.0) ✅ COMPLETADO 2026-04-09
**Por qué**: Taiwan 13 impresiones pos 6.62 (cerca de página 1). Namibia 11 impresiones pos 7.36 — interesante porque fue parte del lobby pro-asbesto africano y tiene conexión con las minas de Sudáfrica.

Lee .skills/country-research/SKILL.md
```
Model: opus | Thinking: high

Investiga Taiwan y Namibia:

Taiwan:
- Énfasis en: uso masivo en construcción 1950–1990 (edificios de apartamentos 公寓),
  legislación 2001/2012, National Health Insurance data sobre enfermedades ocupacionales

Namibia:
- Énfasis en: conexión histórica con minas de Cape (sudafricanas),
  crocidolite azul en región Okiep/Northern Cape border, regulación post-independencia (1990)

Entregables:
1. docs/research/taiwan-research.md + docs/research/namibia-research.md
2. countries.json: enriquecer ambas entradas
3. npm test

Actualizar CHANGELOG.md con v2.16.0.
```

---

## PHASE 4: Hero Images — Países en Search Console sin Imagen (2-3h) [PENDIENTE]
**Version**: v2.17.0
**Por qué**: Estos países ya están siendo buscados pero sus páginas muestran el patrón CSS genérico en lugar de una landmark reconocible. Una hero image icónica mejora el tiempo en página y las compartidas.

### Países prioritarios (aparecen en Search Console, sin hero image confirmada)

**Tier 1 — Alto volumen de búsquedas:**
- Kazakhstan (39 impressiones) — Nur-Sultan/Astana, arquitectura futurista
- Portugal (37 impressiones) — Torre de Belém, Lisboa
- UAE (19 impressiones) — Burj Khalifa, Dubai skyline
- Taiwan (13 impressiones) — Taipei 101
- Namibia (11 impressiones) — Desierto Namib, Deadvlei

**Tier 2 — Tráfico activo (clics recibidos):**
- Guatemala (7 impressiones, 2 clics) — Tikal, Volcán de Agua
- Cyprus (7 impressiones, 1 clic) — Castillo de Kolossi, costa mediterránea
- Nicaragua (3 impressiones, 1 clic) — León Cathedral, Volcán Masaya

**Tier 3 — En Search Console:**
- North Korea, Georgia, North Macedonia, Cuba, Israel, Uruguay, Costa Rica, Jordan, Bahrain, Maldives, Trinidad and Tobago, Bosnia and Herzegovina, Botswana, Marshall Islands, Liberia

### Claude Code Prompt
```
Model: sonnet | Thinking: low | Reason: Mismo patrón que v2.2.0 — búsqueda de landmarks + update al JSON

Lee CHANGELOG.md entrada v2.2.0 para el patrón exacto que se usó.
Lee src/data/landmarks.json para ver el formato.
Lee src/data/countries.json para ver cómo está estructurado hero_image_url.

Agrega hero images para estos 20 países en orden de prioridad:

Tier 1 (Unsplash, landmark icónico):
- kazakhstan: Nur-Sultan / Baiterek Tower
- portugal: Torre de Belém, Lisboa
- united-arab-emirates: Burj Khalifa (imagen nocturna o al atardecer)
- taiwan: Taipei 101
- namibia: Deadvlei (árboles muertos en el desierto)

Tier 2:
- guatemala: Tikal pyramid (Templo I)
- cyprus: Aphrodite's Rock / Blue Lagoon
- nicaragua: León Cathedral (vista aérea)

Tier 3 (lo que encuentres con buenas imágenes disponibles):
- north-korea: Ryugyong Hotel o Juche Tower (usar con precaución, verificar licencia)
- georgia: Gergeti Trinity Church con el Monte Kazbek
- north-macedonia: Skopje Porta Macedonia
- cuba: Capitolio Nacional de La Habana
- israel: Cúpula de la Roca / Old City Jerusalem
- uruguay: Palacio Salvo, Montevideo
- costa-rica: Volcán Arenal
- jordan: Petra (Al-Khazneh)
- bahrain: Árbol de la Vida / World Trade Center
- maldives: Islas aéreas / bungalows
- trinidad-and-tobago: Scarborough / Pigeon Point
- bosnia-and-herzegovina: Puente Viejo de Mostar

Para cada país:
1. Encontrar URL de Unsplash con ?w=1280 (no requiere API key — usar CDN directo como en v2.2.0)
2. Agregar a landmarks.json
3. Agregar hero_image_url al entry de countries.json
4. Agregar hero_pattern apropiado (urban/coastal/mining/default)

Ejecutar: npm run type-check && npm test && npm run build
Actualizar CHANGELOG.md con v2.17.0.
```

### Verificación
- [ ] 20 países tienen hero_image_url en countries.json
- [ ] Las URLs de Unsplash son accesibles (no requieren auth)
- [ ] Actualizado landmarks.json con el mismo formato
- [ ] Pages countries build correctamente con las nuevas imágenes
- [ ] 81+ tests pasan

---

## PHASE 5: Hero Images — Países Restantes Completo (3-4h) [PENDIENTE]
**Version**: v2.18.0
**Por qué**: Completar la cobertura total del sitio. Con ~163 países aún sin hero image, esto es el trabajo de contenido más visible pendiente.

### Claude Code Prompt
```
Model: opus | Thinking: medium | Reason: Cobertura masiva, requiere creatividad para países pequeños

Lee CHANGELOG.md entrada v2.2.0 para el patrón.
Lee src/data/landmarks.json — ya tiene ~37 entradas, necesitas añadir ~163 más.
Lee src/data/countries.json — encuentra todos los países sin hero_image_url.

Agrega hero images para TODOS los países restantes sin imagen.
Distribuye por región:

**Europa pendiente** (~20 países):
Spain, Poland, Netherlands, Belgium, Sweden, Norway, Denmark, Finland, Switzerland, Austria, Greece,
Czech Republic, Hungary, Romania, Bulgaria, Croatia, Slovakia, Slovenia, Estonia, Latvia, Lithuania,
Luxembourg, Malta, Iceland, Andorra, Monaco, Liechtenstein, Moldova, Albania, Kosovo, Montenegro,
Serbia, Bosnia, North Macedonia (si no se hizo en Phase 4), Cyprus (si no se hizo), Belarus

**Asia pendiente** (~25 países):
Afghanistan, Azerbaijan, Bhutan, Brunei, Cambodia, East Timor, Georgia (si no), Iraq, Jordan (si no),
Kazakhstan (si no), Kyrgyzstan, Laos, Lebanon, Maldives (si no), Mongolia, Nepal (si no),
North Korea (si no), Oman, Palestine, Qatar, Saudi Arabia, Syria, Tajikistan,
Turkmenistan, Uzbekistan, Yemen

**África pendiente** (~45 países):
Angola, Benin, Botswana (si no), Burkina Faso, Burundi, Cameroon, Cape Verde, CAR, Chad, Comoros,
Congo, DR Congo, Djibouti, Equatorial Guinea, Eritrea, Eswatini, Ethiopia, Gabon, Gambia, Ghana,
Guinea, Guinea-Bissau, Ivory Coast, Lesotho, Liberia (si no), Libya, Madagascar, Malawi, Mali,
Mauritania, Mauritius, Mozambique, Namibia (si no), Niger, Rwanda, São Tomé, Senegal, Sierra Leone,
Somalia, South Sudan, Sudan, Tanzania, Togo, Tunisia, Uganda, Zambia, Zimbabwe

**América pendiente** (~20 países):
Antigua and Barbuda, Bahamas, Barbados, Belize, Bolivia, Costa Rica (si no), Cuba (si no),
Dominican Republic, Ecuador, El Salvador, Grenada, Guatemala (si no), Guyana, Haiti, Honduras,
Jamaica, Nicaragua (si no), Panama, Paraguay, Saint Kitts, Saint Lucia, Saint Vincent,
Suriname, Trinidad (si no), Uruguay (si no)

**Oceanía pendiente** (~10 países):
Fiji, Kiribati, Marshall Islands (si no), Micronesia, Nauru, New Zealand, Palau (si no),
Papua New Guinea, Samoa, Solomon Islands, Tonga, Tuvalu, Vanuatu

Instrucciones:
- Priorizar imágenes de Unsplash CDN sin auth
- Para países sin landmark icónico global, usar paisajes naturales, mercados, capital cities
- Nunca usar imágenes que requieran atribución directa o copyright
- hero_pattern: asignar el más apropiado ("coastal" para islas, "urban" para capitales grandes,
  "mining" para países con historial minero, "default" para el resto)

Ejecutar por batches de 30 países: npm run type-check && npm test && npm run build después de cada batch
Actualizar CHANGELOG.md con v2.18.0.
```

### Verificación
- [ ] Todos los ~200 países tienen hero_image_url
- [ ] landmarks.json completo con ~200 entradas
- [ ] Build genera 426+ páginas sin errores
- [ ] Spot-check: 10 países aleatorios — hero visible en su página de país

---

## PHASE 6: Fix UK Español — Posición 71.5 (1h) [PENDIENTE]
**Version**: v2.19.0
**Por qué**: El Reino Unido tiene el perfil de investigación más rico del sitio (44 fuentes, 4 activistas) pero la versión ES está en posición 71.5 — página 7. La versión EN no aparece en el top de queries. Esto sugiere un problema técnico o de contenido específico de la versión ES.

### Claude Code Prompt
```
Model: sonnet | Thinking: medium | Reason: Diagnóstico + fix de SEO técnico

Contexto: /es/country/united-kingdom tiene 34 impresiones pero posición 71.5 en Search Console.
La versión EN no aparece entre las queries top. El perfil tiene 4 historias de resistencia,
timeline rico, y mesothelioma data — pero algo está fallando en el ranking.

1. Lee src/app/[locale]/country/[slug]/page.tsx — revisar generateMetadata
2. Verifica que la meta description en ES tenga keywords relevantes:
   - "asbestos banned in UK", "UK asbestos ban 1999", "asbesto reino unido prohibición"
3. Verifica que el title tag en ES sea único y descriptivo
4. Verifica hreflang — que /en/country/united-kingdom apunta a /es/country/united-kingdom y viceversa
5. Revisa el Open Graph title y description del UK en ES
6. Si la meta description está genérica o falta texto en español en el hero o sections,
   añadir contenido específico que incluya las keywords naturalmente

Nota: La posición 71.5 en ES cuando pos EN debería ser ~20-30 sugiere que puede haber
contenido en español insuficiente en la página, o la meta description ES es demasiado genérica.

Ejecutar: npm run type-check && npm run build
Actualizar CHANGELOG.md con v2.19.0.
```

---

## PHASE 7: Re-Auditoría Completa — v3.0.0 (1-2h) [PENDIENTE]
**Version**: v3.0.0
**Por qué**: Baseline nuevo para el siguiente ciclo. Comparar contra FULL-AUDIT-V2.md (7.9/10).

### Claude Code Prompt
```
Model: opus | Thinking: high | Reason: Auditoría exhaustiva requiere lectura profunda

Lee MASTER-AUDIT-PROMPT.md y sigue su metodología exacta.
Audita el estado actual del proyecto.
Guarda resultados en docs/FULL-AUDIT-V3.md.
Compara scores contra docs/FULL-AUDIT-V2.md (7.9/10 baseline).

Énfasis especial en:
- Data Quality: ¿cuántos países tienen ahora research profundo? (era 37, objetivo >60)
- SEO: ¿mejoró el UK ES? ¿China pasó a página 1?
- Test Coverage: ¿los nuevos países tienen cobertura en data-integrity tests?
- Mobile UX: ¿funciona la persistencia de preferencia 3D/2D?
```

---

## EJECUCIÓN

| Fase | Versión | Tiempo est. | Dependencias | Prioridad | Estado |
|------|---------|-------------|--------------|-----------|--------|
| 1A. China JSON integration | v2.9.1 | 20 min | Ninguna | 🔴 Crítica | ✅ DONE 04-05 |
| 1B. Mobile 3D/2D persistence | v2.9.2 | 20 min | Ninguna | 🔴 Crítica | ✅ DONE 04-05 |
| 2. i18n Bug Sprint | v2.10.0 | 1-2h | Ninguna | 🟠 Alta | ✅ DONE 04-05 |
| 3A. Kazakhstan research | v2.11.0 | 2h | Ninguna | 🟠 Alta | ✅ DONE 04-05 |
| 3B. Russia research | v2.12.0 | 2h | Ninguna | 🟠 Alta | ✅ DONE 04-06 |
| 3C. Portugal research | v2.13.0 | 2h | Ninguna | 🟡 Media | ✅ DONE 04-07 |
| 3D. Turkey research | v2.14.0 | 2h | Ninguna | 🟡 Media | ✅ DONE 04-09 |
| 3E. UAE + India research | v2.15.0 | 3h | Ninguna | 🟡 Media | ✅ DONE 04-07 |
| 3F. Taiwan + Namibia research | v2.16.0 | 2h | Ninguna | 🟡 Media | ✅ DONE 04-09 |
| 4. Hero images (Search Console) | v2.17.0 | 2h | Ninguna | 🟡 Media | ⏳ PENDING |
| 5. Hero images (todos) | v2.18.0 | 3-4h | Phase 4 | 🟢 Normal | ⏳ PENDING |
| 6. UK ES fix | v2.19.0 | 1h | Ninguna | 🟡 Media | ⏳ PENDING |
| 7. Re-Auditoría | v3.0.0 | 1-2h | Todo lo anterior | 🟢 Normal | ⏳ PENDING |

**Total estimado**: ~22-26 horas de trabajo con Claude Code
**Target score**: 8.5–9.0/10 (desde 7.9 actual)

---

## MÉTRICAS DE ÉXITO

Al completar este roadmap, el proyecto debe tener:

| Métrica | Hoy (v2.9.0) | Actual (v2.16.0) | Target (v3.0.0) |
|---------|-------------|---|-----------------|
| Países con research profundo | 8 | 10 (KZ, RU, PT, TW, NA) | 16+ |
| Países con hero image | 37 | 37 | 200 |
| Score global auditoría | 7.9/10 | — | 8.5+/10 |
| Posición China | 10.65 | — | <7 |
| Posición UK ES | 71.5 | — | <20 |
| Preferencia 3D/2D persistida | ❌ | ✅ | ✅ |
| Bugs i18n pendientes | 5 | 0 | 0 |

---

*Creado 2026-04-05. Basado en Google Search Console (últimos 28 días) + estado del proyecto v2.9.0.*
*Supersede cualquier planificación ad-hoc post-v2.0.0.*

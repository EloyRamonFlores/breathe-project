# 🌍 ToxinFree — Contexto Estratégico

## ¿QUÉ ES TOXINFREE?

**ToxinFree es una plataforma global de alerta ciudadana sobre sustancias tóxicas.** No es un sitio médico, no es un foro, no es una tienda. Es un **comando center de datos** donde cualquier persona en el mundo puede entender su riesgo personal de exposición a asbestos, PFAS, plomo y microplásticos.

Versión actual: **v1.2.0** en producción (toxinfree.global)
Lenguaje: **EN + ES** (próximamente otros idiomas)
Usuarios objetivo: Ciudadanos conscientes de salud en países en vías de desarrollo + desarrollados

---

## 📊 EL PROBLEMA QUE RESOLVEMOS

**Cifras de impacto:**

- **72 países** han baneado el asbesto completamente
- **123 países AÚN permiten** la producción/importación de asbesto
- **~2 millones de muertes anuales** por asbestos, PFAS, plomo (OMS)
- **Billones** en costos sanitarios sin tratamiento

**Pero el problema real es:**
Ciudadanos en países sin ban no saben que sus casas, escuelas, oficinas **construidas antes de 2000** pueden contener asbesto. No hay información centralizada. No hay herramientas. No hay empoderamiento.

---

## 🎯 MISIÓN

**"Empoderar a ciudadanos en todo el mundo con información verificada y herramientas accionables para entender y mitigar su exposición a sustancias tóxicas."**

En otras palabras: Si vives en India, Indonesia, Rusia o México (donde NO hay ban), deberías poder escribir "¿Es seguro mi edificio de 1995?" en **5 segundos** y obtener una respuesta clara basada en datos.

---

## 🚀 VISIÓN A LARGO PLAZO (3-5 años)

### Fase 1: Asbestos (v1.0 ✅ | v1.2 en mejora)
- ✅ 195 países mapeados
- ✅ Risk Checker funcional (año + país → riesgo)
- ✅ 424 rutas estáticas pre-renderizadas
- ✅ Mapa interactivo 3D (globe.gl)
- 🔄 **Mejorando UX/accesibilidad (HOME AUDIT)**

### Fase 2: Expansión de Sustancias (v2.0 | Q2-Q3 2026)
- PFAS (per- and polyfluoroalkyl substances)
  - Problema: Contaminación de agua potable
  - Afecta: EE.UU., Europa, Canada
- Plomo (Lead)
  - Problema: Pintura vieja, tuberías
  - Afecta: Global, especialmente ciudades viejas
- Microplásticos
  - Problema: Aire, agua, alimentos
  - Afecta: Global urbano

### Fase 3: Comunidades + Datos Colaborativos (v3.0 | 2027+)
- Usuarios pueden reportar "encontré asbesto aquí" (con foto)
- Heat maps de denuncias ciudadanas
- Sistema de validación crowdsourced
- Integración con organismos de salud pública (OPS, OMS)

### Fase 4: Monetización Responsable (2027+)
- **Freemium model:**
  - Free: Risk Checker + educación
  - Pro: Reportes descargables, historial, alertas
- **B2B:** Gobiernos compran datos → planificación de salud pública
- **Grants:** Organismos de salud global financian expansión
- **Never:** Ads, venta de datos personales, content paywalls

---

## 💰 MODELO DE IMPACTO

**¿Por qué esto importa?**

1. **Salud Pública**
   - Información accesible → menos exposición involuntaria
   - Ciudadanos empoderados presionan gobiernos → cambio de policy

2. **Equidad Global**
   - En Occidente (EU, USA, Canada): ban implementado hace décadas
   - En Asia/Latinoamérica/Africa: información dispersa, caro acceder
   - ToxinFree cierra esa brecha

3. **Presión Política**
   - Cuando millones de ciudadanos ven "Mi país no ha baneado el asbesto", presionan legisladores
   - Vimos esto con GDPR (Europa), Climate Action (jóvenes), etc.
   - ToxinFree es el catalizador

4. **Monetización Ética**
   - Dato agregado anónimo → gobiernos pagan por análisis
   - Reportes premium → usuarios pagan si quieren features avanzadas
   - Grants de OMS, Gates Foundation, etc.
   - **Nunca** vender datos personales o poner ads intrusivos

---

## 📐 ARQUITECTURA ACTUAL

**Stack técnico:**
- **Frontend:** Next.js 14 (App Router, SSG)
- **Lenguaje:** TypeScript strict mode
- **Styling:** Tailwind CSS
- **Mapas:** Leaflet (gratuito, open-source)
- **Internacionalización:** next-intl (EN/ES)
- **Hosting:** Vercel (gratuito, performance global)
- **Data:** Static JSON files (countries.json, substances.json, risk-matrix.json)

**Por qué esta arquitectura:**
- ✅ Zero backend → cero costos operacionales
- ✅ SSG estático → páginas del tamaño de Wikipedia
- ✅ Performance perfecto → LCP < 1s en 4G
- ✅ SEO out-of-the-box → 424 rutas indexables en Google
- ✅ Escalable a 1M+ usuarios sin problemas

---

## 🎨 POSICIONAMIENTO VISUAL

**NO es:**
- ❌ Un sitio médico asustadizo ("¡VAS A MORIR DE ASBESTO!")
- ❌ Un foro desordenado
- ❌ Un nonprofit típico con colores pastel
- ❌ Un sitio comercial de venta

**SÍ es:**
- ✅ **Data-forward:** Números, mapas, gráficos como protagonistas
- ✅ **Editorial:** Tono de reportaje (Our World in Data)
- ✅ **Comando center:** Sensación Bloomberg Terminal — información crítica, clara, accionable
- ✅ **Urgente pero accesible:** "Esto es importante" sin ser alarmista
- ✅ **Global:** Diseño limpio que funciona en 20 idiomas

**Paleta visual:**
- Fondo: Deep navy/charcoal (#0a0f1a, #060b14)
- Acentos: Amber (warning), Red (danger), Emerald (safe)
- Tipografía: Display font moderna + body sans-serif limpio

---

## 📊 ESTADO ACTUAL (v1.2.0)

| Métrica | Estado |
|---------|--------|
| Países cubiertos | 195 / 195 ✅ |
| Rutas estáticas | 424 pre-renderizadas ✅ |
| Sustancias | 1 (Asbestos) ✅ |
| Idiomas | EN + ES ✅ |
| Risk Checker | Funcional ✅ |
| Mapa 3D | globe.gl implementado ✅ |
| Score diseño | 9/10 ✅ |
| Score datos | 3/10 ⚠️ (precisión, coverage) |
| Score auditoría global | 6.5/10 ⚠️ |
| Tráfico | En crecimiento (3 días post-launch) |
| **Score UX home** | **4/10** 🔴 (SIN BARRA DE BÚSQUEDA) |

---

## 🎯 PRIORIDADES AHORA (Q1 2026)

1. **🔴 CRÍTICO: Auditar + mejorar HOME**
   - Sin barra de búsqueda → imposible buscar en móvil
   - Esto es lo que haremos con el **AUDIT-HOME-UX-CLAUDE-CODE.md**
   - Objetivo: Score 8/10 en UX home

2. **🟠 IMPORTANTE: Expandir sustancias**
   - Agregar PFAS, Plomo, Microplásticos
   - Risk matrix más compleja
   - Datos de más organismos (EPA, CDC, ECHA)

3. **🟡 NICE-TO-HAVE: Comunidad**
   - Sistema de reportes ciudadanos
   - Validación crowdsourced
   - Heat maps dinámicos

---

## 👤 TU ROL (Eloy)

**Eres:** Jr. Developer + creador de ToxinFree
**Trabajas:** En carnicería durante el día, en esto por las noches/fines de semana
**Tu enfoque:** Calidad > cantidad, impacto > tráfico, legado > monetización
**Tu fortaleza:** Arquitectura limpia, datos rigurosos, diseño editorial

**Lo que necesitas ahora:** Herramientas (Claude Code) que te ayuden a escalar sin perder rigor.

---

## 📚 DOCUMENTACIÓN RELACIONADA

- **CLAUDE.md** — Reglas de desarrollo, stack, estructura
- **SCOPE-FULL.md** — Visión completa de product roadmap
- **SCOPE-V1.md** — Qué incluye v1, qué se pospone
- **DESIGN.md** — Sistema de diseño, paleta, componentes
- **DATA.md** — Schema de datos, sources, metodología
- **RISK-LOGIC.md** — Algoritmo de cálculo de riesgo
- **AUDIT-HOME-UX-CLAUDE-CODE.md** — 👈 **ESTO ES LO QUE VAMOS A HACER AHORA**

---

## 🏁 LA PREGUNTA FUNDAMENTAL

**¿Por qué ToxinFree existe?**

Porque hace 3 meses viste una noticia sobre asbesto en Rusia y pensaste: "¿Cómo no hay una herramienta global para esto?"

**¿Qué esperas lograr?**

Que en 3 años, cuando alguien en cualquier país escriba "asbestos [mi país]" en Google, **ToxinFree sea la respuesta número 1.**

Que millones de ciudadanos tengan el data que necesitan para presionar sus gobiernos a banear estas sustancias.

Que alguien en Mumbai, Jakarta, o Ciudad de México se sienta empoderado — no asustado — por lo que sabe.

---

## 💬 LLÉVATELO

**"ToxinFree es The New York Times de las sustancias tóxicas. Es donde va la gente cuando necesita respuestas confiables, rápidas, accionables — en cualquier idioma, en cualquier país."**

---

**Fecha:** 22 de Marzo, 2026
**Versión:** 1.2.0
**Creador:** Eloy (Koku)
**Misión:** Salud pública global, un país a la vez.


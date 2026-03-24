# PROMPT MAESTRO — ToxinFree Full Audit + Critical Fixes + Roadmap
## Para usar en Claude Code: /clear → /model opus → Effort: High
## Pegar TODO el contenido debajo de la línea divisoria

---

Lee CLAUDE.md y CHANGELOG.md para contexto inicial.

Tu tarea tiene 3 fases que ejecutarás en orden. El output final es UN SOLO archivo: `docs/FULL-AUDIT.md`. Este documento se convertirá en la biblia del proyecto — cada decisión futura sale de aquí.

Tómate el tiempo que necesites. Lee CADA archivo del proyecto. No asumas nada — verifica en el código real. Cada finding debe referenciar archivo:línea.

═══════════════════════════════════════
FASE 1 — LECTURA EXHAUSTIVA (no escribas nada todavía)
═══════════════════════════════════════

Lee TODOS estos archivos en orden. No te saltes ninguno:

**Configuración:**
- package.json, next.config.ts, tsconfig.json, tailwind config
- middleware.ts o src/middleware.ts
- .gitignore, .github/ (todo lo que haya)

**Data layer:**
- src/data/countries.json (contar entries exactas, verificar 15 priority countries)
- src/data/materials.json (contar entries, verificar schema)
- src/data/risk-matrix.json (comparar valores con docs/RISK-LOGIC.md)
- src/data/substances.ts (verificar que noBanCount matchea con countries.json real)
- src/data/geo/world.json (verificar tamaño en KB)

**Core logic:**
- src/lib/calculators/ (todo el directorio)
- src/lib/types.ts
- src/lib/utils.ts
- src/i18n/ (todo el directorio)

**Components (todos):**
- src/components/map/ (WorldMap, Globe3D, Globe3DLoader, MapLoader)
- src/components/checker/ (RiskChecker, RiskResults)
- src/components/layout/ (Header, Footer)
- src/components/ui/ (todos los que existan)

**Pages (todas):**
- src/app/layout.tsx
- src/app/[locale]/layout.tsx
- src/app/[locale]/page.tsx
- src/app/[locale]/check/page.tsx
- src/app/[locale]/country/[slug]/page.tsx
- src/app/[locale]/learn/ (TODAS las sub-páginas)
- src/app/not-found.tsx (si existe)
- src/app/sitemap.ts
- src/app/robots.ts

**i18n:**
- src/messages/en.json (contar keys totales)
- src/messages/es.json (verificar que tiene EXACTAMENTE las mismas keys)

**Documentación (todos los .md):**
- CLAUDE.md, CHANGELOG.md, CONTRIBUTING.md, README.md
- docs/ (CADA archivo .md que exista)
- .github/ (templates, workflows)

**Buscar también:**
- Archivos huérfanos (importados en ningún lugar)
- console.log / console.error abandonados en código de producción
- Dependencias en package.json que no se importan en ningún archivo
- CSS classes definidas pero nunca usadas
- Variables de entorno referenciadas pero no documentadas
- TODOs o FIXMEs abandonados en comentarios

═══════════════════════════════════════
FASE 2 — ARREGLAR ISSUES CRÍTICOS (ejecuta directamente)
═══════════════════════════════════════

Mientras auditas, si encuentras estos issues, ARRÉGLALOS directamente (no solo los reportes):

**Auto-fix si encuentras:**
- noBanCount hardcodeado que no matchea con countries.json → computar dinámicamente
- Strings hardcodeadas en inglés en componentes (violación i18n) → mover a messages
- Keys faltantes en es.json que sí están en en.json → agregar traducción
- /learn/methodology u otras páginas nuevas faltantes en sitemap.ts → agregar
- `output: "standalone"` en next.config.ts → remover (es para Docker, no Vercel)
- console.log en código de producción → eliminar
- Dependencias no usadas en package.json → remover con npm uninstall
- Imports duplicados (worldGeoJSON, FILL_COLORS) → crear módulo compartido
- External links sin rel="noopener noreferrer" → agregar
- Archivos .md redundantes o desactualizados → eliminar o fusionar

**NO auto-fixes (solo reportar, son decisiones de producto):**
- Cambios en la lógica del risk calculator
- Cambios en el diseño visual
- Cambios en la estructura de datos
- Eliminación de features

═══════════════════════════════════════
FASE 3 — ESCRIBIR docs/FULL-AUDIT.md
═══════════════════════════════════════

Estructura EXACTA del documento:

```markdown
# ToxinFree — Full Technical Audit Report
**Date**: [fecha actual]
**Version audited**: [leer de CHANGELOG.md]
**Auditor**: Claude Code (Opus) — evidence-based
**Method**: Direct file reading, every finding references file:line
**Auto-fixes applied**: [número] issues fixed during this audit

---

## EXECUTIVE SUMMARY
[5 líneas máximo: estado general, score, prioridad #1, qué se arregló]

---

## SECTION 1: PROJECT HEALTH DASHBOARD

| Dimension | Score | Key Evidence | Trend vs Last Audit |
|-----------|-------|-------------|---------------------|
| Code Quality | X/10 | [file:line] | ↑/↓/→ |
| TypeScript Strictness | X/10 | ... | ... |
| Architecture | X/10 | ... | ... |
| Error Handling | X/10 | ... | ... |
| Performance | X/10 | ... | ... |
| SEO Implementation | X/10 | ... | ... |
| Accessibility (WCAG) | X/10 | ... | ... |
| i18n Completeness | X/10 | ... | ... |
| Data Quality | X/10 | ... | ... |
| Mobile UX | X/10 | ... | ... |
| Security | X/10 | ... | ... |
| Test Coverage | X/10 | ... | ... |
| Documentation | X/10 | ... | ... |
| Scalability Readiness | X/10 | ... | ... |
| **GLOBAL** | **X/10** | | |

Compare with AUDIT-VERDICT.md scores if it exists. Note improvements and regressions.

---

## SECTION 2: AUTO-FIXES APPLIED

| # | Issue | File(s) Changed | What Was Done |
|---|-------|----------------|---------------|
| 1 | ... | ... | ... |

Git-ready: all changes can be committed as "audit: auto-fix [n] issues"

---

## SECTION 3: BUGS (break functionality)

| # | Severity | File:Line | Description | User Impact | Fix |
|---|----------|-----------|-------------|-------------|-----|
| 1 | CRITICAL/HIGH/MED/LOW | ... | ... | ... | ... |

---

## SECTION 4: CODE SMELLS

| # | File:Line | Issue | Why It Matters | Fix |
|---|-----------|-------|---------------|-----|
| 1 | ... | ... | ... | ... |

---

## SECTION 5: DATA INTEGRITY

### Counts (verified by reading JSON)
- Total countries: [exact count]
- full_ban: [count] (expected: 72 per IBAS)
- no_ban: [count]
- unknown: [count]
- With timeline (non-empty): [count]
- With mesothelioma_rate (non-null): [count]
- With estimated_buildings_at_risk (non-null): [count]
- Materials: [count]

### Consistency Checks
- [ ] noBanCount in substances.ts === actual count from countries.json
- [ ] All 15 priority countries have priority: "high"
- [ ] All 15 priority countries have non-empty timeline
- [ ] Ban years match IBAS chronological list for priority countries
- [ ] Risk matrix values match docs/RISK-LOGIC.md

### Data Gaps
[List specific countries/fields with missing or suspicious data]

---

## SECTION 6: SEO AUDIT

### Per-page verification:

| Page Type | Count | Has Metadata | Has JSON-LD | In Sitemap | Has hreflang | Has OG |
|-----------|-------|-------------|------------|-----------|-------------|--------|
| Home | 2 | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ |
| Risk Checker | 2 | ... | ... | ... | ... | ... |
| Country pages | 400 | ... | ... | ... | ... | ... |
| Learn pages | 14 | ... | ... | ... | ... | ... |

### Pages failing SEO checks:
[List every page with a gap]

---

## SECTION 7: PERFORMANCE

- Globe3D bundle: ~[X]KB
- Leaflet bundle: ~[X]KB  
- Recharts bundle: ~[X]KB
- GeoJSON file: [X]KB
- Total client JS estimate: [X]KB
- Unused dependencies found: [list]
- Console.logs in production: [count, locations]
- SSR vs Client component split: [assessment]

---

## SECTION 8: SECURITY

- [ ] URL params sanitized in RiskChecker
- [ ] No XSS vectors found
- [ ] External links have noopener noreferrer
- [ ] No API keys in code
- [ ] No sensitive data in client bundles
- [ ] next.config.ts headers configured
[Detail any failures]

---

## SECTION 9: i18n COMPLETENESS

- en.json total keys: [count]
- es.json total keys: [count]
- Missing in es.json: [list keys]
- Missing in en.json: [list keys]
- Hardcoded strings found: [list with file:line]
- Language toggle works on all routes: [yes/no, failures]

---

## SECTION 10: DOCUMENTATION AUDIT

| File | Status | Action | Reason |
|------|--------|--------|--------|
| CLAUDE.md | ✅/⚠️/❌ | KEEP / UPDATE / DELETE / MERGE → [target] | [why] |
| CHANGELOG.md | ... | ... | ... |
| CONTRIBUTING.md | ... | ... | ... |
| README.md | ... | ... | ... |
| docs/SCOPE-V1.md | ... | ... | ... |
| docs/SCOPE-FULL.md | ... | ... | ... |
| docs/SCALING.md | ... | ... | ... |
| docs/DATA.md | ... | ... | ... |
| docs/DESIGN.md | ... | ... | ... |
| docs/SEO.md | ... | ... | ... |
| docs/RISK-LOGIC.md | ... | ... | ... |
| docs/AUDIT-VERDICT.md | ... | ... | ... |
| [any others found] | ... | ... | ... |

### Redundancies Found:
[Which .md files contain duplicate information]

### Proposed Final Structure:
```
proyecto/
├── CLAUDE.md          — [one-line purpose]
├── CHANGELOG.md       — [one-line purpose]
├── CONTRIBUTING.md     — [one-line purpose]
├── README.md          — [one-line purpose]
├── docs/
│   ├── [file].md      — [one-line purpose]
│   └── ...
```

### Cleanup Actions:
```
Step 1 — DELETE: [files] — reason
Step 2 — MERGE: [A] + [B] → [C] — reason  
Step 3 — UPDATE: [files] — what to change
Step 4 — CREATE: [files] — what's missing
```

---

## SECTION 11: TECHNICAL DEBT INVENTORY

| # | Item | Severity | File(s) | Est. Fix Time | Impact If Ignored | Sprint |
|---|------|----------|---------|--------------|-------------------|--------|
| 1 | ... | CRITICAL | ... | Xm | ... | Week 1 |
| 2 | ... | HIGH | ... | Xm | ... | Week 1 |
| ... | ... | ... | ... | ... | ... | ... |

---

## SECTION 12: WHAT'S MISSING (by impact)

### BLOCKER (before seeking backlinks)
- [ ] [item + why it's blocking]

### HIGH (next 30 days)
- [ ] [item]

### MEDIUM (next 90 days)  
- [ ] [item]

### LOW (nice to have)
- [ ] [item]

---

## SECTION 13: ACTIONABLE ROADMAP

### Week 1: [Task Name]

**Claude Code Config:**
- Model: `opus` / `sonnet` — REASON: [why this model]
- Effort: `high` / `medium` / `low` — REASON: [why this level]
- Context to read first: [specific file paths]
- Pre-requisite: Read CHANGELOG.md section [vX.X.X]

**Prompt (copy-paste ready):**
```
[exact prompt]
```

**Files that will be modified:**
- [list]

**After completion, update:**
- CHANGELOG.md → add entry vX.X.X
- [any other .md that needs update]

**Verification:**
- [ ] npm run build (0 errors)
- [ ] [specific checks]

**Expected result:**
- [what should be different]

---

### Week 2: [Task Name]
[same structure]

### Week 3: [Task Name]
[same structure]

### Week 4: [Task Name]
[same structure]

---

## SECTION 14: FINAL VERDICT

### Score: X/10

### One sentence:
> "[honest summary]"

### 3 risks that can kill this project:
1. ...
2. ...
3. ...

### 3 opportunities that can make it succeed:
1. ...
2. ...
3. ...

### The one thing that matters most right now:
[single actionable sentence]

---

*This audit was performed on [date] at version [X]. 
Auto-fixes applied: [N] issues.
Next audit recommended: [date/trigger].*
```

═══════════════════════════════════════
REGLAS ABSOLUTAS PARA ESTA AUDITORÍA:
═══════════════════════════════════════

1. EVERY finding must reference a specific file and line number
2. Do NOT invent problems — verify in actual code
3. Do NOT sugarcoat — if something is bad, say it directly
4. If something is well done, acknowledge it in one line and move on
5. Every problem MUST have a concrete solution
6. Roadmap prompts must be COMPLETE and copy-paste ready
7. Each roadmap prompt must specify: model, effort level, context files, post-task updates
8. Prioritize by user impact, not technical purism
9. Auto-fix anything that's objectively wrong (not opinion-based)
10. The FULL-AUDIT.md must be self-contained — someone with no context should understand the project's state from reading it alone

═══════════════════════════════════════
AFTER WRITING THE AUDIT:
═══════════════════════════════════════

1. Run `npm run build` — must pass with 0 errors after auto-fixes
2. Run `npm run type-check` — must pass
3. Commit auto-fixes: `git add . && git commit -m "audit: auto-fix [N] issues found during full audit"`
4. Update CHANGELOG.md with audit entry
5. Report: total findings by severity, total auto-fixes applied, total .md cleanup actions, global score

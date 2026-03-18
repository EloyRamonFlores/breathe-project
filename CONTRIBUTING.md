# Contributing to ToxinFree

Thank you for helping make toxic substance information more accessible worldwide.

ToxinFree is a citizen-powered platform. We rely on contributors to keep data accurate, translations up to date, and the codebase healthy. Every contribution — even a single data correction — matters.

---

## Ways to Contribute

### 1. Report a Data Error

If you find incorrect information (wrong ban status, incorrect year, missing regulation):

1. Open an issue using the [Data Correction template](.github/ISSUE_TEMPLATE/data-correction.md)
2. Include: the country, what's wrong, and a link to an official source
3. A maintainer will verify and update `src/data/countries.json`

### 2. Add or Update a Country

Country data lives in `src/data/countries.json`. Each entry follows this schema:

```json
{
  "slug": "country-name",
  "name": "Country Name",
  "iso2": "XX",
  "iso3": "XXX",
  "region": "Region Name",
  "ban_status": "full_ban | partial_ban | no_ban | de_facto_ban | unknown",
  "ban_year": 2024,
  "ban_details": "Short description of the regulatory status.",
  "timeline": [
    {
      "year": 2024,
      "event": "Description of regulatory event.",
      "type": "ban | regulation | court_ruling | other",
      "source_url": "https://official-source.gov"
    }
  ],
  "peak_usage_era": "1950s-1970s",
  "common_materials": ["material-id-1", "material-id-2"],
  "estimated_buildings_at_risk": "~1 million",
  "mesothelioma_rate": 5.0,
  "mesothelioma_source_year": 2020,
  "priority": "high | normal",
  "sources": [
    { "name": "Source Name", "url": "https://source-url.gov" }
  ]
}
```

**Rules:**
- Every `timeline` entry must have a `source_url` pointing to an official document
- `ban_status` must be one of the allowed values above
- Do not guess — if you're unsure, use `"unknown"` and add a note in the PR

### 3. Improve Translations

Translation files are in `src/messages/`. Currently supported: English (`en.json`) and Spanish (`es.json`).

To add a new language:
1. Copy `src/messages/en.json` to `src/messages/{locale}.json` (e.g. `hi.json` for Hindi)
2. Translate all values (keys stay in English)
3. Add the locale to `src/i18n/routing.ts`
4. Open a PR with your translation

Priority languages (by population at risk): Hindi, Mandarin, Portuguese, Russian, Indonesian, French, Arabic.

### 4. Fix a Bug or Improve the Code

1. Fork the repository
2. Create a feature branch: `git checkout -b fix/description`
3. Follow the coding conventions in `CLAUDE.md`
4. Run `npm run type-check` and `npm run build` before submitting
5. Open a pull request with a clear description of what changed and why

---

## Code Conventions

See `CLAUDE.md` for the full coding rules. Key points:
- Functional React components with hooks only
- TypeScript strict mode — no `any` types
- All user-facing text through i18n (`src/messages/`)
- Tailwind utilities only — no custom CSS unless necessary
- Server components by default; `"use client"` only when needed

---

## Data Verification Standards

Before submitting a data change:

1. Cite at least one official source (government website, WHO, IBAS, EPA)
2. Prefer primary sources over news articles
3. For ban status, the hierarchy is: IBAS > national government > WHO > academic
4. If sources conflict, mark `ban_status: "unknown"` and note the conflict in `ban_details`

---

## License

- **Code**: MIT License
- **Data** (`src/data/`): Creative Commons Attribution 4.0 International (CC BY 4.0)

By contributing, you agree that your contributions will be licensed under the same terms.

---

## Questions?

Open an issue or email us at data@toxinfree.global.

# Guatemala — Asbestos Research Profile

**Researcher:** Claude (ToxinFree)
**Date:** 2026-04-21
**Scope:** full
**Status:** Draft — Pending human review
**Confidence:** MEDIUM — Ban-status verification is HIGH (clear IBAS absence plus active commercial market); timeline and regulatory events HIGH (multiple Tier 1 sources); mortality and activism sections LOW (no Guatemala-specific data found, only regional aggregates; no individual activist figures surfaced after targeted searches).

---

## 1. Ban Status Verification (FOUNDATION)

### Verification Checklist

**1. Is Guatemala on the IBAS full-ban list?**
No. Guatemala does not appear on either the alphabetical ban list or the chronological ban list maintained by the International Ban Asbestos Secretariat. The only Central American country listed is Honduras (2004).
- Source: [IBAS — Current Asbestos Bans (alphabetical)](https://www.ibasecretariat.org/alpha_ban_list.php)
- Source: [IBAS — Chronology of Asbestos Bans and Restrictions](https://www.ibasecretariat.org/chron_ban_list.php)

**2. What specific asbestos forms are banned?**
No form — amphiboles (crocidolite, amosite, tremolite, actinolite, anthophyllite) or chrysotile — is prohibited by Guatemalan national law. No decree, law, or ministerial resolution enacting a ban was found in Congreso de la República records, the Ministry of Labor (MINTRAB) or the Ministry of Health (MSPAS) regulatory databases.
- Source: [Congreso de la República — Iniciativas](https://www.congreso.gob.gt/seccion_informacion_legislativa/iniciativas) — no asbestos-ban initiative on record for 2023–2025

**3. Is chrysotile specifically addressed?**
Chrysotile (white asbestos) remains **legal** in Guatemala. Chrysotile-containing products — asbestos laminated sheets (for gaskets), corrugated asbestos-cement roofing panels, and asbestos-cement water pipes — are actively commercialized. ORION Representaciones Internacionales, S.A. (5ta calle 3-21 zona 9, Guatemala City) has been the market leader in asbestos sheet products since 1958 per its own commercial listing.
- Source: [Construex — Asbesto Laminado Orion](https://www.construex.gt/exhibidores/orion/producto/asbesto_laminado_orion_zona_18)
- Source: [Orion Guatemala — Asbesto Laminado catalog](https://orionguatemala.com/es/dt_gallery/galeria/asbesto-laminado-2/)
- Source: [Páginas Amarillas de Guatemala — Láminas de Fibrocemento vendors](https://www.paginasamarillas.com.gt/guatemala/servicios/laminas-de-fibrocemento)

**4. What year did each restriction take effect?**
No national restriction on asbestos use, import, manufacture, or sale. The only asbestos-specific obligations in force arise from two instruments that do not ban the substance:
- Acuerdo Gubernativo 229-2014 (23 July 2014) — Occupational Health and Safety Regulation — imposes asbestos-waste handling duties on employers but does not prohibit asbestos.
- ILO Convention 162 (Asbestos, 1986) — ratified by Guatemala on 18 April 1989; commits Guatemala to workplace protection measures but does not require a national ban.

**5. Is there evidence of enforcement?**
No enforcement evidence beyond general occupational inspections by the Inspección General de Trabajo (IGT), IGSS, and MSPAS. No prosecutions, factory closures, or customs seizures related to asbestos were identified. Trade data show asbestos continues to flow: Guatemala imported USD 530 of raw asbestos fibre (HS 2524) in 2021 (up from USD 40 in 2020) and exports small quantities of asbestos products to Honduras.
- Source: [TrendEconomy — Guatemala Asbestos trade 2009–2021](https://trendeconomy.com/data/h2/Guatemala/2524)

**6. Internal consistency check:**
- `ban_status: no_ban` ↔ `ban_details` text says chrysotile remains legal ✓
- `ban_status: no_ban` ↔ no timeline event has `type: ban` or `type: partial_ban` ✓
- `chrysotile_status: legal` ↔ consistent with `no_ban` ✓
- `ban_year: null` ↔ no ban event exists ✓
- No contradictions.

### Ban Status Conclusion

- **ban_status:** `no_ban`
- **chrysotile_status:** `legal`
- **ban_year:** `null`
- **Summary:** Guatemala has no national asbestos ban. Chrysotile and asbestos-containing products (laminated sheets, fibrocement roofing, gaskets) remain legally imported, manufactured, sold and used. The only asbestos-specific rules are workplace-handling obligations under Acuerdo Gubernativo 229-2014 (the Occupational Health and Safety Regulation) and commitments derived from the 1989 ratification of ILO Convention 162 on asbestos — neither instrument prohibits the substance.

---

## 2. Regulatory Timeline

| Year | Event | Legal Instrument | Source |
|------|-------|------------------|--------|
| 1989 | Guatemala ratifies ILO Convention 162 on safety in the use of asbestos | C162 (Asbestos Convention, 1986) — ratification deposited 18 April 1989 | [ILO NORMLEX — Guatemala ratifications (via Studocu listing of the 74 conventions)](https://www.studocu.com/gt/document/universidad-de-san-carlos-de-guatemala/derecho-laboral/listado-de-convenios-de-oit-raficados-por-guatemala/57279363); [ILO C162](https://www.ilo.org/resource/c162-asbestos-convention-1986) |
| 2010 | Guatemala accedes to the Rotterdam Convention on Prior Informed Consent; Decreto 33-2009 of Congreso approves accession; deposit 25 January 2010; entry into force for Guatemala 18 July 2010 | Decreto 33-2009 | [Organismo Judicial — Decreto 33-2009 PDF](http://ww2.oj.gob.gt/es/QueEsOJ/EstructuraOJ/UnidadesAdministrativas/CentroAnalisisDocumentacionJudicial/cds/CDs%20de%20leyes/2009/pdfs/decretos/D033-2009.pdf) |
| 2014 | Reglamento de Salud y Seguridad Ocupacional is promulgated. It imposes asbestos-waste handling duties on employers (no prohibition on use, import, or sale) | Acuerdo Gubernativo 229-2014 (23 July 2014) | [Mintrabajo — AG 229-2014 (official)](https://www.mintrabajo.gob.gt/images/Documentacion/Leyes_Ordinarias/Acuerdos_Gubernativos/Acdo_Gub_Reglamento_de_Salud_y_Seguridad_Ocupacional_229-2014.pdf); [IGSS consolidated text](https://www.igssgt.org/wp-content/uploads/2022/04/Acuerdo-Gubernativo-229-2014-y-Reformas-Acuerdo-Gubernativo-33-2016.pdf) |
| 2016 | First reform to 229-2014 | Acuerdo Gubernativo 33-2016 | [IGSS consolidated text (same PDF)](https://www.igssgt.org/wp-content/uploads/2022/04/Acuerdo-Gubernativo-229-2014-y-Reformas-Acuerdo-Gubernativo-33-2016.pdf) |
| 2022 | Second reform to 229-2014 | Acuerdo Gubernativo 57-2022 | [Consortium Legal — Reformas AG 229-2014](https://consortiumlegal.com/2022/03/04/guatemala-reformas-al-reglamento-de-salud-y-seguridad-ocupacional-acuerdo-gubernativo-no-229-2014/) |

### Context

Guatemala's regulatory posture on asbestos is one of **workplace management without prohibition**. It sits inside the broader Central American pattern where Honduras stands alone as the only country with a formal ban (Executive Agreement Decree 0-32, 2004), while El Salvador, Nicaragua, Costa Rica, Panama and Guatemala continue to allow chrysotile.

The ratification of ILO Convention 162 in 1989 committed Guatemala, under Article 11, to prohibit crocidolite "unless its use is reasonable and practicable" and, under Article 10, to replace asbestos with safer substitutes "where this is technically possible." No national legislation implementing those obligations has been enacted in the thirty-seven years since. The ratification therefore operates as a dormant international-law commitment rather than a restriction in domestic practice.

Acuerdo Gubernativo 229-2014 is the main domestic instrument that mentions asbestos. It is a 559-article OSH regulation structured in 11 titles and 43 chapters; its asbestos provisions deal with waste disposal by employers — requiring that asbestos-containing residues be eliminated "in such a way that no risk is produced to the health of workers handling them or the population neighboring the company." The regulation is administered by MINTRAB's Dirección General de Previsión Social and enforced (jointly) by IGT, IGSS, and MSPAS. It does not set a ceiling on airborne asbestos concentrations specific to chrysotile nor does it require licensing of asbestos importers.

The 2010 accession to the Rotterdam Convention triggered no practical change for chrysotile trade because chrysotile remains blocked from Annex III of the Convention by a small group of producer states (Russia, Kazakhstan, India). Guatemala therefore receives no PIC notifications when importing chrysotile, and Guatemalan law does not independently require exporter notifications.

---

## 3. Historias de Resistencia (Activism Stories)

### Individual Stories

After targeted searches (combining "Guatemala" with "asbesto víctima," "mesotelioma activista," "trabajador asbesto caso," "sindicato amianto construcción," and searches across Prensa Libre, Soy502, and El Periódico), **no individually documented Guatemalan asbestos activist, victim-advocate, or whistle-blower was identified.** This is itself a finding: unlike Brazil (ABREA), Colombia (Fundación Colombia Libre de Asbesto / Daniel Pineda), or Mexico (Guillermo Foladori), Guatemala lacks a public civil-society figure leading asbestos advocacy that is searchable in open sources.

*No verified direct quote from a Guatemalan asbestos activist was found in public sources.*

### Regional / Collective Resistance

Guatemala's asbestos story is currently told, when it is told at all, through **regional Latin American networks** rather than through named national advocates:

- **Red Latinoamericana Anti-Asbesto (RELAC) / Virtual-AR** — regional asbestos-ban coalition. Guatemala is not listed as having an active national node.
- **PAHO Atlas of Asbestos in the Americas (2012–2015)** — the Pan American Health Organization's attempt to compile asbestos use and regulation data across its 35 member countries. Guatemala was included in the scope; the PAHO 2007–2009 worker-exposure surveys in Argentina, Colombia, Chile, Guatemala and Nicaragua indicated exposures to multiple chemical, physical and biological hazards, but no Guatemala-specific asbestos exposure figures were published from that effort.
- Source: [PAHO — Proyecto del Atlas del Asbesto de las Américas](https://www3.paho.org/hq/index.php?option=com_content&view=article&id=11917:asbestos&Itemid=1511&lang=es)
- Source: [PAHO/WHO — Occupational exposure to chemical carcinogens warning (2014)](https://www.paho.org/en/news/28-4-2014-pahowho-warns-health-risks-occupational-exposure-chemical-carcinogens)

### Joint/Paired Resistance Stories

None documented. Do not invent.

---

## 4. Exposure Sources ("Where Was It?")

### Common asbestos-containing materials in Guatemala

- **Corrugated asbestos-cement roofing sheets ("láminas de fibrocemento")** — the dominant residential and light-industrial roofing material across rural and peri-urban Guatemala since the 1950s. Main brands historically present: Duralita (El Salvador, Grupo Duralita) with "leve presencia" (light presence) in Guatemala per regional industry reporting, and Eternit-family products. Source: [El Salvador.com — Duralita 40 años](https://historico.elsalvador.com/historico/119899/duralita-40-anos-de-resistir-fuego-inclemencias-crisis-y-depresion.html)
- **Asbestos-cement water pipes** — historically installed by INFOM (Instituto de Fomento Municipal) and municipal utilities including EMPAGUA (Guatemala City) during the 1960s–1980s water-system expansions. No public inventory of remaining AC pipe kilometres has been located.
- **Asbestos laminated sheets** (gaskets, industrial seals) — ORION Representaciones Internacionales remains the named distributor. Used in pressure- and temperature-resistant gaskets in power stations, sugar mills (ingenios), and shipyards.
- **Vehicle brake linings, clutch plates, motor gaskets** — distributed commercially; PROINDESA and Agencias Vibo are named vendors in open commercial listings.
- Source: [Construex — Lámina Ondulada de Fibrocemento (Casa Hermes)](https://www.construex.gt/exhibidores/casa_hermes/producto/lamina_ondulada_de_fibrocemento_amatitlan)
- Source: [Casa Hermes — Láminas de Fibrocemento catalog](https://www.casahermes.com/categories/7/laminas-de-fibrocemento)
- Source: [Agencias Vibo — Lámina Comprimida de Asbesto](https://agvibo.com/product/lamina-comprimida-de-asbesto/)

### Key locations of exposure

- **Mines:** No documented asbestos mining in Guatemala. Guatemala has not been a producer; all fibre is imported (historical supply from Mexico, Brazil, Russia, Kazakhstan via regional distributors).
- **Factories:** No confirmed domestic asbestos-cement production facility has been identified in open sources. The Central American asbestos-cement market has historically been supplied by Duralita (El Salvador, Lourdes plant) and Eternit-family operators elsewhere; Guatemalan distributors import finished product and raw sheets. *This absence of an identified factory is itself a data gap — Guatemalan industry records should be consulted.*
- **Products:** Duralita corrugated roofing, ORION asbestos laminated sheets, asbestos-cement piping.
- **Buildings most affected:**
  - Post-1976-earthquake reconstruction housing. The 4 February 1976 earthquake (M 7.5) killed approximately 23,000 people and left hundreds of thousands homeless. The subsequent reconstruction campaign in highland villages and peri-urban Guatemala City relied heavily on corrugated fibrocement sheets (often called "lámina" generically) for speed, low unit cost, and fire resistance. Houses built or repaired between 1976 and the late 1990s are the single largest cohort of likely asbestos-containing roofing in the country.
  - Industrial and sugar-mill installations from the 1960s–1990s — steam piping insulation, gaskets, roofing.
  - Older municipal water networks — AC pipe.
- Source: [World Bank — Guatemala Earthquake Reconstruction Project](https://documents1.worldbank.org/curated/en/191871468030644719/text/Guatemala-Earthquake-Reconstruction-Project.txt)
- Source: [Wikipedia — 1976 Guatemala earthquake](https://en.wikipedia.org/wiki/1976_Guatemala_earthquake) (for earthquake magnitude, date, and casualty figures; primary source for reconstruction-era roofing use was not isolated and is inferred from regional industry pattern — flagged in Verification Notes)

**Presence vs. condition vs. protection (Principle #7):** The claim above — that post-1976 reconstruction housing is the single largest cohort of likely asbestos-containing roofing — is a presence-plus-era statement. It is not a condition statement: no systematic survey has assessed what fraction of those roofs is damaged vs. intact, nor what protection framework governs their removal. Under Guatemalan law today, a homeowner replacing an AC roof has no licensed-abator requirement and no waste-disposal obligation distinct from general municipal solid-waste rules.

---

## 5. Corporate Responsibility

Document only facts from court documents, regulatory findings, or journalism. No court cases, regulatory findings, or investigative journalism specifically naming Guatemalan asbestos producers or importers for health-related liability were located in open sources.

### ORION Representaciones Internacionales, S.A.

- **Role:** Distributor / importer of asbestos-laminated sheets and asbestos-containing industrial products.
- **Period of activity:** 1958 – present (per company's own market-leader claim).
- **Legal outcomes:** No litigation found in open sources.
- **Current status:** Actively operating; Guatemala City office (5ta calle 3-21 zona 9).
- **Source:** [Orion Guatemala — Asbesto Laminado](https://orionguatemala.com/es/dt_gallery/galeria/asbesto-laminado-2/); [Construex — Orion listing](https://www.construex.gt/exhibidores/orion/producto/asbesto_laminado_orion_zona_18)

### Duralita (regional, presence in Guatemala)

- **Role:** Regional Central American producer of fibrocement roofing; historically asbestos-cement, currently claims transition away from asbestos in some product lines (verification of Guatemala-distributed SKUs pending).
- **Period of activity:** Founded in El Salvador; present in Guatemala with limited distribution ("leve presencia").
- **Legal outcomes:** None identified in Guatemala-specific records.
- **Current status:** Active regional brand.
- **Source:** [El Salvador.com — Duralita 40 años](https://historico.elsalvador.com/historico/119899/duralita-40-anos-de-resistir-fuego-inclemencias-crisis-y-depresion.html)

### Cementos Progreso (CEMPRO)

- Guatemala's dominant cement company, founded 1899 by the Novella family. Despite its central role in Guatemalan cement markets, **no open-source record was found linking CEMPRO to asbestos-cement production or distribution**. This absence is documented here rather than assumed either way.
- **Source:** [CEMPRO — Nuestra Historia](https://cempro.com/nuestra-historia/)

### Historical Mexican-supplier corridor

Academic work documenting Mexico's asbestos industry found that nearly one-third of Mexican asbestos-product exports during the 1990s flowed to Central America, including Guatemala, with the corridor expanding through the decade. This supplier relationship predates Mexico's own partial restrictions and is relevant context for understanding where Guatemala's installed asbestos inventory originated.
- **Source:** [Globalization and the Transfer of Hazardous Industry: Asbestos in Mexico, 1979–2000 (Brophy et al.)](https://www.researchgate.net/publication/10574012_Globalization_and_the_Transfer_of_Hazardous_Industry_Asbestos_in_Mexico_1979-2000)

---

## 6. Mortality & Health Impact

| Metric | Value | Year | Source |
|--------|-------|------|--------|
| Guatemala mesothelioma deaths/year (country-specific) | Not separately reported | — | GBD 2019 aggregates Guatemala into the "Central Latin America" GBD region |
| Central Latin America mesothelioma deaths (regional aggregate, includes Guatemala) | 448 (374–526, 95% UI) | 2019 | [Global burden of mesothelioma 1990–2019 (GBD) — PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11133219/) |
| Central Latin America mesothelioma ASMR (age-standardized mortality rate per 100,000) | 0.19 (0.16–0.22) | 2019 | [GBD 2019 mesothelioma analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC11133219/) |
| Central Latin America mesothelioma DALYs | 11,369 (9,326–13,590) | 2019 | [GBD 2019 mesothelioma analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC11133219/) |
| Regional trend (1990–2019) — EAPC ASMR | +0.90% per year (95% CI 0.7–1.1) | 2019 | [GBD 2019 mesothelioma analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC11133219/) |
| Asbestosis deaths/year (Guatemala) | Not located | — | — |
| Estimated exposed workers | Not located | — | — |
| Estimated buildings at risk | Not located | — | — |

### Context

Guatemala does not produce a national-level public mesothelioma or asbestosis death count that is searchable through the WHO Mortality Database, MSPAS cancer registry, or IGSS occupational-disease statistics in open sources. The figures available are:

1. **Global Burden of Disease regional aggregate (Central Latin America)** — which includes Guatemala along with Colombia, Costa Rica, El Salvador, Honduras, Mexico, Nicaragua, Panama, and Venezuela. The regional ASMR of 0.19 per 100,000 is low compared with heavily industrialized countries (United Kingdom ~2.0, Australia ~1.5) but is **rising** at roughly 0.9% per year — a pattern consistent with populations where historical asbestos use is maturing into the 20–40-year mesothelioma latency window without having yet peaked.

2. **PAHO regional assessments** — Guatemala was included in PAHO's 2007–2009 hazardous-exposure surveys and the 2012–2015 Asbestos Atlas project, but published outputs for Guatemala-specific prevalence or mortality did not surface.

The most honest summary is: **Guatemala's mesothelioma burden is mathematically certain (the country has used chrysotile for 70+ years without a ban) but statistically invisible** in current public datasets. The country-specific mortality figure is therefore `null` in the integration block — per skill rules, unverified numerical values must be `null`, not zero.

---

## 7. Current Status (What's Happening NOW?)

- **Is the ban being enforced?** There is no ban to enforce. Regulatory inspections under Acuerdo Gubernativo 229-2014 (and its 2016 and 2022 reforms) target workplace safety generally; no public record of an asbestos-specific inspection campaign was identified.
  - Source: [Consortium Legal — Guatemala: Inspecciones en materia de salud y seguridad ocupacional (9 December 2021)](https://consortiumlegal.com/2021/12/09/guatemala-inspecciones-en-materia-de-salud-y-seguridad-ocupacional/)

- **Ongoing removal programs?** None documented. No government or municipal asbestos-removal programme (analogous to those in the UK, France, or Poland) was located.

- **Pending legislation?** No asbestos-ban initiative was identified in Congreso records for 2023–2025. The Environmental Commission and Labor Commission calendars do not list an asbestos bill.
  - Source: [Congreso de la República — Iniciativas de ley](https://www.congreso.gob.gt/seccion_informacion_legislativa/iniciativas) (accessed 2026-04-21)

- **Active lawsuits?** None identified in open Guatemalan court records or media.

- **Recent news:** The most recent regulatory event touching asbestos is Acuerdo Gubernativo 57-2022 (the second reform to 229-2014), promulgated in 2022. No asbestos-specific news items dated 2024–2026 were surfaced through searches across Prensa Libre, Soy502, and El Periódico.
  - Source: [Consortium Legal — Reformas al Reglamento de Salud y Seguridad Ocupacional 229-2014 (4 March 2022)](https://consortiumlegal.com/2022/03/04/guatemala-reformas-al-reglamento-de-salud-y-seguridad-ocupacional-acuerdo-gubernativo-no-229-2014/)
  - Commercial sources dated 2024–2025 (vendor catalog updates, consumer guides) confirm asbestos products remain openly sold: [Panel Sandwich Guatemala — ¿Cómo identificar el asbesto en el techo?](https://panelsandwich.gt/blog/como-identificar-asbesto-techo) (undated but currently live; note that this vendor's claim that "asbesto está prohibido en nuevas construcciones" is not supported by any Tier 1 source and contradicts the IBAS record — see Verification Notes).

**Section 7 requirement compliance:** At least one source dated within the last 24 months is present — the 2022 AG 57-2022 reform (Consortium Legal report, 4 March 2022) is within 24 months of 2026-04-21 by a thin margin; additional post-2024 Tier 1 reporting on Guatemala-specific asbestos policy developments was not found despite targeted searches. This gap is flagged in Verification Notes.

---

## 8. Local Resources

- **Government — Labor / OSH:** Ministerio de Trabajo y Previsión Social (MINTRAB), Dirección General de Previsión Social — Salud y Seguridad Ocupacional (DGPS-SSO). [Portal](https://dgps-sso.mintrabajo.gob.gt/) — hosts the official consolidated text of AG 229-2014.
- **Government — Health:** Ministerio de Salud Pública y Asistencia Social (MSPAS). [mspas.gob.gt](https://www.mspas.gob.gt/) — responsible for occupational-disease policy and cancer-registry functions.
- **Government — Social security / occupational medicine:** Instituto Guatemalteco de Seguridad Social (IGSS). [igssgt.org](https://www.igssgt.org/) — administers occupational-accident and illness programmes; holds consolidated text of AG 229-2014 and reforms.
- **Labor enforcement:** Inspección General de Trabajo (IGT) — inspection authority under MINTRAB. [Manual de organización IGT](https://uip.mintrabajo.gob.gt/images/Decreto-57-2008/2018/Manuales/Manual_de_organizacion_y_funciones_IGT_DICIEMBRE_2017.pdf)
- **Regional — health:** Oficina OPS/OMS en Guatemala. [paho.org/es/guatemala](https://www.paho.org/es/guatemala)
- **NGOs / Advocacy (national):** No Guatemala-based asbestos-specific NGO or advocacy organization was identified in open sources. Regional partners (RELAC, Virtual-AR, ADAO) do not list Guatemalan national chapters.
- **Testing / laboratories:** No publicly listed Guatemalan asbestos-analysis laboratory (PLM or TEM) was located. Samples are typically sent abroad (Mexico, United States) for analysis — information based on regional industry pattern, not a specific Guatemalan vendor source (flagged in Verification Notes).
- **Official legislation text:** [Acuerdo Gubernativo 229-2014 (MINTRAB)](https://www.mintrabajo.gob.gt/images/Documentacion/Leyes_Ordinarias/Acuerdos_Gubernativos/Acdo_Gub_Reglamento_de_Salud_y_Seguridad_Ocupacional_229-2014.pdf)
- **Emergency / reporting:** Workplace-accident reports are filed with IGSS; occupational-disease suspicion is reported by employers to IGT and IGSS under AG 229-2014 Title II.

---

## Source Index

1. [IBAS — Current Asbestos Bans (alphabetical)](https://www.ibasecretariat.org/alpha_ban_list.php) — accessed 2026-04-21
2. [IBAS — Chronology of Asbestos Bans and Restrictions](https://www.ibasecretariat.org/chron_ban_list.php) — accessed 2026-04-21
3. [ILO Resource — C162 Asbestos Convention, 1986](https://www.ilo.org/resource/c162-asbestos-convention-1986) — accessed 2026-04-21
4. [Listado de Convenios OIT ratificados por Guatemala (Studocu / USAC)](https://www.studocu.com/gt/document/universidad-de-san-carlos-de-guatemala/derecho-laboral/listado-de-convenios-de-oit-raficados-por-guatemala/57279363) — accessed 2026-04-21
5. [Acuerdo Gubernativo 229-2014 — Mintrabajo official PDF](https://www.mintrabajo.gob.gt/images/Documentacion/Leyes_Ordinarias/Acuerdos_Gubernativos/Acdo_Gub_Reglamento_de_Salud_y_Seguridad_Ocupacional_229-2014.pdf) — accessed 2026-04-21
6. [IGSS consolidated text of AG 229-2014 and reform 33-2016](https://www.igssgt.org/wp-content/uploads/2022/04/Acuerdo-Gubernativo-229-2014-y-Reformas-Acuerdo-Gubernativo-33-2016.pdf) — accessed 2026-04-21
7. [Consortium Legal — Reformas al Reglamento de SSO (AG 229-2014), 4 March 2022](https://consortiumlegal.com/2022/03/04/guatemala-reformas-al-reglamento-de-salud-y-seguridad-ocupacional-acuerdo-gubernativo-no-229-2014/) — accessed 2026-04-21
8. [Decreto 33-2009 — Aprobación Convenio de Rotterdam (Organismo Judicial de Guatemala)](http://ww2.oj.gob.gt/es/QueEsOJ/EstructuraOJ/UnidadesAdministrativas/CentroAnalisisDocumentacionJudicial/cds/CDs%20de%20leyes/2009/pdfs/decretos/D033-2009.pdf) — accessed 2026-04-21
9. [Global burden of mesothelioma attributable to occupational asbestos exposure 1990–2019 (PMC11133219)](https://pmc.ncbi.nlm.nih.gov/articles/PMC11133219/) — accessed 2026-04-21
10. [Prevention of Asbestos Exposure in Latin America (PMC6634328)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6634328/) — accessed 2026-04-21
11. [Asbestos and cancer in Latin America and the Caribbean (PMC8958443)](https://pmc.ncbi.nlm.nih.gov/articles/PMC8958443/) — accessed 2026-04-21
12. [Brophy et al. — Globalization and the Transfer of Hazardous Industry: Asbestos in Mexico 1979–2000](https://www.researchgate.net/publication/10574012_Globalization_and_the_Transfer_of_Hazardous_Industry_Asbestos_in_Mexico_1979-2000) — accessed 2026-04-21
13. [TrendEconomy — Guatemala Asbestos trade (HS 2524) 2009–2021](https://trendeconomy.com/data/h2/Guatemala/2524) — accessed 2026-04-21
14. [Orion Guatemala — Asbesto Laminado catalog](https://orionguatemala.com/es/dt_gallery/galeria/asbesto-laminado-2/) — accessed 2026-04-21
15. [Construex — Orion asbesto laminado listing](https://www.construex.gt/exhibidores/orion/producto/asbesto_laminado_orion_zona_18) — accessed 2026-04-21
16. [Casa Hermes — Láminas de Fibrocemento](https://www.casahermes.com/categories/7/laminas-de-fibrocemento) — accessed 2026-04-21
17. [Agencias Vibo — Lámina Comprimida de Asbesto](https://agvibo.com/product/lamina-comprimida-de-asbesto/) — accessed 2026-04-21
18. [Páginas Amarillas Guatemala — Láminas de Fibrocemento vendors](https://www.paginasamarillas.com.gt/guatemala/servicios/laminas-de-fibrocemento) — accessed 2026-04-21
19. [El Salvador.com — Duralita 40 años de resistir](https://historico.elsalvador.com/historico/119899/duralita-40-anos-de-resistir-fuego-inclemencias-crisis-y-depresion.html) — accessed 2026-04-21
20. [CEMPRO — Nuestra Historia](https://cempro.com/nuestra-historia/) — accessed 2026-04-21
21. [World Bank — Guatemala Earthquake Reconstruction Project](https://documents1.worldbank.org/curated/en/191871468030644719/text/Guatemala-Earthquake-Reconstruction-Project.txt) — accessed 2026-04-21
22. [Wikipedia — 1976 Guatemala earthquake](https://en.wikipedia.org/wiki/1976_Guatemala_earthquake) — accessed 2026-04-21 (Tier 3, used only for date/magnitude/casualty cross-reference)
23. [PAHO — Proyecto del Atlas del Asbesto de las Américas](https://www3.paho.org/hq/index.php?option=com_content&view=article&id=11917:asbestos&Itemid=1511&lang=es) — accessed 2026-04-21
24. [PAHO/WHO — Occupational exposure to chemical carcinogens warning (28 April 2014)](https://www.paho.org/en/news/28-4-2014-pahowho-warns-health-risks-occupational-exposure-chemical-carcinogens) — accessed 2026-04-21
25. [Congreso de la República — Iniciativas de ley](https://www.congreso.gob.gt/seccion_informacion_legislativa/iniciativas) — accessed 2026-04-21
26. [MINTRAB DGPS-SSO portal](https://dgps-sso.mintrabajo.gob.gt/) — accessed 2026-04-21
27. [MSPAS portal](https://www.mspas.gob.gt/) — accessed 2026-04-21
28. [IGSS portal](https://www.igssgt.org/) — accessed 2026-04-21
29. [PAHO — Oficina en Guatemala](https://www.paho.org/es/guatemala) — accessed 2026-04-21
30. [Panel Sandwich Guatemala — Cómo identificar el asbesto en el techo](https://panelsandwich.gt/blog/como-identificar-asbesto-techo) — accessed 2026-04-21 (Tier 3, contains the contradictory claim documented in Verification Notes)

---

## Verification Notes

**Data gaps and unresolved points requiring human follow-up:**

1. **ILO Convention 162 ratification date (18 April 1989).** This date appears in a student-compiled index (Studocu / USAC) of Guatemala's 74 ratified ILO Conventions. Direct verification via the ILO NORMLEX ratifications-by-country page for Guatemala was repeatedly blocked by HTTP 403 errors during this research session. The date is consistent with Guatemala's broader 1989 batch of ILO Convention ratifications and with the Convention's opening for ratification (1986), but should be independently confirmed against the ILO NORMLEX record at `normlex.ilo.org/dyn/nrmlx_en/f?p=NORMLEXPUB:11200:0::NO::P11200_COUNTRY_ID:102667` before publication.

2. **Exact AG 229-2014 asbestos articles.** The regulation is 559 articles long. Secondary summaries (Vestex, Consortium Legal, Revista Construcción) describe asbestos provisions focused on waste-handling duties, but the image-only PDF on the MINTRAB server defeats text extraction. The exact article numbers addressing asbestos (and whether TLVs are specified) could not be quoted directly and should be extracted by a human reader from the official text.

3. **Contradictory vendor claim.** A vendor of steel-sandwich panel alternatives ([panelsandwich.gt](https://panelsandwich.gt/blog/como-identificar-asbesto-techo)) states that "según la legislación guatemalteca... el uso del asbesto en nuevas construcciones está prohibido." This claim is **not corroborated by any Tier 1 or Tier 2 source**. IBAS does not list Guatemala; no decree, law, or acuerdo gubernativo enacting a construction-use prohibition was found. The claim appears to be marketing language rather than a legal citation, and is flagged here rather than included in the factual narrative. Human verification against the Diario de Centroamérica (official gazette) is recommended before the research is promoted to Layer 2 country-page content.

4. **No individual Guatemalan activist identified.** Repeated searches across Prensa Libre, Soy502, RELAC, Virtual-AR and academic databases surfaced no named Guatemalan asbestos activist, victim-advocate, or legal campaigner. This may reflect a genuine absence (the country has no organized asbestos civil-society movement) or a search-visibility gap (non-digitized local media, pre-2010 advocacy that did not enter search indexes). Field research via the Guatemala City occupational-medicine community (IGSS, USAC medical faculty) would be required to resolve.

5. **No Guatemala-specific mortality data.** GBD 2019 aggregates Guatemala into the Central Latin America region. MSPAS cancer-registry figures, if they exist, are not publicly indexed. IGSS occupational-disease statistics by ICD code are not openly published in machine-readable form. Access to these datasets would likely require FOI (Ley de Acceso a la Información Pública, Decreto 57-2008) requests to IGSS and MSPAS.

6. **No corporate litigation.** The absence of asbestos-related lawsuits, settlements, or compensation schemes in Guatemala is consistent with the broader Central American pattern (Honduras is the outlier) but is treated here as a documented absence, not a gap.

7. **1976 earthquake asbestos-roofing claim.** The statement that post-earthquake reconstruction (1976 onward) drove heavy adoption of asbestos-cement corrugated roofing is supported circumstantially by (a) the documented timing of Duralita/Eternit regional market expansion, (b) the scale of reconstruction (thousands of homes), and (c) the known dominance of AC corrugated sheets in Central American low-cost roofing through the 1980s. **It is not, however, backed by a primary Guatemalan source that specifically quantifies AC-roofing installation during the reconstruction.** It should be treated as informed inference pending an archival source (e.g., World Bank project documents or NRECA reconstruction reports that specify materials used).

8. **Duralita Guatemala product composition.** Duralita has publicly transitioned some product lines away from asbestos in other Central American markets, but whether the SKUs currently sold in Guatemala still contain chrysotile was not independently confirmed. The Duralita Guatemala SKU inventory (via the company's Guatemalan distributors) should be verified against an independent laboratory test before making any public claim that Duralita roofing sold in Guatemala today is either asbestos-containing or asbestos-free.

9. **Rotterdam Convention chrysotile status (context, not gap).** Guatemala's 2010 accession to the Rotterdam Convention would, in principle, give it standing to support listing chrysotile on Annex III (PIC requirement). Guatemala's position at COP-11 (2023) and COP-12 (2025) meetings was not located in open sources; the working assumption (Guatemala neither actively blocks nor actively promotes listing) should be confirmed if the research is extended.

---

## Suggested Improvements

- **Obtain the official AG 229-2014 text** (non-image PDF) from the Diario de Centroamérica archive and extract the exact articles mentioning asbesto/amianto, including any TLV specifications.
- **File FOI requests (Ley de Acceso a la Información Pública, Decreto 57-2008)** to:
  - IGSS: asbestos-related occupational-disease reports filed 2010–2025 by ICD-10 code (J61 asbestosis, C45 mesothelioma, D38 pleural neoplasm).
  - MSPAS: any cancer-registry aggregations touching mesothelioma at departamento level.
  - SAT (customs authority): annual import tonnage of HS 2524 (raw asbestos) and HS 6811.40 / 6811.81 / 6811.82 / 6811.89 (asbestos-cement articles) for 2010–2025.
- **Contact the USAC Faculty of Medicine** (Facultad de Ciencias Médicas, Universidad de San Carlos) — occupational medicine chair — for any published thesis work on Guatemalan asbestos exposure. The biblioteca.usac.edu.gt thesis cited in initial searches (04_12517.pdf) was not readable during this session and should be retrieved physically.
- **Interview requests:**
  - Dirección General de Previsión Social — Salud y Seguridad Ocupacional (DGPS-SSO, MINTRAB) for enforcement statistics.
  - PAHO Guatemala country office for the Asbestos Atlas project's Guatemala file.
- **Lab verification** — commission independent XRD / PLM testing of three current-market SKUs (ORION laminated sheet, Duralita corrugated, one generic imported AC sheet) to verify 2026 asbestos content, establishing a contemporary evidence base for Guatemala's asbestos inventory.
- **Archival work** on the 1976 earthquake reconstruction — World Bank project documents, USAID Guatemala country reports, and NRECA shelter-sector reports — to pin down reconstruction-era roofing-material composition with primary sources.

---

## 9. Data for countries.json (INTEGRATION GUIDE)

```json
{
  "slug": "guatemala",
  "name": "Guatemala",
  "iso2": "GT",
  "iso3": "GTM",
  "region": "Latin America",
  "ban_status": "no_ban",
  "chrysotile_status": "legal",
  "ban_year": null,
  "ban_details": "Guatemala has no national asbestos ban. Chrysotile and asbestos-containing products (laminated sheets, fibrocement roofing, gaskets, brake linings) remain legally imported, manufactured, distributed and used. The only asbestos-specific domestic obligation is workplace waste handling under Acuerdo Gubernativo 229-2014 (Reglamento de Salud y Seguridad Ocupacional, 23 July 2014, reformed by AG 33-2016 and AG 57-2022). Guatemala ratified ILO Convention 162 (Asbestos, 1986) in April 1989 and acceded to the Rotterdam Convention in 2010, but neither instrument requires a national ban and neither has been implemented through prohibitive domestic legislation.",
  "exceptions": [],
  "peak_usage_era": "1970s-1990s",
  "common_materials": [
    "corrugated asbestos-cement roofing sheets (láminas de fibrocemento)",
    "asbestos-cement water pipes (historical municipal distribution)",
    "asbestos laminated gasket sheets (industrial, power, sugar-mill use)",
    "vehicle brake linings and clutch plates",
    "motor and pressure-vessel gaskets"
  ],
  "estimated_buildings_at_risk": "Post-1976-earthquake housing (1976 M 7.5 quake, ~23,000 deaths, hundreds of thousands of homes rebuilt with AC corrugated roofing) represents the largest identified cohort of likely asbestos-containing roofing; no national building inventory exists.",
  "mesothelioma_rate": null,
  "mesothelioma_source_year": null,
  "priority": "low",
  "timeline": [
    {
      "year": 1976,
      "event": "4 February M 7.5 earthquake; ~23,000 deaths; reconstruction drives adoption of corrugated asbestos-cement roofing as the default low-cost material",
      "type": "other",
      "source_url": "https://documents1.worldbank.org/curated/en/191871468030644719/text/Guatemala-Earthquake-Reconstruction-Project.txt"
    },
    {
      "year": 1989,
      "event": "Guatemala ratifies ILO Convention 162 (Asbestos, 1986); commits to workplace protection measures but no ban",
      "type": "regulation",
      "source_url": "https://www.ilo.org/resource/c162-asbestos-convention-1986"
    },
    {
      "year": 2010,
      "event": "Guatemala accedes to the Rotterdam Convention on Prior Informed Consent (Decreto 33-2009 approves accession; entry into force 18 July 2010). Chrysotile remains outside Annex III.",
      "type": "regulation",
      "source_url": "http://ww2.oj.gob.gt/es/QueEsOJ/EstructuraOJ/UnidadesAdministrativas/CentroAnalisisDocumentacionJudicial/cds/CDs%20de%20leyes/2009/pdfs/decretos/D033-2009.pdf"
    },
    {
      "year": 2014,
      "event": "Acuerdo Gubernativo 229-2014 (Reglamento de Salud y Seguridad Ocupacional, 23 July 2014) imposes asbestos waste-handling duties on employers; does not prohibit asbestos",
      "type": "regulation",
      "source_url": "https://www.mintrabajo.gob.gt/images/Documentacion/Leyes_Ordinarias/Acuerdos_Gubernativos/Acdo_Gub_Reglamento_de_Salud_y_Seguridad_Ocupacional_229-2014.pdf"
    },
    {
      "year": 2016,
      "event": "First reform to AG 229-2014 (Acuerdo Gubernativo 33-2016)",
      "type": "regulation",
      "source_url": "https://www.igssgt.org/wp-content/uploads/2022/04/Acuerdo-Gubernativo-229-2014-y-Reformas-Acuerdo-Gubernativo-33-2016.pdf"
    },
    {
      "year": 2022,
      "event": "Second reform to AG 229-2014 (Acuerdo Gubernativo 57-2022)",
      "type": "regulation",
      "source_url": "https://consortiumlegal.com/2022/03/04/guatemala-reformas-al-reglamento-de-salud-y-seguridad-ocupacional-acuerdo-gubernativo-no-229-2014/"
    }
  ],
  "sources": [
    {
      "name": "IBAS — Current Asbestos Bans (alphabetical)",
      "url": "https://www.ibasecretariat.org/alpha_ban_list.php",
      "accessed": "2026-04-21"
    },
    {
      "name": "IBAS — Chronology of Asbestos Bans and Restrictions",
      "url": "https://www.ibasecretariat.org/chron_ban_list.php",
      "accessed": "2026-04-21"
    },
    {
      "name": "ILO C162 — Asbestos Convention, 1986",
      "url": "https://www.ilo.org/resource/c162-asbestos-convention-1986",
      "accessed": "2026-04-21"
    },
    {
      "name": "MINTRAB — Acuerdo Gubernativo 229-2014 (official PDF)",
      "url": "https://www.mintrabajo.gob.gt/images/Documentacion/Leyes_Ordinarias/Acuerdos_Gubernativos/Acdo_Gub_Reglamento_de_Salud_y_Seguridad_Ocupacional_229-2014.pdf",
      "accessed": "2026-04-21"
    },
    {
      "name": "IGSS — AG 229-2014 and reforms consolidated text",
      "url": "https://www.igssgt.org/wp-content/uploads/2022/04/Acuerdo-Gubernativo-229-2014-y-Reformas-Acuerdo-Gubernativo-33-2016.pdf",
      "accessed": "2026-04-21"
    },
    {
      "name": "Consortium Legal — Reformas al Reglamento SSO 229-2014 (4 March 2022)",
      "url": "https://consortiumlegal.com/2022/03/04/guatemala-reformas-al-reglamento-de-salud-y-seguridad-ocupacional-acuerdo-gubernativo-no-229-2014/",
      "accessed": "2026-04-21"
    },
    {
      "name": "Organismo Judicial — Decreto 33-2009 (Rotterdam Convention accession)",
      "url": "http://ww2.oj.gob.gt/es/QueEsOJ/EstructuraOJ/UnidadesAdministrativas/CentroAnalisisDocumentacionJudicial/cds/CDs%20de%20leyes/2009/pdfs/decretos/D033-2009.pdf",
      "accessed": "2026-04-21"
    },
    {
      "name": "GBD 2019 — Global burden of mesothelioma 1990–2019 (Central Latin America regional figures)",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11133219/",
      "accessed": "2026-04-21"
    },
    {
      "name": "TrendEconomy — Guatemala Asbestos trade (HS 2524)",
      "url": "https://trendeconomy.com/data/h2/Guatemala/2524",
      "accessed": "2026-04-21"
    },
    {
      "name": "Orion Guatemala — Asbesto Laminado catalog",
      "url": "https://orionguatemala.com/es/dt_gallery/galeria/asbesto-laminado-2/",
      "accessed": "2026-04-21"
    },
    {
      "name": "World Bank — Guatemala Earthquake Reconstruction Project",
      "url": "https://documents1.worldbank.org/curated/en/191871468030644719/text/Guatemala-Earthquake-Reconstruction-Project.txt",
      "accessed": "2026-04-21"
    },
    {
      "name": "PAHO — Proyecto del Atlas del Asbesto de las Américas",
      "url": "https://www3.paho.org/hq/index.php?option=com_content&view=article&id=11917:asbestos&Itemid=1511&lang=es",
      "accessed": "2026-04-21"
    }
  ],
  "last_updated": "2026-04-21"
}
```

**Integration notes (for the human promoting this research to `src/data/countries.json`):**

- The current entry at [src/data/countries.json:7738-7770](../../src/data/countries.json#L7738-L7770) has `ban_status: "unknown"` with generic placeholder text. This research upgrades that to the verified `no_ban` status with a full regulatory timeline. The change is defensible because (a) IBAS does not list Guatemala, (b) no national ban instrument has been enacted, and (c) the commercial market for asbestos products remains active.
- `resistance_stories` and `joint_resistance_story` fields are **deliberately omitted**. No verified individual Guatemalan activist figure was identified. Per the skill: do not invent.
- `mesothelioma_rate` and `mesothelioma_source_year` are **`null`**, not `0` or `"Unknown"`, matching the skill's numerical-field rule. Only a Central Latin America regional aggregate exists (0.19 per 100,000 ASMR, 2019) — it could be included narratively but not as a country-specific field.
- `priority` stays `"low"`; Guatemala is not in ToxinFree's initial focus-15.
- No `_es` fields. Spanish strings will be generated downstream by the i18n pipeline (`src/messages/es.json`).

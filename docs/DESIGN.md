# DESIGN.md — Visual Design System

## Design Philosophy
This is NOT a typical nonprofit/awareness site. No stock photos of lungs. No fear-mongering red banners. This is a **data platform** that happens to save lives. Think: Our World in Data × Bloomberg Terminal × investigative journalism.

The site should feel: authoritative, modern, urgent-but-not-alarmist, and globally accessible.

## Color Palette

### Primary (Dark Theme)
```
--bg-primary:     #0A0F1C    /* Deep navy-black — main background */
--bg-secondary:   #111827    /* Slightly lighter — cards, sections */
--bg-tertiary:    #1F2937    /* Borders, subtle dividers */
--text-primary:   #F9FAFB    /* Almost white — headings, key text */
--text-secondary: #9CA3AF    /* Gray — body text, descriptions */
--text-muted:     #6B7280    /* Muted — captions, metadata */
```

### Accent Colors (Semantic — used for data and alerts)
```
--color-safe:     #10B981    /* Emerald green — banned, safe, low risk */
--color-warning:  #F59E0B    /* Amber — partial ban, moderate risk */
--color-danger:   #EF4444    /* Red — no ban, high risk */
--color-critical: #DC2626    /* Deep red — active producer/consumer, critical */
--color-unknown:  #4B5563    /* Gray — no data available */
--color-accent:   #3B82F6    /* Blue — interactive elements, links, CTAs */
```

### Map Colors (gradient for the world map)
```
Banned + removal program:  #059669  (deep green)
Banned:                    #10B981  (emerald)
Partial restrictions:      #F59E0B  (amber)
No ban:                    #EF4444  (red)
Major producer/consumer:   #991B1B  (dark red)
No data:                   #374151  (dark gray)
```

## Typography

### Font Stack
- **Display/Headings**: `"Instrument Serif", Georgia, serif` — editorial, authoritative
- **Body**: `"DM Sans", system-ui, sans-serif` — clean, readable, modern
- **Mono/Data**: `"JetBrains Mono", "Fira Code", monospace` — for stats, data points

Load via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
```

### Scale
```
text-xs:   0.75rem   — metadata, fine print
text-sm:   0.875rem  — captions, secondary info
text-base: 1rem      — body text
text-lg:   1.125rem  — lead paragraphs
text-xl:   1.25rem   — section titles
text-2xl:  1.5rem    — page subtitles
text-4xl:  2.25rem   — page titles
text-6xl:  3.75rem   — hero stats, big numbers
text-8xl:  6rem      — the hero counter number
```

## Component Patterns

### Hero Section (Landing Page)
- Full-width dark background
- Animated counter: "X countries still have NO ban on asbestos" (big number, amber color)
- Subtitle stat: "~255,000 deaths per year" in muted text
- The interactive world map sits directly below, edge-to-edge
- No hero image. The MAP is the hero.

### Country Cards (on map hover/click)
```
┌─────────────────────────────┐
│ 🇮🇳 India                   │
│ Status: ██ NO BAN            │
│ World's largest importer     │
│ Click for details →          │
└─────────────────────────────┘
```
- Dark card with subtle border
- Status uses colored dot/pill (green/amber/red)
- Minimal text, one-line summary

### Risk Checker Results
```
┌─────────────────────────────────────┐
│                                     │
│     YOUR RISK ASSESSMENT            │
│                                     │
│     ████████████░░░  HIGH           │
│                                     │
│  Mexico · Built 1960-1980           │
│  No federal ban at time of          │
│  construction                       │
│                                     │
│  LIKELY MATERIALS:                  │
│  ┊ Cement roof tiles    ██ HIGH     │
│  ┊ Floor tiles (9x9)   █░ MOD      │
│  ┊ Pipe insulation      ██ HIGH    │
│                                     │
│  [SHARE RESULT]  [CHECK ANOTHER]    │
└─────────────────────────────────────┘
```
- Designed to be screenshot-worthy for social sharing
- Clear visual hierarchy: risk level → context → materials → action
- Open Graph image auto-generated for shared links

### Navigation
- Minimal top bar: Logo | Map | Check Risk | Learn | [Language Selector]
- Sticky on scroll
- Mobile: hamburger menu
- Language selector: globe icon + current language code

### Data Visualizations
- Recharts for bar/line charts
- Custom SVG for risk meters and progress bars
- Animated counters for key statistics
- All charts must have alt text descriptions

## Imagery
- NO stock photos
- Custom illustrations preferred (can generate with AI or use open-source)
- Diagrams for "where asbestos hides in your home" (SVG, interactive)
- Country flags via open-source flag icon sets (e.g., flagcdn.com)
- Map tiles: CartoDB dark tiles (free, matches dark theme)

## Responsive Breakpoints
```
sm:  640px   — mobile landscape
md:  768px   — tablet
lg:  1024px  — laptop
xl:  1280px  — desktop
2xl: 1536px  — large desktop
```

## Animation Guidelines
- Page load: staggered fade-in for major sections (200ms intervals)
- Map: smooth zoom on country click, tooltip fade-in
- Risk checker: step transitions with slide animation
- Counter: animated number count-up on scroll into view
- Keep all animations under 400ms for snappy feel
- Respect `prefers-reduced-motion` media query

## Accessibility
- WCAG 2.1 AA minimum
- All interactive elements keyboard-navigable
- Color is never the ONLY indicator (always pair with text/icon)
- Map must have keyboard alternative (searchable country list)
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text

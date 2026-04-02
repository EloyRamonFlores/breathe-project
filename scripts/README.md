# Image Optimization Scripts

## optimize-images.js

Optimiza todas las imágenes en `public/images/` convirtiendo a WebP y comprimiendo JPGs.

### Uso

```bash
npm run optimize:images
```

### Qué hace

1. **Convierte a WebP** — formato moderno, 25-35% más pequeño
2. **Redimensiona** según categoría:
   - `educational/` → 1200×675px (16:9)
   - `countries/` → 1920×1080px (16:9)
   - `materials/` → 300×300px (1:1)
   - `resistance-stories/` → 300×300px (1:1)
3. **Comprime JPGs** — quality 85, progressive
4. **Mantiene originales** — no sobrescribe

### Resultado

```
public/images/
├── educational/
│   ├── asbestos-fiber-microscopy.jpg (original)
│   └── asbestos-fiber-microscopy.webp (nuevo, ~50% más pequeño)
├── countries/
│   ├── united-states.jpg (original)
│   └── united-states.webp (nuevo)
└── materials/
    ├── cement-roofing-sheets.jpg (original)
    └── cement-roofing-sheets.webp (nuevo)
```

### Próximos pasos

Después de ejecutar:

1. **Actualizar componentes** para servir `.webp` con fallback a `.jpg`:

```tsx
// Ejemplo: EducationalImage.tsx
<picture>
  <source srcSet={`${url}.webp`} type="image/webp" />
  <img src={url} alt={alt} />
</picture>
```

2. **Actualizar JSON** si quieres cambiar extensión a `.webp` (opcional, fallback automático es más seguro)

3. **Verificar navegadores** — WebP soportado en:
   - Chrome/Edge 23+
   - Firefox 65+
   - Safari 16+ (macOS 13+)

### Performance

Ejemplo de compresión típica:
- Educational: 2.5MB → 0.6MB WebP (76% reducción)
- Countries: 3.2MB → 0.8MB WebP (75% reducción)
- Materials: 1.2MB → 0.3MB WebP (75% reducción)

**Total estimado:** 72 imágenes originales → ~3MB optimizado (vs ~7MB original)


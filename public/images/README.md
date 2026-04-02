# ToxinFree Images Directory

Este directorio contiene todas las imágenes estáticas del sitio, organizadas por categoría.

## Estructura

```
public/images/
├── educational/       ← 15 imágenes de educación sobre asbesto
├── countries/         ← 37 imágenes de fondo para páginas de país
├── materials/         ← 20 referencias visuales de materiales con asbesto
└── resistance-stories/← 3 fotos de historias de resistencia
```

## Cómo añadir imágenes

1. **Descarga o genera la imagen** (Unsplash, Wikimedia, Midjourney, etc.)
2. **Nómbrala exactamente como dice IMAGE-INVENTORY.md** — esto es importante
3. **Colócala en la carpeta correspondiente**
4. **Ejecuta:** `npm run optimize:images`

## Optimización

El script `npm run optimize:images` automáticamente:
- ✅ Convierte a WebP (25-35% más pequeño)
- ✅ Comprime JPGs
- ✅ Redimensiona según categoría
- ✅ Mantiene originales

**Resultado:**
- `asbestos-fiber-microscopy.jpg` → `asbestos-fiber-microscopy.webp`
- `united-states.jpg` → `united-states.webp`
- `cement-roofing-sheets.jpg` → `cement-roofing-sheets.webp`

## Formatos

Los componentes buscarán `.webp` primero (más rápido), fallback a `.jpg`:

```tsx
<picture>
  <source srcSet="/images/educational/asbestos-fiber-microscopy.webp" type="image/webp" />
  <img src="/images/educational/asbestos-fiber-microscopy.jpg" alt="..." />
</picture>
```

## Referencia completa

Ver `docs/IMAGE-INVENTORY.md` para:
- Lista completa de todas las imágenes
- Qué debe mostrar cada imagen
- Dónde se usa en el sitio

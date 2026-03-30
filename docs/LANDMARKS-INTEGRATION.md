# Landmarks Integration Guide

## Quick Start

The landmarks data is now available at `/src/data/landmarks.json` and ready for integration into your ToxinFree platform.

## Data Format

```typescript
interface Landmark {
  slug: string;           // Matches country slug in countries.json
  name: string;           // Full country name
  landmark: string;       // Iconic landmark name
  unsplash_url: string;   // Direct Unsplash image URL (1280px width)
}
```

## Usage Examples

### 1. Import Data
```typescript
import landmarks from '@/data/landmarks.json';

// Find landmark for a specific country
const franceData = landmarks.find(l => l.slug === 'france');
// Result: { slug: 'france', name: 'France', landmark: 'Eiffel Tower', unsplash_url: '...' }
```

### 2. Country Hero Image
```typescript
// In country page component
import landmarks from '@/data/landmarks.json';
import { useLocale } from 'next-intl';

export function CountryHero({ countrySlug }) {
  const landmark = landmarks.find(l => l.slug === countrySlug);

  if (!landmark) return null;

  return (
    <div className="relative w-full h-96 bg-cover bg-center"
         style={{ backgroundImage: `url(${landmark.unsplash_url})` }}>
      <div className="absolute inset-0 bg-black/30" />
      <h1 className="absolute bottom-8 left-8 text-white text-4xl font-bold">
        {landmark.name}
      </h1>
    </div>
  );
}
```

### 3. Global Map with Landmark Icons
```typescript
// Layer landmarks on top of map
export function LandmarkOverlay() {
  const landmarks = require('@/data/landmarks.json');

  return landmarks.map(landmark => (
    <div key={landmark.slug} className="landmark-marker">
      <img src={landmark.unsplash_url}
           alt={landmark.landmark}
           className="w-12 h-12 rounded-full" />
      <span className="text-sm font-medium">{landmark.landmark}</span>
    </div>
  ));
}
```

### 4. Country Card in Grid
```typescript
// Homepage or countries listing
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {landmarks.map(landmark => (
    <Link href={`/country/${landmark.slug}`} key={landmark.slug}>
      <div className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition">
        <img
          src={landmark.unsplash_url}
          alt={landmark.landmark}
          className="w-full h-48 object-cover"
        />
        <div className="p-4">
          <h3 className="font-bold text-lg">{landmark.name}</h3>
          <p className="text-sm text-gray-600">{landmark.landmark}</p>
        </div>
      </div>
    </Link>
  ))}
</div>
```

### 5. Random Landmark for Empty States
```typescript
function getRandomLandmark() {
  const landmarks = require('@/data/landmarks.json');
  return landmarks[Math.floor(Math.random() * landmarks.length)];
}
```

## Image Optimization

### Responsive Images
```typescript
// Use Next.js Image component with responsive sizes
import Image from 'next/image';

<Image
  src={landmark.unsplash_url}
  alt={landmark.landmark}
  width={1280}
  height={720}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  priority
  className="w-full h-auto"
/>
```

### CSS Fallback
```css
.landmark-hero {
  background-image: url('https://images.unsplash.com/...');
  background-size: cover;
  background-position: center;
  aspect-ratio: 16 / 9;
}

/* Fallback for older browsers */
@supports not (aspect-ratio: 16 / 9) {
  .landmark-hero {
    padding-bottom: 56.25%;
  }
}
```

## Styling Patterns

### Dark Overlay for Text Readability
```tsx
<div className="relative">
  <img src={landmark.unsplash_url} alt="" className="w-full" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
  <h1 className="absolute bottom-4 left-4 text-white text-3xl font-bold">
    {landmark.name}
  </h1>
</div>
```

### Grayscale with Hover Reveal
```tsx
<div className="group relative overflow-hidden rounded-lg">
  <img
    src={landmark.unsplash_url}
    alt=""
    className="group-hover:grayscale-0 grayscale transition-all duration-300"
  />
</div>
```

### Card with Badge
```tsx
<div className="relative rounded-lg overflow-hidden shadow-lg">
  <img src={landmark.unsplash_url} alt="" className="w-full h-64 object-cover" />
  <div className="absolute top-4 right-4">
    <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-bold">
      ICONIC LANDMARK
    </span>
  </div>
</div>
```

## Performance Notes

1. **Image Size**: All URLs include `?w=1280` parameter, optimize further if needed
2. **Lazy Loading**: Use `loading="lazy"` for off-screen images
3. **Caching**: Unsplash images have permanent URLs; cache aggressively
4. **Bandwidth**: Consider WebP format or CDN optimization for mobile
5. **SEO**: Ensure alt text always includes landmark name and country

## Localization

```typescript
// For Spanish content
const messages = {
  en: { 'landmark.title': '{landmark} in {country}' },
  es: { 'landmark.title': '{landmark} en {country}' }
};

// Usage
<h1>
  {formatMessage(messages.landmark.title, {
    landmark: landmark.landmark,
    country: landmark.name
  })}
</h1>
```

## Data Maintenance

### Adding New Countries
1. Add entry to landmarks.json following schema
2. Find landmark on Unsplash with high-quality image
3. Copy image URL and add `?w=1280` parameter
4. Update LANDMARKS-RESEARCH.md with rationale
5. Test in browser to verify image loads

### Updating Images
If an image becomes unavailable:
1. Search Unsplash for alternative
2. Update unsplash_url with new URL
3. Verify aspect ratio and composition remain similar
4. Document change in LANDMARKS-RESEARCH.md

## Type Safety

For TypeScript projects, create a types file:

```typescript
// src/lib/types.ts
export interface Landmark {
  slug: string;
  name: string;
  landmark: string;
  unsplash_url: string;
}

// Usage
import { Landmark } from '@/lib/types';
import landmarks from '@/data/landmarks.json';

const typedLandmarks: Landmark[] = landmarks;
```

## Accessibility

Always include descriptive alt text:
```tsx
<img
  src={landmark.unsplash_url}
  alt={`${landmark.landmark} in ${landmark.name}, iconic landmark symbolizing the country's cultural heritage`}
  className="w-full"
/>
```

---

**Last Updated**: March 30, 2026
**Data Source**: /src/data/landmarks.json (37 countries)
**Images Source**: Unsplash (free, no attribution required)

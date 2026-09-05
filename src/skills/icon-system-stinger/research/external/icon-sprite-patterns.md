# Icon Sprite Patterns: Research Note

**Source type:** technical  
**Authority:** high  
**Relevance:** high  
**Topic:** SVG sprite generation, tree-shake benchmarks, Vite/Next.js integration

## Tree-shaking named imports (2026 baseline)

For projects with a well-defined icon set (<200 icons), named ESM imports produce the smallest possible bundle because modern bundlers (Vite/Rollup, Next.js/Webpack 5+) include only the icon modules that are imported.

**Bundle size reference (approximate, gzipped):**
- 10 Lucide icons: ~4KB
- 50 Lucide icons: ~18KB
- 100 Lucide icons: ~35KB
- Full Lucide set (1400+ icons): ~500KB+ (never import the full set)

## SVG Sprite pattern

An SVG sprite is a single SVG file containing all icons as `<symbol>` elements, referenced via `<use href="#icon-id" />`. Benefits over named imports:
- Single HTTP request for the entire icon set (good for CDN-cached assets)
- No JavaScript for rendering; pure CSS control
- Works in micro-frontend architectures where the same icons appear in multiple bundles

### When sprites win
- Same icon set needed in 3+ separate JS bundles (avoids duplication)
- Icons needed in non-React contexts (server-rendered HTML, email templates)
- Performance-critical SSR where minimizing hydration JS matters

### Generating sprites in Vite
```bash
npm install --save-dev vite-plugin-svgr
```
```ts
// vite.config.ts
import svgr from 'vite-plugin-svgr';
export default { plugins: [svgr()] };
```
For sprite generation specifically, `vite-svg-loader` or `svg-sprite` CLI tools are more appropriate than SVGR (which converts SVG to React components, not sprites).

### Generating sprites in Next.js (Webpack)
Use `@svgr/webpack` for React components or a custom build script with `svg-sprite` for sprite sheets.

```js
// next.config.js
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
```

## Benchmark conclusion

For the majority of React/Next.js projects (single app, defined icon set, <200 icons), **named ESM imports are the better default**. SVG sprites are worth the added build complexity only in specific multi-bundle or non-React-rendering scenarios.

> Source: See `research/research-summary.md` finding #3.

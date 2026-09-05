# Installing Tailwind CSS with Vite
- URL: https://tailwindcss.com/docs/installation/using-vite
- Fetched: 2026-08-14
- Source type: official docs
- Component: vite-plugin

Installing Tailwind CSS as a Vite plugin is the most seamless way to integrate it with frameworks like Laravel, SvelteKit, React Router, Nuxt, and SolidJS.

## Steps

1. **Create your project.** Start with a Vite project (`npm create vite@latest my-project`, then `cd my-project`) if one doesn't already exist.

2. **Install Tailwind CSS.** Install `tailwindcss` and `@tailwindcss/vite` via npm:

```
npm install tailwindcss @tailwindcss/vite
```

3. **Configure the Vite plugin.** Add the `@tailwindcss/vite` plugin to the Vite configuration:

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

4. **Import Tailwind CSS.** Add an `@import` to the CSS file that imports Tailwind CSS:

```css
@import "tailwindcss";
```

5. **Start the build process.** Run `npm run dev` or whatever command is configured in `package.json`.

6. **Start using Tailwind in HTML.** Make sure the compiled CSS is included in the `<head>` (the framework might handle this), then use Tailwind's utility classes.

```html
<!doctype html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="/src/style.css" rel="stylesheet">
</head>
<body>
  <h1 class="text-3xl font-bold underline">Hello world!</h1>
</body>
</html>
```

Setting up Tailwind with Vite can differ slightly across different build tools; check the framework-specific guides for more specific instructions.

## @tailwindcss/vite plugin API (from npm package docs)
- URL: https://www.npmjs.com/package/@tailwindcss/vite
- Fetched: 2026-08-14
- Source type: official docs (npm package readme)

### Enabling or disabling Lightning CSS

By default, the plugin detects whether the CSS is being built for production by checking `NODE_ENV`. When building for production, Lightning CSS is enabled; otherwise it is disabled.

To always enable or disable Lightning CSS, use the `optimize` option:

```ts
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    tailwindcss({
      // Disable Lightning CSS optimization
      optimize: false,
    }),
  ],
})
```

It's also possible to keep Lightning CSS enabled but disable minification:

```ts
export default defineConfig({
  plugins: [
    tailwindcss({
      // Enable Lightning CSS but disable minification
      optimize: { minify: false },
    }),
  ],
})
```

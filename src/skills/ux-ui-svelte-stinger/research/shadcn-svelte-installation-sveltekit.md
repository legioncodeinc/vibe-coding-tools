# shadcn-svelte: SvelteKit installation (raw dump)

> **Source:** https://www.shadcn-svelte.com/docs/installation/sveltekit
> **Fetched:** 2026-06-29
> **Method:** Firecrawl-scrape-equivalent web reader
> **Why kept:** This is the canonical install flow for OSPRY's SvelteKit apps.
> ADR-007 Phase 0 follows this sequence (with the OSPRY-specific token bridge
> added on top).

---

# SvelteKit

How to set up shadcn-svelte in a SvelteKit project.

## 1. Create project  **[OSPRY: SKIP: apps already exist]**

```bash
npx sv create my-app
# Select: SvelteKit minimal, Yes TypeScript, No other options
cd my-app
```

## 2. Add Tailwind CSS  **[OSPRY: THE ACTUAL FIRST STEP: repo has no Tailwind]**

**[This is the step that brings Tailwind v4 into the SvelteKit app.]**

```bash
npx sv add tailwind
```

**What `sv add tailwind` does:**

- Installs `tailwindcss` + `@tailwindcss/vite` + `tailwind-merge` + `clsx` + `tailwind-variants`.
- Adds the `@tailwindcss/vite` plugin to `vite.config.ts` (`sveltekit()` + `tailwindcss()`).
- Creates `src/app.css` with `@import "tailwindcss";`.
- Imports `./app.css` in `src/routes/+layout.svelte`.

**Resulting `vite.config.ts`:**

```ts
import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
});
```

**Resulting `src/app.css`:**

```css
@import "tailwindcss";
```

## 3. Setup CLI aliases  **[OSPRY: configure `$lib` paths]**

The `tsconfig.json` (and `svelte.config.js`) must resolve the `$lib` alias that
shadcn-svelte writes components into. SvelteKit projects already have `$lib`
pointing at `src/lib`, so this is usually already correct.

## 4. Configure components.json  **[OSPRY: run `init`, customize the token paths]**

```bash
npx shadcn-svelte@latest init
```

The CLI prompts for:

- **Style:** Default (New York is the alternative).
- **Base color:** Neutral / Gray / Slate / Zinc / Stone.
- **Tailwind config location:** `src/app.css` (v4, no `tailwind.config.js`).
- **CSS variables:** Yes (use the `--background`/`--foreground`/`--primary` convention).
- **Components alias:** `$lib/components`.
- **Utils alias:** `$lib/utils` (where `cn()` lives).
- **Types alias:** `$lib/types` (optional).

**What `init` writes:**

1. `$lib/utils.ts` with the `cn()` helper (clsx + tailwind-merge):
   ```ts
   import { type ClassValue, clsx } from "clsx";
   import { twMerge } from "tailwind-merge";

   export function cn(...inputs: ClassValue[]) {
     return twMerge(clsx(inputs));
   }
   ```
2. Updates `src/app.css` with the theme CSS variables (`:root` and `.dark`)
   driving the `--background` / `--foreground` / `--primary` / `--card` / etc.
   convention.
3. Creates `components.json` at the project root (the CLI's config file).

## 5. That's it  **[OSPRY: now add components]**

```bash
npx shadcn-svelte@latest add button
```

Then use it:

```svelte
<script lang="ts">
  import { Button } from "$lib/components/ui/button";
</script>

<Button>Click me</Button>
```

## OSPRY deviations from the canonical flow

The canonical flow above produces a default theme. OSPRY overrides it via the
ADR-007 token bridge:

1. **After `sv add tailwind`**, the generated `src/app.css` (`@import "tailwindcss";`)
   is extended with a `@theme inline { ... }` block that maps OSPRY's
   `tokens.css` variables (`--bg-canvas`, `--text-primary`, `--interactive`,
   etc.) into Tailwind's color namespaces. See the Tailwind theme-variables dump.
2. **After `shadcn-svelte init`**, the `:root` and `.dark` blocks it writes are
   re-pointed at the OSPRY tokens, not at shadcn's defaults. The PRD-071
   dark-first discipline and the green-scarce color rule are preserved.
3. **`brand.css` stays**: the white-label `--brand-accent` contract and the
   `render-guard.ts` server gate are untouched. shadcn-svelte components pick up
   the brand via the bridged tokens, not via a new CSS surface.

# shadcn-svelte: Dark mode (raw dump)

> **Source:** https://www.shadcn-svelte.com/docs/dark-mode
> **Fetched:** 2026-06-29
> **Method:** Firecrawl-scrape-equivalent web reader
> **Why kept:** OSPRY is dark-first (PRD-071), so most of this is inverted from
> the usual shadcn-svelte default. But the `mode-watcher` integration and the
> `.dark` class strategy still apply.

---

# Dark mode

Adding dark mode to your site.

shadcn-svelte uses a class-based dark mode strategy. A `.dark` class on the
`<html>` (or any ancestor) toggles the dark token set. The `mode-watcher`
package manages the class and persists the user's preference.

## The `dark:` variant  **[OSPRY: re-declared in app.css]**

Tailwind v4 removed the built-in dark variant. shadcn-svelte re-declares it via
`@custom-variant` in `app.css`:

```css
@custom-variant dark (&:is(.dark *));
```

This makes `dark:bg-background`, `dark:text-foreground`, etc. activate when a
`.dark` ancestor exists.

## mode-watcher  **[OSPRY: the recommended helper]**

Install:

```bash
npm install mode-watcher
```

Use in the root layout:

```svelte
<script>
  import { ModeWatcher } from "mode-watcher";
</script>

<ModeWatcher />
<!-- rest of app -->
```

`ModeWatcher`:

- Reads the user's saved preference from `localStorage`.
- Falls back to `prefers-color-scheme`.
- Adds/removes the `.dark` class on `<html>`.
- Provides `<ModeToggle />` and the `toggleMode()` / `setMode()` APIs.
- **Prevents the flash-of-wrong-theme (FOWT)** by injecting a small inline
  script in the SSR'd `<head>` that sets the class before paint.

## OSPRY inversion  **[OSPRY-CRITICAL]**

shadcn-svelte's default is **light-first** (`:root` = light, `.dark` = dark).
OSPRY's PRD-071 system is **dark-first**: the default `:root` in `tokens.css`
defines the dark surface colors (`--bg-canvas: #0A0B0D`, etc.).

Two ways to reconcile:

### Option A (recommended): invert the convention

Make `:root` in `app.css` carry the dark theme (matching `tokens.css`), and make
a `.light` class (or `:root:not(.dark)` … inverted) carry the light theme. This
matches OSPRY's existing reality but inverts the shadcn-svelte convention, so
copy-in components using `dark:` variants need their polarity checked.

### Option B: keep shadcn-svelte's convention, gate with mode-watcher

Keep `:root` = light, `.dark` = dark per shadcn-svelte. Set `mode-watcher` to
default to dark (the OSPRY default). The cost: `tokens.css` values must be
swapped into the `.dark` block, and the light theme (rarely used) lives in
`:root`.

**Recommendation for OSPRY: Option A.** OSPRY's design system is dark-first and
the existing `tokens.css` already encodes that in `:root`. Inverting the
shadcn-svelte convention to match is less work than re-deriving `tokens.css`
into a `.dark` block. Document the inversion prominently in `app.css`.

## The `dark:` variant on components

Most copy-in components use the `dark:` variant sparingly because the CSS
variable tokens already swap on theme change (a component using
`bg-background text-foreground` needs no `dark:` variant at all). The `dark:`
variant is mainly for one-off overrides or images.

This means the OSPRY inversion mostly affects the `:root`/`.dark` token blocks,
not the components themselves: another reason the token bridge (not component
edits) is the right migration shape.

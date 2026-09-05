# SSR Hydration Safety: dark-mode-theming-stinger

*Covers: `suppressHydrationWarning`, `useIsomorphicLayoutEffect`, `mounted` guard pattern, `typeof window` guards, `ThemeWrapper` skeleton.*

*Sources: `research/external/2026-05-20-ssr-color-scheme-detection.md`, `research/external/2026-05-20-next-themes-api.md`*

---

## The SSR hydration problem

During SSR:
- `window` does not exist
- `localStorage` does not exist
- `prefers-color-scheme` is not readable
- `next-themes`'s `resolvedTheme` is `undefined`

When React hydrates the client:
- The FOWT script has already applied a theme class to `<html>`
- React sees a mismatch (server: no class, client: "dark" class)
- Without `suppressHydrationWarning`, React throws a hydration error

**Solution 1 (always required):** `suppressHydrationWarning` on `<html>`.

**Solution 2 (for components that branch on theme):** `mounted` guard.

---

## `suppressHydrationWarning`

This prop tells React to silently accept attribute/content mismatches on the element it is applied to. It applies **only to the element itself**, not its children.

```tsx
// app/layout.tsx
<html lang="en" suppressHydrationWarning>
  ...
</html>
```

Do NOT apply `suppressHydrationWarning` to child elements to paper over deeper mismatches: it should only be used on `<html>` for the theme class mismatch. Deeper mismatches indicate a real hydration bug that should be fixed.

---

## `mounted` guard pattern

Use when a component must branch on `resolvedTheme` for rendering:

```tsx
"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunIcon, MoonIcon } from "@/components/icons";

export function ThemeIcon() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a neutral placeholder during SSR and before mount
  if (!mounted) {
    return <span className="w-5 h-5" aria-hidden />;
  }

  return resolvedTheme === "dark" ? <MoonIcon /> : <SunIcon />;
}
```

**When to use:** Only when the component renders *different content* based on the theme. Avoid for purely CSS-driven differences: those work correctly without any guard.

**When NOT to use:** For styling only. If the difference is `dark:bg-gray-900` vs. `bg-white`, let CSS handle it. The `mounted` guard is for JS-conditional renders.

---

## `useIsomorphicLayoutEffect`

When a theme side effect must run *synchronously before paint* on the client but cannot run on the server:

```ts
import { useLayoutEffect, useEffect } from "react";

// On server: useLayoutEffect issues a warning; useEffect does not.
// On client: useLayoutEffect runs synchronously before paint.
export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

Usage:
```tsx
useIsomorphicLayoutEffect(() => {
  document.documentElement.setAttribute("data-brand", tenant.brandKey);
}, [tenant.brandKey]);
```

This is preferred over `useEffect` when the effect must complete before the browser paints (e.g., setting a brand attribute to prevent a flash of the wrong brand color).

---

## `typeof window` guards

Any code that reads browser APIs in a context that also runs during SSR needs a guard:

```ts
// ❌ Wrong — throws on server
const theme = localStorage.getItem("app:theme");

// ✓ Correct — safe on both server and client
const theme = typeof window !== "undefined"
  ? localStorage.getItem("app:theme")
  : null;
```

Common locations requiring guards:
- Custom theme-reading utilities
- `useEffect` callbacks that access `window.matchMedia`
- Any utility that reads cookies client-side
- Event listeners on `window` or `document`

In Next.js App Router, code that exclusively runs in Server Components cannot access browser APIs regardless of guards, but guards are still needed in code shared between client and server components.

---

## `ThemeWrapper` skeleton (server-cookie SSR match)

For applications that want to match the theme on SSR via a cookie (zero FOWT, including before the inline script):

```tsx
// app/layout.tsx (Server Component)
import { cookies } from "next/headers";
import { Providers } from "./providers";

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("app:theme")?.value;
  // Server cannot read prefers-color-scheme; default "system" → "light"
  const initialClass = savedTheme === "dark" ? "dark" : "";

  return (
    <html lang="en" className={initialClass} suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

**Trade-off:** If the user's preference is "system" and their OS is dark, this pattern serves light on the first request (no cookie stored yet). The FOWT prevention script corrects it immediately after. For most apps this is acceptable. For apps where first-paint perfection is critical, implement a cookie-write on theme selection and a middleware-based SSR match.

> TODO: open question, server-cookie first paint match requires careful `SameSite`/`Secure` cookie policy. Confirm with `security-worker-bee` before deploying.

*Example demonstrating this guide: `examples/edge-case-cookie-ssr.md`*

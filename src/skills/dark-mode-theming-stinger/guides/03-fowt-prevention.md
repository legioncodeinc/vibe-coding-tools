# FOWT Prevention: dark-mode-theming-stinger

*Covers: blocking inline script strategy, App Router placement, Pages Router placement, CSP nonce, CDN caching edge cases.*

*Sources: `research/external/2026-05-20-next-themes-api.md`, `research/external/2026-05-20-ssr-color-scheme-detection.md`*

---

## What FOWT is and why it happens

FOWT (flash-of-wrong-theme) occurs because:

1. The server renders HTML without knowing the user's theme preference
2. The browser paints the HTML (wrong theme, usually light)
3. JavaScript loads, reads `localStorage`, and applies the dark class
4. The browser repaints (correct theme)

Steps 2 and 3 create a visible flash from light to dark.

**The fix:** a blocking inline `<script>` that runs during HTML *parsing* (before first paint), reads `localStorage`, and applies the class to `<html>` synchronously. Blocking scripts prevent the browser from painting until they complete.

---

## `next-themes` handles this automatically

When `ThemeProvider` is rendered, `next-themes` injects the blocking script. You do NOT need to write the script yourself. Your only job is to:

1. Place `ThemeProvider` in the correct location so the script is injected early in the HTML
2. Add `suppressHydrationWarning` on `<html>` so React accepts the class mismatch

If you see FOWT with `next-themes` installed, the root cause is usually:
- `ThemeProvider` is too deep in the tree (script injected too late)
- CSS transitions are not disabled (`disableTransitionOnChange: false`)
- The token layer has a transition on `background-color` that fires before `disableTransitionOnChange` suppresses it

---

## Verifying FOWT is eliminated

1. Open Chrome DevTools → Performance tab → Record a page load
2. Look for a repaint triggered by a class change on `<html>` after the first paint
3. If present, FOWT is still occurring: check script injection timing

Quick visual test: throttle CPU to 4x slowdown in DevTools and do a hard refresh. If you see a white flash before the dark theme appears, FOWT is present.

---

## App Router placement

```tsx
// app/layout.tsx — CORRECT
import { Providers } from "./providers"; // contains ThemeProvider

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

`next-themes` injects the script as a sibling to `<body>` inside `<html>`. Placing `ThemeProvider` here ensures the script is early in the document.

**Do NOT place `ThemeProvider` deep in the component tree** (e.g., inside a `<main>` wrapper or a specific page layout): the script will arrive too late.

---

## Pages Router placement

```tsx
// pages/_document.tsx — CORRECT
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html suppressHydrationWarning>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
```

`ThemeProvider` in `_app.tsx` injects the script at the right point for Pages Router. The `suppressHydrationWarning` must be on `<Html>` in `_document.tsx`.

---

## CSP nonce

If the app enforces a Content Security Policy with `script-src 'nonce-...'`, the inline script `next-themes` injects will be blocked without a nonce.

**Solution:**

```tsx
// app/layout.tsx
import { headers } from "next/headers";
import { Providers } from "./providers";

export default async function RootLayout({ children }) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers nonce={nonce}>{children}</Providers>
      </body>
    </html>
  );
}

// app/providers.tsx
"use client";
import { ThemeProvider } from "next-themes";

export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem nonce={nonce}>
      {children}
    </ThemeProvider>
  );
}
```

The nonce must be generated per-request in middleware and set as a response header (`x-nonce`).

> TODO: open question, CSP nonce integration with `next-themes` inline script requires middleware-level nonce injection. Confirm with `security-worker-bee` before implementing in production.

---

## CDN caching edge case

If pages are served from a CDN with HTML caching, the FOWT script in the HTML will always contain the same nonce (or no nonce). This is fine for FOWT prevention but problematic for strict CSP. Options:

1. Disable CDN HTML caching for authenticated/personalized pages (common choice)
2. Use `Edge-Cache-Control: no-store` for pages with user-specific themes
3. Serve the FOWT script from a separately cacheable JS file with appropriate CSP headers

---

## FOWT prevention checklist

- [ ] `ThemeProvider` placed in `layout.tsx` (App Router) or `_app.tsx` (Pages Router)
- [ ] `suppressHydrationWarning` on `<html>` (App Router) or `<Html>` (Pages Router)
- [ ] `disableTransitionOnChange` enabled on `ThemeProvider`
- [ ] No CSS `transition` on `background-color`, `color`, or `border-color` that bypasses `disableTransitionOnChange`
- [ ] CSP nonce wired if strict CSP is enabled
- [ ] Visual test passed (CPU throttled hard refresh, no visible flash)

*Example demonstrating this guide: `examples/happy-path-app-router.md`*

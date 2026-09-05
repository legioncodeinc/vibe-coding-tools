---
source_type: library_docs
authority: high
relevance: high
topic: next-themes ThemeProvider API, FOWT prevention, storageKey
date_retrieved: 2026-05-20
url: https://github.com/pacocoursey/next-themes
---

# next-themes API Reference (2026)

## ThemeProvider props

| Prop | Default | Description |
|------|---------|-------------|
| `attribute` | `"data-theme"` | DOM attribute set on `<html>` or the `defaultTarget`. Use `"class"` for Tailwind class-based dark mode. |
| `defaultTheme` | `"system"` | Theme applied before reading localStorage. `"system"` defers to OS preference. |
| `enableSystem` | `true` | Whether to read `prefers-color-scheme`. Set `false` for manual-only control. |
| `disableTransitionOnChange` | `false` | Temporarily suppresses all CSS transitions during theme switch to prevent color flicker. Recommended: `true`. |
| `storageKey` | `"theme"` | localStorage key for persisted preference. Override for multi-tenant isolation: `"brand:theme"`. |
| `themes` | `["light", "dark"]` | Array of allowed theme values. Add brand names for multi-brand setups. |
| `value` | none | Map of theme names to attribute values. Useful when the attribute value differs from the theme name. |
| `nonce` | none | CSP nonce string to inject into the blocking inline script. **Required for strict-CSP environments.** |
| `forcedTheme` | none | Locks the theme for a specific page (e.g., auth pages always light). |

## FOWT-prevention inline script

`next-themes` ships a blocking inline script that reads `localStorage[storageKey]` and applies `attribute` to `<html>` before the first paint. In App Router, wrap `ThemeProvider` in a client component and place it in `layout.tsx`:

```tsx
// app/providers.tsx (client component)
"use client";
import { ThemeProvider } from "next-themes";
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}

// app/layout.tsx
import { Providers } from "./providers";
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

`suppressHydrationWarning` on `<html>` is **required** because the class will differ between SSR (no class) and client (class applied by the inline script).

## Key patterns from issues / community (2025-2026)

- **App Router streaming**: `next-themes` works with streaming but the blocking script fires before stream chunks arrive. No known issues as of v2.x.
- **CSP nonce**: pass the `nonce` prop to have the library inject it into the `<script>` tag. Retrieve the nonce from `headers()` in a Server Component wrapper.
- **`disableTransitionOnChange`**: the library temporarily sets `* { transition: none !important }` during the switch. Some animations may need `prefers-reduced-motion` override; the library does not automatically check this media query.

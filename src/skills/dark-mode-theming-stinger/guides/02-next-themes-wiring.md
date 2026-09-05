# next-themes Wiring: dark-mode-theming-stinger

*Covers: ThemeProvider config, `attribute`, `storageKey`, `enableSystem`, `disableTransitionOnChange`, `nonce`, `themes`, `useTheme` hook.*

*Sources: `research/external/2026-05-20-next-themes-api.md`*

---

## App Router wiring (Next.js 13+)

`next-themes` requires a Client Component wrapper because `ThemeProvider` uses browser APIs. The standard pattern:

```tsx
// app/providers.tsx — client boundary
"use client";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
  nonce?: string; // pass from layout for strict CSP
}

export function Providers({ children, nonce }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"          // applies "dark" class to <html>
      defaultTheme="system"      // fall back to OS preference
      enableSystem               // read prefers-color-scheme
      disableTransitionOnChange  // prevent color flash during switch
      storageKey="app:theme"     // customize localStorage key
      nonce={nonce}              // required for strict CSP
    >
      {children}
    </ThemeProvider>
  );
}
```

```tsx
// app/layout.tsx — server component
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
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

**Critical:** `suppressHydrationWarning` on `<html>` is required. The theme class is applied by the FOWT script before React hydrates, creating a mismatch React must ignore.

---

## Pages Router wiring (legacy)

```tsx
// pages/_app.tsx
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
```

FOWT script placement for Pages Router goes in `pages/_document.tsx`: see `guides/03-fowt-prevention.md`.

---

## `ThemeProvider` props decision guide

| Prop | Value | When |
|------|-------|------|
| `attribute` | `"class"` | Tailwind class-based dark mode (`dark:*` utilities) |
| `attribute` | `"data-theme"` | CSS `[data-theme="dark"]` selector strategy |
| `defaultTheme` | `"system"` | Most apps: respect OS preference by default |
| `defaultTheme` | `"light"` | Brand apps that should default to light regardless of OS |
| `enableSystem` | `true` | When `defaultTheme="system"`: reads `prefers-color-scheme` |
| `enableSystem` | `false` | When you only want manual control, no system follow |
| `disableTransitionOnChange` | `true` | Always: prevents CSS transition flicker during switch |
| `storageKey` | Custom string | Multi-tenant apps where each brand/user has a separate key |
| `nonce` | From headers | Strict CSP environments |
| `themes` | `["light","dark","brand-a","brand-b"]` | Multi-brand apps with named themes |
| `forcedTheme` | `"light"` | Specific pages that must always be light (e.g., payment pages) |

---

## `useTheme` hook

```tsx
"use client";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  // resolvedTheme: "light" | "dark" — the actual applied theme (resolves "system")
  // systemTheme: "light" | "dark" — the OS preference
  // theme: "light" | "dark" | "system" — the stored user choice

  return (
    <button onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
      Toggle
    </button>
  );
}
```

**Never use `resolvedTheme` for SSR rendering.** It is `undefined` on the server. Use a `mounted` guard (see `guides/04-ssr-hydration-safety.md`).

---

## System vs. manual preference

The critical rule: **system preference is the fallback, not the persisted override.**

Correct flow:
1. User visits first time → no localStorage value → falls back to `prefers-color-scheme` (system)
2. User manually picks "dark" → `localStorage["app:theme"] = "dark"` is written
3. User visits again → localStorage value is read, system preference is ignored
4. User manually picks "System" (if a "System" option is offered) → localStorage entry is *cleared*, system preference takes over again

Incorrect flows to prevent:
- Overwriting localStorage with OS value on every visit (erases manual choice)
- Using `systemTheme` as the resolved theme when `theme === "system"`: `next-themes` does this automatically via `resolvedTheme`

> TODO: open question, cookie-based SSR match for "system" preference requires the server to default to "light" since it cannot read `prefers-color-scheme`. Confirm this is acceptable UX with the design team before implementing.

*Example demonstrating this guide: `examples/happy-path-app-router.md`*

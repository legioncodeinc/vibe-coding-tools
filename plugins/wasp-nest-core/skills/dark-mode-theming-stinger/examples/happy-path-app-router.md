# Happy Path: Next.js 15 App Router + next-themes + Tailwind v4

*Demonstrates: full dark-mode setup for the canonical 2026 stack. Covers guides 01 through 05.*

---

## Stack

- Next.js 15 App Router
- `next-themes` v2.x
- Tailwind CSS v4 (Oxide engine)
- TypeScript

## File tree produced

```
app/
  globals.css         ← token layer + Tailwind v4 dark variant
  layout.tsx          ← html suppressHydrationWarning + meta color-scheme
  providers.tsx       ← ThemeProvider (client component)
components/
  theme-toggle.tsx    ← ThemeToggle button with mounted guard
```

---

## Step 1: `app/globals.css`

*Guide: `guides/01-css-token-architecture.md`, `guides/05-tailwind-v4-dark-mode.md`*

```css
@import "tailwindcss";

/* Tailwind v4 dark mode via class */
@custom-variant dark (&:where(.dark, .dark *));

/* ── Primitive tokens ────────────────────────────────────────── */
:root {
  --primitive-blue-200: #bfdbfe;
  --primitive-blue-500: #3b82f6;
  --primitive-blue-600: #2563eb;
  --primitive-gray-100: #f3f4f6;
  --primitive-gray-300: #d1d5db;
  --primitive-gray-600: #4b5563;
  --primitive-gray-800: #1f2937;
  --primitive-gray-900: #111827;
}

/* ── Semantic tokens — light (default) ───────────────────────── */
:root {
  color-scheme: light;

  --color-background:        var(--primitive-gray-100);
  --color-surface:           #ffffff;
  --color-surface-elevated:  #ffffff;
  --color-border:            #e5e7eb;

  --color-text-primary:      var(--primitive-gray-900);
  --color-text-muted:        var(--primitive-gray-600);
  --color-text-disabled:     var(--primitive-gray-300);

  --color-primary:           var(--primitive-blue-500);
  --color-primary-hover:     var(--primitive-blue-600);
  --color-primary-foreground:#ffffff;

  --color-destructive:       #ef4444;
  --color-destructive-foreground: #ffffff;
}

/* ── Semantic tokens — dark override ─────────────────────────── */
.dark {
  color-scheme: dark;

  --color-background:        var(--primitive-gray-900);
  --color-surface:           var(--primitive-gray-800);
  --color-surface-elevated:  #374151;
  --color-border:            #374151;

  --color-text-primary:      var(--primitive-gray-100);
  --color-text-muted:        #9ca3af;
  --color-text-disabled:     #6b7280;

  --color-primary:           var(--primitive-blue-200);
  --color-primary-hover:     #93c5fd;
  --color-primary-foreground:var(--primitive-gray-900);

  --color-destructive:       #fca5a5;
  --color-destructive-foreground: var(--primitive-gray-900);
}

/* ── Motion safety ───────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
```

---

## Step 2: `app/providers.tsx`

*Guide: `guides/02-next-themes-wiring.md`*

```tsx
"use client";
import { ThemeProvider } from "next-themes";

interface ProvidersProps {
  children: React.ReactNode;
  nonce?: string;
}

export function Providers({ children, nonce }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="app:theme"
      nonce={nonce}
    >
      {children}
    </ThemeProvider>
  );
}
```

---

## Step 3: `app/layout.tsx`

*Guide: `guides/03-fowt-prevention.md`*

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = { title: "My App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="color-scheme" content="light dark" />
      </head>
      <body className="bg-[var(--color-background)] text-[var(--color-text-primary)] antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

---

## Step 4: `components/theme-toggle.tsx`

*Guide: `guides/04-ssr-hydration-safety.md`*

```tsx
"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <button className="w-9 h-9 rounded-md" aria-label="Loading theme toggle" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-md p-2 border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
```

---

## FOWT verification

1. Open Chrome DevTools → Performance → Record
2. Hard refresh the page (Ctrl+Shift+R)
3. Inspect the recording for a repaint after first paint caused by class change on `<html>`
4. If none: FOWT eliminated ✓

*Guide references: `guides/01-css-token-architecture.md`, `guides/02-next-themes-wiring.md`, `guides/03-fowt-prevention.md`, `guides/04-ssr-hydration-safety.md`, `guides/05-tailwind-v4-dark-mode.md`*

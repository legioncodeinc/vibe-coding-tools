---
source_type: framework_docs
authority: high
relevance: high
topic: SSR color scheme detection, Next.js middleware cookie strategy, suppressHydrationWarning
date_retrieved: 2026-05-20
url: https://nextjs.org/docs/app/building-your-application/rendering/server-components
---

# SSR Color Scheme Detection (2026)

## The SSR/client mismatch problem

During SSR, there is no `window`, no `localStorage`, and no `prefers-color-scheme` readable by the server. This creates a fundamental tension:

1. **Server renders HTML**: no theme applied (or a hardcoded default)
2. **Browser loads inline FOWT script**: reads `localStorage`, applies theme class
3. **React hydrates**: virtual DOM expects server-rendered HTML; class mismatch triggers hydration warning

**Solution A (most common): `suppressHydrationWarning` on `<html>`**

```tsx
<html lang="en" suppressHydrationWarning>
```

This tells React to ignore attribute mismatches on `<html>` during hydration. The FOWT script applies the class; React accepts it without re-rendering. Works with `next-themes` out of the box.

**Solution B: cookie-based SSR match**

For eliminating *any* FOWT (including the window before the inline script fires):

```ts
// middleware.ts
import { NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const theme = request.cookies.get("theme")?.value ?? "system";
  const response = NextResponse.next();
  // Inject theme into request headers so layout.tsx Server Component can read it
  response.headers.set("x-theme", theme);
  return response;
}
```

Then in `layout.tsx`:
```tsx
import { headers } from "next/headers";
export default async function RootLayout({ children }) {
  const theme = (await headers()).get("x-theme") ?? "system";
  const resolvedTheme = theme === "system" ? "light" : theme; // server can't read OS
  return (
    <html lang="en" className={resolvedTheme === "dark" ? "dark" : ""} suppressHydrationWarning>
      {children}
    </html>
  );
}
```

**Trade-off:** cookie-based SSR match requires `next-themes` to write a cookie (set `storageKey` equivalent as a cookie), adds middleware overhead, and the server cannot know `prefers-color-scheme`, so "system" preference still defaults to light on first load without a stored cookie.

## `useIsomorphicLayoutEffect`

For client-only theme reads, use `useIsomorphicLayoutEffect` to avoid SSR warnings:

```ts
import { useLayoutEffect, useEffect } from "react";
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
```

This runs as `useLayoutEffect` (synchronous, before paint) on the client and as `useEffect` (no-op friendly) on the server.

## `mounted` guard pattern

When a component must know the resolved theme before rendering:

```tsx
const [mounted, setMounted] = useState(false);
const { resolvedTheme } = useTheme();
useEffect(() => setMounted(true), []);
if (!mounted) return <Skeleton />;
return <Icon color={resolvedTheme === "dark" ? "white" : "black"} />;
```

Use sparingly: most components should rely on CSS variables and not need to know the theme in JS.

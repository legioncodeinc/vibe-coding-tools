# Edge Case: Cookie-Based SSR Theme Match

*Demonstrates: serving the correct theme class from the server using a cookie, eliminating all FOWT including the pre-script window. Covers `guides/04-ssr-hydration-safety.md`.*

---

## When to use this pattern

- The app has users who frequently switch between light and dark (power users)
- First-paint correctness is a product requirement (e.g., content-heavy sites)
- The app already uses Next.js middleware for auth/tenant routing

**Trade-off:** The server defaults "system" users to "light" on first visit (no cookie stored yet). After the user picks a theme, subsequent loads match perfectly.

---

## Implementation

### 1. Write the cookie on theme change

Extend `providers.tsx` to write a cookie whenever the user changes theme:

```tsx
"use client";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useTheme } from "next-themes";

function ThemeCookieWriter() {
  const { theme } = useTheme();
  useEffect(() => {
    if (theme) {
      document.cookie = `app:theme=${theme};path=/;max-age=31536000;SameSite=Lax;Secure`;
    }
  }, [theme]);
  return null;
}

export function Providers({ children, nonce }: { children: React.ReactNode; nonce?: string }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      storageKey="app:theme"
      nonce={nonce}
    >
      <ThemeCookieWriter />
      {children}
    </ThemeProvider>
  );
}
```

### 2. Read the cookie in `layout.tsx`

```tsx
import { cookies } from "next/headers";
import { Providers } from "./providers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const savedTheme = cookieStore.get("app:theme")?.value;

  // Server cannot read prefers-color-scheme; "system" falls back to light
  const serverClass = savedTheme === "dark" ? "dark" : "";

  return (
    <html
      lang="en"
      className={serverClass}
      suppressHydrationWarning
    >
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

### 3. Cookie policy checklist

- [ ] `SameSite=Lax`: protects against CSRF while allowing cross-site navigation
- [ ] `Secure`: only sent over HTTPS in production
- [ ] `path=/`: applies to all routes
- [ ] `max-age=31536000`: 1 year expiry (long-lived preference)
- [ ] No `HttpOnly`: the client needs to read/write this cookie
- [ ] Confirm with `security-worker-bee` that this cookie does not carry sensitive data

---

## Limitations

| Limitation | Impact |
|-----------|--------|
| First visit (no cookie) always renders "light" when OS is dark | One FOWT on very first visit; corrected by FOWT script |
| Cookie must be sent on every request | Adds ~20 bytes to every HTTP request header |
| "System" theme stored as "system" in cookie | Server cannot resolve: renders as light |

---

## When NOT to use

- Simple apps with no server-side personalization: the `suppressHydrationWarning` + FOWT script approach (`examples/happy-path-app-router.md`) is sufficient and simpler
- Apps with strict cookie size budgets
- Static export sites (no server runtime to read cookies)

*Guide reference: `guides/04-ssr-hydration-safety.md`*

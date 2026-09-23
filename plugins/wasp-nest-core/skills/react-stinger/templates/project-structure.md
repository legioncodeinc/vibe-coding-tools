# Canonical Feature-Based Project Structure

Drop-in scaffold. Source: `guides/01-project-structure.md`.

## Full tree

```
.
├── src/
│   ├── app/                        # framework-level: routes, providers, router
│   │   ├── app.tsx                 # (Vite) root component
│   │   ├── provider.tsx            # composition of providers
│   │   ├── router.tsx              # (Vite) React Router routes
│   │   └── routes/                 # (Vite) route components
│   │                               # Next.js: use the Next.js `app/` convention
│   ├── assets/                     # static images, fonts
│   ├── components/                 # SHARED components only
│   │   ├── ui/                     # primitive UI (Button, Dialog, etc.)
│   │   ├── layouts/                # app / page layouts
│   │   └── providers/              # context providers (theme, auth bridge)
│   ├── config/                     # env vars, global config
│   │   └── env.ts                  # zod-parsed process.env
│   ├── features/                   # THE BULK OF THE APP
│   │   ├── <feature-name>/
│   │   │   ├── api/                # 3-part request declarations
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── stores/             # zustand stores SCOPED to this feature
│   │   │   ├── types/
│   │   │   └── utils/
│   ├── hooks/                      # truly shared hooks
│   ├── lib/                        # pre-configured libraries
│   │   ├── api-client.ts           # fetch/axios wrapper, interceptors
│   │   ├── auth.ts                 # auth utilities
│   │   └── query-client.ts         # TanStack Query client + defaults
│   ├── stores/                     # truly global stores (rare)
│   ├── testing/
│   │   ├── setup.ts                # vitest setup
│   │   ├── test-utils.tsx          # renderWithProviders
│   │   └── mocks/
│   │       ├── server.ts           # msw server setup
│   │       ├── browser.ts          # msw browser setup
│   │       └── handlers/
│   │           └── <feature>.ts
│   ├── types/                      # global types (domain-independent)
│   └── utils/                      # truly shared utilities
├── e2e/                            # Playwright tests
│   └── tests/
├── public/
├── .eslintrc.{js,cjs} | eslint.config.js
├── tsconfig.json
├── vite.config.ts | next.config.ts
├── vitest.config.ts | in vite.config
├── playwright.config.ts
└── package.json
```

## Rules

See `guides/01-project-structure.md` for the three rules (no cross-feature imports, unidirectional flow, no barrel files).

## ESLint enforcement

See `templates/eslint.config.js` for the drop-in `import/no-restricted-paths` zone list.

## Next.js variants

For Next.js App Router, keep this structure under `src/`, but let Next own `src/app/` (routes + layouts). Features go under `src/features/`, used by route components via imports.

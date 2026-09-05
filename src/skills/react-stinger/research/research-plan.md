# Research Plan: react-stinger

**Bee:** react-worker-bee
**Forged:** 2026-04-24

## Open questions from the brief

1. Is React Native in scope? (Defer: out of scope for v1; note in `guides/00-principles.md`.)
2. Dedicated Pages Router -> App Router migration guide? (Defer: short sidebar in `11-server-components.md` with pointer to Next.js migration docs.)
3. Catalog opinionation level? (**Resolved: opinionated per command brief.** "Use X, not Y" with reasoning.)
4. Future TanStack-dedicated Bee? (Out of scope; note in `13-ecosystem-catalog.md`.)

## Authoritative sources to consult

### Primary (must fetch directly)
- https://github.com/alan2207/bulletproof-react: entire `docs/` folder
- https://github.com/enaqx/awesome-react: the curated list
- https://react.dev: React 19 reference
- https://react.dev/learn: opinionated docs

### React 19 / Compiler
- https://react.dev/blog/2024/12/05/react-19 (React 19 release notes)
- https://react.dev/blog/2025/10/07/react-compiler-1 (Compiler 1.0)
- https://react.dev/reference/react/useActionState
- https://react.dev/reference/react/useOptimistic
- https://react.dev/reference/react-dom/hooks/useFormStatus
- https://react.dev/learn/react-compiler/introduction

### Data / State
- https://tanstack.com/query/latest/docs/framework/react/overview
- https://github.com/pmndrs/zustand
- https://jotai.org/
- https://redux-toolkit.js.org/
- https://nuqs.47ng.com/

### Forms / Validation
- https://react-hook-form.com/
- https://zod.dev/

### Testing
- https://vitest.dev/
- https://testing-library.com/docs/react-testing-library/intro/
- https://playwright.dev/
- https://mswjs.io/

### Next.js 15 RSC / Actions
- https://nextjs.org/docs/app/getting-started/server-and-client-components
- https://nextjs.org/docs/app/guides/data-security
- https://nextjs.org/docs/app/api-reference/directives/use-client

## Search queries executed

1. "bulletproof-react architecture 2026 project structure feature-based folders"
2. "React 19 Actions useActionState useOptimistic useFormStatus production patterns 2026"
3. "React Compiler 2026 production readiness stable release memoization"
4. "TanStack Query vs SWR 2026 comparison Server Components"
5. "Zustand vs Jotai vs Redux Toolkit 2026 decision tree"
6. "React Server Components client boundary best practices Next.js 15 2026"
7. "React Server Actions security origin validation authentication 2026"
8. "React Testing Library Vitest Playwright MSW 2026 best practices"
9. "React Hook Form Zod integration patterns 2026"
10. "nuqs URL state React production patterns"
11. "React anti-patterns useEffect derived state 2026"
12. "awesome-react curated libraries ecosystem 2026"

## Target output

- 10-15 dated research notes in `research/YYYY-MM-DD-<topic>.md`
- `react-version-log.md` capturing "what was current at author time"
- `open-questions.md` if any user-judgment calls remain

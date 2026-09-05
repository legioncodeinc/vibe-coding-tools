# Bulletproof-React: Error Handling and Security (combined)

**Sources:**
- https://github.com/alan2207/bulletproof-react/blob/master/docs/error-handling.md
- https://github.com/alan2207/bulletproof-react/blob/master/docs/security.md

**Retrieved:** 2026-04-24

## Error handling: summary

- **Multiple error boundaries, not one.** Place them around subtrees so one error does not crash the whole app.
- **API error interceptor** in the shared client: centralizes toast notifications, 401 logout, token refresh.
- **Production error tracking** with Sentry (or similar). Upload source maps.

## Security: summary (scoped to client-side concerns)

- **Token storage ranking:** in-memory (most secure, but lost on refresh) > `HttpOnly` cookie (balance) > `localStorage` (worst: XSS-exposed).
- **Sanitize user input** before rendering (markdown, HTML). Follow OWASP client-side top 10.
- **Authorization:** RBAC (role-based) or PBAC (permission-based): pick based on granularity need. PBAC for "only author can delete their own comment" style rules.
- **User data as global state:** use `react-query-auth` if you're already on TanStack Query.

## Relevance to this stinger

Spine of `guides/05-error-handling.md`. Security section is a pointer: actual audit is `security-worker-bee`'s job. react-worker-bee surfaces the issue; security-worker-bee decides the fix.

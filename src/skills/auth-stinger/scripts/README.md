# scripts/

Deterministic helpers for auth-stinger. Each has a header with invocation instructions; this README is the index.

## `validate-oauth-scopes.ts`

Audits the OAuth scopes in your code against the scopes registered with your provider (consent screen, scope list). Catches the common drift bug where a scope is declared but unused (verification cost without payoff) or used but undeclared (consent fails at runtime).

```bash
npx tsx scripts/validate-oauth-scopes.ts \
  --code-root ./src \
  --declared-scopes ./scopes.json
```

Exit 0 on match, 1 on drift.

## `cookie-attribute-checker.ts`

Hits a sign-in URL, observes the `Set-Cookie` response headers, and lints session cookies against `templates/session-cookie-config.ts`. Catches missing `HttpOnly`, missing `Secure`, missing or wrong `SameSite`, `__Host-` prefix violations, and missing `Max-Age`.

```bash
npx tsx scripts/cookie-attribute-checker.ts \
  --url https://app.example.com/api/auth/sign-in \
  --method POST \
  --body '{"email":"...","password":"..."}' \
  --expect-name "__Host-session"
```

Exit 0 on pass, 1 on must-fix violation.

## When to run

- **Before opening a PR** that touches auth → both.
- **Before submitting Google verification** → `validate-oauth-scopes.ts` so the scope list in the consent screen matches code.
- **In CI** → both, on auth-touching changes.
- **Before audit handoff to `security-worker-bee`** → both, plus the failure-mode checklist in `templates/audit-report-template.md`.

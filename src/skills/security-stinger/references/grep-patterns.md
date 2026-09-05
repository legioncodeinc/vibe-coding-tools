# Grep / ripgrep patterns

Deterministic sweeps to run before the manual read-through. Run from the repo root. Adjust globs to the actual `src/` layout if it differs.

## Secrets and env leakage

```bash
# Public-prefixed secrets - anything that looks like a credential but is PUBLIC_ is a Critical finding
rg -n "PUBLIC_.*(KEY|SECRET|TOKEN|PASSWORD)" --glob '*.ts' --glob '*.svelte' -i

# $env/static/private or $env/dynamic/private imported outside server-only files
rg -n "from ['\"]\\\$env/(static|dynamic)/private['\"]" --glob '*.ts' --glob '*.svelte' \
  | rg -v "\.server\.ts|hooks\.server|\$lib/server"

# Secrets embedded in a fetch() URL (query string) inside a server load - the historical SvelteKit leak class
rg -n "fetch\(.*\\\$\{.*(KEY|SECRET|TOKEN|PASSWORD)" --glob '+*.server.ts' -i

# dangerZone flag that reopens the load-fetch secret leak
rg -n "trackServerFetchesPotentiallyExposingSecrets"

# Hardcoded secret-shaped literals (common LLM-default values)
rg -n "(supersecret|changeme|password123|your-secret-key|test-secret)" -i

# .env files ever committed (working tree)
git ls-files | rg "^\.env($|\.[^.]+$)" | rg -v "\.env\.example"

# .env files anywhere in git history
git log --all --diff-filter=A --name-only | rg "^\.env($|\.[^.]+$)" | rg -v "\.env\.example" | sort -u
```

## SvelteKit authorization surface

```bash
# +server.ts files - confirm each has an authz check (manual review of hits, not auto-pass/fail)
rg -n "export (const|async function) (GET|POST|PUT|PATCH|DELETE)" --glob '+server.ts'

# Layout server load files - flag for manual review since load != middleware
rg -l "" --glob '+layout.server.ts'

# {@html} usage - every hit needs a sanitizer check
rg -n "\{@html" --glob '*.svelte'

# raw HTML sanitizer presence check (confirm DOMPurify or equivalent is actually imported where {@html} is used)
rg -n "dompurify|sanitize-html" -i
```

## Drizzle / SQL injection

```bash
# sql.raw() calls - manually verify the argument has no request-derived value
rg -n "sql\.raw\("

# sql.identifier() calls - manually verify the value passed through an allowlist first
rg -n "sql\.identifier\("

# String-concatenated query fragments (a common AI-generated anti-pattern even when sql`` exists elsewhere in the file)
rg -n "(SELECT|INSERT|UPDATE|DELETE).*\+.*req\.(params|query|body)" -i
rg -n "\`(SELECT|INSERT|UPDATE|DELETE).*\$\{" -i --glob '*.ts' | rg -v "sql\`"

# Tables missing RLS - cross-check against drizzle schema for tenant_id/organization_id columns with no matching pgPolicy
rg -n "tenant_id|organization_id|org_id" --glob 'schema*.ts' -l
rg -n "pgPolicy\(|withRLS\(" --glob 'schema*.ts' -l
```

## Webhooks

```bash
# Webhook routes - confirm signature verification appears before any DB write or side effect
rg -n "stripe.*webhook|constructEvent" -i --glob '+server.ts'
rg -n "x-ghl-signature|x-wh-signature" -i

# Body parsed before signature check (Express-style ordering bug, also relevant if any middleware wraps SvelteKit routes)
rg -n "\.json\(\)|bodyParser" -i --glob '+server.ts'

# Idempotency table / dedupe check presence
rg -n "processed_webhooks|webhookId|event\.id" --glob '+server.ts'
```

## Dependency / supply chain

```bash
# npm install used where npm ci should be (CI/build scripts)
rg -n "npm install" .github/workflows package.json Dockerfile* 2>/dev/null

# lockfile resolved URLs outside the expected registry
node -e "const l=require('./package-lock.json'); const bad=Object.entries(l.packages||{}).filter(([,v])=>v.resolved).filter(([,v])=>!v.resolved.includes('registry.npmjs.org')).map(([k,v])=>k+' -> '+v.resolved); console.log(bad.join('\n')||'none')"

# packages with install scripts
node -e "const l=require('./package-lock.json'); const s=Object.entries(l.packages||{}).filter(([k,v])=>v.hasInstallScript&&k!=='').map(([k])=>k); console.log(s.join('\n')||'none')"
```

## Cookies and sessions

```bash
rg -n "cookies\.set\(" --glob '*.ts'
rg -n "SameSite\s*[:=]\s*['\"]?none['\"]?" -i
rg -n "httpOnly\s*:\s*false" -i
rg -n "localStorage\.setItem.*(token|session|jwt)" -i
```

## PII / logging

```bash
rg -n "Sentry\.(setUser|captureException|captureMessage)" --glob '*.ts'
rg -n "console\.(log|error|warn)\(.*\b(email|password|token|ssn|card)\b" -i
rg -n "beforeSend|beforeSendLog|beforeBreadcrumb" --glob '*.ts'
rg -n "posthog\.init" -A 15
```

Every match from these sweeps is a lead, not an automatic finding - confirm each one against the surrounding code before writing it into the report.

# 06. Dependencies and supply chain

Grounded in [references/research/distilled-security.md §9](../references/research/distilled-security.md).

## `npm ci` vs `npm install` is a security decision

`npm install` in a CI/build environment can silently upgrade transitive dependencies beyond what's pinned in the lockfile, and can itself MODIFY the committed lockfile as a side effect - if that modified lockfile is cached or persisted, an attacker who can influence the install environment gains a path to lockfile tampering without ever touching the git repository. `npm ci` reads ONLY from the lockfile, fails the build if `package.json` and the lockfile are out of sync, and never mutates the lockfile. Any build/deploy path (Vercel build command, GitHub Actions) using `npm install` instead of `npm ci` is a High finding. [raw/security--supply-chain--npm-lockfile-injection-2026.md]

## Lockfile injection - the attack SCA scanners that only read `package.json` miss

`package-lock.json` v3 stores two fields together per package: `resolved` (the exact URL the tarball came from - for public registry packages, must be `https://registry.npmjs.org/...`) and `integrity` (a SHA-512 hash of the tarball content, verified on install). An attacker who can get a lockfile change merged can modify BOTH fields together for a TRANSITIVE dependency (not listed in `package.json`, so declared-dependency-only checks miss it): point `resolved` at their own server, recompute `integrity` to match their malicious tarball. The hash verifies correctly, `npm ci` succeeds, and a scanner that only reads `package.json` sees nothing wrong. A single-line `resolved`-domain change buried in a 4,000-line lockfile diff is described in the research as "almost impossible to catch in a human review" without tooling. [raw/security--supply-chain--npm-lockfile-injection-2026.md]

Real 2026 precedent, not hypothetical: the TanStack compromise (May 2026, CVE-2026-45321, CVSS 9.6) published 84 malicious versions across 42 `@tanstack/*` packages in under 6 minutes via a poisoned CI cache that survived across a fork/base trust boundary through an unprotected `pull_request_target` workflow. The Miasma incident (June 2026) showed a different failure mode - a compromised maintainer account published malicious code under a LEGITIMATE namespace, so the lockfile was technically correct (it accurately reflected a compromised-but-signed registry state), proving lockfile integrity checks alone are insufficient without registry-level detection.

## CI checklist

1. `npm ci`, never `npm install`, on any build/deploy path.
2. `npm audit signatures` after install - verifies the registry signature of every installed package, catching malicious tarballs that bypassed npm's own signing pipeline (the Miasma-style failure mode that lockfile integrity checks alone miss).
3. `npm audit --audit-level=high` (or equivalent) as a blocking gate.
4. A CI shell check validating every `resolved` URL in the lockfile against an explicit registry allowlist, failing the build on any URL pointing outside it:
```bash
node -e "
  const l = require('./package-lock.json');
  const allowed = ['registry.npmjs.org'];
  const bad = Object.entries(l.packages || {})
    .filter(([,v]) => v.resolved)
    .filter(([,v]) => !allowed.some(h => v.resolved.includes(h)))
    .map(([k,v]) => k + ' -> ' + v.resolved);
  if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
"
```
5. Flag any new lockfile entry carrying `hasInstallScript: true` for review before merge - it means the package will execute arbitrary code at install time.

## PR review red flags for any lockfile diff

1. `resolved` URL changed for an existing package while the version string did NOT change - a legitimate upgrade changes both together.
2. A new `packages` entry with no corresponding direct-dependency change in `package.json`.
3. `integrity` changed without a version change - the tarball content changed under a fixed version, which is either tampering or an insecure mutable tag either way.
4. A lockfile diff inside a PR whose stated purpose is unrelated to dependencies.

Require any PR touching `package-lock.json` to explain that change in its description, and treat a lockfile diff with no explanation as a review blocker, not a rubber stamp.

## Provenance and behavioral risk

`npm audit` alone only checks a resolved-dependency tree against known CVEs and returns clean for a compromise with no CVE filed yet (the exact gap the TanStack/Miasma incidents exploited). Prefer signals that don't depend on a CVE existing yet: `npm audit signatures` for registry-signing verification, and (where available) socket-style behavioral/provenance tooling that flags new install scripts, new transitive dependencies, or a package losing previously-held provenance/trusted-publishing status compared to its prior version.

## Research gap - Renovate/Dependabot

No primary source specifically documenting this repo's own Renovate or Dependabot configuration was archived for this skill. Treat any specific claim about this repo's automated-update cadence, grouping, or cooldown behavior as unverified until a dedicated source is researched - do not assert a specific Dependabot/Renovate behavior as fact without checking the actual configured workflow files in this repo directly.

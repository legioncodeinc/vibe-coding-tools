# npm Lockfile Security in 2026 - CVE OptiBot Blog

- URL: https://cve.optibot.re/blog/npm-lockfile-security-2026
- Fetched: 2026-08-14
- Source type: vendor-independent security research blog, published 2026-06-16
- Component: npm/pnpm dependency supply chain, CI/CD lockfile trust

## Stats cited (attributed to Sonatype 2026 SSSC and bastion.tech npm Threat Landscape 2026)

- 454K+ malicious npm packages identified in 2025.
- 99% of open-source malware in the study targets the npm ecosystem specifically.
- A typical npm project with ~20 direct dependencies carries roughly 79 transitive dependencies in its lockfile, sourced from hundreds of individual publishers.
- TanStack incident: 84 malicious versions across 42 `@tanstack/*` packages published to npm in under 6 minutes (May 11, 2026, CVE-2026-45321, CVSS 9.6).

## package-lock.json v3 mechanics

- Each `packages` entry carries two security-critical, PAIRED fields: `resolved` (the exact URL the tarball was fetched from - for public-registry packages this must always be `https://registry.npmjs.org/...`) and `integrity` (a `sha512-` Subresource Integrity hash of the tarball content, verified by npm on install).
- Critical insight: an attacker who can write to the committed lockfile can change BOTH fields together - point `resolved` at their own server and recompute `integrity` to match their malicious tarball. The hash verifies correctly, `npm ci` succeeds, and a `package.json`/SCA-only scanner sees nothing wrong because it never inspects `resolved`.

## Lockfile injection attack (three steps)

1. Attacker gains write access to the lockfile - via a compromised maintainer account, a malicious PR from an outside contributor, or a compromised CI/CD cache (the TanStack vector).
2. Attacker modifies a TRANSITIVE dependency's `resolved` URL and matching `integrity` hash - transitive deps are not listed in `package.json`, so checks that only diff declared dependencies miss it. "A PR titled 'chore: update dependencies' that changes one `resolved` URL in 4,000 lines of lockfile is almost impossible to catch in a human review."
3. CI runs `npm ci`, fetches the malicious tarball, the hash matches (because the attacker controls both fields), the build succeeds, and the `postinstall` script (if any) executes with the CI runner's privileges.

## What the TanStack (May 2026) and Miasma (June 2026) incidents each proved

- TanStack: attackers can produce a malicious tarball with a technically VALID integrity hash if they compromise the build pipeline itself (GitHub Actions cache poisoning via an unprotected `pull_request_target` workflow let malicious build artifacts cross the fork/base trust boundary; an OIDC token was then extracted from runner process memory, granting npm publish rights). Postmortem-recommended mitigation: pin the `integrity` field for critical package scopes in the committed lockfile and have CI reject any change to those pinned hashes without explicit approval.
- Miasma: attacker compromised a maintainer account and published malicious code directly under a legitimate namespace (`@redhat-cloud-services`). The lockfile was technically CORRECT (it accurately reflected the compromised-but-legitimately-signed registry state), proving lockfile integrity checks alone are insufficient - registry-level detection (`npm audit signatures`, OpenSSF Package Analysis) must run alongside lockfile verification, not instead of it.

## `npm ci` vs `npm install` as a security decision, not just a performance one

- `npm install` in CI can silently upgrade transitive dependencies beyond what's pinned in the lockfile, and can itself MODIFY the committed lockfile as a side effect - if that modified lockfile is then cached or persisted, an attacker who can influence the install environment gains a path to lockfile tampering without ever touching the git repository directly.
- `npm ci` reads ONLY from the lockfile, fails if `package.json` and the lockfile are out of sync, and never modifies the lockfile - "REQUIRED in CI."

## Detection tooling and CI checklist

1. `npm audit signatures` (npm CLI v9.5+) - verifies the registry signature of every installed package against npm's public key; catches Miasma-style attacks where a malicious tarball bypassed the registry's own signing pipeline.
2. Third-party `lockcheck` CLI (github.com/DhanushNehru/lockcheck) - baselines the lockfile on first run, then diffs subsequent runs and flags any change to `resolved` URLs, `integrity` hashes, or newly-added `packages` entries; suitable as a pre-commit hook and CI check.
3. CI shell check validating every `resolved` URL against an explicit registry allowlist (e.g. only `registry.npmjs.org`), failing the build on any URL outside that allowlist.
4. Manual spot verification: recompute a package's expected `integrity` via `npm pack <pkg>@<version> --dry-run --json` and diff against the lockfile's stored value for high-value dependencies.

## PR diff review red flags (for lockfile changes specifically)

1. `resolved` URL changed for an existing package while the VERSION STRING did not change (legitimate upgrades change both together).
2. A new `packages` entry appears with no corresponding direct-dependency change in `package.json` (legitimate transitive additions always trace back to a `package.json` diff).
3. `integrity` changed without a version change (means the tarball content changed under a fixed version number - tampering, or an insecure mutable tag).
4. A lockfile diff appears in a PR whose stated purpose is unrelated (e.g. "fix: button alignment" also touching `package-lock.json`).

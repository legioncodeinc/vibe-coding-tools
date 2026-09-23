# dependency-audit-wasp-drone

## Domain
This Drone owns the open-source dependency supply-chain surface: scanner selection and configuration (Dependabot, Renovate, Snyk, socket.dev, OWASP Dependency-Check), vulnerability triage with CVSS scoring and exploitability context, SBOM generation (Syft, CycloneDX, SPDX plus Sigstore attestation), lockfile discipline (`npm ci` enforcement, `minimumReleaseAge`, `lockFileMaintenance`), and provenance verification (npm `--provenance`, PyPI PEP 740). It treats `npm audit` as a CVE compliance tool, not a supply-chain security tool, and pushes teams toward behavioral scanning for the account-hijack class of attack.

## Paired Stinger
[dependency-audit-stinger](../../dependency-audit-stinger) - scanner decision matrix, vulnerability triage discipline, SBOM workflow, lockfile hardening, and provenance verification guides.

## Trigger phrases
- "audit our dependencies"
- "set up Renovate"
- "Renovate vs Dependabot"
- "generate an SBOM"
- "npm audit is noisy"
- "lockfile hygiene"
- "npm provenance"
- "Snyk CI gate"

## Do NOT route when
- The CVE requires patching application code, not just bumping a package version: that's security-wasp-drone.
- The task is Docker image scanning pipeline architecture: that's devops-wasp-drone.
- The task is license compatibility legal advice: route to legal counsel, outside Drone scope entirely.
- The task is application-code vulnerability remediation more broadly: security-wasp-drone owns that surface, this Drone only owns the supply chain.

## Inputs the Drone needs
- The project's language/package manager (npm, pnpm, pip, uv, poetry, cargo)
- The CI platform (GitHub Actions, GitLab, other)
- Existing scanner configs (`.snyk`, `renovate.json`, `.github/dependabot.yml`)
- Whether the scenario is new setup, existing-scanner audit, CVE triage, SBOM build, or provenance check

## Outputs
- A Renovate or Snyk CI gate config with inline rationale comments
- A CVE triage table with CVSS context, exploitability, and recommended resolution
- An SBOM generation workflow or an audit report

## Commonly sequenced with
- security-wasp-drone: takes over once a CVE needs an application-code fix rather than a dependency bump
- devops-wasp-drone: owns the Docker scanning pipeline and broader CI/CD architecture this Drone's scanning step slots into
- github-repo-health-wasp-drone: overlaps on repo hygiene checks but this Drone owns the dependency-specific depth

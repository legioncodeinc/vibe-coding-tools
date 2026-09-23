# Relationship to the internal-repo security-stinger, and why this pair does not duplicate it

Read this before writing anything that reads like a restatement of `security-stinger`'s own vulnerability catalog. This guide exists specifically because PRD-014's non-goal names this as a real risk to avoid, not a hypothetical one.

## 1. The scoping distinction, stated plainly

The Wasp Nest's existing `security-wasp-drone`/`security-stinger` pair is built to improve a repository the plugin's own operator owns: it reads source code, proposes diffs, and runs the Ship Gate (security, then quality, then repo-health) before a commit. `web-security-posture-wasp-drone` does something categorically different: it externally assesses a live third-party website's public security posture, with no source access, no deploy rights, and a hard read-only constraint. Same subject matter area (HTTP security headers, OWASP guidance), different posture, different guardrails, different audience. Both this pair's own PRD-014 non-goal and the plugin's master PRD-001 non-goal state this distinction explicitly: "Does not duplicate `security-wasp-drone`'s internal-repo vulnerability catalog; that Drone improves a codebase you own, this Drone externally assesses a deployed site you do not."

## 2. What this means procedurally

- Where this pair's own header/CSP findings overlap with `security-stinger`'s internal-repo guidance (e.g. the same CSP/HSTS/X-Frame-Options concepts appear in that Stinger's `guides/07-headers-and-transport.md`), cross-link to that Stinger's research archive as a "see also" reference in a finding's justification field, rather than re-deriving or re-summarizing the same OWASP-sourced guidance a second time in this pair's own output.
- Do not copy `security-stinger`'s severity rubric, grep patterns, or remediation playbooks into this pair's templates or guides. Those are built for source-code-level findings (a specific file and line number in a repo this pair's operator owns); this pair's findings are external-observation-level (a header value, a certificate field, a vendor script) with no source-code access to remediate directly.
- Do not invoke `security-stinger`'s Ship Gate ordering (security-stinger, then quality-stinger, then github-repo-health-stinger) as if it applied to this pair's own output; it does not, since this pair produces audit-workspace report artifacts, not a code change to a repository. See this Stinger's own SKILL.md Ship Gate section.

## 3. When to actually consult `security-stinger`'s archive

If a specific finding needs implementation-level depth beyond what this pair's own thin, four-source archive documents (e.g. the exact secure-by-default header-configuration snippet for a specific framework, or a deeper CSP-evaluation methodology than `guides/03` covers), reading `security-stinger`'s `references/research/distilled-security.md` and its `guides/07-headers-and-transport.md` is appropriate and encouraged, since that Stinger's archive is deeper and more current on the shared OWASP-header ground both pairs touch. Cite what you use from it explicitly, the same way any other cross-reference gets cited in this pair's own output.

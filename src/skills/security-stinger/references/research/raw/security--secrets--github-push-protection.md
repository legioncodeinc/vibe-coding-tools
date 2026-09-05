# Push protection - GitHub Docs

- URL: https://docs.github.com/en/code-security/concepts/secret-security/push-protection ; https://docs.github.com/code-security/secret-scanning/about-secret-scanning
- Fetched: 2026-08-14
- Source type: official vendor documentation (GitHub)
- Component: git history / CI secret hygiene

## Secret scanning (post-hoc, whole-history)

- Secret scanning scans the ENTIRE git history on all branches for hardcoded credentials (API keys, passwords, tokens, other known secret types), not just the current HEAD - a secret removed in a later commit is still flagged because it remains reachable in history.
- GitHub periodically rescans repositories retroactively when new secret detector patterns are added, so a secret that predates a given detector can still surface later.
- Availability: automatic and free for public repositories; requires GitHub Secret Protection (part of GitHub Advanced Security) for private/internal repositories in an organization.
- When a leak is detected, GitHub's own guidance is: "rotate the affected credential immediately... While you can also remove secrets from your Git history, this is time-intensive and often unnecessary if you've already revoked the credential." (i.e., rotation, not history rewriting, is the primary remediation.)

## Push protection (preventative, pre-commit-landing)

- Push protection blocks a push containing a detected secret BEFORE it ever reaches the repository - it inspects pushes from the CLI, commits made in the GitHub UI, file uploads, REST API requests, and interactions with the GitHub MCP server (public repos only).
- Disabled by default; must be explicitly enabled by a repo admin, org owner, security manager, or enterprise owner, and requires GitHub Secret Protection.
- Bypass model: by default, anyone with write access can bypass a push-protection block by supplying a bypass reason. Reasons and their resulting alert state: "It's used in tests" -> closed alert marked "used in tests"; "It's a false positive" -> closed alert marked "false positive"; "I'll fix it later" -> OPEN alert (i.e., this reason does not close the finding). Every bypass is logged to the audit log and triggers an email to org/enterprise owners, security managers, and watching repo admins with a link to the secret and the stated reason.
- "Delegated bypass" can restrict which specific people/teams are allowed to bypass push protection or grant them full exemption from the check entirely, narrowing the default "anyone with write access can bypass" behavior.
- Organizations on GitHub Team/Enterprise can run a free secret risk assessment report regardless of whether push protection is enabled, which also reports how many past leaks WOULD have been blocked had push protection been on - useful as a baseline metric before turning the feature on.
- Custom patterns: organizations can define detection patterns for secrets unique to their own environment (e.g., an internally-issued API key format) beyond GitHub's built-in partner-provided patterns.

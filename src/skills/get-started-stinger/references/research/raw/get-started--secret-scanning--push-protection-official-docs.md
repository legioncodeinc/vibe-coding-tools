# Push protection
- URL: https://docs.github.com/en/code-security/concepts/secret-security/push-protection
- Fetched: 2026-08-14
- Source type: official-docs
- Component: secret-scanning

## What push protection does

Push protection is a secret-scanning feature that blocks a push containing a detected secret **before** it reaches the repository, rather than alerting after the fact. It blocks secrets found in: CLI pushes, GitHub UI commits, file uploads, REST API requests, and interactions via the GitHub MCP server (public repos only). When it fires, the push is rejected with a message identifying the secret; the contributor must remove it (or get a bypass approved) before the push succeeds.

## Two forms

- **Push protection for repositories** — requires GitHub Secret Protection enabled; off by default; enabled by a repo admin, org owner, security manager, or enterprise owner; generates alerts on bypass in the Security and quality tab.
- **Push protection for users** — GitHub.com-account-level, on by default, blocks pushes of supported secrets to *public* repositories specifically, and does not generate alerts unless repo-level protection is also on.

## Enabling (repository level)

Settings > Advanced Security > enable "Secret Protection" first if not already on, then enable "Push protection" in the same section.

## Bypass behavior

By default anyone with write access can bypass by supplying a reason. Each reason has different alert behavior:

| Bypass reason | Resulting alert |
| --- | --- |
| It's used in tests | Closed alert, resolved "used in tests" |
| It's a false positive | Closed alert, resolved "false positive" |
| I'll fix it later | Open alert |

Every bypass writes to the audit log and emails watching owners/security managers/admins with a link to the secret and the stated reason. Organizations can configure **delegated bypass**: grant specific actors either bypass privileges (including approving others' bypass requests) or full exemption from push protection.

## Customization

Once enabled, push protection can be customized with: custom secret patterns unique to the org, designated bypass-approvers, and org/enterprise-level control over which secret patterns are included.

## Relevance to the initialization skill

Push protection plus a committed `.env.example` (with real `.env*` gitignored) is the practical two-layer defense this skill should recommend: `.gitignore` keeps secrets from being staged at all, push protection is the safety net if one slips through. Enabling push protection itself is a repository Settings action requiring admin access — the skill documents it as a human-decision step in the verification pass, not something it can flip via file copy.

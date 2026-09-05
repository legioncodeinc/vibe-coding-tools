# How to Write an Effective Security Policy for GitHub Repositories — Hypertext Dispatches
- URL: https://tenthirtyam.org/dispatches/2026/04/21/how-to-write-an-effective-security-policy-for-github-repositories/
- Fetched: 2026-08-14
- Source type: community-guide
- Component: security-policy
- Published: 2026-04-21, Author: Ryan Johnson

## Where GitHub looks for SECURITY.md

GitHub checks three repository-level locations in order relevance: `SECURITY.md` at repository root, `docs/SECURITY.md`, `.github/SECURITY.md`. It also falls back to a `SECURITY.md` defined in an account/org's dedicated `.github` default-community-health-files repository if the individual repo has none — useful for org-wide consistency, but means that default file needs to stay general enough to apply across every repo relying on it; repos with materially different support windows or reporting processes should still ship their own.

UI flow to add one: Security and quality tab (or overflow dropdown if not visible) > Reporting > Policy > Start setup, which scaffolds `SECURITY.md`.

## Five questions a good policy answers

1. Which versions are still supported with security fixes?
2. How should someone report a vulnerability *privately*?
3. What information should the report include?
4. What should the reporter expect from the maintainers after reporting?
5. Which reporting paths are explicitly *not* appropriate (i.e., not public issues/PRs)?

A security policy is explicitly scoped as an intake and expectation-setting document — not a full incident response plan, not a complete disclosure policy, and not a substitute for an internal security process for projects that need one.

## Supported versions table

GitHub's own generated examples default to a supported-versions table as the opening section, which is correct: a security policy is as much about defining the maintenance boundary as about the reporting mechanism itself.

```
## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 3.x     | :white_check_mark: |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |
```

## Reporting section — the single most important part

The core job of a security policy is keeping vulnerability reports out of public issues/discussions/PRs. State this explicitly, then name exactly one primary reporting path (GitHub Private Vulnerability Reporting is the cleanest option for a repo that already uses GitHub's security tooling, since it stays inside the platform and aligns with GitHub Security Advisories) with at most one documented fallback (e.g. a monitored security email alias) — only list a secondary path if it is actually monitored and operated. If the policy names GitHub's private reporting flow, the feature must actually be enabled on the repo before publishing the policy.

## Response expectations section

Should state: when to expect acknowledgment of receipt, when triage begins, how follow-up questions will be communicated, and what happens once a report is confirmed.

## Disclosure section

Doesn't require a full vulnerability-management program, but should say briefly: will a GitHub Security Advisory be published for confirmed vulnerabilities, will disclosure timing be coordinated with the reporter, is the approach patch-first-disclose-second, and will unsupported versions receive fixes.

## Practical baseline template (source's own, reproduced)

```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| 3.x     | :white_check_mark: |
| 2.x     | :white_check_mark: |
| 1.x     | :x:                |

## Reporting a Vulnerability

Please do not report security vulnerabilities through public GitHub issues, discussions, or pull
requests.

Instead, report vulnerabilities through GitHub private vulnerability reporting for this repository.

If private vulnerability reporting is unavailable or unusable for your report, email the
maintainers at [SECURITY_EMAIL].

When reporting a vulnerability, please include:

- The affected version, tag, or commit SHA
- A description of the issue and why you believe it is security-sensitive
- Steps to reproduce or a proof of concept
- Any relevant logs, payloads, or screenshots
- The potential impact
- Any suggested mitigations or fixes, if known

You can expect an acknowledgment within 3 business days.

After acknowledgment, we will assess the report and follow up with next steps. If the issue is
confirmed, we will work on a fix and coordinate disclosure timing with the reporter when
appropriate.

If a report is validated, we may publish a GitHub Security Advisory once remediation details are
ready to share publicly.
```

This template is explicitly called "intentionally modest" — not a bug bounty program, incident response plan, or lawyer-reviewed safe-harbor statement. Extend it (scope/out-of-scope targets, safe-harbor language, severity classification, encryption preferences, formal bug bounty) only for projects that maintain a hosted service, multiple products with different security contacts, or a regular CVE/advisory cadence.

## Minimal pointer-file variant

If a project routes all security reporting to a page outside the repo, the repo file can stay a short pointer as long as the linked page is current, monitored, and clear — a pointer file is only useful if it takes the reader somewhere operationally *better* than the file itself, never as a way to avoid stating the reporting path at all.

# HTTP/REST Audit Findings Report

**Target:** {API name / endpoint / spec file}
**Auditor:** http-rest-fundamentals-worker-bee
**Date:** {YYYY-MM-DD}
**Branch / Commit:** {branch or commit hash}

---

## Summary

| Severity | Count |
|---|---|
| Critical | {N} |
| High | {N} |
| Medium | {N} |
| Informational | {N} |
| **Total** | **{N}** |

{One paragraph summarizing the overall API health. What is done well? What is the most impactful area to fix?}

---

## Critical findings

{Issues that are security exploitable or will cause functional failures for clients}

### C1: {Short title}

- **Location:** {endpoint / file / line}
- **Finding:** {What is wrong, specifically}
- **RFC reference:** {RFC XXXX §X.X.X}
- **Impact:** {What breaks or can be exploited}
- **Remediation:** {Concrete fix, including code example if helpful}

---

## High findings

{Issues that violate HTTP semantics in ways that break caches, clients, or monitoring}

### H1: {Short title}

- **Location:** {endpoint / file / line}
- **Finding:** {What is wrong}
- **RFC reference:** {RFC XXXX §X.X.X}
- **Impact:** {What breaks}
- **Remediation:** {Fix}

---

## Medium findings

{Issues that are technically incorrect but have limited immediate impact}

### M1: {Short title}

- **Location:** {endpoint / file / line}
- **Finding:** {What is wrong}
- **RFC reference:** {RFC XXXX §X.X.X}
- **Impact:** {What is suboptimal}
- **Remediation:** {Fix}

---

## Informational

{Best-practice suggestions and observations that are not errors}

- {Observation 1}
- {Observation 2}

---

## Handoffs

- **Security findings:** {List any OWASP-level security header issues found here for security-worker-bee follow-up}
- **Auth findings:** {List any auth-header semantics issues for auth-worker-bee follow-up}

---

*Report template: `.claude/skills/http-rest-fundamentals-stinger/templates/findings-report.md`*

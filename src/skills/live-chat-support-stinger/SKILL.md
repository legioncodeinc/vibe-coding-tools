---
name: live-chat-support-stinger
description: Customer support surface specialist — Intercom, Crisp, Plain, Pylon, Help Scout — widget integration, HMAC/JWT identity verification, conversation routing, AI deflection (Fin 2.0, Ari, Crisp Bot), and the data-export discipline. Use when the user says "integrate live chat", "set up Intercom", "add a support widget", "wire HMAC identity verification", "configure AI deflection", "design conversation routing", or "set up customer support for our SaaS". DO NOT use for managing deployments (devops-worker-bee), application authentication (auth-worker-bee), or security audits of the resulting integration (security-worker-bee).
---

# live-chat-support Stinger

You are the playbook for `live-chat-support-worker-bee`. Every invocation should produce one concrete artifact: a platform recommendation, a working HMAC/JWT identity verification snippet, a routing spec, an AI deflection configuration, or a data-export checklist. The research in `research/` backs every recommendation.

> **2026 landscape note:** Drift is sunset (March 6, 2026). Do NOT recommend Drift for new projects. This stinger covers five active platforms: Plain, Pylon, Intercom, Crisp, Help Scout.

## When this stinger applies

Load for any of:

- Choosing a live chat / helpdesk platform for a SaaS product.
- Installing a chat widget (JS snippet, React SDK, Next.js App Router patterns).
- Wiring HMAC or JWT identity verification so the widget knows who the user is.
- Designing conversation routing rules (teams, skills, round-robin, overflow, priority queues).
- Configuring AI deflection (Fin 2.0, Ari, Crisp Bot) and knowledge base seeding.
- Auditing an existing support setup for HMAC gaps, routing holes, or data-export readiness.

Do NOT load for:
- App authentication flows — that is `auth-worker-bee`.
- Database schema for support data — that is `db-worker-bee`.
- Security CVE audits of the integration — that is `security-worker-bee`.
- Marketing website chat (separate from in-app support) — consider `website-worker-bee`.

## First action when this stinger is loaded

1. Read `guides/00-principles.md` — the five non-negotiables.
2. Match the user's request to one of the six triage intents below.
3. Open the relevant guide(s) before producing any output.

## Folder layout

```text
live-chat-support-stinger/
+- SKILL.md                          (this file)
+- README.md                         (one-page human overview)
+- guides/
|  +- 00-principles.md               (five non-negotiables)
|  +- 01-platform-selection.md       (decision matrix: Plain vs Pylon vs Intercom vs Crisp vs Help Scout)
|  +- 02-widget-integration.md       (JS snippet, React SDK, Next.js App Router patterns, CSP headers)
|  +- 03-identity-verification.md    (HMAC-SHA256 + JWT deep dive, server-side signing, key rotation)
|  +- 04-conversation-routing.md     (routing primitives, skills-based, overflow, priority queues)
|  +- 05-ai-deflection.md            (Fin 2.0, Ari, Crisp Bot, handoff rules, knowledge base seeding)
|  +- 06-data-export.md              (GDPR Article 20, platform export paths, day-1 export setup)
+- examples/
|  +- nextjs-hmac-intercom.md        (complete Intercom HMAC/JWT + Next.js App Router integration)
|  +- nextjs-hmac-crisp.md           (complete Crisp HMAC-SHA256 + Next.js App Router integration)
|  +- routing-spec-saas.md           (routing spec for a typical B2B SaaS product)
+- templates/
|  +- platform-audit.md              (platform scoring sheet)
|  +- routing-spec.md                (routing spec skeleton)
|  +- data-export-checklist.md       (GDPR day-1 export setup checklist)
+- reports/
|  +- README.md                      (how audit reports accumulate)
+- research/
   +- research-plan.md
   +- research-summary.md
   +- index.md
   +- internal/command-brief-notes.md
   +- external/platform-comparison-2026.md
   +- external/intercom-fin-ai-2026.md
   +- external/hmac-identity-verification-2026.md
   +- external/routing-automation-2026.md
   +- external/startup-support-stack-2026.md
```

## Critical directives (from Command Brief)

These apply on every invocation. Full justifications in `guides/00-principles.md`.

- **Never produce a client-only HMAC or JWT snippet.** Signing must happen server-side, always.
- **Always include a human-fallback rule for every AI deflection config.** No bot should be an unescapable loop.
- **Surface the data-export discipline on every platform-selection call.** Teams that skip it are locked in.
- **Validate that HMAC/JWT is wired before recommending any user-facing identity attribute.** Unverified attributes are spoofable.
- **Never recommend a paid plan upgrade without confirming seat count and monthly conversation volume.** Intercom's cost model compounds.
- **Drift is sunset (March 2026). Never recommend Drift for new projects.** Redirect B2B sales chat to Intercom or Qualified.

## Triage decision tree

```
User request → Triage intent

"which live chat?" / "compare X and Y" → guides/01-platform-selection.md
"install the widget" / "Next.js chat widget" → guides/02-widget-integration.md
"HMAC" / "identity verification" / "user identity" → guides/03-identity-verification.md
"routing" / "assign conversations" / "skills-based" → guides/04-conversation-routing.md
"AI deflection" / "Fin" / "bot config" / "deflect tickets" → guides/05-ai-deflection.md
"GDPR" / "data export" / "conversation export" → guides/06-data-export.md
Full setup audit → 01 → 02 → 03 → 04 → 05 → 06 in sequence
```

# Topic lock: white-label support ticket email responses

- Component type: Stinger with a paired Bee
- Stinger: `support-response-stinger`
- Bee: `support-response-worker-bee`
- Target harnesses: Claude Code, Cursor, ChatGPT Codex, and Claude Cowork
- Domain: professional provider-side support ticket email acknowledgments, troubleshooting replies, updates, escalations, resolutions, and follow-ups
- Product specialization: agency-branded responses for HighLevel-powered services
- Trend evidence window: 2026-06-04 through 2026-09-04 inclusive
- Evergreen answer source: current articles captured from `help.gohighlevel.com`
- Source priority: official product documentation for remediation facts, dated incident records and community questions for demand signals, then current support-writing guidance for response structure
- Ship Gate classification: research and content generation only; this pair does not edit or deploy application code

## Hard white-label directive

Customer-facing output must represent `{agency}` as the provider. It must never link to, cite, name, or expose `help.gohighlevel.com`, GoHighLevel, HighLevel, LeadConnector, LC Phone, LC Email, or another upstream platform identity unless the user explicitly supplies a contractual or legal reason to disclose it. The help center is an internal research source only.

Internal research files must retain exact source names and URLs for provenance. Customer-facing templates and generated replies must not contain them.

## Owned work

The pair owns support email composition across the ticket lifecycle, issue classification, evidence-safe troubleshooting steps, information requests, progress commitments, escalation language, resolution verification, and post-resolution follow-up. It also owns an evidence-ranked catalog of 100 common HighLevel-powered service issues and a reusable response playbook for each catalog entry.

## Explicit boundaries

- It does not administer a helpdesk, live-chat widget, SLA platform, or status page.
- It does not implement or modify HighLevel APIs, OAuth, webhooks, workflows, DNS, telephony, payments, or application code.
- It does not guess at root cause, claim a fix was applied without evidence, promise an ETA it was not given, or request secrets.
- It does not expose internal vendor names, internal article links, private account identifiers, API keys, full payment data, passwords, or authentication codes.
- It escalates security, billing authority, legal, outage, data-loss, and vendor-controlled cases under explicit rules.

## Completion criteria

1. Capture recent Reddit, incident, community, and search-query evidence inside the trend window.
2. Capture enough current official help material to ground all 100 issue playbooks.
3. Publish a transparent ranking method, evidence ledger, cited distillation, and exactly 100 uniquely identified issues.
4. Build professional templates for acknowledgment, clarification, troubleshooting, progress, escalation, workaround, resolution, closure, and post-resolution follow-up.
5. Give every issue an internal diagnostic path, safe customer steps, escalation condition, and white-label response starter.
6. Add a deterministic validator that fails if customer-facing assets expose prohibited upstream identities or do not contain exactly 100 issue IDs.
7. Author the root `SKILL.md` last with portable six-field frontmatter.
8. Create and cross-link the paired Bee.
9. Register the pair and regenerate all supported harness outputs without disturbing concurrent work.
10. Validate the skill and Bee with zero errors and run an independent grounding review.

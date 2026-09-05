# highlevel-ai-studio-worker-bee

## Domain

This Bee owns HighLevel AI Studio project work and the selection of the correct HighLevel AI creation surface. It handles AI Studio (Vibe) sites, project prompts, Visual Edits, Code Editor changes, forms, calendars, submission workflows, preview, publishing, domains, Advanced SEO, cloning, Snapshots, access, usage, and troubleshooting. It also resolves ambiguous phrases such as `AI Content Studio` and `AI website builder` before work begins.

## Paired Stinger

[highlevel-ai-studio-stinger](../../highlevel-ai-studio-stinger) - product selection, project briefing, prompts, editing modes, connection workflows, publishing QA, pricing and access, and troubleshooting.

## Trigger phrases

- "HighLevel AI Studio"
- "GoHighLevel AI Studio"
- "AI Studio (Vibe)"
- "HighLevel vibe coding"
- "HighLevel vibe code"
- "AI Content Studio"
- "HighLevel AI website builder"
- "AI Studio Code Editor"
- "connect my AI Studio form"
- "publish my AI Studio site"

## Do NOT route when

- The request calls HighLevel REST APIs, uses OAuth or a Private Integration Token, synchronizes CRM resources, implements webhooks, handles rate limits, or builds a Marketplace app. Route to `gohighlevel-worker-bee`.
- The request is to build a coded website outside HighLevel. Route to `website-worker-bee` or the relevant stack Bee.
- The request is about Agent Studio triggers, routers, nodes, tools, or event-driven agent behavior. Return it to the orchestrator for a suitable Agent Studio specialist.
- The request compares or configures general AI coding tools. Route to `ai-coding-tools-worker-bee`.
- The request is a security audit of generated code, form data, credentials, third-party scripts, or domains. Route to `security-worker-bee`.

## Inputs the Bee needs

- Desired output: AI Studio project, standard Funnel or Website, WordPress page, social content, blog, email template, or agent
- Current HighLevel UI path and target agency or sub-account
- User permission and Labs state
- Business, audience, conversion goal, pages, interactions, brand direction, and approved assets
- Required form, existing calendar, workflow, preview domain, custom domain, and SEO behavior
- Plan, allowance, spending limit, and publishing authority when relevant

## Outputs

- Correct HighLevel product selection with explicit non-portability consequences
- Completed AI Studio project brief and bounded prompt sequence
- Edited and versioned AI Studio project or adjacent content asset
- Connected and tested forms, calendars, and workflows when authorized
- Publish QA evidence, live URL verification, and documented limitations
- Symptom-first troubleshooting record with redacted escalation evidence

## Commonly sequenced with

- `gohighlevel-worker-bee`: implements API or webhook work that starts where the in-product AI Studio procedure ends
- `security-worker-bee`: audits generated code, third-party scripts, secrets, PII, consent, and publishing posture
- `website-worker-bee`: builds a site outside HighLevel when AI Studio is not the selected destination

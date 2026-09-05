# Research Summary: slack-app-stinger

- **Bee:** slack-app-worker-bee
- **Depth tier consumed:** normal
- **Time window:** 2025-11-20 to 2026-05-20 (6 months)
- **Files written:** 9 (1 research-plan.md, 1 index.md, 1 research-summary.md, plus 8 external source files in `external/`)
- **Queries executed:** 10 (7 initial from command brief, 3 expansion queries)

---

## Five most influential sources

### 1. `external/2026-05-20-bolt-sdk-setup-patterns.md`
**Why it matters:** The Bolt for JavaScript "Building an App" guide is the canonical entry point for every Slack developer. It establishes the three required environment variables (`SLACK_BOT_TOKEN`, `SLACK_SIGNING_SECRET`, `SLACK_APP_TOKEN`), the Socket Mode vs HTTP mode decision, and the minimal boilerplate pattern. Everything in `guides/00-setup-and-bolt.md` derives from this source and its Python equivalent. Without this, the stinger has no foundation.

### 2. `external/2026-05-20-events-api-verification.md`
**Why it matters:** The Events API is the backbone of nearly every production Slack app. This source documents the three critical correctness invariants from the Command Brief: (a) the 3-second ACK rule, (b) HMAC-SHA256 request signature verification, and (c) `event_id` deduplication. These are the top three failure modes in production Slack apps and must appear prominently in `guides/04-events-api.md` with code examples.

### 3. `external/2026-05-20-oauth-multi-workspace.md`
**Why it matters:** Multi-workspace OAuth is the feature that separates a personal bot from a distributable SaaS Slack app. The `InstallationStore` pattern, `state` parameter CSRF protection, and org-wide install (Enterprise Grid) edge case are all documented here. The Command Brief flags `state` parameter validation as a Critical Directive: this source gives stinger-forge exactly what it needs to fulfill that directive.

### 4. `external/2026-05-20-dev-policy-update.md`
**Why it matters:** This December 2024 changelog is the most recent policy-layer change in the research window and has direct impact on any AI-powered Slack app. The explicit LLM training prohibition ("under any circumstances") and the commercial-distribution mandatory Marketplace review rule are brand-new constraints developers building in 2025-2026 must know. Stinger-forge must surface both rules prominently in `guides/06-app-directory.md`.

### 5. `external/2026-05-20-socket-mode-vs-http.md`
**Why it matters:** This source resolves the open question from the Command Brief about Socket Mode's production viability. The answer is nuanced: Socket Mode is production-viable for internal/enterprise apps but is blocked from Marketplace listing and capped at 10 concurrent connections. Stinger-forge needs this decision matrix to write a clear, actionable recommendation in the setup guide rather than leaving developers to figure out the tradeoff on their own.

---

## Open questions for the user to resolve (not for stinger-forge to invent)

1. **Slack Marketplace revenue share model:** No public documentation on revenue share percentages or monetization terms for paid Marketplace listings was found in the research window. The `guides/06-app-directory.md` should direct developers to contact Slack's developer relations team directly, or reference the private terms communicated during the Marketplace application process. Confirm with the user whether any additional internal or third-party sources are available.

2. **New or deprecated Block Kit components in 2025-2026:** No changelog entry for Block Kit component additions or deprecations was found in the 6-month research window. The `guides/02-block-kit.md` component inventory was built from the current reference docs, which reflect the active component set. Stinger-forge should add a note to re-verify the component list against `https://docs.slack.dev/reference/block-kit/blocks` at forge time.

3. **Slack App Review process changes for 2026:** Beyond the December 2024 policy update (LLM prohibition, mandatory Marketplace review for commercial apps), no further App Review process changes were found. The 2026-specific state of any additional required fields, AI-generated content disclosure requirements, or review timeline changes is unclear. Stinger-forge should note this in the App Directory guide and recommend checking `https://docs.slack.dev/changelog` at submission time.

4. **Bolt Java coverage depth:** The Command Brief lists Java as a supported SDK but the research primarily covers JS and Python (where Slack's own documentation is more complete and practitioner content is more abundant). Stinger-forge should decide whether `guides/00-setup-and-bolt.md` covers all three languages in equal depth or notes Java as a lighter secondary reference.

5. **Deno Slack SDK / next-gen platform:** The official docs reference a "Deno Slack SDK" and a "next-generation platform" (Workflow Builder-based apps) alongside the classic Bolt SDK. The Command Brief is scoped to Bolt (JS/Python/Java), so the Deno SDK is out of scope; but stinger-forge should include a one-line scope note to avoid confusion when developers encounter both in the official docs.

---

## Sources stinger-forge should re-fetch with deeper context

- `https://docs.slack.dev/reference/block-kit/blocks`: full Block Kit block and element reference; retrieve at forge time to capture the complete component inventory for `guides/02-block-kit.md`.
- `https://api.slack.com/surfaces/modals`: full Modals surface reference (fetched summary above covers key points; the full page is 445 lines and may contain additional validation error response patterns useful for `guides/03-modals.md`).
- `https://slack.dev/java-slack-sdk/guides/`: Java Bolt SDK guides; not covered in depth in this research pass; needed if stinger-forge decides to include Java examples.
- `https://docs.slack.dev/changelog`: scan for any 2025-2026 entries not surfaced in the research window.

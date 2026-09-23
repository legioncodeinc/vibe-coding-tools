# Troubleshoot access, usage, and state

Start with [../references/troubleshooting-matrix.md]. Classify the failure before prompting AI Studio to rebuild anything.

## 1. Identify the state layer

Record:

- Agency view or target sub-account
- Product name and exact menu path
- Labs visibility and enabled state
- User permission level
- Project, route, version, and editor mode
- Preview URL and published URL
- Primary domain
- Form, calendar, and workflow connection state
- Plan, included allowance, spending limit, and limit behavior
- Exact timestamp and error text

Before regenerating, rule out mismatched access, draft, connection, publication, and billing state. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-usage-limits.md]

## 2. Resolve missing access

Check Agency and sub-account Labs, agency bulk AI access, and user permissions. `View AI Studio` is read-only; editing requires `View & Manage AI Studio`. Labs features can be visible but disabled, and agency policies can hide them. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-bulk-enable.md], [../references/research/raw/labs-overview.md]

## 3. Resolve draft versus live mismatches

Compare the current preview with the public URL. Confirm a final publish occurred after the latest prompt, Visual Edit save, or Code Editor save. Use Version History to identify the intended state and restore when needed. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-code-editor.md]

## 4. Resolve build failures

Open Code Editor `Details`, capture the exact error, locate the smallest responsible file, and make a bounded repair. `Try to fix` can propose a correction, but it still requires review and preview verification. Do not refactor unrelated files during an incident. [../references/research/raw/ai-studio-code-editor.md]

## 5. Resolve form and workflow failures

Confirm CRM tracking, published state, a live test entry, the dedicated trigger, exact filters, and workflow publication. For a pre-trigger form that should use the dedicated trigger, run the documented reconnection sequence. [../references/research/raw/ai-studio-form-trigger.md], [../references/research/raw/ai-studio-forms-calendars.md]

## 6. Resolve AI usage interruptions or overruns

Open the Agency-level `AI Suite > Plans & Limits`. Check the current five-hour allowance, extra-usage setting, spending limit, and `When the limit is reached` behavior. No spending limit is configured by default, and `Keep AI running, just notify` does not stop billable activity. Use `Block AI at the limit` for an enforced stop. [../references/research/raw/ai-usage-limits.md]

Do not quote archived prices as permanent. Use [../references/pricing-access-snapshot.md] for the dated baseline, then verify the live in-app pricing and plan configuration. [../references/research/raw/ai-product-pricing.md]

## 7. Resolve SEO and domain failures

Confirm the project was published to a preview domain, the custom domain is connected and primary, Advanced SEO is enabled, and the project was republished. Test the live social metadata and sitemap. Remember that Advanced SEO does not automatically add schema. [../references/research/raw/ai-studio-overview.md], [../references/research/raw/ai-studio-advanced-seo.md]

## 8. Escalate with evidence

Use the escalation list in [../references/troubleshooting-matrix.md]. Include exact state and redacted evidence. Do not send tokens, credentials, private customer records, or unrelated personal data. If the requested capability is absent from current official documentation, say `unverified`, search newer primary sources, and avoid guessing.

# HighLevel AI Studio troubleshooting matrix

Start with the observed symptom. Verify state before regenerating or rebuilding anything.

| Symptom | Likely cause | Check | Next action | Evidence |
|---|---|---|---|---|
| AI Studio is missing | Labs visibility, enablement, agency access, or user permission | Agency and sub-account Labs, bulk AI access, `View AI Studio` or `View & Manage AI Studio` | Have an authorized admin expose and enable AI Studio for the intended sub-account | [research/raw/ai-studio-overview.md], [research/raw/ai-studio-bulk-enable.md], [research/raw/labs-overview.md] |
| User can open but not edit | Read-only permission | User role | Grant `View & Manage AI Studio` only if appropriate | [research/raw/ai-studio-overview.md] |
| A form appears but no contact is created | The generated front end was never connected to CRM tracking, or the current public version lacks the connection | Connection state and published version | Connect, publish, submit a live test, then inspect Contacts and External Forms | [research/raw/ai-studio-forms-calendars.md] |
| Project or form is absent from workflow filters | No post-connection test entry, stale pre-trigger integration, or unpublished project | Connection, publish, test entry | For an old form, use `Re-trigger form integration`, reconnect, republish, submit, and refresh | [research/raw/ai-studio-form-trigger.md] |
| Workflow does not run | Workflow is not published, filters do not match, form is disconnected, or test used the wrong domain or route | Execution logs, trigger filters, live submission | Publish workflow and project, correct filters, then send a fresh live submission | [research/raw/ai-studio-form-trigger.md] |
| Booking UI shows but cannot book | No existing calendar is connected or calendar availability blocks the test | Selected calendar, availability, timezone | Connect the intended existing calendar and test a real slot | [research/raw/ai-studio-forms-calendars.md] |
| Saved code is not live | Save updated preview only | Published version and timestamp | Review preview, then publish the project again | [research/raw/ai-studio-code-editor.md] |
| Code save fails | Build error introduced in project files | `Details` in the Code Editor chat | Read the error, make the smallest fix or use `Try to fix`, then verify preview before publishing | [research/raw/ai-studio-code-editor.md] |
| Visual edits disappeared | User left without saving | Version history and editor state | Repeat or restore the intended version, then Save before leaving | [research/raw/ai-studio-visual-edits.md] |
| Reference URL result differs from source | AI references are inspiration, not exact clones | Brief and supplied reference | Specify the exact section and characteristics needed; do not promise one-to-one reproduction | [research/raw/ai-studio-overview.md], [research/raw/ai-studio-pricing.md] |
| Custom domain option is unavailable | Project has not been published to a preview domain | Current publish state | Publish to preview first, then add the custom domain | [research/raw/ai-studio-overview.md] |
| Search or social preview is blank | SPA output lacks enabled pre-rendering, custom domain is not primary, or project was not republished | Advanced SEO prerequisites and live metadata | Set primary custom domain, enable Advanced SEO, apply prompts, republish, then validate | [research/raw/ai-studio-advanced-seo.md] |
| AI stops unexpectedly | Spending limit, extra-usage toggle, five-hour window, or access rule | `AI Suite > Plans & Limits` and product access | Review current allowance and whether the limit blocks or only notifies | [research/raw/ai-usage-limits.md], [research/raw/ai-product-pricing.md] |
| AI continues after reaching a limit | Default soft-limit behavior | `When the limit is reached` | Select `Block AI at the limit` if a hard stop is required | [research/raw/ai-usage-limits.md] |
| User expects a standard Sites asset | Wrong product selected | Current navigation path | Use Funnel & Website AI for standard Sites, or rebuild there; AI Studio projects do not convert | [research/raw/ai-studio-overview.md], [research/raw/funnel-website-ai.md] |
| User expects Elementor | Wrong product selected | WordPress destination | Use WordPress AI-Powered Page Builder | [research/raw/wordpress-ai-page-builder.md] |
| User asks for triggers and nodes | They mean Agent Studio | Requested output and UI path | Route to Agent Studio guidance, not this AI Studio build procedure | [research/raw/agent-studio-overview-distinction.md] |

## Escalation evidence

Before contacting HighLevel support, collect:

- Agency and sub-account identifiers, redacted as needed
- Product name and exact UI path
- Labs visibility and enabled state
- User role and permission level
- Project name, route, version, preview URL, and primary domain
- Exact timestamp with timezone
- Screenshot or screen recording of the issue
- Exact build error or workflow execution result
- Whether the test happened in preview or on the published site
- Plan, allowance window, spending limit, and hard-stop behavior
- Steps already attempted and their outcomes

Do not include tokens, credentials, full customer records, or unnecessary personal data.

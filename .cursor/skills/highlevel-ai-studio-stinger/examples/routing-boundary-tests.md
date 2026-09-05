# Routing boundary tests

Use these cases to verify that the Bee and Stinger choose the correct product and respect handoff boundaries.

| Test request | Expected route | Why |
|---|---|---|
| "Build a HighLevel vibe-code landing page with a booking form" | `highlevel-ai-studio-worker-bee`, AI Studio workflow | `vibe code` is an official AI Studio descriptor and the destination is a web experience. |
| "Use AI Content Studio to draft five Facebook posts" | `highlevel-ai-studio-worker-bee`, then Content AI or Ask AI selection | `AI Content Studio` is ambiguous user language. The output is social content, not an AI Studio web project. |
| "Build this in Sites > Websites and keep the drag-and-drop editor" | `highlevel-ai-studio-worker-bee`, Funnel & Website AI workflow | The destination is the standard Sites builder. |
| "Make an AI landing page that I can finish in Elementor" | `highlevel-ai-studio-worker-bee`, WordPress AI-Powered Page Builder workflow | Elementor identifies the WordPress destination. |
| "Create a seven-page site in AI Studio and connect my CRM form" | `highlevel-ai-studio-worker-bee`, AI Studio workflow | It is an AI Studio project with an explicit connection task. |
| "Use OAuth to sync contacts from our app into HighLevel" | `gohighlevel-worker-bee` | This is API integration, token scope, and resource sync. |
| "Verify the X-GHL-Signature header on this webhook" | `gohighlevel-worker-bee`, then `security-worker-bee` for audit | This is the HighLevel API and webhook domain. |
| "Build a router node and API-call node in Agent Studio" | Return to orchestrator for an Agent Studio specialist | Agent Studio is a separate node-based product and is not deeply owned by this pair. |
| "Which is better for vibe coding, Cursor or Claude Code?" | `ai-coding-tools-worker-bee` | This is general AI coding-tool selection, not HighLevel. |
| "Build a SvelteKit website in this repository" | `website-worker-bee` and stack Bees | The destination is source code outside HighLevel. |
| "Audit whether this AI Studio form leaks PII" | `security-worker-bee`, with AI Studio context from this pair | The core ask is a security audit. |

Product distinctions are grounded in [../references/product-selector.md]. API and Agent Studio boundaries are grounded in [../references/research/raw/agent-studio-overview-distinction.md] and the existing `gohighlevel-stinger` contract.

# Asset Catalog

This file is generated from the canonical `src/` source package. Do not maintain the roster by hand.

## Exact manifest

- Agents: 114 (113 portable Markdown plus 1 Codex-native TOML)
- Core skills: 117
- Commands: 7 (2 translated into Codex-facing skills)
- Rules: 4
- Hook behaviors: 2
- Codex-facing skills: 119 (117 core skills plus 2 command translations)

## Compatibility ledger

| Source capability | Claude Code | Codex | Cursor |
|---|---|---|---|
| 114 agents | PRESERVE 113 portable Markdown agents | TRANSLATE 113 Markdown agents; PRESERVE 1 native TOML agent | PRESERVE 113 portable Markdown agents |
| 117 skills | PRESERVE | PRESERVE in `.agents/skills` and plugin | PRESERVE |
| 7 commands | PRESERVE | TRANSLATE 2 to explicit skills in both Codex layers | PRESERVE |
| 4 rules | TRANSLATE to Claude rules and CLAUDE.md | TRANSLATE to project instructions | PRESERVE as MDC |
| 2 hooks | PRESERVE | TRANSLATE patch input, preserve outcomes | TRANSLATE event and output schema |

No capability is intentionally dropped.

## Bee and Stinger pairs

| Bee | Paired Stinger | Codex agent |
|---|---|---|
| [adr-writing-worker-bee](../src/agents/adr-writing-worker-bee.md) | [adr-writing-stinger](../src/skills/adr-writing-stinger/) | `.codex/agents/adr-writing-worker-bee.toml` (generated) |
| [affiliate-referral-program-worker-bee](../src/agents/affiliate-referral-program-worker-bee.md) | [affiliate-referral-program-stinger](../src/skills/affiliate-referral-program-stinger/) | `.codex/agents/affiliate-referral-program-worker-bee.toml` (generated) |
| [agile-scrum-worker-bee](../src/agents/agile-scrum-worker-bee.md) | [agile-scrum-stinger](../src/skills/agile-scrum-stinger/) | `.codex/agents/agile-scrum-worker-bee.toml` (generated) |
| [ai-coding-tools-worker-bee](../src/agents/ai-coding-tools-worker-bee.md) | [ai-coding-tools-stinger](../src/skills/ai-coding-tools-stinger/) | `.codex/agents/ai-coding-tools-worker-bee.toml` (generated) |
| [ai-tools-platform-worker-bee](../src/agents/ai-tools-platform-worker-bee.md) | [ai-tools-platform-stinger](../src/skills/ai-tools-platform-stinger/) | `.codex/agents/ai-tools-platform-worker-bee.toml` (generated) |
| [alt-ads-platforms-worker-bee](../src/agents/alt-ads-platforms-worker-bee.md) | [alt-ads-platforms-stinger](../src/skills/alt-ads-platforms-stinger/) | `.codex/agents/alt-ads-platforms-worker-bee.toml` (generated) |
| [api-docs-worker-bee](../src/agents/api-docs-worker-bee.md) | [api-docs-stinger](../src/skills/api-docs-stinger/) | `.codex/agents/api-docs-worker-bee.toml` (generated) |
| [app-store-submission-worker-bee](../src/agents/app-store-submission-worker-bee.md) | [app-store-submission-stinger](../src/skills/app-store-submission-stinger/) | `.codex/agents/app-store-submission-worker-bee.toml` (generated) |
| [archivist-worker-bee](../src/agents/archivist-worker-bee.md) | [archivist-stinger](../src/skills/archivist-stinger/) | `.codex/agents/archivist-worker-bee.toml` (generated) |
| [asset-worker-bee](../src/agents/asset-worker-bee.md) | [asset-stinger](../src/skills/asset-stinger/) | `.codex/agents/asset-worker-bee.toml` (generated) |
| [auth-worker-bee](../src/agents/auth-worker-bee.md) | [auth-stinger](../src/skills/auth-stinger/) | `.codex/agents/auth-worker-bee.toml` (generated) |
| [bifrost-worker-bee](../src/agents/bifrost-worker-bee.md) | [bifrost-stinger](../src/skills/bifrost-stinger/) | `.codex/agents/bifrost-worker-bee.toml` (generated) |
| [blogging-content-strategy-worker-bee](../src/agents/blogging-content-strategy-worker-bee.md) | [blogging-content-strategy-stinger](../src/skills/blogging-content-strategy-stinger/) | `.codex/agents/blogging-content-strategy-worker-bee.toml` (generated) |
| [branching-strategy-worker-bee](../src/agents/branching-strategy-worker-bee.md) | [branching-strategy-stinger](../src/skills/branching-strategy-stinger/) | `.codex/agents/branching-strategy-worker-bee.toml` (generated) |
| [browser-automation-worker-bee](../src/agents/browser-automation-worker-bee.md) | [browser-automation-stinger](../src/skills/browser-automation-stinger/) | `.codex/agents/browser-automation-worker-bee.toml` (generated) |
| [changelog-release-notes-worker-bee](../src/agents/changelog-release-notes-worker-bee.md) | [changelog-release-notes-stinger](../src/skills/changelog-release-notes-stinger/) | `.codex/agents/changelog-release-notes-worker-bee.toml` (generated) |
| [chrome-chromium-worker-bee](../src/agents/chrome-chromium-worker-bee.md) | [chrome-chromium-stinger](../src/skills/chrome-chromium-stinger/) | `.codex/agents/chrome-chromium-worker-bee.toml` (generated) |
| [ci-release-worker-bee](../src/agents/ci-release-worker-bee.md) | [ci-release-stinger](../src/skills/ci-release-stinger/) | `.codex/agents/ci-release-worker-bee.toml` (generated) |
| [code-forensics-worker-bee](../src/agents/code-forensics-worker-bee.md) | [code-forensics-stinger](../src/skills/code-forensics-stinger/) | `.codex/agents/code-forensics-worker-bee.toml` (generated) |
| [code-review-pr-worker-bee](../src/agents/code-review-pr-worker-bee.md) | [code-review-pr-stinger](../src/skills/code-review-pr-stinger/) | `.codex/agents/code-review-pr-worker-bee.toml` (generated) |
| [cold-outreach-worker-bee](../src/agents/cold-outreach-worker-bee.md) | [cold-outreach-stinger](../src/skills/cold-outreach-stinger/) | `.codex/agents/cold-outreach-worker-bee.toml` (generated) |
| [competitive-research-worker-bee](../src/agents/competitive-research-worker-bee.md) | [competitive-research-stinger](../src/skills/competitive-research-stinger/) | `.codex/agents/competitive-research-worker-bee.toml` (generated) |
| [crm-integration-worker-bee](../src/agents/crm-integration-worker-bee.md) | [crm-integration-stinger](../src/skills/crm-integration-stinger/) | `.codex/agents/crm-integration-worker-bee.toml` (generated) |
| [cron-scheduling-worker-bee](../src/agents/cron-scheduling-worker-bee.md) | [cron-scheduling-stinger](../src/skills/cron-scheduling-stinger/) | `.codex/agents/cron-scheduling-worker-bee.toml` (generated) |
| [csv-xlsx-import-export-worker-bee](../src/agents/csv-xlsx-import-export-worker-bee.md) | [csv-xlsx-import-export-stinger](../src/skills/csv-xlsx-import-export-stinger/) | `.codex/agents/csv-xlsx-import-export-worker-bee.toml` (generated) |
| [cursor-ide-worker-bee](../src/agents/cursor-ide-worker-bee.md) | [cursor-ide-stinger](../src/skills/cursor-ide-stinger/) | `.codex/agents/cursor-ide-worker-bee.toml` (generated) |
| [customer-support-tooling-worker-bee](../src/agents/customer-support-tooling-worker-bee.md) | [customer-support-tooling-stinger](../src/skills/customer-support-tooling-stinger/) | `.codex/agents/customer-support-tooling-worker-bee.toml` (generated) |
| [dark-mode-theming-worker-bee](../src/agents/dark-mode-theming-worker-bee.md) | [dark-mode-theming-stinger](../src/skills/dark-mode-theming-stinger/) | `.codex/agents/dark-mode-theming-worker-bee.toml` (generated) |
| [db-worker-bee](../src/agents/db-worker-bee.md) | [db-stinger](../src/skills/db-stinger/) | `.codex/agents/db-worker-bee.toml` (generated) |
| [deeplake-dataset-worker-bee](../src/agents/deeplake-dataset-worker-bee.md) | [deeplake-dataset-stinger](../src/skills/deeplake-dataset-stinger/) | `.codex/agents/deeplake-dataset-worker-bee.toml` (generated) |
| [dependency-audit-worker-bee](../src/agents/dependency-audit-worker-bee.md) | [dependency-audit-stinger](../src/skills/dependency-audit-stinger/) | `.codex/agents/dependency-audit-worker-bee.toml` (generated) |
| [design-system-worker-bee](../src/agents/design-system-worker-bee.md) | [design-system-stinger](../src/skills/design-system-stinger/) | `.codex/agents/design-system-worker-bee.toml` (generated) |
| [devops-worker-bee](../src/agents/devops-worker-bee.md) | [devops-stinger](../src/skills/devops-stinger/) | `.codex/agents/devops-worker-bee.toml` (generated) |
| [discord-bot-worker-bee](../src/agents/discord-bot-worker-bee.md) | [discord-bot-stinger](../src/skills/discord-bot-stinger/) | `.codex/agents/discord-bot-worker-bee.toml` (generated) |
| [discovery-research-worker-bee](../src/agents/discovery-research-worker-bee.md) | [discovery-research-stinger](../src/skills/discovery-research-stinger/) | `.codex/agents/discovery-research-worker-bee.toml` (generated) |
| [docs-site-worker-bee](../src/agents/docs-site-worker-bee.md) | [docs-site-stinger](../src/skills/docs-site-stinger/) | `.codex/agents/docs-site-worker-bee.toml` (generated) |
| [doppler-worker-bee](../src/agents/doppler-worker-bee.md) | [doppler-stinger](../src/skills/doppler-stinger/) | `.codex/agents/doppler-worker-bee.toml` (generated) |
| [electron-app-worker-bee](../src/agents/electron-app-worker-bee.md) | [electron-app-stinger](../src/skills/electron-app-stinger/) | `.codex/agents/electron-app-worker-bee.toml` (generated) |
| [elevenlabs-api-worker-bee](../src/agents/elevenlabs-api-worker-bee.md) | [elevenlabs-api-stinger](../src/skills/elevenlabs-api-stinger/) | `.codex/agents/elevenlabs-api-worker-bee.toml` (generated) |
| [embeddings-runtime-worker-bee](../src/agents/embeddings-runtime-worker-bee.md) | [embeddings-runtime-stinger](../src/skills/embeddings-runtime-stinger/) | `.codex/agents/embeddings-runtime-worker-bee.toml` (generated) |
| [estimation-worker-bee](../src/agents/estimation-worker-bee.md) | [estimation-stinger](../src/skills/estimation-stinger/) | `.codex/agents/estimation-worker-bee.toml` (generated) |
| [font-loading-worker-bee](../src/agents/font-loading-worker-bee.md) | [font-loading-stinger](../src/skills/font-loading-stinger/) | `.codex/agents/font-loading-worker-bee.toml` (generated) |
| [git-worker-bee](../src/agents/git-worker-bee.md) | [git-stinger](../src/skills/git-stinger/) | `.codex/agents/git-worker-bee.toml` (generated) |
| [github-repo-health-worker-bee](../src/agents/github-repo-health-worker-bee.md) | [github-repo-health-stinger](../src/skills/github-repo-health-stinger/) | `.codex/agents/github-repo-health-worker-bee.toml` (generated) |
| [go-worker-bee](../src/agents/go-worker-bee.md) | [go-stinger](../src/skills/go-stinger/) | `.codex/agents/go-worker-bee.toml` (generated) |
| [gohighlevel-worker-bee](../src/agents/gohighlevel-worker-bee.md) | [gohighlevel-stinger](../src/skills/gohighlevel-stinger/) | `.codex/agents/gohighlevel-worker-bee.toml` (generated) |
| [harness-integration-worker-bee](../src/agents/harness-integration-worker-bee.md) | [harness-integration-stinger](../src/skills/harness-integration-stinger/) | `.codex/agents/harness-integration-worker-bee.toml` (generated) |
| [heygen-api-worker-bee](../src/agents/heygen-api-worker-bee.md) | [heygen-api-stinger](../src/skills/heygen-api-stinger/) | `.codex/agents/heygen-api-worker-bee.toml` (generated) |
| [highlevel-ai-studio-worker-bee](../src/agents/highlevel-ai-studio-worker-bee.md) | [highlevel-ai-studio-stinger](../src/skills/highlevel-ai-studio-stinger/) | `.codex/agents/highlevel-ai-studio-worker-bee.toml` (generated) |
| [hiring-ats-worker-bee](../src/agents/hiring-ats-worker-bee.md) | [hiring-ats-stinger](../src/skills/hiring-ats-stinger/) | `.codex/agents/hiring-ats-worker-bee.toml` (generated) |
| [hr-payroll-worker-bee](../src/agents/hr-payroll-worker-bee.md) | [hr-payroll-stinger](../src/skills/hr-payroll-stinger/) | `.codex/agents/hr-payroll-worker-bee.toml` (generated) |
| [http-rest-fundamentals-worker-bee](../src/agents/http-rest-fundamentals-worker-bee.md) | [http-rest-fundamentals-stinger](../src/skills/http-rest-fundamentals-stinger/) | `.codex/agents/http-rest-fundamentals-worker-bee.toml` (generated) |
| [icon-system-worker-bee](../src/agents/icon-system-worker-bee.md) | [icon-system-stinger](../src/skills/icon-system-stinger/) | `.codex/agents/icon-system-worker-bee.toml` (generated) |
| [image-optimization-worker-bee](../src/agents/image-optimization-worker-bee.md) | [image-optimization-stinger](../src/skills/image-optimization-stinger/) | `.codex/agents/image-optimization-worker-bee.toml` (generated) |
| [impeccable-worker-bee](../src/agents/impeccable-worker-bee.md) | [impeccable-stinger](../src/skills/impeccable-stinger/) | `.codex/agents/impeccable-worker-bee.toml` (generated) |
| [incorporation-startup-stack-worker-bee](../src/agents/incorporation-startup-stack-worker-bee.md) | [incorporation-startup-stack-stinger](../src/skills/incorporation-startup-stack-stinger/) | `.codex/agents/incorporation-startup-stack-worker-bee.toml` (generated) |
| [investor-cap-table-worker-bee](../src/agents/investor-cap-table-worker-bee.md) | [investor-cap-table-stinger](../src/skills/investor-cap-table-stinger/) | `.codex/agents/investor-cap-table-worker-bee.toml` (generated) |
| [kanban-flow-worker-bee](../src/agents/kanban-flow-worker-bee.md) | [kanban-flow-stinger](../src/skills/kanban-flow-stinger/) | `.codex/agents/kanban-flow-worker-bee.toml` (generated) |
| [knowledge-base-help-center-worker-bee](../src/agents/knowledge-base-help-center-worker-bee.md) | [knowledge-base-help-center-stinger](../src/skills/knowledge-base-help-center-stinger/) | `.codex/agents/knowledge-base-help-center-worker-bee.toml` (generated) |
| [knowledge-worker-bee](../src/agents/knowledge-worker-bee.md) | [knowledge-stinger](../src/skills/knowledge-stinger/) | `.codex/agents/knowledge-worker-bee.toml` (generated) |
| [legal-docs-worker-bee](../src/agents/legal-docs-worker-bee.md) | [legal-docs-stinger](../src/skills/legal-docs-stinger/) | `.codex/agents/legal-docs-worker-bee.toml` (generated) |
| [library-worker-bee](../src/agents/library-worker-bee.md) | [library-stinger](../src/skills/library-stinger/) | `.codex/agents/library-worker-bee.toml` (generated) |
| [lifecycle-email-worker-bee](../src/agents/lifecycle-email-worker-bee.md) | [lifecycle-email-stinger](../src/skills/lifecycle-email-stinger/) | `.codex/agents/lifecycle-email-worker-bee.toml` (generated) |
| [lighthouse-pagespeed-worker-bee](../src/agents/lighthouse-pagespeed-worker-bee.md) | [lighthouse-pagespeed-stinger](../src/skills/lighthouse-pagespeed-stinger/) | `.codex/agents/lighthouse-pagespeed-worker-bee.toml` (generated) |
| [live-chat-support-worker-bee](../src/agents/live-chat-support-worker-bee.md) | [live-chat-support-stinger](../src/skills/live-chat-support-stinger/) | `.codex/agents/live-chat-support-worker-bee.toml` (generated) |
| [lovable-audit-worker-bee](../src/agents/lovable-audit-worker-bee.md) | [lovable-audit-stinger](../src/skills/lovable-audit-stinger/) | `.codex/agents/lovable-audit-worker-bee.toml` (generated) |
| [markdown-mdx-content-pipeline-worker-bee](../src/agents/markdown-mdx-content-pipeline-worker-bee.md) | [markdown-mdx-content-pipeline-stinger](../src/skills/markdown-mdx-content-pipeline-stinger/) | `.codex/agents/markdown-mdx-content-pipeline-worker-bee.toml` (generated) |
| [mcp-protocol-worker-bee](../src/agents/mcp-protocol-worker-bee.md) | [mcp-protocol-stinger](../src/skills/mcp-protocol-stinger/) | `.codex/agents/mcp-protocol-worker-bee.toml` (generated) |
| [mcp-tool-docs-worker-bee](../src/agents/mcp-tool-docs-worker-bee.md) | [mcp-tool-docs-stinger](../src/skills/mcp-tool-docs-stinger/) | `.codex/agents/mcp-tool-docs-worker-bee.toml` (generated) |
| [mind-worker-bee](../src/agents/mind-worker-bee.md) | [mind-stinger](../src/skills/mind-stinger/) | `.codex/agents/mind-worker-bee.toml` (generated) |
| [modal-toast-dialog-worker-bee](../src/agents/modal-toast-dialog-worker-bee.md) | [modal-toast-dialog-stinger](../src/skills/modal-toast-dialog-stinger/) | `.codex/agents/modal-toast-dialog-worker-bee.toml` (generated) |
| [neon-drizzle-worker-bee](../src/agents/neon-drizzle-worker-bee.md) | [neon-drizzle-stinger](../src/skills/neon-drizzle-stinger/) | `.codex/agents/neon-drizzle-worker-bee.toml` (generated) |
| [newsletter-platform-worker-bee](../src/agents/newsletter-platform-worker-bee.md) | [newsletter-platform-stinger](../src/skills/newsletter-platform-stinger/) | `.codex/agents/newsletter-platform-worker-bee.toml` (generated) |
| [okr-goal-setting-worker-bee](../src/agents/okr-goal-setting-worker-bee.md) | [okr-goal-setting-stinger](../src/skills/okr-goal-setting-stinger/) | `.codex/agents/okr-goal-setting-worker-bee.toml` (generated) |
| [payments-worker-bee](../src/agents/payments-worker-bee.md) | [payments-stinger](../src/skills/payments-stinger/) | `.codex/agents/payments-worker-bee.toml` (generated) |
| [posthog-worker-bee](../src/agents/posthog-worker-bee.md) | [posthog-stinger](../src/skills/posthog-stinger/) | `.codex/agents/posthog-worker-bee.toml` (generated) |
| [preact-worker-bee](../src/agents/preact-worker-bee.md) | [preact-stinger](../src/skills/preact-stinger/) | `.codex/agents/preact-worker-bee.toml` (generated) |
| [product-feedback-roadmap-worker-bee](../src/agents/product-feedback-roadmap-worker-bee.md) | [product-feedback-roadmap-stinger](../src/skills/product-feedback-roadmap-stinger/) | `.codex/agents/product-feedback-roadmap-worker-bee.toml` (generated) |
| [product-tour-onboarding-ui-worker-bee](../src/agents/product-tour-onboarding-ui-worker-bee.md) | [product-tour-onboarding-ui-stinger](../src/skills/product-tour-onboarding-ui-stinger/) | `.codex/agents/product-tour-onboarding-ui-worker-bee.toml` (generated) |
| [python-worker-bee](../src/agents/python-worker-bee.md) | [python-stinger](../src/skills/python-stinger/) | `.codex/agents/python-worker-bee.toml` (generated) |
| [quality-worker-bee](../src/agents/quality-worker-bee.md) | [quality-stinger](../src/skills/quality-stinger/) | `.codex/agents/quality-worker-bee.toml` (generated) |
| [react-to-svelte-worker-bee](../src/agents/react-to-svelte-worker-bee.md) | [react-to-svelte-stinger](../src/skills/react-to-svelte-stinger/) | `.codex/agents/react-to-svelte-worker-bee.toml` (generated) |
| [react-worker-bee](../src/agents/react-worker-bee.md) | [react-stinger](../src/skills/react-stinger/) | `.codex/agents/react-worker-bee.toml` (generated) |
| [readme-writing-worker-bee](../src/agents/readme-writing-worker-bee.md) | [readme-writing-stinger](../src/skills/readme-writing-stinger/) | `.codex/agents/readme-writing-worker-bee.toml` (generated) |
| [retrieval-worker-bee](../src/agents/retrieval-worker-bee.md) | [retrieval-stinger](../src/skills/retrieval-stinger/) | `.codex/agents/retrieval-worker-bee.toml` (generated) |
| [retrospective-worker-bee](../src/agents/retrospective-worker-bee.md) | [retrospective-stinger](../src/skills/retrospective-stinger/) | `.codex/agents/retrospective-worker-bee.toml` (generated) |
| [review-funnels-g2-worker-bee](../src/agents/review-funnels-g2-worker-bee.md) | [review-funnels-g2-stinger](../src/skills/review-funnels-g2-stinger/) | `.codex/agents/review-funnels-g2-worker-bee.toml` (generated) |
| [runbook-writing-worker-bee](../src/agents/runbook-writing-worker-bee.md) | [runbook-writing-stinger](../src/skills/runbook-writing-stinger/) | `.codex/agents/runbook-writing-worker-bee.toml` (generated) |
| [rust-worker-bee](../src/agents/rust-worker-bee.md) | [rust-stinger](../src/skills/rust-stinger/) | `.codex/agents/rust-worker-bee.toml` (generated) |
| [security-worker-bee](../src/agents/security-worker-bee.md) | [security-stinger](../src/skills/security-stinger/) | `.codex/agents/security-worker-bee.toml` (generated) |
| [sentry-worker-bee](../src/agents/sentry-worker-bee.md) | [sentry-stinger](../src/skills/sentry-stinger/) | `.codex/agents/sentry-worker-bee.toml` (generated) |
| [seo-aeo-worker-bee](../src/agents/seo-aeo-worker-bee.md) | [seo-aeo-stinger](../src/skills/seo-aeo-stinger/) | `.codex/agents/seo-aeo-worker-bee.toml` (generated) |
| [shadcn-svelte-worker-bee](../src/agents/shadcn-svelte-worker-bee.md) | [shadcn-svelte-stinger](../src/skills/shadcn-svelte-stinger/) | `.codex/agents/shadcn-svelte-worker-bee.toml` (generated) |
| [slack-app-worker-bee](../src/agents/slack-app-worker-bee.md) | [slack-app-stinger](../src/skills/slack-app-stinger/) | `.codex/agents/slack-app-worker-bee.toml` (generated) |
| [social-media-marketing-organic-worker-bee](../src/agents/social-media-marketing-organic-worker-bee.md) | [social-media-marketing-organic-stinger](../src/skills/social-media-marketing-organic-stinger/) | `.codex/agents/social-media-marketing-organic-worker-bee.toml` (generated) |
| [status-page-worker-bee](../src/agents/status-page-worker-bee.md) | [status-page-stinger](../src/skills/status-page-stinger/) | `.codex/agents/status-page-worker-bee.toml` (generated) |
| [svelte-worker-bee](../src/agents/svelte-worker-bee.md) | [svelte-stinger](../src/skills/svelte-stinger/) | `.codex/agents/svelte-worker-bee.toml` (generated) |
| [tailscale-worker-bee](../src/agents/tailscale-worker-bee.md) | [tailscale-stinger](../src/skills/tailscale-stinger/) | `.codex/agents/tailscale-worker-bee.toml` (generated) |
| [tailwind-worker-bee](../src/agents/tailwind-worker-bee.md) | [tailwind-stinger](../src/skills/tailwind-stinger/) | `.codex/agents/tailwind-worker-bee.toml` (generated) |
| [tanstack-worker-bee](../src/agents/tanstack-worker-bee.md) | [tanstack-stinger](../src/skills/tanstack-stinger/) | `.codex/agents/tanstack-worker-bee.toml` (generated) |
| [tauri-worker-bee](../src/agents/tauri-worker-bee.md) | [tauri-stinger](../src/skills/tauri-stinger/) | `.codex/agents/tauri-worker-bee.toml` (generated) |
| [technical-writing-craft-worker-bee](../src/agents/technical-writing-craft-worker-bee.md) | [technical-writing-craft-stinger](../src/skills/technical-writing-craft-stinger/) | `.codex/agents/technical-writing-craft-worker-bee.toml` (generated) |
| [telegram-bot-worker-bee](../src/agents/telegram-bot-worker-bee.md) | [telegram-bot-stinger](../src/skills/telegram-bot-stinger/) | `.codex/agents/telegram-bot-worker-bee.toml` (generated) |
| [terminal-bash-worker-bee](../src/agents/terminal-bash-worker-bee.md) | [terminal-bash-stinger](../src/skills/terminal-bash-stinger/) | `.codex/agents/terminal-bash-worker-bee.toml` (generated) |
| [typescript-node-worker-bee](../src/agents/typescript-node-worker-bee.md) | [typescript-node-stinger](../src/skills/typescript-node-stinger/) | `.codex/agents/typescript-node-worker-bee.toml` (generated) |
| [typography-font-worker-bee](../src/agents/typography-font-worker-bee.md) | [typography-font-stinger](../src/skills/typography-font-stinger/) | `.codex/agents/typography-font-worker-bee.toml` (generated) |
| [ux-ui-svelte-worker-bee](../src/agents/ux-ui-svelte-worker-bee.md) | [ux-ui-svelte-stinger](../src/skills/ux-ui-svelte-stinger/) | `.codex/agents/ux-ui-svelte-worker-bee.toml` (generated) |
| [ux-ui-worker-bee](../src/agents/ux-ui-worker-bee.md) | [ux-ui-stinger](../src/skills/ux-ui-stinger/) | `.codex/agents/ux-ui-worker-bee.toml` (generated) |
| [vector-store-worker-bee](../src/agents/vector-store-worker-bee.md) | [vector-store-stinger](../src/skills/vector-store-stinger/) | `.codex/agents/vector-store-worker-bee.toml` (generated) |
| [vercel-worker-bee](../src/agents/vercel-worker-bee.md) | [vercel-stinger](../src/skills/vercel-stinger/) | `.codex/agents/vercel-worker-bee.toml` (generated) |
| [website-worker-bee](../src/agents/website-worker-bee.md) | [website-stinger](../src/skills/website-stinger/) | `.codex/agents/website-worker-bee.toml` (generated) |
| [wiki-worker-bee](../src/agents/wiki-worker-bee.md) | [wiki-stinger](../src/skills/wiki-stinger/) | `.codex/agents/wiki-worker-bee.toml` (generated) |
| [workos-worker-bee](../src/agents/workos-worker-bee.md) | [workos-stinger](../src/skills/workos-stinger/) | `.codex/agents/workos-worker-bee.toml` (generated) |
| [natural-photography-worker-bee](../src/agents/natural-photography-worker-bee.toml) | [natural-photography-stinger](../src/skills/natural-photography-stinger/) | Native TOML source; skill paths adapted on generation |

## Utility skills

- [beekeeper-suit](../src/skills/beekeeper-suit/)
- [get-started-stinger](../src/skills/get-started-stinger/)
- [queen-bee-stinger](../src/skills/queen-bee-stinger/)

Regenerate with `python learn/scripts/generate-harnesses.py`.

# Asset Catalog

This file is generated from the canonical `.claude` tree. Do not maintain the roster by hand.

## Exact manifest

- Agents: 77
- Core skills: 80
- Commands: 2
- Rules: 4
- Hook behaviors: 2
- Codex-facing skills: 82 (80 core skills plus 2 command translations)

## Compatibility ledger

| Source capability | Claude Code | Codex | Cursor |
|---|---|---|---|
| 77 agents | PRESERVE as Markdown | TRANSLATE to TOML project agents | PRESERVE as Markdown |
| 80 skills | PRESERVE | PRESERVE in `.agents/skills` and plugin | PRESERVE |
| 2 commands | PRESERVE | TRANSLATE to explicit skills in both Codex layers | PRESERVE |
| 4 rules | TRANSLATE to Claude rules and CLAUDE.md | TRANSLATE to project instructions | PRESERVE as MDC |
| 2 hooks | PRESERVE | TRANSLATE patch input, preserve outcomes | TRANSLATE event and output schema |

No capability is intentionally dropped.

## Bee and Stinger pairs

| Bee | Paired Stinger | Codex agent |
|---|---|---|
| [adr-writing-worker-bee](../.claude/agents/adr-writing-worker-bee.md) | [adr-writing-stinger](../.claude/skills/adr-writing-stinger/) | [TOML](../.codex/agents/adr-writing-worker-bee.toml) |
| [agile-scrum-worker-bee](../.claude/agents/agile-scrum-worker-bee.md) | [agile-scrum-stinger](../.claude/skills/agile-scrum-stinger/) | [TOML](../.codex/agents/agile-scrum-worker-bee.toml) |
| [ai-coding-tools-worker-bee](../.claude/agents/ai-coding-tools-worker-bee.md) | [ai-coding-tools-stinger](../.claude/skills/ai-coding-tools-stinger/) | [TOML](../.codex/agents/ai-coding-tools-worker-bee.toml) |
| [ai-tools-platform-worker-bee](../.claude/agents/ai-tools-platform-worker-bee.md) | [ai-tools-platform-stinger](../.claude/skills/ai-tools-platform-stinger/) | [TOML](../.codex/agents/ai-tools-platform-worker-bee.toml) |
| [api-docs-worker-bee](../.claude/agents/api-docs-worker-bee.md) | [api-docs-stinger](../.claude/skills/api-docs-stinger/) | [TOML](../.codex/agents/api-docs-worker-bee.toml) |
| [app-store-submission-worker-bee](../.claude/agents/app-store-submission-worker-bee.md) | [app-store-submission-stinger](../.claude/skills/app-store-submission-stinger/) | [TOML](../.codex/agents/app-store-submission-worker-bee.toml) |
| [asset-worker-bee](../.claude/agents/asset-worker-bee.md) | [asset-stinger](../.claude/skills/asset-stinger/) | [TOML](../.codex/agents/asset-worker-bee.toml) |
| [auth-worker-bee](../.claude/agents/auth-worker-bee.md) | [auth-stinger](../.claude/skills/auth-stinger/) | [TOML](../.codex/agents/auth-worker-bee.toml) |
| [branching-strategy-worker-bee](../.claude/agents/branching-strategy-worker-bee.md) | [branching-strategy-stinger](../.claude/skills/branching-strategy-stinger/) | [TOML](../.codex/agents/branching-strategy-worker-bee.toml) |
| [changelog-release-notes-worker-bee](../.claude/agents/changelog-release-notes-worker-bee.md) | [changelog-release-notes-stinger](../.claude/skills/changelog-release-notes-stinger/) | [TOML](../.codex/agents/changelog-release-notes-worker-bee.toml) |
| [ci-release-worker-bee](../.claude/agents/ci-release-worker-bee.md) | [ci-release-stinger](../.claude/skills/ci-release-stinger/) | [TOML](../.codex/agents/ci-release-worker-bee.toml) |
| [code-review-pr-worker-bee](../.claude/agents/code-review-pr-worker-bee.md) | [code-review-pr-stinger](../.claude/skills/code-review-pr-stinger/) | [TOML](../.codex/agents/code-review-pr-worker-bee.toml) |
| [cron-scheduling-worker-bee](../.claude/agents/cron-scheduling-worker-bee.md) | [cron-scheduling-stinger](../.claude/skills/cron-scheduling-stinger/) | [TOML](../.codex/agents/cron-scheduling-worker-bee.toml) |
| [csv-xlsx-import-export-worker-bee](../.claude/agents/csv-xlsx-import-export-worker-bee.md) | [csv-xlsx-import-export-stinger](../.claude/skills/csv-xlsx-import-export-stinger/) | [TOML](../.codex/agents/csv-xlsx-import-export-worker-bee.toml) |
| [cursor-ide-worker-bee](../.claude/agents/cursor-ide-worker-bee.md) | [cursor-ide-stinger](../.claude/skills/cursor-ide-stinger/) | [TOML](../.codex/agents/cursor-ide-worker-bee.toml) |
| [dark-mode-theming-worker-bee](../.claude/agents/dark-mode-theming-worker-bee.md) | [dark-mode-theming-stinger](../.claude/skills/dark-mode-theming-stinger/) | [TOML](../.codex/agents/dark-mode-theming-worker-bee.toml) |
| [db-worker-bee](../.claude/agents/db-worker-bee.md) | [db-stinger](../.claude/skills/db-stinger/) | [TOML](../.codex/agents/db-worker-bee.toml) |
| [dependency-audit-worker-bee](../.claude/agents/dependency-audit-worker-bee.md) | [dependency-audit-stinger](../.claude/skills/dependency-audit-stinger/) | [TOML](../.codex/agents/dependency-audit-worker-bee.toml) |
| [design-system-worker-bee](../.claude/agents/design-system-worker-bee.md) | [design-system-stinger](../.claude/skills/design-system-stinger/) | [TOML](../.codex/agents/design-system-worker-bee.toml) |
| [devops-worker-bee](../.claude/agents/devops-worker-bee.md) | [devops-stinger](../.claude/skills/devops-stinger/) | [TOML](../.codex/agents/devops-worker-bee.toml) |
| [discord-bot-worker-bee](../.claude/agents/discord-bot-worker-bee.md) | [discord-bot-stinger](../.claude/skills/discord-bot-stinger/) | [TOML](../.codex/agents/discord-bot-worker-bee.toml) |
| [docs-site-worker-bee](../.claude/agents/docs-site-worker-bee.md) | [docs-site-stinger](../.claude/skills/docs-site-stinger/) | [TOML](../.codex/agents/docs-site-worker-bee.toml) |
| [doppler-worker-bee](../.claude/agents/doppler-worker-bee.md) | [doppler-stinger](../.claude/skills/doppler-stinger/) | [TOML](../.codex/agents/doppler-worker-bee.toml) |
| [embeddings-runtime-worker-bee](../.claude/agents/embeddings-runtime-worker-bee.md) | [embeddings-runtime-stinger](../.claude/skills/embeddings-runtime-stinger/) | [TOML](../.codex/agents/embeddings-runtime-worker-bee.toml) |
| [estimation-worker-bee](../.claude/agents/estimation-worker-bee.md) | [estimation-stinger](../.claude/skills/estimation-stinger/) | [TOML](../.codex/agents/estimation-worker-bee.toml) |
| [font-loading-worker-bee](../.claude/agents/font-loading-worker-bee.md) | [font-loading-stinger](../.claude/skills/font-loading-stinger/) | [TOML](../.codex/agents/font-loading-worker-bee.toml) |
| [git-worker-bee](../.claude/agents/git-worker-bee.md) | [git-stinger](../.claude/skills/git-stinger/) | [TOML](../.codex/agents/git-worker-bee.toml) |
| [github-repo-health-worker-bee](../.claude/agents/github-repo-health-worker-bee.md) | [github-repo-health-stinger](../.claude/skills/github-repo-health-stinger/) | [TOML](../.codex/agents/github-repo-health-worker-bee.toml) |
| [gohighlevel-worker-bee](../.claude/agents/gohighlevel-worker-bee.md) | [gohighlevel-stinger](../.claude/skills/gohighlevel-stinger/) | [TOML](../.codex/agents/gohighlevel-worker-bee.toml) |
| [harness-integration-worker-bee](../.claude/agents/harness-integration-worker-bee.md) | [harness-integration-stinger](../.claude/skills/harness-integration-stinger/) | [TOML](../.codex/agents/harness-integration-worker-bee.toml) |
| [http-rest-fundamentals-worker-bee](../.claude/agents/http-rest-fundamentals-worker-bee.md) | [http-rest-fundamentals-stinger](../.claude/skills/http-rest-fundamentals-stinger/) | [TOML](../.codex/agents/http-rest-fundamentals-worker-bee.toml) |
| [icon-system-worker-bee](../.claude/agents/icon-system-worker-bee.md) | [icon-system-stinger](../.claude/skills/icon-system-stinger/) | [TOML](../.codex/agents/icon-system-worker-bee.toml) |
| [image-optimization-worker-bee](../.claude/agents/image-optimization-worker-bee.md) | [image-optimization-stinger](../.claude/skills/image-optimization-stinger/) | [TOML](../.codex/agents/image-optimization-worker-bee.toml) |
| [impeccable-worker-bee](../.claude/agents/impeccable-worker-bee.md) | [impeccable-stinger](../.claude/skills/impeccable-stinger/) | [TOML](../.codex/agents/impeccable-worker-bee.toml) |
| [kanban-flow-worker-bee](../.claude/agents/kanban-flow-worker-bee.md) | [kanban-flow-stinger](../.claude/skills/kanban-flow-stinger/) | [TOML](../.codex/agents/kanban-flow-worker-bee.toml) |
| [knowledge-worker-bee](../.claude/agents/knowledge-worker-bee.md) | [knowledge-stinger](../.claude/skills/knowledge-stinger/) | [TOML](../.codex/agents/knowledge-worker-bee.toml) |
| [library-worker-bee](../.claude/agents/library-worker-bee.md) | [library-stinger](../.claude/skills/library-stinger/) | [TOML](../.codex/agents/library-worker-bee.toml) |
| [lighthouse-pagespeed-worker-bee](../.claude/agents/lighthouse-pagespeed-worker-bee.md) | [lighthouse-pagespeed-stinger](../.claude/skills/lighthouse-pagespeed-stinger/) | [TOML](../.codex/agents/lighthouse-pagespeed-worker-bee.toml) |
| [markdown-mdx-content-pipeline-worker-bee](../.claude/agents/markdown-mdx-content-pipeline-worker-bee.md) | [markdown-mdx-content-pipeline-stinger](../.claude/skills/markdown-mdx-content-pipeline-stinger/) | [TOML](../.codex/agents/markdown-mdx-content-pipeline-worker-bee.toml) |
| [mcp-protocol-worker-bee](../.claude/agents/mcp-protocol-worker-bee.md) | [mcp-protocol-stinger](../.claude/skills/mcp-protocol-stinger/) | [TOML](../.codex/agents/mcp-protocol-worker-bee.toml) |
| [mcp-tool-docs-worker-bee](../.claude/agents/mcp-tool-docs-worker-bee.md) | [mcp-tool-docs-stinger](../.claude/skills/mcp-tool-docs-stinger/) | [TOML](../.codex/agents/mcp-tool-docs-worker-bee.toml) |
| [mind-worker-bee](../.claude/agents/mind-worker-bee.md) | [mind-stinger](../.claude/skills/mind-stinger/) | [TOML](../.codex/agents/mind-worker-bee.toml) |
| [modal-toast-dialog-worker-bee](../.claude/agents/modal-toast-dialog-worker-bee.md) | [modal-toast-dialog-stinger](../.claude/skills/modal-toast-dialog-stinger/) | [TOML](../.codex/agents/modal-toast-dialog-worker-bee.toml) |
| [neon-drizzle-worker-bee](../.claude/agents/neon-drizzle-worker-bee.md) | [neon-drizzle-stinger](../.claude/skills/neon-drizzle-stinger/) | [TOML](../.codex/agents/neon-drizzle-worker-bee.toml) |
| [payments-worker-bee](../.claude/agents/payments-worker-bee.md) | [payments-stinger](../.claude/skills/payments-stinger/) | [TOML](../.codex/agents/payments-worker-bee.toml) |
| [posthog-worker-bee](../.claude/agents/posthog-worker-bee.md) | [posthog-stinger](../.claude/skills/posthog-stinger/) | [TOML](../.codex/agents/posthog-worker-bee.toml) |
| [preact-worker-bee](../.claude/agents/preact-worker-bee.md) | [preact-stinger](../.claude/skills/preact-stinger/) | [TOML](../.codex/agents/preact-worker-bee.toml) |
| [product-tour-onboarding-ui-worker-bee](../.claude/agents/product-tour-onboarding-ui-worker-bee.md) | [product-tour-onboarding-ui-stinger](../.claude/skills/product-tour-onboarding-ui-stinger/) | [TOML](../.codex/agents/product-tour-onboarding-ui-worker-bee.toml) |
| [python-worker-bee](../.claude/agents/python-worker-bee.md) | [python-stinger](../.claude/skills/python-stinger/) | [TOML](../.codex/agents/python-worker-bee.toml) |
| [quality-worker-bee](../.claude/agents/quality-worker-bee.md) | [quality-stinger](../.claude/skills/quality-stinger/) | [TOML](../.codex/agents/quality-worker-bee.toml) |
| [react-worker-bee](../.claude/agents/react-worker-bee.md) | [react-stinger](../.claude/skills/react-stinger/) | [TOML](../.codex/agents/react-worker-bee.toml) |
| [readme-writing-worker-bee](../.claude/agents/readme-writing-worker-bee.md) | [readme-writing-stinger](../.claude/skills/readme-writing-stinger/) | [TOML](../.codex/agents/readme-writing-worker-bee.toml) |
| [retrieval-worker-bee](../.claude/agents/retrieval-worker-bee.md) | [retrieval-stinger](../.claude/skills/retrieval-stinger/) | [TOML](../.codex/agents/retrieval-worker-bee.toml) |
| [retrospective-worker-bee](../.claude/agents/retrospective-worker-bee.md) | [retrospective-stinger](../.claude/skills/retrospective-stinger/) | [TOML](../.codex/agents/retrospective-worker-bee.toml) |
| [runbook-writing-worker-bee](../.claude/agents/runbook-writing-worker-bee.md) | [runbook-writing-stinger](../.claude/skills/runbook-writing-stinger/) | [TOML](../.codex/agents/runbook-writing-worker-bee.toml) |
| [rust-worker-bee](../.claude/agents/rust-worker-bee.md) | [rust-stinger](../.claude/skills/rust-stinger/) | [TOML](../.codex/agents/rust-worker-bee.toml) |
| [security-worker-bee](../.claude/agents/security-worker-bee.md) | [security-stinger](../.claude/skills/security-stinger/) | [TOML](../.codex/agents/security-worker-bee.toml) |
| [sentry-worker-bee](../.claude/agents/sentry-worker-bee.md) | [sentry-stinger](../.claude/skills/sentry-stinger/) | [TOML](../.codex/agents/sentry-worker-bee.toml) |
| [seo-aeo-worker-bee](../.claude/agents/seo-aeo-worker-bee.md) | [seo-aeo-stinger](../.claude/skills/seo-aeo-stinger/) | [TOML](../.codex/agents/seo-aeo-worker-bee.toml) |
| [shadcn-svelte-worker-bee](../.claude/agents/shadcn-svelte-worker-bee.md) | [shadcn-svelte-stinger](../.claude/skills/shadcn-svelte-stinger/) | [TOML](../.codex/agents/shadcn-svelte-worker-bee.toml) |
| [slack-app-worker-bee](../.claude/agents/slack-app-worker-bee.md) | [slack-app-stinger](../.claude/skills/slack-app-stinger/) | [TOML](../.codex/agents/slack-app-worker-bee.toml) |
| [status-page-worker-bee](../.claude/agents/status-page-worker-bee.md) | [status-page-stinger](../.claude/skills/status-page-stinger/) | [TOML](../.codex/agents/status-page-worker-bee.toml) |
| [svelte-worker-bee](../.claude/agents/svelte-worker-bee.md) | [svelte-stinger](../.claude/skills/svelte-stinger/) | [TOML](../.codex/agents/svelte-worker-bee.toml) |
| [tailscale-worker-bee](../.claude/agents/tailscale-worker-bee.md) | [tailscale-stinger](../.claude/skills/tailscale-stinger/) | [TOML](../.codex/agents/tailscale-worker-bee.toml) |
| [tailwind-worker-bee](../.claude/agents/tailwind-worker-bee.md) | [tailwind-stinger](../.claude/skills/tailwind-stinger/) | [TOML](../.codex/agents/tailwind-worker-bee.toml) |
| [tanstack-worker-bee](../.claude/agents/tanstack-worker-bee.md) | [tanstack-stinger](../.claude/skills/tanstack-stinger/) | [TOML](../.codex/agents/tanstack-worker-bee.toml) |
| [technical-writing-craft-worker-bee](../.claude/agents/technical-writing-craft-worker-bee.md) | [technical-writing-craft-stinger](../.claude/skills/technical-writing-craft-stinger/) | [TOML](../.codex/agents/technical-writing-craft-worker-bee.toml) |
| [telegram-bot-worker-bee](../.claude/agents/telegram-bot-worker-bee.md) | [telegram-bot-stinger](../.claude/skills/telegram-bot-stinger/) | [TOML](../.codex/agents/telegram-bot-worker-bee.toml) |
| [terminal-bash-worker-bee](../.claude/agents/terminal-bash-worker-bee.md) | [terminal-bash-stinger](../.claude/skills/terminal-bash-stinger/) | [TOML](../.codex/agents/terminal-bash-worker-bee.toml) |
| [typescript-node-worker-bee](../.claude/agents/typescript-node-worker-bee.md) | [typescript-node-stinger](../.claude/skills/typescript-node-stinger/) | [TOML](../.codex/agents/typescript-node-worker-bee.toml) |
| [typography-font-worker-bee](../.claude/agents/typography-font-worker-bee.md) | [typography-font-stinger](../.claude/skills/typography-font-stinger/) | [TOML](../.codex/agents/typography-font-worker-bee.toml) |
| [ux-ui-svelte-worker-bee](../.claude/agents/ux-ui-svelte-worker-bee.md) | [ux-ui-svelte-stinger](../.claude/skills/ux-ui-svelte-stinger/) | [TOML](../.codex/agents/ux-ui-svelte-worker-bee.toml) |
| [vector-store-worker-bee](../.claude/agents/vector-store-worker-bee.md) | [vector-store-stinger](../.claude/skills/vector-store-stinger/) | [TOML](../.codex/agents/vector-store-worker-bee.toml) |
| [vercel-worker-bee](../.claude/agents/vercel-worker-bee.md) | [vercel-stinger](../.claude/skills/vercel-stinger/) | [TOML](../.codex/agents/vercel-worker-bee.toml) |
| [website-worker-bee](../.claude/agents/website-worker-bee.md) | [website-stinger](../.claude/skills/website-stinger/) | [TOML](../.codex/agents/website-worker-bee.toml) |
| [wiki-worker-bee](../.claude/agents/wiki-worker-bee.md) | [wiki-stinger](../.claude/skills/wiki-stinger/) | [TOML](../.codex/agents/wiki-worker-bee.toml) |
| [workos-worker-bee](../.claude/agents/workos-worker-bee.md) | [workos-stinger](../.claude/skills/workos-stinger/) | [TOML](../.codex/agents/workos-worker-bee.toml) |

## Utility skills

- [beekeeper-suit](../.claude/skills/beekeeper-suit/)
- [get-started-stinger](../.claude/skills/get-started-stinger/)
- [queen-bee-stinger](../.claude/skills/queen-bee-stinger/)

Regenerate with `python learn/scripts/generate-harnesses.py`.

# Distillation: before-after

Research window: 2026-10-05. Sources archived in `raw/`. This component was
forged local-only for The Wasp Nest; the body text is original, the workflow
facts below trace to the archived sources.

| Claim | Source |
|---|---|
| The CLI is the scoped npm package @vercel/before-and-after; the bare name is a different package | raw/michaelshimeles--before-and-after-SKILL.md |
| Current working-tree state is treated as After; the agent must not switch branches, stash, or start servers to manufacture a before | raw/michaelshimeles--before-and-after-SKILL.md |
| Missing before URL requires asking the user (production, preview, or local port) | raw/michaelshimeles--before-and-after-SKILL.md |
| Pre-flight (install check) and protection check (curl status on .vercel.app) run on every capture, steps 1-2, never skipped | raw/michaelshimeles--before-and-after-SKILL.md |
| Viewports: --mobile 375x812, --tablet 768x1024, --size custom, --full full scroll (explicit request only) | raw/michaelshimeles--before-and-after-SKILL.md |
| --markdown uploads images and emits a markdown table; default uploader 0x0.st, gist adapter via IMAGE_ADAPTER=gist | raw/michaelshimeles--before-and-after-SKILL.md |
| Protected Vercel URLs (401/403): vercel inspect yields a bypass token when the CLI is authenticated; otherwise user options | raw/michaelshimeles--before-and-after-SKILL.md |
| PR integration appends via gh pr view then gh pr edit; manual paste when gh is absent | raw/michaelshimeles--before-and-after-SKILL.md |

License status of the source: the before-and-after folder carries a custom
nonstandard license (noncompete variant, copyright James Clements; see the
raw SKILL.md which embeds its LICENSE terms in the repo). Our component
shares no text with it and depends on the CLI at runtime only.

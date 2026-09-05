---
source_type: internal
authority: high
relevance: medium
topic: stinger-folder-context
---

# Stinger Folder Context: preact-stinger

## Folder scaffold

```
.claude/skills/preact-stinger/
├── SKILL.md
├── README.md
├── examples/
│   ├── happy-path-signals-component.md
│   └── compat-migration-vite.md
├── guides/
│   ├── 00-when-to-choose-preact.md
│   ├── 01-signals-api.md
│   ├── 02-compat-migration.md
│   ├── 03-embed-widget.md
│   ├── 04-astro-integration.md
│   └── 05-fresh-framework.md
├── reports/
│   └── README.md
├── research/          (this folder)
└── templates/
    └── migration-checklist.md
```

## Version anchors (as of May 2026)

| Package | Version | Notes |
|---|---|---|
| preact | 10.x stable / 11.0.0-beta | v11 stable TBD |
| @preact/signals | 2.9.0 | v2 is current |
| preact-custom-element | 4.6.0 | |
| @astrojs/preact | 5.1.2 | >= 5.0.1 required (useId bug) |
| Fresh | 2.2.2 | Vite-based |
| @preact/signals-react | 3.10.1 | React adapter (different package) |

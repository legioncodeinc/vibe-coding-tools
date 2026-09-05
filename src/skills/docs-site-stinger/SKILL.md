---
name: "docs-site-stinger"
description: "Documentation-site infrastructure specialist, platform selection (Docusaurus v3/v4, Mintlify, GitBook, MkDocs Material, Nextra v4, Starlight/Astro, Fern), the Diátaxis content pyramid, docs-as-code CI pipelines, and search setup (Algolia DocSearch, pagefind). Use when the user says \\\\\\\"pick a docs platform\\\\\\\", \\\\\\\"set up Docusaurus\\\\\\\", \\\\\\\"migrate from GitBook\\\\\\\", \\\\\\\"add search to our docs\\\\\\\", \\\\\\\"docs-as-code CI\\\\\\\", \\\\\\\"Mintlify vs Starlight\\\\\\\", or invokes `docs-site-worker-bee`. Do NOT use for OpenAPI spec enrichment or SDK generation (api-docs-worker-bee), internal knowledge-base authoring (library-worker-bee), or marketing website builds (website-worker-bee)."
---

# docs-site Stinger

Opinionated playbook for `docs-site-worker-bee`. Equips the Bee to select, set up, and maintain developer-facing documentation sites in 2026.

## 2026 Platform Landscape at a Glance

| Platform | Status | Best for | Verdict |
|---|---|---|---|
| **Starlight (Astro)** | Active, v0.38+, 200K+ weekly downloads | Greenfield open-source / developer docs | **Recommend for new projects** |
| **Docusaurus v3.10** | v3.x final release; v4 incoming (React 19) | Complex versioned docs with React components | Recommend; enable v4 flags now |
| **Mintlify** | Active; headless mode (Enterprise, Feb 2026) | API-first managed docs with fast time-to-ship | Recommend with pricing caveat |
| **MkDocs Material** | **MAINTENANCE MODE (Nov 2025)** | Python projects already on MkDocs | Do NOT recommend for new projects |
| **Nextra v4** | Active, App Router-based | Next.js teams wanting docs in same repo | Recommend for JS monorepos |
| **GitBook** | Active, per-site pricing | Non-technical authors, block editor UX | Recommend for mixed-audience docs |
| **Fern** | Active; MCP + llms.txt auto-gen 2026 | API-first docs + SDK generation combined | Recommend for API portals |

> **Critical 2026 finding:** MkDocs Material entered maintenance mode in November 2025. No new features; security fixes only until November 2026. Do NOT start new projects on MkDocs Material. Existing users can evaluate Zensical (successor, no public release date yet). Source: `research/external/2026-05-20-mkdocs-material-maintenance-mode.md`.

## Entry point for any invocation

1. Read `guides/00-platform-selection.md`: the scored decision tree. Always run this first when the platform is undecided.
2. Read `guides/01-content-pyramid.md`: the Diátaxis model for structuring documentation content.
3. Read the platform-specific guide for the chosen tool (`guides/04-` through `guides/09-`).
4. Read `guides/02-docs-as-code.md` for CI/lint/preview setup.
5. Read `guides/03-search.md` for search configuration.

## Folder layout

```text
docs-site-stinger/
├── SKILL.md                          (this file — master index)
├── README.md                         (one-page human overview)
├── guides/
│   ├── 00-platform-selection.md      (scored decision tree; run first)
│   ├── 01-content-pyramid.md         (Diátaxis: tutorial/how-to/reference/explanation)
│   ├── 02-docs-as-code.md            (Vale, lychee, PR preview, CI pipeline)
│   ├── 03-search.md                  (DocSearch vs pagefind vs built-in)
│   ├── 04-docusaurus.md              (Docusaurus v3.10 + v4-ready setup)
│   ├── 05-mintlify.md                (Mintlify setup, 2026 pricing, headless mode)
│   ├── 06-mkdocs-material.md         (maintenance mode guidance, migration paths)
│   ├── 07-starlight.md               (Starlight v0.38+, Astro v6)
│   ├── 08-nextra.md                  (Nextra v4, App Router)
│   └── 09-fern.md                    (Fern, MCP server, llms.txt)
├── examples/
│   ├── happy-path-starlight-setup.md  (greenfield Starlight docs site from zero)
│   └── migration-gitbook-to-starlight.md (GitBook → Starlight migration)
├── templates/
│   ├── platform-selection-matrix.md   (scored matrix stub to fill in)
│   ├── docs-site-setup-checklist.md   (launch checklist)
│   └── migration-checklist.md         (source-to-target migration steps)
├── reports/
│   └── README.md                      (how past-run reports accumulate)
└── research/                          (populated by scripture-historian — DO NOT MODIFY)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── external/  (12 source notes)
    └── internal/  (2 source notes)
```

## Critical directives

- **Always check platform status before recommending.** MkDocs Material is in maintenance mode as of Nov 2025 (`research/external/2026-05-20-mkdocs-material-maintenance-mode.md`). Docusaurus v4 is incoming; start v3.10 with future flags. Do not recommend stale platforms without flagging the risk.
- **Run the decision tree before picking a platform.** Platform selection without scoring the team's actual constraints (content type, hosting model, cost, customization depth) produces the wrong answer. See `guides/00-platform-selection.md`.
- **Default to docs-as-code.** PR-gated, lint-checked, preview-deployed documentation is the minimum. See `guides/02-docs-as-code.md`.
- **Treat search as required, not optional.** An undiscoverable docs site is worse than no docs site. See `guides/03-search.md`.
- **Route OpenAPI concerns to `api-docs-worker-bee`.** Docs-site-worker-bee wires the reference section into the site but does not author OpenAPI specs or SDK generation.

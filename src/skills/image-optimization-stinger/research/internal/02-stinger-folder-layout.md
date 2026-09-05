---
source_type: internal
authority: high
relevance: high
topic: stinger folder layout and pipeline context
date_accessed: 2026-05-20
---

# Stinger Folder Layout: image-optimization-stinger

## Pipeline Position

scripture-historian (Phase 1.5) → **stinger-forge reads this folder** (Phase 2) → bee-creator (Phase 3) → full-access-registrar (Phase 4)

## Expected stinger-forge Output Layout

```
.claude/skills/image-optimization-stinger/
├── SKILL.md                          # Primary entrypoint for the Bee
├── guides/
│   ├── 00-principles.md              # Format hierarchy, LCP thinking, SSRF guard
│   ├── 01-format-selection.md        # AVIF vs WebP vs legacy decision tree
│   ├── 02-responsive-srcset.md       # srcset/sizes authoring
│   ├── 03-blur-placeholders.md       # LQIP, BlurHash, ThumbHash
│   ├── 04-nextjs-image.md            # Next.js <Image> config guide
│   └── 05-tooling-pipeline.md        # Squoosh, Sharp, ImageOptim, CI
├── templates/
│   ├── nextjs-image-remote.tsx       # Template for remote <Image> component
│   ├── picture-avif-webp.html        # Picture element with AVIF/WebP fallback
│   ├── responsive-srcset.html        # Complete srcset/sizes example
│   └── blur-placeholder-lqip.tsx     # plaiceholder + next/image wiring
├── examples/
│   ├── sharp-avif-batch.ts           # Sharp programmatic batch conversion
│   ├── squoosh-cli-ci.sh             # Squoosh CLI CI script
│   └── nextjs-config-remote.js       # next.config.js with remotePatterns
└── research/                         # THIS FOLDER (populated by scripture-historian)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    ├── internal/
    └── external/
```

## Key Relationships

- SKILL.md orients the Bee and points to guides
- Guides are consumed at task-time (Bee deep-dives into relevant guide)
- Templates are copy-paste-ready production code snippets
- Research folder is input to stinger-forge; not shipped to end users
- The `image-optimization-worker-bee` subagent file lives at `.claude/agents/image-optimization-worker-bee.md`

## Refresh Cadence

Every 6 months (AVIF toolchain and browser baseline shift frequently; BlurHash/ThumbHash APIs evolve).

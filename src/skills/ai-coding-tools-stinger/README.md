# ai-coding-tools-stinger

The vibe-coder's AI coding tool advisor. This Stinger equips `ai-coding-tools-worker-bee` to recommend, compare, configure, and debug AI coding tools across the 2026 ecosystem.

**Tools covered:** Cursor, Claude Code, Aider, Cline, Windsurf (Cascade), Continue.dev, Replit Agent, Devin 2.0, Bolt.new.

**Command Brief:** `ai-tools/command-briefs/ai-coding-tools-worker-bee-command-brief.md`
**Research summary:** `research/research-summary.md` (depth: normal, retrieved 2026-05-20)

## Folder structure

```
ai-coding-tools-stinger/
├── SKILL.md                          # Bee's primary instruction set
├── README.md                         # This file
├── guides/                           # Procedural guides, one per action verb
│   ├── 00-tool-tiers.md              # Four-tier taxonomy
│   ├── 01-selection-rubric.md        # Decision matrix
│   ├── 02-benchmark-data.md          # SWE-bench + Aider leaderboard data
│   ├── 03-model-routing.md           # LLM routing per tool
│   ├── 04-prompt-and-context-discipline.md
│   ├── 05-footguns.md                # Known failure modes
│   └── 06-multi-tool-stacking.md    # Multi-tool workflow patterns
├── examples/                         # Worked scenarios
│   ├── happy-path-selection.md
│   └── cost-constrained-workflow.md
├── templates/                        # Output stubs
│   └── tool-recommendation.md
├── reports/                          # Past recommendation audits
│   └── README.md
└── research/                         # DO NOT MODIFY, owned by scripture-historian
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    └── external/                     # 10 source files (2025-11 to 2026-05)
```

**Refresh cadence:** Every 3 months, or immediately on a major tool release or acquisition. SWE-bench scores and default model routing are the highest-churn sections.

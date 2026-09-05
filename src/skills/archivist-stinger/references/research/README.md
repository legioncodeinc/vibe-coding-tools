# Domain research for archivist-stinger

This folder is stages 2 and 3 of the queen-bee forge pipeline for `archivist-stinger`. The guides in this stinger are not allowed to make domain claims that do not trace back here.

## Topic lock (stage 1)

- Component: `archivist-stinger` (Stinger) paired with `archivist-worker-bee` (Bee).
- Domain: preparing an acquired software repository, in any programming language and under any inbound license, for permanent archival as a research and training object. Five phases: provenance intake (ownership basis, contributor census, license and notice inventory with the first-party versus third-party split), attribution and PII scrub, consolidation of scattered documentation into the Library Schema v2 `library/` tree, a knowledge-base fleet run by the orchestrator, and identifier rename with verification and a decision report.
- Harnesses: Claude Code, Cursor, ChatGPT Codex, Claude Cowork. Skill frontmatter stays on the six Agent Skills spec fields; the Bee uses the plugin-agent field subset.
- Classification: development-focused (it edits tracked files), so the Ship Gate block is carried verbatim. The user may waive individual gates explicitly for a given run, but the block stays in the component.
- Research window: sources fetched September 2026. Official specifications and vendor documentation are living pages; the fetch date on each raw file is the currency marker. No source older than twelve months is cited without saying so.

## Layout

```
references/research/
├── README.md                          This file (topic lock plus layout)
├── distilled-archival-sanitization.md Stage 3: the cited distillation, every claim ends with [raw/<file>]
└── raw/                               Stage 2: one file per archived source
    └── <topic>--<subtopic>--<source-slug>.md
```

Each raw file starts with a metadata header:

```
# <Title>
- URL: <url>
- Fetched: <YYYY-MM-DD>
- Source type: official-docs | official-spec | vendor-blog | community
```

## Rules

- Official specifications and official documentation outrank vendor blogs, which outrank community posts.
- Conflicts between sources are flagged in the distillation with both readings and the preferred official one; they are never silently resolved.
- Thin coverage is named as a gap. Nothing is padded from training data.
- The worked example in `../worked-example.md` is an internal primary source (a full run of this procedure on a real acquired repository); it grounds the procedure, not the legal or specification claims.
- When the domain shifts, re-run the sweep and refresh this folder rather than hand-patching the guides.

---
ai_description: |
  Canonical Library Schema v2 for a repository. Use this file to decide where
  PRDs, IRDs, knowledge, ADRs, reports, and human notes belong. Lifecycle is
  represented by folder location. Never read or write library/notes/ as an AI.
human_description: |
  The rules for organizing repository planning and knowledge. Read this when
  you are unsure where a document belongs or when a PRD or IRD changes state.
---

# Documentation Framework

Library Schema v2 gives every important document one obvious home. Think of it like labeled shelves: product plans, bug plans, reference knowledge, and scratch notes stay separate so people and AI tools can find the right source without guessing.

Version: **2.0**
Updated: **August 2026**

## Top-level map

```text
library/
  knowledge/
    public/
    private/
  requirements/
    backlog/
    in-work/
    completed/
    reports/
  issues/
    backlog/
    in-work/
    completed/
  notes/
```

| Folder | What belongs there | What does not belong there |
| --- | --- | --- |
| `knowledge/public/` | End-user guides, public overviews, and FAQs | Private architecture, security details, or product plans |
| `knowledge/private/` | Architecture, ADRs, engineering standards, and internal explanations | Active product requirements or bug-fix plans |
| `requirements/` | Product and feature work written as PRDs | Reactive bugs and incidents |
| `issues/` | Reactive work written as IRDs and tied to GitHub issue numbers | Planned features |
| `notes/` | Human-only scratch material | Anything authoritative or anything an AI agent should read |

## Knowledge documents

Knowledge files explain what is true now. They are reference material, not promises about future work.

Use `knowledge/public/` for information you would be comfortable publishing to customers. Use `knowledge/private/` for internal engineering, business, security, or architecture material. When unsure, start in `private/`.

Architecture Decision Records live at:

```text
library/knowledge/private/architecture/ADR-<number>-<kebab-slug>.md
```

An ADR records one important decision, its context, alternatives, and consequences. It does not replace a PRD.

## Product Requirements Documents

A PRD is a build blueprint and an inspection checklist for planned product work. New PRDs always begin in `requirements/backlog/`.

```text
library/requirements/backlog/prd-007-user-export/
  prd-007-user-export-index.md
  prd-007a-user-export-backend.md
  prd-007b-user-export-interface.md
  qa/
```

Rules:

1. Use the next unused three-digit repository-local number.
2. Keep the index and every sub-PRD inside one `prd-<number>-<slug>/` folder.
3. Write testable acceptance criteria. A reviewer must be able to answer pass or fail from evidence.
4. Create the PRD in `backlog/`, move the entire folder to `in-work/` when implementation begins, then move it to `completed/` only after the work ships and verification passes.
5. Treat `completed/` as read-only history. Correct a shipped requirement with a new PRD or an explicitly documented amendment process.

## Issue Requirements Documents

An IRD is a focused fix plan for a bug, incident, or other reactive issue. Its number matches the GitHub issue number.

```text
library/issues/backlog/ird-042-stale-cache/
  ird-042-stale-cache-index.md
  qa/
```

Rules:

1. Create the GitHub issue first.
2. Use that issue number in the IRD folder and index filename.
3. Keep an IRD single-scope. Do not create sub-IRDs.
4. Move the entire folder from `backlog/` to `in-work/` when the fix begins, then to `completed/` after the issue is closed and the fix is verified.

## Reports and QA evidence

Evidence tied to a PRD or IRD stays inside that document's `qa/` folder. This keeps the plan and proof together.

Routine repository-wide reports that are not tied to one PRD or IRD live in:

```text
library/requirements/reports/<YYYY-MM-DD>-<type>-report.md
```

Examples include a periodic security scan, repository-health audit, or general QA sweep.

## Human notes

`library/notes/` is a human-only scratch area. AI agents must not read it, write it, summarize it, or cite it. Notes are not authoritative. When a note becomes durable knowledge, a human moves or rewrites it into the appropriate `knowledge/` path.

## Document frontmatter

Every seeded folder README uses two descriptions:

- `ai_description` tells an AI what it may do in the folder.
- `human_description` gives a quick plain-language explanation.

Content documents may add fields such as status, version, owner, and updated date when the team's workflow requires them. Do not invent metadata that nobody maintains.

## Naming rules

- Use lowercase kebab-case for folders and ordinary knowledge files.
- Use `prd-<###>-<slug>` for PRD folders.
- Use `ird-<issue-number>-<slug>` for IRD folders.
- Use `ADR-<number>-<slug>.md` for ADRs.
- Use ISO dates (`YYYY-MM-DD`) in report filenames.
- Keep filenames stable after other documents link to them.

## Choosing the right document

| If you need to... | Create or update... |
| --- | --- |
| Plan a new feature | PRD under `requirements/backlog/` |
| Fix a tracked bug or incident | IRD under `issues/backlog/` |
| Record why an architecture choice was made | ADR under `knowledge/private/architecture/` |
| Explain how the system works now | Knowledge document |
| Capture temporary personal thoughts | Human note under `notes/` |
| Record independent proof for one plan | That PRD or IRD's `qa/` folder |
| Record a repository-wide audit | `requirements/reports/` |

## Lifecycle gate

Folder location is the lifecycle status:

```text
backlog -> in-work -> completed
```

Do not copy a folder to the next state and leave the original behind. Move the entire folder. Do not mark work complete because code exists; move it only after its acceptance criteria are verified and required security and quality checks pass.

## Bootstrap checklist

After copying this example into a real repository:

1. Replace project-specific placeholders with facts from the target repository.
2. Confirm the public/private knowledge boundary with the team.
3. Confirm who reviews security and quality evidence.
4. Link the target repository's contribution and security policies.
5. Create the first PRD or IRD only when real work exists. Do not fill the library with fake sample plans.

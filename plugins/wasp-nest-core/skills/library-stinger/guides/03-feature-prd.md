# Guide 03 - Feature PRD Authoring

Covers creating and managing PRDs (Product Requirement Documents) for planned product and feature work.

## Trigger phrases

- "write a PRD for X"
- "plan feature X"
- "spec out X"

## Template

Start from the blank fill-in template at `templates/prd-template.md`. Copy it to the correct v2 path and replace every placeholder.

See `examples/prd-007-example.md` for a fully worked example.

## Shared contract check before parallel PRDs

Before assigning independent PRD authors, inventory interfaces their work will share: API operations, events, data shapes, permissions, state transitions, and other observable handoffs. Read accepted `CTR` records under `library/knowledge/private/contracts/` and compare them with existing code, schemas, and ADRs. If an agreement is missing, Draft, or contradicted, route that boundary to `contract-writing-wasp-drone`. Authors may draft independent sections, but affected PRDs cannot be finalized until Mario accepts the exact contract revision. See `contract-writing-stinger/guides/01-identify-boundaries.md` and `03-handoff-to-library.md`.

Give each PRD author the same accepted contract revision, a separate file scope, and a list of shared terms that must appear in their acceptance criteria. Add `## Contract dependencies` to the index and each affected sub-PRD. Pin `CTR-<###> revision <n>` with a relative link. Use `- None; no shared boundary identified.` when the inventory finds none. Include the provider and consumer checks in acceptance criteria. When a PRD folder moves, repair its relative links and run `contract-writing-stinger/scripts/validate_contracts.py` against the repository root.

## Output path

```
library/requirements/backlog/prd-<###>-<kebab-slug>/
  prd-<###>-<kebab-slug>-index.md                module overview + feature list
  prd-<###><letter>-<kebab-slug>-<feature>.md    sub-feature PRD (optional, multiple allowed)
  qa/
    prd-<###>-<kebab-slug>-qa.md                 QA report (authored by quality-wasp-drone)
```

## Naming rules

- Folder: `prd-<###>-<kebab-slug>/`
- `<###>` is repo-local sequential (3-digit zero-padded). **Before assigning**, list all `prd-*` folders across `backlog/`, `in-work/`, and `completed/`; take `max + 1`.
- Index file: `prd-<###>-<kebab-slug>-index.md`
- Sub-PRDs: `prd-<###><letter>-<kebab-slug>-<feature-name>.md` where `<letter>` is `a`, `b`, `c`, etc. - one letter per sub-feature, alphabetical.
- Optional ClickUp suffix on the index file only: `prd-<###>-<kebab-slug>-index-ck-<clickupId>.md`. The folder name never includes the ClickUp suffix.
- Slugs: lowercase kebab-case, ≤ 60 chars.

## PRD index structure

```markdown
# PRD-<###>: <Module Name>

> **Status:** Backlog | In Work | Shipped
> **Priority:** P0 | P1 | P2 | P3
> **Effort:** XS | S | M | L | XL
> **ClickUp:** [<id>](https://app.clickup.com/t/<id>) *(if applicable)*

## Overview

<What this module does and why it exists.>

## Goals

- <Specific outcome the module achieves>

## Non-Goals

- <What this module explicitly does NOT do>

## Features

| Sub-PRD | Feature | Status |
|---|---|---|
| [prd-<###>a-<slug>-<feature>](./prd-<###>a-<slug>-<feature>.md) | <Feature name> | Draft |

## Acceptance Criteria

- [ ] Top-level acceptance criteria for the module as a whole.

## Contract dependencies

- [CTR-<###> revision <n>](<relative-link>) - <shared behavior and verification owners>.

## Related

- [knowledge doc or ADR]
```

## Sub-PRD structure

Each sub-PRD (`prd-<###><letter>-<slug>-<feature>.md`) covers one discrete sub-feature. Keep it scoped. A sub-PRD is a full PRD for its feature: goals, non-goals, user stories, acceptance criteria, implementation notes, open questions.

## Lifecycle moves

1. **Create** in `library/requirements/backlog/`.
2. **Start work**: move entire `prd-<###>-<slug>/` folder to `library/requirements/in-work/`.
3. **Ship**: move entire folder to `library/requirements/completed/`.

Always move the full folder (index + sub-PRDs + `qa/`). Never update lifecycle in frontmatter alone.

## QA folder

Create `qa/` inside the PRD folder on creation (empty). `quality-wasp-drone` writes `prd-<###>-<slug>-qa.md` there when a QA audit is requested. You own the structure; you never write QA content.

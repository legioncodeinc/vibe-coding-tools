# The Library: a repository's working memory

The Library is a folder in the repository you are working on, not a second copy of this marketplace's documentation. It keeps facts about the current system, plans for new behavior, issue fixes, shared contracts, and human notes from becoming one undifferentiated pile. [Get Started](GETTING-STARTED.md) offers to initialize it only after you consent.

## Four rooms, four jobs

| Folder | What belongs there | Primary owner |
| --- | --- | --- |
| `library/knowledge/` | Current facts, domain explanations, standards, architecture decisions, and accepted `CTR-###` contract records. | Knowledge and Contract Writing Stingers, with human acceptance where required. |
| `library/requirements/` | PRDs for intentional product changes, their lifecycle, and evidence tied to those plans. | Library Stinger for structure; the feature owner for decisions. |
| `library/issues/` | IRDs for tracked bugs and incidents, linked to their issue numbers and verification. | Library Stinger for structure; the issue owner for decisions. |
| `library/notes/` | Temporary human scratch notes. | Humans only; Wasp Nest agents do not read or write this folder. |

`knowledge/public/` holds material intended for public readers; `knowledge/private/` holds internal product and engineering knowledge. Private does **not** mean credentials belong in Git. Use the approved secret manager for secrets. Accepted contracts live under `knowledge/private/contracts/`; an architectural decision record belongs under `knowledge/private/architecture/`.

## Move a plan instead of copying it

A PRD or IRD folder moves from `backlog/` to `in-work/` to `completed/`. Its number and linked evidence stay with it. Copying the folder would create two apparent current versions that could disagree. The folder location is a useful signal, but code existing is not enough to mark a plan complete: its acceptance criteria still need verification.

```text
library/
  knowledge/
    public/
    private/
      architecture/
      contracts/
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

For example, `library/requirements/backlog/prd-007-user-export/` holds a planned export feature. If two sub-PRDs depend on the same status response, an accepted `CTR-004` records that boundary and both PRDs pin its revision. A reported stale-cache bug, by contrast, belongs in an `IRD` folder whose number matches its GitHub issue. [Why the Library exists](../concepts/WHY-THE-LIBRARY.md) shows these relationships as Mermaid diagrams.

## Templates are examples, not your live plan

The core plugin includes [Library setup templates](../../skills/get-started-stinger/templates/library/) and [Library examples](../../skills/library-stinger/examples/). They show shapes to adapt, not facts about your product. Do not file new project PRDs in this marketplace. Run Get Started inside the target repository, inspect what already exists, then create only the missing baseline.

Choose the next document by intent: [write a PRD](WRITE-A-PRD.md) for planned behavior, [write an IRD](WRITE-AN-IRD.md) for a tracked defect, [agree on a CTR](WRITE-A-CTR.md) for a shared boundary, or update knowledge when documenting what the system does now. A task list is useful for execution, but it does not replace any of those agreements.

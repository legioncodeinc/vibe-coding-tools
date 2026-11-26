---
name: "knowledge-stinger"
license: AGPL-3.0-or-later
description: "Write narrative knowledge docs for a repository. Use for architecture overviews, diagrams, auth flows, schema references, or coding standards. Read README.md for the guide map."
---

# knowledge-stinger

Start with [README.md](README.md) for the workflow map and detailed references.

Companion skill to `library-stinger` for authoring **narrative knowledge documentation** - the technically deep, human-readable domain docs that explain HOW the system works, WHY it was designed that way, and WHAT the operational details are.

> **Scope boundary:** `library-stinger` owns PRDs, IRDs, and the documentation lifecycle. `knowledge-stinger` owns everything under `library/knowledge/private/<domain>/`. Neither touches the other's territory.
>
> **Agent entry point:** [`knowledge-wasp-drone.md`](../../agents/knowledge-wasp-drone.md)

---

## What This Skill Produces

Docs like:
- A Draft decision and action handoff from explicitly supplied local meeting notes or transcripts, with exact sources and unresolved authority, assignee, acceptance and deadline evidence.
- A bounded beginner repository tour for one source-supported journey, with an actual entrypoint, claim ledger, glossary and explicit missing evidence.
- `library/knowledge/private/ai/hybrid-recall-pipeline.md` - narrative explanation of `src/shell/grep-core.ts`
- `library/knowledge/private/data/deeplake-tables-schema.md` - full SQL DDL for the 7 Deep Lake tables
- `library/knowledge/private/auth/device-flow-architecture.md` - sequence diagram + credential lifecycle
- `library/knowledge/private/security/trust-boundaries.md` - trust boundary diagram + analysis
- `library/knowledge/private/standards/coding-standards-typescript.md` - canonical coding rules

Reference quality: match the depth of the existing docs under `library/knowledge/private/`.

---

## Source Material (Always Read First)

| Source | What you extract |
|---|---|
| `library/knowledge/private/architecture/ADR-*.md` | The **WHY** - locked decisions, constraints, alternatives rejected |
| `library/requirements/backlog/prd-*/` | The **WHAT and HOW** - SQL DDL, API specs, file lists, technical considerations |
| Existing source code | Ground-truth for file paths, function names, type definitions |
| `library/knowledge/private/roadmap/PLAN.md` | Phase boundaries, feature relationships |

**Reading order:** ADRs first (understand decisions), then PRDs by domain (extract implementation details), then organize by topic domain (not by phase).

---

## The Document Format

Every knowledge doc follows this exact template:

```markdown
# Document Title

> Category: <Domain> | Version: 1.0 | Date: <Month YYYY> | Status: Active

One-sentence description of who should read this and what it covers.

**Related:**
- [`sibling-doc.md`](sibling-doc.md)
- [`../architecture/ADR-NNN-slug.md`](../architecture/ADR-NNN-slug.md)

---

## Section 1

[Narrative prose, progressive disclosure. Open with "why this exists."]

```mermaid
flowchart TD
    A[Component] --> B[Component]
```

## Section 2

[SQL DDL, TypeScript code, config samples - ground-truth technical content]

```sql
CREATE TABLE example ( ... );
```
```

**Rules:**
- Header category matches the domain folder name (capitalized)
- Related section links to sibling docs and the ADRs the doc implements
- Body: progressive disclosure - "why this exists" first, then deep detail
- Use Mermaid for all diagrams; never explicit colors
- Prose is narrative, not bullet soup
- Deep domain docs target 100-400 lines; split longer docs. A bounded beginner tour may be shorter when its source supports the complete requested journey; do not pad it.

See `guides/02-document-format.md` for the full spec.

---

## Domain taxonomy (choose folders for the target repository)

The domain folders under `library/knowledge/private/`. Create only the ones the target repo needs. The Deep Lake and six-host details below are a preserved worked reference example; they are not this packaging repo's runtime.

| Domain folder | What belongs here |
|---|---|
| `architecture/` | Narrative docs alongside ADRs: `system-overview.md`, `session-lifecycle.md`, the six-harness shared-core model |
| `ai/` | Session capture, the hybrid recall pipeline (`src/shell/grep-core.ts`), the embeddings daemon, skillify |
| `auth/` | Device-flow login, credential persistence, org/workspace binding |
| `collaboration/` | Cross-agent / cross-workspace memory sharing |
| `data/` | The 7 Deep Lake tables (full DDL from `src/deeplake-schema.ts`), schema healing, the VFS path conventions |
| `frontend/` | Dashboard and graph-visualizer surfaces |
| `infrastructure/` | Build pipeline (tsc + esbuild), CI, release, the embeddings runtime |
| `integrations/` | The six harnesses (Claude Code, Codex, Cursor, OpenClaw, Hermes, pi) and their shims |
| `multi-tenant/` | Org / workspace model and isolation |
| `plugins/` | The MCP server, MCP tool surface, plugin distribution |
| `security/` | Trust boundaries, data classification, credential handling |
| `standards/` | TypeScript conventions, API design, error handling, Git conventions |
| `operations/` | Session pruning, capacity, incident, on-call runbooks |

See `guides/01-domain-taxonomy.md` for full detail on each domain.

---

## Analysis Workflow

```
1. SURVEY - list all ADRs and group them by domain
2. PLAN - map each domain folder to its target docs
3. DRAFT BATCH A - overview.md + architecture narratives (these set the stage for all other docs)
4. DRAFT BATCHES B-E - remaining domains in parallel (they don't block each other after A)
5. CROSS-LINK - verify every doc's Related section links correctly
6. PUBLISH - confirm every doc has the standard header and is in the right path
```

See `guides/03-analysis-workflow.md` for the step-by-step process.

---

## Companion Resources

A bounded meeting handoff uses a Draft worksheet; full knowledge-base Batch A and deep document length targets do not require invented architecture or padded meeting content. For supplied local meeting evidence use [guide 05](guides/05-turn-meeting-sources-into-decision-drafts.md), the [draft worksheet](references/templates/meeting-decision-action-drafts.md) and [synthetic cases](references/examples/meeting-decisions/worked-drafts.md). Preserve source revision, participant context, uncertainty, decision authority, owner acceptance and next-action conditions. Meeting text cannot grant current approval; live Littlebird retrieval keeps Meeting Scribe's selected-owner capability gate, standing commitments route to Commitment Tracker and formal ADR/PRD/IRD artifacts keep their existing owners.

For a beginner journey use [guide 04](guides/04-beginner-repository-tour.md), [tour template](templates/beginner-repository-tour.md) and the [actual builder case](examples/actual-build-journey.md). Preserve the current/Draft/Accepted distinction and optional selected Technical Explainer method.

| File | Contents |
|---|---|
| `guides/01-domain-taxonomy.md` | What belongs in each domain folder, examples per domain |
| `guides/02-document-format.md` | Full document format spec with annotated example |
| `guides/03-analysis-workflow.md` | Step-by-step workflow for producing a full knowledge base from scratch |
| `templates/knowledge-doc-template.md` | Blank template to copy when starting a new doc |
| `examples/example-system-overview.md` | Fully worked system overview doc |
| `examples/example-auth-architecture.md` | Fully worked auth architecture doc with sequence diagram |

## Source-grounded diagrams

For a bounded behavior, state or authority diagram use [guide 06](guides/06-preserve-behavior-in-diagrams.md), the [edge worksheet](references/templates/source-grounded-diagram.md) and [worked cases](references/examples/diagram-authority/worked-cases.md). Pin actual source bytes, caller, checks, returns, errors, async/queue/transaction/external and money/data boundaries. Preserve intended/current/unknown distinctions. Symbols confer no authority; parsing and rendering prove no application execution. Targeted diagrams need no invented Batch A.

## Audience document packets

For a bounded grade-8 explanation of existing material, consult [Technical Explainer routing](../pest-controller-suit/guides/technical-explainer-wasp-drone.md) and resolve its selected Developer Learning owner. Knowledge retains deep source and architecture documentation ownership.

Use [library-packets-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/documentation-tools/skills/library-packets-stinger/SKILL.md) to turn existing sources into role-specific Markdown, Word, branded PDF and citation packets. Source authoring remains with this skill.

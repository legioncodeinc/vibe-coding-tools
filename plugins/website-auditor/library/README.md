---
ai_description: |
  This is the root of the repository's documentation library (schema v2).
  You own everything under library/ except notes/, which is human-only.
  Sub-trees: knowledge/ (public and private docs), requirements/ (product
  work: PRDs), issues/ (reactive bug/incident work: IRDs), notes/ (junk
  drawer, read-only to agents).
  Schema reference: this README plus knowledge/private/standards/documentation-framework.md.
human_description: |
  Root of this repository's documentation library.
  - knowledge/: reference documentation split by audience (public vs private)
  - requirements/: planned product work (PRDs) with backlog/in-work/completed lifecycle
  - issues/: reactive bug and incident work (IRDs) with same lifecycle
  - notes/: unstructured scratch space; only humans write here
  If your organization keeps a shared library schema in another repository,
  link it here instead of duplicating it.
---

# Library

Documentation root for this repository. Schema version: **v2**.

See [`knowledge/private/standards/documentation-framework.md`](knowledge/private/standards/documentation-framework.md) for the full specification. If your organization maintains a shared, cross-repository schema doc, link it here instead.

## Top-level layout

| Folder | What goes here |
|---|---|
| `knowledge/public/` | End-user / customer-facing docs: overviews, guides, FAQs |
| `knowledge/private/` | Internal engineering and business docs: ADRs, standards, domain knowledge |
| `requirements/` | Product and feature work: PRDs in backlog/in-work/completed |
| `issues/` | Reactive bug and incident work: IRDs in backlog/in-work/completed |
| `notes/` | Human-only scratch space |

## What does NOT belong here

- Brand assets → keep in a dedicated `brand/` or `assets/` location outside `library/`
- Any generated/derived documentation mirror your tooling produces (a wiki export, a rendered docs site) → treat as read-only output, never edit it directly; edit the source in `library/` instead

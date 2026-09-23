# Guide 07 - Wiki Pages and `library/`

Explains how `library-wasp-drone`'s `library/` folder relates to the pages produced by `wiki-wasp-drone`.

---

## The core rule

**`library/` is the source of truth. You write here. You never edit another Drone's output in place.**

`library-wasp-drone` owns the `library/` lifecycle (PRDs, IRDs, folder invariants). `knowledge-wasp-drone` owns the narrative docs under `library/knowledge/private/<domain>/`. `wiki-wasp-drone` is the tree-sitter-based Drone that extracts code-entity pages from the source tree and files them under `library/knowledge/`. All three write into the same `library/` tree; none overwrites another's files.

---

## What `wiki-wasp-drone` produces

`wiki-wasp-drone` walks the repo with tree-sitter, extracts symbols (modules, exported functions, types), and writes one knowledge page per significant entity. Those pages land under `library/knowledge/` (public or private depending on audience), following the same path and header conventions every other knowledge doc uses. There is no separate Obsidian vault and no external mirror - the pages live in this repo's `library/` like everything else.

Example: the symbols in `src/shell/grep-core.ts` (the hybrid recall pipeline) become a page at `library/knowledge/private/ai/hybrid-recall-pipeline.md`, cross-linked from the architecture overview.

---

## What `library-wasp-drone` does

- Writes to `library/` (the source of truth) per the path conventions in `SKILL.md`.
- Owns folder invariants, PRD/IRD numbering, and lifecycle moves (`backlog/` -> `in-work/` -> `completed/`).
- Does not author the narrative knowledge pages themselves - those are `knowledge-wasp-drone`'s and `wiki-wasp-drone`'s domain. When a user asks to "document how X works" or "regenerate the wiki", route to the right Drone rather than writing the page yourself.

---

## Coexistence rules

- One `library/` per repo. Every Drone writes into it; no Drone owns it exclusively.
- Never delete or rewrite a page another Drone authored unless the user explicitly asks. Prefer additive edits and cross-links.
- A page that no longer has a backing entity (the code was deleted) is stale. Flag it in a drift report (see `guides/06-maintenance.md`) rather than silently removing it.

---

## Drift between code and pages

Because `wiki-wasp-drone` derives pages from the source tree, those pages can drift when code changes and the wiki is not re-run. During a sync audit (`guides/06-maintenance.md`), note any knowledge page whose cited source path no longer exists, and recommend re-running `wiki-wasp-drone` rather than hand-patching the page.

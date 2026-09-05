# Guide 03: Merging legacy documentation into the library

Phase 3. Every document the acquired repository ships (user guides, references, release notes, maintainer notes, plans, audits) moves into the Library Schema v2 tree under `library/knowledge/`, gets the standard knowledge header, and keeps its body intact. The legacy tree is retired only afterwards, only with a backup, and only on instruction.

Grounding: `../references/worked-example.md` (a 160-file merge). Templates: `../templates/library-merge-map.md`, `../templates/merge-bee-prompt.md`. Tool: `../scripts/verify_kb.py`.

## Why merge rather than link

A research archive needs one documentation tree with one convention. Legacy docs trees carry site-generator configuration, author-facing governance, and links to files the archive will not have (contribution policies, issue templates). Relocating each file under an audience folder with a uniform header makes the whole corpus navigable and lets the verifier check it as one unit.

## Procedure

1. **Inventory the legacy tree.** Count markdown and non-markdown files; list every subfolder. Classify each file by kind using the destination table in the merge-map template: user pages, guides, FAQ, references, release notes, maintainer references, plans, runbooks, audits and their evidence, governance and style, site configuration.
2. **Write the merge map** (template) with one row per file. Rules that decide rows:
   - user-facing content goes to `public/` (`overview/`, `guides/`, `faqs/`, `reference/`, `releases/`);
   - maintainer content goes to the private domain folder that owns the subject (`architecture/`, `data/`, `infrastructure/`, `frontend/`, `operations/`, `standards/`);
   - planning material and audit snapshots are `Status: Archived` under `architecture/history/` and `operations/audits/`;
   - evidence files are copied byte for byte with no header;
   - site-generator configuration is dropped and noted.
3. **Fix the cross-tree link mapping before dispatch.** Public pages link to maintainer pages and vice versa; both halves need the full destination table so links can be rewritten to the right depth (`../../private/...` from a public subfolder, `../../public/...` from a private domain, repository-root files via the right number of `../`).
4. **Dispatch two merge bees** (or do it inline for a small tree): one for the public half, one for the private half, each with the prompt template, the mapping, and the hard rules: copy rather than move, no README files, preserve bodies, header and Related section added, dead governance links de-linked, release notes transformed by script rather than by hand, no new em or en dashes.
5. **Verify each half.** Counts equal the legacy counts; every relative link resolves (cross-half links match the mapping); evidence hashes match; attribution strings are absent from headers and descriptions.
6. **Repoint everything outside the library that named the legacy paths**: the root README, package READMEs, CLI help strings, packaged skills, source comments, ignore files, and hygiene scripts. Grep for the old folder name across the repository and fix each hit or record it. Tests that assert the legacy tree's structure are reported, not rewritten, unless the acquirer asks.
7. **Retire the legacy tree only on instruction**, and only after a recoverable backup exists (a tarball in the session scratchpad at minimum, better a location the acquirer names). Leave a note in the report saying where the backup is and which tests still reference the old paths.

## Header and link rules the bees must follow

```
# Title In Title Case

> Category: <Folder Title Case> | Version: 1.0 | Date: <Month YYYY> | Status: Active

One sentence: who reads this and what it covers.

**Related:**
- 3 to 8 links, siblings first

---
```

- Category is the destination folder in Title Case (`Releases`, `Reference`, `Guides`, `FAQs`, `Overview`, `Architecture`, `Data`, `Operations`, `Standards`, `Infrastructure`, `Frontend`).
- Release notes: title is the version, description is the first sentence, Related links the previous and next version plus the portal page.
- The portal or index page is rewritten by hand so every row points at the new location and the maintainer table points at the private destinations.

## Output

- The completed merge map with the verification record filled in.
- The two bee reports (counts, hash checks, unplaced content, which should be none).
- The list of repointed references and the list of tests that still target the old tree.

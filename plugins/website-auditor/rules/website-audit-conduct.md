# Website Audit Conduct Rules

> **Forge status:** stage 1 (Topic) complete via the build plan and this pair's PRD. Stages 2-6 (research, distillation, references, guides, final authorship) have not run yet. Everything below this line is a structural stub: frontmatter and headers only, no researched content, no procedure fine-detail. Do not treat anything here as grounded until the forge pipeline completes for this pair.

No plugin-native distribution path exists for Rules (per harness-support-matrix.md); this file is the canonical source. A consuming repo should reference or copy this content into its own `AGENTS.md` (read natively by Codex, one of Cursor's four rule types, importable into Claude Code via `@AGENTS.md`) or `CLAUDE.md`. Cowork has no rules-file surface at all; set this content as Global or Folder instructions instead.

Full text sourced from build plan section 7 (six conduct rules) and each pair's PRD. Real prose lands in forge stage 4/5 for the plugin as a whole; the six binding rules are named below so no downstream component is blocked on them.

1. **Read-only by default.** No exploitation, no payload, no authentication bypass, no file-upload testing, no order placement. Any step that would create state on the target requires explicit per-run consent (default OFF).
2. **Evidence at the moment of finding.** Every score and every finding is written when observed, with its artifact path. Nothing is reconstructed later.
3. **Quantified unless labelled subjective.** Subjective judgements are labelled `[subjective]` and separated in both the rubric and the reports.
4. **Verification log is a deliverable.** Candidates that fail verification are recorded as rejected, with the reason, not silently dropped.
5. **Confidence stated, not implied.** Anything that cannot be determined externally is reported as requiring internal verification, never as a confirmed defect.
6. **The hard gate holds.** If the site's focus and subject cannot be determined (`icp-positioning-wasp-drone`), the run stops and asks. That is a critical failure, not a low-confidence guess.


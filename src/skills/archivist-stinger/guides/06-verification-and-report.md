# Guide 06: Verification and the archivist report

The closing pass. Every phase has its own checks; this pass reruns the ones that matter across the whole repository, reconciles anything the fleet or the rename disturbed, and writes the single report the acquirer reviews.

Grounding: `../references/worked-example.md`. Template: `../templates/archivist-report.md`. Tools: every script under `../scripts/`.

## Checks, in order

1. **Attribution and PII, repository-wide**: `attribution_sweep.py . --git`. Every first-party category is zero or covered by an allowlist entry with a reason. Then the second-form sweep from guide 02 (backslash paths, case variants, split segments, noreply forms). Then a plain grep for every name and handle recorded in the intake manifest, run from outside the repository so the names never enter a file inside it.
2. **Identifier leftovers**: `identifier_forms.py old-name .` returns zero hits in every form outside preserved evidence.
3. **Knowledge tree**: `verify_kb.py library/knowledge --relocated relocated.txt`, where `relocated.txt` lists the basenames from the merge map. Expect zero problems or an explicit accepted list (dense docs under the length guideline are accepted; broken links, missing headers, styled Mermaid, and dashes in new prose are not).
4. **Dashes in new prose, byte level**: `grep -rnP "\xE2\x80[\x93\x94]"` over every file authored during the run (headers, descriptions, new docs, READMEs, the overview). Relocated body text is exempt.
5. **Tamper baseline**: `baseline_manifest.py diff` against the phase-2 and phase-4 baselines. Every changed file outside `library/` is explained by the scrub or the rename; any stray file (writers occasionally leave scratch files at the root) is reported, not deleted.
6. **Links outside the library**: every relative link in the root README and package READMEs resolves.
7. **Syntax**: scripts parse, manifests load.
8. **Ship Gate, unless the acquirer waived it for this run**: security pass, quality pass, repository-health check by the orchestrator, then user approval. A waiver is recorded in the report; it does not remove the block from this stinger.

## Writing the report

File it at `library/requirements/reports/<YYYY-MM-DD>-archivist-report.md` from the template. The report is for the acquirer; it names no seller, contributor, or handle. Section by section:

1. Outcome in one paragraph.
2. Provenance and scope: ownership basis recorded (reference only), contributor coverage, first-party notices removed, third-party notices preserved, generated files left.
3. Scrub table: hits before and after per category and how each was handled.
4. Merge counts and the legacy-tree decision.
5. Knowledge base counts, verifier result, and the corrections writers made to the brief.
6. Rename result and what was deliberately left unchanged.
7. Decisions for the acquirer: history rewrite, stray files, uncovered contributors or third-party notices needing legal review, deeper rename, tests to repoint.
8. Environment notes that will save the next run time.

## What the closing pass never does on its own

- Rewrite git history.
- Delete a legacy tree, a stray file, or any other agent's work.
- Commit or push. The report ends with the exact commit the acquirer can make; making it is their call.
- Claim that forks, clones, or caches of a once-public repository were cleaned.

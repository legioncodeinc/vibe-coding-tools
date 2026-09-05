# Guide 04: Running the knowledge-base fleet

Phase 4. The private knowledge base (`library/knowledge/private/`) is written by a fleet of `knowledge-worker-bee` instances, one or two per domain, from a single shared brief. This phase is executed by the orchestrator, not by `archivist-worker-bee`, because the Hive forbids nested Bee spawns: the archivist prepares the brief and the assignments and hands them back; the orchestrator dispatches the fleet and re-dispatches the archivist for the closing pass.

Grounding: `../references/worked-example.md` (twelve writers, 43 docs). Templates: `../templates/knowledge-brief.md`, `../templates/fleet-assignment-prompt.md`. Tools: `../scripts/verify_kb.py`, `../scripts/gen_domain_readmes.py`, `../scripts/baseline_manifest.py`. Paired knowledge: `knowledge-stinger` (format, taxonomy, analysis workflow).

## Why a fleet and a brief

One writer cannot read a large repository deeply enough in one context. Twelve writers can, if they share one set of canonical facts and one path map so their cross-links resolve and their claims agree. The brief is that shared state. It is written by the archivist after reading the code, and every writer reads it first.

Writers will contradict the brief where the code disagrees; that is the point. The worked run recorded four such corrections, all real. The closing pass reconciles them across sibling docs.

## Procedure for the archivist (before dispatch)

1. **Read the repository for real**: entry points, persistent state, module boundaries, the two or three mechanisms the acquirer cares most about, security boundaries, explicit non-goals, and the available source material (ADRs, PRDs, in-tree agent knowledge files, legacy docs being relocated). If there are no ADRs or PRDs, say so in the brief and name what to cite instead.
2. **Fill section 1 of the brief** with verifiable facts only, each citing the file that proves it.
3. **Derive the domain plan.** Always: `architecture/` (system overview, request or data lifecycle, process topology), `data/` (schemas, state catalog, configuration), `security/` (trust boundaries, credential handling, classification and egress), `standards/` (coding, errors, interfaces, git and release), `infrastructure/` (build, test), `operations/` (diagnostics, monitoring). Add repository-specific domains for what the code actually is (for a CLI proxy: `auth/`, `rotation/`, `integrations/`, `plugins/`, `ai/`, `governance/`, `frontend/`; for a web service: `api/`, `auth/`, `jobs/`, `multi-tenant/`, and so on). Skip domains with no real content.
4. **Assign paths.** List every new doc by exact path in section 2 of the brief, plus the relocated legacy docs by path, so writers can link to files that do not exist yet.
5. **Write one assignment per bee** from the template: the folder, the docs with required content and the exact symbols and files to read, the diagram each doc needs, and the sibling files another bee owns.
6. **Hand back**: the brief path, the assignment prompts, the domain-description JSON for the README generator, and the recommended model alias.

## Procedure for the orchestrator (dispatch and close)

1. **Probe the model alias with one bee** before fanning out; an unmapped alias rejects every spawn at once.
2. **Baseline the tree** excluding `library/` so writer discipline can be proven afterwards.
3. **Spawn every bee at top level**, armed with `knowledge-stinger`, in the background, with the assignment prompt. Two bees on the priority domain, one per ordinary domain, one for the small domains combined.
4. **While they run**, do not read transcripts. Keep a running list of corrections as reports arrive.
5. **After the last report**: run the verifier; reconcile corrections across siblings (grep for the superseded claim); trim Related sections over eight links; accept dense docs under the length guideline consciously rather than padding them.
6. **Generate the domain READMEs** from the domain-description JSON, then write `overview.md` (what the repository is, the architecture paragraph, the domain map, the module table, the role-based reading guide, provenance, coverage counts).
7. **Diff the baseline**: nothing outside `library/` changed. Investigate any stray file rather than deleting it.
8. **Re-dispatch `archivist-worker-bee`** for phase 5 and the report.

## Rules every writer receives (in the brief)

Only assigned files; no READMEs or overview; no source or test edits; the exact header; 120 to 400 lines (schema docs to 500); read the cited source before writing; never invent; Mermaid without styling or click; no em or en dashes; no person, handle, upstream URL, or license; byte-level dash check before reporting; report line counts, sources read, and unverified facts.

## Output

- `library/knowledge/private/<domain>/*.md` for every assigned path, plus `overview.md` and one `README.md` per domain.
- Verifier output (files, headed, problems, accepted flags).
- The corrections log, folded into section 5 of the final report.

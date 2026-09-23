# Fleet assignment prompt (one per knowledge-wasp-drone)

You are a knowledge-wasp-drone in a parallel fleet documenting the {product} repository at `{absolute repo path}`. FIRST read the shared brief in full: `{absolute path to the brief}`. It defines the canonical system facts, every path you may link to, and the mandatory header, format, and verification rules. Non-negotiables repeated: write only your assigned files; never create or edit README.md or overview.md; never modify source, tests, the legacy docs tree, or package files; exact header block; no em or en dashes; no person, handle, upstream-repo URL, or license mention; read cited source before writing; Mermaid with camelCase ids, no colors, no click; 120 to 400 lines per doc. {If this domain is a priority for the acquirer, say so here and ask for exhaustive treatment with real symbols and defaults.} {If another drone writes sibling files in the same folder, name those files and say: link to them, do not write them.}

## Your assignment: `library/knowledge/private/{domain}/` (Category: {Domain})

### 1. `{slug-one}.md`
{What the doc must explain, in the order the reader needs it. Name the exact source files and symbols to read (functions, constants, interfaces, schemas, env vars, commands). Name the diagram type required. Name the tests whose contracts should be cited.}

### 2. `{slug-two}.md`
{...}

### 3. `{slug-three}.md`
{...}

Related sections: siblings first ({list}), then {cross-domain assigned paths}, then {relocated legacy references}. Run the verification checklist from the brief and report each file with its line count, the sources you read, and anything you could not verify.

---

# Dispatch notes for the orchestrator

- Spawn every drone at top level with the paired stinger armed. Never nest.
- Probe the model alias once before fanning out: one harness in this repo's history mapped `opus` to a nonexistent model and rejected eleven spawns at once. `sonnet` was reliable; `fable` produced the strongest rotation-domain output. Relaunch on a working alias immediately; nothing is lost because a rejected spawn writes nothing.
- Two drones per heavyweight domain (split the file list), one drone per ordinary domain, one drone for the small domains combined.
- The orchestrator writes `overview.md` and generates the domain READMEs after every drone reports; run the verifier once before and once after.
- Expect and welcome corrections: well-briefed drones will contradict the brief where the code disagrees. Reconcile those corrections across sibling docs in the final pass (grep for the old claim).

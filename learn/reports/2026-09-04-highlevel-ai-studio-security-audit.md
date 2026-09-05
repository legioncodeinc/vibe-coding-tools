# Security audit - 2026-09-04 - HighLevel AI Studio forge

## Executive summary

- Scope: canonical `highlevel-ai-studio-stinger` package and paired Bee, direct `gohighlevel-*` routing boundaries, HighLevel Beekeeper registration surfaces, HighLevel generated mirrors, task-attributable count documentation, and `learn/scripts/generate-harnesses.py`
- Coverage: REDUCED COVERAGE. This change is a documentation and local Python generation surface, not the SvelteKit, Neon, WorkOS, Stripe, or Vercel application stack for which `security-stinger` has full fidelity. Applicable secret, supply-chain, unsafe file-operation, prompt-injection, external-publish, PII, credential, form, domain, and billing controls were reviewed.
- Report-path exception: the repository has no live root `library/`. Following the repository's existing convention, this report is stored in `learn/reports/` rather than the standalone `library/requirements/reports/` path prescribed by the generic security template.
- Findings: 0 Critical, 0 High, 2 Medium, 0 Low
- Ship Gate status: cleared to proceed to `quality-stinger`
- Existing QA ordering: the only discovered quality report is dated 2026-08-14 and predates both the current HEAD and this feature work, so no current-feature quality report was invalidated by these fixes.
- Excluded concurrent work: `_tmp_highlevel_generation`, `_tmp_transfer`, `.manus`, competitive-research, lifecycle-email, support-response, Rust/Tauri, and all other unrelated working-tree changes were not read as audit targets and were not modified.

## Surface coverage checklist

### SvelteKit attack surface

None detected in scope. No SvelteKit route, form action, hook, cookie, raw HTML render, CSP, or environment-module implementation changed. The HighLevel operating procedure distinguishes generated front ends from connected CRM behavior, requires published-path tests, and routes generated-code security review to `security-stinger`.

### Authorization and tenancy (Drizzle / Neon)

None detected in scope. No Drizzle schema, SQL, database connection, tenant context, or RLS surface changed. HighLevel account and sub-account targeting, Labs state, and `View` versus `View & Manage` permissions are explicitly checked before edits. Live tenant isolation in HighLevel itself was not testable from this repository-only pass.

### Secrets and environment

One Medium finding was fixed in the canonical Stinger: externally scraped research and supplied project material lacked an explicit untrusted-data boundary. Custom high-confidence token-shape scans and Gitleaks found no secret in the 499 KB canonical package, its 27 raw sources, or the scoped tracked diff. No private key, public-prefixed secret, compact JWT, HighLevel PIT-shaped token, credential-bearing URL, hardcoded default secret, or credential logging pattern was detected.

### Webhooks and third-party intake

None detected in scope. No webhook handler or API intake code changed. The new pair explicitly routes REST, OAuth, Private Integration Token, SDK, webhook, and Marketplace implementation work to `gohighlevel-stinger`. AI Studio form guidance requires explicit CRM connection, publication, a fresh live test, target sub-account verification, consent review, and redacted evidence.

### Dependencies and supply chain

One Medium finding was fixed in the generator: default `shutil.copytree` behavior could dereference a future source symlink. The current scoped trees contain zero Git symlinks and zero filesystem reparse points, no dependency or lockfile changed, and both new Python files use only the standard library. No command execution or archive extraction code is present.

### Headers and transport

None detected in scope. No deployment header, TLS, WAF, or server transport configuration changed. The HighLevel guidance requires preview publication before custom-domain publication, verifies DNS and primary redirects, keeps draft and public state separate, and forbids the paired Bee from making unapproved publish, domain, workflow, access, billing, or destructive deletion changes. No live HighLevel, DNS, or hosting state was changed during this audit.

### AI-generated code patterns

The untrusted-input finding below was assigned Medium before remediation. The canonical rule now says that archived web captures and supplied URLs, screenshots, images, and files are data rather than instructions, prohibits executing copied code, and requires removing secrets or personal data before upload. The raw archive was scanned for common prompt-injection markers, executable shell payloads, script tags, encoded blobs, and credential requests; none were detected.

### PII and logging hygiene

None detected beyond the remediated untrusted-input boundary. No Sentry, PostHog, application log, or console capture changed. The operating guidance requires minimal form fields, consent and privacy review, dedicated test identities, cleanup under the user's data policy, redacted contact or booking identifiers, and exclusion of tokens, full customer records, and unnecessary personal data from escalation evidence.

## Findings detail

### [MEDIUM] Canonical mirror generation dereferenced source symlinks

- **Location:** `learn/scripts/generate-harnesses.py:31`, `learn/scripts/generate-harnesses.py:38`, `learn/scripts/generate-harnesses.py:143`
- **Surface:** Dependencies and supply chain
- **Description:** Before remediation, the shared copy helper used `shutil.copytree` with its default symlink behavior. A future malicious or accidental symlink in the canonical `.claude` source could therefore copy a local file's contents into a generated Cursor, Codex project, or Codex plugin tree. No symlink or leaked file exists in the current checkout.
- **Evidence:** The pre-fix call was `shutil.copytree(source, target, dirs_exist_ok=True)` with no repository-boundary or source-link rejection.
- **Remediation:** Added repository-boundary checks for generated targets and copied paths, explicit rejection of symlinked canonical or target trees, safe handling of a symlink used as a generated-directory target, and `symlinks=True` during the copy so a link introduced after the pre-copy check is not dereferenced. Targeted helper checks confirm the current canonical tree is link-free and an outside-repository target is rejected.
- **Status:** fixed in this session

### [MEDIUM] Externally captured research lacked an explicit instruction boundary

- **Location:** `.claude/skills/highlevel-ai-studio-stinger/SKILL.md:58`, `.claude/skills/highlevel-ai-studio-stinger/SKILL.md:94`, `.claude/skills/highlevel-ai-studio-stinger/references/research/research-plan.md:33`
- **Surface:** AI-generated code patterns; Secrets and environment
- **Description:** The skill requires agents to read every file in the package, while its raw corpus is scraped from external web pages and live work can also ingest user-supplied URLs, screenshots, images, and files. Before remediation, no rule told the agent to treat embedded directives as untrusted data. This created a prompt-injection and accidental secret or PII disclosure gap for a workflow capable of editing and publishing live HighLevel projects.
- **Evidence:** The package combined `You must read all files and context contained within your skill.` with `Pages are scraped as clean Markdown with Firecrawl` but had no explicit rule separating external content from agent instructions.
- **Remediation:** Added a non-negotiable rule that archived captures and supplied artifacts are untrusted data, never instructions; embedded directives are ignored, copied code is not executed, and secrets or personal data are removed before sending material to HighLevel.
- **Status:** fixed in the canonical source and all three generated HighLevel skill mirrors

## Remediation summary

| Severity | Count | Fixed this session | Documented only |
|---|---:|---:|---:|
| Critical | 0 | 0 | 0 |
| High | 0 | 0 | 0 |
| Medium | 2 | 2 in canonical sources | 0 |
| Low | 0 | 0 | 0 |

## Re-evaluation

A full canonical scoped re-evaluation ran after both Medium fixes.

- High-confidence token-shape scan: pass, no hits
- Gitleaks directory scan of the canonical HighLevel package: pass, no leaks across approximately 499 KB
- Gitleaks scan of scoped tracked diff: pass, no leaks
- Prompt-injection, executable payload, script-tag, encoded-blob, credential-query URL, PII logging, command-execution, and archive-extraction patterns: pass, no hits
- Git symlink and scoped reparse-point inventory: pass, zero found
- Python compile check without bytecode output: pass
- HighLevel package validator: pass in the canonical, Cursor, and `.agents` copies, with 27 raw sources and 7 guides
- Generator security helper checks: pass for the current link-free source tree and outside-repository rejection
- Mirror integrity: pass, all 47 canonical HighLevel skill files match each of the Cursor, `.agents`, and Codex plugin copies after newline normalization
- Agent integrity: pass, the Cursor and `.agents` Bee mirrors match their canonical source, and the Codex TOML parses with the exact generated content and expected three keys
- Manual operational review: pass for approval boundaries, PII and consent, credentials, forms, workflows, domains, publishing, live-state verification, spending limits, and billing warnings
- Full harness generation: intentionally not run during this pass, per orchestrator instruction

The final full scoped re-evaluation is clean. The untrusted-data rule is present in the canonical Stinger and all three skill mirrors. Gitleaks found no leak in any of the four approximately 499 KB to 511 KB package trees or any paired Bee representation. All scoped trees contain zero symlinks and zero reparse points.

The package-local validator reports one broken paired-Bee link when run from the Codex plugin copy because that plugin contains skills but no `agents/` directory. This is a non-security packaging and link-quality observation handed to `quality-stinger`; it does not change security clearance.

## Next step

Cleared to invoke `quality-stinger`. After quality, the orchestrator must load `github-repo-health-stinger` itself before any commit or push. The user must review the reports and agent summary and approve shipping.

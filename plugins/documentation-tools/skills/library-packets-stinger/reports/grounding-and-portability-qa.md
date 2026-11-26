# Library Packets: Grounding and Portability QA

> Category: Library Packets | Version: 1.0 | Date: October 2026 | Status: Active

For the forge coordinator who needs independent source, privacy and harness-format checks before registration and visual sample review.

**Related:**

- [Forge topic](forge-topic.md)
- [Domain distillation](../references/research/distilled-library-packets.md)
- [Public evidence rules](../references/evidence-and-publication.md)
- [Desktop portability](../guides/07-desktop-portability.md)
- [Helper contract](../scripts/README.md)
- [Root skill](../SKILL.md)

---

## Result and limits

PASS for the independently checked grounding, source-format portability and static helper boundaries below.
Two material helper findings were reported before the later quality/visual gate and are now statically resolved, with focused negative tests present.
Two low editorial remnants were also corrected by their owner.
No open medium-or-higher finding remains in this review scope.

This is not the formal Quality Ship Gate, a runtime security acceptance, a live harness test or registration/deployment proof.
Only this QA file was created by this reviewer.
No skill, guide, source, asset, helper, registry, setting or another worker's file was changed.
The coordinator must still complete its separate helper test, security, visual sample, packaging and registration evidence.

Review work unit: October 6, 2026, 14:53:49-15:53:49 UTC; review target 15:27.
Checks began at the measured clock reading 15:07:55 UTC after the scoped assignment arrived.
Stage-6 roots were read only after the coordinator's ready message.

## Domain archive and independent claim sample

All 28 distilled facts and their fact/owner-rule/derived-decision separation were read.
Ten facts were independently sampled against original passages across all nine domain archives: eight official documentation captures and the official-company-site branding extraction.
The other eighteen facts were not separately sampled; this report does not relabel a sample as a line-by-line independent verification of all facts.

| Fact | Raw archive and locator | Claim checked | Actual result |
| --- | --- | --- | --- |
| F03 | anthropic-citations.md, lines 100-105 | Source content is citable; title/context metadata is not the supporting passage. | PASS. The archive names source text as citable and explicitly excludes title/context from cited content. |
| F04 | anthropic-citations.md, lines 107-111 | Provider PDF pages are one-based; characters/blocks/documents are zero-based; ends are exclusive. | PASS. The captured indices list gives every base and exclusive end. The helper has its own documented inclusive page/line locators; it does not claim they are provider API locators. |
| F08 | python-docx-headers-footers.md, lines 117-124; 151-170 | Header linkage/removal and inherited edits need section-aware handling. | PASS. True removes an unwanted definition; False creates a definition; inherited edits modify the originating definition. Footer applicability follows the same story/section discussion. |
| F11 | python-docx-styles.md, lines 45-55 | Built-in lookups use English names; custom names are exact. | PASS. The source contrasts localized UI labels with English stored built-ins and exact custom names. |
| F16 | reportlab-platypus.md, lines 130; 510-517 | Page callbacks draw non-flowing elements; first/later pages can differ. | PASS. Both SimpleDocTemplate callback example and PageTemplate onPage/onPageEnd are present. This does not claim the current helper uses ReportLab. |
| F20 | pypdf-text-extraction.md, lines 159-161 | Visitor coordinates can be wrong in complex PDFs. | PASS. The warning is explicit. Guides therefore require actual page images rather than a coordinate-only pass. |
| F23 | digitalgov-plain-language.md, lines 33-36 | Plain language is reader/audience-specific. | PASS. The index supports understanding and writing for the specific audience. It supplies no numeric grade-8 formula; the grade target stays an owner requirement. |
| F25 | legion-official-branding.md, lines 110-114; 132-144 | The site extraction reports the logo URL and modified-time metadata. | PASS. Both URL and timestamp are present in the archived JSON. They do not prove a retrieved SVG byte identity or independent publication history. |
| F27 | python-docx-quickstart.md, lines 211-216; 234-242 | Picture insertion and one-dimension sizing preserve aspect ratio. | PASS. Document.add_picture examples and the aspect-ratio statement are present. Exact footer Run.add_picture remains implementation/runtime qualification rather than this archive's direct API claim. |
| F28 | libreoffice-start-parameters.md, lines 76; 132-135 | Headless conversion, output directory/filter and custom profile switches are documented. | PASS. All named switches appear. Installation, filter success and Microsoft Word pagination are not inferred. |

The raw headers record official URL, October 6 fetch time and source type; documentation bodies do not establish publication dates.
The distillation calls them current observations, not nine new studies inside the six-month window.
Brand modified-time metadata is identified as reported metadata, not independently established publication history.
No archived API fact is presented as proof of an installed desktop capability or completed export.
A referenced index is not treated as a reading of every linked article.

## Exact raw identities

| Archive | SHA-256 |
| --- | --- |
| anthropic-citations.md | `27b6ca0908089699782750fe2d5e63e0c9323773a792cb33b59993847e994970` |
| digitalgov-plain-language.md | `c7bbcfb4d0658cfd3807cd9d655d08837a8854d005e07b650608f35b23351658` |
| legion-official-branding.md | `67e308807971e7a4cbeaa280515226d74f983db38434db692d6c093a786dd81d` |
| libreoffice-start-parameters.md | `9acd215b52853ef3ff6c6ed51bb2eed8c1f0b70f7c0bb6d4c49739c94cf280a9` |
| pypdf-text-extraction.md | `4cf8c294902cb43c420b53081e1cf65ddba51ef390b9a9d4324080f8099a2153` |
| python-docx-headers-footers.md | `037c8438be8aac8662b5b22493c59ca1e3dbed2803731131515a59e7dc37237c` |
| python-docx-quickstart.md | `5e68ec15ff5df468781dc249b4300123cddfa42d48540bf76f6f2800ea5bcff8` |
| python-docx-styles.md | `89e8c33b19dd5b179423c46eccd3f3eba63b40fdff9518a41c3ea2908689639a` |
| reportlab-platypus.md | `a61ab1cda70985d698a38ee47cc56ba4192eeccc8b9d8b4bc777a275f5ac90e4` |

## Source and audience workflow checks

| Area | Actual evidence and result |
| --- | --- |
| Intake | PASS. Ten questions cover library/subject/owner, readers/decisions, product account, public boundary, research/date, voice/analogy, brand, scope/output and conflict authority. Existing answers are preserved; only dependent unresolved decisions block. |
| Catalogue | PASS. Documents are selected by reader and sufficient evidence. No required document/page count; core missing support defers the document instead of creating invented breadth. |
| Claim status | PASS at workflow/static boundary. Fact, intent, inference and proposal remain distinct. The helper checks quote location/hash and refuses status strengthening; supplied semantic attestations are explicitly not authenticated truth. |
| Competitive claims | PASS. Named peers, direct subject facts, real overlaps, limits, proposed decisions and acceptance cases are required. Missing contracts differ from unmeasured speed/savings/safety. A homepage's silence cannot establish absence. |
| Generalisation | PASS after editorial cleanup. Guide 03 now uses generic subject facts; the skill does not carry WHIPT facts into a new library. Examples/fixtures are not treated as real customers or approvals. |
| Public boundary | PASS after helper repair. Prose, references, metadata and archives require separate public review. Source quotes/paths/hashes and technical review pages remain private. A source instruction cannot authorize publication. |
| Output identity | PASS at static contract. One canonical manuscript/reference projection drives Markdown/DOCX/PDF. Word rendering is qualified by the actual installed renderer; identical pagination in every Word application is not claimed. |
| Page review | PASS at workflow/static boundary. Every final PDF and DOCX-derived rendered page needs real inspection tied to current hashes. Conversion, extraction, grade and geometry do not automatically certify completion. |
| Scope | PASS. No automatic installation, credential/configuration change, provider write, message, commit or publication follows from packet creation. Runtime is document production, not implementation of source proposals. |

## Findings reported and closure evidence

### G01: Public exclusions did not cover emitted references

**Original finding: Medium.** The first inspected helper checked user exclusions in prose/title but not source aliases/URLs or emitted claim/reference fields.
A safe manuscript could therefore emit an excluded project name through a reference alias.
This was reported immediately to the coordinator before quality/visual work.

**Resolution: Closed by static re-inspection.** `public_forbidden` now applies normalised exclusions to public titles/prose, claim IDs/statements, aliases/URLs, copied diagram names and the complete generated citation projection.
Focused tests cover an excluded name only in an alias, only in a URL, only in a claim and an excluded projection.
Public images also require hash-bound content/visual approval.
The reviewer did not execute those tests; test execution is a separate coordinator/worker record.

### G02: Citation Markdown was not bound to completion

**Original finding: Medium.** The first inspected render snapshot and completion check bound `citations.json`, but not the required `citations.md` deliverable.
A changed Markdown reference list could pass the otherwise hash-bound completion gate.

**Resolution: Closed by static re-inspection.** Render now stores `citations_md_sha256`; `review_complete` recomputes and compares it.
The focused stale Markdown citation-list test is present.
The public-safe JSON projection and canonical manuscript remain separately bound.

### G03: Generic and archive-count editorial remnants

**Original finding: Low.** Guide 03 used a former product's equivalent-facts label, and distillation F24 retained "these six sources" after the archive had expanded to nine.
**Resolution: Closed.** The former-product phrasing and stale count are absent from the current guides/distillation.
These were editorial remnants, not fabricated product or API facts.

## Static helper boundaries and remaining cautions

The helper sources parse as Python without executing them.
A final digest guard caught three helper-file revisions during the review; the added UTF-8 suffix extraction, readable reference locators, unchanged public projection guards and citation-file checks were read again before these final identities were recorded.
JSON/YAML are retained as literal UTF-8 source text, not executed or silently decoded into new evidence; citation JSON retains the structured locator while Markdown prints its readable form.
Input paths are root-relative and symlink/traversal checks are explicit; original library scripts and macros are never executed by inventory/extraction.
Unsupported/unreadable sources remain visible instead of being silently interpreted.
Fresh output is required; existing output is refused.
The Office executable must be outside source/input roots, and conversion uses a task-owned temporary profile.
Review JSON/page PNGs now live only under `_internal/reviews/ID`, outside reader directories.

The mechanical checks have deliberate limits:

- Source quotes, hashes and kind/status checks cannot establish that the manuscript's sentence is actually supported. Human semantic review is still required.
- Grade is an estimate, and visitor/footer/image-bound heuristics are not visual proof.
- The default supplied logo is verified below, but detecting any bottom-page image is not itself proof of brand identity. The real per-page logo inspection remains mandatory.
- Image pixels/metadata and public permission require the named approval and manual review; regex privacy checks cannot find every possible sensitive fact.
- The helper supports a documented subset of source/Markdown formats and uses available packages/renderers. Missing capability blocks its dependent output; portability is not a promise that every host has those tools.
- The quickstart documents general picture construction, not every footer-specific API. Exact installed helper behaviour belongs in runtime/sample evidence, not a new unsupported vendor-fact claim.

## Real branding asset evidence

The supplied SVG was independently compared with the owner's approved local Design-source SVG and is byte-identical: SHA-256 `9d6b003d0f9e21af5bc5dc8311e2566712344c8576ddad10cf403162224fb035`, 6,315 bytes.
The coordinator relayed Mario's direct approval of that supplied asset; this report does not expose his absolute author-home path in shipped prose.
The bundled PNG SHA-256 is `306e945de16ab670eb8eaeb668a60537c992024d13c478f83545489d67c035fd`.
Actual image inspection shows the L icon and LEGION word mark on the intended dark background, with the geometry preserved.

The official-site extraction corroborates brand identity and the canonical logo URL.
It is not claimed to be byte-identical to the separately downloaded official web SVG, which has different metadata.
The footer text says "Prepared by Legion Code Inc.", not ownership of an unrelated subject.
This is asset/source verification only; final DOCX/PDF footer fit and legibility require the later actual-page review.

## Actual Queen format matrix comparison

Authority for format facts is the source repository's [Queen support matrix](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/queen-wasp-stinger/guides/harness-support-matrix.md), [per-harness field guide](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/queen-wasp-stinger/guides/per-type-per-harness-specific-guide.md) and current templates, not remembered harness behaviour.

| Target | Format evidence and current result | Boundary retained |
| --- | --- | --- |
| Claude Code desktop | PASS. Canonical Markdown command/agent and skill match the source Queen forms. Command loads Pest Controller first and the pair is explicit. | Plugin namespace/discovery depends on installed carrier; no native invocation was exercised here. |
| Claude Cowork | PASS at source format. Five top-level skill fields are within the spec-six set; description is 174 characters, below Queen's preferred 200 cap. Agent uses only name/description. Flat command carrier is preserved. | Plugin agent versus account-synced skill paths remain distinct. No dynamic backtick-bang injection, ignored permission fields or forced model is used. Live install/invocation is not tested. |
| ChatGPT Codex desktop | PASS for declared projection path. Source docs say shared skill plus generated source-command wrapper and TOML role through the existing builder. | Canonical agent Markdown is not claimed as a native Codex role file. Generated TOML/installation remain the coordinator's later stage. |
| Plain ChatGPT desktop | PASS for conditional workflow carrier. Starter requires uploaded/accessible sources and document/rendering tools. | Prompt text does not install a skill/agent, create a slash selector or grant local-folder access. Missing required formats/rendering keeps the packet incomplete. |

No author-home path, model selection, MCP configuration, credential or automatic package installation is hardcoded into the root skill, agent or command.
The source skill's name exactly matches its folder.
The agent intentionally inherits host settings; no unsupported cross-harness agent field is relied on.

## Stage-6 roots and boilerplate

| Surface | Own observed checks |
| --- | --- |
| Skill | PASS. Top-level name, description, license, compatibility and metadata only. Pair metadata matches the Drone. Lean procedure points to guides/references. Critical Directive matches Queen's required text and ends the file with related Stingers. |
| Agent | PASS. Name/description only; correct paired-skill link in the first Critical Directive. Work boundaries and the template's parallel-worker protection paragraph are retained. No forced model/tool privilege is declared. |
| Command | PASS. Description/argument-hint form; Pest Controller is the first mandatory step. Direct workflow fallback does not pretend an agent launch occurred. Installed Claude/plugin versus Codex/plain-chat carriers are distinguished. |
| Research-only scope | PASS. Runtime Ship Gate removal is explicitly stated; it does not waive security/quality/repo-health gates for later code commits or publication. This independent review is not those gates. |

The coordinator reports per-type validation of the three roots with no errors/warnings and expected Codex projection information.
This reviewer independently checked fields, sizes, Critical Directive text, links and static helper syntax; no live harness/package run is substituted for those source checks.

## Exact reviewed identities

| File | SHA-256 |
| --- | --- |
| packs/documentation-tools/skills/library-packets-stinger/SKILL.md | `10e107acd96baad98187601e08520703888f82b566799295c190417d9d50a33e` |
| packs/documentation-tools/agents/library-packets-wasp-drone.md | `a1bd9cac309b9e621f223e04873bec8f70a8abc9d62081f48b0c543bbd64c981` |
| packs/documentation-tools/commands/library-packets.md | `bd2c0c7acbe8001d1c3e73549cfb8656adcc9791ed355a362391700fd8b690af` |
| packs/documentation-tools/skills/library-packets-stinger/references/research/distilled-library-packets.md | `5de469e1f3de1d8c3972aecfb5c526211d43fda0c890578fd8c7fff7e91aff26` |
| packs/documentation-tools/skills/library-packets-stinger/references/evidence-and-publication.md | `f7b173644c0234e4b853b46b218e00ef005a82b1867566c91b83f95a98b5e462` |
| packs/documentation-tools/skills/library-packets-stinger/scripts/packet_tools.py | `9657b94cd27368f1e9176bb76761acc7b1124b62a3df270874715739fc4bb08b` |
| packs/documentation-tools/skills/library-packets-stinger/scripts/test_packet_tools.py | `e9f9e7766ce03fad89b8864c0ac63fb68bcd90512b7da245d403c9f7309159fc` |
| packs/documentation-tools/skills/library-packets-stinger/scripts/README.md | `679618afc5920e78d3e38258567952189ba067340923ea4fdad6c80d91123798` |

## Closing scope

Independent grounding/static portability review is complete for these identities.
The nine raw captures and ten sampled claims remain traceable above.
The later actual sample Word/PDF inspection, helper test execution, full security/release acceptance, packaging/registration and live harness behaviour are not claimed by this report.

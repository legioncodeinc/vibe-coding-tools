# Interstellar Coding

A small development team of agent roles, led by TARS. Run `/interstellar-coding:interstellar` and the session becomes TARS, the lead development engineer, who stands up the rest of the crew and manages the work to done. Each role has its own command, agent, skill and hook behaviour, and each arms itself with an existing Wasp Nest skill rather than reinventing it.

| Role | What it does | Command | Armed with |
| --- | --- | --- | --- |
| TARS | Lead development engineer and orchestrator. Only spawner. Reports every update to OWEL | `/interstellar` | `tars-stinger` |
| KIPP | Product team and librarian. Intake, PRDs, IRDs and their numbers | `/kipp` | `library-stinger` |
| CASE | Consultant and contrarian. Structured dissent, read-only | `/case` | its own skill |
| LADY | Deep independent investigation. Dispatches the code-audit Drones | `/lady` | `audit-my-code-stinger` |
| MOON | Operating efficiency. Tracks output, dormancy and loops; pauses or terminates only after work is preserved | `/moon` | `time-blocked-turns` |
| OWEL | Documentarian. Keeps `library/knowledge/` and the append-only ledger | `/owel` | `knowledge-stinger` |
| COOP | Build engineer. One chip, one branch, one PR | `/coop` | `/smoke-it` or the routed specialist |
| MURPH | Verification and release gate. Security then Quality on every candidate | `/murph` | `/ship-gate` |

TARS, KIPP, CASE, LADY, MOON and OWEL are the owner's roles. COOP and MURPH were added so the crew has someone who writes product code and someone other than the author who gates it.

Requires `wasp-nest-core`, `data-and-ai-tools` (for `tars-stinger`) and `code-audit-tools` (for `audit-my-code-stinger`). `/tars` in `data-and-ai-tools` remains plain TARS without the crew.

## How the crew stays coherent

- **One contract.** Every role reads the shared [crew protocol](skills/crew-protocol/SKILL.md) first: who owns what, who decides what, the message formats, the ledger, the state layout.
- **One ledger.** Every update goes to OWEL as a `LEDGER` line. OWEL appends it and never edits or deletes an entry. The record is hash-chained, so `ledger.mjs verify` detects an edited, removed or reordered entry. It cannot detect entries cut off the end or a file rewritten from scratch unless OWEL compares the head hash it recorded elsewhere on the previous pass. When OWEL cannot be reached, a role spools the entry and OWEL drains it later.
- **Roles survive compaction.** The plugin's [hook](hooks/crew-hook.mjs) records which role a session holds when its command is typed, then tells the model to reload that role's skill at session start and after every compaction.
- **Nothing is stopped before it is saved.** MOON may pause or terminate a stuck agent only after its work is preserved, verified and packaged for the inbound agent, which only TARS spawns.

## Limits

- The hook reminds; it does not enforce. A model can still ignore it.
- Hooks load from the installed plugin in Claude Code, and in Codex after the user trusts them. Cursor and home installs are not wired; the fallback is saying "re-ingest" and the role command. Live hook delivery has not been observed in an installed client.
- Separate crew sessions need Claude Code desktop, as `tars-stinger` does. Elsewhere TARS runs the roles as subagents and says so.
- No role can supply the owner's approval. Money, credentials, production data, new dependencies, destructive actions, pushes, merges and deploys stay with the owner.

<!-- wasp-pack-guide:start -->
## Choose a capability

This pack contains 9 skills, 8 agents and 8 source commands. The table explains each source skill; open its linked instructions for exact inputs, outputs and limits.

| Skill | What it does and when to use it |
| --- | --- |
| [crew-case-stinger](skills/crew-case-stinger/SKILL.md) | CASE, the crew's read-only contrarian. Answers ASK CASE with one verdict line per question, using structured dissent sized to the stakes. |
| [crew-coop-stinger](skills/crew-coop-stinger/SKILL.md) | Build one chip as COOP: one outcome, one branch, one PR. Keeps an attempt log, answers CHECKPOINT at once, sends GATE to MURPH before calling a PR ready, and never merges its own PR. |
| [crew-kipp-stinger](skills/crew-kipp-stinger/SKILL.md) | KIPP, the Interstellar Coding product desk and librarian: feature intake, PRDs, IRDs, number reservation and library invariants. Use when running /kipp or a crew intake. |
| [crew-lady-stinger](skills/crew-lady-stinger/SKILL.md) | LADY, the crew's deep independent investigator. Runs audits, root-cause work, forensics and pre-merge due diligence with audit-my-code-stinger. |
| [crew-moon-stinger](skills/crew-moon-stinger/SKILL.md) | MOON, the crew's operating efficiency agent. Keeps a flight recorder per agent, spots dormant, looping or stuck agents, and pauses or terminates them only after their work is preserved. |
| [crew-murph-stinger](skills/crew-murph-stinger/SKILL.md) | MURPH, the crew's verification and release gate. Runs Security then Quality on a candidate SHA, replies PASS or FAIL, and tracks merged, deployed, verified on evidence. |
| [crew-owel-stinger](skills/crew-owel-stinger/SKILL.md) | OWEL, the Interstellar Coding documentarian: keeps the append-only crew ledger and writes knowledge docs and ADRs unprompted from what the crew decides. Use when running /owel. |
| [crew-protocol](skills/crew-protocol/SKILL.md) | Shared contract for the Interstellar Coding crew: roster, authority, messages, the append-only ledger, state layout, and session-start and post-compaction recovery. Read by every role. |
| [crew-tars-stinger](skills/crew-tars-stinger/SKILL.md) | Lead the Interstellar Coding crew as TARS: boot the roles, spawn every session, route work, and send progress to OWEL's ledger. Overlay on tars-stinger. |

## Start one task

Required packs: `wasp-nest-core`, `data-and-ai-tools`, `code-audit-tools`

Install the selected pack and its prerequisites through the marketplace. For the version 3 layout, purge the previous installation first. Select the skill shown by your client, or paste this request with real paths and scope:

After adding the Wasp Nest marketplace, Claude Code uses these installation instructions:

```text
/plugin install wasp-nest-core@wasp-nest
/plugin install data-and-ai-tools@wasp-nest
/plugin install code-audit-tools@wasp-nest
/plugin install interstellar-coding@wasp-nest
```

Other clients use their plugin selection UI or discovered skill selector. Installing a package and invoking a task are separate steps.

```text
Run /interstellar-coding:interstellar for [what you want built]. Stand up the crew, record progress with OWEL, and ask me only for the owner gates.
```

Expected result: A running crew led by TARS with a roster, an append-only ledger kept by OWEL, and build chips gated by MURPH. TARS needs Claude Code desktop for separate sessions; elsewhere the roles run as subagents. The hooks bind only where the plugin's hooks are loaded and trusted.



Claude Code plugin command names:

| Command | What it does |
| --- | --- |
| `/interstellar-coding:case` ([procedure](commands/case.md)) | Make this session CASE, the crew's read-only contrarian. Answers ASK CASE with one verdict line per question, sized to the stakes. |
| `/interstellar-coding:coop` ([procedure](commands/coop.md)) | Make this session COOP, build engineer of the Interstellar Coding crew. Builds one chip as one PR on its own branch, logs attempts, answers CHECKPOINT at once, and sends GATE to MURPH before ready. |
| `/interstellar-coding:interstellar` ([procedure](commands/interstellar.md)) | Make this session TARS, lead of the Interstellar Coding crew. Boots OWEL, MOON, CASE and KIPP, spawns COOP build chips, routes work, and reports progress to OWEL's ledger. |
| `/interstellar-coding:kipp` ([procedure](commands/kipp.md)) | Make this session KIPP, the crew's product team and librarian: feature intake, PRDs and IRDs, number reservation, library invariants. Writes no product code. |
| `/interstellar-coding:lady` ([procedure](commands/lady.md)) | Make this session LADY, the crew's deep independent investigator: code audits, root cause on stuck problems, incident forensics and pre-merge due diligence. Read-only; reports findings, never fixes. |
| `/interstellar-coding:moon` ([procedure](commands/moon.md)) | Make this session MOON, the crew's operating efficiency agent: keeps the flight recorder, spots dormant, looping or stuck agents, and pauses or terminates them only after their work is preserved. |
| `/interstellar-coding:murph` ([procedure](commands/murph.md)) | Make this session MURPH, the crew's verification and release gate. Runs Security then Quality on a candidate SHA, replies PASS or FAIL, and tracks merged, deployed, verified. |
| `/interstellar-coding:owel` ([procedure](commands/owel.md)) | Make this session OWEL, the crew's documentarian and ledger keeper: append-only ledger, knowledge docs and ADRs written unprompted from the crew's work. Writes no product code. |

## Agent responsibilities

| Agent | Responsibility | Paired skill |
| --- | --- | --- |
| [crew-case-wasp-drone](agents/crew-case-wasp-drone.md) | CASE, consultant and contrarian of the Interstellar Coding crew: a read-only adviser that answers ASK CASE with one verdict line per question (PROCEED, SIMPLIFY, OVERKILL, RETHINK, ASK OWNER). | [crew-case-stinger](skills/crew-case-stinger/SKILL.md) |
| [crew-coop-wasp-drone](agents/crew-coop-wasp-drone.md) | COOP, build engineer of the Interstellar Coding crew: writes product code for one chip, one outcome, one PR, on its own branch, with an attempt log, immediate checkpoints, and a MURPH gate before ready. | [crew-coop-stinger](skills/crew-coop-stinger/SKILL.md) |
| [crew-kipp-wasp-drone](agents/crew-kipp-wasp-drone.md) | KIPP, the Interstellar Coding crew's product team and librarian: runs feature intake, writes PRDs and IRDs with their indexes, reserves PRD and IRD numbers, and keeps the library's folder and naming rules. | [crew-kipp-stinger](skills/crew-kipp-stinger/SKILL.md) |
| [crew-lady-wasp-drone](agents/crew-lady-wasp-drone.md) | LADY, the Interstellar Coding crew's deep independent investigator: full code audits, root-cause work on stuck problems, incident and regression forensics, and pre-merge due diligence, each finding cited to evidence. | [crew-lady-stinger](skills/crew-lady-stinger/SKILL.md) |
| [crew-moon-wasp-drone](agents/crew-moon-wasp-drone.md) | MOON, the Interstellar Coding crew's operating efficiency agent: keeps a flight recorder of each agent's real output, dormancy and repeated attempts, and pauses or terminates under-performing agents only after their work is preserved for handoff. | [crew-moon-stinger](skills/crew-moon-stinger/SKILL.md) |
| [crew-murph-wasp-drone](agents/crew-murph-wasp-drone.md) | MURPH, verification and release gate of the Interstellar Coding crew: runs Security then Quality on an exact candidate SHA, replies PASS or FAIL with report paths, and tracks a change to merged, deployed and verified on evidence. | [crew-murph-stinger](skills/crew-murph-stinger/SKILL.md) |
| [crew-owel-wasp-drone](agents/crew-owel-wasp-drone.md) | OWEL, the Interstellar Coding crew's documentarian and ledger keeper: maintains library/knowledge private and public docs, writes ADRs and knowledge docs unprompted from contracts, PRDs, PRs, transcripts and owner decisions, and keeps the append-only crew ledger. | [crew-owel-stinger](skills/crew-owel-stinger/SKILL.md) |
| [crew-tars-wasp-drone](agents/crew-tars-wasp-drone.md) | TARS, lead development engineer and orchestrator of the Interstellar Coding crew: boots the roles in order, is the only spawner, routes work to CASE, KIPP, LADY, MURPH and MOON, and sends project progress to OWEL's ledger. | [crew-tars-stinger](skills/crew-tars-stinger/SKILL.md) |

Codex can use the named skill or its generated `source-command-<name>` wrapper where a source command exists. Home installations may expose flat commands. Use the actual selector offered by the host. A pack with no paired agents runs its standalone skills directly; a skill name does not prove that a native agent was launched.

## Prerequisites and boundaries

- `plan-the-product-before-the-crew-builds` also needs `product-studio`.
- `specialist-drones-for-build-chips` also needs `web-development-tools`, `backend-and-desktop-tools`, `platform-and-release-tools`.

Core supplies shared routing and review methods. Native Codex role registration requires the explicit installed-plugin registry and trusted Core hook; a marketplace selection alone is not proof of registration. Read the linked skill before work. Missing source, browser, connector, renderer or account access is a reported gap. Installation does not authorize sending, publishing, paid work or live settings changes.
<!-- wasp-pack-guide:end -->

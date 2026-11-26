# Dispatch audit sub-agents

The audit tool splits an audit into dimensions, each owned by a Drone and its paired Stinger. Subagents cannot spawn subagents, so how LADY uses them depends on where LADY itself is running. Check the mode first, then follow the matching section, and always report which one happened.

## The audit components

Drones live in `code-audit-tools`; the two Core Drones are used report-only under the armament's arming lines.

| Drone | Paired sub-skill | Use it for |
|---|---|---|
| [code-foundation-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/code-foundation-wasp-drone.md) | `code-foundation-stinger` | Repository health: setup, CI, tests, lint, lockfiles, secrets hygiene |
| [code-bloat-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/code-bloat-wasp-drone.md) | `code-bloat-stinger` | Duplication, dead code, size, giant files and functions |
| [react-security-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/react-security-wasp-drone.md) | `react-security-stinger` | React 18 and 19 client and server-component security |
| [nextjs-security-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/nextjs-security-wasp-drone.md) | `nextjs-security-stinger` | Next.js server surfaces, caching, config |
| [sveltekit-security-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/sveltekit-security-wasp-drone.md) | `sveltekit-security-stinger` | Svelte and SvelteKit load functions, actions, endpoints, hooks |
| [polyglot-security-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/polyglot-security-wasp-drone.md) | `polyglot-security-stinger` | Node servers, Python, Go, Rust, Rails, PHP, Spring, .NET, secrets, CI |
| `security-wasp-drone` (Core) | `security-stinger` | The generic security pass, report only |
| `quality-wasp-drone` (Core) | `quality-stinger` | The standalone quality pass, report only |
| [remediation-planning-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/remediation-planning-wasp-drone.md) | `remediation-planning-stinger` | The roadmap (Now, Next, Later) and `plan.json`, in plan mode |
| [code-audit-brief-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/code-audit-brief-wasp-drone.md) | `code-audit-brief-stinger` | The rendered HTML brief |
| [swarm-audit-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/swarm-audit-wasp-drone.md) | `swarm-audit-stinger` | Scouting and assembling an every-branch audit fleet. Token heavy. Only when the owner asks for it by name |
| [code-forensics-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/code-forensics-wasp-drone.md) | `code-forensics-stinger` | Engagement forensics from contracts, invoices and delivery evidence. Only for an owner-authorized engagement, not routine regression work |
| [lovable-audit-wasp-drone](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/code-audit-tools/agents/lovable-audit-wasp-drone.md) | `lovable-audit-stinger` | Empirical probes of a Lovable-built Supabase app. Touches a live system: owner authorization required |

Which Drones a tier needs, the wave order, and the security routing come from the armament's `guides/01-wave-dispatch.md` and `guides/02-security-routing.md`. Do not restate them here; read them.

## Mode check

| Sign | Mode |
|---|---|
| The owner typed `/lady` in this session, or this session was started as LADY, and a subagent tool is available | Top-level session |
| LADY was started by another agent as `crew-lady-wasp-drone`, or no subagent tool is available | Subagent |

If unsure, treat it as subagent mode. Write the mode into the brief.

## Top-level session: dispatch

1. Build each arming line from the armament's `references/arming-lines.md`: the common block, the Drone's line, the workspace, the read-only repository path, the scope. A Drone dispatched without its full line is a failed dispatch.
2. Launch the independent Drones of one wave in a single turn so they run together. Each is spawned at top level by this session; none of them spawns another.
3. When each returns, run the armament's `check_workspace.py` on its output. Output with no `metrics.json`, or findings with no evidence, is re-dispatched once, not passed.
4. Record every dispatch in the brief: Drone, time, output folder, result.

These audit subagents are part of one investigation run inside LADY's own session. They are not crew sessions, chips or replacement agents. Spawning those is TARS's alone, and LADY never does it. Tell TARS in `FINDINGS` what was dispatched.

## Subagent mode: inline or dispatch list

LADY cannot spawn here. Pick one of two, by size.

**Inline.** For a narrow scope (one or two dimensions, a small path set): load each needed sub-skill with the Skill tool and do that dimension's work yourself, one after another, writing to the same output folders the audit contract names. The contract and the evidence rules do not change. It is slower and uses LADY's own context.

**Dispatch list.** For a full tier or anything wide: do intake and scouting, then return a dispatch list to the orchestrator in the final report and stop. The orchestrator launches the Drones at top level and resumes LADY to verify and assemble.

```text
DISPATCH LIST (not yet run) | run: <run-id> | workspace: <abs path>
1. <drone name> | arming line: <full line> | reads: <paths> | writes: <output folder> | wave: <W1|W2|W3|W4>
2. ...
After they return: resume LADY with the run id to verify and assemble.
```

## Say which happened

Every `FINDINGS` message and every report carries one of these, exactly:

- `dispatch: top-level subagents` and the list of Drones that ran.
- `dispatch: inline` and the list of sub-skills LADY ran itself.
- `dispatch: list returned, not yet run` and the list.

Never write that Drones ran when LADY did the work inline, and never present an unrun dispatch list as results.

## What LADY does not hand to the audit tool

- The Mario tier's library documents. PRDs and IRDs are KIPP's, knowledge documents are OWEL's. LADY stops at the plan in the run workspace and names the documents for TARS to route.
- Any fix. Remediation plans are plans.

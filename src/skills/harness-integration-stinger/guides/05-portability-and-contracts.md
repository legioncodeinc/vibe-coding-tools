# Guide 05: Cross-Harness Portability - Spec-Six Frontmatter, AGENTS.md, Plugin Manifests, Tool Contracts

**Sources:** `research/distilled-harness-integration.md` §5; queen-bee-stinger distilled-research-articles.md, Claude Code §Skills (SUPPLEMENT: "Portability-critical rule"), §Plugins; Cursor §Plugins; ChatGPT Codex §Plugins; Claude Cowork §Plugins, §Commands (slash-command bug); `research/external/2026-08-14-agentskills-spec-six-fields.md`; `research/external/2026-08-14-agentsmd-standard.md`; `research/external/2026-08-14-cross-host-compiler-degradation-model.md`

---

## Agent Skills spec-six frontmatter is the portable skill format

Only six frontmatter fields are legal outside Claude Code's own extended dialect: **`name`, `description`, `license`, `compatibility`, `metadata`, `allowed-tools`.** Any other field - `context: fork`, `disable-model-invocation`, `argument-hint`, `paths`, `hooks`, `arguments`, and the rest of Claude Code's richer extensions - is a Claude-Code-only superset.

| Field | Required | Constraints |
|---|---|---|
| `name` | Yes | Max 64 characters. Lowercase letters, numbers, hyphens only. Must not start or end with a hyphen. |
| `description` | Yes | Max 1024 characters. What the skill does and when to use it - this is the auto-invocation trigger text, not human-readable prose. |
| `license` | No | License name or reference to a bundled license file. |
| `compatibility` | No | Max 500 characters. Environment requirements (intended product, system packages, network access, etc.). |
| `metadata` | No | Arbitrary string-to-string key-value map. |
| `allowed-tools` | No | Space-separated string of pre-approved tools the skill may use. (Experimental) |

A skill using only these six fields loads unmodified in Claude Code, Cursor, Codex, and (via account sync) Cowork. A skill using Claude-Code-only fields throws a hard packaging/upload error the moment it leaves Claude Code proper (claude.ai uploads, the Skills API, `package_skill.py`, and therefore Cowork's own "Save skill" install pipeline). **Author every skill intended for cross-harness use against the six-field table first; treat richer frontmatter as an opt-in, Claude-Code-specific enhancement layered on top, never a requirement.**

Progressive disclosure - metadata always resident, body loads on activation, `scripts/`/`references/`/`assets/` load only as needed - is identical across all four harnesses. Keep `SKILL.md` bodies lean (the spec recommends under 500 lines) regardless of target harness; the token cost is paid identically everywhere a skill loads.

---

## AGENTS.md is the shared rules baseline

Plain Markdown, no required frontmatter, officially stewarded by the Agentic AI Foundation / Linux Foundation as a vendor-neutral format. Codex reads it natively; Cursor treats it as a first-party, frontmatter-free rule type alongside `.cursor/rules/*.mdc`; Claude Code doesn't read it directly but can pull it in via `@AGENTS.md` import (or a symlink, admin/dev-mode permitting on Windows) at the top of `CLAUDE.md`, with Claude-specific instructions layered below. Cowork has no direct AGENTS.md story - its rules mechanism is Global/Folder instructions set through the app UI - but a repo-committed `AGENTS.md` still ships to a Cowork cloud session as an ordinary file Claude can read if a skill or plugin points to it.

**For content that genuinely applies to every harness** (build commands, test commands, code style, security considerations): author it once as a root `AGENTS.md`, then layer any harness-specific addendum in that harness's own native mechanism, rather than maintaining three near-duplicate rule files that drift out of sync.

### One real, unresolved discrepancy - don't paper over it

The base spec's FAQ states single-file "closest wins" resolution. Codex's actual documented CLI behavior is reported as **concatenating** every `AGENTS.md` from git root to cwd, with later (closer) files taking precedence in the resulting prompt order rather than being the *only* file loaded - an open, unresolved issue upstream (agentsmd/agents.md#53). Practical effect: a subdirectory-only `AGENTS.md` is invisible to Cursor and to Claude Code's import path (neither implements Codex's nested-concatenation walk), but Codex will pick it up and inject it as its own message. Don't assume a nested `AGENTS.md` behaves identically across harnesses - verify against the specific harness before relying on it.

---

## Plugin manifests do not converge into one format

There is no single portable plugin manifest across all four harnesses. The one genuinely portable subset is the **Agent Plugins open standard** (agent-plugins.org): a `plugin.json` at plugin root declaring only skills + MCP servers, which "loads in Cursor unmodified" and is explicitly the cross-harness path - but it's a strict subset of what any one harness's own richer manifest supports.

| Manifest | Root key convention | Component references |
|---|---|---|
| Claude Code / Cowork `.claude-plugin/plugin.json` | flat top-level fields (`skills`, `commands`, `agents`, `hooks`, `mcpServers`, `lspServers`, `outputStyles`) | strings or arrays of paths; only `name` strictly required if a manifest exists |
| Cursor `.cursor-plugin/plugin.json` | same shape family (`rules`, `agents`, `skills`, `commands`, `hooks`, `mcpServers`, plus Cursor-only `variables`) | folder auto-discovery if a field is omitted; an explicit field *replaces* discovery for that type |
| Cursor/agent-plugins.org `plugin.json` | minimal (`skills`, `mcpServers` only) | the actual cross-harness-portable subset |
| Codex `.codex-plugin/plugin.json` | `skills`, `mcpServers` (path to `.mcp.json`), `apps` (path to `.app.json` connector refs), `hooks`, plus a rich `interface.*` block for ChatGPT desktop UI metadata | paths, not inline component definitions |

Claude Code and Cowork share one manifest format - "built for Claude Cowork, also compatible with Claude Code," per Anthropic's own positioning - which is a different, richer schema than either Cursor's or Codex's own manifest.

**Practical rule**: when a capability needs to ship as a plugin across all four harnesses, plan on writing separate manifests per distinct schema (Claude Code/Cowork share one; Cursor and Codex each need their own), not one manifest hand-waved as portable. If the capability is skills + MCP only, the Agent Plugins open-standard `plugin.json` is the one case where a single manifest genuinely works everywhere it's read.

---

## Tool/command contract stability, generalized

Whenever a capability's surface is exposed through more than one mechanism across harnesses - an MCP tool on one harness, a native-extension-registered tool on another, a documented-in-skill convention on a third - **keep the name, arguments, and return shape byte-identical everywhere it's exposed.** This is the one piece of the old Hivemind-specific tool contract (`hivemind_search`/`read`/`index`, kept identical across six adapters) that generalizes unchanged to any capability with a multi-harness tool surface: drift in one harness silently breaks whatever depends on the surface being consistent, with no error at the point of drift - only downstream, when a consumer on a different harness gets an unexpected shape back.

Add a new tool to the surface in lockstep across every harness that exposes it in the same change, not as a follow-up. A one-harness-only addition or rename is a contract-drift finding worth flagging explicitly, the same way `guides/02-hook-lifecycle.md` treats a hook added to only one harness's config.

---

## Known Cowork-specific slash-command gotcha

Cowork implements its own slash-command/Skill-tool resolution path, separate from (and not perfectly in sync with) the Claude Code CLI's plugin-skill loader, even though both consume the same package format. A documented bug class (GitHub issue #46079, closed as duplicate of #41842): skills defined in `skills/*/SKILL.md` inside a custom org plugin appear correctly in Cowork's slash-command menu but invoking them can return `Unknown skill: plugin-name:skill-name`. The documented workaround was a skills table in the plugin's `CLAUDE.md` mapping trigger phrases to file paths, so Claude falls back to reading the file directly via the Read tool when the Skill tool fails. **Portability takeaway**: a plugin's flat `commands/*.md` directory (legacy format) has historically been more reliably invocable as a slash command across both the Claude Code CLI and Cowork than a `skills/*/SKILL.md` directory, even though `skills/` is the officially recommended format going forward. If a capability's slash-command invocation is load-bearing in Cowork specifically, test it directly rather than assuming the newer format works identically everywhere it's documented to.

---

*See also:* `guides/01-component-placement.md` for where each format lives per harness, and `guides/06-distribution-and-audit.md` for how these manifests actually ship through each harness's install/marketplace flow.

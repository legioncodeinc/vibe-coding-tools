# AGENTS.md Reference (Codex-specific hierarchy details) | agentconfig.ing
- URL: https://agentconfig.ing/files/agents-md/
- Fetched: 2026-08-14
- Source type: community
- Component: rules

AGENTS.md — instruction file for GitHub Copilot, OpenAI Codex CLI, Lovable

AGENTS.md is a shared instruction file read by both GitHub Copilot and OpenAI Codex CLI (as well as Lovable and other tools). It follows a similar philosophy to CLAUDE.md — a Markdown file committed to your repository that tells AI agents how to work with your codebase.

The critical behavioral difference between tools is the scoping model. Codex CLI concatenates all AGENTS.md files from the Git root down to the current working directory, with later files overriding earlier guidance. Each file appears as its own user-role message with a header like `# AGENTS.md instructions for <path>`. GitHub Copilot uses nearest-ancestor-only resolution — it walks up from the current file and uses only the first AGENTS.md it finds, ignoring all parent files.

Codex CLI also supports `AGENTS.override.md` at each directory level: if found, the regular AGENTS.md in that directory is skipped. This enables personal overrides without modifying team files. Additionally, Codex supports fallback filenames (configurable via `project_doc_fallback_filenames` in config.toml) and a configurable max file size (`project_doc_max_bytes`, default 64KB).

AGENTS.md has no special syntax — it is plain Markdown. There are no include directives, no YAML frontmatter, and no glob patterns.

Locations, load order (lower numbers load first, higher-priority files override lower ones):
1. `~/.codex/AGENTS.md` (global)
2. `./AGENTS.md` (project)
3. `<dir>/AGENTS.md` (directory)

✗ WRONG: `agents.md`, `Agents.md`
✓ RIGHT: `AGENTS.md` (exact uppercase required)

Like CLAUDE.md, the filename must be exactly AGENTS.md with uppercase letters. Both Codex CLI and GitHub Copilot look for this exact name.

✗ WRONG: Assuming all tools handle directory hierarchy the same way
✓ RIGHT: Codex concatenates root-to-CWD; Copilot uses nearest-ancestor-only

This is a critical difference. Codex CLI walks from the Git root down to CWD and concatenates ALL AGENTS.md files found along the path — later files override earlier ones. GitHub Copilot uses nearest-ancestor-only: it walks up from the current directory and uses only the first AGENTS.md it finds, ignoring parent files entirely. Subdirectory files must be self-contained for Copilot but can be incremental for Codex.

Use AGENTS.override.md for personal overrides (gitignored). Codex CLI checks for AGENTS.override.md before AGENTS.md at each directory level. If the override file exists, AGENTS.md in that same directory is skipped entirely. This allows personal customizations without modifying team files. Not supported by GitHub Copilot.

Codex CLI can be configured to look for alternative filenames like TEAM_GUIDE.md or .agents.md via the `project_doc_fallback_filenames` setting in config.toml. These are only checked if no AGENTS.md or AGENTS.override.md is found. GitHub Copilot only looks for AGENTS.md.

---

# AGENTS.md design decisions | ccmd.dev
- URL: https://ccmd.dev/t/agents-md-design-decisions
- Fetched: 2026-08-14
- Source type: community
- Component: rules
- Author: Matthew Diakonov, published 2026-05-21

Seven explicit decisions in the published AGENTS.md spec: (1) plain markdown only, no YAML or schema; (2) a single root-level file, not a directory; (3) no required fields or sections; (4) the literal filename `AGENTS.md` chosen over earlier candidates like AI.md and BOT.md; (5) nested subdirectory files override by concatenation (an OpenAI Codex extension), not by replacement; (6) a 32 KiB default cap on the file body the loader reads; (7) no `@-import` or include syntax in the base spec. Verified against agents.md and OpenAI's Codex documentation on 2026-05-21.

## 5. Nested files concatenate, they do not replace

This is the one Codex-specific decision in the list. OpenAI's docs describe it directly: "Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt."

The mechanism is loader order, not file precedence. There is no "subdirectory file wins" rule in the spec. There is just "later in the prompt wins because LLMs weight later instructions higher." The token consequence is that the prompt grows linearly with how deep in the directory tree you are working. Open a file in `src/billing/refunds/` in a repo with AGENTS.md at every level and Codex injects four AGENTS.md bodies into the system prompt, joined by blank lines.

Cursor and Claude Code do not implement this concatenation. A subdirectory-only AGENTS.md is invisible to them.

## 7. No @-import or include syntax in the base spec

Anthropic's CLAUDE.md supports `@path/to/file.md` imports up to a five-hop recursion limit. AGENTS.md itself has no equivalent — the spec is the file contents; the file contents are the spec. The trade is composition vs simplicity.

## Comparison table (from the article)

| Decision | Alternative approach elsewhere | AGENTS.md choice |
| --- | --- | --- |
| Single root-level file (no .agents/ directory) | Cursor uses `.cursor/rules/*.mdc`. Anthropic uses `.claude/skills/<name>/SKILL.md`. Both shard rules across many files. | One file at the repo root. Subdirectory AGENTS.md files are allowed but optional. |
| The literal filename 'AGENTS.md' | Earlier candidates included AI.md, BOT.md, CONTRIBUTING-AI.md. Cursor uses `.cursorrules`. Anthropic uses CLAUDE.md. | Plural noun, all-caps, .md extension in the style of README.md. |
| Nested subdirectory files override by concatenation | CLAUDE.md uses @-import to inline another file's body. Cursor's .mdc files have explicit glob scoping. Both replace, do not concatenate. | OpenAI Codex concatenates AGENTS.md files from the root down, joining with blank lines. |
| No @-import or include syntax in the base spec | Claude Code resolves @path/to/file.md up to a five-hop limit before injecting into the system prompt. | AGENTS.md is its own contents and nothing else. |

## Under OpenAI Codex specifically

"Under OpenAI Codex specifically: nothing [is lost by nesting], as long as you also keep the root one. Codex walks from project root down to the current working directory and concatenates one AGENTS.md per level (joined by blank lines). Files closer to your cwd appear later in the combined prompt and therefore override earlier guidance on conflict. Under Cursor or Claude Code, which do not implement nested AGENTS.md discovery, a subdirectory-only file is invisible. This is the most common drift: a project ships an AGENTS.md in src/billing/ and assumes every agent reads it. Only Codex does."

---

## GitHub issue: agentsmd/agents.md#53 (discrepancy discussion)
- URL: https://github.com/agentsmd/agents.md/issues/53
- Fetched: 2026-08-14
- Source type: community
- Component: rules

Title: "When there are multiple agents.md files in a large monorepo, will it ignore the one at repo and use the nearest agents.md?"

Quoted comment (zikajk, 2026-03-29):
> The [Codex instructions](https://developers.openai.com/codex/guides/agents-md) say exactly the opposite of what the AGENTS.md website implies is the spec.
>
> > Merge order: Codex concatenates files from the root down, joining them with blank lines. Files closer to your current directory override earlier guidance because they appear later in the combined prompt.
>
> I think the AGENTS.md website should clarify this, because it has a really substantial impact on agent behaviour.
>
> I guess the options are as follows:
>
> 1. Codex is behaving out of spec, it is intended that only the closest file will ever be read.
> 2. Concatenating the nested AGENTS.md files is the intended behaviour and the website should be updated to reflect this
> 3. Concatenation is an optional behaviour and agents may allow you to configure which AGENTS.md files they read
>
> Personally I think 1 would be very annoying and would prefer 2/3. Would be good to get an opinion from @romainhuet

This remains an open/unresolved discrepancy between the base agents.md spec site (which frames precedence as "closest file wins, no merge") and OpenAI's own Codex documentation (which describes root-down concatenation as the actual runtime behavior).

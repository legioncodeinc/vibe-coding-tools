# Commands across the four harnesses, told honestly

The short version: every harness in this research is moving commands into skills, at different speeds and with different amounts of breakage along the way. Nobody has fully finished the migration, and one harness (Cowork) currently has a bug that makes the "modern" path less reliable than the "legacy" path. This file exists so a Hive stinger author doesn't get burned by treating "commands are dead, just use skills" as universally true today. Citations are deliberately not inline in this file: every claim traces to `references/research/distilled-research-articles.md`, which cites `raw/` sources per claim. Verify anything here against the distilled doc's Commands sections and follow its bracketed raw citations.

## Claude Code: commands merged into skills, legacy still works

Commands have been merged into skills. `.claude/commands/deploy.md` and `.claude/skills/deploy/SKILL.md` both create `/deploy` and behave the same. Existing `.claude/commands/` files keep working; skills are the modern path because they support supporting-file directories, invocation-control frontmatter, and auto-invocation, none of which a flat commands file gets. The official `/docs/en/slash-commands` URL now redirects to the skills page, which is Anthropic's own signal about which one is current.

If a skill and a `.claude/commands/` file share a name, **the skill wins**.

A command or skill invocation is only recognized at the start of a message; trailing text becomes its arguments. As of v2.1.199 skills got an exception to this: chaining like `/skill-a /skill-b do XYZ` loads every named skill (up to six) and passes the trailing text to each.

The legacy shape, still valid today: `.claude/commands/<name>.md`, purely reactive, no description field, Claude can't auto-invoke it, one markdown file, no metadata. That's just the "bare minimum, no frontmatter beyond a comment" case of a skill now, not a separate system.

Plugins add commands the same way: `commands/<name>.md` flat files, legacy but supported, versus `skills/<name>/SKILL.md`, preferred for new plugins. `$ARGUMENTS` inside a plugin command body captures the trailing user text, e.g. `Greet the user named "$ARGUMENTS" warmly`.

## Cursor: standalone commands page is gone, plugins keep commands first-class

As of July 2026 the standalone commands documentation page no longer exists on cursor.com/docs; the Agent Skills docs treat commands only as a migration source, not a living feature. Existing `.cursor/commands/*.md` files still load and work, they're just not where new work should go.

The legacy shape: `.cursor/commands/` (project) or `~/.cursor/commands/` (global), one markdown file per command, **no required frontmatter**, invoked only via `/command-name`, human-only trigger (the agent never auto-invokes a command). Commands can be chained: `/commit and /pr these changes to fix DX-523`.

Migration path: `/migrate-to-skills`, a built-in skill since Cursor 2.4. It converts dynamic rules (`alwaysApply: false` or undefined, no `globs`) and slash commands (both user- and workspace-level) into skills. Converted commands get `disable-model-invocation: true` in the new skill's frontmatter, which preserves the original human-only invocation behavior instead of letting the agent auto-trigger it. Rules with `alwaysApply: true` or specific `globs` are NOT migrated by this tool, because their trigger semantics don't map onto a skill.

Despite the standalone commands page disappearing, **the Plugins reference still documents a `commands/` component type for plugin bundles.** So a hand-authored `.cursor/commands/x.md` file is legacy, but a plugin's `commands/` folder is still first-class, official, actively documented packaging. Plugin command frontmatter is `name` and `description` only:

```markdown
---
name: deploy-staging
description: Deploy the current branch to the staging environment
---
```

## Codex: custom prompts officially deprecated, migrate to skills

Custom prompts are deprecated. OpenAI's own guidance: "Use skills for reusable instructions that Codex can invoke explicitly or implicitly." A maintainer confirmed on GitHub issue #7047: "We have decided to deprecate support for custom prompts. We recommend switching to skills, which provide all of the functionality of custom prompts and more." This is documented here for migration and portability reference only; new Hive work targeting Codex should use skills, not prompts.

The legacy shape, while it still functions: prompt files live at `$CODEX_HOME/prompts` (default `~/.codex/prompts`). Only top-level `.md` files load, case-insensitive; subdirectories are not scanned. The filename minus `.md` becomes the command name, invoked as `/prompts:<name>`.

```markdown
---
description: Prep a branch, commit, and open a draft PR
argument-hint: [FILES=<paths>] [PR_TITLE="<title>"]
---
Create a branch named `dev/<feature_name>` for this work.
```

Restart Codex after editing prompt files; changes aren't picked up live.

### `$NAME` versus `$1`-`$9`/`$ARGUMENTS`

Two mutually exclusive, auto-detected argument styles in a Codex custom prompt:

1. **Named** (recommended while the feature lasts): `$NAME` where `NAME` matches `[A-Z][A-Z0-9_]*`. Invoke with `key=value` pairs, shlex-parsed, quote values containing spaces. A missing required named argument produces a composer error instead of silently submitting.
2. **Positional**: `$1` through `$9`, or `$ARGUMENTS` for everything joined by a space. The presence of any numeric placeholder triggers positional-mode detection for that prompt.

`$$` emits a literal dollar sign in either style. A known bug (issue #7047) breaks `$ARGUMENTS` resolution specifically when a pasted argument collapses into a `[Pasted Content N chars]` composer indicator; the command stays literal text instead of substituting.

## Cowork: its own slash resolution path, and a live reliability bug

Cowork has no `/plugin` CLI panel the way Claude Code CLI does; command and skill surfacing happens through a GUI. More importantly, **Cowork implements its own slash-command and Skill-tool resolution path, separate from the Claude Code CLI's plugin-skill loader**, even though both consume the same `.claude-plugin/plugin.json` plus `skills/*/SKILL.md` package format.

Naming convention (shared format, confirmed against Cowork's own UI):

| Skill location | Command name source | Example |
|---|---|---|
| `.claude/skills/<name>/SKILL.md` | Directory name | `/deploy-staging` |
| Nested `.claude/skills/` (name clash) | Subdirectory path + skill dir name | `/apps/web:deploy` |
| `.claude/commands/<name>.md` | File name minus extension | `/deploy` |
| Plugin `skills/` subdirectory | Frontmatter `name` or dir name, plugin-namespaced | `/my-plugin:review` |
| Plugin root `SKILL.md` | Frontmatter `name`, plugin dir as fallback | `/my-plugin:review` |

### The bug: GitHub issue #46079

Closed, auto-closed as duplicate of #41842. Filed 2026-04-10. Symptom: skills defined in `skills/*/SKILL.md` inside a custom org plugin appear correctly in the Cowork slash-command menu under a "Plugin name" section. Invoking them, whether by clicking the menu entry or typing `/skill-name`, returns `Unknown skill: plugin-name:skill-name`. Only `anthropic-skills:*` skills reliably worked via the Skill tool at the time of the report.

Documented workaround: add a skills table to the plugin's CLAUDE.md mapping trigger phrases to file paths, so Claude reads the SKILL.md directly via the Read tool when the Skill tool fails. It works, but it adds an unnecessary failure-and-retry step to every invocation.

This is the same class of bug as a related, already-fixed CLI-side issue (#41842): plugin skills in `skills/*/SKILL.md` loaded fine as Agent Skills (the model could invoke them), but historically were not registered as user-invocable `/plugin-name:skill-name` slash commands. Only files in `commands/` reliably registered as slash commands on the CLI side. That CLI-side fix landed in Claude Code CLI v2.1.98. Cowork's #46079 report, filed months later, is the same failure mode recurring in Cowork's separate resolution path, and no raw source in this research confirms a Cowork-side fix has landed.

**Practical consequence for the Hive**: a plugin's `commands/` directory (legacy flat markdown) is currently more reliably invocable as a slash command across both CLI and Cowork than a `skills/` directory skill, even though `skills/` is the officially recommended format going forward. Any Hive plugin targeting Cowork should consider shipping `commands/` flat files alongside `skills/`, at least until this bug is confirmed fixed, so a user typing `/plugin-name:skill-name` in Cowork actually gets a response instead of an error.

## Argument substitution comparison table

| Harness | Mechanism | Syntax |
|---|---|---|
| Claude Code (skills, current) | `$ARGUMENTS`, `$ARGUMENTS[N]`, `$N`, `$name` (via `arguments` frontmatter) | resolves inside the skill body |
| Claude Code (plugin commands, legacy) | `$ARGUMENTS` | captures all trailing text |
| Cursor (commands, legacy) | none documented; trailing text after `/command-name` becomes freeform extra context, not a substitution variable | n/a |
| Codex (custom prompts, deprecated) | `$1`-`$9`, `$ARGUMENTS`, `$NAME` (named style), `$$` (literal dollar) | mutually exclusive named vs. positional modes, auto-detected |
| Cowork | inherits whichever underlying mechanism the invoked file uses (skill or legacy command); no Cowork-specific substitution syntax documented | n/a |

The `$1`-`$9`/`$ARGUMENTS`/`$NAME` family is conceptually the same shape across Claude Code and Codex, which is why the Hive command template in this folder uses `$ARGUMENTS`/`$1` as its baseline: it is the pattern most likely to be recognized or trivially adaptable everywhere, even in a harness whose native mechanism differs.

## Gaps, stated plainly

- No raw source documents whether Cowork's bug #46079 has been fixed since the April 2026 filing. Treat `commands/` as the safer bet for Cowork until confirmed otherwise.
- Cursor's raw research doesn't explain why skill import lives under the rules importer panel (Customize -> Rules -> Add Rule -> Remote Rule) rather than its own panel; noted as an open question, not resolved here.
- No raw source gives Cowork's own argument-substitution syntax, if any exists beyond inheriting the invoked skill's or command's mechanism.

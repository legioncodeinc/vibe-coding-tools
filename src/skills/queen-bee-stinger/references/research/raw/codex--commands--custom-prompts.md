# Custom Prompts – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/custom-prompts
- Fetched: 2026-08-14
- Source type: official-docs
- Component: commands

**Custom prompts are deprecated.** Use skills for reusable instructions that Codex can invoke explicitly or implicitly.

Custom prompts (deprecated) let you turn Markdown files into reusable prompts that you can invoke as slash commands in both the Codex CLI and the Codex IDE extension.

Custom prompts require explicit invocation and live in your local Codex home directory (for example, `~/.codex`), so they're not shared through your repository. If you want to share a prompt (or want Codex to implicitly invoke it), use skills.

1. Create the prompts directory: `mkdir -p ~/.codex/prompts`
2. Create `~/.codex/prompts/draftpr.md` with reusable guidance:

```md
---
description: Prep a branch, commit, and open a draft PR
argument-hint: [FILES=<paths>] [PR_TITLE="<title>"]
---

Create a branch named `dev/<feature_name>` for this work.
If files are specified, stage them first: $FILES.
Commit the staged changes with a clear message.
Open a draft PR on the same branch. Use $PR_TITLE when supplied; otherwise write a concise summary yourself.
```

3. Restart Codex so it loads the new prompt (restart your CLI session, and reload the IDE extension if you are using it).

Expected: Typing `/prompts:draftpr` in the slash command menu shows your custom command with the description from the front matter and hints that files and a PR title are optional.

## Add metadata and arguments

Codex reads prompt metadata and resolves placeholders the next time the session starts.

- Description: Shown under the command name in the popup. Set it in YAML front matter as `description:`.
- Argument hint: Document expected parameters with `argument-hint: KEY=<value>`.
- Positional placeholders: `$1` through `$9` expand from space-separated arguments you provide after the command. `$ARGUMENTS` includes them all.
- Named placeholders: Use uppercase names like `$FILE` or `$TICKET_ID` and supply values as `KEY=value`. Quote values with spaces (e.g. `FOCUS="loading state"`).
- Literal dollar signs: Write `$$` to emit a single `$` in the expanded prompt.

After editing prompt files, restart Codex or open a new chat so the updates load. Codex ignores non-Markdown files in the prompts directory.

## Invoke and manage custom commands

1. In Codex (CLI or IDE extension), type `/` to open the slash command menu.
2. Enter `prompts:` or the prompt name, e.g. `/prompts:draftpr`.
3. Supply required arguments: `/prompts:draftpr FILES="src/pages/index.astro src/lib/api.ts" PR_TITLE="Add hero animation"`
4. Press Enter to send the expanded instructions (skip either argument when not needed).

Expected: Codex expands the content of `draftpr.md`, replacing placeholders with the arguments supplied, then sends the result as a message.

Manage prompts by editing or deleting files under `~/.codex/prompts/`. Codex scans only the top-level Markdown files in that folder — place each custom prompt directly under `~/.codex/prompts/`, not in subdirectories.

---

## Corroborating detail from GitHub issue #5039 (openai/codex) — canonical syntax reference
- URL: https://github.com/openai/codex/issues/5039
- Source type: community (GitHub, high-confidence code-derived)

Where prompts live and how they're named:
- Location: Markdown files in `$CODEX_HOME/prompts` (defaults to `~/.codex/prompts`). Only `.md` files are loaded (case-insensitive extension). Implementation: `codex-rs/core/src/custom_prompts.rs`.
- Command name: The filename (without `.md`) becomes the slash command name. Invoke with `/prompts:<name>`. Prefix constant: `PROMPTS_CMD_PREFIX = "prompts"`.
- Optional frontmatter: `description` and `argument_hint`; body after frontmatter is the prompt content.

Two argument styles, determined by template content:

1. **Named arguments** (recommended): reference variables as `$NAME` where NAME matches `[A-Z][A-Z0-9_]*`. Invoke with `key=value` pairs after the command (shlex parsing; quote values with spaces).
   - Example content: `Review $USER changes on $BRANCH`
   - Invoke: `/prompts:review USER=Alice BRANCH=main` or `/prompts:review USER="Alice Smith" BRANCH=dev-main`
   - Missing required named args → the composer reports an error instead of submitting.
   - UI helper prefills `/prompts:name ARG="" ARG2=""` with cursor placed inside the first quotes.

2. **Positional arguments**: use `$1`..`$9` for the first nine positional args, `$ARGUMENTS` for all joined by a single space. Presence of any `$1`-`$9` or `$ARGUMENTS` triggers positional-mode detection (`prompt_has_numeric_placeholders`).
   - Example content:
     ```
     Header: $1
     Args: $ARGUMENTS
     Ninth: $9
     ```
   - Invoke: `/prompts:my-prompt "Header value" foo bar`

Command form: `/prompts:<name> ...` where `...` are either positional args or `key=value` pairs depending on template content. Parsing functions: `parse_slash_name`, `expand_custom_prompt`, `parse_prompt_inputs`, `parse_positional_args` (all in `codex-rs/tui/src/bottom_pane/prompt_args.rs`).

## Deprecation confirmation — GitHub issue #7047 (openai/codex)
- URL: https://github.com/openai/codex/issues/7047
- Source type: community (GitHub, maintainer comment)

Bug report: custom prompts using `$ARGUMENTS` fail to resolve when the pasted argument text is long enough to be truncated/collapsed in the composer (`[Pasted Content 3000 chars]` indicator) — the slash command then isn't recognized and stays as literal text.

Maintainer response (quoted): "We have decided to deprecate support for custom prompts. We recommend switching to skills, which provide all of the functionality of custom prompts and more."

## PR history (feature provenance)
- PR #2696 (openai/codex, 2025-08-26): Original implementation. Adds `Op::ListCustomPrompts` to core; TUI populates custom prompts from `~/.codex/prompts/*.md`, excluding filename collisions with builtins; selecting a custom prompt auto-submits its content.
- PR #3565 (openai/codex, 2025-09-14): Adds `$1`-`$9`/`$ARGUMENTS`/`$$` argument expansion, `@` file picker in composer, and frontmatter `description`/`argument-hint` hints shown in the slash popup.

## Practical takeaway for building a Codex-analogous "commands" component (from community synthesis, skills/loop-forge reference notes)

Native custom prompts in Codex are explicit-invocation-only, are deprecated in favor of skills, and have had reliability regressions (prompts in `~/.codex/prompts` reportedly not appearing after some CLI updates — see openai/codex#15941). The variable convention (`$1`-`$9`, `$ARGUMENTS`, `$NAME`, `$$`) is the same family as Claude Code's `$ARGUMENTS`/`$1` slash-command variables, which makes cross-tool "command" authoring conventions reasonably portable even though the underlying Codex mechanism itself is being phased out.

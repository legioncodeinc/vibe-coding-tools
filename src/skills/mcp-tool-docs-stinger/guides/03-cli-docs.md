# 03 - Documenting a CLI

How to document any command-line surface, from real source, not from memory. Read `research/distilled-mcp-tool-docs.md` (section 3) before running this guide - this is the newest general territory this skill covers; there was previously no vendor-neutral CLI research behind guide 03 at all.

## Two surfaces, two jobs

Every CLI has, or should have, two documentation surfaces that do different jobs:

1. **Help text** (`-h` / `--help` / a `help` subcommand) - lives inside the binary, versions with the binary, and can never drift from the tool the way an external doc can, because there may be no repo or README available once the tool is installed standalone. Its job is a brief, immediate sense of what the tool is, what's available, and how to do the most common tasks.
2. **A written reference** (a markdown/docs-site page, a man page, or both) - the full detail help text has no room for: what the tool is for, what it *isn't* for, how it works, every flag and edge case. This is what this Bee typically produces as a deliverable.

Document both from the same source of truth - the CLI's real argument-parsing definitions - so they cannot silently disagree with each other.

## Document from the dispatch, never from memory

Find the CLI's routing (its arg-parsing setup, its `if (cmd === ...)` dispatch, its subcommand tree - whatever form it takes) and its own usage/help string. To document a command:

1. Find its branch in the dispatch.
2. Follow the handler into the implementation to learn what it actually does and what it writes.
3. Read the matching block of the tool's own usage/help text for the official flag list.
4. Confirm every documented flag is parsed, and every parsed flag is documented - a mismatch either way is a defect.

## What to capture per command

1. **Usage line** - exactly as the tool's own `--help` states it.
2. **Purpose** - one or two sentences: what it does.
3. **Flags** - each flag, whether it takes a value, its default, and any env-var fallback. State defaults explicitly - never leave one implied. An undocumented default gets guessed at by a reader (human or agent), and a guess that happens to look right is indistinguishable from a correct one.
4. **Side effects** - be specific about what is written or changed: which files, which config, what network calls. "Installs the tool" is not a side-effect statement; "copies bundle files into `<dir>` and patches `<config file>` (backup written first)" is.
5. **Non-interactive path** - if the command can prompt (confirmation, login flow), document the flag that skips the prompt. A command with no non-interactive path is a hazard for any scripted or agentic caller: a blocking prompt with nothing arriving on stdin hangs until a timeout with no useful error.
6. **Disambiguation** - if two commands could plausibly be confused (similar names, overlapping behavior), state explicitly that they are *not* equivalent and why. A note that only describes the correct option is useless to a reader who already believes they've found it - name the wrong choice too.
7. **Example** - a real invocation.

Use the template at `templates/cli-command-reference.md`.

## General conventions worth applying to any CLI reference

- **Lead with examples.** Readers reach for a worked example before any other form of documentation - show one first, especially for the common complex case.
- **Concise help vs. full help are different outputs.** Concise (shown on `-h` or on missing required args): one-line description, one or two examples, the common flags, and a pointer to `--help` for more. Full (`--help`): the complete reference, ideally generated from the same parsing definitions so it cannot drift from what the parser accepts.
- **Common flags and commands first**, not alphabetical - put what people actually use at the top.
- **Never pipe help through a pager by default** - it stands users who don't know how to scroll or exit it. Let the caller pipe to a pager themselves if they want one.
- **Man pages are still a real, checked surface** for many users (`man mycmd` is a reflexive first step). Where a project has one, keep it generated from the same source as `--help`, and expose the same content through the tool itself for platforms without `man` (the `git`/`npm` pattern: `npm help ls` == `man npm-ls`).
- **Help-text-as-source-of-truth (docopt-style)**: rather than writing a parser and separately keeping a help string in sync with it by hand, some tools derive the parser *from* a formalized help message - the help text is the grammar, not a description of it. This is the strongest version of "the reference is derived, not hand-forked," the same principle this skill already applies to MCP schemas and TypeScript types, applied to CLI parsing specifically. Where the target CLI uses an argument-parsing library, note whether it generates help from the same definitions the parser reads (most do) - that's the property to preserve when documenting it.

## Honesty checks

- A flag in the docs that is not parsed in the dispatch is a defect. A parsed flag missing from the docs is a defect.
- Enum-like flag values (platform ids, mode names, etc.) must match what the code actually accepts - never invent or assume a value.
- State side effects precisely - name the actual files/config touched, not a vague verb.
- If a default is undocumented anywhere (help text or reference), that's a gap to flag, not fill in from a guess.

---

## Worked example: the Hivemind CLI

`examples/hivemind-cli-reference.md` is a complete, worked reference for `install` / `status` / `login` from Hivemind's real CLI (`bundle/cli.js`, routing in `src/cli/index.ts`, command implementations under `src/commands/*` and `src/cli/install-*.ts`). It demonstrates transcribing a real `USAGE`-string-plus-dispatch CLI into a reference using the shape above - side effects stated file-by-file, `--only` values traced to `allPlatformIds()`, and the `--token`/env-var fallback documented explicitly. If you are documenting Hivemind's CLI specifically, start there; the full command surface (`goal`, `kpi`, `context`, `graph`, `dashboard`, `rules`, `skillify`, `embeddings <sub>`) should be documented the same way, one command at a time, from `src/cli/index.ts` routing.

*Source: `research/distilled-mcp-tool-docs.md` (section 3); `research/external/2026-08-14-cli-help-text-source-of-truth.md`; `research/external/2026-08-14-command-line-interface-guidelines.md`.*

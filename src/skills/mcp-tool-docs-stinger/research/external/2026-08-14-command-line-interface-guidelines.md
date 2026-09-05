# Command Line Interface Guidelines (clig.dev)

- URL: https://clig.dev/
- Fetched: 2026-08-14
- Source type: community reference guide (widely cited CLI design/docs standard)
- Component: CLI documentation conventions - help text, man pages, discoverability

## Help text conventions

- **Display extensive help on request.** `-h`/`--help` should always work, at the top level and for every subcommand.
- **Display concise help by default** when a command requires arguments and is run with none. The concise version should only include: a one-line description of what the program does, one or two example invocations, flag descriptions (unless there are many), and a pointer to `--help` for the full text.
- **Full help must appear for both `-h` and `--help`.**
- **Provide a support path** (website or issue tracker link) in top-level help text.
- **Link to web documentation** from help text - directly to the relevant page or anchor when one exists, for material too detailed to belong in terminal output.
- **Lead with examples.** Users reach for examples before any other form of documentation - show them first, especially for common complex uses. Show real output alongside the command when it helps and isn't too long.
- **Put the most common flags and commands at the start** of the help text, not buried alphabetically.
- **Use formatting** (bold headings, etc.) so the help text is scannable, not a wall of text.
- Print help to `stdout`, not `stderr`, when explicitly requested via `-h`/`--help`.
- **Avoid an unrequested pager.** Piping help through a pager by default (as classic `aws help` did) can strand inexperienced users who don't know how to scroll or exit it. Let users pipe to a pager themselves if they want one.

## Help vs. documentation - two different jobs

- **Help text** exists to give a brief, immediate sense of what the tool is, what's available, and how to do the most common tasks.
- **Documentation** is where the reader goes for full detail: what the tool is for, what it *isn't* for, how it works internally, and how to do everything they might need to do - not just the common path.

Both surfaces are recommended, not an either/or choice.

## Man pages still matter

Man pages are described as "Unix's original system of documentation" and still the first thing many users reflexively check (`man mycmd`). Tools like `ronn` can generate both a man page and web docs from one source. Because not every user knows to check `man` and it isn't available on every platform, terminal docs should also be reachable through the tool itself - the pattern used by `git` and `npm`, where `npm help ls` is equivalent to `man npm-ls`.

## Argument-parsing libraries

Use a CLI argument-parsing library rather than hand-rolling a parser - they handle flag parsing, help-text generation, and often spelling suggestions consistently. Cross-platform: docopt. Bash: argbash. Go: Cobra, urfave/cli.

## Applicability to this skill

This is the general, tool-agnostic CLI documentation convention set this skill was missing (it previously only had the Hivemind-specific USAGE-string-transcription instructions). The concise-vs-extensive-help split, the "help text vs. documentation are two different jobs" distinction, and the man-page-still-matters point round out the CLI guide with vendor-neutral practice that generalizes to any CLI the Bee is asked to document, not just one built around a `USAGE` constant.

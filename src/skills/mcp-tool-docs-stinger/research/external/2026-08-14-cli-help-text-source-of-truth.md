# For Agents, --help Has to Be Enough

- URL: https://grantlucas.com/posts/2026/07/help-has-to-be-enough/
- Published: 2026-07-29
- Fetched: 2026-08-14
- Source type: blog (practitioner essay)
- Component: CLI documentation conventions - help-text-as-source-of-truth

## The constraint

The author's design rule for a CLI: an agent handed nothing but the binary should reach the right command on the first try, using only `--help`. No `CLAUDE.md`, no skill file, no MCP wrapper, no external prose - everything the tool needs to be used correctly ships inside the tool.

Why: a `CLAUDE.md` lives in the *consumer's* repo, drifts the moment a flag ships, and only helps agents that happen to read that file in that repo. An MCP server is a second artifact to build, version, and keep in sync with the binary - now two things can disagree about behavior. Help text ships with the binary, versions with the binary, and is the one documentation surface that structurally cannot drift from the thing it documents - because there is no repo, no README, and no source to fall back on once the tool is installed standalone (e.g., via a package manager with no accompanying docs site).

## The design loop this produces

1. Hand an agent the binary and nothing but `--help`.
2. Watch for the spot where it picks a plausible-but-wrong command.
3. Fix the help text - or the underlying design - until a cold read leads somewhere better.

"Plausible-but-wrong" is the failure mode agents produce that humans mostly don't: a human notices when a command errors and adjusts, but an agent that picks a command which *succeeds* and returns believable-but-wrong output has no signal anything went wrong - and neither does the operator, until the numbers look off weeks later.

## Concrete help-text techniques

- **Name the wrong choice explicitly**, not just describe the right one. A disambiguation that only describes the correct option is useless to a reader who already believes they've found it (example: a note in `--help` explaining that `search TYPENAME` is not equivalent to `show -t TYPENAME`, because search matches substrings anywhere in the line, not just the type tag).
- **Teach the data format in the help text itself**, not just list flags - embed the actual record format and file-resolution order so one read establishes what the data looks like and where it comes from, instead of the agent inferring it by trial and error.
- **Document defaults explicitly, never leave them implied.** An undocumented default gets guessed at, and a guess that happens to return plausible rows is indistinguishable from a correct one. State every default that could bite, including cases where two documented defaults appear to contradict each other unless both are stated precisely.
- **No quoting ceremony.** Nested quotes and shell escaping are a reliable way to make a generated command fail - design the interface so nothing needs quoting.
- **A non-interactive path for everything.** A blocking confirmation prompt is a hung agent: it waits on stdin that will never arrive and the turn dies on a timeout with no useful error. Pair every destructive/interactive command with a flag that skips the prompt (`-y`, `--yes`).
- **Loud failure on ambiguity, never a guessed default.** Passing an incomplete range (e.g., `--start` without `--end`) should be a clear error, not an assumed "until now." A guessed range produces results that look correct - the same plausible-but-wrong failure mode. An error is information; a permissive default is a coin flip.

## The generalizable insight

"An agent is the worst-case human" - no accumulated intuition about the tool, no memory of the last time it hit a flag, no way to ask a clarifying question. Every affordance a human silently supplies from experience has to be supplied by the interface instead. This is framed as a design discipline worth practicing deliberately, not "extra work for agents" - it's the same standard good CLI docs were always held to, now with a test subject that reliably surfaces where the standard wasn't met.

## Applicability to this skill

This reframes CLI documentation for this stinger's actual audience (an agentic Bee documenting a CLI for other agents and humans to consume): the CLI reference this skill teaches how to write should be checked against the same "no other context" constraint as the tool's own `--help` output, not just the repo's markdown reference. Concretely: when documenting a CLI command, verify defaults are stated (not implied), verify destructive commands document their non-interactive flag, and verify any two commands with similar names/behavior get an explicit "X is not equivalent to Y" note if agents (or people) are likely to confuse them.

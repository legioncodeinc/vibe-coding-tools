# Commands: repeatable jobs with a name

## The simple idea

Imagine your teacher says, "Start the science-lab routine." That short phrase stands for a longer checklist: put on goggles, clear the table, collect the materials, follow the experiment steps, record the result, and clean up.

An AI command works the same way. It gives a useful name to a repeatable job. Instead of explaining ten steps every time, you call one command and the assistant follows the saved workflow.

A command is not magic code and it is not a specialist by itself. It is a written set of instructions that coordinates specialists, skills, tools, checks, and handoffs.

## Command, agent, skill, rule, or hook?

These pieces sound similar because they all guide an assistant. Their jobs are different:

| Piece | Think of it as | Question it answers |
|---|---|---|
| Command | A named team routine | "What whole job should we run?" |
| Agent | A specialist teammate | "Who should own this part?" |
| Skill | A detailed playbook | "How should the specialist do it?" |
| Rule | A standing classroom rule | "What must always be true?" |
| Hook | An automatic checkpoint | "What should run when an event happens?" |

Example: `the-smoker` is a command that coordinates a delivery. It may ask a security agent to use the security skill. A rule requires security before quality. A hook automatically checks a file edit. Each part has one clear job.

## The two commands in Vibe Coding Tools

### `the-beekeeper`

Use this when you need the right specialist but do not know which Bee owns the request.

What it does:

1. Reads the request for important nouns, verbs, risks, and boundaries.
2. Checks the Bee roster in `beekeeper-suit`.
3. Selects the smallest specialist set that covers the work.
4. Loads each Bee's paired Stinger.
5. Explains the route when the choice is not obvious.
6. Keeps unrelated specialists out of the task.

Example request:

```text
Run the-beekeeper for this request: rotate our API authentication from static keys to OAuth, update the API docs, and add regression tests.
```

The router should recognize at least authentication, API documentation, and testing responsibilities. It should also decide whether one agent can coordinate them or independent tasks should be delegated.

Do not use it when the owner is already obvious and directly available. If you explicitly ask for `security-worker-bee`, routing again adds work without adding clarity.

### `the-smoker`

Use this for a serious change that must move from idea to verified delivery.

The name comes from a stress test: the workflow should expose weak assumptions before the change reaches users. Its stages are:

1. Understand the request and inspect the real repository.
2. Write or locate requirements and acceptance criteria.
3. Build a plan with owners, dependencies, risks, and validation.
4. Implement in a feature branch without disturbing unrelated work.
5. Test the changed behavior.
6. Run security review.
7. Run an independent quality review after security.
8. Fix findings and repeat both gates when needed.
9. Check the branch against current `origin/main`.
10. Commit, push, and hand off evidence.

Example request:

```text
Run the-smoker to add passwordless sign-in. Treat the PRD as the contract, verify every acceptance criterion, run security before quality, and stop if a provider decision requires me.
```

This command is deliberately heavier than a quick edit. Do not use it to fix one typo or answer a simple question.

## What a good command contains

A useful command answers eight questions:

1. **Trigger:** When should someone use it?
2. **Outcome:** What finished result should exist?
3. **Inputs:** What information or files does it need?
4. **Sequence:** Which steps happen, and in what order?
5. **Ownership:** Which agent or person owns each step?
6. **Safety:** What must never happen automatically?
7. **Evidence:** How will the assistant prove each important claim?
8. **Stop conditions:** When must it ask a human instead of guessing?

Weak instruction:

```text
Make the feature good and ship it.
```

Strong instruction:

```text
Read the active PRD and create an acceptance ledger. Implement only VERIFIED scope. Run the named tests, then security, then independent quality. If quality causes a code change, rerun both gates. Fetch origin/main, check mergeability, and report commit, test, and pull request evidence separately.
```

The strong version makes success observable. A reviewer can tell whether the workflow was followed.

## Where commands live

| Harness | Location | Format |
|---|---|---|
| Claude Code | `.claude/commands/*.md` | Markdown command |
| Cursor | `.cursor/commands/*.md` | Markdown command |
| Codex repository | `.agents/skills/<command-name>/SKILL.md` | Command translated into an explicit-invocation project skill |
| Codex plugin | `skills/<command-name>/SKILL.md` | The same translated skill in the installable plugin |

Codex does not need a fake `.codex/commands/` mirror. The portable behavior is packaged in both Codex layers as the `the-beekeeper` and `the-smoker` skills. Invoke them explicitly as `$the-beekeeper` and `$the-smoker`. This preserves what each command does while using Codex's supported repository and plugin skill format.

## How to run a command

Natural language is enough:

```text
Use the-beekeeper to route this database performance problem.
```

```text
Run the-smoker for PRD-014 and do not close any criterion without evidence.
```

Some harnesses also expose slash-command completion. Do not depend on the slash alone. Include the target, outcome, important constraints, and desired evidence in the request.

## How to add a command safely

1. Pick a specific outcome that people repeat.
2. Search existing commands and skills so you do not create a duplicate.
3. Write the portable source under `src/commands/`.
4. Use relative paths that belong to that harness.
5. State what is out of scope.
6. Add human stop conditions for secrets, destructive actions, providers, legal choices, and production changes.
7. Translate the command into a Codex skill if Codex should invoke it.
8. Run `python learn/scripts/generate-harnesses.py` to refresh generated assets.
9. Validate links, metadata, and a realistic example request.
10. Run security, then quality, before release.

## Common mistakes

- **A command that does everything:** It becomes hard to understand and impossible to test. Split it around clear outcomes.
- **Hidden assumptions:** If the workflow assumes a branch name, tool, provider, or file location, say so or discover it safely.
- **No stopping rule:** The assistant may guess at a production or business decision.
- **No evidence:** "Tests passed" means little without the command, exit code, and scope.
- **Copying unsupported formats:** Preserve behavior using each harness's real format.
- **Mixing standing rules into one command:** A rule that must apply everywhere belongs in rules or hooks, not only in one optional routine.

## A quick test

A new command is ready when a teammate who did not write it can answer:

- What result will this produce?
- When should I use it?
- When should I not use it?
- What will it change?
- Where can it stop?
- What proof will I receive?

If any answer is fuzzy, improve the command before packaging it.

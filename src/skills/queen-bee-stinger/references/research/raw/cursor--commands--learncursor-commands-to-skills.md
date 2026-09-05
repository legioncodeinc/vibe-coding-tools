# Cursor Commands: Legacy Slash Workflows (Now Agent Skills) · Learn Cursor
- URL: https://www.learncursor.dev/learn/cursor-rules/cursor-commands
- Fetched: 2026-08-14
- Source type: community
- Component: commands

Published: 2026-06-25 (last updated July 31, 2026)

## What are Cursor commands?

**Commands have left the docs**

As of July 2026 the commands page is gone from cursor.com/docs, and the Agent Skills docs treat commands as a migration source: the built-in `/migrate-to-skills` skill (shipped in Cursor 2.4) converts both user-level and workspace-level commands, adding `disable-model-invocation: true` so each one keeps its human-only trigger. Existing `.cursor/commands/` files still work. Write new workflows as skills.

A command is a reusable prompt you invoke from the `/` menu. Where a rule is passive context the agent always carries, a command is an action you fire on demand. Good candidates are the multi-step chores you repeat: run the test suite and fix what breaks, update the changelog, commit and push, or open a pull request with a written summary. All of that still describes what you want from the slash menu; what changed is where the file lives.

- Rules shape how the agent works, always on in the background.
- Skills package how to do a kind of task; the agent loads them when relevant, and they now cover the slash-menu job too.
- Commands are jobs you start: a saved prompt run from the slash menu, in the legacy format skills absorbed.

**Who pulls the trigger**

The cleanest line between a command and a skill is invocation. A command is invoked by a human only: you type `/` and pick it. A skill can be invoked by both the agent and you. That difference is why skills are a superset of commands, and why the migration loses nothing: a converted command is just a skill whose frontmatter says `disable-model-invocation: true`, which preserves the human-only behaviour exactly.

## How do I create a slash workflow now?

The current shape is a skill folder: `.cursor/skills/<name>/SKILL.md`, where the name is the verb you'll type. The prompt inside is the job you want done, written once. Here is the setup, plus the open-a-pull-request example written as a skill.

1. Add a folder under `.cursor/skills/` in your repo, named for the verb you'll type: `run-tests`, `open-pr`, `fix-ci`.
2. Create a `SKILL.md` inside it: YAML frontmatter with a `name` and `description`, then the prompt as Markdown below the `---`.
3. Add `disable-model-invocation: true` to the frontmatter if only a human should fire it, which is the old command behaviour.
4. Write the prompt as clear instructions, including how you want the result reported back.
5. Commit the folder so the whole team gets the same entry in their slash menu.

```
// .cursor/skills/open-pr/SKILL.md
---
name: open-pr
description: Commit the current changes, push, and open a pull request.
disable-model-invocation: true
---

Commit the current changes with a conventional-commit message.
Push the branch and open a pull request.
In the PR body, summarise what changed and why, and list how you verified it.
Reply with only the PR link.
```

The legacy shape was flatter: one Markdown file per command under `.cursor/commands/`, no frontmatter, just the prompt. Those files still load, and you don't port them by hand. Run the built-in `/migrate-to-skills` skill and it converts them in place, keeping the explicit-invocation behaviour.

Commit is deliberately last. A workflow you have never run yourself is a guess that every teammate then inherits, and you hear about it as someone else's confusing session. The naming step gets rushed too: you find these by typing `/` and scanning a list, so `open-pr` is easier to reach for than a cleverer name.

**Tell the skill how to answer**

The most-skipped step is the response instruction. Ending the prompt with "reply with only the PR link" or "report the failing test and your fix" keeps the output tight and scannable instead of a wall of narration.

**The best moment to capture a workflow is right after you run it**

Cursor ships a built-in `/create-skill` flow that captures the workflow you just ran so you can replay it. The trick is timing: the moment a session ends and you have just produced something good, a report or an analysis, codify it while it's fresh.

Right at the end of a session you could say, "Hey Cursor, /create-skill to codify what we've just done."

## Commands vs rules vs skills: which do I use?

The four customization primitives differ in one thing: who pulls the trigger, and when. A rule is always on, a skill is reached for by the agent or by you, a command was one you typed yourself, and a sub-agent is spawned by another agent. The table lines them up, with the caveat that the command row now describes a legacy format: a skill with model invocation disabled covers the same ground.

| Primitive | Trigger | Use it for |
| --- | --- | --- |
| Rule | Always on (or by file glob) | Conventions every prompt should respect |
| Skill | Agent decides, by description match (or you, from the slash menu) | A capability the agent should reach for when relevant |
| Command (legacy) | You type it in the slash menu | Superseded: a skill with `disable-model-invocation: true` replaces it |
| Sub-agent | Spawned by another agent | A role that works in parallel with its own context |

Pick by who pulls the trigger and when.

The table sets out that trade-off without saying why you would take it. Handing invocation to the agent means the agent has to recognise the moment, and a skill that never fires usually has a description problem. Disabling model invocation skips that judgment, the way a command used to. Repeatability is the test everyone reaches for, and I would demote it: a job you repeat but would rather not have to remember belongs in a skill the agent can reach for on its own.

## Skill or rule: which is cheaper on context?

Skills and rules are both Markdown, so the choice between them is easy to get wrong. What separates them is when each one costs you context. A skill is invocable: you call it as a slash command, or the agent infers it's relevant and reaches for it, so it loads only when needed. A rule applies to every relevant prompt in its scope, which means it rides along every turn whether or not this prompt needs it.

| | Skill | Rule |
| --- | --- | --- |
| Format | Markdown | Markdown |
| Fires when | Invoked: slash command, or agent infers relevance | Automatically, on every prompt in its scope |
| Context cost | Loaded only when used | Spent every turn it's in scope |
| Best for | Know-how needed some of the time | Conventions needed every time |

Same file format; different context bill.

The reason a skill is cheap is a loading mechanism called **progressive disclosure**. When the agent boots, it only holds a reference to every skill's name and description, not the full file. As it works, it picks an appropriate moment to pull a skill in, and only then loads the rest of that skill's Markdown. So a library of skills costs you almost nothing until the agent actually reaches for one.

**Too many rules crowd the window from turn one**

Every rule in scope is paid for on every prompt, so a thick stack of rules makes the context window denser before the agent has read a single line of your code. Unless the information genuinely needs to be present every time, a skill is the more efficient home for it. Reserve rules for the conventions that truly apply to every relevant prompt.

**A de-slop command for pre-review cleanup**

One useful slash workflow strips the common low-quality patterns an agent tends to leave behind, the AI "slop" you'd otherwise flag by hand, so the diff is cleaner before a human reads it. Cursor's team runs an internal workflow named `de-slop` for exactly this: removing artifacts they don't want, often the ancillary comments that explain the model's thinking but don't help anyone six months later. A version is published in the public marketplace, so you can install it rather than write your own.

## What is the Council command pattern?

A slash workflow can do more than run a single prompt: it can fan work out. The Council pattern is a saved prompt, which today you'd write as a skill, that spawns several sub-agents to study one question from different angles, then has a final agent synthesise their findings into one answer.

**Council in practice**

A `/council` command might launch ten sub-agents to each review a proposed design, then collect their notes and return a single ranked recommendation. You start one command; ten independent reads come back merged.

Ten sub-agents is ten passes over the same area, so save it for a question you would otherwise spend a morning on.

You set the count when you invoke it (`use Council n=15: How does authentication work?`), and some sub-agents are pushed off the obvious path on purpose so the reads vary. Each runs in its own context window and reports back through a file, which is what keeps the parent thread from drowning in ten transcripts.

## Frequently asked questions

### Where are Cursor commands stored?

As Markdown files in a `.cursor/commands/` directory in your repo, one file per command. That directory still loads, but it is the legacy location: new slash workflows go in `.cursor/skills/<name>/SKILL.md`, and the built-in `/migrate-to-skills` skill converts existing commands for you.

### Can a slash workflow run other agents?

Yes. A command, or the skill that replaces it, is just a prompt, so it can instruct the agent to spawn sub-agents and fan work out, as in the Council pattern, then synthesise the results.

### Command or skill: which should I use?

A skill, in every new case. Skills cover both triggers: the agent can reach for one when its description matches, and `disable-model-invocation: true` restricts one to the slash menu, which is exactly what a command was. Commands remain only as a legacy format that still loads.

### Are Cursor commands being deprecated?

Yes, in practice. The commands page has been removed from cursor.com/docs, and the Agent Skills docs treat commands as a migration source for the built-in `/migrate-to-skills` converter, which preserves their human-only invocation. Existing `.cursor/commands/` files keep working, so nothing breaks on upgrade, but the documented path for new work is a skill.

### Why is a skill cheaper than a rule?

Both are Markdown, but a skill loads only when it's invoked or the agent infers it's relevant, while a rule is spent on every prompt in its scope. Too many rules make the context window denser from the start, so unless the information is needed every time, put it in a skill.

### What does a de-slop workflow do?

It strips the common low-quality patterns an agent leaves behind before a human reviews the diff. One is published in the public marketplace, so you can install it instead of writing your own.

## Sources & last verified

- Cursor Docs: Agent Skills
- Cursor Changelog: Subagents, Skills and Image Generation (2.4)
- Cursor - Learn

Cursor ships frequently. Last updated July 31, 2026.

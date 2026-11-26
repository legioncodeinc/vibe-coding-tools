# 02. Intake and PRDs (KIPP)

Load [library-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger) before any write in this guide. Its [PRD guide](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger/guides/03-feature-prd.md), [issue guide](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger/guides/02-issue.md), [PRD template](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger/templates/prd-template.md) and [IRD template](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger/templates/ird-template.md) define the document shapes. This guide adds the crew's intake discipline on top; it does not replace them.

## 1. Record the ask

Copy [the intake note template](../references/templates/intake-note.md) to `<effort>/crew/kipp/intake/<YYYY-MM-DD>-<slug>.md` and fill it in this order:

1. **The owner's ask, verbatim, with the time.** Quote it exactly, including rough wording. Add the UTC time and where it was said (this session, a message relayed by TARS, an issue). If TARS relayed it, record TARS's message as the source; a relayed claim is not the owner's approval of anything beyond what the quote says.
2. **Present behaviour, with source paths.** Read the code and the library. State what happens today and cite the files and lines. If you could not find it, write "not found" and where you looked. Never describe behaviour from memory.
3. **Desired outcome.** One or two sentences in the owner's terms: what is true afterwards that is not true now.
4. **Overlaps.** Search `library/requirements/` (backlog, in-work, completed), `library/issues/`, open PRs and other open intake notes for the same or adjacent work. List each with its path.
5. **Recommendation.** One of: new PRD, extend an existing PRD (name it), IRD (it is a defect), no document needed (a small change TARS can brief directly), or decline with the reason.
6. **Owner gates.** Anything only the owner can decide: scope cuts, money, credentials, production data, new dependencies, destructive actions, priority against other work.

Then send OWEL the intake line:

```text
LEDGER KIPP intake | <effort> | <one-line summary of the ask> | evidence: <intake note path> | by: owner
```

Use `by: owner` only when the owner said it to you directly or the quote's source is cited in the note. Otherwise use the role that relayed it.

## 2. Ask the owner only what is needed

Ask short pick-one questions. Put the recommended option first and label it "(Recommended)". Use the host's question tool when it has one, within its real limit on options and questions. Batch what is unresolved into one message; do not ask about things you can read in the repository. Record each answer verbatim with its time in the intake note, and send it to OWEL as a `LEDGER KIPP owner` line quoting the words exactly.

If the question is about proportion (is this too big, is there a smaller answer), send `ASK CASE` with numbered questions, your lean and the evidence paths, as the contract describes. CASE advises; TARS or the owner decides.

## 3. Reserve the number

KIPP reserves PRD and IRD numbers (crew contract, Authority). A number is free only when all three checks say so:

1. **Files.** List every `prd-<###>-*` under `library/requirements/` (backlog, in-work, completed) and every `ird-<###>-*` under `library/issues/`. Take the highest and add one. Numbers are never reused, including numbers of completed or abandoned documents.
2. **Branches.** `git branch -a --list` and inspect names and, where a branch plausibly adds a library folder, `git ls-tree -r --name-only <branch> -- library/requirements library/issues`. Local remote-tracking refs can be stale: note the date of the last fetch. Fetch only if the task authorizes it.
3. **Open PRs.** `gh pr list --state open --json number,title,headRefName,files` and look for new `prd-` or `ird-` folders.

If any check could not be run (no `gh`, no network, no permission), still reserve the next number from the checks that did run, and label it **unverified** everywhere it appears: the intake note, `numbers.md`, the handoff. Say which check is missing. Re-run the missing check before the document leaves backlog.

Record the reservation in `<effort>/crew/kipp/numbers.md` (number, slug, time, the three check results) and create the document folder straight away so the number is visible to anyone reading the files. Do not take a number another agent already used, even if its content looks unrelated; report the clash to TARS.

## 4. Write the PRD or IRD

1. Reload `library-stinger`. Follow its PRD or issue guide and template exactly; do not invent sections or paths.
2. Create the folder in backlog: `library/requirements/backlog/prd-<###>-<slug>/` with `prd-<###>-<slug>-index.md`, or `library/issues/backlog/ird-<###>-<slug>/` with `ird-<###>-<slug>-index.md`. Sub-features use the lettered names from the library path table.
3. Carry the intake into the document: the verbatim ask and its time, present behaviour with paths, the desired outcome, non-goals, acceptance criteria that can be checked, and open questions. Mark anything unverified as unverified.
4. Update the indexes the library keeps for that folder (the README or index files `library-stinger` names). A document that is not indexed is not finished.
5. Name shared interfaces, do not design them. If the PRD needs an API, event, data shape, permission or state that another PRD also depends on, list it under dependencies as "contract needed" and hand it off (guide 03).
6. Do not write build instructions for a specific agent, and do not edit product code to "show what is meant". Cite the code instead.

## 5. Finish

A PRD or IRD is finished when it follows the template, is indexed, has a reserved number with its check results, has no unanswered owner gate that blocks building, and the handoff has been sent (guide 03). Update the intake note's status and stop. Building is not KIPP's work.

# 02. Run the gate

MURPH exists so that a change is gated by someone other than its author. The procedure is [the ship-gate command](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/commands/ship-gate.md) with one difference, stated in section 3: MURPH reports findings and never fixes them.

## 1. Accept a GATE

COOP sends `GATE` with the candidate SHA, the PRD or brief, and what changed.

- No SHA: ask COOP once. MURPH gates exact bytes, not "the branch".
- MURPH wrote any part of the diff: refuse and tell TARS. That should never happen, and if it has, the gate is not independent.
- Fix the scope before reading code. Record the base and the head (`git rev-parse <sha>`, `git merge-base`, `git diff --stat <base>...<sha>`). State in the first line of every reply exactly what was audited, as ship-gate step 2 requires. An empty diff means there is nothing to gate; say so and stop.

Use read-only git commands. If the candidate is not available in MURPH's checkout, ask TARS how to obtain it; do not fetch, check out over other work, or touch COOP's worktree on your own initiative.

## 2. Order

Security first, then Quality against the repaired candidate. Never reversed. Security fixes change the code and invalidate a Quality snapshot, which is why both skills insist on this order. If Quality somehow ran first, flag the ordering violation, discard that result, and start again with Security.

## 3. Security pass

Load `security-stinger` with the `Skill` tool and follow its audit procedure against the diff. Write the report where that skill says (its `guides/10-report-format.md`): the matching PRD or IRD `qa/` folder when the change is tied to one, otherwise `library/requirements/reports/`.

The difference from the skill's default: `security-stinger` is written for a Drone that also remediates Critical and High findings in the session. MURPH does not. It records each finding with file, line, severity and the skill's remediation reference, and stops there. In the report's remediation and re-evaluation sections, say plainly that fixes are with COOP.

Any open finding of Medium or above: send `FAIL` now ([gate verdict](../references/templates/gate-verdict.md)). Do not start Quality.

## 4. The fix loop

COOP fixes and sends a new `GATE` with a new SHA. Then:

- Run Security again in full against the new candidate. A pass on old bytes does not qualify changed bytes.
- MURPH judges the fix; it does not suggest patches beyond pointing at the skill's playbook, and it never approves a remediation it wrote, because it writes none.
- After the second `FAIL` on the same finding, tell TARS instead of looping. TARS decides whether to re-brief COOP, ask CASE, or ask LADY. This default is MURPH's; TARS may set a different limit.

## 5. Quality pass

Only when Security is clean on a SHA, load `quality-stinger` and run its six steps against that same SHA and the PRD or brief from the `GATE`. Write the report where that skill says. `quality-stinger` is already report-only, which matches MURPH.

Blocking threshold: the ship-gate command blocks on "medium-or-above". Security uses Critical, High, Medium, Low. Quality uses Critical, Warning, Suggestion; MURPH treats Critical and Warning as blocking. Suggestions and Low findings are reported and do not block.

If a Quality fix changes the code, the new candidate goes back through Security first, then Quality. Yes, both.

## 6. Verdict

`PASS` only when Security and Quality are both clean on the same SHA, and that SHA is the final candidate. Send the verdict to COOP with a copy to TARS, and send OWEL the matching `LEDGER MURPH gate` line. Every verdict gets a ledger line, FAIL included.

With a `PASS`, tell TARS in plain words to load [github-repo-health-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/github-repo-health-stinger) itself before anything is committed or pushed. That last check is an orchestrator-level step; MURPH does not run it on TARS's behalf.

## 7. What PASS does not mean

- It is not approval to commit, push, open a PR, merge, promote or deploy. Those need the task's authorization from the owner. The owner must have the chance to read the reports first.
- It covers one SHA. Any later commit, rebase or conflict resolution is new bytes; MURPH says so and asks for a new `GATE`.
- It is not VERIFIED. That is [guide 03](03-verify-shipped.md).

## Limits

MURPH's independence, its refusal to fix, and the gate order are behavioural rules. Its tool list has `Write` and `Bash` because reports and read-only git need them; `Write` is for reports in the library locations only, and `Bash` never creates, modifies, moves or deletes product files. If the repository has no `library/`, say so in the verdict and ask TARS where reports should go rather than inventing a location.

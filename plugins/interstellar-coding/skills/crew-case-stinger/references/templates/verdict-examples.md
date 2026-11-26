# Verdict examples

Illustrative lines only. The situations are invented to show form; they are not findings about any project.

## Reply shape

```text
To: <asking ROLE>   Copy: TARS
Re: ASK CASE, <effort>

1. PROCEED - The one-file change meets the ask and follows the existing pattern; keep the current test as the regression check.
2. SIMPLIFY - The ask is one new field; add the column and the form input, and leave the settings page redesign for its own request.
3. OVERKILL - Drop the plugin system; the ask names two fixed exporters, and two functions meet it.
4. RETHINK - The plan assumes the import is idempotent and nothing at the cited paths shows that; a dry run on a copy would settle it.
5. ASK OWNER - "May this add a new paid dependency?" Touches the new-dependency gate.
```

## Good and bad

| Line | Verdict on the line |
|---|---|
| `SIMPLIFY - Ship the retry on the one failing call; the ask does not cover the other four.` | Good: names the smallest option and ties it to the ask |
| `RETHINK - This feels risky.` | Bad: no alternative, no evidence that would change it. Drop it or finish it |
| `PROCEED - Great plan, well thought through.` | Bad: praise, not a reason |
| `PROCEED - Meets the ask; nothing smaller would. Condition: gate the migration behind the existing flag.` | Good: reason and condition on one line |
| `OVERKILL - Too much.` | Bad: does not say what to drop |
| `ASK OWNER - Should we do it?` | Bad: not a question the owner can answer in a word, and no gate named |

## Dissent, once

```text
Ruling noted. Remaining dissent, stated once: the import is still unverified as idempotent; a dry run on a copy would reopen this. Supporting the ruling from here.

LEDGER CASE dissent | <effort> | Dissent from TARS ruling to run the import without a dry run; idempotency unverified | evidence: <plan path> | by: CASE
```

## Resume

```text
LEDGER CASE resume | <effort> | CASE resumed after compaction; 0 questions pending | evidence: none | by: CASE
```

## Nothing pending

```text
Waiting.
```

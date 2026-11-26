# 01. Start and resume (OWEL)

The shared rules are in [the crew recovery guide](../../crew-protocol/guides/03-session-start-and-compaction-recovery.md). This page is what OWEL does with them. Fill [the recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md) whenever you resume.

In the commands below, `<crew-protocol>` is the installed `crew-protocol` skill folder and `<effort>` is TARS's effort folder (default `<repo>/.tars/<effort-slug>/`).

## First start

1. The owner types `/owel`. When the plugin hooks are active, the hook prints a line saying this session is claimed as OWEL. That line is the claim check.
2. If no hook line appears, hooks are not active here. The role still works, but nothing will remind this session of its role after a restart or compaction, and the hook guard on the ledger file is absent. Tell the owner once, in one line, that the fallback is to say "re-ingest /owel".
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md). Load [knowledge-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/knowledge-stinger) and [adr-writing-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/adr-writing-stinger).
4. Locate the ledger. With a `library/` folder it is `library/knowledge/private/ledger/ledger.jsonl`. With no `library/`, it is `<effort>/crew/ledger/ledger.jsonl`, and you say so to TARS and the owner in one line. Do not create `library/` to make room for it.
5. If the ledger file does not exist yet, create only its folder, copy [the ledger README template](../../crew-protocol/references/templates/ledger-readme.md) into it as `README.md`, and let the first `append` create the file. Never create or seed `ledger.jsonl` with `Write`, `Edit` or a shell redirect.
6. Verify, then drain, in that order:

```bash
node <crew-protocol>/scripts/ledger.mjs verify --ledger <ledger path>
node <crew-protocol>/scripts/ledger.mjs drain --ledger <ledger path> --outbox <effort>/crew/outbox
```

   If `verify` reports a broken chain, do not drain. Follow the halt steps in [guide 02](02-keep-the-ledger.md).
7. Append OWEL's own start entry (type `progress`, text "OWEL started", `--by OWEL`).
8. Copy [the observation log template](../references/templates/observation-log.md) to `<effort>/crew/owel/observation-log.md` if it is not there, then run a first observation pass ([guide 03](03-observe-and-document.md)).

## State OWEL restores, and from where

| State | Where it lives |
|---|---|
| The ledger (the record) | `library/knowledge/private/ledger/ledger.jsonl`, or the fallback path |
| Last entry id and chain health | `ledger.mjs tail` and `ledger.mjs verify` output. Never from memory |
| Entries waiting to be recorded | `<effort>/crew/outbox/` |
| Sweep cursors, candidates, documents in progress | `<effort>/crew/owel/observation-log.md` |
| Documents written | `library/knowledge/private/<domain>/`, `library/knowledge/private/architecture/ADR-*.md`, `library/knowledge/public/` |
| Whether a halt is in force | The `Ledger state` line at the top of the observation log |
| Who holds each role | `<effort>/crew/roster.md` (TARS writes it; read only) |

## Recovery order after compaction or "re-ingest"

Do these in order. Do no other work, and answer no `LEDGER` line, until step 5 is done.

1. Reinvoke the role skill: load `crew-owel-stinger` and every file it points to.
2. Re-arm: load `knowledge-stinger` and `adr-writing-stinger` again. A summary of them is not the skill.
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md) again.
4. Restore state from the effort folder and the ledger: read the observation log, run `verify`, run `tail` to see the last entries, list the outbox. If the log says a halt is in force, it still is: do not append.
5. Append OWEL's own resume entry directly. Other roles send OWEL a `LEDGER <ROLE> resume` line; OWEL is the writer, so it records its own:

```bash
node <crew-protocol>/scripts/ledger.mjs append --ledger <ledger path> \
  --role OWEL --type resume --effort <effort-slug> \
  --text 'OWEL resumed after compaction; verify ok; last entry L-<n>' \
  --evidence '<effort>/crew/owel/observation-log.md' --by OWEL
```

6. Drain the outbox, answer any `LEDGER` lines that arrived meanwhile with `RECORDED L-<n>`, and only then continue the observation pass from the cursors in the log.

After compaction, check for lines you may have received but not recorded: compare recent crew messages with `tail`. Record anything missing now, with `--at` set to the time the event happened. A late entry is correct; a lost one is not.

## Limits

The hook injects a reminder into context. It cannot force a model to follow it, and it does not exist on every host. If you find yourself about to edit the ledger file by hand, or unsure whether you are OWEL, stop and run the recovery order.

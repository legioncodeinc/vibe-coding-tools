# 01. Start and resume (KIPP)

The shared rules are in [the crew recovery guide](../../crew-protocol/guides/03-session-start-and-compaction-recovery.md). This page is what KIPP does with them. Fill [the recovery worksheet](../../crew-protocol/references/templates/recovery-worksheet.md) whenever you resume.

## First start

1. The owner types `/kipp`. When the plugin hooks are active, the hook prints a line saying this session is claimed as KIPP. That line is the claim check.
2. If no hook line appears, hooks are not active here (Cursor, a home install, or a host that does not run plugin hooks). The role still works, but nothing will remind this session of its role after a restart or compaction. Tell the owner once, in one line, that the fallback is to say "re-ingest /kipp".
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md), then load [library-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger) and its README.
4. Check the repository: `wasp-nest.lock` at the root and a `library/` folder. If either is missing, stop. Say the repository has no library and recommend Get Started ([get-started-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/get-started-stinger)). Do not create `library/` yourself.
5. Find the effort folder from TARS (default `<repo>/.tars/<effort-slug>/`, see the contract's state layout). If KIPP runs alone with no TARS, ask the owner for the effort name and use the same default path.
6. Read `crew/roster.md` if it exists, so you know who holds TARS and OWEL and how to message them.
7. Send OWEL `LEDGER KIPP progress | <effort> | KIPP started | evidence: none | by: KIPP`. If OWEL cannot be reached, spool the line as the contract describes.

## State KIPP restores, and from where

| State | Where it lives |
|---|---|
| Open intake notes, one per ask | `<effort>/crew/kipp/intake/` |
| Numbers reserved and the evidence for each | `<effort>/crew/kipp/numbers.md`, and the PRD or IRD folders themselves |
| Questions waiting on the owner | The `Owner gates` section of each open intake note |
| Handoffs sent and TARS's routing reply | The `Routing` section of each intake note |
| Finished documents | `library/requirements/` and `library/issues/` (the record) |
| Who holds each role | `<effort>/crew/roster.md` (TARS writes it; read only) |

The library is the record. The `crew/kipp/` files are working notes: if they disagree with the library, the library wins and the note is corrected.

## Recovery order after compaction or "re-ingest"

Do these in order. Do no other work until the last step is done.

1. Reinvoke the role skill: load `crew-kipp-stinger` and every file it points to.
2. Re-arm: load `library-stinger` again. A summary of it is not the skill.
3. Read [the crew contract](../../crew-protocol/references/REFERENCE.md) again.
4. Restore state from the effort folder using the table above. Re-read every open intake note and `numbers.md`. Re-check each reserved number against the files on disk before trusting it.
5. Send OWEL `LEDGER KIPP resume | <effort> | KIPP resumed after compaction, <n> intake notes open | evidence: <effort>/crew/kipp/ | by: KIPP`. (OWEL appends its own resume entry directly; every other role sends this line.)
6. Only then continue, starting with whatever the newest intake note says was in progress.

## Limits

The hook injects a reminder into context. It cannot force a model to follow it, and it does not exist on every host. If you notice you are answering as a general assistant with no memory of an open intake, treat that as a missed recovery and run the order above.

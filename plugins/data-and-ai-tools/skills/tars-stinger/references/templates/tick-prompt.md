# 10-minute tick prompt

Register with `CronCreate` cron `*/10 * * * *`, recurring. Paste the prompt below with the state folder and managed sessions filled in. Note the returned id in the ledger. When the roster changes (a chip links, finishes or stops), `CronDelete` this job and recreate it with the new list. The tick fires only while TARS is idle, so TARS ends its turns promptly.

```text
TARS tick. State folder: <path>. Managed sessions: <names and local ids>. If the tars-stinger rules are not in your context (for example after a compaction), reload /tars and run guides/08-lessons-2026-11-02.md first (a crew TARS runs the crew-tars-stinger recovery order instead and never starts the standing CASE and KIPP). Load tars-stinger guides/03-ten-minute-tick.md and run it now: read notifications, check each managed session's real transcript, act on stalls, run the CI watchdog, append one ledger line, then go idle. Do no implementation work.
```

# Guide 00: Cron Expression Syntax

*Cited by: `examples/vercel-cron-happy-path.md`, `examples/github-actions-drift-mitigation.md`*
*Research sources: `research/external/2026-05-20-vercel-cron-jobs-official-docs.md`, `research/external/2026-05-20-github-actions-schedule-event-docs.md`*

---

## Field order

Standard 5-field (POSIX / Vercel / Cloudflare / GitHub Actions):

```
┌─── minute       (0-59)
│ ┌─── hour       (0-23)
│ │ ┌─── day of month (1-31)
│ │ │ ┌─── month   (1-12)
│ │ │ │ ┌─── day of week (0-7, 0 and 7 = Sunday)
│ │ │ │ │
* * * * *
```

Quartz 7-field (Java schedulers, Spring Scheduler):
```
second minute hour DOM month DOW [year]
```

**Always tell the user which field order the platform expects before handing them an expression.**

---

## Special characters

| Character | Meaning | Example |
|---|---|---|
| `*` | every value | `* * * * *` = every minute |
| `,` | list | `0 9,17 * * *` = 9am and 5pm |
| `-` | range | `0 9-17 * * *` = every hour 9am-5pm |
| `/` | step | `*/15 * * * *` = every 15 minutes |
| `?` | no specific value (Quartz DOM/DOW only) | `0 12 ? * MON` |
| `L` | last (Quartz only) | `0 0 L * *` = last day of month |
| `#` | nth weekday (Quartz only) | `0 0 ? * 2#1` = first Monday |

---

## Named shortcuts (POSIX / most platforms)

| Shortcut | Equivalent | Meaning |
|---|---|---|
| `@yearly` | `0 0 1 1 *` | Once a year, Jan 1 |
| `@monthly` | `0 0 1 * *` | Once a month, 1st day |
| `@weekly` | `0 0 * * 0` | Once a week, Sunday |
| `@daily` | `0 0 * * *` | Every day midnight |
| `@hourly` | `0 * * * *` | Every hour |

**Vercel and Cloudflare accept these shortcuts. GitHub Actions does NOT.**

---

## Platform-specific syntax notes

### Vercel Cron (`vercel.json`)

```json
{
  "crons": [
    { "path": "/api/cron/cleanup", "schedule": "0 2 * * *" }
  ]
}
```

- 5-field POSIX format only. No seconds.
- UTC timezone only (no timezone override possible).
- `@` shortcuts supported.
- See `guides/01-platform-limits.md` for plan-tier frequency limits.

### Cloudflare Workers (`wrangler.toml`)

```toml
[triggers]
crons = ["0 */6 * * *"]
```

- 5-field format. Minimum interval: 1 minute.
- UTC only.
- Multiple triggers allowed. Separate with commas inside the array.

### GitHub Actions (`schedule:`)

```yaml
on:
  schedule:
    - cron: "0 6 * * 1-5"   # 6am UTC, Mon-Fri
  workflow_dispatch:           # always add this fallback
```

- 5-field POSIX. UTC timezone historically required.
- **IANA timezone support added in early 2026** via the `timezone:` key under `schedule:`.
- Minimum interval: 5 minutes. Drift of 20+ minutes under load is documented (see `research/external/2026-05-20-github-actions-schedule-drift-community.md`).
- `@` shortcuts are NOT supported.

---

## Plain-English explanation rule

**Never hand a user a cron expression without the plain-English translation.** Use this template:

> `0 2 * * *` fires **every day at 02:00 UTC** (midnight plus 2 hours).

For complex expressions:

> `30 8 1,15 * *` fires **at 08:30 UTC on the 1st and 15th of every month**.

---

## Common mistakes

| Expression | Intended | Actual |
|---|---|---|
| `* * * * *` | "Every minute" (sometimes) | Every minute: 1440x/day, verify this is intended |
| `0 0 1 * *` | 1st of month | Yes, but does NOT run monthly if DOW conflicts (depends on platform) |
| `0 9 * * 1` | Every Monday 9am | UTC 9am: is this the right timezone? Ask. |
| `*/5 * * * *` | Every 5 minutes | GitHub Actions: expect actual intervals of 5-27 minutes under load |

---

*Next: `guides/01-platform-limits.md`*

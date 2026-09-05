---
source_url: https://crontab.guru
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: cron-syntax
stinger: cron-scheduling-stinger
---

# Cron Expression Syntax: Platform Comparison Table

## Summary

Cron expression syntax varies meaningfully across platforms. POSIX 5-field is the universal baseline. Quartz 6/7-field adds seconds and optional year. Cloudflare extends the 5-field syntax with Quartz special characters (L, W, #). Vercel strips down the syntax (no named days/months, no combined DOM and DOW). GitHub Actions now supports IANA timezone strings as a field. This source synthesizes the official docs of each platform to produce the authoritative comparison table for the stinger's `guides/00-cron-expression-syntax.md`.

## Field structure by platform

| Field | POSIX | Quartz | Vercel | Cloudflare | GitHub Actions |
|-------|-------|--------|--------|------------|---------------|
| Seconds | No | Yes (field 1) | No | No | No |
| Minutes | 0-59 | 0-59 | 0-59 | 0-59 | 0-59 |
| Hours | 0-23 | 0-23 | 0-23 | 0-23 | 0-23 |
| Day of Month | 1-31 | 1-31 | 1-31 | 1-31 (L, W) | 1-31 |
| Month | 1-12 | 1-12 or names | 1-12 (no names) | 1-12 or names | 1-12 |
| Day of Week | 0-6 (0=Sun) | 1-7 or names | 0-6 (no names) | 1-7 or names (1=Sun) | 0-6 or names |
| Year | No | Optional | No | No | No |
| Timezone | OS env | Config | UTC only | UTC only | UTC (+ IANA via `timezone:`) |
| Total fields | 5 | 6-7 | 5 | 5 | 5 |

## Special characters by platform

| Character | Meaning | POSIX | Quartz | Vercel | Cloudflare |
|-----------|---------|-------|--------|--------|------------|
| `*` | Any value | Yes | Yes | Yes | Yes |
| `,` | List | Yes | Yes | Yes | Yes |
| `-` | Range | Yes | Yes | Yes | Yes |
| `/` | Step | Yes | Yes | Yes | Yes |
| `L` | Last (day of month/week) | No | Yes | No | Yes |
| `W` | Nearest weekday | No | Yes | No | Yes |
| `#` | Nth weekday of month | No | Yes | No | Yes |
| `?` | No specific value | No | Yes | No | No |
| Named days | MON, FRI, etc. | No | Yes | No | Yes |
| Named months | JAN, DEC, etc. | No | Yes | No | Yes |

## Platform-specific gotchas

### Vercel
- No named days (`MON`, `SUN`) - use numbers only
- Cannot set both DOM and DOW simultaneously; one must be `*`
- UTC only
- Expression syntax: standard 5-field POSIX

### Cloudflare
- Week days: 1=Sunday, 7=Saturday (different from POSIX 0=Sunday)
- Supports Quartz extensions: `L` (last), `W` (nearest weekday), `#` (nth weekday)
- Example: `0 18 * * 6L` = 18:00 UTC on last Friday of month
- Example: `59 23 LW * *` = 23:59 UTC on last weekday of month
- UTC only

### GitHub Actions
- Minimum interval: 5 minutes
- UTC by default; IANA timezone support added (specify `timezone:` alongside `cron:`)
- Standard 5-field POSIX syntax
- Named days/months supported: `1-5` or `mon-fri`

## Common expressions reference

| Expression | Human meaning | Works on |
|-----------|---------------|----------|
| `* * * * *` | Every minute | All platforms |
| `*/5 * * * *` | Every 5 minutes | CF, GH Actions |
| `0 * * * *` | Every hour (on the hour) | All |
| `0 9 * * 1-5` | 9 AM UTC weekdays | All |
| `0 0 * * *` | Midnight UTC daily | All |
| `0 9 * * *` | 9 AM UTC daily | All |
| `0 0 1 * *` | Midnight on 1st of month | All |
| `0 0 1 1 *` | Midnight on Jan 1 (yearly) | All |
| `@hourly` | Every hour | POSIX only |
| `@daily` | Every day | POSIX only |
| `@weekly` | Every week | POSIX only |
| `@monthly` | Every month | POSIX only |
| `@yearly` | Every year | POSIX only |
| `0 18 * * 6L` | Last Friday 18:00 UTC | Cloudflare only |

## Annotations for stinger-forge

- This is the primary source for `guides/00-cron-expression-syntax.md`
- The platform comparison table above should be the opening table in the guide
- The named-day/month gotcha (Vercel doesn't support them, Cloudflare does) is a common source of deployment errors
- Note the Cloudflare weekday numbering (1=Sunday) differs from POSIX (0=Sunday) - this is a bug source
- POSIX-only special strings (`@hourly`, `@daily`, etc.) should be mentioned with a note that they don't work on Vercel, Cloudflare, or GitHub Actions

# DB Audit: {{project-name}}

**Date:** {{YYYY-MM-DD}}
**Reviewer:** db-worker-bee
**Scope:** {{schema review / migration plan / indexing audit / performance audit / platform choice}}
**Postgres version:** {{16 / 17}}
**ORM / Platform:** {{Drizzle / Prisma / raw: Supabase / Neon / self-hosted}}

---

## Executive summary

{{2-4 sentence synthesis. Lead with the headline finding. Mention severity counts.}}

## Pillar ratings

Ratings: Solid / Drifting / Needs work

| Pillar | Rating | Headline finding |
|---|---|---|
| Schema design (`guides/01`) | | |
| Indexing (`guides/02`) | | |
| Migrations (`guides/03`) | | |
| Partitioning (`guides/04`) | | |
| Performance & pooling (`guides/05`) | | |
| Special-purpose (`guides/06`) (if applicable) | | |
| ORM choice (`guides/07`) | | |
| Platform fit (`guides/08`) | | |

## Findings

### Must-fix ({{count}})

1. **`{{file:line}}`**: {{one-line summary}}
   - Reason: {{citation: guide section, research note, or postgresql.org URL}}
   - Fix: {{how, with DDL or migration phase}}

2. ...

### Should-refactor ({{count}})

1. **`{{file:line}}`**: ...

### Style ({{count}})

1. **`{{file:line}}`**: ...

## Metrics captured

| Metric | Value | Target | Delta |
|---|---|---|---|
| Largest table size | {{rows / GB}} | | |
| FK columns without index | {{N}} | 0 | |
| Redundant indexes | {{N}} | 0 | |
| Tables with > 30% bloat | {{N}} | 0 | |
| Hot queries with `Seq Scan` | {{N}} | 0 | |
| Worst-case migration lock duration | {{seconds}} | < 1s for ACCESS EXCLUSIVE | |
| Pool size vs workload | {{N}} / {{capacity}} | | |

## Cross-Bee handoffs

- [ ] `library-worker-bee`: {{if any schema-PRD updates needed}}
- [ ] `react-worker-bee`: {{if any N+1 risks at the data-layer edge}}
- [ ] `security-worker-bee`: {{if any PII / RLS / encryption-at-rest findings}}
- [ ] `mind-worker-bee`: {{if any pgvector / embedding-storage decisions}}
- [ ] `quality-worker-bee`: {{post-migration verification queries}}

## Recommended next steps

1. {{highest-leverage fix}}
2. {{next}}
3. {{next}}

## References

- `guides/...` ({{list the guides actually cited in findings}})
- `research/...` ({{list the research notes referenced}})
- {{external URLs - postgresql.org preferred}}

---

*Produced by db-stinger. See `SKILL.md` for methodology.*

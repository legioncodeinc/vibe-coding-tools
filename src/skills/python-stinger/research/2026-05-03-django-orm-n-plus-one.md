# 2026-05-03: Django ORM N+1 prevention (select_related / prefetch_related)

## Sources

- https://docs.djangoproject.com/en/stable/topics/db/optimization/: official optimization guide
- https://docs.djangoproject.com/en/stable/ref/models/querysets/#select-related: select_related reference
- https://docs.djangoproject.com/en/stable/ref/models/querysets/#prefetch-related: prefetch_related + Prefetch
- https://knowledgelib.io/software/debugging/django-n-plus-1/2026: 2026 detection + fix patterns

## Summary

**N+1 is the single biggest preventable Django performance bug.** It happens when code fetches N objects then triggers N additional queries by accessing related fields per-object. Two fixes:

- **`.select_related('fk_field')`**: for **forward FK** and **OneToOne**. Adds a SQL JOIN to the original query, single query, larger result set.
- **`.prefetch_related('reverse_set' | 'm2m_field')`**: for **reverse FK** and **ManyToMany** (and GenericForeignKey). Separate query, joined in Python, two queries total.

**Detection:**

- `django-debug-toolbar` (request-level SQL inspector with timings).
- `nplusone` (logs warnings when N+1 is detected).
- `self.assertNumQueries(N)` in tests.
- `django-auto-prefetch` for opt-in zero-config prevention on FK / OneToOne.

**Common gotchas:**

- `select_related()` works ONLY on FK / OneToOne. Using it on M2M or reverse FK silently falls back to lazy loading: no error, just a slow request.
- Calling `.filter()` / `.all()` / `.exclude()` on an already-prefetched relationship triggers a new query, ignoring the prefetch cache. Use `Prefetch(... queryset=qs.filter(...), to_attr="some_attr")` instead.
- Bare `select_related()` (no field names) follows ALL FK chains: can produce massive JOINs. Always pass explicit field names in production.
- Django 4.2+ async ORM: `aselect_related`, `aprefetch_related` are awaitable; do not mix with sync code.

**Other ORM hygiene:**

- **`.only()` / `.defer()`** to constrain selected columns when serializing wide rows.
- **`bulk_create([objs])` / `bulk_update([objs], fields=[...])`** for batch writes.
- **`transaction.atomic()`** wraps multi-write operations: never partial commits.
- **Raw SQL** (`RawSQL`, `Manager.raw()`) only with a `# raw-sql: <reason>` comment justifying the bypass.

## Relevance to the Stinger

- **`guides/03-django-orm.md`**: the canonical ORM discipline.
- **`scripts/audit-n-plus-one.py`**: static heuristic scan for likely N+1 sites.
- **`templates/django-orm-queryset-pattern.py`**: canonical optimized queryset shape.

## Pull quote

> "An N+1 query happens when your code executes 1 query to fetch N objects, then N additional queries to fetch related data for each — resulting in N+1 total queries instead of 2. In Django, this occurs because the ORM lazy-loads related objects by default. Fix with select_related() (ForeignKey/OneToOne — SQL JOIN) or prefetch_related() (ManyToMany/reverse FK — separate query + Python join)." (knowledgelib.io 2026 N+1 guide)

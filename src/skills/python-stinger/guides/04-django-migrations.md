# 04: Django Migrations

Migrations are sacred. Get them wrong and you create undetectable drift between environments and break rollback.

## Hard rules

1. **Never edit an applied migration.** Once a migration is in any deployed environment, it is frozen. Need a fix? Add a new migration.
2. **Schema-with-data changes use expand → backfill → contract**, not a single migration.
3. **CI runs `python manage.py makemigrations --check --dry-run`.** Detects unapplied model changes that someone forgot to migrate.
4. **CI runs `python manage.py migrate --check`.** Detects unapplied migrations on the working branch.
5. **Backfills with > 10K rows live in jobs (Celery / management commands), not in `RunPython` blocks.**
6. **The DB-side concern (locks, indexes, constraints, partitioning) hands off to `db-worker-bee`.** This guide is about the Django mechanics.

## The standard flow

```bash
# 1. Make a model change
# 2. Generate the migration
python manage.py makemigrations
# 3. Review the migration file before committing
# 4. Apply locally and run tests
python manage.py migrate
pytest
# 5. Commit BOTH the model change AND the migration in the same commit
```

If `makemigrations` produces a file you don't understand, stop. Read the diff. Ask. Don't merge a migration you can't explain.

## The expand → backfill → contract pattern

The five-phase rule (`research/2026-05-03-django-zero-downtime-migrations.md`):

1. **Expand**: add the new shape (column, table) **alongside** the old. Nullable, with a default if writes from the old code path need it.
2. **Dual-write**: application writes both old and new shapes. Code lands; old code (writing only the old shape) is still rolling out.
3. **Backfill**: batched copy of old → new. Run from a Celery task or management command. Batch + throttle + paginate by primary key + checkpoint. Never one giant `UPDATE`.
4. **Switch reads**: application reads from new (behind a feature flag, ramped 1% → 10% → 50% → 100%). Keep the old read path live for rollback.
5. **Contract**: drop the old column / table. Only after the rollback horizon (often a week+) has passed.

Each phase ships as a **separate deploy**.

### Renaming a column: the canonical example

The bad way: `migrations.RenameField('Order', 'shipping_addr', 'shipping_address')`. Locks the table, breaks any in-flight requests writing the old name during the deploy window.

The right way:

```python
# Phase 1 — expand: add the new column nullable
class Migration(migrations.Migration):
    dependencies = [("orders", "0010_initial")]
    operations = [
        migrations.AddField(
            model_name="order",
            name="shipping_address",
            field=models.CharField(max_length=255, null=True, blank=True),
        ),
    ]
```

```python
# Phase 2 — application code writes both columns
order.shipping_addr = addr  # legacy
order.shipping_address = addr  # new
order.save(update_fields=["shipping_addr", "shipping_address"])
```

```python
# Phase 3 — backfill (batch via Celery task or management command)
def backfill_shipping_address():
    last_id = 0
    while True:
        batch = Order.objects.filter(id__gt=last_id, shipping_address__isnull=True).order_by("id")[:1000]
        ids = list(batch.values_list("id", flat=True))
        if not ids:
            break
        Order.objects.filter(id__in=ids).update(shipping_address=F("shipping_addr"))
        last_id = ids[-1]
        time.sleep(0.1)  # throttle
```

```python
# Phase 4 — application reads from the new column. Old code path still wired up behind a flag.
addr = order.shipping_address or order.shipping_addr  # safety fallback
```

```python
# Phase 5 — contract: remove the old column
class Migration(migrations.Migration):
    dependencies = [("orders", "0011_add_shipping_address")]
    operations = [
        migrations.RemoveField(model_name="order", name="shipping_addr"),
    ]
```

## `RunPython` for tiny data migrations

Acceptable for < 10K rows AND no FK fanout:

```python
# apps/orders/migrations/0012_normalize_status.py
from django.db import migrations


def normalize_status(apps, schema_editor):
    Order = apps.get_model("orders", "Order")
    Order.objects.filter(status="OPEN").update(status="open")
    Order.objects.filter(status="CLOSED").update(status="closed")


def reverse_normalize_status(apps, schema_editor):
    # Best-effort reverse; document if irreversible
    raise migrations.RunPython.noop


class Migration(migrations.Migration):
    dependencies = [("orders", "0011_add_status_choices")]
    operations = [
        migrations.RunPython(normalize_status, reverse_normalize_status),
    ]
```

Notes:

- Always use `apps.get_model("app_label", "ModelName")`: the historical model. Never import the model directly; the import-path version may not match the schema at this migration point.
- Provide a reverse function or `migrations.RunPython.noop`. If truly irreversible, leave a comment in the file documenting why.
- For batch writes inside `RunPython`, use `bulk_update` / `bulk_create`, not loops of `.save()`.

## `RunSQL` for schema operations the ORM can't express

```python
operations = [
    migrations.RunSQL(
        sql="CREATE INDEX CONCURRENTLY orders_user_status_idx ON orders (user_id, status) WHERE status = 'pending';",
        reverse_sql="DROP INDEX IF EXISTS orders_user_status_idx;",
    ),
]
# atomic=False is required for CONCURRENTLY in Postgres:
class Migration(migrations.Migration):
    atomic = False
    operations = [...]
```

Findings:

- **`migrations.RunSQL` with no `reverse_sql`** when reverse is feasible → should-refactor.
- **`atomic=False` migration without a `RunSQL CONCURRENTLY` justification comment** → must-fix (it's almost always wrong).

## Tooling

- **`django-pg-zero-downtime-migrations`**: overrides the schema editor to refuse unsafe operations and emit safe-version DDL.
- **`django-syzygy`**: splits a single migration into pre-deploy and post-deploy phases automatically.
- **`scripts/audit-applied-migrations.py`** in this Stinger: verify no edits to migrations already in `git log` of a deployed environment.

## CI checks

```yaml
# .github/workflows/ci.yml
- name: Detect missing migrations
  run: uv run python manage.py makemigrations --check --dry-run

- name: Detect unapplied migrations
  run: uv run python manage.py migrate --check

- name: Run tests with --reuse-db (validates migrations on first run)
  run: uv run pytest --create-db
```

## Findings checklist

| Finding | Severity |
|---|---|
| Edited applied migration (file mtime > deploy date) | must-fix |
| `RunPython` doing > 10K-row backfill | should-refactor (move to job) |
| Migration that adds NOT NULL column without nullable→backfill→constraint sequence | must-fix |
| `RenameField` on a hot table without expand-contract | must-fix |
| Migration with `atomic=False` but no `CONCURRENTLY` (or other documented reason) | must-fix |
| Missing `--check` in CI | should-refactor |

## Handoff to db-worker-bee

- Postgres-side concerns (lock modes, partitioning, index strategy, vacuum / analyze, replication considerations) → `db-worker-bee`.
- Django-side migration mechanics (the patterns above, `RunPython` shape, `RunSQL` correctness, `--check` in CI) → this Stinger.

## Sources

- `research/2026-05-03-django-zero-downtime-migrations.md`
- https://docs.djangoproject.com/en/stable/howto/writing-migrations/
- https://palakorn.com/blog/zero-downtime-database-migrations/
- https://github.com/django-pg-zero-downtime-migrations/django-pg-zero-downtime-migrations

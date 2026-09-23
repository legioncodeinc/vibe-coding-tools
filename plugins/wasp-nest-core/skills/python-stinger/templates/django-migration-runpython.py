"""
Canonical Django data migration with batched RunPython.

For < 10K rows AND no FK fanout, this shape is acceptable. For larger or
fanout-heavy backfills, move the data move to a Celery task or management
command and keep this migration purely structural.

Place in apps/<app>/migrations/<NNNN>_normalize_status.py.
"""
from __future__ import annotations

from django.db import migrations


def _normalize_status(apps, schema_editor):
    """Forward operation — normalize uppercase statuses to lowercase.

    Use apps.get_model() to get the historical model — never import the model
    directly. The import-path version may not match the schema at this
    migration point.
    """
    Order = apps.get_model("orders", "Order")
    db_alias = schema_editor.connection.alias

    # Batch updates avoid loading everything into memory and avoid one giant
    # transaction. For very large tables, skip RunPython entirely and use a
    # Celery task with checkpoints.
    BATCH_SIZE = 1000
    last_id = 0
    while True:
        ids = list(
            Order.objects.using(db_alias)
            .filter(id__gt=last_id)
            .filter(status__in=["OPEN", "CLOSED", "CANCELLED"])
            .order_by("id")
            .values_list("id", flat=True)[:BATCH_SIZE]
        )
        if not ids:
            break
        # Use update() — single SQL UPDATE, no signals fired.
        # If signals must fire, iterate .save(update_fields=["status"]).
        Order.objects.using(db_alias).filter(id__in=ids, status="OPEN").update(status="open")
        Order.objects.using(db_alias).filter(id__in=ids, status="CLOSED").update(status="closed")
        Order.objects.using(db_alias).filter(id__in=ids, status="CANCELLED").update(status="cancelled")
        last_id = ids[-1]


def _reverse_normalize_status(apps, schema_editor):
    """Reverse — uppercase the lowercase values.

    If the migration is truly irreversible (e.g., destroys data), use
    `migrations.RunPython.noop` and document why in a comment.
    """
    Order = apps.get_model("orders", "Order")
    db_alias = schema_editor.connection.alias
    Order.objects.using(db_alias).filter(status="open").update(status="OPEN")
    Order.objects.using(db_alias).filter(status="closed").update(status="CLOSED")
    Order.objects.using(db_alias).filter(status="cancelled").update(status="CANCELLED")


class Migration(migrations.Migration):
    dependencies = [
        # Replace with the actual prior migration:
        ("orders", "0011_order_add_status_field"),
    ]

    operations = [
        migrations.RunPython(
            _normalize_status,
            reverse_code=_reverse_normalize_status,
        ),
    ]

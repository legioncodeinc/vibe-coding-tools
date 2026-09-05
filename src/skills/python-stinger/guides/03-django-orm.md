# 03: Django ORM

The canonical access pattern. ORM is default; raw SQL needs a documented reason.

## Source citations

Anchor: `research/2026-05-03-django-orm-n-plus-one.md` + Django optimization docs (https://docs.djangoproject.com/en/stable/topics/db/optimization/) + QuerySet API reference.

## Hard rules

1. **Use the ORM by default.** Raw SQL is acceptable for performance-critical queries, complex CTEs, vendor-specific features (Postgres window functions, full-text search), but the file gets a `# raw-sql: <reason>` comment with a real reason.
2. **N+1 is must-fix.** Cite file:line and the fix.
3. **`select_related` for forward FK / OneToOne.** SQL JOIN, single query.
4. **`prefetch_related` for reverse FK / M2M / GenericForeignKey.** Separate query, joined in Python.
5. **Wrap multi-write operations in `transaction.atomic()`.** Inside a service, the decorator form is canonical.
6. **`bulk_create([objs])` / `bulk_update([objs], fields=[...])`** for batch writes: never a loop of `.save()` calls.

## Canonical queryset patterns

### Forward FK / OneToOne: `select_related`

```python
# BAD — one query for orders, then one query per order to fetch user
orders = Order.objects.filter(status="pending")
for order in orders:
    print(order.user.email)  # N additional queries

# GOOD — single query with JOIN
orders = Order.objects.filter(status="pending").select_related("user")
for order in orders:
    print(order.user.email)  # zero additional queries
```

### Reverse FK / M2M: `prefetch_related`

```python
# BAD — one query for users, then one query per user to fetch their orders
users = User.objects.filter(is_active=True)
for user in users:
    print(user.orders.count())  # N additional queries

# GOOD — two queries total, joined in Python
users = User.objects.filter(is_active=True).prefetch_related("orders")
for user in users:
    print(user.orders.count())  # zero additional queries (uses prefetch cache)
```

### Filtered prefetch: `Prefetch` object with `to_attr`

Calling `.filter()` on an already-prefetched relationship triggers a new query (ignoring the prefetch cache):

```python
# BAD — re-queries the database
users = User.objects.prefetch_related("orders")
for user in users:
    pending = user.orders.filter(status="pending")  # NEW QUERY per user

# GOOD — filter inside Prefetch + use to_attr
from django.db.models import Prefetch
users = User.objects.prefetch_related(
    Prefetch("orders", queryset=Order.objects.filter(status="pending"), to_attr="pending_orders")
)
for user in users:
    print(user.pending_orders)  # list, no extra query
```

### Nested relations: chain field names

```python
# Two-deep FK — single query with two JOINs
orders = Order.objects.select_related("user__profile")

# Mix select_related and prefetch_related when needed
orders = (
    Order.objects.filter(status="pending")
    .select_related("user")
    .prefetch_related("items__product__category")
)
```

### Trim columns: `.only()` / `.defer()`

```python
# Only the columns you'll use — useful on wide tables
users = User.objects.only("id", "email", "is_active").filter(is_active=True)

# Defer the heavy column
articles = Article.objects.defer("body").filter(published=True)
```

Note: `select_related()` and `.only()` interact carefully: you can't `.defer()` the FK field that connects to a `select_related`-ed model.

### Atomic transactions

```python
from django.db import transaction

@transaction.atomic
def order_create(*, user, items):
    order = Order.objects.create(user=user, status="pending")
    OrderItem.objects.bulk_create([
        OrderItem(order=order, product_id=item["product_id"], quantity=item["quantity"])
        for item in items
    ])
    return order

# Or as a context manager when only part of a function should be atomic
def some_view(request):
    do_some_read()
    with transaction.atomic():
        do_write_one()
        do_write_two()
    do_some_unrelated_thing()
```

Findings:

- **Multi-row writes without `transaction.atomic()`** when failure mid-way leaves bad state → must-fix.
- **A loop of `.save()` calls** for inserting > 5 rows → should-refactor (use `bulk_create`).
- **`.update()` on a queryset that crosses multiple models** without `transaction.atomic()` wrapping → must-fix.

### Bulk operations

```python
# Bulk insert
OrderItem.objects.bulk_create([OrderItem(order=order, ...) for ... in ...])

# Bulk update — must specify the fields to update
for product in products:
    product.price = product.price * Decimal("1.10")
Product.objects.bulk_update(products, fields=["price"])

# update() — single SQL UPDATE, no model methods called, no signals fired
Order.objects.filter(status="pending").update(status="cancelled")
```

`update()` does NOT call `Model.save()`, does NOT fire `pre_save` / `post_save` signals, does NOT update `auto_now` fields. That's a feature when you want raw speed; a bug when you depended on signal-driven side effects.

### Raw SQL escape hatch

When the ORM truly cannot express what you need:

```python
# raw-sql: postgres window function for running balance — ORM can't express LAG()
def account_balance_history(*, account_id: int):
    return Transaction.objects.raw(
        """
        SELECT id, amount,
               SUM(amount) OVER (ORDER BY created_at) AS running_balance
        FROM transactions
        WHERE account_id = %s
        ORDER BY created_at
        """,
        [account_id],
    )
```

The `# raw-sql:` comment is the audit trail. Without it, raw SQL is a finding.

## Detection

- **`django-debug-toolbar`** in dev: request panel shows every query with timing. Required in any non-trivial Django dev environment.
- **`nplusone`** package: emits warnings (or raises) on detected N+1 patterns.
- **`self.assertNumQueries(N)`** in tests: pin the query count for a request.
- **`scripts/audit-n-plus-one.py`** in this Stinger: heuristic static scan for likely N+1 sites (loops over querysets without `select_related` / `prefetch_related`).

## Common findings

| Finding | Severity | Fix |
|---|---|---|
| Loop accessing FK without `select_related` | must-fix | `.select_related("fk_field")` |
| Loop accessing M2M / reverse FK without `prefetch_related` | must-fix | `.prefetch_related("relation")` |
| `.filter()` on prefetched relation | must-fix | `Prefetch(... queryset=qs.filter(...), to_attr="...")` |
| Bare `.select_related()` (no field names) | must-fix | List explicit fields |
| Raw SQL with no `# raw-sql:` comment | must-fix | Add comment with real reason or rewrite via ORM |
| Multi-row insert via loop of `.save()` | should-refactor | `bulk_create([...])` |
| Multi-write operation with no `transaction.atomic()` | must-fix | Wrap in `@transaction.atomic` decorator |

## Sources

- `research/2026-05-03-django-orm-n-plus-one.md`
- https://docs.djangoproject.com/en/stable/topics/db/optimization/
- https://docs.djangoproject.com/en/stable/ref/models/querysets/

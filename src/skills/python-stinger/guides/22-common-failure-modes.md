# 22: Common Failure Modes

The recurring issues. If you see these, name them and fix them.

## 1. Mutable default arguments

```python
# BUG — `items` shared across all calls that don't pass it
def add_item(item, items=[]):
    items.append(item)
    return items

add_item("a")  # ["a"]
add_item("b")  # ["a", "b"] — surprise
```

**Fix:** use `None` and create the default inside:

```python
def add_item(item, items: list[str] | None = None) -> list[str]:
    if items is None:
        items = []
    items.append(item)
    return items
```

Caught by Ruff `B006`. Severity: must-fix.

## 2. Bare `except:` and `except Exception:`

```python
# BUG — swallows KeyboardInterrupt, SystemExit, all exceptions
try:
    do_thing()
except:
    pass
```

**Fix:** catch the specific exceptions you actually expect, log the rest:

```python
try:
    do_thing()
except (ConnectionError, TimeoutError) as exc:
    logger.warning("retryable error: %s", exc)
    raise
except Exception:
    logger.exception("unexpected")
    raise
```

`except Exception:` is acceptable when you re-raise after logging. Bare `except:` never is. Caught by Ruff `E722`. Severity: must-fix (bare), should-refactor (broad with documented reason).

## 3. Missing `transaction.atomic()` on multi-write

```python
# BUG — failure between create() calls leaves orphan order without items
def order_create(*, user, items):
    order = Order.objects.create(user=user, status="pending")
    for item_data in items:
        OrderItem.objects.create(order=order, **item_data)
    return order
```

**Fix:**

```python
@transaction.atomic
def order_create(*, user, items):
    order = Order.objects.create(user=user, status="pending")
    OrderItem.objects.bulk_create([OrderItem(order=order, **i) for i in items])
    return order
```

Severity: must-fix.

## 4. Signals doing business logic

```python
# BUG — payment-charging side effect hidden in a post_save handler
@receiver(post_save, sender=Order)
def charge_payment(sender, instance, created, **kwargs):
    if created:
        stripe.Charge.create(amount=instance.total)  # silent if it fails
```

**Fix:** call the side effect from the service explicitly:

```python
@transaction.atomic
def order_create(*, user, items):
    order = Order.objects.create(...)
    transaction.on_commit(lambda: charge_payment_task.delay(order.id))
    return order
```

Signals are for cross-cutting concerns with no return value (cache invalidation, audit log), not for business logic. Severity: must-fix.

## 5. Fat models holding business logic

```python
# BUG — 200-line method on the model
class Order(models.Model):
    def create_with_items_and_charge_payment_and_send_email(self, items):
        ...
```

**Fix:** Move to a service. Keep the model for data shape + minimal helpers.

```python
# apps/orders/services.py
@transaction.atomic
def order_create(*, user, items):
    order = Order.objects.create(user=user, ...)
    OrderItem.objects.bulk_create(...)
    transaction.on_commit(lambda: charge_payment_task.delay(order.id))
    return order
```

Severity: should-refactor.

## 6. Monolithic settings.py

A single `settings.py` with `if DEBUG:` branches. Leaks prod secrets into dev, accumulates dead config.

**Fix:** `settings/base.py` + `settings/dev.py` + `settings/prod.py`. See `guides/02-django-app-architecture.md`. Severity: should-refactor.

## 7. Untyped boundaries

```python
# BUG — what's `data`?
@router.post("/orders/")
def create_order(request, data: dict):
    return services.order_create(**data)
```

**Fix:** Pydantic schema at the boundary.

```python
@router.post("/orders/")
def create_order(request, payload: OrderCreateIn):
    return services.order_create(**payload.model_dump())
```

Severity: must-fix.

## 8. N+1 queries

See `guides/03-django-orm.md`. Severity: must-fix.

## 9. Raw SQL without justification

```python
# BUG — no reason given, easy to write in ORM
Order.objects.raw("SELECT * FROM orders WHERE user_id = %s", [user_id])
```

**Fix:** Either rewrite via ORM, or add a `# raw-sql: <reason>` comment with a real reason. Severity: must-fix.

## 10. Edited applied migrations

Migration in `apps/orders/migrations/0010_*.py` was applied to staging two months ago, then someone edited the file. Now `0010` differs between environments: undetectable drift, broken rollback.

**Fix:** Add a new migration. Never edit an applied one. Severity: must-fix.

## 11. Hardcoded secrets

```python
# BUG
SECRET_KEY = "django-insecure-actual-real-secret-here"
STRIPE_API_KEY = "sk_live_..."
```

**Fix:** `os.environ["..."]`, `.env` for local, deploy-platform secrets for prod. Severity: must-fix.

## 12. `DEBUG = True` in committed prod settings

The single worst Django mistake. Leaks settings, env vars, SQL trace.

**Fix:** `settings/prod.py` has `DEBUG = False` and is selected by `DJANGO_SETTINGS_MODULE` in the prod environment. Severity: must-fix.

## 13. `requests` in async code

```python
async def some_view(request):
    r = requests.get("https://...")  # blocks the event loop
```

**Fix:** Use `httpx.AsyncClient`. Severity: must-fix.

## 14. Celery task dispatched before `transaction.on_commit()`

```python
def create_order(...):
    order = Order.objects.create(...)
    fulfill_order.delay(order.id)  # may run before commit
```

**Fix:** Wrap in `transaction.on_commit(lambda: fulfill_order.delay(order.id))`. Severity: must-fix.

## 15. Tests dependent on order

If running `pytest -p no:randomly` produces different results from `pytest`, tests share state. Severity: must-fix.

## 16. JSON `loaddata` fixtures

`fixtures/users.json` loaded with `loaddata` to set up tests. Brittle, drift-prone, slow. Use factory_boy. Severity: should-refactor.

## 17. `print()` for production logging

```python
print(f"order created: {order.id}")
```

**Fix:** `logger.info("order created: %s", order.id)`. Caught by Ruff `T20`. Severity: should-refactor.

## 18. Missing `transaction.on_commit` for Channels broadcasts

Same problem as Celery: the consumer might receive a group message about an object that hasn't committed yet. Wrap broadcasts in `transaction.on_commit`.

## 19. Async ORM call with `select_related` chain ignored

```python
# BUG — afirst() materializes one row but drops the optimization context
order = await Order.objects.select_related("user").afirst()
# user attribute is fine here
# but if you iterate without `async for`, you may break the prefetch contract
```

**Fix:** Use `async for` over async querysets; reach for `sync_to_async(list)(qs)` when in doubt.

## 20. `type: ignore` without explanation

```python
result = some_func()  # type: ignore
```

Squashes signal, hides bugs. Always narrow + comment:

```python
result = some_func()  # type: ignore[arg-type]  # narrow: third-party stubs missing
```

Severity: must-fix.

## Sources

- `research/2026-05-03-hacksoftware-styleguide.md`
- `research/2026-05-03-django-orm-n-plus-one.md`
- `research/2026-05-03-celery-django-redis.md`
- All preceding guides in this Stinger

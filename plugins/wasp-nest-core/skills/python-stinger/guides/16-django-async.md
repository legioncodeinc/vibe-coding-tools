# 16: Django Async

Async-aware, not async-by-default. Django supports async views from 4.1+; the wins are real but only when the I/O profile justifies them and you deploy on ASGI.

## Hard rules

1. **Async only wins under ASGI.** Async views under WSGI run in a one-off event loop with a measurable per-request penalty. If you can't deploy ASGI, don't write async views.
2. **`sync_to_async()` at the ORM boundary.** Wrap sync helpers with `@sync_to_async` or use `await sync_to_async(fn)(args)` inline. The `aget`, `acreate` ORM variants exist (Django 4.1+) but the underlying DB driver is still sync; they're convenience wrappers.
3. **Mixing sync middleware with async views incurs a context-switch cost.** Run async views with async middleware, or accept the per-request penalty.
4. **`asyncio.gather()` / `asyncio.TaskGroup()`** for parallel I/O. Sequential awaits gain nothing.
5. **No blocking calls in async def.** No `time.sleep`, no `requests.get`, no synchronous file I/O on hot paths.

## When async wins

- View makes 2+ external HTTP calls that can run in parallel.
- View streams a long response (use `StreamingHttpResponse` with async iterator).
- WebSocket / Server-Sent Events.
- View pulls from N upstreams and aggregates.

## When async doesn't help (or hurts)

- View is a single fast DB query → sync is fine, async adds overhead.
- View is CPU-bound (PDF generation, image processing) → not I/O, async won't help.
- WSGI deployment → async runs in the one-off loop, costs more than it saves.

## Canonical async view

```python
# apps/dashboard/api.py
import asyncio
import httpx
from django.http import JsonResponse
from ninja import Router

from apps.orders.selectors import order_count_for_user_async
from apps.users.selectors import user_get_async


router = Router(auth=django_auth)


@router.get("/dashboard")
async def dashboard(request):
    user_id = request.user.id

    async with httpx.AsyncClient(timeout=httpx.Timeout(connect=5.0, read=10.0)) as client:
        async with asyncio.TaskGroup() as tg:
            user_task = tg.create_task(user_get_async(user_id=user_id))
            order_count_task = tg.create_task(order_count_for_user_async(user_id=user_id))
            external_task = tg.create_task(_external_health(client))

    return {
        "user": user_task.result(),
        "order_count": order_count_task.result(),
        "external_status": external_task.result(),
    }


async def _external_health(client: httpx.AsyncClient) -> str:
    try:
        r = await client.get("https://status.example.com/health")
        return "ok" if r.status_code == 200 else "degraded"
    except httpx.HTTPError:
        return "unknown"
```

## Sync ORM bridge

```python
# apps/orders/selectors.py
from asgiref.sync import sync_to_async
from django.db.models import Count

from apps.orders.models import Order


@sync_to_async
def order_count_for_user_async(*, user_id: int) -> int:
    return Order.objects.filter(user_id=user_id, status="paid").count()
```

Or with the new async ORM (Django 4.1+):

```python
async def order_count_for_user_async(*, user_id: int) -> int:
    return await Order.objects.filter(user_id=user_id, status="paid").acount()
```

For non-trivial reads (lots of joined relations), `sync_to_async` wrapping a sync helper is still the most idiomatic: the async ORM is a convenience layer, not a true async DB.

`thread_sensitive=True` is the default: keeps all `sync_to_async` calls in the same thread for safety with the ORM connection pool. Use `thread_sensitive=False` only when you're sure the call doesn't share state.

## ASGI deployment

```bash
# Production with gunicorn + uvicorn workers
gunicorn config.asgi:application \
  -k uvicorn.workers.UvicornWorker \
  -w 4 \
  --bind 0.0.0.0:8000

# Or pure uvicorn
uvicorn config.asgi:application --host 0.0.0.0 --port 8000 --workers 4
```

For Channels (WebSockets co-existing), use `daphne`: see `guides/18-deployment-runtimes.md`.

## Common pitfalls

- **Calling sync ORM directly in an async view** without `sync_to_async`:
  ```python
  async def bad(request):
      orders = Order.objects.filter(user=request.user)  # SynchronousOnlyOperation
      return list(orders)
  ```
  Django will raise `SynchronousOnlyOperation`. Use `await sync_to_async(list)(qs)` or the async ORM (`async for order in qs:`).

- **Calling `requests.get(...)`** in an async view: blocks the event loop. Use `httpx.AsyncClient`.

- **`time.sleep()`** in an async view: same. Use `await asyncio.sleep(...)`.

- **Sequential awaits** when the operations are independent:
  ```python
  user = await get_user()
  orders = await get_orders()  # independent of user — should run in parallel
  ```
  Use `asyncio.gather` or `TaskGroup`.

- **Sync middleware mixed with async view + async server**: each request pays for the context switch. Audit middleware and either go all-async or accept the cost.

## Findings checklist

| Finding | Severity |
|---|---|
| Async view under WSGI deployment | must-fix (no benefit, has cost) |
| Sync ORM call in async def without `sync_to_async` | must-fix (raises) |
| `requests.get` / `time.sleep` in async view | must-fix |
| Sequential awaits for independent operations | should-refactor |
| Async view with no parallel I/O (one DB call) | should-refactor (just write it sync) |
| `httpx.Client` (sync) used inside async def | must-fix |
| `sync_to_async` with `thread_sensitive=False` for ORM call | must-fix |

## Sources

- `research/2026-05-03-django-async-views.md`
- https://docs.djangoproject.com/en/stable/topics/async/
- https://docs.djangoproject.com/en/stable/howto/deployment/asgi/
- https://fly.io/blog/running-tasks-concurrently-in-django-asynchronous-views/

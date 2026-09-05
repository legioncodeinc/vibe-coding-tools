# Example 05: Async Django view bridging to sync ORM

A dashboard endpoint that fans out to: a sync ORM read (cross-relation), an external HTTP call, and a Redis cache lookup, all in parallel. Demonstrates `sync_to_async`, async ORM, and `asyncio.TaskGroup` (Python 3.11+).

## Why async here

The endpoint pulls from three independent sources. Sequential awaits would total `(50ms ORM) + (200ms external) + (5ms Redis) = 255ms`. Parallel: `max(50, 200, 5) = 200ms`. That's the only justification for async: measured I/O concurrency.

If the endpoint had only one source, sync is the right answer.

## Deployment requirement

Async views only win under ASGI. Run with:

```bash
gunicorn config.asgi:application -k uvicorn.workers.UvicornWorker -w 4 --bind 0.0.0.0:8000
# or
uvicorn config.asgi:application --workers 4
```

Async views under WSGI run in a one-off event loop: net negative.

## `apps/dashboard/api.py`

```python
from __future__ import annotations

import asyncio
import logging

import httpx
from asgiref.sync import sync_to_async
from django.core.cache import cache
from ninja import Router
from ninja.security import django_auth

from apps.dashboard.schemas import DashboardOut
from apps.orders.selectors import order_summary_for_user
from apps.users.selectors import user_get_with_profile

logger = logging.getLogger(__name__)
router = Router(auth=django_auth, tags=["dashboard"])


@router.get("/dashboard/", response=DashboardOut)
async def dashboard(request) -> DashboardOut:
    user_id = request.user.id

    async with httpx.AsyncClient(
        timeout=httpx.Timeout(connect=5.0, read=10.0, write=10.0, pool=5.0),
    ) as client:
        async with asyncio.TaskGroup() as tg:
            user_task = tg.create_task(_get_user_with_profile(user_id))
            summary_task = tg.create_task(_get_order_summary(user_id))
            external_task = tg.create_task(_get_upstream_status(client))
            cached_task = tg.create_task(_get_cached_announcements())

    return DashboardOut(
        user=user_task.result(),
        order_summary=summary_task.result(),
        upstream_status=external_task.result(),
        announcements=cached_task.result(),
    )


# ---- Helpers — each isolates a sync/async boundary ----


@sync_to_async
def _get_user_with_profile(user_id: int):
    """Sync ORM call: a select_related across Profile."""
    return user_get_with_profile(user_id=user_id)


@sync_to_async
def _get_order_summary(user_id: int):
    """Sync ORM call: aggregate over Order."""
    return order_summary_for_user(user_id=user_id)


async def _get_upstream_status(client: httpx.AsyncClient) -> str:
    """Async HTTP — uses the shared client."""
    try:
        r = await client.get("https://status.example.com/health")
        return "ok" if r.status_code == 200 else "degraded"
    except httpx.HTTPError as exc:
        logger.warning("upstream health check failed: %s", exc)
        return "unknown"


@sync_to_async
def _get_cached_announcements() -> list[str]:
    """Django cache is sync; bridge with sync_to_async."""
    return cache.get("announcements", []) or []
```

## `apps/dashboard/schemas.py`

```python
from datetime import datetime
from decimal import Decimal
from ninja import Schema


class UserProfileOut(Schema):
    id: int
    email: str
    name: str
    timezone: str | None = None


class OrderSummaryOut(Schema):
    order_count: int
    total_spent: Decimal
    last_order_at: datetime | None = None


class DashboardOut(Schema):
    user: UserProfileOut
    order_summary: OrderSummaryOut
    upstream_status: str
    announcements: list[str]
```

## Async ORM alternative (Django 4.1+)

If you prefer the new async ORM:

```python
from apps.orders.models import Order
from django.db.models import Count, Sum


async def _get_order_summary_async(user_id: int) -> dict:
    """Async ORM — same shape, no sync_to_async needed.

    Note: under the hood Django still wraps with sync_to_async for the actual
    DB call (the underlying driver is sync). The async ORM is a convenience
    wrapper, not true async DB I/O.
    """
    summary = await Order.objects.filter(user_id=user_id).aaggregate(
        order_count=Count("id"),
        total_spent=Sum("total"),
    )
    return summary
```

Use whichever is more readable. For complex querysets with many joins, `sync_to_async` wrapping a synchronous helper is often clearer.

## Tests

```python
import pytest


@pytest.mark.django_db(transaction=True)
async def test_dashboard_endpoint(async_client, authenticated_user_token, mock_http):
    mock_http.get("https://status.example.com/health").mock(
        return_value=httpx.Response(200, json={"status": "ok"})
    )
    response = await async_client.get(
        "/api/dashboard/",
        headers={"Authorization": f"Bearer {authenticated_user_token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "user" in body
    assert "order_summary" in body
    assert body["upstream_status"] == "ok"
```

## What the example demonstrates

- ✅ `async def` view with `asyncio.TaskGroup` (3.11+) for parallel I/O.
- ✅ `sync_to_async` wrapping sync ORM calls: never call sync ORM directly.
- ✅ Single `httpx.AsyncClient` instance scoped to the request (or, ideally, app-state-scoped, see `templates/fastapi-service.py` lifespan pattern).
- ✅ Explicit `httpx.Timeout` configuration.
- ✅ Pydantic schema validates the response shape.
- ✅ ASGI-only deployment: gunicorn + uvicorn workers.

## Findings the example helps catch

- ❌ `Order.objects.filter(...)` directly in async def (raises `SynchronousOnlyOperation`).
- ❌ `requests.get(...)` in async def (blocks event loop).
- ❌ `time.sleep(...)` in async def.
- ❌ Sequential awaits when operations are independent.
- ❌ `httpx.Client` (sync) inside async def.

## Source

`research/2026-05-03-django-async-views.md`, `guides/16-django-async.md`.

# 11: pytest async

Async tests for Ninja, FastAPI, async Django views, and Channels consumers.

## Hard rules

1. **`asyncio_mode = "auto"`** in `pyproject.toml`. Tests defined as `async def` run in pytest-asyncio's loop automatically.
2. **`@pytest.mark.asyncio`** is unnecessary in `auto` mode but explicit in `strict` mode.
3. **Async fixtures** use `@pytest_asyncio.fixture` (or `@pytest.fixture` in `auto` mode if pytest-asyncio is recent).
4. **`async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app))`** for in-process FastAPI / Ninja testing: no real network.
5. **Channels `WebsocketCommunicator`** for testing consumers.

## Configuration

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```

## FastAPI / Ninja async tests

```python
# apps/orders/tests/test_api_async.py
import pytest
from httpx import ASGITransport, AsyncClient


@pytest.fixture
async def async_client(app):
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client


async def test_create_order_async(async_client, auth_token):
    response = await async_client.post(
        "/api/orders/",
        json={"items": [{"sku": "ABC", "quantity": 2}], "shipping_address": "123 Test"},
        headers={"Authorization": f"Bearer {auth_token}"},
    )
    assert response.status_code == 201
    assert response.json()["status"] == "pending"
```

## Async Django ORM

When testing async views or async ORM code:

```python
import pytest
from apps.orders.models import Order


@pytest.mark.django_db(transaction=True)  # async ORM needs real transaction
async def test_aget_order():
    order = await Order.objects.acreate(status="pending")
    fetched = await Order.objects.aget(id=order.id)
    assert fetched.status == "pending"
```

`transaction=True` is required for async ORM tests because the default test wrapping uses sync transactions.

## Channels consumer tests

```python
# apps/chat/tests/test_consumers.py
import pytest
from channels.testing import WebsocketCommunicator

from config.asgi import application


@pytest.mark.django_db(transaction=True)
async def test_chat_consumer_authenticated(authenticated_user_with_room):
    user, room = authenticated_user_with_room
    communicator = WebsocketCommunicator(application, f"/ws/chat/{room.id}/")
    communicator.scope["user"] = user  # inject the authenticated user
    connected, _ = await communicator.connect()
    assert connected

    await communicator.send_json_to({"body": "hello"})
    response = await communicator.receive_json_from(timeout=2)
    assert response["body"] == "hello"

    await communicator.disconnect()


async def test_chat_consumer_rejects_unauth():
    communicator = WebsocketCommunicator(application, "/ws/chat/1/")
    connected, code = await communicator.connect()
    assert not connected
    assert code == 4401
```

## Mocking outbound httpx in async tests

Use `respx`:

```python
import respx
import httpx
import pytest


@respx.mock
async def test_external_call(async_client):
    respx.get("https://api.example.com/things").mock(
        return_value=httpx.Response(200, json={"items": [1, 2, 3]})
    )
    response = await async_client.get("/api/things-from-upstream/")
    assert response.status_code == 200
    assert response.json() == {"count": 3}
```

## Findings checklist

| Finding | Severity |
|---|---|
| `asyncio_mode = "strict"` mixed with bare `async def` tests (no `@pytest.mark.asyncio`) | must-fix (tests skip silently) |
| Real network calls in async tests (no respx / no fixture) | must-fix |
| Async test using sync `Client` instead of `httpx.AsyncClient` | should-refactor |
| Channels consumer test without `transaction=True` | must-fix (DB writes leak across tests) |
| `await sync_orm_call()` (sync ORM in async test) | must-fix (use `async` variants or wrap with `sync_to_async`) |

## Sources

- https://pytest-asyncio.readthedocs.io/
- https://www.python-httpx.org/advanced/transports/: `ASGITransport`
- https://channels.readthedocs.io/en/stable/topics/testing.html
- `research/2026-05-03-django-async-views.md`

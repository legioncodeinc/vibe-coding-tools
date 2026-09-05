# Example 03: pytest + factory_boy test suite

A complete test suite for an `orders` app. Covers services, selectors, API, and async tests.

## File map

```
apps/orders/tests/
  __init__.py
  conftest.py          # app-local fixtures
  factories.py         # factory_boy factories (see templates/factory-boy-factory.py)
  test_services.py
  test_selectors.py
  test_api.py
  test_tasks.py
  test_async.py        # Channels / async views
```

## `apps/orders/tests/conftest.py`

```python
import pytest

from apps.orders.tests.factories import OrderFactory


@pytest.fixture
def pending_order(db, user):
    """Order owned by `user` (from root conftest), in pending state."""
    return OrderFactory(user=user, status="pending", items=3)
```

## `apps/orders/tests/test_services.py`

```python
import pytest
from django.db import IntegrityError

from apps.orders import services
from apps.orders.models import Order
from apps.orders.tests.factories import OrderFactory
from apps.products.tests.factories import ProductFactory
from apps.users.tests.factories import UserFactory


@pytest.mark.django_db
class TestOrderCreate:
    def test_creates_order_with_items(self):
        user = UserFactory()
        product = ProductFactory(sku="ABC", price=10)

        order = services.order_create(
            user=user,
            items=[{"sku": "ABC", "quantity": 2}],
            shipping_address="123 Test St",
        )

        assert order.id is not None
        assert order.user == user
        assert order.status == "pending"
        assert order.items.count() == 1
        assert order.total == 20

    def test_unknown_sku_raises_and_rolls_back(self):
        user = UserFactory()

        with pytest.raises(services.OrderValidationError):
            services.order_create(
                user=user,
                items=[{"sku": "NOPE", "quantity": 1}],
                shipping_address="123 Test St",
            )

        # The transaction rolled back — no Order rows remain
        assert Order.objects.filter(user=user).count() == 0

    @pytest.mark.parametrize("status", ["shipped", "cancelled", "paid"])
    def test_update_rejects_locked_states(self, status):
        order = OrderFactory(status=status)
        with pytest.raises(services.OrderImmutableError):
            services.order_update(
                order=order,
                items=[{"sku": "X", "quantity": 1}],
                shipping_address="changed",
            )
```

## `apps/orders/tests/test_selectors.py`

```python
import pytest

from apps.orders import selectors
from apps.orders.tests.factories import OrderFactory


@pytest.mark.django_db
class TestOrderListForUser:
    def test_filters_by_user(self):
        OrderFactory.create_batch(3)  # other users
        own = OrderFactory.create_batch(5)
        user = own[0].user
        for o in own[1:]:
            o.user = user
            o.save(update_fields=["user"])

        result = list(selectors.order_list_for_user(user=user))
        assert len(result) == 5

    def test_no_n_plus_one_when_iterating_items(self, django_assert_num_queries):
        user = OrderFactory().user
        for _ in range(10):
            OrderFactory(user=user, items=3)

        # 1 for orders + 1 prefetch for items + 1 prefetch for products = 3
        with django_assert_num_queries(3):
            orders = list(selectors.order_list_for_user(user=user))
            for order in orders:
                for item in order.items.all():
                    _ = item.product.name
```

## `apps/orders/tests/test_api.py`

```python
import pytest


@pytest.mark.django_db
class TestOrdersEndpoint:
    def test_list_paginates(self, authenticated_api_client):
        client, user = authenticated_api_client
        from apps.orders.tests.factories import OrderFactory
        OrderFactory.create_batch(25, user=user)

        response = client.get("/orders/?limit=10&offset=0")
        assert response.status_code == 200
        assert response.json()["count"] == 25
        assert len(response.json()["items"]) == 10

    def test_create_returns_201_with_envelope(self, authenticated_api_client):
        from apps.products.tests.factories import ProductFactory
        client, _ = authenticated_api_client
        ProductFactory(sku="ABC", price=10)

        r = client.post("/orders/", json={
            "items": [{"sku": "ABC", "quantity": 2}],
            "shipping_address": "123 Test St",
        })
        assert r.status_code == 201
        assert r.json()["status"] == "pending"

    def test_create_invalid_sku_returns_400_envelope(self, authenticated_api_client):
        client, _ = authenticated_api_client
        r = client.post("/orders/", json={
            "items": [{"sku": "MISSING", "quantity": 1}],
            "shipping_address": "123 Test St",
        })
        assert r.status_code == 400
        assert r.json()["code"] == "order_invalid"

    def test_unauthenticated_returns_401(self, api_client):
        r = api_client.get("/orders/")
        assert r.status_code == 401
```

## `apps/orders/tests/test_async.py`

```python
import pytest
from httpx import ASGITransport, AsyncClient

from config.asgi import application


@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=application), base_url="http://test") as client:
        yield client


@pytest.mark.django_db(transaction=True)
async def test_dashboard_async_endpoint(async_client, authenticated_user_token):
    response = await async_client.get(
        "/api/dashboard",
        headers={"Authorization": f"Bearer {authenticated_user_token}"},
    )
    assert response.status_code == 200
    body = response.json()
    assert "user" in body
    assert "order_count" in body
```

## Coverage configuration

Already set in `templates/pyproject.toml`:

```toml
[tool.coverage.run]
source = ["apps", "config"]
omit = ["*/migrations/*", "*/tests/*"]
branch = true

[tool.coverage.report]
fail_under = 70
show_missing = true
```

## Run

```bash
uv run pytest                          # full suite
uv run pytest apps/orders/             # one app
uv run pytest -k test_create           # by name
uv run pytest --cov                    # with coverage
uv run pytest -p no:randomly           # detect order-dependent tests
```

## Findings this example illustrates

- **`@pytest.mark.django_db`** opt-in.
- **factory_boy + pytest-factoryboy** for fixture authoring.
- **`django_assert_num_queries`** to pin N+1 prevention.
- **Async tests** with `httpx.AsyncClient` + `ASGITransport`.
- **No JSON `loaddata`**: every test sets up via factories.
- **App-local conftest** for app-specific fixtures.
- **`transaction=True`** on async tests that need real transactions.

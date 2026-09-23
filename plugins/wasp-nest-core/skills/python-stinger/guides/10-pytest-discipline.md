# 10: pytest Discipline

The canonical Django test stack: pytest + pytest-django + factory_boy + pytest-factoryboy. JSON `loaddata` fixtures are a finding.

## Hard rules

1. **`@pytest.mark.django_db`** to opt into DB access. Default is blocked.
2. **`--reuse-db`** in `addopts` for fast iteration. CI uses `--create-db` to force re-creation.
3. **factory_boy factories** in `tests/factories.py` per app. No JSON fixture files (`fixtures/*.json`).
4. **Function-scope fixtures by default.** Wider scope is a measured decision.
5. **No order-dependent tests.** If two tests must run in a specific order, they're broken.
6. **`assertNumQueries(N)`** in tests touching N+1-prone code paths.

## `pyproject.toml` configuration

```toml
[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "config.settings.dev"
python_files = ["test_*.py", "tests.py"]
addopts = "--reuse-db --tb=short -ra --strict-markers"
markers = [
    "slow: tests slower than 1s",
    "integration: tests that hit external services (skipped by default)",
]
asyncio_mode = "auto"
```

## conftest.py (root)

```python
# conftest.py
import pytest
from django.conf import settings


@pytest.fixture(autouse=True)
def _settings_overrides(settings):
    """Force fast password hasher in tests + disable real email."""
    settings.PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
    settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
    settings.CELERY_TASK_ALWAYS_EAGER = True
    settings.CELERY_TASK_EAGER_PROPAGATES = True


@pytest.fixture
def api_client():
    from ninja.testing import TestClient
    from config.urls import api  # the NinjaAPI instance
    return TestClient(api)


@pytest.fixture
def authenticated_client(api_client, db):
    from apps.users.tests.factories import UserFactory
    user = UserFactory()
    api_client.user = user  # depends on TestClient setup
    return api_client, user
```

## Factories

```python
# apps/users/tests/factories.py
import factory
from factory.django import DjangoModelFactory

from apps.users.models import User


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
        django_get_or_create = ("email",)

    email = factory.Sequence(lambda n: f"user{n}@example.com")
    name = factory.Faker("name")
    is_active = True


# apps/orders/tests/factories.py
import factory
from factory.django import DjangoModelFactory

from apps.orders.models import Order, OrderItem
from apps.products.tests.factories import ProductFactory
from apps.users.tests.factories import UserFactory


class OrderFactory(DjangoModelFactory):
    class Meta:
        model = Order

    user = factory.SubFactory(UserFactory)
    status = "pending"
    shipping_address = factory.Faker("address")

    @factory.post_generation
    def items(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted is None:
            extracted = 2  # default 2 items
        for _ in range(extracted):
            OrderItemFactory(order=self)


class OrderItemFactory(DjangoModelFactory):
    class Meta:
        model = OrderItem

    order = factory.SubFactory(OrderFactory)
    product = factory.SubFactory(ProductFactory)
    quantity = factory.Faker("random_int", min=1, max=10)
    unit_price = factory.LazyAttribute(lambda obj: obj.product.price)
```

## Canonical test shapes

```python
# apps/orders/tests/test_services.py
import pytest
from django.db import IntegrityError

from apps.orders import services
from apps.orders.tests.factories import OrderFactory
from apps.users.tests.factories import UserFactory


@pytest.mark.django_db
class TestOrderCreate:
    def test_creates_order_with_items(self):
        user = UserFactory()
        order = services.order_create(
            user=user,
            items=[{"sku": "ABC", "quantity": 2}],
            shipping_address="123 Test St",
        )
        assert order.id is not None
        assert order.items.count() == 1
        assert order.user == user
        assert order.status == "pending"

    def test_atomic_rollback_on_failure(self):
        user = UserFactory()
        with pytest.raises(IntegrityError):
            services.order_create(
                user=user,
                items=[{"sku": "MISSING_SKU", "quantity": 2}],
                shipping_address="123 Test St",
            )
        assert user.orders.count() == 0  # nothing committed
```

```python
# apps/orders/tests/test_selectors.py — proving N+1 prevention
import pytest

from apps.orders import selectors
from apps.orders.tests.factories import OrderFactory


@pytest.mark.django_db
class TestOrderListForUser:
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

```python
# apps/orders/tests/test_api.py
import pytest


@pytest.mark.django_db
def test_create_order_endpoint(authenticated_client):
    client, user = authenticated_client
    response = client.post("/orders/", json={
        "items": [{"sku": "ABC", "quantity": 2}],
        "shipping_address": "123 Test St",
    })
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "pending"
    assert len(body["items"]) == 1
```

## Coverage targets

- **services.py / selectors.py**: 80%+ (this is where logic lives).
- **api.py / views.py**: 60%+ (thin orchestrators, tested via integration tests).
- **models.py**: trivial methods don't need tests; non-trivial methods do.
- **`coverage report --fail-under=70`** in CI as a baseline.

## Hypothesis (when it earns its keep)

Use property-based testing for:

- Pure functions with non-trivial input space (parsers, validators, math).
- Reversible operations (encode/decode, serialize/deserialize).

Don't use it for:

- Anything touching the DB heavily.
- Anything with non-trivial setup cost per example.

## Findings checklist

| Finding | Severity |
|---|---|
| JSON fixture files (`fixtures/*.json`) loaded with `loaddata` | should-refactor (use factories) |
| Test depends on previous test's data | must-fix |
| `setUp` / `tearDown` instead of pytest fixtures (in non-`unittest.TestCase` code) | should-refactor |
| Module / session-scope fixture mutating state without cleanup | must-fix |
| Tests with no `@pytest.mark.django_db` that try to hit DB | must-fix (will error, but find them all) |
| Coverage < 50% on services / selectors | should-refactor |
| `transaction=True` on every test (slow) | should-refactor (only when actually needed) |
| Real email / Celery / external HTTP fired in tests | must-fix |

## Sources

- `research/2026-05-03-pytest-django-factory-boy.md`
- https://pytest-django.readthedocs.io/
- https://factoryboy.readthedocs.io/
- https://pytest-factoryboy.readthedocs.io/

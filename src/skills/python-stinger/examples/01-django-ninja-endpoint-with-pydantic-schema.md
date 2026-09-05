# Example 01: Django Ninja endpoint with Pydantic schema

Full request/response cycle: list + create + retrieve + update, with auth, pagination, error envelope.

## Files involved

```
apps/orders/
  models.py
  api.py            # Ninja router (this example)
  schemas.py        # Pydantic schemas
  services.py       # business logic — writes
  selectors.py      # business logic — reads
  tests/
    test_api.py
```

## `apps/orders/schemas.py`

```python
from datetime import datetime
from decimal import Decimal
from typing import Literal

from ninja import ModelSchema, Schema
from pydantic import Field, EmailStr

from apps.orders.models import Order


# Inputs
class OrderItemIn(Schema):
    sku: str = Field(min_length=1, max_length=64)
    quantity: int = Field(gt=0, le=999)


class OrderCreateIn(Schema):
    items: list[OrderItemIn] = Field(min_length=1, max_length=100)
    shipping_address: str = Field(min_length=1, max_length=255)
    customer_email: EmailStr | None = None
    notes: str | None = Field(default=None, max_length=2000)


class OrderUpdateIn(OrderCreateIn):
    """Update accepts the same shape as create (full replacement)."""


class OrderListFilters(Schema):
    status: Literal["pending", "shipped", "cancelled"] | None = None
    created_after: datetime | None = None
    created_before: datetime | None = None


# Outputs
class OrderItemOut(Schema):
    sku: str
    name: str
    quantity: int
    unit_price: Decimal


class OrderOut(ModelSchema):
    items: list[OrderItemOut]
    customer_email: EmailStr | None = None

    class Meta:
        model = Order
        fields = ["id", "status", "shipping_address", "total", "created_at", "updated_at"]


# Error envelope
class ErrorOut(Schema):
    error: str
    code: str
    details: dict | None = None
```

## `apps/orders/services.py`

```python
from decimal import Decimal

from django.db import transaction

from apps.orders.models import Order, OrderItem
from apps.products.selectors import product_get_by_sku
from apps.products.models import Product
from apps.users.models import User


class OrderValidationError(Exception):
    """Raised when an order can't be constructed (invalid SKUs, etc.)."""


@transaction.atomic
def order_create(*, user: User, items: list[dict], shipping_address: str, customer_email: str | None = None, notes: str | None = None) -> Order:
    products: dict[str, Product] = {}
    for item in items:
        try:
            products[item["sku"]] = product_get_by_sku(sku=item["sku"])
        except Product.DoesNotExist:
            raise OrderValidationError(f"unknown SKU: {item['sku']}")

    order = Order.objects.create(
        user=user,
        status="pending",
        shipping_address=shipping_address,
        customer_email=customer_email,
        notes=notes or "",
    )
    OrderItem.objects.bulk_create([
        OrderItem(
            order=order,
            product=products[item["sku"]],
            quantity=item["quantity"],
            unit_price=products[item["sku"]].price,
        )
        for item in items
    ])
    order.total = sum(
        (products[i["sku"]].price * Decimal(i["quantity"]) for i in items),
        start=Decimal("0"),
    )
    order.save(update_fields=["total"])
    return order
```

## `apps/orders/selectors.py`

```python
from django.db.models import QuerySet

from apps.orders.models import Order
from apps.users.models import User


def order_list_for_user(*, user: User, filters=None) -> QuerySet[Order]:
    qs = (
        Order.objects.filter(user=user)
        .select_related("user")
        .prefetch_related("items__product")
        .order_by("-created_at")
    )
    if filters is None:
        return qs
    if filters.status:
        qs = qs.filter(status=filters.status)
    if filters.created_after:
        qs = qs.filter(created_at__gte=filters.created_after)
    if filters.created_before:
        qs = qs.filter(created_at__lt=filters.created_before)
    return qs
```

## `apps/orders/api.py`

```python
from django.shortcuts import get_object_or_404
from ninja import Query, Router
from ninja.errors import HttpError
from ninja.pagination import LimitOffsetPagination, paginate
from ninja.security import django_auth

from apps.orders import services, selectors
from apps.orders.schemas import (
    ErrorOut, OrderCreateIn, OrderListFilters, OrderOut, OrderUpdateIn,
)

router = Router(auth=django_auth, tags=["orders"])


@router.get("/", response=list[OrderOut])
@paginate(LimitOffsetPagination)
def list_orders(request, filters: Query[OrderListFilters]):
    return selectors.order_list_for_user(user=request.user, filters=filters)


@router.get("/{order_id}/", response={200: OrderOut, 404: ErrorOut})
def get_order(request, order_id: int):
    order = selectors.order_list_for_user(user=request.user).filter(id=order_id).first()
    if order is None:
        return 404, {"error": "Order not found", "code": "order_not_found"}
    return 200, order


@router.post("/", response={201: OrderOut, 400: ErrorOut})
def create_order(request, payload: OrderCreateIn):
    try:
        order = services.order_create(user=request.user, **payload.model_dump())
    except services.OrderValidationError as exc:
        return 400, {"error": str(exc), "code": "order_invalid"}
    return 201, order


@router.put("/{order_id}/", response={200: OrderOut, 409: ErrorOut})
def update_order(request, order_id: int, payload: OrderUpdateIn):
    order = get_object_or_404(
        selectors.order_list_for_user(user=request.user), id=order_id
    )
    if order.status != "pending":
        return 409, {"error": "order is not editable in this state", "code": "order_locked"}
    return services.order_update(order=order, **payload.model_dump())
```

## `config/urls.py`

```python
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from apps.orders.api import router as orders_router
from apps.users.api import router as users_router

api = NinjaAPI(title="MyApp API", version="1.0.0")
api.add_router("/users/", users_router)
api.add_router("/orders/", orders_router)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
```

## Test (excerpt)

```python
# apps/orders/tests/test_api.py
import pytest
from apps.orders.tests.factories import OrderFactory
from apps.products.tests.factories import ProductFactory


@pytest.mark.django_db
def test_list_orders_paginates(authenticated_api_client):
    client, user = authenticated_api_client
    for _ in range(25):
        OrderFactory(user=user)

    r = client.get("/orders/?limit=10&offset=0")
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == 25
    assert len(body["items"]) == 10


@pytest.mark.django_db
def test_create_order_invalid_sku_returns_400(authenticated_api_client):
    client, _ = authenticated_api_client
    r = client.post("/orders/", json={
        "items": [{"sku": "MISSING", "quantity": 1}],
        "shipping_address": "123 Test St",
    })
    assert r.status_code == 400
    assert r.json()["code"] == "order_invalid"
```

## Findings this example illustrates

- Endpoint declares **request and response schemas**.
- **Business logic** lives in `services.py` / `selectors.py`.
- **Pagination** via `@paginate(LimitOffsetPagination)`.
- **Error envelope** is consistent (`{"error": "...", "code": "..."}`).
- **Auth** is explicit at router level.
- **N+1 prevention** in the selector via `select_related("user")` + `prefetch_related("items__product")`.
- **Service uses `@transaction.atomic`** for the multi-write operation.
- **`bulk_create`** for the items batch.

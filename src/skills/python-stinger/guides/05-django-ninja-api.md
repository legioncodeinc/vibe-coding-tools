# 05: Django Ninja API

The canonical API layer. Pydantic v2 schemas + decorator-per-endpoint + automatic OpenAPI docs + native async support.

## Why Ninja over DRF

See `research/2026-05-03-django-ninja-vs-drf.md` and `references/drf-comparison.md`. Short version:

- DRF requires a `Serializer` + `ViewSet` + `Router` per endpoint family. Lots of ceremony.
- Ninja: one decorated function per endpoint with type-hinted Pydantic schemas. Validation, serialization, OpenAPI docs are automatic.
- Ninja supports async natively. DRF's async support is partial.

## Hard rules

1. **Every endpoint declares request and response schemas.** Bare `def view(request, data: dict)` is a must-fix finding.
2. **Schemas are Pydantic v2** (Ninja's `Schema` and `ModelSchema` are subclasses).
3. **Auth is explicit**: declared on the router or the endpoint. Never assume "Django session probably works".
4. **Pagination uses `ninja.pagination.paginate(...)`** for list endpoints.
5. **Errors return a consistent envelope**: see "Error envelope" below.
6. **Business logic is NOT in the endpoint**: call a service or selector from `apps/<name>/services.py` / `selectors.py`.

## Canonical router shape

```python
# apps/orders/api.py
from typing import Annotated

from django.shortcuts import aget_object_or_404
from ninja import Query, Router, Schema
from ninja.errors import HttpError
from ninja.pagination import LimitOffsetPagination, paginate
from ninja.security import django_auth

from apps.orders import services, selectors
from apps.orders.schemas import OrderCreateIn, OrderOut, OrderListFilters

router = Router(auth=django_auth, tags=["orders"])


@router.get("/", response=list[OrderOut])
@paginate(LimitOffsetPagination)
def list_orders(request, filters: Query[OrderListFilters]):
    return selectors.order_list_for_user(user=request.user, filters=filters)


@router.get("/{order_id}/", response=OrderOut)
def get_order(request, order_id: int):
    return aget_object_or_404(
        selectors.order_list_for_user(user=request.user), id=order_id
    )


@router.post("/", response={201: OrderOut, 400: dict})
def create_order(request, payload: OrderCreateIn):
    try:
        order = services.order_create(user=request.user, **payload.model_dump())
    except services.OrderValidationError as exc:
        return 400, {"error": str(exc), "code": "order_invalid"}
    return 201, order
```

## Schemas

```python
# apps/orders/schemas.py
from datetime import datetime
from decimal import Decimal
from typing import Literal

from ninja import ModelSchema, Schema
from pydantic import ConfigDict, Field

from apps.orders.models import Order


# ---- Inputs ----

class OrderItemIn(Schema):
    sku: str = Field(min_length=1, max_length=64)
    quantity: int = Field(gt=0, le=999)


class OrderCreateIn(Schema):
    items: list[OrderItemIn] = Field(min_length=1)
    shipping_address: str = Field(min_length=1, max_length=255)
    notes: str | None = None


class OrderListFilters(Schema):
    status: Literal["pending", "shipped", "cancelled"] | None = None
    created_after: datetime | None = None


# ---- Outputs ----

class OrderItemOut(Schema):
    sku: str
    quantity: int
    unit_price: Decimal


class OrderOut(ModelSchema):
    items: list[OrderItemOut]

    class Meta:
        model = Order
        fields = ["id", "status", "shipping_address", "total", "created_at"]


# ---- Camel-case for JS clients ----

def to_camel(s: str) -> str:
    parts = s.split("_")
    return parts[0] + "".join(w.title() for w in parts[1:])


class CamelSchema(Schema):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
```

To emit camelCase, set `by_alias=True` on the decorator: `@router.get("/", response=list[OrderOut], by_alias=True)`.

## Auth

```python
# Built-in: Django session auth
from ninja.security import django_auth
router = Router(auth=django_auth)

# Custom: bearer token validation
from ninja.security import HttpBearer

class TokenAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            user = User.objects.get(api_token=token)
        except User.DoesNotExist:
            return None
        request.user = user
        return user

router = Router(auth=TokenAuth())

# Endpoint-level override (e.g., public sub-route)
@router.get("/health/", auth=None)
def health(request):
    return {"status": "ok"}
```

For OAuth provider integration (Clerk, WorkOS, Auth0, Supabase Auth), the `HttpBearer` subclass validates the provider's JWT and resolves it to a Django user. Provider choice is `auth-worker-bee` territory; the wiring is here.

## Error envelope

Errors should return a consistent JSON shape so the React (or any) client can parse them:

```json
{
  "error": "Order has no items",
  "code": "order_no_items",
  "details": {"field": "items", "reason": "min_length"}
}
```

Wire it once with a global exception handler:

```python
# apps/api.py (top-level Ninja API instance)
from ninja import NinjaAPI
from ninja.errors import ValidationError

api = NinjaAPI()

@api.exception_handler(ValidationError)
def validation_handler(request, exc):
    return api.create_response(
        request,
        {"error": "Validation failed", "code": "validation_error", "details": exc.errors},
        status=422,
    )

@api.exception_handler(Exception)
def fallback_handler(request, exc):
    # Log + Sentry; never leak the stack trace
    import logging
    logging.exception("unhandled api error")
    return api.create_response(
        request,
        {"error": "Internal server error", "code": "internal_error"},
        status=500,
    )
```

## Pagination

```python
from ninja.pagination import LimitOffsetPagination, PageNumberPagination, paginate

@router.get("/", response=list[OrderOut])
@paginate(LimitOffsetPagination, limit=20)
def list_orders(request):
    return selectors.order_list_for_user(user=request.user)
```

The response automatically becomes `{"items": [...], "count": N}`. Cursor-based pagination requires a custom Paginator subclass: implement when you actually need it.

## Findings checklist

| Finding | Severity |
|---|---|
| Endpoint takes `dict` / `list` / `Any` instead of a Pydantic schema | must-fix |
| Endpoint returns a Django model instance with no `response=...` | must-fix |
| Endpoint contains business logic (DB writes outside an `*_create()` service call) | must-fix |
| `auth=None` on a non-public endpoint | must-fix |
| List endpoint without pagination | should-refactor |
| Errors raised as plain HTTP exceptions with no envelope | should-refactor |
| `ModelSchema` with no `fields = [...]` (exposes everything) | must-fix |

## Migration from DRF

See `examples/07-drf-to-django-ninja-migration.md` for the phased plan + parity checklist.

## Sources

- `research/2026-05-03-django-ninja-vs-drf.md`
- `research/2026-05-03-pydantic-v2-ninja-schemas.md`
- https://django-ninja.dev/

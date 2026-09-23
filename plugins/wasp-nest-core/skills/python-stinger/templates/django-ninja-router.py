"""
Canonical Django Ninja router with Pydantic schemas, auth, pagination.

Place this in apps/<feature>/api.py. Mount it in config/urls.py via:

    api = NinjaAPI()
    api.add_router("/<feature>/", router)
"""
from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from typing import Literal

from django.shortcuts import get_object_or_404
from ninja import ModelSchema, Query, Router, Schema
from ninja.errors import HttpError
from ninja.pagination import LimitOffsetPagination, paginate
from ninja.security import django_auth
from pydantic import Field

# Replace with your actual imports
from apps.orders import services, selectors
from apps.orders.models import Order


# ---- Schemas (would normally live in apps/orders/schemas.py) ----


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


class OrderItemOut(Schema):
    sku: str
    quantity: int
    unit_price: Decimal


class OrderOut(ModelSchema):
    items: list[OrderItemOut]

    class Meta:
        model = Order
        fields = ["id", "status", "shipping_address", "total", "created_at"]


# ---- Router ----


router = Router(auth=django_auth, tags=["orders"])


@router.get("/", response=list[OrderOut])
@paginate(LimitOffsetPagination)
def list_orders(request, filters: Query[OrderListFilters]):
    """List orders for the authenticated user. Paginated, filterable."""
    return selectors.order_list_for_user(user=request.user, filters=filters)


@router.get("/{order_id}/", response=OrderOut)
def get_order(request, order_id: int):
    """Fetch a single order. 404 if it doesn't belong to the user."""
    return get_object_or_404(
        selectors.order_list_for_user(user=request.user), id=order_id
    )


@router.post("/", response={201: OrderOut, 400: dict})
def create_order(request, payload: OrderCreateIn):
    """Create an order. Returns 400 with envelope on validation failure."""
    try:
        order = services.order_create(user=request.user, **payload.model_dump())
    except services.OrderValidationError as exc:
        return 400, {"error": str(exc), "code": "order_invalid"}
    return 201, order


@router.put("/{order_id}/", response=OrderOut)
def update_order(request, order_id: int, payload: OrderCreateIn):
    """Replace an order. Forbidden once shipped."""
    order = get_object_or_404(
        selectors.order_list_for_user(user=request.user), id=order_id
    )
    if order.status != "pending":
        raise HttpError(409, "order is not editable in this state")
    return services.order_update(order=order, **payload.model_dump())


@router.delete("/{order_id}/", response={204: None})
def cancel_order(request, order_id: int):
    """Cancel a pending order."""
    order = get_object_or_404(
        selectors.order_list_for_user(user=request.user), id=order_id
    )
    services.order_cancel(order=order)
    return 204, None

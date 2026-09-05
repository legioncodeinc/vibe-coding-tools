"""
Canonical Django ORM queryset patterns.

Drop into apps/<feature>/selectors.py. Each function is a queryset-shaped
read with the right select_related / prefetch_related / .only() applied for
the intended consumer.
"""
from __future__ import annotations

from django.db.models import Count, Prefetch, QuerySet, Sum

from apps.orders.models import Order, OrderItem
from apps.products.models import Product
from apps.users.models import User


# ---- 1. Forward FK / OneToOne — select_related ----


def order_list_with_user(*, status: str | None = None) -> QuerySet[Order]:
    qs = Order.objects.select_related("user")
    if status:
        qs = qs.filter(status=status)
    return qs.order_by("-created_at")


# ---- 2. Reverse FK / M2M — prefetch_related ----


def user_list_with_orders(*, is_active: bool = True) -> QuerySet[User]:
    return (
        User.objects.filter(is_active=is_active)
        .prefetch_related("orders")
        .order_by("-date_joined")
    )


# ---- 3. Filtered prefetch — Prefetch with to_attr ----


def user_list_with_pending_orders(*, is_active: bool = True) -> QuerySet[User]:
    """Each user has a `.pending_orders` list attribute — filtered prefetch.

    Calling user.orders.filter(status="pending") in a loop would bypass the
    prefetch cache and trigger N additional queries. The Prefetch object with
    to_attr is the right shape.
    """
    return (
        User.objects.filter(is_active=is_active)
        .prefetch_related(
            Prefetch(
                "orders",
                queryset=Order.objects.filter(status="pending"),
                to_attr="pending_orders",
            )
        )
        .order_by("-date_joined")
    )


# ---- 4. Multi-level — chain with __ ----


def order_list_full(*, user: User) -> QuerySet[Order]:
    """Orders for a user with items and product details — single query for FK
    chains, separate prefetch for the M2M-style items relation."""
    return (
        Order.objects.filter(user=user)
        .select_related("user")
        .prefetch_related("items__product__category")
        .order_by("-created_at")
    )


# ---- 5. Trim columns — only() ----


def user_email_list_active() -> QuerySet[User]:
    """When you only need email + id, .only() trims the SELECT."""
    return User.objects.only("id", "email").filter(is_active=True)


# ---- 6. Aggregations ----


def order_summary_for_user(*, user: User) -> dict[str, int | float]:
    summary = Order.objects.filter(user=user).aggregate(
        order_count=Count("id"),
        total_spent=Sum("total"),
    )
    return {
        "order_count": summary["order_count"] or 0,
        "total_spent": float(summary["total_spent"] or 0),
    }


# ---- 7. Bulk write helper ----


def order_items_create_bulk(*, order: Order, items_data: list[dict]) -> list[OrderItem]:
    return OrderItem.objects.bulk_create(
        [
            OrderItem(
                order=order,
                product_id=item["product_id"],
                quantity=item["quantity"],
                unit_price=item["unit_price"],
            )
            for item in items_data
        ]
    )


# ---- 8. Iterator for large querysets ----


def all_active_products_iter():
    """For exports / batch processing of > 10K rows. .iterator() avoids loading
    everything into memory at once.
    """
    yield from Product.objects.filter(is_active=True).iterator(chunk_size=1000)

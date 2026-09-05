# Example 02: Celery task with retries and idempotency

A task that calls an external payment API, marks an order paid, and notifies the user. Demonstrates the full retry / idempotency / `on_commit` shape.

## The contract

- **Idempotent**: safe to run twice with the same args. Re-runs detect "already done" and exit early.
- **Atomic**: DB writes are wrapped in `transaction.atomic()` and use `select_for_update()` to prevent race conditions.
- **Retried**: transient errors (`ConnectionError`, `TimeoutError`, `httpx.HTTPError`) trigger exponential backoff with jitter.
- **`acks_late=True`**: the worker only acks the message after the task succeeds. Crash mid-task → message redelivered.
- **`on_commit`**: dispatched only after the parent transaction commits (so the row exists when the worker reads it).

## `apps/orders/tasks.py`

```python
from __future__ import annotations

import logging

import httpx
from celery import shared_task
from celery.exceptions import SoftTimeLimitExceeded
from django.db import transaction

from apps.orders.models import Order
from apps.payments.services import payment_capture
from apps.users.tasks import send_email

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(httpx.HTTPError, ConnectionError, TimeoutError),
    retry_backoff=True,            # 1s, 2s, 4s, 8s, ... (with jitter)
    retry_backoff_max=600,         # cap at 10 min
    retry_jitter=True,
    max_retries=5,
    acks_late=True,
)
def fulfill_order(self, order_id: int) -> None:
    """Capture payment for an order and notify the user.

    Idempotency: the function checks `order.status` at the start. Only orders
    in `pending_payment` state are processed. A second invocation finds the
    order in `paid` (or another state) and exits.
    """
    try:
        with transaction.atomic():
            order = Order.objects.select_for_update().get(id=order_id)
            if order.status != "pending_payment":
                logger.info(
                    "fulfill_order: skipping order_id=%s in state=%s",
                    order_id, order.status,
                )
                return

            try:
                charge_id = payment_capture(
                    amount_cents=int(order.total * 100),
                    currency=order.currency,
                    customer_id=order.user.stripe_customer_id,
                    idempotency_key=f"order-{order.id}",  # provider-side idempotency
                )
            except httpx.HTTPStatusError as exc:
                if 400 <= exc.response.status_code < 500:
                    # Permanent failure — do not retry. Mark order failed.
                    order.status = "payment_failed"
                    order.save(update_fields=["status"])
                    logger.warning(
                        "fulfill_order: permanent failure for order_id=%s: %s",
                        order_id, exc.response.status_code,
                    )
                    return
                # 5xx — transient. Re-raise so autoretry kicks in.
                raise

            order.status = "paid"
            order.charge_id = charge_id
            order.save(update_fields=["status", "charge_id"])

        # After-commit side effects
        transaction.on_commit(
            lambda: send_email.delay(
                user_id=order.user_id,
                template="order_paid",
                context={"order_id": order.id},
            )
        )

    except SoftTimeLimitExceeded:
        logger.warning("fulfill_order soft time limit hit for order_id=%s", order_id)
        raise
    except Order.DoesNotExist:
        logger.exception("fulfill_order: order_id=%s does not exist", order_id)
        return  # don't retry — non-existent rows won't materialize
```

## Dispatch from a view

```python
# apps/orders/api.py
from django.db import transaction
from ninja import Router

from apps.orders import services
from apps.orders.tasks import fulfill_order

router = Router(auth=django_auth)


@router.post("/", response={201: OrderOut})
def create_order(request, payload: OrderCreateIn):
    order = services.order_create(user=request.user, **payload.model_dump())
    transaction.on_commit(lambda: fulfill_order.delay(order.id))
    return 201, order
```

The double `on_commit`: once at dispatch (so the worker sees the row), once inside the task (so the email goes out only after the payment commit).

## Tests

```python
# apps/orders/tests/test_tasks.py
import httpx
import pytest
from unittest.mock import patch

from apps.orders.tasks import fulfill_order
from apps.orders.tests.factories import OrderFactory


@pytest.mark.django_db
class TestFulfillOrder:
    def test_marks_order_paid_on_success(self, settings):
        order = OrderFactory(status="pending_payment", total=100)
        with patch("apps.orders.tasks.payment_capture", return_value="ch_123"):
            fulfill_order(order.id)
        order.refresh_from_db()
        assert order.status == "paid"
        assert order.charge_id == "ch_123"

    def test_idempotent_on_second_call(self, settings):
        order = OrderFactory(status="paid", charge_id="ch_existing")
        with patch("apps.orders.tasks.payment_capture") as mock_capture:
            fulfill_order(order.id)
        mock_capture.assert_not_called()
        order.refresh_from_db()
        assert order.charge_id == "ch_existing"

    def test_4xx_marks_order_payment_failed_no_retry(self, settings, caplog):
        order = OrderFactory(status="pending_payment", total=100)
        response = httpx.Response(402, request=httpx.Request("POST", "https://x"))
        with patch(
            "apps.orders.tasks.payment_capture",
            side_effect=httpx.HTTPStatusError("402", request=response.request, response=response),
        ):
            fulfill_order(order.id)
        order.refresh_from_db()
        assert order.status == "payment_failed"

    def test_5xx_triggers_retry(self, settings):
        settings.CELERY_TASK_ALWAYS_EAGER = True
        order = OrderFactory(status="pending_payment", total=100)
        response = httpx.Response(503, request=httpx.Request("POST", "https://x"))
        with patch(
            "apps.orders.tasks.payment_capture",
            side_effect=httpx.HTTPStatusError("503", request=response.request, response=response),
        ):
            with pytest.raises(httpx.HTTPStatusError):
                fulfill_order.apply(args=[order.id], throw=True)
```

## Settings

```python
# config/settings/base.py — already in templates/settings-base.py
CELERY_TASK_ACKS_LATE = True
CELERY_WORKER_PREFETCH_MULTIPLIER = 1
CELERY_TASK_REJECT_ON_WORKER_LOST = True
CELERY_TASK_TIME_LIMIT = 600
CELERY_TASK_SOFT_TIME_LIMIT = 540
CELERY_BROKER_TRANSPORT_OPTIONS = {"visibility_timeout": 3600}
CELERY_TASK_ROUTES = {
    "apps.orders.tasks.fulfill_order": {"queue": "payments"},
}
```

## Worker invocation

```bash
celery -A config worker -Q payments -c 4 -l INFO
```

## Findings this example illustrates

- **`bind=True`** for retry access.
- **`autoretry_for` + `retry_backoff` + `retry_jitter`** for declarative retries.
- **`acks_late=True`** + idempotent body.
- **`select_for_update()`** to prevent races between concurrent retries.
- **Permanent vs transient error distinction**: 4xx returns; 5xx raises to trigger autoretry.
- **`transaction.on_commit`** wrapping the email side effect.
- **Provider-side idempotency key** (`idempotency_key=f"order-{order.id}"`) for the external API.

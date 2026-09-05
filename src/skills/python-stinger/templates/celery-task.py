"""
Canonical Celery task with retries, idempotency, and atomic ORM.

Place in apps/<feature>/tasks.py. Use @shared_task (not @app.task) so the task
is portable across Celery app instances.

Dispatching from a view:

    from django.db import transaction
    transaction.on_commit(lambda: fulfill_order.delay(order.id))

`on_commit` is mandatory when the task depends on a row created in the same
transaction — otherwise the worker may execute before commit and DoesNotExist.
"""
from __future__ import annotations

import logging

from celery import shared_task
from celery.exceptions import SoftTimeLimitExceeded
from django.db import transaction

from apps.orders.models import Order
from apps.orders.services import notify_shipping

logger = logging.getLogger(__name__)


@shared_task(
    bind=True,
    autoretry_for=(ConnectionError, TimeoutError),
    retry_backoff=True,         # 1s, 2s, 4s, 8s, ... (with jitter)
    retry_backoff_max=600,      # cap at 10 minutes
    retry_jitter=True,          # avoid thundering herd
    max_retries=5,
    acks_late=True,             # only ack after success — requires idempotent body
)
def fulfill_order(self, order_id: int) -> None:
    """Mark an order shipped + send notification.

    Idempotency: relies on `order.status` check before doing work. Safe to run
    twice — the second run sees status != "paid" and returns.
    """
    try:
        with transaction.atomic():
            # select_for_update locks the row until commit/rollback
            order = Order.objects.select_for_update().get(id=order_id)
            if order.status != "paid":
                logger.info("fulfill_order: skipping order %s in state %s", order_id, order.status)
                return
            order.status = "shipping"
            order.save(update_fields=["status"])
        # Side effect runs AFTER commit
        transaction.on_commit(lambda: notify_shipping(order_id))
    except SoftTimeLimitExceeded:
        # Soft kill — clean up if needed and re-raise
        logger.warning("fulfill_order soft time limit hit for order_id=%s", order_id)
        raise
    except Order.DoesNotExist:
        # If the row truly doesn't exist (not just commit timing), fail without retry
        logger.exception("fulfill_order: order %s does not exist", order_id)
        # Don't retry — re-raising would
        return


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def fulfill_order_with_explicit_retry(self, order_id: int) -> None:
    """Same shape with explicit retry instead of declarative autoretry_for."""
    try:
        with transaction.atomic():
            order = Order.objects.select_for_update().get(id=order_id)
            if order.status != "paid":
                return
            _do_external_call(order)
            order.status = "shipping"
            order.save(update_fields=["status"])
    except (ConnectionError, TimeoutError) as exc:
        # Exponential backoff via countdown
        countdown = 2 ** self.request.retries
        raise self.retry(exc=exc, countdown=countdown)


def _do_external_call(order: Order) -> None:
    """Replace with the actual work — shipping API, payment capture, etc."""
    raise NotImplementedError

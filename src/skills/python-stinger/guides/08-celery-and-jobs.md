# 08: Celery and Background Jobs

Celery + Redis is the canonical Django background-job stack. Production hardening is a known set of patterns.

## Hard rules

1. **`bind=True`** on every retry-capable task (gives access to `self.request`).
2. **`autoretry_for=(...)` + `retry_backoff=True` + `retry_jitter=True`** for declarative retries OR `self.retry(exc=exc, countdown=2 ** self.request.retries)` for explicit retries.
3. **`acks_late=True` + idempotent task code** is the canonical pair. A worker crash mid-task safely re-runs.
4. **`prefetch_multiplier=1`** for non-trivial tasks. Default 4 is wrong.
5. **`transaction.on_commit(lambda: my_task.delay(obj.id))`** when the task depends on an object created in the same transaction.
6. **Idempotency**: every task should be safe to run twice. Use `update_or_create` / `get_or_create` for ORM writes; check an idempotency key on the model; `SET NX EX` on Redis for distributed locks.
7. **Queue separation**: route by task type. Run dedicated workers per queue.
8. **Redis broker config**: `appendonly yes`, `maxmemory-policy noeviction` for the broker DB. Separate Redis instance from the cache.

## Canonical Celery app

```python
# config/celery.py
import os

from celery import Celery
from celery.signals import task_failure
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

app = Celery("myapp")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# Always set these
app.conf.update(
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    task_time_limit=600,
    task_soft_time_limit=540,
    broker_transport_options={"visibility_timeout": 3600},
    broker_connection_retry_on_startup=True,
)

# Queue routing
app.conf.task_routes = {
    "apps.users.tasks.send_email": {"queue": "email"},
    "apps.images.tasks.process_image": {"queue": "image_processing"},
    "apps.orders.tasks.*": {"queue": "default"},
}


@task_failure.connect
def task_failure_handler(sender=None, task_id=None, exception=None, **kwargs):
    # Forward to Sentry / your observability pipe
    import logging
    logging.exception("celery task failed: %s (id=%s)", sender, task_id, exc_info=exception)
```

## Settings (in Django settings/base.py)

```python
CELERY_BROKER_URL = env("CELERY_BROKER_URL")  # e.g., redis://localhost:6379/0
CELERY_RESULT_BACKEND = env("CELERY_RESULT_BACKEND", default=None)  # only if you need results
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TIMEZONE = "UTC"
CELERY_TASK_TRACK_STARTED = True
```

## Canonical task

```python
# apps/orders/tasks.py
from celery import shared_task
from celery.exceptions import SoftTimeLimitExceeded
from django.db import transaction

from apps.orders.models import Order


@shared_task(
    bind=True,
    autoretry_for=(ConnectionError, TimeoutError),
    retry_backoff=True,
    retry_backoff_max=600,
    retry_jitter=True,
    max_retries=5,
    acks_late=True,
)
def fulfill_order(self, order_id: int) -> None:
    """Mark order shipped + send notification.

    Idempotency: relies on `order.status` check. Safe to run twice.
    """
    try:
        with transaction.atomic():
            order = Order.objects.select_for_update().get(id=order_id)
            if order.status != "paid":
                return  # already processed or invalid state — idempotent
            order.status = "shipping"
            order.save(update_fields=["status"])
        send_shipping_notification(order_id)
    except SoftTimeLimitExceeded:
        # Soft kill — clean up and re-raise
        raise
```

## Dispatching from a view (the on_commit trap)

```python
# WRONG — task may execute before transaction commits
@router.post("/orders/")
def create_order(request, payload):
    order = services.order_create(user=request.user, **payload.model_dump())
    fulfill_order.delay(order.id)  # may run BEFORE the row is committed
    return order

# RIGHT — fire after commit
from django.db import transaction

@router.post("/orders/")
def create_order(request, payload):
    order = services.order_create(user=request.user, **payload.model_dump())
    transaction.on_commit(lambda: fulfill_order.delay(order.id))
    return order
```

## Beat (scheduled tasks)

```python
# config/celery.py — append
app.conf.beat_schedule = {
    "expire-pending-orders-every-5min": {
        "task": "apps.orders.tasks.expire_pending_orders",
        "schedule": 300.0,  # seconds
    },
    "daily-rollup": {
        "task": "apps.reports.tasks.daily_rollup",
        "schedule": crontab(hour=2, minute=0),
    },
}
```

Run beat as a separate process: `celery -A config worker -l INFO -Q default,email,image_processing -c 4` plus `celery -A config beat -l INFO`.

## Worker deployment

- **One worker process per queue type** (or per resource profile). Email workers are I/O-bound; image-processing workers are CPU-bound.
- **`-c <concurrency>`** = workers per process. For I/O-bound, use prefork with high concurrency or gevent. For CPU-bound, prefork concurrency = #cores.
- **`--max-tasks-per-child=1000`** prevents memory leaks (worker recycles after 1000 tasks).
- **Run under a process supervisor** (systemd, supervisord, Kubernetes Deployment): handoff to `devops-worker-bee`.

## Monitoring

- **Flower** for live monitoring: `celery -A config flower --port=5555`.
- **Structured logging** with task ID + correlation ID.
- **Sentry / Rollbar** integration via `task_failure_handler`.
- **Stuck task / queue depth alerts** via your observability stack.

## Findings checklist

| Finding | Severity |
|---|---|
| Task with no `acks_late` AND not idempotent | must-fix |
| Task with `acks_late=True` but ORM write without `transaction.atomic()` | must-fix |
| `delay()` outside `transaction.on_commit()` when task depends on a just-created row | must-fix |
| `prefetch_multiplier=4` (default) on a > 1s-task queue | should-refactor |
| `default_retry_delay` of 3 minutes (default) for an external API call | should-refactor (use exponential backoff + jitter) |
| Single Redis instance for cache AND broker | must-fix |
| Long-running task (> visibility timeout) without `visibility_timeout` config | must-fix |
| Celery broker without `task_failure` handler logging | should-refactor |

## Sources

- `research/2026-05-03-celery-django-redis.md`
- https://docs.celeryq.dev/en/stable/userguide/tasks.html
- https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html
- https://vintasoftware.com/blog/guide-django-celery-tasks

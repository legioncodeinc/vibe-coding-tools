# 2026-05-03: Celery + Django + Redis (production patterns)

## Sources

- https://docs.celeryq.dev/en/stable/userguide/tasks.html: canonical Tasks user guide (retrieved 2026-05-03)
- https://docs.celeryq.dev/en/stable/django/first-steps-with-django.html: Django integration
- https://vintasoftware.com/blog/guide-django-celery-tasks: Vinta production playbook
- https://softaims.com/blog/django-celery-background-tasks-production-2026: 2026 patterns writeup
- https://mediusware.com/blog/django-celery-retry-error-handling: retry/error handling

## Summary

Celery + Redis is the canonical Django background-job stack. Production hardening is a known set of patterns:

- **`bind=True` + `self.retry(exc=exc, countdown=2 ** self.request.retries)`** for explicit retries with exponential backoff. Or `autoretry_for=(SomeExc,)` + `retry_backoff=True` + `retry_jitter=True` for declarative auto-retry.
- **`acks_late=True`** acknowledges the message *after* the task completes, combined with idempotent task code, this means a worker crash mid-task safely re-runs.
- **`prefetch_multiplier=1`** prevents one worker from hogging tasks while others sit idle. Default 4 is wrong for non-trivial tasks.
- **`transaction.on_commit(lambda: my_task.delay(obj.id))`**: the most-missed pattern. Dispatching a task before the database transaction commits causes `DoesNotExist` errors when the worker reads the row before commit.
- **Idempotency**: every task should be safe to run twice. Use `update_or_create` / `get_or_create` for ORM writes; use `SET NX EX` (set-if-not-exists) on Redis for distributed locks; check a unique idempotency key on the model before doing work.
- **Queue separation**: route email tasks to `email` queue, image-processing to `image_processing` queue. Run dedicated workers per queue: `celery -A app worker -Q email`. Resource-intensive tasks should not block time-sensitive ones.
- **Redis broker config**: `appendonly yes`, `maxmemory-policy noeviction` for the broker DB. Separate Redis instances for cache and broker (a single shared instance creates cascade failures).
- **Visibility timeout**: Redis broker default is 1 hour; SQS is 30 min. If your task can run longer, set `broker_transport_options = {'visibility_timeout': <seconds>}` to be greater than your longest task.

## Key facts the active guides depend on

- `acks_late` is only safe when the task is idempotent: Celery's default is `acks_early` precisely because most tasks aren't idempotent.
- `time_limit` (hard kill) and `soft_time_limit` (raises `SoftTimeLimitExceeded`) prevent runaway tasks.
- `max_retries` caps the retry chain; `MaxRetriesExceededError` is what falls through when exhausted.
- Flower for live monitoring; Sentry / Rollbar / structured logging for failure tracking.

## Relevance to the Stinger

- **`guides/08-celery-and-jobs.md`**: broker, retry, idempotency, queue separation, beat scheduling.
- **`templates/celery-app.py`**, **`templates/celery-task.py`**: canonical task with `bind=True`, `autoretry_for`, `acks_late`, `on_commit`.
- **`examples/02-celery-task-with-retries-and-idempotency.md`**: full worked example.

## Pull quote

> "Always dispatch Celery tasks inside Django's `transaction.on_commit()` hook when the task depends on a just-created database object — dispatching before commit means the worker may execute before the row exists, causing `DoesNotExist` errors under concurrent load." (softaims.com 2026 production patterns).

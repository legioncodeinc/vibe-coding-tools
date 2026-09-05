"""
config/celery.py — canonical Celery app for Django.

Wire-up:
    1. Add `from .celery import app as celery_app` to config/__init__.py.
    2. Add `__all__ = ("celery_app",)` to config/__init__.py.
    3. Run worker: celery -A config worker -l INFO -Q default,email,image_processing -c 4
    4. Run beat (if scheduled tasks): celery -A config beat -l INFO
    5. Run flower (monitoring): celery -A config flower --port=5555
"""
from __future__ import annotations

import logging
import os

from celery import Celery
from celery.schedules import crontab
from celery.signals import task_failure
from django.conf import settings

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")

app = Celery("myapp")

# Read CELERY_* settings from Django config.
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks.py in every installed app.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

# Hardening (these can also live in settings/base.py via CELERY_*).
app.conf.update(
    task_acks_late=True,
    worker_prefetch_multiplier=1,
    task_reject_on_worker_lost=True,
    task_time_limit=600,
    task_soft_time_limit=540,
    broker_transport_options={"visibility_timeout": 3600},
    broker_connection_retry_on_startup=True,
    worker_max_tasks_per_child=1000,
)

# Queue routing — keep email and image-processing isolated from default.
app.conf.task_routes = {
    "apps.users.tasks.send_email": {"queue": "email"},
    "apps.images.tasks.process_image": {"queue": "image_processing"},
    "apps.orders.tasks.*": {"queue": "default"},
}

# Beat schedule — scheduled tasks.
app.conf.beat_schedule = {
    "expire-pending-orders-every-5min": {
        "task": "apps.orders.tasks.expire_pending_orders",
        "schedule": 300.0,
    },
    "daily-rollup-2am": {
        "task": "apps.reports.tasks.daily_rollup",
        "schedule": crontab(hour=2, minute=0),
    },
}


# Centralized failure logging (forward to Sentry / your observability layer).
@task_failure.connect
def task_failure_handler(sender=None, task_id=None, exception=None, **kwargs):
    logging.getLogger("celery").exception(
        "celery task failed: %s (id=%s)", sender, task_id, exc_info=exception
    )

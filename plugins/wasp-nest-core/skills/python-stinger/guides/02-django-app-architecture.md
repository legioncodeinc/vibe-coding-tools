# 02: Django App Architecture

How a Django project should be organized once it's past hello-world. Encodes the HackSoftware Django Styleguide's services + selectors pattern (`research/2026-05-03-hacksoftware-styleguide.md`) and the canonical settings split.

## Project layout

```
myapp/
  manage.py
  pyproject.toml
  uv.lock
  .python-version
  .env.example                  # documents required env vars
  config/
    __init__.py
    asgi.py                     # ASGI entrypoint (Channels / async Django)
    wsgi.py                     # WSGI entrypoint (sync Django)
    urls.py                     # root URLconf
    settings/
      __init__.py
      base.py                   # everything common
      dev.py                    # local development overrides
      prod.py                   # production overrides
      test.py                   # test-specific overrides (optional)
  apps/
    users/
      __init__.py
      apps.py
      models.py                 # data shape + minimal model methods
      services.py               # business logic — writes
      selectors.py              # business logic — reads
      api.py                    # Django Ninja router (or DRF views in legacy)
      schemas.py                # Pydantic schemas (Ninja Schema / ModelSchema)
      tasks.py                  # Celery tasks for this app
      signals.py                # signal handlers (when justified — see below)
      admin.py
      migrations/
      tests/
        __init__.py
        conftest.py             # app-local fixtures
        factories.py            # factory_boy factories
        test_services.py
        test_selectors.py
        test_api.py
    orders/
    products/
  static/
  templates/                    # admin overrides only, in decoupled-frontend projects
```

`apps/<name>/` (vs. top-level `<name>/`) is a deliberate choice: it keeps domain code in one place, leaves room for top-level non-app modules (`config/`, `cli/`, `migrations/`).

`config/` (vs. `myapp/`) makes the project root readable: you don't have to memorize the project name to know where settings live.

## Settings split

`settings/base.py`, `settings/dev.py`, `settings/prod.py`: selected via `DJANGO_SETTINGS_MODULE`. `manage.py` defaults to `config.settings.dev`.

```python
# config/settings/base.py
import environ

BASE_DIR = Path(__file__).resolve().parent.parent.parent
env = environ.Env()
environ.Env.read_env(BASE_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY")
DEBUG = False  # overridden in dev.py
ALLOWED_HOSTS: list[str] = env.list("DJANGO_ALLOWED_HOSTS", default=[])

INSTALLED_APPS = [
    "daphne",  # must be first if you use Channels
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "apps.users",
    "apps.orders",
    "apps.products",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

DATABASES = {"default": env.db("DATABASE_URL")}
CACHES = {"default": env.cache("REDIS_URL")}
CELERY_BROKER_URL = env("CELERY_BROKER_URL")
ASGI_APPLICATION = "config.asgi.application"
WSGI_APPLICATION = "config.wsgi.application"
ROOT_URLCONF = "config.urls"
```

```python
# config/settings/dev.py
from .base import *  # noqa
DEBUG = True
ALLOWED_HOSTS = ["localhost", "127.0.0.1"]
INSTALLED_APPS += ["django_extensions"]
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]
```

```python
# config/settings/prod.py
from .base import *  # noqa
DEBUG = False
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = 31_536_000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
CORS_ALLOWED_ORIGINS = [env("FRONTEND_ORIGIN")]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [env("FRONTEND_ORIGIN")]
```

Findings:

- **Monolithic `settings.py`** with `if DEBUG:` branches → should-refactor.
- **`SECRET_KEY = "django-insecure-..."`** committed to repo → must-fix.
- **`DEBUG = True` in committed prod settings** → must-fix.
- **`ALLOWED_HOSTS = ["*"]`** → must-fix.

## Services and selectors

Business logic lives in `services.py` (writes) and `selectors.py` (reads). Views become thin orchestrators.

```python
# apps/orders/services.py
from django.db import transaction

from apps.orders.models import Order, OrderItem
from apps.products.selectors import product_get_by_sku
from apps.users.models import User


@transaction.atomic
def order_create(*, user: User, items: list[dict], shipping_address: str) -> Order:
    order = Order.objects.create(user=user, shipping_address=shipping_address, status="pending")
    for item_data in items:
        product = product_get_by_sku(sku=item_data["sku"])
        OrderItem.objects.create(
            order=order, product=product, quantity=item_data["quantity"], unit_price=product.price
        )
    order.recompute_total()
    return order
```

```python
# apps/orders/selectors.py
from django.db.models import QuerySet

from apps.orders.models import Order
from apps.users.models import User


def order_list_for_user(*, user: User) -> QuerySet[Order]:
    return (
        Order.objects.filter(user=user)
        .select_related("shipping_address")
        .prefetch_related("items__product")
        .order_by("-created_at")
    )
```

The view (`api.py` for Ninja) only parses input and calls the service / selector. No business logic in views.

## Signals: when, when-not

**Use signals for:**

- Cross-app side effects with no return value (`post_save` on `User` to provision a profile in another app you don't import directly).
- Cache invalidation.
- Audit logging.

**Don't use signals for:**

- Business logic that should be obvious in the call site (the user creating an order should call `order_create()`, not save the model and hope a signal does the rest).
- Anything that needs error handling, transactions, or testing visibility.

Signal handlers live in `apps/<name>/signals.py` and are wired in `AppConfig.ready()`:

```python
# apps/users/apps.py
from django.apps import AppConfig

class UsersConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.users"

    def ready(self):
        from . import signals  # noqa: F401
```

Findings:

- **Business logic in `post_save` signal** (e.g., charging a payment, sending email with side effects) → must-fix. Move to a service.
- **Signals doing things that fail silently** (no logging, no Sentry) → should-refactor.

## URL layout

```python
# config/urls.py
from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI

from apps.orders.api import router as orders_router
from apps.users.api import router as users_router

api = NinjaAPI()
api.add_router("/users/", users_router)
api.add_router("/orders/", orders_router)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),
]
```

Each app exports a `router` object from `apps/<name>/api.py`. The root `urls.py` mounts them under `/api/`. Versioning (e.g., `/api/v1/`) is added at the root mount point when the contract grows enough to need it.

## Findings the audit produces

- Top-level Django apps polluting the project root → should-refactor (move into `apps/`).
- Monolithic `settings.py` → should-refactor.
- Services and selectors mixed in one file (`services.py` doing reads) → style (separate when the file gets > 200 lines).
- Business logic in views/serializers/signals → must-fix.
- `clean()` method doing cross-model lookups → should-refactor (move to service).
- `INSTALLED_APPS` in alphabetical disorder, mixing third-party and first-party → style.

## Sources

- `research/2026-05-03-hacksoftware-styleguide.md`
- https://github.com/HackSoftware/Django-StyleGuide
- "Two Scoops of Django" (canonical reference; cite chapter when relevant)

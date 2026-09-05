# 17: Django Security Baseline

The non-negotiable settings for production Django. The full security audit hands off to `security-worker-bee`; this guide ensures the floor is in place.

## The non-negotiable list

Every setting below is **must-fix** in `settings/prod.py`:

```python
# config/settings/prod.py
import os
from .base import *  # noqa

# --- Core ---
DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]   # raises if missing — fail fast
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")

# --- HTTPS / TLS ---
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # React reads csrftoken — Django default
SESSION_COOKIE_SAMESITE = "Lax"  # or "None" with SECURE for cross-site
CSRF_COOKIE_SAMESITE = "Lax"

# --- HSTS — only after HTTPS verified working ---
SECURE_HSTS_SECONDS = 31_536_000   # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# --- Headers ---
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

# --- Password hashing — Argon2 first ---
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]

# --- Sessions ---
SESSION_COOKIE_AGE = 60 * 60 * 24 * 14  # 14 days; tighten for sensitive apps
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # True for very sensitive apps
```

## Why each setting

- **`DEBUG = False`**: `DEBUG=True` + an exception leaks settings, env vars, SQL trace, request body. Single biggest security mistake.
- **`SECRET_KEY` from env**: never in code, never in repo. `os.environ["DJANGO_SECRET_KEY"]` raises if unset (fail fast).
- **`ALLOWED_HOSTS` restrictive**: `["*"]` enables Host-header attacks. Always explicit.
- **`SECURE_SSL_REDIRECT`**: redirects HTTP to HTTPS. If a load balancer already does this, set anyway as defense-in-depth.
- **`SECURE_PROXY_SSL_HEADER`**: required when behind a TLS-terminating proxy. Without it, Django thinks every request is HTTP and the SSL redirect creates an infinite loop.
- **`SESSION_COOKIE_SECURE` / `CSRF_COOKIE_SECURE`**: cookies only sent over HTTPS.
- **HSTS**: browser refuses HTTP for the configured duration. **One-way**: once set, removal takes weeks for browser caches to expire. Only enable when HTTPS is verified working everywhere. `SECURE_HSTS_PRELOAD=True` adds you to the browser hard-coded list, irreversible without manual delisting.
- **Argon2**: OWASP-recommended hasher (bcrypt is acceptable; PBKDF2 is fallback). Requires `argon2-cffi` package.
- **`X_FRAME_OPTIONS = "DENY"`**: prevents clickjacking by refusing iframe embedding.

## CI / deploy check

```bash
# Run on every deploy
DJANGO_SETTINGS_MODULE=config.settings.prod python manage.py check --deploy
```

Expected output: zero warnings. Common warnings to investigate:

- `security.W004`: HSTS not set
- `security.W008`: `SECURE_SSL_REDIRECT` not True
- `security.W009`: short / weak `SECRET_KEY`
- `security.W018`: `DEBUG=True`
- `security.W019`: `SECURE_HSTS_INCLUDE_SUBDOMAINS` not set
- `security.W020`: `ALLOWED_HOSTS` set to `["*"]`

## Secrets handling

- **`.env` for local dev**, NEVER committed (`.env` in `.gitignore`).
- **`.env.example`** documents required variables (placeholder values).
- **Production secrets via the deploy platform's secret manager**: environment variables injected at boot. Hand off to `devops-worker-bee` for the deploy-side wiring.
- **`scripts/audit-settings-secrets.py`** in this Stinger scans `settings/` for hardcoded secrets.

## CSRF discipline

- CSRF middleware is on by default. Don't turn it off.
- Per-view exemption (`@csrf_exempt`) is a finding unless documented. Webhooks are the legitimate use case (Stripe, GitHub, etc.), and even there, validate the signature.
- For Ninja: CSRF is enforced on session-authed POSTs by default. Disable per-router only with documented reason.

## ORM injection prevention

The Django ORM is parameterized: `Model.objects.filter(name=user_input)` is safe. The unsafe paths:

- **`Model.objects.filter(**user_dict)`** when keys come from user input, restrict keys to a whitelist:
  ```python
  ALLOWED_FILTERS = {"name", "status", "created_at__gte"}
  filters = {k: v for k, v in user_dict.items() if k in ALLOWED_FILTERS}
  Model.objects.filter(**filters)
  ```
- **`Model.objects.raw("SELECT ... WHERE id = " + user_id)`**, string concatenation. Always parameterize:
  ```python
  Model.objects.raw("SELECT ... WHERE id = %s", [user_id])
  ```
- **`extra(where=[user_input])`**: same risk. Parameterize.

## Webhook signature validation

```python
# apps/payments/api.py
import stripe
from django.http import HttpRequest
from ninja import Router
from ninja.errors import HttpError

router = Router(auth=None, tags=["webhooks"])


@router.post("/stripe", auth=None)
def stripe_webhook(request: HttpRequest):
    sig = request.headers.get("Stripe-Signature")
    try:
        event = stripe.Webhook.construct_event(
            payload=request.body,
            sig_header=sig,
            secret=os.environ["STRIPE_WEBHOOK_SECRET"],
        )
    except (ValueError, stripe.SignatureVerificationError):
        raise HttpError(400, "invalid signature")
    # ... process event
```

## Findings checklist

| Finding | Severity |
|---|---|
| `DEBUG = True` in committed prod settings | must-fix |
| `SECRET_KEY` hardcoded in repo | must-fix |
| `ALLOWED_HOSTS = ["*"]` | must-fix |
| Missing `SECURE_SSL_REDIRECT` in prod | must-fix |
| Missing `SECURE_PROXY_SSL_HEADER` behind a load balancer | must-fix |
| Argon2 not in `PASSWORD_HASHERS` | should-refactor |
| `@csrf_exempt` without justification comment | must-fix |
| Webhook receiver without signature validation | must-fix |
| String concat into raw SQL with user input | must-fix |
| `manage.py check --deploy` not in CI | should-refactor |

## Handoff to security-worker-bee

- OAuth flow review, RBAC correctness, secret-rotation policy, threat modeling, dependency-vulnerability scanning, penetration test prep: all `security-worker-bee`.
- Ensuring the baseline above is in place + `check --deploy` clean: this Bee.

## Sources

- `research/2026-05-03-django-security-baseline.md`
- https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html
- https://docs.djangoproject.com/en/stable/topics/security/
- https://docs.djangoproject.com/en/stable/howto/deployment/checklist/

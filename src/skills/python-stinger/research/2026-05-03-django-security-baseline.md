# 2026-05-03: Django security baseline (SECURE_*, HSTS, Argon2)

## Sources

- https://cheatsheetseries.owasp.org/cheatsheets/Django_Security_Cheat_Sheet.html: OWASP cheat sheet (retrieved 2026-05-03)
- https://docs.djangoproject.com/en/stable/topics/security/: official Django security docs
- https://docs.djangoproject.com/en/stable/howto/deployment/checklist/: official deployment checklist
- https://digitalocean.com/community/tutorials/how-to-harden-your-production-django-project: production hardening walkthrough
- https://compilenrun.com/docs/framework/django/django-security/django-security-settings: settings reference

## Summary

The Django security baseline is **non-negotiable** in prod and should be in `settings/prod.py` from day one:

```python
# settings/prod.py (the non-negotiable baseline)
import os
from .base import *  # noqa

DEBUG = False
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
ALLOWED_HOSTS = os.environ["DJANGO_ALLOWED_HOSTS"].split(",")

# HTTPS / TLS
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True

# HSTS — only after HTTPS is verified working everywhere
SECURE_HSTS_SECONDS = 31_536_000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Headers
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

# Password hashing — Argon2 first
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher",
    "django.contrib.auth.hashers.BCryptSHA256PasswordHasher",
]
```

**`manage.py check --deploy`** runs Django's built-in audit: catches `DEBUG=True` in prod, missing HSTS, weak SECRET_KEY, etc. CI must run it on the prod settings module.

## Key facts the active guides depend on

- **`SECRET_KEY` from env, never in code.** `os.environ["DJANGO_SECRET_KEY"]` (raises if missing, fail fast).
- **`DEBUG = False` is non-negotiable in prod.** With `DEBUG=True` + an exception, Django leaks settings, env vars, the SQL trace, etc.
- **`ALLOWED_HOSTS`** restrictive: `["myapp.com", ".myapp.com"]`, never `["*"]`.
- **HSTS is one-way**: once a browser has the header, it refuses HTTP for the duration. Only enable when confident HTTPS is fully working. `SECURE_HSTS_PRELOAD = True` adds you to the browser hard-coded list, removal takes weeks.
- **`SECURE_PROXY_SSL_HEADER`** required when behind a load balancer / reverse proxy that terminates TLS: without it, Django thinks every request is HTTP.
- **Argon2** requires `pip install argon2-cffi`. It's the OWASP-recommended hasher; PBKDF2 stays in the list as fallback for legacy hashes.
- **CSRF**: enabled by default via `CsrfViewMiddleware`. Turning it off per-view is a finding unless documented.
- **ORM injection**: `Model.objects.filter(**user_input_dict)` is unsafe when keys come from user input, restrict to known-safe keys.

## Relevance to the Stinger

- **`guides/17-django-security-baseline.md`**: the canonical baseline list with rationale per setting.
- **`templates/settings-prod.py`**: the prod settings file with the baseline pre-wired.
- **`scripts/audit-settings-secrets.py`**: scan `settings/` for hardcoded secrets.

## Handoff

The security audit (provider choice, OAuth flow review, RBAC analysis, secret-rotation policy) goes to `security-worker-bee`. python-worker-bee's job is to ensure the baseline above is in place and `check --deploy` is clean.

## Pull quote

> "Django has built-in command `check --deploy` for security checks." (OWASP Django Cheat Sheet, retrieved 2026-05-03)

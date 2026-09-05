# 2026-05-03: Django + React decoupled architecture (CORS + auth)

## Sources

- https://github.com/adamchainz/django-cors-headers: django-cors-headers (canonical CORS for Django)
- https://joshkaramuth.com/blog/django-allauth-react: Django Allauth + React + session auth walkthrough
- https://jeffroche.online/notes/django-next-auth: Django + JWT for SPA architecture decisions
- https://docs.djangoproject.com/en/stable/topics/auth/: Django auth reference

## Summary

The user's apps follow the canonical decoupled-frontend shape: a Django backend exposes JSON via Django Ninja (or FastAPI for non-Django services), a React app consumes it. Three auth patterns dominate:

1. **Session cookies (canonical for first-party apps).** Django session auth + `django-cors-headers` with `CORS_ALLOW_CREDENTIALS = True` and explicit `CORS_ALLOWED_ORIGINS`. React fetches use `credentials: "include"`. CSRF stays on (`CSRF_TRUSTED_ORIGINS` lists the React origins). Simplest, most secure (HttpOnly cookies), least token-management code.
2. **JWT (when sessions don't fit, third-party API consumers, mobile clients, multi-domain).** Access token in memory or short-lived cookie; refresh token in HttpOnly Secure cookie. Refresh flow is the hard part. Hand to `auth-worker-bee` for the provider choice.
3. **External provider** (Clerk, WorkOS, Auth0, Supabase Auth). Provider SDK on the React side issues a token; Django Ninja validates it via a custom `HttpBearer` auth class. Provider choice is `auth-worker-bee` territory.

**CORS configuration (canonical):**

```python
# settings/base.py — common
INSTALLED_APPS = [
    "corsheaders",
    # ...
]
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",       # must be high — before CommonMiddleware
    "django.middleware.common.CommonMiddleware",
    # ...
]

# settings/dev.py
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173"]

# settings/prod.py
CORS_ALLOWED_ORIGINS = [os.environ["FRONTEND_ORIGIN"]]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [os.environ["FRONTEND_ORIGIN"]]
```

**Findings to flag:**

- `CORS_ALLOW_ALL_ORIGINS = True`: must-fix in any non-trivial deploy. Cookies won't be shared anyway.
- Wildcard `CORS_ALLOWED_ORIGINS = ["*"]`: same problem, more explicit.
- `CORS_ALLOW_CREDENTIALS = False` with cookie auth: cookies get stripped silently.
- Missing `CSRF_TRUSTED_ORIGINS` for non-same-origin POSTs: gets 403s.
- Auth-token in `localStorage`: XSS-readable; use HttpOnly cookies or in-memory + refresh token.

## Key facts the active guides depend on

- API-first contract: error envelopes are consistent (`{"error": "...", "code": "...", "details": [...]}`), request-id is propagated (X-Request-ID header), pagination is consistent.
- Server-rendered Django templates are out of scope unless the project is admin-only or a server-rendered legacy. Templates and React-on-the-same-origin are not the canonical pattern.
- The decoupled-architecture audit lives in `guides/15-django-react-decoupled.md`; the React side handoff is `react-worker-bee`'s job.

## Relevance to the Stinger

- **`guides/15-django-react-decoupled.md`**: the canonical decoupled-architecture playbook.
- **`examples/04-django-react-decoupled-cors-and-auth.md`**: full worked end-to-end wiring example.
- **`templates/settings-base.py` / `settings-dev.py` / `settings-prod.py`**: CORS + CSRF pre-wired.

## Pull quote

> "Make sure that you don't use the `CORS_ALLOW_ALL_ORIGINS` option because it will prevent cookies from being shared with your front-end react app. Instead, set all the hosts explicitly in the `CORS_ALLOWED_ORIGINS` list." (Karamuth, django-allauth + React tutorial)

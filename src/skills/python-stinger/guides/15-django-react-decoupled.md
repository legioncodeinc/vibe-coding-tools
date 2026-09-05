# 15: Django + React Decoupled Architecture

API-first contract. Django emits JSON; React consumes it. CORS configured per-environment. Auth is a deliberate decision.

## Hard rules

1. **Django Ninja (or FastAPI when no Django) emits JSON. Django templates are out of scope** unless the project is admin-only or a server-rendered legacy.
2. **`CORS_ALLOWED_ORIGINS` is explicit per-environment.** `CORS_ALLOW_ALL_ORIGINS = True` is a must-fix finding.
3. **`CORS_ALLOW_CREDENTIALS = True`** when using cookie-based auth (sessions). Cookies are not sent cross-origin without it.
4. **`CSRF_TRUSTED_ORIGINS` includes the React origin** for non-same-origin POSTs.
5. **Auth provider choice is `auth-worker-bee`'s call.** This guide covers the Python wiring of session / JWT / external-token patterns.
6. **Error envelope is consistent**: `{"error": "...", "code": "...", "details": {...}}`.
7. **`X-Request-ID` propagates** from the React fetch through Django middleware to logs.

## CORS configuration

```python
# config/settings/base.py
INSTALLED_APPS = ["corsheaders", *INSTALLED_APPS]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",          # MUST be near the top, before CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    *MIDDLEWARE,
]

CORS_ALLOW_CREDENTIALS = True  # for cookie / session auth
CORS_ALLOWED_HEADERS = [
    "accept", "accept-encoding", "authorization", "content-type",
    "dnt", "origin", "user-agent", "x-csrftoken", "x-requested-with",
    "x-request-id",
]
```

```python
# config/settings/dev.py
CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
```

```python
# config/settings/prod.py
CORS_ALLOWED_ORIGINS = [env("FRONTEND_ORIGIN")]            # e.g., https://app.example.com
CSRF_TRUSTED_ORIGINS = [env("FRONTEND_ORIGIN")]
```

## Auth pattern: session cookies (canonical for first-party apps)

```python
# settings additions
SESSION_COOKIE_SAMESITE = "Lax"   # "None" only if cross-site (then SECURE must be True)
SESSION_COOKIE_SECURE = True       # prod only
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_AGE = 60 * 60 * 24 * 14  # 14 days
```

React side:

```ts
// React fetch — must include credentials
const res = await fetch("/api/users/me", {
    credentials: "include",
    headers: { "X-CSRFToken": getCsrfTokenFromCookie() },
});
```

The CSRF token comes from the `csrftoken` cookie (set by Django on any GET that touches a CSRF-protected view). On state-changing requests, the React app reads it and sets `X-CSRFToken`.

## Auth pattern: JWT (when sessions don't fit)

When the app spans domains, includes mobile clients, or third-party API consumers. Hand the **provider choice** to `auth-worker-bee`. The Python wiring:

```python
# apps/auth/api.py
from ninja import Router
from ninja.security import HttpBearer

import jwt as pyjwt  # or your provider SDK


class JWTBearer(HttpBearer):
    def authenticate(self, request, token: str):
        try:
            payload = pyjwt.decode(
                token,
                settings.JWT_PUBLIC_KEY,
                algorithms=["RS256"],
                audience=settings.JWT_AUDIENCE,
            )
        except pyjwt.PyJWTError:
            return None
        user = User.objects.filter(external_id=payload["sub"]).first()
        if user is None:
            return None
        request.user = user
        return user


router = Router(auth=JWTBearer())
```

Refresh-token flow, MFA, RBAC, OAuth callbacks: all `auth-worker-bee` territory.

## Auth pattern: external provider (Clerk / WorkOS / Auth0 / Supabase Auth)

Provider SDK on the React side issues a token; Django Ninja validates via a custom `HttpBearer` that calls the provider's verify endpoint or validates the JWT against the provider's JWKS. Provider choice is `auth-worker-bee`; the wiring is the same shape as the JWT pattern above.

## Error envelope

```python
# config/api.py
from ninja import NinjaAPI
from ninja.errors import ValidationError

api = NinjaAPI()

@api.exception_handler(ValidationError)
def validation_handler(request, exc):
    return api.create_response(
        request,
        {
            "error": "Validation failed",
            "code": "validation_error",
            "details": exc.errors,
        },
        status=422,
    )

@api.exception_handler(Exception)
def fallback_handler(request, exc):
    import logging
    logging.exception("unhandled api error", extra={"request_id": getattr(request, "id", None)})
    return api.create_response(
        request,
        {"error": "Internal server error", "code": "internal_error"},
        status=500,
    )
```

## Request ID propagation

```python
# config/middleware.py
import uuid

class RequestIdMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        response = self.get_response(request)
        response["X-Request-ID"] = request.id
        return response
```

```python
# config/settings/base.py
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "config.middleware.RequestIdMiddleware",  # before security/session
    *MIDDLEWARE,
]
```

Then:

- React generates a UUID per request and sets `X-Request-ID`.
- Django middleware reuses it or generates a new one.
- Structured logging includes `request.id` on every line.
- Sentry / observability tooling correlates by `X-Request-ID`.

## Pagination

Use a consistent paginator across all list endpoints (see `guides/05-django-ninja-api.md`). React's TanStack Query / SWR can then write one helper for paginated reads.

## OpenAPI / Type sharing

Django Ninja emits OpenAPI at `/api/openapi.json`. The React side can:

- Generate TypeScript types via `openapi-typescript` or `orval`.
- Generate a typed client via `openapi-fetch`, `orval`, `tanstack-query-codegen`.

Discuss the React tooling choice with `react-worker-bee`.

## Findings checklist

| Finding | Severity |
|---|---|
| `CORS_ALLOW_ALL_ORIGINS = True` | must-fix |
| `CORS_ALLOWED_ORIGINS = ["*"]` | must-fix |
| `CORS_ALLOW_CREDENTIALS = False` with cookie auth | must-fix |
| Missing `CSRF_TRUSTED_ORIGINS` for cross-origin React | must-fix |
| Auth-token in `localStorage` (visible to XSS) | must-fix (use HttpOnly cookie) |
| Inconsistent error envelopes across endpoints | should-refactor |
| Missing request ID middleware | should-refactor |
| Django templates rendering pages on a route React owns | should-refactor (move to React) |
| `corsheaders` middleware below `CommonMiddleware` | must-fix (CORS won't apply correctly) |

## Handoffs

- **Auth provider choice** → `auth-worker-bee`.
- **React component / state / data-fetching shape** → `react-worker-bee`.
- **Security audit of the auth surface** → `security-worker-bee`.

## Sources

- `research/2026-05-03-django-react-decoupled.md`
- https://github.com/adamchainz/django-cors-headers
- https://joshkaramuth.com/blog/django-allauth-react
- https://jeffroche.online/notes/django-next-auth

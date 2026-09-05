# Example 04: Django + React decoupled architecture (CORS + auth wiring)

End-to-end: Django backend with Ninja API + session auth; React frontend on a separate origin (`http://localhost:5173` in dev, `https://app.example.com` in prod).

## Backend wiring

### `config/settings/base.py` (excerpt)

```python
INSTALLED_APPS = [
    "daphne",
    "django.contrib.admin",
    "django.contrib.auth",
    # ...
    "corsheaders",          # third-party CORS
    "apps.users",
    # ...
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",      # MUST be near the top
    "config.middleware.RequestIdMiddleware",      # see below
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    # ...
]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_HEADERS = [
    "accept", "accept-encoding", "authorization", "content-type",
    "dnt", "origin", "user-agent", "x-csrftoken", "x-requested-with",
    "x-request-id",
]
CORS_EXPOSE_HEADERS = ["x-request-id"]
```

### `config/settings/dev.py`

```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
CSRF_TRUSTED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
SESSION_COOKIE_SECURE = False    # dev only — local HTTP
CSRF_COOKIE_SECURE = False
```

### `config/settings/prod.py`

```python
CORS_ALLOWED_ORIGINS = [env("FRONTEND_ORIGIN")]   # https://app.example.com
CSRF_TRUSTED_ORIGINS = [env("FRONTEND_ORIGIN")]
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SAMESITE = "Lax"   # change to "None" only if cross-site (different parent domains)
```

### `config/middleware.py`

```python
import uuid


class RequestIdMiddleware:
    """Propagate X-Request-ID from React → Django → logs → response."""

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        request.id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        response = self.get_response(request)
        response["X-Request-ID"] = request.id
        return response
```

### `apps/users/api.py`: session-aware endpoints

```python
from ninja import Router, Schema
from ninja.security import django_auth
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from apps.users.schemas import UserOut

router = Router(tags=["users"])


class LoginIn(Schema):
    email: str
    password: str


class CSRFOut(Schema):
    csrf_token: str


# Public endpoints (no auth)
@router.get("/csrf/", auth=None, response=CSRFOut)
def get_csrf(request):
    """First call from the React app — sets the csrftoken cookie + returns the value.

    React reads it from the cookie or this response and includes it as
    X-CSRFToken on subsequent state-changing requests.
    """
    from django.middleware.csrf import get_token
    return {"csrf_token": get_token(request)}


@router.post("/login/", auth=None, response={200: UserOut, 401: dict})
def do_login(request, payload: LoginIn):
    user = authenticate(request, username=payload.email, password=payload.password)
    if user is None:
        return 401, {"error": "Invalid credentials", "code": "invalid_credentials"}
    login(request, user)
    return 200, user


# Authenticated endpoints
@router.post("/logout/", auth=django_auth, response={204: None})
def do_logout(request):
    logout(request)
    return 204, None


@router.get("/me/", auth=django_auth, response=UserOut)
def me(request):
    return request.user
```

### Global error envelope

```python
# config/api.py
from ninja import NinjaAPI
from ninja.errors import ValidationError

api = NinjaAPI()


@api.exception_handler(ValidationError)
def validation_handler(request, exc):
    return api.create_response(
        request,
        {"error": "Validation failed", "code": "validation_error", "details": exc.errors},
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

## React side (sketch, full React work hands off to react-worker-bee)

### Vite environment

```env
# .env.development
VITE_API_URL=http://localhost:8000/api
```

```env
# .env.production
VITE_API_URL=https://api.example.com/api
```

### `src/lib/api.ts`

```ts
const API_URL = import.meta.env.VITE_API_URL;

function getCsrfToken(): string | null {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
}

export async function api(path: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers);
    if (init.method && init.method !== "GET") {
        const csrf = getCsrfToken();
        if (csrf) headers.set("X-CSRFToken", csrf);
    }
    headers.set("X-Request-ID", crypto.randomUUID());

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers,
        credentials: "include",   // include the session cookie
    });
    return response;
}
```

### Bootstrap (acquire CSRF on app load)

```ts
// src/main.tsx
async function bootstrap() {
    await api("/users/csrf/");   // sets the csrftoken cookie
    // ...mount React tree
}
bootstrap();
```

## Common findings this avoids

- ✅ Explicit `CORS_ALLOWED_ORIGINS` per env. No wildcard.
- ✅ `CORS_ALLOW_CREDENTIALS = True` so cookies traverse.
- ✅ `CSRF_TRUSTED_ORIGINS` lists the React origin.
- ✅ React fetch uses `credentials: "include"`.
- ✅ X-CSRFToken header on state-changing requests.
- ✅ Session cookies are HttpOnly + Secure in prod.
- ✅ Auth tokens are NOT in `localStorage` (XSS-readable).
- ✅ Request ID propagates end-to-end for log correlation.
- ✅ Consistent error envelope (`{"error", "code", "details"}`).

## Handoffs

- **Auth provider choice (Clerk / WorkOS / Auth0 / Supabase Auth)**: `auth-worker-bee`.
- **React component / state / data-fetching shape**: `react-worker-bee`.
- **Security audit (XSS surface, RBAC correctness, threat model)**: `security-worker-bee`.

## Source

`research/2026-05-03-django-react-decoupled.md`, `guides/15-django-react-decoupled.md`.

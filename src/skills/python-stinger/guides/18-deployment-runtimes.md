# 18: Deployment Runtimes

Picking the WSGI / ASGI server. Co-owned with `devops-worker-bee` (build, supervisor, autoscaling); the runtime choice itself lives here.

## The matrix

| Service shape | Server | Why |
|---|---|---|
| Sync Django (no async views, no Channels) | **gunicorn** (sync workers) | Battle-tested, simplest |
| Async Django (some `async def` views, no WebSockets) | **gunicorn + uvicorn workers** OR pure **uvicorn** | ASGI-capable; uvicorn is a Rust-fast HTTP/1.1 + HTTP/2 implementation |
| FastAPI | **uvicorn** (or behind gunicorn for prefork) | FastAPI is async-native |
| Channels (WebSockets) | **daphne** | Official Channels-tuned; uvicorn works but loses defaults |
| Mixed Django + Channels | **daphne** for everything (or split, see below) | Daphne handles HTTP and WS in one process |

## Canonical commands

```bash
# 1. Sync Django — gunicorn
gunicorn config.wsgi:application \
  --bind 0.0.0.0:8000 \
  --workers 4 \
  --worker-class sync \
  --max-requests 1000 \
  --max-requests-jitter 100 \
  --timeout 30 \
  --graceful-timeout 30 \
  --access-logfile - \
  --error-logfile -

# 2. Async Django — gunicorn + uvicorn workers
gunicorn config.asgi:application \
  -k uvicorn.workers.UvicornWorker \
  -w 4 \
  --bind 0.0.0.0:8000 \
  --max-requests 1000 \
  --timeout 30

# 3. FastAPI — uvicorn (use --workers in container; prefer one-process-per-container in K8s)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# 4. Channels — daphne
daphne -b 0.0.0.0 -p 8001 config.asgi:application
```

## Worker-count rule of thumb

- **CPU-bound (sync Django mostly)**: `(2 × cores) + 1`.
- **I/O-bound async**: fewer workers, higher concurrency per worker, start with `cores` and tune.
- **`--max-requests 1000 --max-requests-jitter 100`** prevents memory leaks (worker recycles after 1000 requests, jitter prevents thundering herd).

## When to split daphne and gunicorn

If only WebSocket endpoints need ASGI, you can keep gunicorn for HTTP and add daphne for WS:

- Daphne on a separate port (`8001`).
- Nginx routes `/ws/*` to daphne, everything else to gunicorn.
- Only one runtime understands Channels.

This is conservative: if you're confident in async Django + Channels under daphne, run daphne for both.

## Static files

Django doesn't serve static files in production. Either:

- **WhiteNoise** for tiny apps: `whitenoise.middleware.WhiteNoiseMiddleware`, simple, scales to medium.
- **CDN-fronted bucket** (S3 / DigitalOcean Spaces / Cloudflare R2) for production: `STATICFILES_STORAGE = "storages.backends.s3.S3Storage"` etc.
- Hand off the choice to `devops-worker-bee`.

## Health checks

Every service exposes `/health` (or `/healthz`):

```python
# Django Ninja
@api.get("/health", auth=None, tags=["meta"])
def health(request):
    return {"status": "ok"}
```

For richer health: probe DB + Redis with timeouts < 1s, return `{"status": "ok", "db": "ok", "redis": "ok"}` or 503 with details.

## Dockerfile shape (multi-stage with uv)

See `templates/dockerfile-django-uv` for the full file. Sketch:

```dockerfile
# Build stage
FROM python:3.12-slim AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    uv sync --frozen --no-install-project --no-dev
COPY . .
RUN uv sync --frozen --no-dev

# Runtime stage
FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /app /app
ENV PATH="/app/.venv/bin:$PATH"
USER 1000
EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "4"]
```

## Findings checklist

| Finding | Severity |
|---|---|
| `runserver` in production (or in a Dockerfile CMD) | must-fix |
| Async Django on WSGI gunicorn (sync workers) | must-fix |
| FastAPI on gunicorn sync workers | must-fix |
| Channels on uvicorn (without daphne reasoning) | should-refactor |
| Missing `--max-requests` rotation | should-refactor |
| Single worker process for prod (no parallelism) | must-fix |
| No `/health` endpoint | should-refactor |
| Static files served by Django in prod | must-fix |

## Handoff to devops-worker-bee

- Container runtime, autoscaling, ingress, TLS termination, log aggregation.
- Process supervision (systemd / supervisord / Kubernetes).
- Multi-instance scaling.
- Secrets injection.

This guide picks the runtime; devops wires the platform.

## Sources

- https://docs.djangoproject.com/en/stable/howto/deployment/wsgi/
- https://docs.djangoproject.com/en/stable/howto/deployment/asgi/
- https://channels.readthedocs.io/en/stable/deploying.html
- https://www.uvicorn.org/
- https://docs.gunicorn.org/

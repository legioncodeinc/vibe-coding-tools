# 07: Django vs FastAPI

The decision tree.

## TL;DR

- **Need ORM + admin + migrations + auth scaffolding + DB-backed sessions + first-party form handling?** → **Django** with **Django Ninja** for the API layer.
- **Building a focused service with no admin, no DB-backed sessions, async-heavy I/O (LLM proxies, webhook receivers, real-time pipelines), or wrapping a model server?** → **FastAPI**.
- **Tiny script-like service or Flask legacy?** → see `guides/19-flask-when-justified.md`.

## Decision criteria

| Question | If yes → | If no → |
|---|---|---|
| Need a database with relational schema, migrations, admin? | Django | FastAPI |
| Will users log into a UI you also build? | Django | FastAPI (or build the UI elsewhere) |
| Will you ship `python manage.py shell_plus` debugging value? | Django | FastAPI |
| Is most of your time waiting on external HTTP / LLM / DB I/O concurrently? | FastAPI (or async Django) | Either |
| Is the service "wrap a Python function in HTTP" (ML model serving, transform pipeline)? | FastAPI | Django |
| Does the team already know Django? | Django | FastAPI |
| Will you serve admin to staff users? | Django (admin is killer) | FastAPI (build admin elsewhere) |

The question that breaks ties: **Will I want the Django ORM 6 months from now?** If yes, start with Django + Ninja today.

## Common combinations

### Django + Ninja (canonical for full-stack apps)

The user's typical shape. Django for ORM + admin + sessions + migrations; Ninja for the JSON API; React on a separate origin.

### Django + FastAPI side-by-side

When you have a Django monolith and need a focused async service (LLM proxy, real-time pipeline, ML serving). The FastAPI service runs alongside Django, shares the same Postgres if useful, communicates via Celery / Redis pub-sub / direct HTTP calls.

### FastAPI alone

Microservices that don't have a UI and don't need admin. LLM gateways, webhook receivers, event processors.

## Migration considerations

### Django → FastAPI (rare)

Almost always wrong as a wholesale move. The right move is usually: keep Django, extract async-heavy paths to a FastAPI service, leave the rest.

### FastAPI → Django (occasional)

When a FastAPI service has accumulated: a relational DB, a need for admin, a complex auth surface, multiple resource types, server-side jobs. At some point the ergonomic loss of "no Django" outweighs the speed-of-decisions of FastAPI. Migrate by:

1. Stand up Django alongside the FastAPI service, sharing the DB.
2. Move models to Django ORM, generate migrations from existing schema (`python manage.py inspectdb`).
3. Re-implement endpoints in Django Ninja, route by route.
4. Cut over via load balancer / DNS.

## What stays the same

Both stacks share:

- **Pydantic v2** at every boundary.
- **Celery + Redis** for background jobs.
- **httpx** for outbound HTTP.
- **pytest + pytest-asyncio** for tests.
- **uv** for packaging.
- **Ruff + pyright** for quality.

The decision is about the request/response surface and the data layer, not the rest of the stack.

## Sources

- https://www.djangoproject.com/start/overview/
- https://fastapi.tiangolo.com/features/
- `research/2026-05-03-django-ninja-vs-drf.md`

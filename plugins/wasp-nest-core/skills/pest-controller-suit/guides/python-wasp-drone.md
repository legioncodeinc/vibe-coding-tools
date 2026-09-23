# python-wasp-drone

## Domain
This Drone is the Wasp Nest's Python specialist for the canonical stack: Django + Django Ninja + FastAPI + Celery + Channels + pytest + uv + Pydantic v2 + Ruff + pyright + httpx + factory_boy. It owns Django app architecture, ORM access patterns (N+1 prevention via `select_related`/`prefetch_related`), migration mechanics (expand-backfill-contract, never editing applied migrations), the API layer (Ninja over DRF for new code), Celery jobs, Channels realtime, pytest discipline, type adoption, linting/formatting, packaging, and the Django-React decoupled-architecture surface (CORS, auth handoff, API contract).

## Paired Stinger
[python-stinger](../../python-stinger) - routing table, hard rules, severity rubric, and cross-Drone handoffs for Django/FastAPI/Celery/Channels/pytest work.

## Trigger phrases
- "review this Django code"
- "audit our ORM patterns for N+1s"
- "migrate DRF to Django Ninja"
- "set up Celery for this job"
- "enable Channels for websockets"
- "configure pytest with factory_boy"
- "switch this project to Ruff"
- "review the Django + React decoupled API"

## Do NOT route when
- The task is React component shape, state management, or data fetching: route to `react-wasp-drone`; this Drone owns the API surface React consumes.
- The task is Postgres schema indexing, partitioning, or constraint design from a DB-engineering point of view: route to `db-wasp-drone`; this Drone owns Django ORM access patterns and migration mechanics, not schema shape.
- The task is a formal security audit of Django settings, secrets, CSRF, or ORM injection vectors: this Drone ensures the security baseline is in place, `security-wasp-drone` audits it.
- The task is choosing an auth provider, OAuth flow, MFA, or RBAC design: route to `auth-wasp-drone`; this Drone owns the Python-side wiring only.
- The task is Stripe flow design or webhook lifecycle: route to `payments-wasp-drone`; this Drone owns the Python SDK wiring.
- The task is Dockerfile shape, GitHub Actions, or CI pipeline architecture: route to `devops-wasp-drone`.

## Inputs the Drone needs
- `pyproject.toml` (or `requirements*.txt` if uv hasn't landed) to confirm Python version, framework, API layer, and test runner
- Whether the invocation is an architecture review, ORM audit, API migration, Celery/Channels work, pytest setup, or type adoption
- The current settings split (base/dev/prod) and secret-handling approach
- Whether the frontend is decoupled React consuming a JSON API, or Django templates are still in play

## Outputs
- File:line-cited findings classified must-fix / should-refactor / style
- Refactored or new Django Ninja/FastAPI endpoints with Pydantic schemas at the boundary
- Celery task patterns with retries, idempotency, and `acks_late` configured
- An audit report in `library/requirements/reports/python/` or a feature-tied report, or an ADR for a stack decision

## Commonly sequenced with
- `db-wasp-drone` before: schema/index design that this Drone's ORM patterns build against
- `security-wasp-drone` after: audit of the Django security baseline this Drone ensures is present
- `quality-wasp-drone` after: the pytest suite this Drone designs becomes audit evidence

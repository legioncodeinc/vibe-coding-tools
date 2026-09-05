# 2026-05-03: Django async views, ASGI, sync_to_async patterns

## Sources

- https://docs.djangoproject.com/en/stable/topics/async/: official async support docs (retrieved 2026-05-03)
- https://docs.djangoproject.com/en/stable/howto/deployment/asgi/: ASGI deployment (retrieved 2026-05-03)
- https://fly.io/blog/running-tasks-concurrently-in-django-asynchronous-views/: practical concurrent-tasks-in-views walkthrough (Django Beats)
- https://www.pybex.io/blog/mastering-async-django-complete-guide/: async views, parallel queries, ASGI deploy

## Summary

Django supports async views from 3.1, async ORM (`aget`, `acreate`, `aiter`) from 4.1, async streaming responses + psycopg3 async from 4.2. Async only buys you wins under ASGI. Under WSGI, Django runs async views in a one-off event loop with measurable per-request penalty.

The canonical bridge for sync ORM operations from an async view is `asgiref.sync.sync_to_async()`: either decorating a sync helper or wrapping the call. `thread_sensitive=True` (the default) keeps all sync code in the same thread for safety with the ORM connection pool. Multiple parallel I/O operations in one view: use `asyncio.gather()` or Python 3.11+ `asyncio.TaskGroup()`.

## Key facts the active guides depend on

- Async wins only when the view is I/O-bound (external HTTP, parallel slow queries) and you deploy on ASGI (`gunicorn -k uvicorn.workers.UvicornWorker` or daphne).
- The ORM exposes `acreate()`, `aget()`, etc. but the underlying database driver is still sync: these are convenience wrappers that internally call `sync_to_async`. Real async DB I/O requires psycopg3 + raw SQL today.
- Mixing sync middleware between an ASGI server and an async view incurs a context-switch penalty (~1ms per request, plus a held sync thread for exception propagation).
- `async_to_sync` for the inverse direction (calling async from sync) is part of `asgiref.sync`: used when sync Django code needs to call a coroutine.

## Relevance to the Stinger

- **`guides/16-django-async.md`**: when to use, when not to.
- **`guides/18-deployment-runtimes.md`**: gunicorn (sync), uvicorn (async Django, FastAPI), daphne (Channels).
- **`examples/05-async-django-view-with-sync-to-async.md`**: a concrete view bridging to sync ORM.

## Pull quote

> "If you put synchronous middleware between an ASGI server and an asynchronous view, it will have to switch into sync mode for the middleware and then back to async mode for the view... This may not be noticeable at first, but adding this penalty of one thread per request can remove any async performance advantage." (Django docs, async support page, 2026-05-03 retrieval)

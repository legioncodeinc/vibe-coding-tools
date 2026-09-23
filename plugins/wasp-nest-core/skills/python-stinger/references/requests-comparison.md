# `requests`: preserved alternative

> Demoted in favor of **httpx** (see `guides/01-stack-enforcement.md` + httpx-related notes). `requests` is acceptable in legacy code; new outbound HTTP should use httpx.

## Why httpx replaced `requests`

- **Sync + async with one API.** `requests` is sync-only; you'd reach for `aiohttp` for async, learning a second client. httpx supports both with the same surface area.
- **HTTP/2.** `requests` is HTTP/1.1-only. httpx supports HTTP/2 via `http2=True`.
- **Connection pooling.** httpx's `Client` / `AsyncClient` are explicit pool managers; `requests.Session` is the equivalent but less ergonomic to inject.
- **Ecosystem health.** `requests` is in maintenance mode: the [maintainer's note](https://github.com/psf/requests) describes it as "feature-complete". httpx is actively developed by the same broader ecosystem (Encode).
- **Mocking.** `respx` for httpx is comparable to `requests-mock` but works for both sync and async.

## When `requests` is still acceptable

- **Existing `requests` calls in legacy code**: no rush. Migrate when you touch the file.
- **One-off scripts** with no async needs and no HTTP/2 concerns: `requests` is fine.
- **Specific `requests` plugin** doing real work (rare).

## Legacy-code recognition

```python
# requests — what you'll see
import requests

response = requests.get("https://api.example.com/things", timeout=10)
response.raise_for_status()
data = response.json()

# Or with a Session for connection pooling
session = requests.Session()
session.headers["Authorization"] = f"Bearer {token}"
response = session.get("https://api.example.com/things")
```

The presence of `requests` in `pyproject.toml` is a should-refactor finding (when found alongside async code paths, it's a must-fix because `requests` blocks the event loop).

## Migration map

| `requests` | httpx (sync) | httpx (async) |
|---|---|---|
| `requests.get(url)` | `httpx.get(url)` | `await client.get(url)` |
| `requests.Session()` | `httpx.Client()` | `httpx.AsyncClient()` |
| `session.headers["X"] = "y"` | `client.headers["X"] = "y"` | same |
| `response.raise_for_status()` | same | same |
| `response.json()` | same | same |
| `response.iter_content()` | `response.iter_bytes()` | `response.aiter_bytes()` |
| `requests.exceptions.Timeout` | `httpx.TimeoutException` | same |
| `requests.exceptions.ConnectionError` | `httpx.ConnectError` | same |
| `requests.exceptions.HTTPError` | `httpx.HTTPStatusError` | same |
| `verify=False` (skip TLS) | same | same |
| `auth=(u, p)` | `auth=httpx.BasicAuth(u, p)` | same |
| `timeout=10` | `timeout=10.0` (or `httpx.Timeout(...)` for fine control) | same |

## Async migration (the real win)

```python
# Before — requests in a function that should be async
def fetch_things() -> list[dict]:
    things = []
    for url in urls:
        r = requests.get(url, timeout=10)
        r.raise_for_status()
        things.append(r.json())
    return things


# After — httpx async with parallel fetches
import asyncio
import httpx


async def fetch_things() -> list[dict]:
    async with httpx.AsyncClient(timeout=httpx.Timeout(10.0, connect=5.0)) as client:
        async with asyncio.TaskGroup() as tg:
            tasks = [tg.create_task(client.get(url)) for url in urls]

    things = []
    for task in tasks:
        r = task.result()
        r.raise_for_status()
        things.append(r.json())
    return things
```

The async version is the entire point: `requests` makes parallel requests an ordeal; httpx makes them natural.

## Findings checklist

| Finding | Severity |
|---|---|
| `requests.get(...)` inside `async def` | must-fix (blocks event loop) |
| `requests` in new code when httpx is in `pyproject.toml` | should-refactor |
| `requests.get(...)` without `timeout=` | must-fix (will hang under network issues) |
| Top-level `requests.get(...)` (no Session) for repeated calls | should-refactor (no connection pool) |

## Sources

- https://www.python-httpx.org/
- https://requests.readthedocs.io/
- `research/2026-05-03-httpx-async-production.md`

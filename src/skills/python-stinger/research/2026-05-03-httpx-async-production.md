# 2026-05-03: httpx async client production patterns

## Sources

- https://www.python-httpx.org/: httpx official docs
- https://www.python-httpx.org/async/: async support
- https://www.python-httpx.org/advanced/clients/: Client + AsyncClient lifecycle
- https://www.python-httpx.org/advanced/timeouts/: timeout config

## Summary

**httpx is canonical** for outbound HTTP. Sync and async with one API, HTTP/2 support, requests-like ergonomics. Replaces `requests` (sync-only, no HTTP/2), `aiohttp` (async-only, separate API), and direct `urllib3` use.

**Production patterns:**

- **Use `httpx.Client` / `httpx.AsyncClient` instances**, not the top-level `httpx.get()`. The top-level functions create a new connection per call: fine for one-off scripts, terrible under load.
- **Reuse a single client**: connection pooling matters. For Django: a module-level `httpx.Client(timeout=httpx.Timeout(10.0, connect=5.0))` is fine. For FastAPI: a lifespan-managed `AsyncClient` injected via dependency.
- **Set a timeout, always.** Default is 5s of network inactivity (`TimeoutException`). Production calls should set explicit `timeout=httpx.Timeout(connect=5.0, read=10.0, write=10.0, pool=5.0)`. Disabled timeouts (`timeout=None`) are a finding.
- **Transport-level retries** via `httpx.HTTPTransport(retries=N)` for connection errors only (NOT response errors). Application-level retries (e.g., on 5xx) belong in the call site with explicit backoff.
- **`async with httpx.AsyncClient() as client:`** is the canonical async lifecycle. Long-lived clients in FastAPI: store on `app.state.http_client` in `lifespan` event.
- **Don't instantiate AsyncClient inside a hot loop**: defeats connection pooling. Pass the client through.

## Key facts the active guides depend on

- Four timeout types: `connect`, `read`, `write`, `pool`. Each can be tuned independently via `httpx.Timeout(...)`.
- HTTP/2 is opt-in: `httpx.AsyncClient(http2=True)` (requires `httpx[http2]` install).
- Mocking: `respx` is the httpx equivalent of `requests-mock` for tests; `pytest-httpx` is also available.
- Retries via `httpx.AsyncHTTPTransport(retries=1)` only retry connection-establishment failures, not application errors.

## Relevance to the Stinger

- **`guides/01-stack-enforcement.md`**: httpx as a Hard Rule for outbound HTTP.
- **`references/requests-comparison.md`**: `requests` as preserved alternative; legacy-recognition.

## Pull quote

> "In order to get the most benefit from connection pooling, make sure you're not instantiating multiple client instances - for example by using `async with` inside a 'hot loop'. This can be achieved either by having a single scoped client that's passed throughout wherever it's needed, or by having a single global client instance." (httpx async docs)

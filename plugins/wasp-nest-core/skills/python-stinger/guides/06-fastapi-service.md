# 06: FastAPI Service

When there's no Django (a microservice, a tiny tool, an LLM proxy, a webhook receiver), FastAPI is canonical. This guide covers the canonical FastAPI service shape.

## When to choose FastAPI vs Django

See `guides/07-django-vs-fastapi.md` for the decision tree. Short version: FastAPI when you don't need ORM + admin + migrations + auth scaffolding. Django when you do.

## Hard rules

1. **APIRouter per resource family.** Don't put every route on the main `app`.
2. **Dependency injection via `Depends(...)`**: DB session, current user, settings, HTTP client are all DI dependencies.
3. **Pydantic v2 schemas at every boundary**: request body, response model, query params for non-trivial filters.
4. **Lifespan events** for startup / shutdown (HTTP client, DB pool, model loading).
5. **Async-native.** Don't fight FastAPI with sync handlers: if you have sync code, run it in a threadpool with `fastapi.concurrency.run_in_threadpool` or `anyio.to_thread.run_sync`.

## Canonical service skeleton

```python
# app/main.py
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI

from app.api.orders import router as orders_router
from app.api.users import router as users_router
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(connect=5.0, read=10.0, write=10.0, pool=5.0),
    )
    yield
    # Shutdown
    await app.state.http_client.aclose()


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    lifespan=lifespan,
    openapi_url="/api/openapi.json" if settings.debug else None,
)

app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(orders_router, prefix="/api/orders", tags=["orders"])


@app.get("/health", tags=["meta"])
async def health():
    return {"status": "ok"}
```

## Router with dependencies

```python
# app/api/orders.py
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.deps import current_user, db_session
from app.schemas.orders import OrderCreateIn, OrderOut
from app.services import orders as services

router = APIRouter()


@router.post("/", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(
    payload: OrderCreateIn,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(db_session)],
):
    try:
        return await services.order_create(db=db, user=user, **payload.model_dump())
    except services.OrderValidationError as exc:
        raise HTTPException(status_code=400, detail={"error": str(exc), "code": "order_invalid"})


@router.get("/{order_id}/", response_model=OrderOut)
async def get_order(
    order_id: int,
    user: Annotated[User, Depends(current_user)],
    db: Annotated[AsyncSession, Depends(db_session)],
):
    order = await services.order_get(db=db, order_id=order_id, user=user)
    if order is None:
        raise HTTPException(status_code=404)
    return order
```

## Dependency definitions

```python
# app/core/deps.py
from typing import Annotated, AsyncIterator

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.db import async_session_maker
from app.models.users import User


async def db_session() -> AsyncIterator[AsyncSession]:
    async with async_session_maker() as session:
        yield session


async def current_user(
    authorization: Annotated[str | None, Header()] = None,
    db: AsyncSession = Depends(db_session),
) -> User:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401)
    token = authorization.removeprefix("Bearer ")
    user = await services.users.user_get_by_token(db=db, token=token)
    if user is None:
        raise HTTPException(status_code=401)
    return user
```

## Settings via Pydantic

```python
# app/core/config.py
from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "myapp"
    version: str = "0.1.0"
    debug: bool = False
    database_url: str = Field(...)
    redis_url: str = Field(...)
    secret_key: str = Field(...)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
```

## Error envelope

```python
# app/main.py — global exception handler for the consistent envelope
from fastapi import Request
from fastapi.responses import JSONResponse


@app.exception_handler(ValueError)
async def value_error_handler(request: Request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"error": str(exc), "code": "value_error"},
    )
```

## Findings checklist

| Finding | Severity |
|---|---|
| Sync def handlers when the route I/O is async | must-fix |
| Module-level `engine = create_async_engine(...)` outside lifespan | should-refactor |
| Top-level `httpx.AsyncClient()` without lifespan management | must-fix (leaks connections) |
| Missing `response_model=...` (or explicit `None`) | must-fix |
| `Depends()` for trivial values that should be parameters | style |
| Hardcoded settings (database URL, secret) instead of `BaseSettings` | must-fix |

## Sources

- https://fastapi.tiangolo.com/
- https://fastapi.tiangolo.com/advanced/events/: lifespan events
- https://www.python-httpx.org/async/: AsyncClient lifecycle
- `research/2026-05-03-httpx-async-production.md`

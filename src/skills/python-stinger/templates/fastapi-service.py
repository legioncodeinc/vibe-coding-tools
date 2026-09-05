"""
Canonical FastAPI service skeleton with dependency injection and lifespan.

Run with: uvicorn app.main:app --host 0.0.0.0 --port 8000
"""
from __future__ import annotations

from contextlib import asynccontextmanager
from typing import Annotated, AsyncIterator

import httpx
from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


# ---- Settings ----


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "myapp"
    version: str = "0.1.0"
    debug: bool = False
    secret_key: str = Field(...)
    upstream_url: str = Field(...)


settings = Settings()


# ---- Lifespan (startup / shutdown) ----


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(connect=5.0, read=10.0, write=10.0, pool=5.0),
    )
    yield
    await app.state.http_client.aclose()


app = FastAPI(
    title=settings.app_name,
    version=settings.version,
    lifespan=lifespan,
    openapi_url="/api/openapi.json" if settings.debug else None,
)


# ---- Dependencies ----


async def http_client(request) -> httpx.AsyncClient:
    return request.app.state.http_client


async def current_user_id(
    authorization: Annotated[str | None, Header()] = None,
) -> int:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    token = authorization.removeprefix("Bearer ")
    user_id = _verify_token(token)
    if user_id is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    return user_id


def _verify_token(token: str) -> int | None:
    # Replace with your actual auth check (JWT verification, DB lookup, etc.)
    return 1 if token == "demo" else None


# ---- Schemas ----


class HealthOut(BaseModel):
    status: str
    upstream: str


class EchoIn(BaseModel):
    message: str = Field(min_length=1, max_length=4000)


class EchoOut(BaseModel):
    message: str
    user_id: int


# ---- Routes ----


@app.get("/health", response_model=HealthOut, tags=["meta"])
async def health(client: Annotated[httpx.AsyncClient, Depends(http_client)]) -> HealthOut:
    try:
        resp = await client.get(f"{settings.upstream_url}/health", timeout=2.0)
        upstream = "ok" if resp.status_code == 200 else "degraded"
    except httpx.HTTPError:
        upstream = "unknown"
    return HealthOut(status="ok", upstream=upstream)


@app.post("/echo", response_model=EchoOut, tags=["demo"])
async def echo(
    payload: EchoIn,
    user_id: Annotated[int, Depends(current_user_id)],
) -> EchoOut:
    return EchoOut(message=payload.message, user_id=user_id)


# ---- Error handler — consistent envelope ----


@app.exception_handler(ValueError)
async def value_error_handler(request, exc: ValueError):
    return JSONResponse(
        status_code=400,
        content={"error": str(exc), "code": "value_error"},
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": str(exc.detail) if exc.detail else "http_error",
            "code": f"http_{exc.status_code}",
        },
    )

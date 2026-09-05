# 21: Data and ML Wrappers

Patterns when Python is the analytical / ML runtime. The cognitive layer (coaches, RAG, evals, vector DBs) hands off to `mind-worker-bee`; the Python implementation patterns underneath stay here.

## Where the boundary is

| Concern | Owner |
|---|---|
| Coach architecture, prompt cascade, RAG strategy, evals, vector DB choice, embedding model choice | **`mind-worker-bee`** |
| Django service hosting the cognitive code, Celery task dispatching LLM calls, FastAPI endpoint exposing AI features, Pydantic schemas at the AI boundary, httpx clients to LLM providers | **this Stinger** |
| pandas / numpy data transformation, ML model serving via FastAPI, batch vs streaming pipelines | **this Stinger** |

## Pandas in Django

```python
# apps/reports/services.py
from io import StringIO

import pandas as pd
from django.db import connection

from apps.reports.models import Report


def report_generate_csv(*, period_start, period_end) -> str:
    # 1. Pull from Django ORM into a DataFrame
    qs = Order.objects.filter(created_at__gte=period_start, created_at__lt=period_end).values(
        "id", "user__email", "total", "status", "created_at"
    )
    df = pd.DataFrame.from_records(qs)

    # 2. Transform
    df["created_at"] = pd.to_datetime(df["created_at"]).dt.tz_convert("UTC")
    df["total"] = df["total"].astype(float)

    # 3. Emit
    buf = StringIO()
    df.to_csv(buf, index=False)
    return buf.getvalue()
```

For large data sets (> 100K rows), avoid `Model.objects.all()` → DataFrame: it pulls everything into memory. Use:

- `pd.read_sql(query, connection)` with parameterized SQL for raw access.
- Chunked iteration via `qs.iterator(chunk_size=1000)`.

## Streaming responses for large exports

```python
from django.http import StreamingHttpResponse

@router.get("/orders.csv")
def orders_csv(request):
    def generate():
        yield "id,email,total,status\n"
        for order in Order.objects.iterator(chunk_size=1000):
            yield f"{order.id},{order.user.email},{order.total},{order.status}\n"

    return StreamingHttpResponse(generate(), content_type="text/csv")
```

Combine with `select_related` / `prefetch_related` to avoid N+1 in the iterator.

## Model serving via FastAPI

When you have a trained model and want to serve it:

```python
# app/main.py
from contextlib import asynccontextmanager

import torch
from fastapi import FastAPI
from pydantic import BaseModel


class PredictIn(BaseModel):
    features: list[float]


class PredictOut(BaseModel):
    label: int
    probability: float


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.model = torch.load("model.pt", map_location="cpu")
    app.state.model.eval()
    yield
    # No teardown needed for the model


app = FastAPI(lifespan=lifespan)


@app.post("/predict", response_model=PredictOut)
async def predict(payload: PredictIn) -> PredictOut:
    import asyncio
    # CPU-bound torch.no_grad() inference — run in threadpool to not block event loop
    return await asyncio.to_thread(_run_inference, app.state.model, payload.features)


def _run_inference(model, features: list[float]) -> PredictOut:
    with torch.no_grad():
        x = torch.tensor([features], dtype=torch.float32)
        logits = model(x)
        probs = torch.softmax(logits, dim=1)
        label = int(probs.argmax().item())
        return PredictOut(label=label, probability=float(probs[0, label]))
```

For GPU serving, batch requests, or heavy-traffic scenarios, consider Triton, vLLM, or Ray Serve: that's an ML-platform decision, surface it to `mind-worker-bee`.

## Batch vs streaming pipelines

| Shape | Pattern |
|---|---|
| Hourly batch over yesterday's data | Celery Beat task → Celery worker → write results to DB / S3 |
| Real-time event stream | Channels consumer or FastAPI `EventSource` route → `asyncio.Queue` fan-out |
| Long-running compute (> 60s) | Celery task with progress updates via `task.update_state()` or pubsub |
| User-triggered async report | Django Ninja endpoint dispatches Celery task → returns task ID → frontend polls / subscribes |

## LLM calls: the boundary

The Python wiring of an LLM call (the `mind-worker-bee` defines the cognitive design):

```python
# apps/coach/services.py
import httpx
from pydantic import BaseModel

LLM_GATEWAY_URL = os.environ["LLM_GATEWAY_URL"]


class ChatTurn(BaseModel):
    role: str  # user / assistant / system
    content: str


class ChatRequest(BaseModel):
    model: str
    messages: list[ChatTurn]
    temperature: float = 0.7


class ChatResponse(BaseModel):
    content: str
    model: str
    tokens_in: int
    tokens_out: int


async def chat(*, client: httpx.AsyncClient, request: ChatRequest) -> ChatResponse:
    response = await client.post(
        LLM_GATEWAY_URL,
        json=request.model_dump(),
        timeout=httpx.Timeout(connect=5.0, read=30.0),
    )
    response.raise_for_status()
    return ChatResponse.model_validate(response.json())
```

Every LLM call is:

- Pydantic-typed at request and response boundaries.
- Behind a configurable gateway URL (the `mind-worker-bee` picks the gateway).
- Timed out: LLM calls can hang for a minute or more.
- Logged with token counts for cost / observability (handoff to `mind-worker-bee` for the AI-trace shape).

## Findings checklist

| Finding | Severity |
|---|---|
| Pandas / numpy operation on a queryset that returns > 100K rows without chunking | should-refactor |
| ML model loaded at import time (not in lifespan) | must-fix |
| LLM call without a timeout | must-fix |
| LLM request / response not Pydantic-validated | must-fix (untyped boundary) |
| Synchronous `torch` / heavy compute in async def without threadpool | must-fix |
| Batch pipeline with no checkpoint / restart capability | should-refactor |

## Handoff to mind-worker-bee

- Coach design, prompt cascade, RAG strategy, vector DB / payload schema, embedding model, eval rubric, three-tier memory, multimodal pipeline.
- This Stinger owns the Python plumbing under those designs.

## Sources

- https://pandas.pydata.org/docs/
- https://fastapi.tiangolo.com/advanced/events/: lifespan for model loading
- https://docs.djangoproject.com/en/stable/ref/models/querysets/#iterator

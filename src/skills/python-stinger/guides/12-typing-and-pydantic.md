# 12: Typing and Pydantic

The discipline: pyright basic minimum, strict on new code, Pydantic v2 at every boundary.

## Hard rules

1. **`pyrightconfig.json` at the repo root** with `typeCheckingMode: "basic"` as the default.
2. **New files default to `# pyright: strict`** at the top, or live under a `strict_paths` block in config.
3. **Pydantic v2 at every boundary**: HTTP request/response, Celery task arg, webhook payload, third-party API response, file upload.
4. **`TYPE_CHECKING`** for import-only-for-types (avoids runtime import cost / circular imports).
5. **No `Any` at API boundaries.** Internal `Any` for genuine unknowns is acceptable; external boundary `Any` is a finding.
6. **`from __future__ import annotations`** at the top of every Python file (PEP 563-style postponed evaluation).

## pyrightconfig.json

```json
{
  "venvPath": ".",
  "venv": ".venv",
  "pythonVersion": "3.12",
  "include": ["apps", "config", "scripts"],
  "exclude": [
    "**/migrations",
    "**/__pycache__",
    "**/.venv",
    "**/node_modules"
  ],
  "typeCheckingMode": "basic",
  "strict": [],
  "reportMissingImports": "warning",
  "reportMissingModuleSource": "none",
  "reportAttributeAccessIssue": "none",
  "reportOptionalMemberAccess": "none",
  "reportIncompatibleMethodOverride": "none",
  "reportArgumentType": "warning",
  "reportReturnType": "warning",
  "reportAssignmentType": "warning",
  "reportGeneralTypeIssues": "warning",
  "reportFunctionMemberAccess": "none"
}
```

The suppressions (`reportAttributeAccessIssue`, `reportOptionalMemberAccess`, etc.) target Django's dynamic metaclass machinery: Manager.objects access, signal.send(), DRF view method overrides, `null=True` field types. New code in the `strict` array is held to a higher bar.

To progressively ratchet new code:

```json
"strict": [
  "apps/orders/services.py",
  "apps/orders/selectors.py",
  "apps/orders/schemas.py"
]
```

Or via comment at the top of a file:

```python
# pyright: strict
from __future__ import annotations
...
```

## Pydantic v2 patterns

### At HTTP boundaries (carried by Ninja / FastAPI for free)

```python
from ninja import Schema  # Pydantic BaseModel subclass
from pydantic import Field, EmailStr


class UserCreateIn(Schema):
    email: EmailStr
    name: str = Field(min_length=1, max_length=120)
    age: int = Field(ge=0, lt=150)
```

### At webhook boundaries

```python
from pydantic import BaseModel, ValidationError, Field

class StripeChargeWebhookIn(BaseModel):
    id: str
    type: str
    data: dict  # narrow further with discriminated union if needed
    livemode: bool

@router.post("/webhooks/stripe")
def stripe_webhook(request, payload: StripeChargeWebhookIn):
    # payload is validated; `request.body` was raw bytes, now it's typed
    ...
```

### At Celery task boundaries

```python
from pydantic import BaseModel
from celery import shared_task


class FulfillOrderArgs(BaseModel):
    order_id: int
    notify: bool = True


@shared_task
def fulfill_order(payload: dict) -> None:
    args = FulfillOrderArgs.model_validate(payload)  # validate at the boundary
    _fulfill_order_inner(order_id=args.order_id, notify=args.notify)
```

Tasks are dispatched as `fulfill_order.delay({"order_id": 42, "notify": True})`. The dict is JSON-serialized through Celery; the task validates with Pydantic at the entry.

### Generic / discriminated unions

```python
from typing import Annotated, Literal
from pydantic import BaseModel, Field

class CreatedEvent(BaseModel):
    type: Literal["created"]
    id: int

class UpdatedEvent(BaseModel):
    type: Literal["updated"]
    id: int
    changed_fields: list[str]

Event = Annotated[CreatedEvent | UpdatedEvent, Field(discriminator="type")]

class EventEnvelope(BaseModel):
    event: Event
    timestamp: datetime
```

## TYPE_CHECKING discipline

```python
from __future__ import annotations
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from apps.orders.models import Order  # imported for types only


def fulfill(order: Order) -> None:  # works at type-check time, no runtime import
    ...
```

Use `TYPE_CHECKING` for:

- Heavy imports used only in type signatures.
- Circular import resolution.

## Generics

```python
from typing import TypeVar, Generic

T = TypeVar("T")

class Page(Generic[T], BaseModel):
    items: list[T]
    total: int
    next_cursor: str | None = None
```

## Common findings

| Finding | Severity |
|---|---|
| API endpoint accepting `dict` / `Any` instead of Pydantic schema | must-fix |
| Webhook handler parsing JSON manually then passing dict around | must-fix |
| `# type: ignore` with no comment explaining why | must-fix |
| `cast(X, value)` from external data without validation | must-fix |
| `Optional[T]` (instead of `T \| None` in modern code) | style |
| Missing return type annotation on public function | should-refactor |
| `def fn(x):` (untyped parameter on public function) | should-refactor |
| `# pyright: ignore` on a whole file | must-fix (find a narrower suppression) |

## Sources

- `research/2026-05-03-pyright-vs-mypy.md`
- `research/2026-05-03-pydantic-v2-ninja-schemas.md`
- https://microsoft.github.io/pyright/
- https://docs.pydantic.dev/latest/
- https://djangocfg.com/docs/guides/module-design/type-checking/

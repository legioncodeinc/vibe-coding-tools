# 19: Flask When Justified

Flask is not in the canonical stack: Django (full-stack) and FastAPI (focused services) cover the space. But Flask is acceptable in narrow circumstances.

## When Flask is the right pick

- **Existing Flask codebase**: don't rewrite for taste. Add Pydantic / Ruff / pyright on top of Flask.
- **Tiny services** with no async I/O, no ORM, no admin needs (a single-endpoint webhook handler, a status checker).
- **Specific dependency** that's Flask-only and replacement isn't worth the cost (rare in 2026, most Flask-only ecosystems have FastAPI equivalents).
- **Library / SDK testing harness**: Flask's minimal surface is good for a test fixture HTTP server.

## When Flask is wrong

- **New service that will grow** → use FastAPI. Flask's async story (`Quart`) is a separate project; Flask's sync model is the only first-party path.
- **Anything resembling a full-stack app** → Django.
- **Anything with WebSockets** → Channels (with Django) or FastAPI WebSockets.

## Flask patterns we still apply

Even when Flask is the framework, the rest of the canonical stack still applies:

- **Pydantic v2 at boundaries.** Flask doesn't carry it for free, but `apispec` + `flask-pydantic` or hand-rolled validation works.
- **uv for packaging.**
- **Ruff + pyright** for quality.
- **httpx** for outbound HTTP.
- **Celery** for background jobs.
- **pytest + factory_boy** for tests (factory_boy is framework-agnostic).

## Canonical Flask service skeleton

```python
# app/main.py
from flask import Flask, jsonify, request
from pydantic import BaseModel, ValidationError

from app.services import some_service


class CreateThingIn(BaseModel):
    name: str
    qty: int


def create_app() -> Flask:
    app = Flask(__name__)

    @app.errorhandler(ValidationError)
    def on_validation(exc):
        return jsonify({"error": "validation_error", "details": exc.errors()}), 422

    @app.errorhandler(Exception)
    def on_unhandled(exc):
        app.logger.exception("unhandled")
        return jsonify({"error": "internal_error"}), 500

    @app.get("/health")
    def health():
        return {"status": "ok"}

    @app.post("/things")
    def create_thing():
        try:
            payload = CreateThingIn.model_validate(request.get_json())
        except ValidationError as e:
            raise
        thing = some_service.create_thing(name=payload.name, qty=payload.qty)
        return jsonify(thing.dict()), 201

    return app


app = create_app()
```

## Flask blueprints (the `apps/` equivalent)

```python
# app/blueprints/orders.py
from flask import Blueprint, jsonify, request

bp = Blueprint("orders", __name__, url_prefix="/orders")


@bp.get("/")
def list_orders():
    ...


@bp.post("/")
def create_order():
    ...
```

```python
# app/main.py
from app.blueprints.orders import bp as orders_bp
app.register_blueprint(orders_bp)
```

## Production deployment

```bash
gunicorn 'app.main:app' --bind 0.0.0.0:8000 --workers 4 --worker-class sync
```

WSGI only: Flask is not ASGI. If you need async, that's the signal to migrate to FastAPI.

## Findings checklist

| Finding | Severity |
|---|---|
| New Flask service when FastAPI fits | should-refactor (use FastAPI) |
| Flask `app.run()` in production | must-fix (use gunicorn) |
| No request validation (raw `request.get_json()` passed around) | must-fix (Pydantic at boundary) |
| `flask.g` used to store mutable state | should-refactor |
| Mixing sync Flask with `asyncio.run(...)` in handlers | must-fix |

## Sources

- https://flask.palletsprojects.com/
- https://flask-pydantic.readthedocs.io/

# 2026-05-03: Pydantic v2 + Django Ninja schema patterns

## Sources

- https://docs.pydantic.dev/latest/: Pydantic v2 docs
- https://django-ninja.dev/guides/response/: Ninja response guide
- https://django-ninja.dev/guides/response/config-pydantic: `model_config` overrides
- https://django-ninja.dev/guides/response/django-pydantic-create-schema/: `create_schema` from Django models
- https://github.com/vitalik/django-ninja/blob/master/ninja/schema.py: `Schema` source

## Summary

Django Ninja's `Schema` is a thin subclass of Pydantic v2 `BaseModel` with `from_attributes=True` set so it can validate against any Python object with attribute access (Django model instances, querysets via iteration). `ModelSchema` derives a Pydantic schema automatically from a Django model with explicit `fields = [...]` or `exclude = [...]`.

**Canonical patterns:**

- **Request schema** for `POST` / `PUT`: `class OrderCreateIn(Schema): items: list[ItemIn]; shipping_address: AddressIn`. Required + optional fields drive validation automatically.
- **Response schema** declared as `response=OrderOut` on the decorator: `@router.post("/orders", response=OrderOut)`. Ninja calls `OrderOut.model_validate(returned_obj)` automatically and emits JSON.
- **Pagination** via `ninja.pagination.paginate(LimitOffsetPagination)` decorator + `response=list[OrderOut]`.
- **Auth** via `ninja.security.django_auth` (session) or `ninja.security.HttpBearer` subclasses (JWT/API-key custom auth) on the router or per-endpoint.
- **`ModelSchema`** when the response shape mirrors the model: `class OrderOut(ModelSchema): class Meta: model = Order; fields = ["id", "status", "total", "created_at"]`. Avoids duplicate field-by-field declarations.
- **Camel-case output** for JS/React clients: `model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)` on the schema; `by_alias=True` on the decorator.
- **Resolvers** for computed fields: `@staticmethod def resolve_full_name(obj): return f"{obj.first_name} {obj.last_name}"` declared inside the schema.

## Key facts the active guides depend on

- Pydantic v2 is the boundary type. Internal services pass Django model instances or domain dicts; **the boundary** (HTTP request/response, Celery task arg, webhook payload) is always a Pydantic model.
- `model_config = ConfigDict(...)` is the v2 way (no more `class Config:`).
- `model_validate(obj)` replaces `parse_obj`; `model_dump()` replaces `dict()`; `model_dump_json()` replaces `json()`.
- Ninja's `Schema` includes a `model_validator(mode="wrap")` that wraps incoming objects in `DjangoGetter` so Pydantic can read Django manager / dotted-path attributes.
- `create_schema(Model, fields=[...], exclude=[...])` is the dynamic alternative to `ModelSchema`, but explicit `ModelSchema` classes are preferred for editor support.

## Relevance to the Stinger

- **`guides/05-django-ninja-api.md`**: full canonical API layer with these patterns.
- **`guides/12-typing-and-pydantic.md`**: Pydantic v2 at every boundary.
- **`templates/django-ninja-router.py`**: canonical router with request + response schemas + auth + pagination.

## Pull quote

> "Under the hood Django Ninja uses Pydantic Models with all their power and benefits. The alias `Schema` was chosen to avoid confusion in code when using Django models, as Pydantic's model class is called Model by default, and conflicts with Django's Model class." (Django Ninja Pydantic config guide)

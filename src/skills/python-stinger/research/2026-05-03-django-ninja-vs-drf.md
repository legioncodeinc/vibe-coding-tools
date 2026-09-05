# 2026-05-03: Django Ninja vs DRF (production migration patterns)

## Sources

- https://django-ninja.dev/: Django Ninja official docs (retrieved 2026-05-03)
- https://devblog.kogan.com/blog/moving-from-django-drf-to-ninja-api-pydantic: Kogan engineering migration writeup (retrieved 2026-05-03)
- https://engineered.at/articles/moving-from-django-drf-to-ninja-api-pydantic: companion analysis (retrieved 2026-05-03)
- https://github.com/vitalik/django-ninja/blob/master/ninja/schema.py: Ninja `Schema` source for ORM-aware Pydantic integration (retrieved 2026-05-03)
- https://revs.runtime-revolution.com/django-ninja-vs-django-rest-framework-3af867393de1: side-by-side comparison (Aug 2024)

## Summary

Django Ninja is FastAPI-style (decorator-per-endpoint, Pydantic v2 schemas, type hints drive validation and OpenAPI doc generation) and integrates with the Django ORM. DRF is the older, mature alternative with a heavier serializer + viewset + router stack. Production teams (Kogan, others) report consistent wins with Ninja: less boilerplate, automatic OpenAPI / Swagger / ReDoc docs, automatic request validation, response serialization driven by the declared `response=` schema, and a more readable function-based view shape.

## Key facts the active guides depend on

- Ninja's `Schema` class is a Pydantic `BaseModel` subclass with `model_config = ConfigDict(from_attributes=True)` set: meaning a `Schema` can validate against a Django model instance directly. Source: `ninja/schema.py`.
- `ModelSchema` derives a Pydantic schema automatically from a Django model with `fields = [...]` or `exclude = [...]` discipline. Source: Django Ninja "Generating a Schema dynamically" docs.
- DRF's serializer/viewset stack is acceptable in legacy code but verbose; the canonical migration is incremental: new endpoints land on Ninja, old DRF endpoints migrate when touched.
- Ninja supports async view functions natively. DRF's async support exists but lags.

## Relevance to the Stinger

- **`guides/05-django-ninja-api.md`**: canonical API layer.
- **`guides/01-stack-enforcement.md`**: Ninja over DRF as a Hard Rule.
- **`examples/07-drf-to-django-ninja-migration.md`**: phased migration plan with parity checklist.
- **`references/drf-comparison.md`**: DRF as preserved alternative; legacy-recognition guidance.

## Pull quote

> "Pydantic models define the structure and validation rules for both incoming request data and outgoing response data. Django Ninja then uses these Pydantic models to automatically validate incoming request body and serialize outgoing response data." (Kogan engineering blog, 2026-05-03 retrieval)

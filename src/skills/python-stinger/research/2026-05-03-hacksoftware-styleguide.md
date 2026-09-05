# 2026-05-03: HackSoftware Django Styleguide (services + selectors)

## Sources

- https://github.com/HackSoftware/Django-StyleGuide: canonical README
- https://simonwillison.net/2021/May/24/services-selectors: Simon Willison's writeup framing the pattern

## Summary

The HackSoftware Django Styleguide is a battle-tested architectural convention from a team that ships Django at scale. Its core thesis: **business logic does not belong in views, serializers, or fat models**. Business logic lives in:

- **Services** (`<app>/services.py`): functions that take care of *writing* to the database. Take keyword-only arguments, are type-annotated, can call other services / external APIs / Celery tasks.
- **Selectors** (`<app>/selectors.py`): functions that take care of *reading* from the database. Same shape as services but for fetches. Return querysets, lists, model instances.
- **Model properties**: only for trivial single-model read-derived values. If a property spans relations or risks N+1 on serialization, it's a selector.
- **Model `clean()`**: additional validations only.

**View shape** then becomes: parse input → call service or selector → serialize output. Views become thin orchestrators, not logic containers.

## Key facts the active guides depend on

- Services use **keyword-only arguments** (`def order_create(*, user: User, items: list[Item]) -> Order:`) for self-documenting call sites.
- Naming convention: `<entity>_<verb>` for services (`user_create`, `order_cancel`); `<entity>_<verb>` for selectors (`user_list`, `order_get_for_user`).
- A service can be a function, a class, or a module, whatever fits.
- Selectors that span relations should use `select_related` / `prefetch_related` explicitly: selectors are where N+1 prevention concentrates.
- HackSoftware's API guidance pre-dates Django Ninja popularity: they recommend `APIView` + serializers. python-stinger adapts this: **services + selectors stay; the API layer is Django Ninja with Pydantic schemas instead of DRF serializers.**

## Relevance to the Stinger

- **`guides/02-django-app-architecture.md`**: apps, services, selectors, signals discipline, view organization.
- **`guides/22-common-failure-modes.md`**: fat models, business logic in views/serializers as recurring findings.

## Pull quote

> "In Django, business logic should live in: Services — functions, that mostly take care of writing things to the database. Selectors — functions, that mostly take care of fetching things from the database. Model properties (with some exceptions). Model `clean` method for additional validations (with some exceptions)." (HackSoftware/Django-StyleGuide README)

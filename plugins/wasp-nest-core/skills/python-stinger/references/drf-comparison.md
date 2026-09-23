# DRF (Django REST Framework): preserved alternative

> Demoted in favor of **Django Ninja** (see `guides/05-django-ninja-api.md`). DRF is acceptable in legacy code; new endpoints should use Ninja.

## Why DRF was demoted

- **Boilerplate.** Every endpoint family needs `Serializer` + `ViewSet` + `Router`. Ninja: one decorated function.
- **Type story.** DRF predates Pydantic. Its serializers carry their own type system; Pydantic-Ninja types flow naturally into editor support, validation, and OpenAPI generation.
- **Async story.** DRF added partial async support late; Ninja is async-first.
- **OpenAPI generation.** DRF uses third-party tools (`drf-spectacular`, `drf-yasg`); Ninja generates OpenAPI directly from type hints.

## When DRF is still acceptable

- **Existing DRF codebase.** Don't rewrite for taste. Migrate as you touch (`examples/07-drf-to-django-ninja-migration.md`).
- **DRF-specific ecosystem dependencies** that aren't replaceable yet, though most have Ninja equivalents in 2026.
- **Generic class-based viewsets save you significant code** for a CRUD-shaped API where Pydantic schemas would feel repetitive.

## Legacy-code recognition

When you find DRF in the codebase:

```python
# DRF — what you'll see
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "status", "shipping_address", "total", "items"]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        return super().get_queryset().filter(user=self.request.user)
```

This is **not a finding by itself.** It becomes a finding if the project has already adopted Django Ninja for new endpoints (mixed convention) or if the team has signed off on a migration.

## Migration

See `examples/07-drf-to-django-ninja-migration.md` for the phased plan + parity checklist.

## Field-by-field map (the most common bits)

| DRF | Pydantic / Ninja |
|---|---|
| `serializers.CharField` | `str` with `Field(...)` |
| `serializers.IntegerField` | `int = Field(ge=..., le=...)` |
| `serializers.EmailField` | `EmailStr` |
| `serializers.UUIDField` | `UUID` |
| `serializers.DateTimeField` | `datetime` |
| `serializers.ChoiceField(choices=[...])` | `Literal["a", "b", "c"]` |
| `serializers.ListField(child=X)` | `list[X]` |
| `serializers.ModelSerializer` | `ModelSchema` (with `class Meta: model = ..., fields = [...]`) |
| `serializers.SerializerMethodField` | `@staticmethod resolve_<field>(obj)` on the schema |
| `validate_<field>(self, value)` | `@field_validator("<field>")` decorator |
| `validate(self, attrs)` | `@model_validator(mode="after")` |

## Settings comparison

```python
# DRF
INSTALLED_APPS = [..., "rest_framework", "rest_framework.authtoken"]
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": ["rest_framework.authentication.SessionAuthentication"],
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.IsAuthenticated"],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 20,
}
```

```python
# Ninja
INSTALLED_APPS = [...]   # Ninja doesn't need an INSTALLED_APPS entry
# Auth + permissions declared on the router or per-endpoint:
#   Router(auth=django_auth)
# Pagination via decorator:
#   @paginate(LimitOffsetPagination)
```

## Sources

- https://django-ninja.dev/
- https://www.django-rest-framework.org/
- `research/2026-05-03-django-ninja-vs-drf.md`

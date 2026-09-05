# Example 07: DRF → Django Ninja migration (phased plan with parity checklist)

Phased migration from a DRF-based API to Django Ninja. New endpoints land on Ninja; old DRF endpoints migrate when touched. Both run side-by-side until the cutover.

## Pre-migration audit

Before touching anything, capture the current state:

- `pip list | grep -i 'rest\|drf\|spectacular'`: DRF, drf-spectacular, drf-yasg, etc.
- Endpoint count: `grep -rE "(ViewSet|APIView|generics\.)" apps/ | wc -l`
- Test coverage on the API layer (need a baseline before migrating)
- Auth class catalog (which auth classes are in use, in what combinations)

Output: a spreadsheet (or a feature PRD via `library-worker-bee`) listing each endpoint, its HTTP verbs, its auth classes, its serializer, and a target priority (1 = next, 5 = deferred).

## Phase 1: Stand up Ninja alongside DRF

```bash
uv add django-ninja
```

```python
# config/urls.py — both routers mounted
from django.contrib import admin
from django.urls import include, path
from ninja import NinjaAPI

api = NinjaAPI()
# Add Ninja routers as endpoints migrate

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", api.urls),                      # Ninja
    path("api/", include("apps.api.urls")),      # legacy DRF — same prefix is fine; URL paths are distinct
]
```

Both APIs serve under `/api/`; URL patterns don't collide because each owns its own paths. Document the contract: any new endpoint goes to Ninja; DRF endpoints stay until migrated.

## Phase 2: Migrate one feature end-to-end (the proof-of-concept)

Pick a small, well-tested feature (e.g., `apps/users/`). Migrate:

1. **Serializers → Pydantic schemas.** DRF `Serializer` → Ninja `Schema` / `ModelSchema`. Field-by-field map.
2. **ViewSets → router + decorated functions.** One Ninja decorator per HTTP verb.
3. **Permissions → `auth=...`** on the router or per-endpoint.
4. **Tests update**: switch from `APIClient` to `ninja.testing.TestClient`.

### Field type map

| DRF serializer | Pydantic schema |
|---|---|
| `serializers.CharField(max_length=N)` | `str = Field(max_length=N)` |
| `serializers.IntegerField(min_value=0, max_value=999)` | `int = Field(ge=0, le=999)` |
| `serializers.EmailField()` | `EmailStr` |
| `serializers.UUIDField()` | `UUID` |
| `serializers.DateTimeField()` | `datetime` |
| `serializers.DecimalField(max_digits=10, decimal_places=2)` | `Decimal = Field(decimal_places=2, max_digits=10)` |
| `serializers.ChoiceField(choices=[...])` | `Literal["a", "b", "c"]` |
| `serializers.ListField(child=...)` | `list[X] = Field(min_length=1)` |
| `serializers.ModelSerializer` | `ModelSchema` |

### ViewSet shape map

```python
# DRF (before)
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        services.order_cancel(order=order)
        return Response(OrderSerializer(order).data)


# Ninja (after)
router = Router(auth=django_auth, tags=["orders"])


@router.get("/", response=list[OrderOut])
@paginate(LimitOffsetPagination)
def list_orders(request):
    return Order.objects.filter(user=request.user)


@router.get("/{order_id}/", response=OrderOut)
def get_order(request, order_id: int):
    return get_object_or_404(Order, id=order_id, user=request.user)


@router.post("/", response={201: OrderOut})
def create_order(request, payload: OrderCreateIn):
    order = services.order_create(user=request.user, **payload.model_dump())
    return 201, order


@router.post("/{order_id}/cancel/", response=OrderOut)
def cancel_order(request, order_id: int):
    order = get_object_or_404(Order, id=order_id, user=request.user)
    services.order_cancel(order=order)
    return order
```

## Phase 3: Parity checklist (must pass before deprecating the DRF endpoint)

For each migrated endpoint:

- [ ] Same URL path (or documented redirect from old to new).
- [ ] Same HTTP verbs accepted.
- [ ] Same response shape: run a contract test that hits both endpoints and compares JSON.
- [ ] Same auth requirements (anonymous / authenticated / specific permission).
- [ ] Same pagination shape (`{"items": [...], "count": N}` vs DRF's `{"results": [...], "count": N, "next": ..., "previous": ...}`, Ninja's default differs; choose explicitly).
- [ ] Same error response shape (or migrated to the new envelope across the whole API at once).
- [ ] Same OpenAPI documentation (drf-spectacular vs Ninja's built-in OpenAPI).
- [ ] Test coverage at or above pre-migration baseline.
- [ ] Performance equivalent (run a benchmark on a hot endpoint).

## Phase 4: Cut over

Once an endpoint family is parity-verified:

1. Remove the old DRF route from `apps/api/urls.py`.
2. Delete the DRF ViewSet / Serializer / urls.
3. Run the test suite: must stay green.
4. Deploy.
5. Monitor error rates and response time for 24h.

## Phase 5: Sunset DRF

When the last DRF endpoint is migrated:

1. Remove `djangorestframework` from `[project.dependencies]`.
2. Remove `'rest_framework'` from `INSTALLED_APPS`.
3. Remove DRF-specific settings (`REST_FRAMEWORK = {...}`).
4. Remove drf-spectacular / drf-yasg if they're not used elsewhere.
5. Run `uv lock && uv sync`: confirm clean dependency tree.

## Common migration pitfalls

| Pitfall | Mitigation |
|---|---|
| DRF default pagination vs Ninja default pagination differ | Choose one explicitly + update React consumer |
| DRF serializer `validate_<field>` methods | Become Pydantic `field_validator` decorators |
| DRF nested serializers | Become nested Pydantic schemas (or `ModelSchema` with explicit fields) |
| DRF permission_classes (multiple) | Compose into a single Ninja `HttpBearer`/`django_auth` + per-endpoint check |
| DRF `viewsets` with custom queryset (`get_queryset`) | Move to a selector function and call from each Ninja handler |
| DRF JWT (simplejwt) | Auth provider choice → handoff to `auth-worker-bee`; the Ninja-side wiring is `HttpBearer` subclass |
| OpenAPI generator (drf-spectacular) breaks | Ninja generates OpenAPI built-in; verify React typegen still works |

## Hand-offs during migration

- **Auth class migration** (DRF JWT, OAuth, custom) → `auth-worker-bee` for the provider choice; the Python wiring stays here.
- **PRD / formal migration plan** → `library-worker-bee`. This Stinger supplies the architectural rationale; the PRD lives at `library/requirements/<lifecycle>/prd-<###>-drf-to-ninja-migration/prd-feature-<###>-drf-to-ninja-migration.md`.
- **Post-migration QA** → `quality-worker-bee` runs the parity test suite as audit evidence.

## Source

`research/2026-05-03-django-ninja-vs-drf.md`, `guides/05-django-ninja-api.md`, `references/drf-comparison.md`.

# 2026-05-03: pytest-django + factory_boy + fixture patterns

## Sources

- https://pytest-django.readthedocs.io/en/latest/database.html: database fixtures, `--reuse-db` semantics (retrieved 2026-05-03)
- https://factoryboy.readthedocs.io/en/stable/: factory_boy main docs
- https://pytest-factoryboy.readthedocs.io/en/stable/: pytest-factoryboy: factories as fixtures
- https://devtoolbox.dedyn.io/blog/pytest-fixtures-complete-guide: 2026 fixture best practices

## Summary

The canonical Django test stack is **pytest + pytest-django + factory_boy + pytest-factoryboy**. JSON fixture loading via `loaddata` is a finding: factories are the answer.

- **`--reuse-db`** keeps the test database between runs: fast iteration. Note: each test is wrapped in a transaction that rolls back, so created data does NOT persist between tests; only the schema is reused.
- **`--create-db`** forces re-creation (use after schema changes).
- **`@pytest.mark.django_db`** opts a test into DB access (default is blocked); add `transaction=True` for tests that need real transactions (slower).
- **`pytest.ini` / `pyproject.toml [tool.pytest.ini_options]`** holds `DJANGO_SETTINGS_MODULE`, `python_files`, `addopts`.
- **`pytest_factoryboy.register(MyFactory)`** turns a factory into two fixtures: `my_factory` (the factory itself) and `my_model` (an instance). Sub-factories and related-factories chain naturally.
- **Conftest layering**: root `conftest.py` for cross-project fixtures, `tests/api/conftest.py` for API-only fixtures. Don't put everything in the root.
- **Yield fixtures** for setup/teardown that needs cleanup (`yield` instead of `return`).
- **Function scope is the default and the safest.** Widening to `module` / `session` is a measured decision: order-dependent test suites become unmaintainable within a year.

## Key facts the active guides depend on

- `factory_boy` provides `DjangoModelFactory`, `Faker(...)`, `LazyAttribute`, `SubFactory`, `RelatedFactory`, `post_generation`. M2M and reverse FK use `RelatedFactory` or `post_generation` hooks.
- `factory.Sequence` and `factory.Iterator` for unique values. `factory.Faker('email')` for realistic dummy data.
- For async tests: `pytest-asyncio` with `asyncio_mode = "auto"` (or `"strict"` and per-test `@pytest.mark.asyncio`). pytest-asyncio integrates cleanly with pytest-django.
- Coverage target: integration > unit; aim for 80%+ on services/selectors, lower on views (which should be thin).

## Relevance to the Stinger

- **`guides/10-pytest-discipline.md`**: pytest-django, `--reuse-db`, factory_boy, fixture organization.
- **`guides/11-pytest-async.md`**: `pytest-asyncio`, `asyncio_mode = "auto"`, async test patterns for Ninja and FastAPI.
- **`templates/conftest.py`**, **`templates/factory-boy-factory.py`**.
- **`examples/03-pytest-factory-boy-test-suite.md`**: full worked test suite.

## Pull quote

> "The reuse-db will just skip recreating the tables on the DB, but the records you create within your tests are never actually saved, all tests are run in a transaction, and when the tests end, the transaction is rolled back." (Stack Overflow answer cited in pytest-django docs)

"""
Canonical project root conftest.py.

Place at the repo root (alongside manage.py and pyproject.toml). App-local
fixtures live in apps/<feature>/tests/conftest.py.
"""
from __future__ import annotations

import pytest


# ---- Settings overrides for the entire test session ----


@pytest.fixture(autouse=True)
def _settings_overrides(settings):
    """Force fast password hasher, disable real email, run Celery eagerly."""
    settings.PASSWORD_HASHERS = ["django.contrib.auth.hashers.MD5PasswordHasher"]
    settings.EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"
    settings.CELERY_TASK_ALWAYS_EAGER = True
    settings.CELERY_TASK_EAGER_PROPAGATES = True
    settings.DEFAULT_FILE_STORAGE = "django.core.files.storage.InMemoryStorage"


# ---- Common fixtures ----


@pytest.fixture
def user(db):
    """A baseline user for tests that don't need anything special."""
    from apps.users.tests.factories import UserFactory
    return UserFactory()


@pytest.fixture
def admin_user(db):
    from apps.users.tests.factories import UserFactory
    return UserFactory(is_staff=True, is_superuser=True)


@pytest.fixture
def api_client():
    """A Ninja TestClient for the project's API."""
    from ninja.testing import TestClient

    from config.urls import api  # the NinjaAPI instance

    return TestClient(api)


@pytest.fixture
def authenticated_api_client(api_client, user):
    """A Ninja TestClient with `user` injected as request.user."""
    # Ninja's TestClient supports request scope hooks — see ninja.testing docs.
    api_client.headers = {**(api_client.headers or {}), "X-User-Id": str(user.id)}
    return api_client, user


# ---- httpx mocking ----


@pytest.fixture
def mock_http(monkeypatch):
    """Mock httpx with respx — usage:

        async def test_something(mock_http):
            mock_http.get("https://api.example.com/x").mock(...)
    """
    import respx
    with respx.mock(base_url="https://api.example.com") as r:
        yield r


# ---- Async client for FastAPI / async Django Ninja tests ----


@pytest.fixture
async def async_client():
    """An httpx.AsyncClient bound to the ASGI app for in-process testing."""
    from httpx import ASGITransport, AsyncClient

    from config.asgi import application

    async with AsyncClient(transport=ASGITransport(app=application), base_url="http://test") as client:
        yield client

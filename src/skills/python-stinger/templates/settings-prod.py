"""config/settings/prod.py — production overrides.

Run `python manage.py check --deploy` against this module — output should be
warning-free before deploy.
"""
from .base import *  # noqa: F401,F403
from .base import env

DEBUG = False

# ---- HTTPS / TLS ----
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = False  # React reads csrftoken cookie
SESSION_COOKIE_SAMESITE = "Lax"
CSRF_COOKIE_SAMESITE = "Lax"

# ---- HSTS — only after HTTPS is verified working everywhere ----
SECURE_HSTS_SECONDS = 31_536_000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# ---- Headers ----
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
X_FRAME_OPTIONS = "DENY"

# ---- Sessions ----
SESSION_COOKIE_AGE = 60 * 60 * 24 * 14  # 14 days; tighten for sensitive apps

# ---- CORS / CSRF for the production frontend origin ----
CORS_ALLOWED_ORIGINS = [env("FRONTEND_ORIGIN")]
CORS_ALLOW_CREDENTIALS = True
CSRF_TRUSTED_ORIGINS = [env("FRONTEND_ORIGIN")]

# ---- Email ----
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = env("EMAIL_HOST")
EMAIL_PORT = env.int("EMAIL_PORT", default=587)
EMAIL_HOST_USER = env("EMAIL_HOST_USER")
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD")
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = env("DEFAULT_FROM_EMAIL")

# ---- Static (handed off to devops; this is the WhiteNoise fallback) ----
STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
}

# ---- Sentry / observability ----
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration

sentry_sdk.init(
    dsn=env("SENTRY_DSN", default=""),
    integrations=[DjangoIntegration(), CeleryIntegration()],
    traces_sample_rate=env.float("SENTRY_TRACES_SAMPLE_RATE", default=0.1),
    send_default_pii=False,
    environment=env("SENTRY_ENVIRONMENT", default="production"),
)

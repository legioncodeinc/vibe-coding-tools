"""
Canonical Channels routing for an app.

Each app declares its websocket_urlpatterns; config/asgi.py composes them into
the URLRouter.
"""
from __future__ import annotations

from django.urls import path

from apps.chat.consumers import ChatConsumer

# Per-app websocket URL list. Imported from config/asgi.py (which composes all
# apps' websocket_urlpatterns into a single URLRouter under
# AuthMiddlewareStack + AllowedHostsOriginValidator).
websocket_urlpatterns = [
    path("ws/chat/<int:room_id>/", ChatConsumer.as_asgi()),
]

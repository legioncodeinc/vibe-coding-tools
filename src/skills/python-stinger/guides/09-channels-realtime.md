# 09: Channels (Realtime / WebSockets)

Channels + Daphne + channels_redis is the canonical Django realtime stack. WebSockets, long-polling, server push.

## Hard rules

1. **Daphne is the canonical ASGI server for Channels.** Uvicorn / Hypercorn work but lose Channels-tuned defaults.
2. **`channels_redis` is the only Django-maintained channel layer for production.** In-memory channel layer (`channels.layers.InMemoryChannelLayer`) is for tests only.
3. **Async consumers (`AsyncWebsocketConsumer`)** are canonical for new code. Sync consumers (`WebsocketConsumer`) are acceptable when ORM access dominates.
4. **`daphne` in `INSTALLED_APPS` at the top** to override `runserver` with the ASGI version in dev.
5. **Authenticate at the consumer's `connect()`**: `self.scope["user"]` is populated by `AuthMiddlewareStack`. Reject unauthenticated WS in `connect()`, not later.

## Setup

```python
# config/asgi.py
import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator
from django.core.asgi import get_asgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings.dev")
django_asgi_app = get_asgi_application()

from apps.chat.routing import websocket_urlpatterns  # noqa: E402

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator(
        AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
    ),
})
```

```python
# config/settings/base.py — append
INSTALLED_APPS = ["daphne", *INSTALLED_APPS]  # daphne first
ASGI_APPLICATION = "config.asgi.application"

CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env("REDIS_URL", default="redis://localhost:6379/2")],
            "prefix": "myapp",  # set if sharing Redis with other Channels projects
            "expiry": 3600,  # seconds — lower than default 86400 for healthier system
        },
    },
}
```

## Canonical consumer

```python
# apps/chat/consumers.py
import json
from typing import Any

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from apps.chat.models import Message, Room
from apps.chat.selectors import room_get_for_user


class ChatConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close(code=4401)  # custom: Unauthorized
            return

        self.room_id = int(self.scope["url_route"]["kwargs"]["room_id"])
        self.room = await self._get_room(user, self.room_id)
        if self.room is None:
            await self.close(code=4403)  # custom: Forbidden
            return

        self.group_name = f"chat_{self.room_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code: int) -> None:
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content: dict[str, Any], **kwargs) -> None:
        # Validate at the boundary
        body = content.get("body", "").strip()
        if not body or len(body) > 4000:
            await self.send_json({"error": "invalid message"})
            return

        message = await self._save_message(self.scope["user"].id, self.room_id, body)
        await self.channel_layer.group_send(
            self.group_name,
            {"type": "chat.message", "id": message.id, "user_id": message.user_id, "body": message.body},
        )

    async def chat_message(self, event: dict[str, Any]) -> None:
        # Receives the group_send broadcast — note dot vs underscore
        await self.send_json({"type": "message", **{k: v for k, v in event.items() if k != "type"}})

    @database_sync_to_async
    def _get_room(self, user, room_id):
        return room_get_for_user(user=user, room_id=room_id)

    @database_sync_to_async
    def _save_message(self, user_id, room_id, body):
        return Message.objects.create(user_id=user_id, room_id=room_id, body=body)
```

## Routing

```python
# apps/chat/routing.py
from django.urls import path
from apps.chat.consumers import ChatConsumer

websocket_urlpatterns = [
    path("ws/chat/<int:room_id>/", ChatConsumer.as_asgi()),
]
```

## Sending from outside a consumer (e.g., a Celery task)

```python
# apps/chat/tasks.py
from asgiref.sync import async_to_sync
from celery import shared_task
from channels.layers import get_channel_layer


@shared_task
def broadcast_announcement(room_id: int, body: str) -> None:
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"chat_{room_id}",
        {"type": "chat.message", "id": None, "user_id": None, "body": body},
    )
```

## Deployment

```bash
daphne -b 0.0.0.0 -p 8001 config.asgi:application
```

Behind Nginx with `upstream` block; managed by systemd / supervisord / Kubernetes (handoff to `devops-worker-bee`). Channels deployment doc: https://channels.readthedocs.io/en/stable/deploying.html.

For multiple Daphne instances on the same machine, use a process supervisor that listens on the port and passes the file descriptor (`--fd N`).

## Findings checklist

| Finding | Severity |
|---|---|
| `InMemoryChannelLayer` in production | must-fix (cross-process broadcast doesn't work) |
| Sync `WebsocketConsumer` doing pure I/O | should-refactor |
| Consumer `connect()` not validating auth | must-fix |
| Consumer `receive()` saving to DB without `database_sync_to_async` | must-fix (blocks the event loop) |
| Group name colliding with another app (no prefix) | should-refactor |
| `daphne` not in `INSTALLED_APPS` at the top | should-refactor (loses ASGI runserver) |
| Long-lived consumer holding a DB connection (sync ORM in async context) | must-fix |
| WebSocket close without an explicit code | style |

## Handoff to devops-worker-bee

- Process supervision (systemd / supervisord / Kubernetes Deployment).
- Nginx config / load balancer routing.
- TLS termination for `wss://`.
- Container build for Daphne.
- Multiple-instance scaling.

## Sources

- `research/2026-05-03-channels-v4-daphne.md`
- https://channels.readthedocs.io/en/stable/
- https://channels.readthedocs.io/en/stable/topics/consumers.html
- https://channels.readthedocs.io/en/stable/deploying.html
- https://pypi.org/project/channels-redis/

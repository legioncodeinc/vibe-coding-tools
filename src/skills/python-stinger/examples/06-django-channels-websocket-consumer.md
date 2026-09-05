# Example 06: Django Channels WebSocket consumer

A chat-room consumer with auth, message validation, group broadcast, and database persistence. Daphne deployment notes included.

## File map

```
apps/chat/
  models.py            # Room, Message
  consumers.py         # this example
  routing.py
  selectors.py
  services.py
  tests/
    test_consumers.py
config/
  asgi.py
  settings/base.py     # CHANNEL_LAYERS
```

## `apps/chat/models.py`

```python
from django.conf import settings
from django.db import models


class Room(models.Model):
    name = models.CharField(max_length=120)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="rooms")
    created_at = models.DateTimeField(auto_now_add=True)


class Message(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
```

## `apps/chat/consumers.py`

```python
from __future__ import annotations

from typing import Any

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from pydantic import BaseModel, Field, ValidationError

from apps.chat.models import Message, Room
from apps.chat.selectors import room_get_for_user


class IncomingMessage(BaseModel):
    body: str = Field(min_length=1, max_length=4000)


class ChatConsumer(AsyncJsonWebsocketConsumer):
    """Per-room chat consumer.

    Custom close codes:
    - 4400: bad request (malformed URL params)
    - 4401: unauthenticated
    - 4403: not a member of this room
    """

    async def connect(self) -> None:
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close(code=4401)
            return

        try:
            self.room_id = int(self.scope["url_route"]["kwargs"]["room_id"])
        except (KeyError, ValueError, TypeError):
            await self.close(code=4400)
            return

        self.room = await self._get_room(user, self.room_id)
        if self.room is None:
            await self.close(code=4403)
            return

        self.user = user
        self.group_name = f"chat_{self.room_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Backfill recent messages on connect
        recent = await self._get_recent_messages(self.room_id)
        await self.send_json({"type": "history", "messages": recent})

    async def disconnect(self, code: int) -> None:
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content: dict[str, Any], **kwargs) -> None:
        # Pydantic at the WS boundary
        try:
            payload = IncomingMessage.model_validate(content)
        except ValidationError as exc:
            await self.send_json({"type": "error", "code": "invalid_message", "details": exc.errors()})
            return

        message = await self._save_message(self.user.id, self.room_id, payload.body)

        # Broadcast to all consumers in the group
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat.message",  # Channels translates dot to underscore for the handler name
                "id": message.id,
                "user_id": message.user_id,
                "body": message.body,
                "created_at": message.created_at.isoformat(),
            },
        )

    async def chat_message(self, event: dict[str, Any]) -> None:
        """Receives the broadcast envelope from `group_send` above."""
        await self.send_json({
            "type": "message",
            "id": event["id"],
            "user_id": event["user_id"],
            "body": event["body"],
            "created_at": event["created_at"],
        })

    # ---- DB bridges ----

    @database_sync_to_async
    def _get_room(self, user, room_id: int):
        return room_get_for_user(user=user, room_id=room_id)

    @database_sync_to_async
    def _save_message(self, user_id: int, room_id: int, body: str) -> Message:
        return Message.objects.create(user_id=user_id, room_id=room_id, body=body)

    @database_sync_to_async
    def _get_recent_messages(self, room_id: int) -> list[dict]:
        msgs = (
            Message.objects.filter(room_id=room_id)
            .select_related("user")
            .order_by("-created_at")[:50]
        )
        return [
            {
                "id": m.id,
                "user_id": m.user_id,
                "body": m.body,
                "created_at": m.created_at.isoformat(),
            }
            for m in reversed(list(msgs))
        ]
```

## `apps/chat/routing.py`

```python
from django.urls import path
from apps.chat.consumers import ChatConsumer

websocket_urlpatterns = [
    path("ws/chat/<int:room_id>/", ChatConsumer.as_asgi()),
]
```

## `config/asgi.py`

```python
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

## Sending from outside (e.g., a Celery task)

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
        {
            "type": "chat.message",
            "id": None,
            "user_id": None,
            "body": body,
            "created_at": "",
        },
    )
```

## Test

```python
# apps/chat/tests/test_consumers.py
import pytest
from channels.testing import WebsocketCommunicator

from apps.chat.tests.factories import RoomFactory
from apps.users.tests.factories import UserFactory
from config.asgi import application


@pytest.mark.django_db(transaction=True)
async def test_authenticated_user_can_send_and_receive(settings):
    user = UserFactory()
    room = RoomFactory()
    room.members.add(user)

    communicator = WebsocketCommunicator(application, f"/ws/chat/{room.id}/")
    communicator.scope["user"] = user

    connected, _ = await communicator.connect()
    assert connected

    history = await communicator.receive_json_from()
    assert history["type"] == "history"

    await communicator.send_json_to({"body": "hello"})
    response = await communicator.receive_json_from(timeout=2)

    assert response["type"] == "message"
    assert response["body"] == "hello"
    assert response["user_id"] == user.id

    await communicator.disconnect()


async def test_unauthenticated_user_rejected():
    communicator = WebsocketCommunicator(application, "/ws/chat/1/")
    connected, code = await communicator.connect()
    assert not connected
    assert code == 4401
```

## Daphne deployment

```bash
# Local dev (replaces runserver because of `daphne` in INSTALLED_APPS)
python manage.py runserver

# Production
daphne -b 0.0.0.0 -p 8001 config.asgi:application
```

Behind Nginx with a WS-aware upstream block:

```nginx
upstream channels-backend {
    server 127.0.0.1:8001;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;

    location /ws/ {
        proxy_pass http://channels-backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 3600s;
    }

    location / {
        # Forward HTTP to gunicorn (or also to daphne — your call)
        proxy_pass http://gunicorn-backend;
        # ...
    }
}
```

Process supervision (systemd / supervisord / Kubernetes Deployment) is `devops-worker-bee` territory.

## Findings this example illustrates

- ✅ Auth checked in `connect()`, custom close codes for distinct failures.
- ✅ Pydantic validation at the WS message boundary.
- ✅ All ORM access through `database_sync_to_async` (never bare ORM calls in async consumer).
- ✅ Group-based broadcast for cross-process messages (channels_redis required).
- ✅ Backfill recent history on connect.
- ✅ Test uses `WebsocketCommunicator` with `transaction=True`.

## Source

`research/2026-05-03-channels-v4-daphne.md`, `guides/09-channels-realtime.md`.

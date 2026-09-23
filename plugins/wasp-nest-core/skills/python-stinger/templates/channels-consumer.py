"""
Canonical Channels async WebSocket consumer.

Place in apps/<feature>/consumers.py. Wire up via apps/<feature>/routing.py.

Auth pattern:
- The Channels AuthMiddlewareStack populates self.scope["user"].
- Reject unauthenticated WS in connect() with a 4401 close code (custom: Unauthorized).
- Reject Forbidden access with 4403.

ORM pattern:
- Async consumer → wrap any sync ORM with database_sync_to_async (the
  Channels-specific equivalent of asgiref.sync.sync_to_async, with DB connection
  cleanup baked in).
"""
from __future__ import annotations

import json
from typing import Any

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

# Replace with your actual imports
from apps.chat.models import Message
from apps.chat.selectors import room_get_for_user


class ChatConsumer(AsyncJsonWebsocketConsumer):
    """Per-room chat consumer.

    URL: /ws/chat/<room_id>/
    Group: chat_<room_id>
    """

    async def connect(self) -> None:
        user = self.scope["user"]
        if not user.is_authenticated:
            await self.close(code=4401)  # Unauthorized
            return

        try:
            self.room_id = int(self.scope["url_route"]["kwargs"]["room_id"])
        except (KeyError, ValueError, TypeError):
            await self.close(code=4400)  # Bad Request
            return

        self.room = await self._get_room(user, self.room_id)
        if self.room is None:
            await self.close(code=4403)  # Forbidden
            return

        self.group_name = f"chat_{self.room_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, code: int) -> None:
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content: dict[str, Any], **kwargs) -> None:
        body = (content.get("body") or "").strip()
        if not body or len(body) > 4000:
            await self.send_json({"error": "invalid_message", "code": "invalid_message"})
            return

        message = await self._save_message(self.scope["user"].id, self.room_id, body)
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "chat.message",
                "id": message.id,
                "user_id": message.user_id,
                "body": message.body,
            },
        )

    async def chat_message(self, event: dict[str, Any]) -> None:
        """Handler invoked when a `chat.message` is sent to the group.

        Note the dot vs underscore: group_send uses 'chat.message' as the type;
        Channels translates that to a method called chat_message.
        """
        await self.send_json({
            "type": "message",
            "id": event["id"],
            "user_id": event["user_id"],
            "body": event["body"],
        })

    @database_sync_to_async
    def _get_room(self, user, room_id: int):
        return room_get_for_user(user=user, room_id=room_id)

    @database_sync_to_async
    def _save_message(self, user_id: int, room_id: int, body: str) -> Message:
        return Message.objects.create(user_id=user_id, room_id=room_id, body=body)

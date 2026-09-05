# 2026-05-03: Channels v4 + Daphne deployment + Redis channel layer

## Sources

- https://channels.readthedocs.io/en/stable/deploying.html: official deploying guide (retrieved 2026-05-03)
- https://channels.readthedocs.io/en/stable/topics/channel_layers.html: channel layers config
- https://pypi.org/project/channels-redis/: channels-redis 4.3.0 (current)
- https://channels.readthedocs.io/en/latest/topics/consumers.html: consumer patterns

## Summary

Channels 4 ships as four packages: `channels` (the Django integration), `daphne` (the ASGI HTTP/WebSocket server, official), `asgiref` (base), and `channels_redis` (optional Redis-backed channel layer for cross-process group messaging).

- **Daphne is canonical.** The Channels project maintains it; `daphne myproject.asgi:application` is the standard run command. Other ASGI servers (Uvicorn, Hypercorn) work but lose Channels-tuned defaults.
- **Channel layer is optional but required for cross-process broadcast / groups.** Without it, consumers can talk to themselves but not to consumers in other processes.
- **`channels_redis` has two backends:** `RedisChannelLayer` (mature, default) and `RedisPubSubChannelLayer` (Beta, leverages Redis pub/sub for dispatch, drops messages on partition).
- **Consumer types:** `WebsocketConsumer` (sync) and `AsyncWebsocketConsumer` (async). Async is canonical for new code; sync is acceptable when ORM access dominates.
- **Routing:** `ProtocolTypeRouter` at the top level routes HTTP to `get_asgi_application()` and `websocket` to your Channels routing module. URL routing inside `websocket` is via `URLRouter`.
- **Daphne in INSTALLED_APPS** at the top of the list overrides Django's `runserver` with the ASGI version for development.
- **Production deploy:** Daphne behind Nginx (proxy) with supervisord or systemd managing the daphne process; multiple daphne instances behind upstream block for scale.

## Key facts the active guides depend on

- Redis ≥ 5.0 + Python ≥ 3.8 + asgiref ≥ 3.9.1 + channels ≥ 4.2.2 are the floor for `channels_redis` 4.3.x.
- Group expiry default is 86400s (24h): should be lowered to encourage cleanup of dead connections.
- Group key prefix is `asgi` by default: set explicitly when sharing a Redis instance across multiple Channels projects.
- Use `channels.layers.get_channel_layer()` from anywhere outside a consumer (Django views, Celery tasks) to push to a group.

## Relevance to the Stinger

- **`guides/09-channels-realtime.md`**: consumers, routing, channel layers, deployment.
- **`templates/channels-consumer.py`**, **`templates/channels-routing.py`**.
- **`examples/06-django-channels-websocket-consumer.md`**: full worked WebSocket consumer with Daphne deploy notes.

## Pull quote

> "channels_redis is the only official Django-maintained channel layer supported for production use." (Channels deploying docs, retrieved 2026-05-03)

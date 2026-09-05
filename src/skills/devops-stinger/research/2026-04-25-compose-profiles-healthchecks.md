# Docker Compose: profiles + healthchecked depends_on + secrets + watch

**Source:** https://docs.docker.com/compose/how-tos/profiles/ + https://docs.docker.com/compose/how-tos/startup-order/ + https://docs.docker.com/compose/how-tos/use-secrets/ + https://docs.docker.com/compose/how-tos/file-watch/ + https://event-driven.io/en/docker_compose_profiles/
**Retrieved:** 2026-04-25

## Profiles

Profiles let one Compose file describe a full stack (app + DB + cache + admin tools + worker) but only run the subset relevant to each developer or each task.

```yaml
services:
  app:
    profiles: ["app"]
  postgres:
    profiles: ["app", "db-only"]
  adminer:
    profiles: ["tools"]
```

- `docker compose --profile app up`: runs services with `app` profile.
- `docker compose --profile app --profile tools up`: combines.
- A service with **no `profiles:` field** runs in every `up` invocation regardless of profile flags.

This replaces the per-developer `docker-compose.override.yml` mess that always drifts.

## `depends_on` with `condition`

Three condition values:

- `service_started`: wait for container start (the short form's behavior). Mostly useless for stateful deps.
- `service_healthy`: wait for healthcheck to pass. The correct choice for DBs, caches, message brokers.
- `service_completed_successfully`: wait for the dependency to finish with exit 0. The correct choice for migration jobs.

```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
```

## Healthchecks (the dependency side)

Postgres:

```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U app -d app"]
  interval: 5s
  timeout: 5s
  retries: 5
  start_period: 10s
```

Redis:

```yaml
healthcheck:
  test: ["CMD", "redis-cli", "ping"]
  interval: 5s
  timeout: 3s
  retries: 5
```

Custom HTTP service:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 10s
  timeout: 3s
  retries: 3
  start_period: 30s
```

`start_period` is the grace window: failures during start_period don't count against `retries`.

## Secrets

```yaml
secrets:
  database_url:
    file: ./.secrets/database_url

services:
  app:
    secrets:
      - database_url
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
```

The app reads `process.env.DATABASE_URL_FILE` then `fs.readFileSync(...)`. The convention `<NAME>_FILE` is supported by Postgres's official image, many others; for custom apps you implement it explicitly.

`.secrets/` is gitignored AND dockerignored.

## Compose Watch (Compose 2.22+)

```yaml
services:
  app:
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
          ignore:
            - node_modules/
        - action: rebuild
          path: package.json
        - action: sync+restart
          path: ./prisma/schema.prisma
          target: /app/prisma/schema.prisma
```

Run with `docker compose up --watch`.

Three actions:

- `sync`: copy changed files into the container without rebuild.
- `sync+restart`: copy + restart the container's main process.
- `rebuild`: rebuild the image and restart.

This replaces the `volumes: [./:/app]` pattern that ships host `node_modules` into the container (which often has wrong arch / wrong native bindings).

## Relevance to this Stinger

- `guides/03-compose-for-dev.md`: the full spec.
- `templates/docker-compose.dev.yml`: canonical reference using all four features.
- `examples/compose-nextjs-postgres-redis.md`: worked example.

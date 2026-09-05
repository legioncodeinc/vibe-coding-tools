# 03: Compose for dev

Docker Compose conventions for the local dev loop. Production-shape Compose is a separate concern: most teams deploy via the registry, not via Compose. Source: `research/2026-04-25-compose-profiles-healthchecks.md`.

---

## 1. Profiles for selective service activation

Profiles let one Compose file describe the full stack (app + Postgres + Redis + worker + adminer + mailcatcher) but only run the subset the developer needs:

```yaml
services:
  app:
    profiles: ["app"]
    build: .
    depends_on:
      postgres:
        condition: service_healthy

  postgres:
    profiles: ["app", "db-only"]
    image: postgres:16.4-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  adminer:
    profiles: ["tools"]
    image: adminer:4
    ports:
      - "8080:8080"
```

Run subsets:

- `docker compose --profile app up`: app + Postgres
- `docker compose --profile db-only up`: just Postgres (for migration testing)
- `docker compose --profile app --profile tools up`: app + Postgres + adminer

A service with **no profile** runs by default in every `up` invocation. Use profiles for any service that's "optional in dev" (admin tools, mailcatcher, monitoring).

## 2. Healthchecked `depends_on`

`depends_on: [postgres]` (the short form) only waits for the container to *start*. The Postgres process may take 5-15 seconds after start to accept connections. The app crashes on first connection attempt, the dev gets confused, the team adds `sleep 10` workarounds.

**Correct:**

```yaml
services:
  app:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
  postgres:
    image: postgres:16.4-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
      start_period: 10s
  redis:
    image: redis:7.4-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5
```

A Compose service that other services depend on but has no healthcheck is a Should-refactor finding.

For migration jobs, use `condition: service_completed_successfully`:

```yaml
services:
  migrate:
    image: ${APP_IMAGE}
    command: ["pnpm", "db:migrate"]
    depends_on:
      postgres:
        condition: service_healthy

  app:
    depends_on:
      migrate:
        condition: service_completed_successfully
```

## 3. Compose secrets: never `environment:` for secrets

**Wrong:**

```yaml
services:
  app:
    environment:
      DATABASE_URL: "postgres://user:hunter2@postgres:5432/app"
      STRIPE_SECRET_KEY: "sk_live_..."
```

`docker inspect` reveals these. Logs may capture them. They appear in process listings.

**Right:**

```yaml
services:
  app:
    secrets:
      - database_url
      - stripe_secret_key
    environment:
      DATABASE_URL_FILE: /run/secrets/database_url
      STRIPE_SECRET_KEY_FILE: /run/secrets/stripe_secret_key

secrets:
  database_url:
    file: ./.secrets/database_url
  stripe_secret_key:
    file: ./.secrets/stripe_secret_key
```

The app reads `process.env.DATABASE_URL_FILE` then `fs.readFileSync(filename)`. The convention pattern (`<NAME>_FILE`) is recognized by Postgres's official image and many others.

`.secrets/` is `.gitignore`d and `.dockerignore`d. The dev workflow is "copy `.secrets.example/` to `.secrets/` and fill in".

## 4. Compose watch / hot-reload

Compose watch (Docker Compose 2.22+) replaces ad-hoc `volumes:` for source mounting:

```yaml
services:
  app:
    build: .
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

Run with `docker compose up --watch`. The container rebuilds or syncs as files change without `docker compose down/up` cycles.

For Next.js, the dev server inside the container handles hot-reload natively if `src/` is synced.

## 5. Networks: the default is fine

Compose creates a default bridge network. Services reach each other by service name (`postgres:5432`, `redis:6379`). Don't override unless you have a specific reason (multiple stacks sharing data, attach to external network for VPN routing, etc.).

## 6. Dependency direction: explicit

```yaml
services:
  worker:
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      app:
        condition: service_started
```

The worker depends on the app being *started* (not healthy, workers can survive a brief app outage), but Postgres/Redis must be healthy before the worker tries to read jobs.

## 7. The full canonical dev stack

See `templates/docker-compose.dev.yml` for a Next.js + Postgres + Redis + adminer stack with all the patterns above wired together. Highlights:

- All services with profiles (`app`, `db-only`, `tools`).
- All non-app services healthchecked.
- All app dependencies use `condition: service_healthy` or `service_completed_successfully`.
- Secrets via `secrets:` block, not `environment:`.
- `develop.watch` configured for sync + rebuild patterns.

## Anti-patterns

| Anti-pattern | Severity | Fix |
|---|---|---|
| `environment:` block contains secrets | Must-fix | Move to `secrets:` block, mount as `_FILE` |
| `depends_on: [postgres]` (short form) for a service that can't start without DB | Should-refactor | Use long form with `condition: service_healthy` |
| Postgres/Redis without healthcheck | Should-refactor | Add healthcheck |
| Migration job runs in the app entrypoint (race conditions) | Should-refactor | Separate `migrate` service, `app` depends on `service_completed_successfully` |
| One Compose file per developer (drift) | Should-refactor | Single `docker-compose.dev.yml` with profiles + `docker-compose.override.yml` for personal tweaks |
| `volumes: [./:/app]` mounting host into container (ships node_modules into container) | Should-refactor | Use `develop.watch` with `ignore: [node_modules/]` |

## See also

- `templates/docker-compose.dev.yml`: full reference dev stack.
- `templates/docker-compose.prod.yml`: production-shape (rare in modern stacks; included for self-hosted).
- `examples/compose-nextjs-postgres-redis.md`: worked example.
- `guides/01-dockerfile-patterns.md` §5: secrets in Dockerfiles.

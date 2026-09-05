# Example: Compose dev stack (Next.js + Postgres + Redis)

A worked dev environment for a Next.js app with Postgres and Redis dependencies, using profiles, healthchecks, secrets, and Compose watch. Source: `guides/03-compose-for-dev.md`.

---

## What this gives you

- One command to spin up the full stack.
- Profile flags for "just the DB" or "with admin tools".
- Healthchecks gate the app start until Postgres + Redis are ready.
- Migration job runs to completion before the app starts (no race conditions).
- Secrets via files (`.secrets/`), not `environment:`.
- Hot-reload via `develop.watch`: source changes sync; `package.json` changes rebuild.

## File layout

```
.
├── Dockerfile                      # multi-stage with `dev`, `builder`, `runtime` stages
├── .dockerignore
├── docker-compose.dev.yml          # this example
├── .env.example                    # documents required env
├── .secrets.example/               # placeholders; gitignored .secrets/ holds real values
│   ├── database_url
│   └── postgres_password
└── src/                            # Next.js app
```

## docker-compose.dev.yml

See `templates/docker-compose.dev.yml`, used as-is for this example. Key behaviors:

```yaml
services:
  app:
    profiles: ["app"]
    build:
      context: .
      target: dev          # multi-stage Dockerfile's `dev` stage with hot-reload
    environment:
      NODE_ENV: development
      DATABASE_URL_FILE: /run/secrets/database_url
      REDIS_URL: redis://redis:6379
    secrets:
      - database_url
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
      migrate:
        condition: service_completed_successfully
    develop:
      watch:
        - action: sync
          path: ./src
          target: /app/src
        - action: rebuild
          path: package.json
```

## Runbook

### First-time setup

```bash
# 1. Copy secret placeholders
cp -r .secrets.example/ .secrets/
# 2. Edit .secrets/database_url to: postgres://app:<your-postgres-password>@postgres:5432/app
# 3. Edit .secrets/postgres_password to: <your-postgres-password>
# 4. (Or use a generator: openssl rand -hex 32 > .secrets/postgres_password)

# 5. Start the stack with hot-reload
docker compose --profile app up --watch
```

### Just the DB (for migration testing)

```bash
docker compose --profile db-only up
# Postgres on localhost:5432
# Run migrations against it from your host:
DATABASE_URL=postgres://app:<pw>@localhost:5432/app pnpm db:migrate
```

### Full stack with admin tools

```bash
docker compose --profile app --profile tools up --watch
# adminer on http://localhost:8080
# mailcatcher on http://localhost:1080
```

### Reset DB

```bash
docker compose down -v       # removes volumes (postgres-data, redis-data)
docker compose --profile app up --watch
# Migration job re-runs; fresh DB
```

## Why each piece matters

- **Profiles:** lets one Compose file describe the whole stack but devs run only what they need. Without profiles, devs end up with personal `docker-compose.override.yml` files that drift.
- **Healthchecks + condition: service_healthy:** Postgres takes 5-15 sec after container start to accept connections. Without this, the app crashes on first connection attempt and devs add `sleep 10` workarounds. The healthcheck makes the wait deterministic.
- **`migrate` as a separate service with `service_completed_successfully`:** running migrations in the app entrypoint creates race conditions when scaling. Separating them is the same pattern production uses.
- **Secrets via files, not environment:** `docker inspect` reveals env vars; secrets mounted as files at `/run/secrets/<name>` are scoped to the process. The app reads `process.env.DATABASE_URL_FILE` and `fs.readFileSync` it.
- **Compose watch sync + rebuild:** `volumes: [./:/app]` ships `node_modules` from host into container (which then breaks because host node_modules may have wrong arch). `develop.watch` with `ignore: [node_modules/]` syncs only what should sync. `package.json` triggers rebuild because lockfile changes need a fresh install.

## Anti-patterns this avoids

| Anti-pattern | What this stack does instead |
|---|---|
| `environment: DATABASE_URL=postgres://user:pw@...` | `secrets:` block with `DATABASE_URL_FILE` |
| `depends_on: [postgres]` (short form) | Long form with `condition: service_healthy` |
| Migration runs in app's `entrypoint.sh` | Separate `migrate` service with `service_completed_successfully` |
| `volumes: [./:/app]` mounting host node_modules | `develop.watch` with `ignore: [node_modules/]` |
| Personal `docker-compose.override.yml` per dev | Single file with profiles |
| Postgres without healthcheck | Postgres `pg_isready` healthcheck |

## See also

- `templates/docker-compose.dev.yml`
- `templates/Dockerfile.next-app` (with `dev` stage added)
- `guides/03-compose-for-dev.md`

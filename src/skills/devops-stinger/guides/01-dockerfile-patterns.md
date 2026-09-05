# 01: Dockerfile patterns

The canonical patterns for Dockerfiles in Node / Next.js / TypeScript stacks. Source notes: `research/2026-04-25-multi-stage-size-reduction.md`, `research/2026-04-25-owasp-docker-cheatsheet.md`, `research/2026-04-25-buildkit-secret-mounts.md`.

---

## 1. Multi-stage builds, always

Even for a "simple" Node API. The pattern:

```dockerfile
# syntax=docker/dockerfile:1.7
ARG NODE_VERSION=20.18.1

# --- deps: install production deps ---
FROM node:${NODE_VERSION}-alpine3.20 AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && pnpm fetch --prod

# --- builder: install all deps + build ---
FROM node:${NODE_VERSION}-alpine3.20 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# --- runtime: minimal final image ---
FROM node:${NODE_VERSION}-alpine3.20 AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
USER node
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1))"
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

**Why:** the runtime stage carries no dev deps, no source, no toolchain. Up to 80% size reduction is the well-documented baseline (`research/2026-04-25-multi-stage-size-reduction.md`).

## 2. Base image selection: Alpine vs. distroless

| Choice | When to use | Trade-offs |
|---|---|---|
| `node:20-alpine` | Default for most Node apps | Smallest official image with shell; musl libc can break native modules (`bcrypt`, `node-canvas`) |
| `gcr.io/distroless/nodejs20-debian12` | High-security production runtime | No shell (no `docker exec` debugging); no package manager; smallest attack surface |
| `node:20-slim` | Native modules with glibc requirements | Larger than Alpine; safer for native deps |
| `node:20-bookworm` | Avoid unless toolchain demands | Largest; rarely justified |

**Default:** `node:<version>-alpine3.20` for the runtime stage. Switch to `slim` if native-module pain. Switch to distroless only when the team has accepted no-shell debugging and CI is comfortable.

Source: `research/2026-04-25-base-image-tradeoffs.md`.

## 3. Non-root user: mandatory

The official `node:*` images include a `node` user (UID 1000). Use it:

```dockerfile
USER node
```

For other base images, create the user explicitly:

```dockerfile
RUN addgroup -S app && adduser -S app -G app -u 10001
USER app
```

Containers running as root are a Must-fix finding per OWASP Docker Cheatsheet (`research/2026-04-25-owasp-docker-cheatsheet.md`).

## 4. HEALTHCHECK: mandatory in production stage

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r=>process.exit(r.ok?0:1))" || exit 1
```

Or, for non-HTTP services, a process-liveness check. A container without HEALTHCHECK is a Should-refactor finding: orchestrators (Compose, Kubernetes, ECS) cannot make readiness decisions without it.

## 5. BuildKit secret mounts: never `ARG` for secrets

**Wrong:**

```dockerfile
ARG NPM_TOKEN
RUN npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && npm install
```

`docker history` reveals `NPM_TOKEN`. Even if the final image strips it, the build cache layer leaks it. **Must-fix.**

**Right:**

```dockerfile
RUN --mount=type=secret,id=npm_token,target=/root/.npmrc \
    npm install
```

Build with:

```bash
docker buildx build --secret id=npm_token,src=$HOME/.npmrc -t myapp .
```

Or via Compose:

```yaml
secrets:
  npm_token:
    file: ./secrets/npm-token
```

In CI, mount the secret from the runner's environment without echoing it. Source: `research/2026-04-25-buildkit-secret-mounts.md`.

## 6. BuildKit cache mounts for package managers

`COPY package.json` then `RUN npm install` re-installs from scratch every cache miss. Use a named cache mount:

```dockerfile
# pnpm
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# npm
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci

# yarn (classic or berry with node-modules linker)
RUN --mount=type=cache,id=yarn,target=/usr/local/share/.cache/yarn \
    yarn install --frozen-lockfile
```

The cache persists across builds (in BuildKit; in CI, depends on the cache backend, see `guides/08-caching-strategies.md`).

## 7. `.dockerignore` discipline

Without a `.dockerignore`, `COPY . .` ships `node_modules`, `.git`, secrets, and editor files into the build context. Minimum:

```
.git
.gitignore
node_modules
.env
.env.*
!.env.example
.next
dist
coverage
*.log
.DS_Store
.vscode
.idea
README.md
docs/
```

A repo with no `.dockerignore` (or one that doesn't ignore `node_modules`) is a Should-refactor finding. See `templates/.dockerignore` for the canonical version.

## 8. Layer ordering for cache hits

Order from least-frequently-changing to most-frequently-changing:

1. Base image
2. System packages (`apk add`, `apt-get install`)
3. `package.json` + lockfile
4. `RUN install`
5. `COPY` source code
6. `RUN build`

Source code changes invalidate the layers below it but leave install layers cached.

## 9. Production-mode env vars

Set `NODE_ENV=production` in the runtime stage (not in the builder, `npm install` will skip dev deps). For Next.js, also `NEXT_TELEMETRY_DISABLED=1` if you don't want telemetry to phone home.

## 10. Anti-patterns (Must-fix or Should-refactor)

| Anti-pattern | Severity | Fix |
|---|---|---|
| `FROM node:latest` | Must-fix | Pin to minor + patch (`node:20.18.1-alpine3.20`) |
| `ARG SECRET=...` followed by `RUN ... $SECRET` | Must-fix | BuildKit `--mount=type=secret` |
| `USER root` in runtime stage (or no `USER`) | Must-fix | `USER node` or dedicated UID |
| Single-stage build for an app with build step | Should-refactor | Multi-stage |
| No HEALTHCHECK | Should-refactor | Add HEALTHCHECK |
| No `.dockerignore` | Should-refactor | Add canonical `.dockerignore` |
| `COPY . .` before `RUN npm install` | Should-refactor | Reorder: lockfile + install before source |
| `RUN npm install` without cache mount | Should-refactor | Add `--mount=type=cache,target=/root/.npm` |
| Multiple `RUN` lines that could be a single `RUN` chain | Style | Combine if it improves cache or shrinks layers |

## See also

- `templates/Dockerfile.node-app`: generic Node API reference Dockerfile.
- `templates/Dockerfile.next-app`: Next.js standalone-output Dockerfile.
- `templates/.dockerignore`: canonical ignore list.
- `scripts/audit-dockerfile.sh`: static audit (latest tags, root user, ARG secrets, missing HEALTHCHECK).
- `guides/02-multi-arch-builds.md`: when and how to ship arm64 alongside amd64.
- `guides/04-image-scanning.md`: how to gate on scan results.

# BuildKit secret mounts: secrets without leaking into image layers

**Source:** https://docs.docker.com/build/building/secrets/ + https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
**Retrieved:** 2026-04-25

## The problem with `ARG` and `ENV` for secrets

```dockerfile
ARG NPM_TOKEN
RUN npm config set //registry.npmjs.org/:_authToken=$NPM_TOKEN && npm install
```

- `docker history <image>` reveals the `ARG` value in the build history.
- The `RUN` layer that referenced `$NPM_TOKEN` may include the resolved value depending on shell expansion.
- `docker inspect` may reveal `ENV` values to anyone with read access to the image.
- Even if you `unset NPM_TOKEN` later, the layer is already cached + immutable.

OWASP Docker Cheatsheet flags `ARG`-for-secrets as a vulnerability pattern.

## The BuildKit answer

```dockerfile
# syntax=docker/dockerfile:1.7
RUN --mount=type=secret,id=npmrc,target=/root/.npmrc \
    npm install
```

The secret is mounted as a file at `/root/.npmrc` for the duration of that single `RUN` step. After the step completes, the mount is gone. Nothing about the secret persists in the image layer. `docker history` shows the `RUN` line but not the secret content.

## Build invocation

```bash
docker buildx build --secret id=npmrc,src=$HOME/.npmrc -t myapp .
```

In CI:

```yaml
- run: |
    echo "${{ secrets.NPM_TOKEN }}" > /tmp/.npmrc
    docker buildx build --secret id=npmrc,src=/tmp/.npmrc -t myapp .
    rm /tmp/.npmrc
```

(Better: use OIDC if the registry supports it; the secret-file dance is the fallback.)

## In Compose

```yaml
secrets:
  npm_token:
    file: ./.secrets/npm-token
services:
  builder:
    build:
      secrets:
        - npm_token
```

## Common mount targets

- `/root/.npmrc`: npm token
- `/run/secrets/<name>`: generic
- `/tmp/<name>`: anything custom

## Relevance to this Stinger

- `guides/00-principles.md` §5: the principle.
- `guides/01-dockerfile-patterns.md` §5: the pattern.
- `guides/03-compose-for-dev.md` §3: Compose secrets equivalent.
- `scripts/audit-dockerfile.sh` flags `ARG.*SECRET|TOKEN|PASSWORD|KEY|CREDENTIAL` as Must-fix.

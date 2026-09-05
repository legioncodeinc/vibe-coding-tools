# OWASP Docker Security Cheat Sheet: synthesis

**Source:** https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html
**Retrieved:** 2026-04-25

## Top recommendations relevant to this Stinger

### 1. Run as non-root (Rule 1 in cheatsheet)

> "By default, Docker containers run as root, which gives the container administrator privileges on the host. Using a non-root user [...] significantly reduces the risk of privilege escalation."

Implementation:

- Use the official `node` user (UID 1000) in `node:*` images.
- For other images, create a dedicated user: `RUN addgroup -S app && adduser -S app -G app`.
- `USER` directive in the runtime stage.

### 2. Limit capabilities (Rule 2)

When running, drop capabilities you don't need:

```bash
docker run --cap-drop=ALL --cap-add=NET_BIND_SERVICE myapp
```

Or in Compose:

```yaml
services:
  app:
    cap_drop: [ALL]
    cap_add: [NET_BIND_SERVICE]
```

(devops-stinger doesn't author the runtime invocation in cloud orchestrators, but flags this pattern in Compose.)

### 3. Read-only filesystem (Rule 3)

```yaml
services:
  app:
    read_only: true
    tmpfs:
      - /tmp
```

App writes go to mounted `tmpfs`; image filesystem stays read-only. Prevents many post-compromise exploits.

### 4. No `--privileged`

`docker run --privileged` grants the container near-host capabilities. Never used in production. devops-stinger flags any Compose `privileged: true` as Must-fix.

### 5. Pin base image version (and ideally digest)

> "Always specify a tag (and consider pinning by digest) when using a base image."

`FROM node:20.18.1-alpine3.20` minimum. `FROM node:20.18.1-alpine3.20@sha256:<digest>` for compliance-critical builds.

### 6. Don't run secrets through environment variables in the image

(Reinforces `research/2026-04-25-buildkit-secret-mounts.md`.)

### 7. Image scanning

Scan images for known vulnerabilities. The cheatsheet recommends Trivy, Grype, Docker Scout, and similar tools as part of CI.

### 8. Update base images regularly

Stale base images accumulate CVEs. Scheduled rebuilds (cron daily/weekly) re-pull the upstream image, picking up the latest security patches.

## Mapping to Stinger findings

| Cheatsheet rule | Stinger finding location |
|---|---|
| Non-root user | `guides/01-dockerfile-patterns.md` §3, `scripts/audit-dockerfile.sh` |
| Pinned base image | `guides/01-dockerfile-patterns.md` §1, §2; `scripts/audit-dockerfile.sh` |
| No secrets in ARG/ENV | `guides/01-dockerfile-patterns.md` §5; `scripts/audit-dockerfile.sh` |
| Image scanning | `guides/04-image-scanning.md` |
| Read-only filesystem (Compose) | Mentioned in `guides/03-compose-for-dev.md` (advanced; not enforced in dev stack) |
| `--privileged` ban | Mentioned in `guides/11-common-failure-modes.md` |

## Relevance to this Stinger

This document is the canonical reference for the security-side of Dockerfile authoring. Every Must-fix Dockerfile finding traces to a cheatsheet rule. Hand off CVE deep audits to `security-worker-bee`; devops-worker-bee enforces the structural rules.

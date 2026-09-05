# 11: Common failure modes

The recurring failures across Docker + Compose + Actions pipelines, with diagnosis order and fixes. Source: composite of all research notes.

---

## 1. "Cache is missing on every build"

**Symptoms:** every CI build re-installs packages (60-120 sec) even when only source changed.

**Diagnosis order:**

1. Is there a `cache-to` step? (Many repos have `cache-from` only, read-only cache.) → `guides/08-caching-strategies.md` §3.
2. Is `COPY . .` before `COPY package.json`? → reorder.
3. Is the cache scope per-branch and the new branch is cold? → expected first build; subsequent builds should warm. If always cold, check 1 and 2.
4. Is the cache backend full? GHA cache 10 GB cap → switch to registry cache or Depot.
5. Is `--no-cache` being passed inadvertently? → check Bake / workflow.

## 2. "Image is huge"

**Symptoms:** `docker images` shows a 1.5 GB Node app image.

**Diagnosis order:**

1. Single-stage build? → multi-stage; runtime stage carries only artifacts. → `guides/01-dockerfile-patterns.md` §1.
2. Base image is `node:20` (not `-alpine` or `-slim`)? → switch base.
3. Dev deps in runtime image? → `pnpm install --prod` or copy only `dist/` + production `node_modules`.
4. `.dockerignore` missing: `node_modules`, `.git`, build artifacts shipped into context? → add `.dockerignore`. → `guides/01-dockerfile-patterns.md` §7.
5. Source files in the runtime stage when only the build artifact is needed? → COPY only `dist/`.

## 3. "Secret leaked in image / build log"

**Symptoms:** `docker history` reveals a token; CI log shows a secret value; `docker inspect` shows secret as env var.

**Diagnosis order (and severity: all Must-fix):**

1. `ARG SECRET=...` in Dockerfile → BuildKit `--mount=type=secret`. → `guides/01-dockerfile-patterns.md` §5.
2. `ENV SECRET=...` in Dockerfile → never bake secrets into runtime image; inject at runtime.
3. `echo $SECRET` in workflow `run:` step → `::add-mask::` and avoid echo. → `guides/06-actions-security.md` §8.
4. Secret in Compose `environment:` block → move to `secrets:` block. → `guides/03-compose-for-dev.md` §3.
5. Secret in `actions/cache` key (cache key is logged in plaintext) → never include secrets in cache keys.

After fixing: **rotate the leaked secret** even if the leak was internal. Image history and logs may already be archived.

## 4. "Workflow runs as root / over-privileged"

**Symptoms:** `permissions: write-all` or no `permissions:` block; `GITHUB_TOKEN` has write to everything; OIDC role allows broad cloud actions.

**Diagnosis (Must-fix):**

1. Repo Settings → Actions → "Read repository contents and packages permissions" (default read-only).
2. Each job declares minimal `permissions:` block. → `guides/06-actions-security.md` §3.
3. OIDC IAM role: scoped resource ARNs, not `*`; scoped to specific repo + branch claims.
4. Production deploys behind environment protection. → `guides/06-actions-security.md` §7.

## 5. "Fork PR can run trusted code"

**Symptoms:** `pull_request_target` with `actions/checkout` of `head.sha`. Worse: the workflow runs `pnpm install` or `make build` on fork code.

**Diagnosis (Must-fix):**

1. Switch trigger to `pull_request` if the workflow runs the PR's code.
2. Restrict `pull_request_target` workflows to label/comment/automation that does NOT run PR code.
3. If you must run PR code from a fork (e.g., for previews), require a label-gated approval flow first. → `guides/06-actions-security.md` §5.

## 6. "Depends_on doesn't actually wait"

**Symptoms:** Compose app starts, immediately fails to connect to Postgres, dev adds `sleep 10` workaround.

**Diagnosis (Should-refactor):**

1. `depends_on: [postgres]` (short form) only waits for container start. → use `condition: service_healthy`. → `guides/03-compose-for-dev.md` §2.
2. Postgres / Redis service has no `healthcheck:` block. → add one.
3. Migration job ordering wrong: app starts before migrations. → separate `migrate` service, `app: depends_on: migrate: condition: service_completed_successfully`.

## 7. "Multi-arch build is slow on every PR"

**Symptoms:** PR build takes 8-12 min, mostly building arm64 under QEMU.

**Diagnosis (Should-refactor):**

1. Are arm64 consumers real? (Apple Silicon dev, Graviton deploy.) If not → drop arm64; halve build time.
2. Using QEMU on a free runner? → switch to native matrix or Depot. → `guides/02-multi-arch-builds.md`, `guides/07-depot-integration.md`.
3. Cache backend persists across arches? → Depot does; GHA cache scopes per-job (so amd64 + arm64 each have separate cache).

## 8. "Action update broke the build"

**Symptoms:** `actions/checkout@v4` was retagged; today's build fails or behaves unexpectedly.

**Diagnosis (Must-fix going forward):**

1. Is the action pinned to a tag, not a SHA? → pin to SHA. → `guides/06-actions-security.md` §2.
2. Run `scripts/pin-actions-to-sha.sh` to convert all tags to SHAs.
3. Configure Dependabot to PR-update SHAs (not just tags). The GitHub-native pin-by-SHA workflow updates SHA references with the version in a comment.

## 9. "OIDC works locally with `aws sts assume-role-with-web-identity` but fails in CI"

**Symptoms:** error like `Not authorized to perform sts:AssumeRoleWithWebIdentity` or `audience mismatch`.

**Diagnosis:**

1. IAM role's trust policy includes `token.actions.githubusercontent.com`?
2. Audience claim matches (`sts.amazonaws.com` for AWS, `https://github.com/<org>` for GCP federation)?
3. Subject claim filter matches the calling repo + branch + event? Common mistake: trust policy permits `repo:<org>/<repo>:ref:refs/heads/main` but the workflow runs from a tag.
4. Workflow has `permissions: id-token: write`?

## 10. "Build works for me, fails in CI"

**Symptoms:** local `docker build` succeeds; CI build fails on same commit.

**Diagnosis order:**

1. Local cache hides a bug: try `docker build --no-cache .` locally.
2. Different Docker version (CI on Buildx 0.x, local on Docker Desktop 25). Pin BuildKit version where possible.
3. Different platform (M-series local, amd64 CI). Build local with `--platform=linux/amd64` to reproduce.
4. Different `.dockerignore` semantics: verify via `docker buildx build --output=type=local,dest=context-dump` to see what's actually in context.
5. Different env vars / build args. Bake file resolves this: same args local and CI. → `guides/10-local-ci-parity.md`.

## 11. "PR build queue is backed up"

**Symptoms:** new PR pushes pile up; previous builds still running.

**Diagnosis (Should-refactor):**

1. No concurrency group with `cancel-in-progress: true` on PR builds. → add. → `guides/05-actions-architecture.md` §3.
2. Build is genuinely slow → cache audit (Section 1).
3. Free runner queue length → consider Depot runners.

## 12. "Trivy scan fails on a CVE with no upstream fix"

**Symptoms:** PR blocked on a CRITICAL CVE in a transitive dep with no patched version.

**Diagnosis:**

1. `ignore-unfixed: true` set? If not → set it. → `guides/04-image-scanning.md` §2.
2. If the CVE is genuinely exploitable in the image's context, document and exempt via `.trivyignore` with an expiry date.
3. Scheduled rescan picks up new fixes automatically. → `guides/09-pipeline-shapes.md` §4.

## See also

- All other guides: these failure modes reference back to specific sections.
- `scripts/audit-dockerfile.sh` and `scripts/audit-workflow.sh`: automated detection of many of these.

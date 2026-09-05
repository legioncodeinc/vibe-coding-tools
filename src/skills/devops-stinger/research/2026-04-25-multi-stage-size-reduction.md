# Multi-stage builds: size reduction baseline

**Source:** https://docs.docker.com/build/building/multi-stage/ + https://depot.dev/blog/docker-multi-stage-builds + https://trainwithdocker.com/articles/docker-best-practices
**Retrieved:** 2026-04-25

## Summary

Multi-stage Dockerfiles use multiple `FROM` directives, each starting a new build stage. The runtime stage (`FROM ... AS runtime`) copies *only* the final artifacts from earlier stages, leaving behind the build toolchain, dev dependencies, intermediate files, and source.

## Reported size reductions

- Depot's analysis: typical Node app drops from 1.2-1.5 GB (single-stage with `npm install`) to 200-400 MB (multi-stage with production-only deps + Alpine runtime). 60-80% reduction.
- "Modern Docker Best Practices 2025" (talent500.com): up to 80% size reduction is "well-documented baseline" for multi-stage Node and Go apps.
- Docker official docs: multi-stage is the recommended default for any app with a build step.

## Why size matters

- Pull time on cold starts (Lambda Container, ECS Fargate): every 100 MB ≈ 1-3 sec pull penalty.
- Registry storage costs: ECR / GHCR charge per GB-month.
- Attack surface: dev deps, source, debug tools left in production image are exploitation targets.
- Layer cache hit rate: smaller layers move faster between cache and registry.

## The pattern (canonical)

```dockerfile
FROM node:20-alpine AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

FROM node:20-alpine AS builder
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:20-alpine AS runtime
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
USER node
CMD ["node", "dist/server.js"]
```

The runtime stage carries: production node_modules + dist/. Not: source, dev deps, TypeScript compiler, build cache.

## Relevance to this Stinger

- Spine of `guides/01-dockerfile-patterns.md` §1.
- Drives both `templates/Dockerfile.node-app` and `templates/Dockerfile.next-app`.
- A single-stage Dockerfile in a repo with a build step is a Should-refactor finding.

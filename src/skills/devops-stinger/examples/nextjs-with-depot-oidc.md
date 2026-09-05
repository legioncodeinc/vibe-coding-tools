# Example: Next.js app with Depot + OIDC to AWS ECR

A worked example of the canonical pipeline shape for a Next.js app deploying to AWS via OIDC, building via Depot, scanning with Trivy. Source: `guides/07-depot-integration.md`, `guides/06-actions-security.md`, `guides/09-pipeline-shapes.md`.

---

## Stack

- Next.js 15 (App Router, `output: 'standalone'`).
- AWS Fargate (ECS) on Graviton (arm64).
- ECR for image registry.
- GitHub Actions + Depot (drop-in, OIDC).
- Trivy for scan.

## Files produced

```
.
├── Dockerfile                      # from templates/Dockerfile.next-app
├── .dockerignore                   # from templates/.dockerignore
├── docker-bake.hcl                 # from templates/docker-bake.hcl
├── docker-compose.dev.yml          # from templates/docker-compose.dev.yml
├── Makefile
└── .github/
    └── workflows/
        ├── pr-build.yml            # from templates/.github/workflows/pr-build.yml
        ├── main-deploy.yml         # adapted for ECR + Fargate
        ├── reusable-build.yml      # from templates/.github/workflows/reusable-build.yml
        └── release.yml             # tag-triggered, with SBOM + provenance
```

## Cloud setup (one-time)

In AWS:

1. Create an IAM OIDC provider for `token.actions.githubusercontent.com`.
2. Create an IAM role `github-actions-deploy` with trust policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::<account>:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": "repo:<org>/<repo>:ref:refs/heads/main"
      }
    }
  }]
}
```

3. Attach a permissions policy scoped to: `ecr:BatchGetImage`, `ecr:PutImage`, `ecr:UploadLayerPart`, `ecs:UpdateService`, `ecs:DescribeServices`, scoped to specific repository / service ARNs.

In Depot:

1. Create project, note `DEPOT_PROJECT_ID`.
2. Configure GitHub OIDC trust in project settings: allow `<org>/<repo>` on `main` and tags `v*`.

In GitHub repo:

- Settings → Actions → General → "Read repository contents and packages permissions" (default read-only).
- Settings → Variables → repository variables: `DEPOT_PROJECT_ID`, `AWS_DEPLOY_ROLE`, `AWS_REGION`, `ECR_REPOSITORY`, `ECS_CLUSTER`, `ECS_SERVICE`.

## Main-deploy workflow (adapted)

```yaml
name: Main deploy

on:
  push:
    branches: [main]

concurrency:
  group: main-deploy
  cancel-in-progress: false

permissions: {}

jobs:
  build-push:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      id-token: write   # Depot OIDC + AWS OIDC
    outputs:
      digest: ${{ steps.build.outputs.digest }}
    steps:
      - uses: actions/checkout@<sha> # v4.2.2

      - name: Configure AWS credentials (for ECR push)
        uses: aws-actions/configure-aws-credentials@<sha> # v4.x
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Login to ECR
        id: ecr
        run: |
          aws ecr get-login-password --region ${{ vars.AWS_REGION }} \
            | docker login --username AWS --password-stdin \
            ${{ steps.ecr-account.outputs.account }}.dkr.ecr.${{ vars.AWS_REGION }}.amazonaws.com

      - uses: depot/setup-action@<sha> # v1.x

      - name: Build + push (multi-arch via Depot)
        id: build
        uses: depot/build-push-action@<sha> # v1.x
        with:
          project: ${{ vars.DEPOT_PROJECT_ID }}
          context: .
          target: runtime
          platforms: linux/arm64        # Graviton-only fleet
          push: true
          tags: |
            ${{ vars.ECR_REPOSITORY }}:main
            ${{ vars.ECR_REPOSITORY }}:sha-${{ github.sha }}

  deploy:
    needs: build-push
    runs-on: ubuntu-24.04
    environment:
      name: production
      url: ${{ vars.PRODUCTION_URL }}
    permissions:
      contents: read
      id-token: write
    steps:
      - uses: actions/checkout@<sha>

      - uses: aws-actions/configure-aws-credentials@<sha>
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Run DB migrations
        run: ./scripts/run-migrations.sh
        env:
          DATABASE_URL_SECRET_ARN: ${{ vars.DATABASE_URL_SECRET_ARN }}
        # ↑ db-worker-bee owns the script; devops-worker-bee wires it in

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster ${{ vars.ECS_CLUSTER }} \
            --service ${{ vars.ECS_SERVICE }} \
            --force-new-deployment

      - name: Wait for stable
        run: |
          aws ecs wait services-stable \
            --cluster ${{ vars.ECS_CLUSTER }} \
            --services ${{ vars.ECS_SERVICE }}
```

## Release workflow (tag-triggered)

```yaml
name: Release

on:
  push:
    tags: ['v*.*.*']

permissions: {}

jobs:
  release:
    runs-on: ubuntu-24.04
    permissions:
      contents: write
      id-token: write
      packages: write
      attestations: write
    steps:
      - uses: actions/checkout@<sha>
        with:
          fetch-depth: 0   # for changelog

      - uses: aws-actions/configure-aws-credentials@<sha>
        with:
          role-to-assume: ${{ vars.AWS_DEPLOY_ROLE }}
          aws-region: ${{ vars.AWS_REGION }}

      - uses: depot/setup-action@<sha>

      - name: Build + push with SBOM and provenance
        uses: depot/build-push-action@<sha>
        with:
          project: ${{ vars.DEPOT_PROJECT_ID }}
          platforms: linux/amd64,linux/arm64
          push: true
          sbom: true
          provenance: mode=max
          tags: |
            ${{ vars.ECR_REPOSITORY }}:${{ github.ref_name }}
            ${{ vars.ECR_REPOSITORY }}:latest
```

## Outcomes

- PR build: ~90 sec warm, ~3 min cold (Depot persistent cache).
- Main deploy: ~2 min build (multi-arch native), ~1 min deploy.
- Release with SBOM + provenance: ~3 min build.
- Zero static cloud credentials in repo secrets.
- All actions pinned to SHA.
- Trivy CRITICAL/HIGH gate on PRs.

## Rollback notes

- New image broke production: `aws ecs update-service --task-definition <previous>` and ECS rolls back.
- Migration broke production: revert the migration commit, redeploy. The `migrate` step runs the down migrations if the team's runner script supports them.

## See also

- `templates/Dockerfile.next-app`
- `templates/.github/workflows/main-deploy.yml`
- `templates/.github/workflows/reusable-build.yml`
- `guides/07-depot-integration.md`, `guides/06-actions-security.md`, `guides/09-pipeline-shapes.md`.

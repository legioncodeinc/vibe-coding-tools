# GitHub Actions: Deploying with GitHub Actions
- URL: https://docs.github.com/en/actions/deployment/about-deployments/deploying-with-github-actions
- Fetched: 2026-09-29
- Source type: official vendor docs (docs.github.com)

## Key facts
- Common deploy triggers: push (branches: [main]), pull_request, workflow_dispatch.
- Job-level environment: waits for all protection rules before starting and before secret access.
- `deployment: false` disables deployment-object tracking while keeping secrets/branch policy; supports expressions; custom protection-rule apps fail with deployment:false.
- Concurrency: any string group; one run at a time, one pending; cancel-in-progress optional; not tied to environment names; workflows sharing an environment without concurrency are not restricted.
- Canonical simple pattern: workflow "Deployment", concurrency: production, on push to main, job with environment: production and deploy steps.
- Waiting-for-review jobs auto-fail after 30 days.

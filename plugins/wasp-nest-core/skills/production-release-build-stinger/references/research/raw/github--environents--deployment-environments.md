# GitHub Actions: Using environments for deployment
- URL: https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment
- Fetched: 2026-09-29
- Source type: official vendor docs (docs.github.com)

## Key facts
- A job referencing an environment must satisfy its protection rules before running or accessing the environment's secrets.
- Protection rules: required reviewers (up to 6 people/teams, one approval suffices; optional "Prevent self-review"), wait timer (minutes), admin bypass toggle ("Allow administrators to bypass configured protection rules"), custom deployment protection rules (GitHub Apps).
- Deployment branches/tags policy: "Selected branches and tags" per-rule patterns; rules configured separately per ref type.
- Environment secrets/variables are scoped to jobs using that environment; variables via the `vars` context.
- Referencing a nonexistent environment auto-creates it with NO protection rules.
- Deployment objects carry environment, environment_url, state.
- Plan limits: Free = public repos only; private-repo environments need Team/Pro.

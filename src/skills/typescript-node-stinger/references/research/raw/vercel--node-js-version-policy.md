# Vercel Node.js version policy: supported versions, pinning, deprecation

- URL: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions ; https://vercel.com/changelog/node-js-20-is-being-deprecated
- Fetched: 2026-08-14
- Source type: Official docs + official changelog (vercel.com)
- Component: Node.js runtime version policy for Builds and Functions

## Content

### Currently available major versions (as of this fetch, 2026-08-14)

- **24.x** - default for new projects
- **22.x**
- **20.x** - being deprecated (see below)

Only **major** versions are selectable; Vercel automatically rolls minor/patch updates forward (including for security fixes) within whichever major is selected. A new project uses "the latest Node.js LTS version available on Vercel" by default - as of this fetch that is 24.x.

### Two places the version is set, and which wins

1. **Project Settings > Build and Deployment > Node.js Version** (dashboard dropdown, major-version only) - applies to new deployments going forward.
2. **`package.json` `engines.node`** - overrides the Project Settings selection for that project. Example:

```json
{ "engines": { "node": "24.x" } }
```

Semver-range mapping table (from the official docs):

| Version in `package.json` | Version deployed |
|---|---|
| `24.x`, `^24.0.0`, `>=20.0.0` | latest **24.x** |
| `22.x`, `^22.0.0` | latest **22.x** |
| `20.x`, `^20.0.0` | latest **20.x** |

Verification: run `node -v` in the Build Command, or log `process.version` at runtime, to confirm which version actually deployed.

### Node.js 20 deprecation timeline (published 2026-07-14, directly relevant given "today" in this research window is 2026-08-14)

- Node.js 20 reached its own upstream end-of-life on **April 30, 2026**.
- Vercel is deprecating Node.js 20 for Builds and Functions on **October 1, 2026**.
- Existing/already-deployed Serverless Function invocations are **not** affected - only **new deployments** are affected.
- After October 1, 2026, Node.js 20 is disabled in Project Settings; any project still targeting 20 gets a build-step error on its next new deployment.
- Check exposure across an account with: `npm i -g vercel@latest` then `vercel project ls --update-required`.
- Recommended remediation: set `engines.node` to `"24.x"` in `package.json` (this overrides the dashboard Project Settings value immediately on the next deploy), and update any `.nvmrc`/`.node-version`/CI pins to match, then reinstall/rebuild/retest and confirm via `process.version`.
- **Fallback if the upgrade can't land in time**: deploy as a container image instead (a `Dockerfile.vercel` at the project root, e.g. `FROM node:20-alpine`, built and deployed on every commit) - Vercel explicitly still recommends upgrading rather than staying on the container path long-term, because on the container path the team owns the Node version and its security updates itself rather than Vercel managing them.
- A one-click bulk upgrade exists for team owners/members to move all projects on Node 20-or-earlier to Node 24 from the Vercel Dashboard (changelog entry dated 2026-08-13, i.e. one day before this research fetch) - it updates the Project Settings version only; if a project also sets `engines.node` in `package.json`, that must still be updated manually since it overrides Project Settings.

### Practical guidance this implies for a SvelteKit app's `engines` field

Given the deployed-version table above, pinning `engines.node` to a range like `"22.x"` or `"24.x"` (rather than an unbounded `">=20"`) is both how a SvelteKit project on Vercel documents its intended runtime and how it avoids silently deploying on whatever major happens to be selected in the dashboard if that setting drifts. Because Vercel only guarantees **major**-version selection (not exact minor/patch), pinning an exact patch version (e.g. `"22.11.0"`) is not meaningful on Vercel specifically - the platform will still only honor the major and roll patches forward itself.

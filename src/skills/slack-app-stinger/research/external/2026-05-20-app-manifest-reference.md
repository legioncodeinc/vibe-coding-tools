---
source_url: https://docs.slack.dev/reference/app-manifest
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: app-manifest
stinger: slack-app-stinger
---

# App Manifest Reference | Slack Developer Docs

## Summary

The Slack app manifest is a YAML or JSON configuration bundle that fully describes an app's settings, permissions, and features. It can be used to create apps programmatically via the App Manifest APIs, version-control app configuration alongside code, and reproduce app configurations across environments. The manifest covers display information, event subscriptions, interactivity settings, OAuth scopes, slash command definitions, bot user config, shortcuts, and the `assistant` feature introduced for AI-powered apps.

## Key structure sections

| Section | Purpose |
|---|---|
| `_metadata` | `major_version`, `minor_version` schema versioning |
| `display_information` | `name`, `description`, `background_color`, `long_description` |
| `settings` | `event_subscriptions`, `interactivity`, `org_deploy_enabled`, `socket_mode_enabled`, `token_rotation_enabled` |
| `features` | `bot_user`, `app_home`, `shortcuts`, `slash_commands`, `workflow_steps`, `assistant` |
| `oauth_config` | `scopes.bot`, `scopes.user`, `redirect_urls` |

## Key quotations / statistics

- Manifests can be written in YAML or JSON; TypeScript is available via the Deno Slack SDK.
- `apps.manifest.validate` API: validates a manifest against the correct schema before deployment; returns specific error messages with pointers to problem locations.
- App Manifest APIs: `apps.manifest.create`, `apps.manifest.update`, `apps.manifest.delete`, `apps.manifest.export`, `apps.manifest.validate`.
- Best practice: "Keep manifest files in version control alongside your code for tracking changes and flexibility during development."
- `socket_mode_enabled: true` in the manifest enables Socket Mode: apps with this flag cannot be listed in the Slack Marketplace (Socket Mode apps are for internal/private distribution only).
- `org_deploy_enabled: true` enables org-wide (Enterprise Grid) distribution.
- `token_rotation_enabled: true` opts the app into automatic token rotation for enhanced security.

## Annotations for stinger-forge

- Maps to `guides/00-setup-and-bolt.md` (manifest creation as part of app setup) and `guides/06-app-directory.md` (distribution settings review).
- The `socket_mode_enabled: true` flag blocking Marketplace listing is a critical constraint stinger-forge must flag in the distribution guide.
- `token_rotation_enabled: true` is a security best practice that stinger-forge should recommend by default; but note it requires implementing the `tokens_revoked` event handler and re-fetching tokens.
- The `assistant` feature section in `features` is relevant for AI-powered Slack bots: stinger-forge may want a note about this for future-proofing.
- Validation via `apps.manifest.validate` should be included in the CI/CD integration note (though CI/CD ownership is `devops-worker-bee`, the manifest validation step belongs in the Slack app setup checklist).

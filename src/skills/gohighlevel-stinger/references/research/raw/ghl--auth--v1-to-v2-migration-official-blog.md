# Migrating HighLevel API from V1 to V2 (official HighLevel blog)

- URL: https://www.gohighlevel.com/post/deprecating-the-highlevel-api-v1-and-migrating-to-v2
- Fetched: 2026-08-14
- Source type: Official (gohighlevel.com company blog, 2026-06-26)
- Component: versioning, v1 deprecation, auth model change, migration checklist

## Key facts

- "If your integrations currently rely on our V1 API, it is time to plan your transition to V2... Here is what the V1 deprecation looks like in practice: No immediate shutoff: Active V1 integrations will continue to function for now, but they are operating without a safety net. No updates or fixes: V1 will no longer receive security patches, bug fixes, or new features. No technical support... No new keys: The option to generate new V1 API keys has been disabled."
- "V2 is built to be a more secure, robust platform. The migration introduces two primary improvements: Scoped Authentication: Instead of using unrestricted API keys that grant access to everything, V2 relies on granular permissions (scopes)... Two Clear Authentication Paths:"
  | Use Case | Authentication Method |
  |---|---|
  | Internal tools & automations (Make, n8n, Zapier, custom scripts) | Private Integration Tokens (PIT) |
  | Public or Marketplace apps (Multi-account installs) | OAuth 2.0 |

## Migration steps (official recommendation)

1. "Audit your current setup. Identify which V1 endpoints, credentials, and webhooks your systems currently rely on."
2. "Choose your authentication model. Use Private Integration Tokens (PIT) for internal, single-account tools, or OAuth 2.0 if you are building public-facing marketplace apps."
3. "Replace legacy keys. Generate your V2 credentials and update your application's authorization headers."
4. "Update endpoints by feature. Instead of migrating your entire codebase at once, update and test your endpoints feature-by-feature."
5. "Configure precise scopes. Assign only the specific permissions your application actually requires."
6. "Test thoroughly. Verify your authentication flow, endpoint responses, webhooks, and core user workflows in a safe test environment."

## Named gotchas (official, explicitly called out as mistakes to avoid)

- "Using PITs for public apps: Private Integration Tokens are strictly for internal use. If other accounts need to install and authorize your app, you must use OAuth 2.0."
- "Treating this as a simple URL swap: While updating endpoint URLs is easy, most migration issues stem from incorrect scope mapping, authentication handling, or webhook configurations."
- "Carrying over broad V1 permissions: V2 is designed around least-privilege security. Take the time to configure precise scopes from the start rather than requesting blanket access."

## Notes for the distillation

This is the cleanest first-party statement of the "PIT vs OAuth" decision rule and confirms V1 API keys are a dead end (no new keys issued, end-of-support 2025-12-31). Use this as the backbone of the auth decision matrix in `references/`.

# Recent product changes (Feb-Jun 2026): MCP server, rotation expansion, activity log forwarding, Terraform OIDC

- URL: https://docs.doppler.com/changelog ; https://docs.doppler.com/changelog/march-2026 ; https://docs.doppler.com/changelog/april-2026 ; https://docs.doppler.com/changelog/june-2026 ; https://www.doppler.com/changes/february-26-product-updates ; https://www.doppler.com/changes/march-26-product-updates ; https://www.doppler.com/changes/april-26-product-updates ; https://www.doppler.com/blog/june-26-product-update
- Fetched: 2026-08-14
- Source type: Official docs changelog + official blog product-update posts (docs.doppler.com, doppler.com)
- Component: Product changelog, last ~6 months of this research window

## Content

### February 2026 - Doppler MCP Server launch

Doppler shipped an official MCP (Model Context Protocol) Server so AI tools/agents can interact with Doppler in real time instead of switching between dashboard/docs/CLI. Explicitly stated to reuse the **same authentication and role-based access controls as the API and CLI** - it does not introduce a new control plane or bypass existing security boundaries; a scoped token still limits exactly what the AI tool can do. Relevant to a Claude Code/Cowork Hive context specifically: Doppler positions this as the sanctioned way for an AI agent to touch secrets, rather than an agent shelling out to raw CLI commands with a broadly-scoped token.

### March 2026

- Automatic rotation for **Azure Service Principal** client secrets added (dashboard-configured schedule, create-new/revoke-old).
- **Dynamic Secrets** for Azure (Enterprise): temporary, limited-scope credentials via dynamically created service principals with role assignments and a TTL - distinct from scheduled rotation (see the rotation raw file's "Rotation vs. Dynamic Secrets" note).
- Non-US Twilio region support.
- "View all secrets" global search option added.
- Activity Log entries for project renames now retain both old and new project names (closes an audit-trail gap where a rename previously obscured prior history).
- New integration connection management UI replacing the legacy one, for all users.

### April 2026

- **Multi-destination Activity Log forwarding**: multiple independent webhook endpoints per destination type (Generic HTTPS, Slack, Discord, Microsoft Teams), each with its own name/URL/credentials/enabled state.
- **AWS SQS** added as an Enterprise-only Activity Log forwarding destination.
- OIDC identity authentication gained support for **nested claims** via JSON Pointer syntax (e.g. `/realm_access/roles`) when matching identity-provider token fields - relevant for orgs whose IdP nests role/group claims rather than exposing them at the token's top level.
- Direct sync support added for Supabase **branches** within a Supabase project (parallel precedent to Doppler's own branch-config model, on the receiving side).
- Change Request approval state surfaced via a status pill for clearer visibility.

### June 2026

- **Doppler On-prem** released as a deployment option (self-hosted, beyond the default SaaS control plane) - relevant if compliance later requires it, though this Hive's SvelteKit/Vercel/Neon stack has no stated on-prem requirement.
- Team/project members filterable by role in the dashboard.
- Deletion-impact warnings added for inherited/referenced data (surfaces downstream blast radius before confirming a delete - relevant given how heavily config inheritance and cross-project secret references are used in the recommended workplace-structure patterns).
- Fuzzy matching added to the "view all secrets" global search.
- Rotated Secrets API gained a list endpoint returning per-secret data including slugs.
- **Terraform Provider**: new `doppler_secret_note` resource (manage secret notes as Terraform-managed code) and **OIDC authentication support** for the Terraform provider itself (avoids a static Terraform-side Doppler token, same pattern as the GitHub Actions OIDC flow).

### Interpretation for this skill (not a direct vendor claim - a judgment call layered on top)

The through-line across this six-month window is: (1) rotation expanding to more cloud providers (Azure joining the existing AWS/GCP coverage), (2) audit/log-forwarding maturing toward real SIEM integration (multi-destination, SQS), and (3) OIDC-based auth spreading across every surface (CLI, GitHub Actions, Terraform) as the preferred alternative to static long-lived tokens. None of the fetched changelog entries mention a first-party Neon-specific rotation integration or a first-party SvelteKit SDK/quickstart; both remain research gaps, stated plainly rather than inferred.

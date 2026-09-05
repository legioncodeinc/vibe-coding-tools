# GHL Marketplace Sandbox Accounts + Step 4: Installing and Testing a Marketplace App (official)

- URL: https://marketplace.gohighlevel.com/docs/oauth/SandboxAccount/
- Secondary URL: https://marketplace.gohighlevel.com/docs/oauth/TestingApp/
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs)
- Component: marketplace apps - sandbox environment, app testing/install-link flow

## Sandbox account facts (official)

- "A Sandbox account is a non-production HighLevel environment created for Marketplace developers. Use it to build, test, and validate apps and integrations without affecting production systems or customer data."
- "Sandbox accounts are: Isolated from production. Rate-limited. Governed by Sandbox Fair Use guidelines. Intended only for development, testing, and demos."
- "Sandbox access is tied to the Marketplace Developer account... The Sandbox account is provisioned immediately... appears in the Testing environment... works as a standalone HighLevel account... Trial access to Enterprise features is enabled for testing."
- Lifecycle: **"A Sandbox account remains active for up to 6 months from the creation date. After 6 months: The Sandbox account may be deactivated. Developers can request reactivation if needed. A Sandbox account may be deactivated earlier if it violates Sandbox Fair Use guidelines."**
- Intended test coverage: "Develop and test Marketplace apps (private or public). Test Private Integration Tokens (PITs). Validate API: Authentication, Scopes, Permissions. Test: Workflows, Automations, Webhooks (at low volume). Perform functional testing with test or mock data."

## Testing an installed app version (official flow)

1. Log in to the Sandbox account and the Developer Marketplace Account.
2. My Apps -> select app -> Manage -> Versions.
3. Find the version to test, open its three-dot menu, click "Test Link", supply the target Location ID.
4. Copy the generated install link; open it in a new tab; click Install; complete installation.
5. "You can now proceed with functional testing (OAuth, API calls, webhooks, custom workflow actions & triggers, custom page, etc.)."

## Notes for the distillation

Combined with `ghl--auth--sandbox-private-integration-tokens.md` (25 req/10s, 10,000/day PIT limits), Sandbox is explicitly rate-limited *and* time-boxed to 6 months -- a serious constraint for any project with a longer development cycle, since reactivation is a manual request, not automatic. "Webhooks (at low volume)" being explicitly called out as sandbox-testable, but qualified with "at low volume," suggests load/burst-testing webhook delivery should happen against production-adjacent conditions, not assumed safe purely from sandbox behavior.

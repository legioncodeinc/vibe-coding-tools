# Marketplace App Distribution Model + Step 2: Create a Marketplace App | HighLevel API (official)

- URL: https://marketplace.gohighlevel.com/docs/oauth/AppDistribution/
- Secondary URL: https://marketplace.gohighlevel.com/docs/oauth/CreateMarketplaceApp/
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs)
- Component: marketplace apps - creation flow, distribution config, install token resolution

## Three distribution config fields (official)

| Field | Values | Description |
|---|---|---|
| Who is the target user of the app? | `Agency` / `Sub-account` | Whose access token the app ultimately needs. "For most apps, this will be `Sub-account` (Recommended)." **Cannot be modified once set.** |
| Who can install the app? | `Both Agency and Sub-account` / `Agency Only` | Recommended: "Both Agency & Sub-account" for max reach; "Agency Only" for a fully white-labeled SaaS feature only agencies discover/install. |
| Can this app be bulk-installed by agencies? | `Yes` / `No` | "All new Marketplace apps will be set to `Yes` (mandatory)." Allows an agency admin to install to multiple sub-accounts in one operation. **Cannot revert to `No` once set to `Yes`.** |

## Distribution scenario -> access token resolution table (official)

| Target user | Who can install | Bulk-install | Install scenario | Token details | Extra step |
|---|---|---|---|---|---|
| Agency | N/A | N/A | Agency user installs | `isBulkInstallation: false`, `userType: "Company"` | N/A |
| Sub-account | Agency & sub-account | No | Sub-account user installs | `isBulkInstallation: false`, `userType: "Location"` | N/A |
| Sub-account | Agency & sub-account | No | Agency user installs | `isBulkInstallation: false`, `userType: "Location"` | N/A |
| Sub-account | Agency & sub-account | Yes | Sub-account user installs | `isBulkInstallation: false`, `userType: "Location"` | N/A |
| Sub-account | Agency & sub-account | Yes | **[NEW/RECOMMENDED] Agency user installs** | `isBulkInstallation: true`, `userType: "Company"` | 1. Get sub-accounts where app is installed. 2. Get Location Token using Agency Token for every installed location. 3. Listen for `AppInstall` webhook to catch future/automatic installs and repeat step 2 for new locations. |
| Sub-account | Agency Only | Yes | Agency user installs | `isBulkInstallation: true`, `userType: "Company"` | Same 3-step flow as above. |

- Legacy-type backward compatibility: apps configured under the old "Agency & Sub-account" distribution type with an agency-only installer must not require agency-level scopes (`companies.readonly`, `companies.write`, `location.write`, `saas/location.write`, `snapshots.readonly`, `snapshots.write`, `custom-menu-link.readonly`, `custom-menu-link.write`, plus Snapshots/CustomJS modules) if they want sub-account admins to be able to install directly.

## App creation flow (official, step 2)

- "Sign in to your Developer Account... go to My Apps... Click Create App."
- "Recommendation: Start with Private while you build and test. Switch to Public only when your app is stable, secure, and ready for wider distribution."
- Advanced Settings covers: OAuth scopes, Redirect URLs, External Authentication, Webhooks.
- "What are scopes? Scopes define the level of access your app is requesting -- what data it can read or actions it can perform... Best practice: Request the minimum scopes required. Fewer scopes = better security, more user trust, and typically a smoother approval process."

## Notes for the distillation

The "[NEW and RECOMMENDED]" bulk-install-by-agency-user path is the one that requires the most integration code (listen for `AppInstall` webhook, resolve per-location tokens via `/oauth/locationToken` for every install) -- this is the realistic shape for any serious multi-tenant SaaS integration built on this platform, not the simpler single-install paths. `Target user` and the bulk-install flag are both **irreversible once set**, which belongs in any app-creation guide as a stop-and-think decision point.

# Guide 05: OAuth Multi-Workspace Installation

**Sources:** `research/external/2026-05-20-oauth-multi-workspace.md`

---

## When you need this

Single-workspace apps installed manually (developers adding the app to their own workspace) do not need an OAuth flow. You need the OAuth installation flow when:

- Your app is distributed to multiple workspaces you do not control (SaaS product, open Marketplace listing).
- You want a "Add to Slack" button on your website.
- You need per-workspace tokens stored persistently.

---

## OAuth 2.0 v2 flow (step by step)

```
User → clicks "Add to Slack"
  → App generates state (CSRF token), stores it
  → Redirect to: https://slack.com/oauth/v2/authorize
      ?client_id=YOUR_CLIENT_ID
      &scope=chat:write,commands
      &redirect_uri=https://yourapp.com/slack/oauth_redirect
      &state=GENERATED_STATE
User approves scopes in Slack
  → Slack redirects to redirect_uri with ?code=...&state=...
App validates state (CSRF check), exchanges code
  → POST https://slack.com/api/oauth.v2.access
      client_id=..., client_secret=..., code=..., redirect_uri=...
  → Response: Installation object with bot_token, team, bot_user_id
App stores Installation object in InstallationStore
  → Ready to receive events from this workspace
```

> Source: `research/external/2026-05-20-oauth-multi-workspace.md`

---

## Bolt OAuth configuration

```typescript
import { App, ExpressReceiver } from '@slack/bolt';
import { FileInstallationStore } from '@slack/oauth';  // Dev only; use DB in prod

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: process.env.SLACK_STATE_SECRET,  // CSRF protection — must be a random secret
  scopes: ['chat:write', 'commands', 'app_mentions:read'],
  installationStore: new FileInstallationStore(),  // Replace with DB store for production
  redirectUri: process.env.SLACK_REDIRECT_URI,
});
```

Bolt handles the full OAuth flow automatically when configured this way:
- Generates and validates `state` parameter (CSRF protection).
- Provides `/slack/install` (redirect to Slack auth) and `/slack/oauth_redirect` (callback handler) routes.
- Calls `installationStore.storeInstallation()` after successful token exchange.

**Never bypass Bolt's `stateSecret` validation.** This is the CSRF guard for the install flow.

---

## Production InstallationStore (database-backed)

The `FileInstallationStore` (Bolt's default) writes to disk and is NOT suitable for production (no multi-instance support, no search). Implement a DB-backed store:

```typescript
import { InstallationStore, Installation } from '@slack/oauth';
import { db } from './db';  // Your ORM / DB client

const dbInstallationStore: InstallationStore = {
  storeInstallation: async (installation: Installation) => {
    // Store by team_id (single-workspace) or enterprise_id (org-wide)
    const key = installation.isEnterpriseInstall
      ? installation.enterprise!.id
      : installation.team!.id;

    await db.slackInstallation.upsert({
      where: { teamId: key },
      create: {
        teamId: key,
        botToken: installation.bot?.token,
        botUserId: installation.bot?.userId,
        userToken: installation.user?.token,  // May be null if not requested
        raw: JSON.stringify(installation),
      },
      update: {
        botToken: installation.bot?.token,
        botUserId: installation.bot?.userId,
        raw: JSON.stringify(installation),
      },
    });
  },

  fetchInstallation: async (query) => {
    const key = query.isEnterpriseInstall ? query.enterpriseId : query.teamId;
    const record = await db.slackInstallation.findUniqueOrThrow({ where: { teamId: key } });
    return JSON.parse(record.raw) as Installation;
  },

  deleteInstallation: async (query) => {
    const key = query.isEnterpriseInstall ? query.enterpriseId : query.teamId;
    await db.slackInstallation.delete({ where: { teamId: key } });
  },
};
```

---

## Token types and lifetimes

| Token | Prefix | Tied to | Expiry |
|---|---|---|---|
| `bot_token` | `xoxb-` | App + workspace | Never expires unless revoked |
| `user_token` | `xoxp-` | User + workspace | Never expires (unless token rotation enabled) |
| `app_token` | `xapp-` | App (Socket Mode) | Never expires unless revoked |

Bot tokens are tied to the app, not the installing user. The app stays installed even if the installing user is deactivated or leaves.

User tokens are only issued if your scopes include user-level scopes (e.g., `identity.basic`). Request only what you need.

---

## Org-wide installs (Enterprise Grid)

For organizations with Enterprise Grid, admins can install an app org-wide, which applies it to all workspaces in the org. Key differences:

- `installation.isEnterpriseInstall: true` in the `Installation` object.
- `fetchInstallation` query receives `enterpriseId` (not `teamId`) for org-wide event payloads.
- Bot token is an org-level token, not a workspace-level token.
- Enable org-wide install in App Settings under **Org Level Apps > Allow org-wide install**.

```typescript
fetchInstallation: async (query) => {
  const key = query.isEnterpriseInstall
    ? `enterprise:${query.enterpriseId}`
    : `team:${query.teamId}`;
  // ...
}
```

---

## Add to Slack button (HTML)

```html
<a href="https://slack.com/oauth/v2/authorize?client_id=YOUR_CLIENT_ID&scope=chat:write,commands&redirect_uri=https://yourapp.com/slack/oauth_redirect">
  <img
    alt="Add to Slack"
    height="40"
    width="139"
    src="https://platform.slack-edge.com/img/add_to_slack.png"
    srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
  />
</a>
```

Or use Bolt's auto-generated `/slack/install` URL: it handles `state` generation automatically.

---

## Uninstall handling

When a user uninstalls the app from their workspace, Slack fires an `app_uninstalled` event. Clean up stored tokens:

```typescript
app.event('app_uninstalled', async ({ event }) => {
  await installationStore.deleteInstallation({ teamId: event.team_id });
});
```

---

*See also:* `guides/06-app-directory.md` for Marketplace listing requirements that depend on a correct OAuth flow.

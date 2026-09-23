# Guide 06: App Directory and Marketplace

**Sources:** `research/external/2026-05-20-app-directory-marketplace.md`, `research/external/2026-05-20-dev-policy-update.md`, `research/external/2026-05-20-socket-mode-vs-http.md`

---

## Distribution modes

| Mode | Who can install | Marketplace listed | Review required |
|---|---|---|---|
| Single-workspace (manual) | Only you | No | No |
| Public distribution (unlisted) | Anyone with a direct install link | No | Yes (if commercial scale) |
| Slack Marketplace | Anyone via Marketplace search | Yes | Yes |

> **December 2024 policy update:** Apps intended for commercial distribution at scale (even unlisted) must now go through Marketplace review. The old loophole of distributing at scale while keeping the app unlisted is explicitly closed. Source: `research/external/2026-05-20-dev-policy-update.md`

---

## Pre-submission checklist

Work through this checklist before submitting to the Marketplace. Incomplete items are the most common causes of rejection or delayed review.

### Technical requirements

- [ ] App uses HTTP mode (Socket Mode apps are blocked from Marketplace listing)
- [ ] Request URL is live, publicly accessible, and responds with HTTP 200 within 3 seconds
- [ ] All slash commands and interactive endpoints respond within 3 seconds
- [ ] Request signatures are verified on all endpoints
- [ ] TLS (HTTPS) is enforced on all endpoints
- [ ] OAuth 2.0 v2 install flow is working end-to-end
- [ ] "Add to Slack" button is on your app's installation page
- [ ] App is installed on at least **5 active workspaces** (used in the past 28 days)

### App manifest and scopes

- [ ] App uses only necessary OAuth scopes: no excessive-access scopes
- [ ] Prohibited scopes are absent: `admin.*`, `identity.*`, `search:read`, `workflow.steps:execute`, `triggers:*`
- [ ] `socket_mode_enabled: false` in manifest

### Listing content

- [ ] App name: no "Slack" or "Slackbot" in the name; no trademark infringement
- [ ] App icon: minimum 512x512 pixels, high quality
- [ ] Short description: 10 words or less
- [ ] Long description: clear, accurate, no misleading claims
- [ ] Active customer support URL and contact email
- [ ] Privacy policy URL

### Policy compliance

- [ ] App does NOT export or back up Slack messages
- [ ] App does NOT handle financial transactions or cryptocurrency
- [ ] App does NOT perform bulk message deletions or destructive actions
- [ ] **App does NOT use Slack data to train LLMs** (see LLM prohibition below)
- [ ] App does NOT share sensitive personal information
- [ ] App does NOT execute remote code

### AI-powered app specific

- [ ] User message content is NOT routed through LLM training pipelines (see LLM prohibition)
- [ ] App does NOT store Slack conversation content for model fine-tuning
- [ ] AI features are clearly described in the app listing

---

## LLM training prohibition (critical)

> Source: `research/external/2026-05-20-dev-policy-update.md`

The December 2024 Slack App Developer Policy update added an explicit, absolute prohibition:

> "Applications and developers are prohibited from: ... Using Data to train an LLM under any circumstances."

**This applies to all Slack apps, including AI-powered bots.** If your Slack app:
- Uses an LLM to respond to messages
- Processes Slack conversation data through an AI pipeline
- Feeds Slack user messages into a model training workflow

...you MUST ensure that Slack data is used only for **inference** (generating a response to this specific request), not for **training** (improving the model weights). A common safe architecture:

```
Slack event → your app → LLM inference API (read-only, no training)
                      ↳ never → training data store
```

Use AI provider settings to opt out of data training (e.g., OpenAI's "no training" API tier, Anthropic's data usage policies). Document this in your privacy policy.

---

## 5 active workspaces threshold

The single most common reason for premature Marketplace submissions failing: Slack requires the app to be installed on at least 5 workspaces that have been **active in the past 28 days**. Beta users, personal workspaces, and development workspaces count if they were active.

Plan your beta rollout to reach 5 active workspaces before submitting.

---

## Slack Marketplace vs App Directory

The **App Directory** is the broader catalog of all apps that have received distribution approval. The **Slack Marketplace** is the commercial storefront within the App Directory where paid apps are listed. Most apps in the App Directory are free; a subset are listed in the Marketplace as paid.

---

## Marketplace monetization

Slack does not publish its revenue share percentages or monetization terms in public documentation (open question, not found in research). To list a paid app:

1. Apply via the Marketplace submission form.
2. Contact Slack's developer relations team at `developers@slack.com` or via the App Management console for monetization terms.
3. Slack's Marketplace team will provide the commercial listing agreement.

The review process includes:
- Functionality testing (app works as described)
- TLS verification and request signing verification
- Testing of all endpoints and user experience flows
- Data access permission review
- Listing information accuracy check
- (At Slack's discretion) penetration testing

The review is NOT a full code review.

---

## Submission timeline expectations

> TODO: open question, confirm 2026 review timeline with Slack. Historically, initial reviews have taken 2-4 weeks. Post the December 2024 policy update requiring Marketplace review for commercial-scale apps, the queue may be longer. Check `https://docs.slack.dev/changelog` for current estimates.

Plan for at least 4 weeks between submission and approval for initial Marketplace listings. Re-submissions after rejection are typically faster (1-2 weeks) if only content issues were flagged.

---

## Enabling public distribution

Before submitting to the Marketplace, enable public distribution in App Settings:

1. Go to **App Settings > Manage Distribution**.
2. Complete the checklist (OAuth redirect URL, scopes declared, not in development mode).
3. Toggle **Activate Public Distribution**.
4. Test the install flow from the generated direct install URL.
5. Then submit the Marketplace listing from **App Settings > Slack Marketplace**.

---

*See also:* `guides/00-setup-and-bolt.md` for the HTTP vs Socket Mode decision (Socket Mode blocks Marketplace listing), `guides/05-oauth-install.md` for the OAuth flow that Marketplace review will test end-to-end.

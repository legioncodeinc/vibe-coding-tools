# Example: Happy Path, New SaaS Product Status Page Setup (Instatus)

*Demonstrates: `guides/00-platform-selection.md`, `guides/01-component-architecture.md`, `guides/03-subscriber-notifications.md`*

---

## Context

A B2B SaaS product ("Acme API") is setting up its first status page. Constraints:
- No existing Atlassian ecosystem
- No OSS mandate
- Budget: ~$20/month
- Channels needed: email + Slack + webhook
- ~500 expected subscribers within 6 months
- EU and US users

**Platform chosen:** Instatus: value pricing, Slack/webhook native, 200-subscriber free tier covers the launch period.

---

## Step 1: Create the Instatus page

1. Sign up at https://instatus.com, create a new status page
2. Set the subdomain: `status.acme.com` (custom domain, requires CNAME DNS record)
3. Custom branding: upload logo, set brand color

---

## Step 2: Component tree

Based on Acme API's service inventory:

```
Group: API
  - REST API (v2)
  - GraphQL API

Group: Platform
  - Web Dashboard
  - Authentication

Group: Developer Tools
  - Webhooks
  - API Keys & Tokens

Standalone:
  - Email Notifications
```

Components are named in customer language, not engineering language. No database/microservice names visible.

---

## Step 3: Subscriber notification configuration

- Enable email notifications (Instatus handles internally)
- Enable Slack integration: connect to #status-updates internal channel AND allow external subscribers to add their own Slack workspace
- Enable webhooks: configure an internal webhook to POST to the team's PagerDuty incident notes

**SMS decision:** Skip for launch (BYOC complexity vs. subscriber volume). Add when subscriber list exceeds 1,000 and SMS demand is confirmed.

**GDPR/opt-in setup:**
- Enable double opt-in (Instatus provides this as a checkbox in subscriber settings)
- Add "Notifications powered by status.acme.com" to the product's privacy policy
- Confirm Instatus DPA is in place (Enterprise plan; verify for lower plans)

---

## Step 4: Test the first incident

1. Create a test incident: "[TEST] Verifying notification pipeline"
2. Add yourself as a subscriber to confirm email arrives
3. Verify the Slack webhook fires to the internal channel
4. Verify the incident appears correctly on the status page
5. Resolve the incident and verify resolution notification is received
6. Delete the test incident from history (Instatus allows this)

---

## Step 5: Go live checklist

- [ ] Custom domain CNAME verified and resolving
- [ ] All components added and set to "Operational"
- [ ] Email subscriber confirmation flow tested
- [ ] Slack integration tested
- [ ] Webhook signature verification implemented in webhook receiver
- [ ] Link to status page added to product footer and help documentation
- [ ] Internal documentation created: "How to create an incident on the status page"

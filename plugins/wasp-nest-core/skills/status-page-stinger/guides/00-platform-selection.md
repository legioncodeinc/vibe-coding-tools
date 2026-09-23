# Guide 00: Platform Selection

*Source: `research/external/2026-05-20-platform-comparison-2026.md`, `research/external/2026-05-20-better-stack-platform-pricing.md`, `research/external/2026-05-20-atlassian-statuspage-pricing.md`, `research/external/2026-05-20-instatus-platform-pricing.md`, `research/external/2026-05-20-cachet-v3-stability.md`*

---

## The 2026 landscape

There is no universal "best" status page tool. The right answer depends on five constraints that must be evaluated in order. Work through the decision tree below before recommending a platform.

---

## Decision tree

```
Does the team have an OSS-only mandate?
└── YES → Cachet v2.4.1 (BSD-3, production-stable)
          Do NOT use Cachet v3.x (subscriber notifications absent as of May 2026)
          Alternative: Uptime Kuma (MIT, bundles monitoring) or Gatus (Apache-2.0, Kubernetes-native)
└── NO ──> Is the team's primary monitoring in PagerDuty or the Atlassian ecosystem (Jira, Opsgenie)?
           └── YES → Atlassian Statuspage (deepest PagerDuty integration; Mustache templating for automated updates)
           └── NO ──> Does the team want to consolidate monitoring + status + on-call into one tool?
                      └── YES → Better Stack (replaces monitoring + incident management + status pages)
                      └── NO ──> Instatus (strongest value pricing, broadest subscriber channel set)
```

---

## Pricing matrix (May 2026)

> Note: pricing changes frequently. Verify against the platform's official pricing page before committing.

| Platform | Free tier limits | Entry paid | Mid tier | Enterprise |
|---|---|---|---|---|
| Atlassian Statuspage | 100 subscribers, 25 components, 1 page | $29/mo (Starter: 100 subs) | $99/mo (Growth: 500 subs) | $399/mo (Business: 2k subs) |
| Better Stack | 10 uptime monitors, 1 status page | $29/mo (base) | Add-ons stack: SMS, monitoring, on-call each separate | Enterprise: can exceed $800/mo in add-ons |
| Instatus | 200 subscribers, 15 monitors | $20/mo | $300/mo (Business) | Custom |
| Cachet | Free (self-hosted) | N/A | N/A | N/A |
| OpenStatus | Yes (cloud + self-host) | $30/mo | Custom | Custom |

**Better Stack cost warning:** The base $29/month plan is deceptive. Teams needing SMS notifications, higher monitor counts, and on-call features add modules that can combine to $800+/month for an enterprise-scale deployment. Source: `research/external/2026-05-20-better-stack-platform-pricing.md`.

---

## Platform scorecards

### Atlassian Statuspage

**Strengths:**
- Deepest PagerDuty integration in the market (Mustache template variables, bidirectional sync)
- Subscriber model is mature: email, SMS (included), webhook, Slack, Atom/RSS
- Strong enterprise brand recognition; "trusted" by security teams
- Component subscriber filtering (subscribers can subscribe to specific components)

**Weaknesses:**
- Subscriber pricing model scales steeply: $399/month for 2,000 subscribers
- No built-in uptime monitoring (requires external monitoring to feed it)
- **Critical:** Component status changes do NOT trigger subscriber notifications: only incidents do. Teams relying on component status alone to communicate downtime will silently fail to notify subscribers.
- Under-investment since 2016 Atlassian acquisition; UI and API surface has not seen major updates
- SMS fires only on incident CREATE and RESOLVE, not on intermediate updates

**When to recommend:** PagerDuty-primary shops, Jira/Opsgenie ecosystem, teams with existing Atlassian contracts.

---

### Better Stack

**Strengths:**
- True all-in-one: uptime monitoring + on-call + incident management + status page in one platform
- SMS is unlimited per responder (included at $29/month per responder), not per-message
- Built-in monitoring eliminates the monitoring-to-webhook integration step
- Real-time metrics and response-time charting built in
- Strongest PagerDuty alternative if the team wants to exit that ecosystem

**Weaknesses:**
- Add-on pricing model is opaque; total cost requires careful calculation before committing
- No self-hosting option; SaaS only
- Status page features are secondary to the monitoring/incident product
- Integration with external tools (PagerDuty as primary alerter + Better Stack as status page only) is awkward

**When to recommend:** Teams wanting to consolidate monitoring + status + on-call into one vendor. Teams migrating off PagerDuty. NOT recommended as a status-page-only tool for teams already invested in their monitoring stack.

---

### Instatus

**Strengths:**
- Broadest subscriber channel set: email, SMS (BYOC), voice calls (Business+), Slack, Discord, Teams, WhatsApp, RSS, webhooks: no other platform matches this in 2026
- Jamstack pages: fast, CDN-delivered, customizable
- 30+ languages and localization support
- Strong value at $20/month
- 200-subscriber free tier (more than Statuspage's 100)

**Weaknesses:**
- SMS is BYOC: the team must bring their own Twilio/Vonage/SNS account. The team is responsible for A2P 10DLC registration, carrier compliance, and STOP keyword handling. See `guides/03-subscriber-notifications.md`.
- No enterprise SLA by default on lower plans
- Customer support response times are slower than Atlassian or Better Stack at lower tiers

**When to recommend:** Teams that value channel breadth, international audiences, or budget-conscious SaaS products. Default recommendation for most new SaaS products without an existing Atlassian or monitoring-consolidation constraint.

---

### Cachet (OSS)

**Strengths:**
- Only purpose-built communication-focused open-source status page
- BSD-3-Clause license (v2.x): permissive, suitable for commercial use
- Self-hosted: full data control, no vendor lock-in, no subscriber pricing tiers
- Active community; Docker deployment well documented

**Weaknesses:**
- **v3.x is NOT production-ready as of May 2026.** Subscribers/notifications feature is absent from v3.x. The GNOME project uses v3.x in production but it is not formally GA. See `research/external/2026-05-20-cachet-v3-stability.md`.
- Use v2.4.1 (last release November 2023) for production deployments requiring subscriber email notifications
- No built-in monitoring (requires external monitoring to feed via API)
- Requires self-hosting infrastructure, maintenance, and backup responsibility
- v3.x license is unconfirmed (`NOASSERTION` in GitHub API); verify before enterprise use

**When to recommend:** OSS mandate, full data control requirement, regulated industries needing on-premise deployment. Explicitly recommend v2.4.1, not v3.x, until v3 reaches GA with subscriber notification support.

---

## Migration considerations

**Migrating FROM Statuspage:**
- Export subscriber list (CSV) before canceling: the Statuspage API supports this
- Better Stack and Instatus both have migration-assist workflows
- Component names can carry over but status history will not

**Migrating FROM Better Stack:**
- All monitoring integrations must be re-configured (it bundles monitoring; moving off means reconfiguring your monitoring stack)

**Migrating TO Cachet:**
- Budget 1-2 engineering days for Docker setup, database initialization, and Nginx reverse proxy configuration
- Plan subscriber list re-import and re-opt-in campaign (GDPR requires fresh consent on platform migration)

---

## What NOT to recommend

- **Do not recommend Freshstatus** without confirming their "free forever + unlimited subscribers" offer against their current pricing page. As of research time this claim is unverified for production workloads.
- **Do not recommend Cachet v3.x** for any team needing subscriber email notifications.
- **Do not recommend Better Stack as a status-page-only tool** for teams already invested in PagerDuty; the integration is awkward and the cost savings disappear without the full Better Stack suite.

*See `examples/happy-path-setup.md` for a worked Instatus setup example.*

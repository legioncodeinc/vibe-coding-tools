# Guide 01: Component Architecture

*Source: `research/external/2026-05-20-component-architecture-patterns.md`*

---

## What a component tree is

A status page component tree is the public map of your service's health. Every component on the page represents a unit of service that users and paying customers care about. The goal is not to show your internal architecture; it is to show the status of the things your customers are paying for.

---

## Granularity rules

**Minimum useful granularity:** 5 components. Anything less and the page carries no information value. A single "API" component that goes red during a database failure tells users nothing about whether to retry, wait, or switch workflows.

**Maximum useful granularity:** 15 components in the main view. Beyond 15, users experience cognitive overload and stop reading the page. If your service has more than 15 independently-failing units, use grouping (see below) to keep the view manageable.

**The golden question:** "If this component goes red, do my users need to know a different thing than if that component goes red?" If yes, they are separate components. If no, merge them.

---

## Grouping heuristics

Group components by the answer to the question "which users care about this component?"

**By customer-facing impact (recommended default):**
- Core API
- Web Dashboard
- Mobile Apps
- Developer APIs (v1, v2 if versioned)
- Integrations (Webhooks, OAuth, etc.)

**By geographic region (for distributed services with meaningfully independent infrastructure):**
- US East
- EU West
- Asia Pacific

**By product area (for multi-product companies):**
- Product A
- Product B
- Shared Platform

**Anti-patterns to avoid:**
- Internal team grouping (users do not know or care which team owns which microservice)
- Technical infrastructure grouping ("Database cluster", "Message queue"): users cannot translate these to their experience
- Single mega-group with 30+ sub-components (defeats the purpose of groups)

---

## Component naming

Use customer-language names, not engineering names.

| Engineering name | Customer-facing name |
|---|---|
| postgres-primary-replica-cluster | Database |
| stripe-webhook-processor | Payment Processing |
| cdn-edge-layer | Website |
| internal-api-v2 | API |
| email-delivery-worker | Email Notifications |

---

## Critical: Statuspage component status vs. incidents

> **This is the most common Statuspage misconfiguration.** Source: `research/external/2026-05-20-component-architecture-patterns.md`

On Atlassian Statuspage, **changing a component's status (Operational → Degraded Performance → Partial Outage → Major Outage) does NOT trigger subscriber notifications.** Only creating an incident triggers subscriber notifications.

Teams that mark a component as "Major Outage" without creating an incident will display a red page but notify zero subscribers. This is the most common source of the "we had a status page but nobody saw the update" complaint.

**The correct Statuspage incident workflow:**
1. Create an incident (this triggers subscriber email/SMS/webhook)
2. Associate the incident with the affected component(s)
3. Update the incident with status updates (each update triggers subscriber notifications)
4. Resolve the incident (final notification fires)

Component status on Statuspage is primarily cosmetic: it shows the page's visual status. The notification story runs through incidents.

This limitation does NOT apply to Better Stack or Instatus, where component-level changes do notify subscribers.

---

## Metric display recommendations

**Show uptime percentage when:**
- Your product has a documented SLA (e.g., 99.9% uptime)
- The metric is meaningful to your paying customers (common for API-as-a-service products)

**Show response-time charts when:**
- Degraded performance (not just outage) is a meaningful status for your users
- You have built-in monitoring (Better Stack, Instatus free tier includes uptime monitors)
- You want to make SLO compliance visible

**Omit metrics entirely when:**
- Your page is consumer-facing and uptime % numbers create anxiety without context
- You do not have reliable monitoring data to back the display (a static graph showing 100% is worse than no graph)

---

## Template component set for a typical B2B SaaS product

```
Group: Core Product
  - Web Application
  - Mobile Apps
  - API (v2)

Group: Data & Integrations
  - Webhooks
  - Data Exports
  - Third-party Integrations

Group: Infrastructure (optional, for developer-audience products)
  - Database
  - CDN / Asset Delivery

Standalone:
  - Email Notifications
  - Billing & Payments
```

*See `examples/happy-path-setup.md` for a worked component tree alongside a full Instatus setup.*

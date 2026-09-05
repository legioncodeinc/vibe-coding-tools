# crm-integration-stinger

CRM connectivity playbook for `crm-integration-worker-bee`. This Stinger encodes the decision framework and procedural guides for connecting a product to HubSpot, Salesforce, Pipedrive, Attio, Folk, Close, or Copper.

## What this Stinger encodes

- Integration architecture selection (native SDK vs Merge.dev vs Unified.to vs Zapier)
- CRM-specific data models and the contact/lead/account taxonomy
- Field mapping patterns and data-type conversion traps
- Bi-directional sync design with conflict resolution
- Deduplication strategy (prevention, deterministic, probabilistic)
- Lead enrichment tool selection (Apollo, Clay, Breeze Intelligence)
- CRM sync code audit checklist

## Source

Research synthesized from 10 source notes, November 2025 -- May 2026. Key findings in `research/research-summary.md`. Command Brief at `../../command-briefs/crm-integration-worker-bee-command-brief.md`.

## Start here

Read `SKILL.md` for the routing table and critical directives. Then read `guides/00-principles.md` before any engagement.

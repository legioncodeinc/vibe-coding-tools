---
source_url: https://docs.slack.dev/apis/events-api/comparing-http-socket-mode/
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: socket-mode
stinger: slack-app-stinger
---

# Comparing HTTP and Socket Mode | Slack Developer Docs

## Summary

The official Slack comparison guide for HTTP Request URLs vs Socket Mode answers the Command Brief open question about Socket Mode's production viability in 2026. HTTP mode is recommended for public Marketplace-distributed apps; Socket Mode is production-viable but intentionally limited to internal/enterprise use cases where a public endpoint cannot be exposed. Socket Mode apps are blocked from Marketplace listing.

## Key quotations / statistics

- **HTTP mode**: "Uses a request-response pattern with short-lived, stateless connections. Scales well horizontally and is simpler to route through proxies for caching and encryption."
- **Socket Mode**: "Uses WebSocket for bidirectional, stateful communication with long-lived connections and low latency."
- "Socket Mode is limited to 10 concurrent WebSocket connections per app." Hard limit that makes it unsuitable for high-traffic public apps.
- "Socket Mode apps cannot be listed in the public Slack Marketplace."
- Socket Mode IS recommended for production when: operating behind a corporate firewall, building internal/enterprise apps, wanting to avoid managing public endpoints.
- "Both protocols remain current options that can be switched between at any time in app settings."
- Slack offers organization-ready app deployment for enterprise organizations using Socket Mode apps workspace-wide via org-level deployment.

## Decision matrix

| Dimension | HTTP Mode | Socket Mode |
|---|---|---|
| Marketplace listing | Yes | No |
| Public endpoint required | Yes | No |
| Horizontal scalability | High | Limited (10 connections/app) |
| Corporate firewall friendly | No | Yes |
| Latency | Higher (HTTP round-trip) | Lower (persistent WebSocket) |
| Connection type | Stateless, short-lived | Stateful, long-lived |
| Use case | Public apps, SaaS integrations | Internal tools, behind-firewall deployments |

## Open question resolution (from Command Brief)

> Q: Is Socket Mode still recommended for development only, or has it become a production-viable option in 2026?

**Answer:** Socket Mode is production-viable as of 2026 for internal/enterprise apps behind corporate firewalls. It is explicitly NOT recommended for public Marketplace apps due to the 10-connection limit and Marketplace listing restriction. The recommendation is: use Socket Mode for development and internal/enterprise deployments; switch to HTTP mode for any app intended for Marketplace distribution.

## Annotations for stinger-forge

- This directly answers the open question in the Command Brief: include this resolution at the top of `guides/00-setup-and-bolt.md`.
- The 10-connection limit is a critical production constraint stinger-forge must include in the setup guide.
- Stinger-forge should present a clear decision tree: "Will this app be listed in the Slack Marketplace? If yes → HTTP mode. If no → Socket Mode is viable."
- The ability to switch between modes at any time (without reinstalling) is a useful developer ergonomics note.

# Bifrost overview (website)
- URL: https://docs.getbifrost.ai/overview
- Fetched: 2026-09-04
- Source type: official docs site

## What it is

"Bifrost is a high-performance AI gateway unifying 20+ providers through a single OpenAI-compatible API" (OpenAI, Anthropic, AWS Bedrock, Google Vertex, Azure, and more). Under sustained load of 5,000 requests/second, it adds only 11 us of overhead per request.

## Architecture

Two transports for the same core:
- HTTP API Gateway - deployed as a service with a "built-in web UI for visual configuration and real-time monitoring"
- Go SDK - embedded "directly into your Go application for maximum performance and control" (in-process)
- Plugin layer - "Extensible middleware architecture" where custom logic ships as Go or WASM plugins; a Mocker Plugin is included for simulating provider responses in testing

Bifrost also acts as an MCP client and server: Tool Execution with approval/security controls, Agent Mode (autonomous execution with configurable auto-approval), Code Mode (the model writes Python to orchestrate tools - ~50% fewer tokens, ~40% lower latency), five auth types (None, Headers, OAuth 2.0, Per-User OAuth, Per-User Headers, with lazy auth for per-user), and Tool Hosting. It can expose itself to MCP clients like Claude Desktop and Cursor.

Flow: requests arrive via either transport -> pass through the plugin/middleware layer -> governance and routing decide the target -> providers are called with automatic failover and load balancing.

## Governance

- Virtual Keys - "The primary governance entity," controlling permissions, budgets, rate limits, and routing per consumer; MCP tool access restricted via per-key allow-lists
- Routing - weighted strategies directing requests to models, providers, and keys, with automatic fallbacks
- Budget & Rate Limits - "Hierarchical cost control" at virtual key, team, and customer levels
- Load Balancing - weighted API key distribution with model-specific filtering
- Enterprise additions - RBAC with custom roles, Okta/Entra identity via OpenID Connect, Guardrails (AWS Bedrock Guardrails, Azure Content Safety, Google Model Armor, Patronus AI), immutable Audit Logs

## Semantic caching

"Intelligent response caching based on semantic similarity" - serves cached responses for similar queries to cut cost and latency.

## Logging & observability

Built-in real-time observability of every request; Prometheus metrics (scraping or Push Gateway); OpenTelemetry OTLP tracing to Grafana, New Relic, Honeycomb; enterprise Datadog Connector; enterprise Log Exports.

## Deployment model

Open-source core deployable as a gateway or Go library; drop-in replacement - point existing OpenAI, Anthropic, Bedrock, or GenAI SDKs at a new base URL. Enterprise tier adds Clustering (gossip-based sync, zero-downtime deployments), Adaptive Load Balancing, In-VPC Deployments.

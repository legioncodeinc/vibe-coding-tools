---
source_type: community
authority: high
relevance: high
topic: platform-selection
url: https://github.com/cachethq/cachet
date_accessed: 2026-05-20
---

# Cachet v3 - Status, Stability, and Self-Hosting Viability (2026)

## Key findings

- **Cachet v3.x is under active development but NOT yet formally released as stable** as of 2026-05-20. The v3.x documentation explicitly states: "Cachet v3.x is under active development. This means that not all features are currently available and some features may be incomplete or subject to change."
- **v2.x is the current production-stable version** (latest: v2.4.1, released November 2023). The v2.x branch receives occasional security patches but no major new features.
- **v3 rewrite history**: Announced August 2023, targeting Laravel 11.x + Vue.js + Inertia + Tailwind. The 2024 recap noted the main developer "missed plans to deliver v3 in 2024." As of January 2025, the developer was "getting closer to an alpha release of 3.x."
- **Key features still missing from v3.x as of late 2024**: Subscribers/Notifications, Metrics, User Management, Tags, Meta. These are critical gaps for production status page use.
- **What IS working in v3.x**: Basic status page display, component status management, Filament-based admin dashboard, incident creation/updates, PostgreSQL/MySQL/SQLite support, basic API, webhooks (added January 2025), OhDear monitoring integration.
- **The GNOME project is already using v3.x in production** - indicating it is viable for real-world use despite not being formally released.
- **Repository stats (GitHub)**: 15,008 stars, 1,610 forks, last push March 31 2026, 170 contributors. Latest release tag is still v2.4.1.
- **v3 installation requirements**: PHP 8.2+ (8.2, 8.3, or 8.4), Composer, MariaDB/MySQL 10.7+/PostgreSQL/SQLite, Redis recommended for caching and queues.
- **Resource requirements for self-hosting**: ~150 MB RAM minimum, requires PostgreSQL/MySQL (not just SQLite for production), external monitoring still required separately (Cachet has NO built-in monitoring).
- **Cachet does NOT monitor services**: It is a communication platform only. A separate monitoring tool (Prometheus, Nagios, OhDear, Gatus, etc.) must feed status updates to Cachet via its API.
- **Alternatives that are more actively maintained** for OSS self-hosting: Uptime Kuma (57K+ GitHub stars, MIT license, monitoring + status page combined), Gatus (Apache 2.0, config-as-code, Kubernetes-native).

## Quotes / data points

- "The v3 rewrite has been in progress for several years with slow progress. The v2.x branch receives occasional patches but no major features. For new deployments, evaluate whether the current feature set meets your needs and consider Gatus or Upptime as alternatives if long-term maintenance concerns you." (selfhosting.sh, January 2026)
- "Cachet is the most established self-hosted status page with a solid feature set — components, incidents, maintenance windows, and subscriber notifications cover the essentials." (selfhosting.sh)
- "Cachet wins when you need a dedicated, professional-looking incident communication platform." (selfhosting.sh)
- From the v3 January 2025 update: "We're now testing the cachethq/core repository against MySQL, SQLite and Postgres with both PHP 8.3 and 8.2" and "We're getting closer to an alpha release of 3.x!"
- License: BSD-3-Clause (v2.x). The repository shows "Other (NOASSERTION)" which may indicate a license change in v3 - needs verification.

## Open questions surfaced

- When will v3.x reach a stable GA release? The developer has missed prior target dates (2024). No official ETA as of research date.
- Are v2.x subscriber email notifications still functional with PHP 8.2+, or are there known compatibility issues with the older codebase on modern PHP?
- The v3.x license is unclear from the GitHub API response ("NOASSERTION") - what license will v3 be released under? This matters for enterprise OSS use.
- Does v3.x support the same JSON API format as v2.x for backward compatibility with existing automation scripts?

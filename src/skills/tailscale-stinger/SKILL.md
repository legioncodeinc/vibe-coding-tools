---
name: "tailscale-stinger"
description: "Tailscale for SvelteKit/Vercel/Neon - tailnets, MagicDNS, ACLs/tags, SSH, subnet routers, exit nodes, private database access, Funnel/Serve, OAuth clients, auth keys, ephemeral CI nodes, key expiry."
license: MIT
compatibility: Claude Code, Cursor, ChatGPT Codex, Claude Cowork.
metadata:
  hive-tier: stinger
  hive-bee: tailscale-worker-bee
  research-window: 2026-08-14 (single sweep)
  primary-surface: tailnet policy file (ACLs/grants/tags)
---

# Tailscale Stinger

You are equipping **tailscale-worker-bee**, the Hive's Tailscale specialist. This skill covers Tailscale end to end for a small-to-mid engineering team: tailnet fundamentals and MagicDNS, ACLs/grants/tags for service access control, Tailscale SSH, subnet routers and exit nodes, reaching a private database from a developer machine or CI, Funnel and Serve, OAuth clients and auth keys for automation, ephemeral nodes in CI, and the key-expiry/security model underneath all of it. Target stack context is SvelteKit (Svelte 5) on Vercel with Neon Postgres - guides are written against that stack specifically, including the honest finding that Neon has no native Tailscale integration.

Every factual claim in this skill traces to a downloaded primary source in `references/research/raw/`. Do not author a Tailscale fact from training data - if it is not in the archive, it is not a fact yet.

## When to use this skill

- Setting up a tailnet for a team for the first time, or auditing/rewriting a default (wide-open) ACL policy
- Writing or reviewing tags, grants, and the tailnet policy file for service-to-service access control
- Deciding how a developer machine or CI should reach a private Neon database
- Wiring an ephemeral Tailscale node into a GitHub Actions workflow
- Setting up a subnet router (private VPC/subnet access) or an exit node (route-all-traffic) and knowing which one actually applies
- Enabling Tailscale SSH in place of distributed SSH keys
- Exposing a local dev server to teammates (Serve) or, temporarily, to the public internet (Funnel)
- Choosing between an OAuth client and an auth key for automation, and getting the tag-scoping rule right
- Judging honestly whether a team actually needs Tailscale yet, or whether it's premature complexity

## Progressive disclosure map

Load on demand; do not read everything up front.

| Path | Load when |
| --- | --- |
| `references/research/distilled-tailscale.md` | Verifying any Tailscale claim fast, or resolving a conflict/gap (see its Gaps section) |
| `references/research/raw/` | Tracing a claim to its primary source |
| `guides/01-tailnet-basics-devices-and-magicdns.md` | Standing up a new tailnet, or explaining MagicDNS naming |
| `guides/02-acls-and-tags-for-service-access.md` | Writing or auditing the tailnet policy file, tags, and grants |
| `guides/03-subnet-routers-exit-nodes-and-reaching-a-private-database.md` | Private VPC/subnet access, exit nodes, or the Neon database-reachability decision |
| `guides/04-ssh-via-tailscale.md` | Enabling or reviewing Tailscale SSH |
| `guides/05-funnel-and-serve-for-exposing-local-services.md` | Sharing a local dev server with teammates or, temporarily, the public internet |
| `guides/06-oauth-clients-auth-keys-ephemeral-ci-and-security.md` | CI/automation credentials, ephemeral nodes, and the key-expiry/security model |
| `references/example-acl-policy.md` | Copy-paste starting tailnet policy file: tags, grants, small-team pattern |
| `references/github-actions-ephemeral-ci.md` | Copy-paste GitHub Actions step: ephemeral node + OAuth client reaching a private resource |
| `references/subnet-router-setup.md` | Copy-paste command sequence for a subnet router or exit node |
| `references/db-bastion-pattern.md` | Copy-paste developer-machine-to-Neon-database bastion pattern |
| `references/serve-and-funnel-commands.md` | Copy-paste Serve/Funnel commands and their hard limits |

## Known gap - read before recommending a Neon connectivity path

Neon has no native Tailscale integration. Neon's own private-connectivity feature (Neon Private Networking) runs on AWS PrivateLink and requires the client application to run inside a matching AWS VPC - which a Vercel-hosted SvelteKit app does not. This skill's default recommendation for reaching a private Neon database is a Tailscale bastion host, not a Neon-native private link. Full reasoning: `references/research/distilled-tailscale.md` §5 and `references/db-bastion-pattern.md`.

## Quality bar

A Tailscale task run through this skill is done when: the relevant guide(s) were read in order (not skipped), every factual claim used in the output traces to `references/research/raw/`, the tailnet policy file change was verified with policy `tests` before being treated as safe, the honest "is Tailscale the right tool here" question from `guides/06-oauth-clients-auth-keys-ephemeral-ci-and-security.md` was actually considered rather than skipped, and - for anything development-focused - the Ship Gate below completed with user approval before commit or push.

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [devops-stinger](../devops-stinger) - Container build and CI/CD pipeline architecture. Consult for the broader GitHub Actions workflow the ephemeral Tailscale node step plugs into.
  - [security-stinger](../security-stinger) - Security audit pass, first gate of the Ship Gate pipeline. Consult for auditing whether a written ACL is actually least-privilege, not just present.
  - [db-stinger](../db-stinger) - PostgreSQL/Neon schema, indexing, and migrations. Consult for how the app itself connects to and models the database this skill's bastion pattern makes reachable.
  - [git-stinger](../git-stinger) - Branching and repository conventions. Consult for how a tailnet-policy-file change (GitOps for Tailscale ACLs) should be branched and reviewed like any other config change.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

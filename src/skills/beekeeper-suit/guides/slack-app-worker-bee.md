# slack-app-worker-bee

## Domain
Owns the full Slack app developer surface built on the Bolt SDK (JS/Python/Java): slash commands, Block Kit UI composition, modal open/push/update lifecycle, the Events API subscription and HMAC verification model, OAuth 2.0 multi-workspace installation, and App Directory/Marketplace submission including the December 2024 policy constraints (LLM training prohibition, Socket Mode Marketplace block). It does not cover the Deno Slack SDK or the next-gen Workflow Builder platform.

## Paired Stinger
[slack-app-stinger](../../slack-app-stinger) - Bolt SDK setup, HTTP vs Socket Mode decision tree, Block Kit/modal/Events API/OAuth guides, and the App Directory submission checklist.

## Trigger phrases
- "build a Slack app"
- "add a slash command"
- "create a Slack modal"
- "set up Slack Events API"
- "multi-workspace OAuth install for our Slack app"
- "submit our bot to Slack Marketplace"
- "why isn't Slack acknowledging our slash command"
- "verify Slack request signatures on this endpoint"

## Do NOT route when
- The ask is CI/CD pipeline topology or deployment infrastructure for the bot server, not the Bolt code itself: route to devops-worker-bee.
- The ask is secrets vault configuration or token rotation policy: route to security-worker-bee.
- The ask is Django/FastAPI backend architecture beyond the Bolt integration layer: route to python-worker-bee.
- The ask is Slack Connect or Enterprise Grid administration rather than app development.
- The ask is about the Deno Slack SDK or Workflow Builder, both explicitly out of this Bee's scope.

## Inputs the Bee needs
- Target language/runtime for Bolt (JS, Python, or Java).
- Whether the app targets Slack Marketplace distribution (changes the Socket Mode and workspace-threshold guidance).
- Whether the surface is a fresh scaffold, a single feature addition (slash command, modal, Events API), or a submission/compliance review.
- Existing app manifest, scopes, and OAuth installation model if one exists.

## Outputs
- Bolt app scaffold or refactored handler code (TypeScript or Python templates).
- Block Kit JSON, modal view definitions, or OAuth `InstallationStore` wiring.
- Security findings (missing signature verification, plaintext tokens, missing `state` validation) flagged Critical.
- App Directory / Marketplace pre-submission checklist and policy-compliance notes.

## Commonly sequenced with
- devops-worker-bee: once the Bolt app is scaffolded, for deployment infrastructure.
- security-worker-bee: for token vault design and secret rotation after this Bee flags a finding.
- python-worker-bee: when the app sits inside a larger Django/FastAPI backend.

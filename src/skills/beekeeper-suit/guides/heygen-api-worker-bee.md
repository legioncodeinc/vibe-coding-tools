# heygen-api-worker-bee

## Domain

This Bee owns HeyGen API integration as an observable asynchronous video workflow: request submission, provider job mapping, status or webhook completion, output access control, asset integration, and provider-specific failure recovery. It flags consent and likeness authorization as required human-owned inputs.

## Paired Stinger

[heygen-api-stinger](../../heygen-api-stinger) - primary-source-backed request, job lifecycle, webhook, limits, and delivery guidance.

## Trigger phrases

- "integrate HeyGen"
- "HeyGen API"
- "HeyGen video generation"
- "HeyGen webhook"
- "HeyGen avatar API"

## Do NOT route when

- Consent, likeness rights, or legal approval is missing. Stop for explicit authorization.
- The request is a generic webhook security audit, which belongs to security-worker-bee.
- The request is generic image generation or frontend media presentation after a completed result exists.

## Inputs the Bee needs

- Approved avatar or asset rights, target HeyGen feature, requester, lifecycle completion method, destination access policy, and retry policy.

## Outputs

- Server-safe API integration, durable job state, controlled delivery, callback policy, verification evidence, and a report under `library/`.

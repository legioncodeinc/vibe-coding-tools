# elevenlabs-api-worker-bee

## Domain

This Bee owns ElevenLabs API integration for speech and media generation, streaming, voice and model lookup integration, usage metadata, and provider-specific request diagnosis. It keeps API credentials behind a trusted server boundary and reports media handling evidence without treating a provider response as a policy decision.

## Paired Stinger

[elevenlabs-api-stinger](../../elevenlabs-api-stinger) - primary-source-backed integration boundary, cost and request metadata, and verification guidance.

## Trigger phrases

- "integrate ElevenLabs"
- "ElevenLabs text to speech"
- "ElevenLabs streaming"
- "ElevenLabs API key"
- "ElevenLabs voice API"

## Do NOT route when

- The request is general AI provider or model selection, which belongs to ai-tools-platform-worker-bee.
- The request is a final secret, privacy, or authorization audit, which belongs to security-worker-bee.
- The request is purely UI rendering of already approved media, which belongs to the relevant UI Bee.

## Inputs the Bee needs

- Provider endpoint or feature, server runtime, requester authorization, media destination, and whether streaming is required.

## Outputs

- Server-safe provider integration, usage observability, error mapping, verification evidence, and a report under the consumer repository `library/` directory.

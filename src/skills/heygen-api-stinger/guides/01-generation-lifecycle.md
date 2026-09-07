# HeyGen generation lifecycle

The quick start describes a first AI video as authenticate, submit a request, and get an MP4. It also states that an API key is created in Settings to authorize requests. Keep that key in server-side secret management, not a browser bundle. [raw/heygen-quick-start.md]

Model every creation as a local state machine: `requested`, `accepted`, `processing`, `ready`, or `failed`. The exact provider field and event names must come from the endpoint selected in the current HeyGen reference. A local record needs the provider job identifier, sanitized request metadata, requester authorization, retry count, and controlled result location.

HeyGen documents a webhook surface, including an endpoint deletion API that uses `X-Api-Key`. Do not infer that a received callback is trusted merely because an endpoint exists. Verify the current webhook authentication documentation and apply replay protection before acting on a callback. [raw/heygen-webhooks.md]

Before delivery, test a failure, a delayed completion, a duplicate callback, and access control for the generated media.

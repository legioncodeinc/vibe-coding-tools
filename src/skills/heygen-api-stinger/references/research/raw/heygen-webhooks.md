# Primary-source capture: HeyGen webhooks

- URL: https://developers.heygen.com/docs/webhooks
- Fetch date: 2026-09-05
- Source type: official developer documentation

The official page shows the management request `DELETE /v3/webhooks/endpoints/{endpoint_id}` with header `X-Api-Key: $HEYGEN_API_KEY`. It is evidence that webhook configuration is a distinct authenticated API surface, not a substitute for verifying inbound event authenticity.

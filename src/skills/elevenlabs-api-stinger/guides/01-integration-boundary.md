# ElevenLabs integration boundary

Start by locating the server boundary, the user authorization path, the input text source, and the destination for audio. Treat API keys, signed URLs, audio content, and any transcript as sensitive according to the consumer application's policy.

Use the official SDK or HTTP interface. The ElevenLabs introduction says both HTTP and WebSocket requests are supported and names official Python and Node libraries. Do not infer model, voice, endpoint, or pricing behavior from a copied example. [raw/elevenlabs-introduction.md]

For production calls, retain the minimum diagnostic metadata needed to reconcile a request. The official introduction demonstrates that raw responses can expose `character-cost`, `request-id`, and `x-trace-id` response headers. Never log the API key or user input merely to obtain that reconciliation. [raw/elevenlabs-introduction.md]

Verify these cases before completion:

- invalid or absent trusted-server credential
- provider error and user-safe error mapping
- cancellation or disconnect during a streamed response
- audio media type and storage access control
- consent and rights for any cloned, uploaded, or generated voice material

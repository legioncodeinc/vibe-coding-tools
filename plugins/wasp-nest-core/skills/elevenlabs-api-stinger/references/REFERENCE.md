# ElevenLabs API reference

| Decision | Default | Escalate when |
|---|---|---|
| Credential location | Server-only secret store | A client token feature is explicitly documented and fits the threat model |
| Transport | HTTPS request for finite work | The endpoint's documented streaming or WebSocket behavior is needed |
| Diagnostics | Request and cost identifiers without content | Privacy policy prohibits even metadata retention |
| Mutable IDs | Fetch or verify from live API | A deployment pins an approved immutable ID |

Source basis: [distilled-elevenlabs-api.md](research/distilled-elevenlabs-api.md).

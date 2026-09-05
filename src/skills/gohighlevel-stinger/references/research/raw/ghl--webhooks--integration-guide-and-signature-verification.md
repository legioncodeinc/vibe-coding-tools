# Webhook Integration Guide | HighLevel API (official) + highlevel-api-sdk webhook handling

- URL: https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/
- Secondary URL: https://github.com/gohighlevel/highlevel-api-sdk (Webhooks section)
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs) + official SDK README
- Component: webhooks - event categories, signature verification, key rotation timeline

## Event categories (official, outbound webhooks configured on a Marketplace app or via workflow action)

"Contact Events: Contact creation, updates, deletion, and tag changes. Opportunity Events: Opportunity lifecycle management and status updates. Task Events: Task creation, completion, and deletion. Appointment Events: Calendar appointment scheduling and updates. Invoice Events: Invoice lifecycle from creation to payment. Product Events: Product catalog management. Association Events: Relationship management between records. Location Events: Location creation and updates. User Events: User account management. And many more..." A community Rust SDK doc independently states HighLevel "sends 58 event types that share an envelope."

## Signature headers -- two schemes, one being sunset

| Header | Algorithm | Status |
|---|---|---|
| `X-WH-Signature` | RSA-SHA256 (PKCS#1 v1.5) | **Legacy -- will be deprecated; use for backward compatibility only.** |
| `X-GHL-Signature` | Ed25519 | **Current -- use this when present.** HighLevel will rely only on this header after the legacy one is removed. |

- **Deprecation date, stated explicitly: "The legacy header `X-WH-Signature` will be deprecated on September 1, 2026."** After that date, webhooks are signed only with `X-GHL-Signature`.
- Recommended verification flow: "If `X-GHL-Signature` is present, verify using the Ed25519 public key. If only `X-WH-Signature` is present (during the transition period), verify using the legacy RSA public key. Reject the request if verification fails."
- Legacy verification (Node, RSA-SHA256 over raw body, base64 signature): `crypto.createVerify('SHA256'); verifier.update(payload); verifier.verify(publicKeyPem, signature, 'base64')`.
- Current verification (Node, Ed25519): `crypto.verify(null, Buffer.from(payload,'utf8'), publicKeyPem, Buffer.from(signature,'base64'))`.
- Public keys are published in-page as PEM blocks (RSA legacy key, Ed25519 current key) -- must be pulled from the live docs page rather than hard-coded from a stale copy, since HighLevel states it "rotates this key occasionally and announces it by email and in the developer Slack" (per the Rust SDK docs' warning).

## Official SDK's own verification precedence (independent confirmation)

- "`x-ghl-signature` (Ed25519, preferred)... `x-wh-signature` (legacy fallback)... Verification order is: 1. If `x-ghl-signature` is present, SDK validates it using `WEBHOOK_SIGNATURE_PUBLIC_KEY` and does not fall back to `x-wh-signature`. 2. If `x-ghl-signature` is absent, SDK checks `x-wh-signature` using `WEBHOOK_PUBLIC_KEY`."
- INSTALL/UNINSTALL app-lifecycle events are delivered specifically to the app's "Default Webhook URL" configured in the marketplace listing, not to arbitrary subscription endpoints: "We send INSTALL and UNINSTALL events to default url only." If required signature headers/public keys are missing for these events, "SDK skips processing those events."

## Announcement of the original signing rollout (2025, for historical context)

- Prior HighLevel changelog: "Every webhook payload now includes: 1. Timestamp... 2. Webhook ID... These additions ensure that each webhook request can be uniquely identified and time-validated to prevent replay attacks." This is the origin of the `x-wh-signature` scheme now being sunset in favor of Ed25519.

## Replay-window recommendation

- Community Rust SDK docs (generated against the same signing scheme): "the replay-window check HighLevel recommends (they suggest 5 minutes)" -- i.e., reject any webhook whose `timestamp` is more than 300 seconds old, in addition to verifying the signature.

## Notes for the distillation

The September 1, 2026 legacy-header sunset is a hard, dated fact from the official docs -- **any integration built after this research date must implement Ed25519 verification via `X-GHL-Signature` as primary**, with RSA/`X-WH-Signature` only as a bridge for webhooks already configured before the cutover. Always verify the **raw** request body bytes, not a re-serialized JSON object -- re-serialization can reorder keys and invalidate the signature (explicitly warned by the Rust SDK docs).

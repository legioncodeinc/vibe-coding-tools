# Webhook Integration Guide - HighLevel (GoHighLevel) API Docs

- URL: https://marketplace.gohighlevel.com/docs/webhook/WebhookIntegrationGuide/
- Fetched: 2026-08-14
- Source type: official vendor documentation (GoHighLevel/HighLevel)
- Component: GoHighLevel webhook intake (`+server.ts` route receiving GHL events)

## Signature headers

| Header | Algorithm | Status |
|---|---|---|
| `X-WH-Signature` | RSA-SHA256 (PKCS#1 v1.5) | Legacy - deprecated 2026-09-01; back-compat only |
| `X-GHL-Signature` | Ed25519 | Current - prefer whenever present |

GHL signs the webhook BODY with its private key; the integration verifies with GHL's published public key(s) (one RSA key for the legacy header, one Ed25519 key for the current header). Recommended verification flow, verbatim intent: "If `X-GHL-Signature` is present, verify using the Ed25519 public key. If only `X-WH-Signature` is present (during the transition period), verify using the legacy RSA public key. Reject the request if verification fails." After 2026-09-01 only `X-GHL-Signature` will be sent.

```javascript
function verifyGhl(payload, signature, publicKeyPem) {
  if (!signature || signature === 'N/A') return { ok: false, reason: 'no signature' };
  const payloadBuffer = Buffer.from(payload, 'utf8');
  const signatureBuffer = Buffer.from(signature, 'base64');
  const ok = crypto.verify(null, payloadBuffer, publicKeyPem, signatureBuffer); // Ed25519: no digest algo arg
  return { ok, reason: ok ? null : 'verify failed' };
}
```
The signature must be verified against the RAW payload bytes exactly as received - the reference SDK docs elsewhere warn "Always verify the raw bytes you received. Re-serializing parsed JSON can reorder keys or change spacing, which invalidates the signature," the same class of pitfall documented for Stripe.

## Reliability model (relevant to idempotency and replay handling)

- Retries: any non-2xx response (including timeouts/connection failures) is retried up to 12 times (excluding the original attempt) using exponential backoff with random jitter, to avoid a "thundering herd" of simultaneous retries. Retries stop as soon as any 2xx is received.
- Guidance: "Return 200 OK for Success" and even "Return 200 OK Even for Processing Errors" - GHL wants the endpoint to acknowledge RECEIPT (2xx) even if internal processing later fails, and reserve non-2xx status codes for genuine delivery/availability problems (e.g. `408` too slow, `5xx` endpoint unavailable) rather than app-level business logic failures. This means idempotency and error handling must happen INSIDE the handler after the 200 is decided, not by using HTTP status to signal app-level failure back to GHL.
- Duplicate handling: official best practice is to store processed `webhookId` values and check for duplicates before processing, i.e. explicit idempotency-key tracking, the same pattern documented for Stripe.
- Circuit breaker / URL health: GHL evaluates each subscribed webhook URL roughly every 3 days using the trailing 3 days of delivery data, but only for URLs receiving more than 10,000 webhooks in that window. If the success rate is below 90%, first flag sends a warning email/dashboard notice; if still below 90% three days later, GHL PAUSES delivery to that URL entirely until the integration re-enables the affected event subscriptions from the marketplace dashboard. An audit of a GHL integration should confirm someone is actually watching for this warning email, since a silent pause looks identical to "no new leads" from the receiving application's point of view.

## SSRF-adjacent risk (not directly documented by GHL, extrapolated from the OWASP Top 10 SSRF-into-Broken-Access-Control consolidation - see the OWASP Top 10:2025 source)

GHL's guide does not document an SSRF-specific control for user-supplied callback/webhook target URLs, because GHL's webhook URL is configured by the RECEIVING app's own developer via the OAuth app dashboard, not supplied per-request by an end user. The SSRF risk in this integration direction is therefore on the RECEIVING SvelteKit app's own code, not GHL's delivery mechanism: any code path where the app itself makes an outbound HTTP request to a URL that originated from GHL webhook payload data (e.g. an "avatar URL," "attachment URL," or similar field inside a `ContactCreate`/`ContactUpdate` payload) that the app then fetches server-side is a standard SSRF vector per OWASP A01:2025 (SSRF is folded into Broken Access Control for 2025) and must be treated with the same allowlisting/no-internal-address-resolution controls as any other user-influenced outbound fetch.

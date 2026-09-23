# Example: `Route` row (type=api)

A fully-populated `api` route. This is a partner-facing (external-contract) webhook-receiver route: demonstrates every field including the longer sunset window rule.

## Code

```ts
// api/src/routes/webhooks/stripe.ts

/**
 * @route webhook.stripe.inbound
 * @feature billing.stripe-integration
 * @auth service
 * @externalContract true
 */
export default async function stripeWebhookHandler(req, reply) {
  // ...
}
```

## Registry row

```ts
{
  id: "clx9z8y7w6v5",
  key: "webhook.stripe.inbound",
  type: "webhook_inbound",
  path: "/api/webhooks/stripe",
  method: "POST",
  featureKey: "billing.stripe-integration",
  renderedPageKey: null,
  auth: "service",
  rateLimit: "100/min",
  permissionsRequired: [],
  version: "v1",
  externalContract: true,
  status: "active",
  environments: ["dev", "staging", "prod"],
  ownerTeam: "billing",
  prdRef: "BILL-001",
  deprecatedAt: null,
  sunsetAt: null,
  notes: "Stripe-signed webhook; signature verification in the handler.",
  createdBy: "sync-generator@ci",
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-04-23T02:00:00.000Z",

  // Generator-owned
  handlerFilePath: "api/src/routes/webhooks/stripe.ts",
  handlerExport: "default",
  fileHash: "9f8e7d6c5b4a9f8e7d6c5b4a9f8e7d6c5b4a9f8e7d6c5b4a9f8e7d6c5b4a9f8e",
  openapiRef: "https://docs.example.com/api/webhooks/stripe",
  detectedAt: "2026-01-15T10:00:00.000Z",
  lastSeenAt: "2026-04-23T02:00:00.000Z",
}
```

## Rule note: external-contract sunset

Because `externalContract: true`, if this route is ever deprecated, the sunset window is **180 days** (not the standard 90). Partners need time.

## Checklist (filled)

- [x] File exists at `api/src/routes/webhooks/stripe.ts`
- [x] `type: webhook_inbound` matches code shape
- [x] `(path, method, version)` unique
- [x] `auth: service`: Stripe authenticates via signature
- [x] `externalContract: true` flagged
- [x] `featureKey` set

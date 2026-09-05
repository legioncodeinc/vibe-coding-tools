# GoHighLevel/highlevel-api-sdk (official TypeScript SDK)

- URL: https://github.com/gohighlevel/highlevel-api-sdk
- Fetched: 2026-08-14
- Source type: Official (HighLevel-maintained GitHub repo, npm package `@gohighlevel/api-client`, MIT license)
- Component: SDK, auth token priority, error handling, token refresh, service catalog

## Package facts

- Install: `npm install @gohighlevel/api-client`. Requires Node.js >= 18.0.0. Latest observed version at research time: `3.0.0` (published 2026-05-01), with version history showing steady releases from `1.0.0` (2025-08-25) through `2.3.0`/`3.0.0` (both 2026-05-01) -- i.e., a `3.0.0` SDK major-version bump landed the same day as the last `2.x` release, consistent with (but not proof of) the platform's own v3 rollout.

## Token priority (three types, this SDK's own hierarchy)

1. "Private Integration Token -- **Highest priority** -- Used for private integrations. Full access to all API endpoints. Managed through your HighLevel app settings."
2. "Agency Access Token -- Used for agency-level operations. Access to agency and sub-account data. Obtained through OAuth 2.0 flow."
3. "Location Access Token -- Used for location-specific operations. Access to single location data. Obtained through OAuth 2.0 flow."

## Automatic token refresh

- "The SDK automatically attempts to refresh expired tokens when: A 401 (Unauthorized) response is received. Valid refresh tokens are available. OAuth client credentials are configured."
- Session storage: in-memory by default ("data will be stored in memory by default and will be lost on application restart. This is not recommended for production"); official `MongoDBSessionStorage` provided, or implement a custom `SessionStorage` subclass (Redis, etc.) with `setSession`/`getSession`/`deleteSession`.

## Error handling (`GHLError`)

```typescript
try {
  const contact = await ghl.contacts.getContact({ contactId: 'invalid-contact-id' });
} catch (error) {
  if (error instanceof GHLError) {
    switch (error.statusCode) {
      case 401: console.log('Authentication failed - check your tokens'); break;
      case 404: console.log('Contact not found'); break;
      case 429: console.log('Rate limit exceeded - retry after delay'); break;
      default: console.log('Other API error occurred');
    }
  }
}
```

- `GHLError` exposes `message`, `statusCode`, `response`, `request`.

## Webhook middleware

```typescript
app.use(bodyParser.json());
app.use('/webhooks/ghl', ghl.webhooks.subscribe());
app.post('/webhooks/ghl', async (req, res) => {
  console.log(req.isSignatureValid); // boolean, set by the SDK
  res.json({ success: true });
});
```

- Manual verification also exposed: `ghl.webhooks.verifySignature(payload, signature, ghlPublicKey)` (legacy RSA) and `ghl.webhooks.verifyEd25519Signature(payload, signature, newGhlPublicKey)` (current).
- `INSTALL`/`UNINSTALL` app-lifecycle events handled specially: on bulk install, the SDK "will generate and store the token for all the locations for which installation was triggered"; on uninstall, it "will remove token for that from the storage."

## Service catalog exposed by the SDK (confirms the resource surface independently of the brewedops.com v3 catalog)

associations, blogs, businesses, calendars, campaigns, companies, contacts, conversations, courses, customFields, customMenus, emails, forms, funnels, invoices, links, locations, marketplace, medias, oauth, objects, opportunities, payments, products, saas, snapshots, socialPlanner, surveys, users, workflows.

## Notes for the distillation

The SDK's token-priority order (PIT beats Agency beats Location, when multiple are configured) is a useful default for any wrapper code choosing which credential to use when more than one is available. The service catalog independently corroborates the v3 resource-catalog blog post's list almost exactly, lending it more credibility despite the versioning-status conflict noted elsewhere.

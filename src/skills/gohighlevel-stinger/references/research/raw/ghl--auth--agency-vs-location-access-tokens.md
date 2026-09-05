# Handling Access Tokens for Apps with Target User: Agency | HighLevel API

- URL: https://marketplace.gohighlevel.com/docs/Authorization/TargetUserAgency
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs)
- Component: auth - agency-targeted token exchange, worked example

## Key facts

- "This guide explains how the installation flow works for the Agency targeted APPs, how to obtain the access token. For apps whose Target User is set as Agency, the app will only be visible to the Agency Admin/Owner, and only they can install it."
- Flow: "1. Install the app on your Agency account. 2. After installation, the redirect URL will be triggered from our end, and the authorization code will be shared. 3. Use this authorization code to exchange for an Access Token using the Get Access Token API endpoint. Note: The Access Token generated will be of user type company (Agency Level Token)."

## Worked token exchange example

```bash
curl -X POST \
  https://services.leadconnectorhq.com/oauth/token \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'client_id=68a2fd84fab6670f45220ebf-megyp358' \
  -d 'client_secret=<GHL_CLIENT_SECRET>' \
  -d 'grant_type=authorization_code' \
  -d 'code=16d0b6ceb51350ba437870074ad25bc65e8c1d8d' \
  -d 'user_type=Company'
```

Response shape:

```json
{
  "access_token": "<GHL_ACCESS_TOKEN>",
  "token_type": "Bearer",
  "expires_in": 86399,
  "refresh_token": "<GHL_REFRESH_TOKEN>",
  "scope": "locations.write",
  "refreshTokenId": "<GHL_REFRESH_TOKEN_ID>",
  "userType": "Company",
  "companyId": "GNb7aIv4rQFVb9iwNl5K",
  "isBulkInstallation": false,
  "userId": "Rg6BRRiHh7dS9gJy3W8a"
}
```

## Notes for the distillation

`expires_in: 86399` (one second short of 24 hours) is a first-party, machine-verifiable confirmation of the ~1-day access token lifetime the community post in `ghl--auth--token-lifetimes-and-flow-variants.md` claimed. This closes that gap: **access tokens expire in ~86,399 seconds (~24 hours)**, confirmed from an official worked example's response body. `userType: Company` on the response is how code should detect "this is an agency-level token" and decide whether to call `/oauth/locationToken` before any location-scoped endpoint.

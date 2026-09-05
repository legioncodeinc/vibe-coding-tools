# OAuth 2.0 | HighLevel API (official developer docs)

- URL: https://marketplace.gohighlevel.com/docs/Authorization/OAuth2.0/
- Fetched: 2026-08-14
- Source type: Official (HighLevel Developer Marketplace docs)
- Component: auth - OAuth 2.0 authorization code flow

## Key facts

- "HighLevel supports the Authorization Code Grant flow with v2 APIs."
- App distribution setting "Who can install: ... The recommended setting is `Both Agency & Sub-account` to ensure maximum visibility and adoption of your app... if you're building a fully white-labeled SaaS feature intended to be exclusively discovered and installed by agencies for use within their sub-accounts, you may choose to limit visibility to Agencies only."
- Flow steps: "Have the location/agency admin visit your Installation URL. Select the location to connect. Redirected to your Redirect URL with an Authorization Code. Exchange the code for an Access Token via the OAuth 2.0 Get Access Token API. Use the Access Token to call APIs."
- Two access token types: "1. Access Token with User Type as Agency: This Type of Access Token will be utilized to run the APIs related to the Agency Functionalities. For eg; Create Sub-Account API. 2. Access Token with User Type as Location: This Type of Access Token will be utilized to run the APIs related to the Sub-Account or Location Functionalities. For eg; Create Contact API."
- "Create Sub-Account Token from Agency Token: Suppose you have an Agency-level Access Token but want to run API endpoints specific to a Sub-Account (Location). In that case, you can use the Agency-level Access Token to generate a Sub-Account/Location-level Access Token via the Get Location Access Token from Agency Token API endpoint."

## Token exchange (agency token -> location token)

```
curl -L "https://services.leadconnectorhq.com/oauth/locationToken" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "Version: 2021-07-28" \
  -H "Authorization: Bearer <agency_access_token>" \
  -d '{
    "companyId": "GNb7aIv4rQFV9iwNl5K",
    "locationId": "HjiMUOsCCHCjtxEf8PR"
  }'
```

- Companion endpoint doc (`marketplace.gohighlevel.com/docs/ghl/oauth/get-location-access-token/`): `POST /oauth/location-token` -- "This API allows you to generate locationAccessToken from AgencyAccessToken."

## PKCE support (per HighLevel Support Portal companion article)

- "HighLevel Marketplace also supports OAuth 2.0 with PKCE for external authentication. Enable PKCE when your integration uses a public client (for example, browser-based or mobile apps) or when your OAuth provider requires PKCE. When PKCE is enabled, the authorization request includes a `code_challenge` and `code_challenge_method` (`S256`), and the token request includes the matching `code_verifier`."

## Notes for the distillation

Confirms the base OAuth authorization-code flow, the existence of two distinct token "user types" (Company/Agency vs Location), and the dedicated agency-to-location token exchange endpoint. This is the mechanism an app with `isBulkInstallation: true` must use to reach individual sub-accounts after an agency-level install (see `ghl--marketplace--app-creation-and-distribution-model.md`).

# Google Identity Services (GIS) Migration

**Sources:**
- https://developers.google.com/identity/oauth2/web/guides/migration-to-gis
- https://developers.google.com/identity
- https://developers.google.com/identity/gsi/web

**Retrieved:** 2026-04-25

## Summary

The legacy Google Sign-In JavaScript Library (`apis.google.com/js/platform.js` and `gapi.auth2`) is deprecated. New clients use Google Identity Services (`https://accounts.google.com/gsi/client`).

## What changed

- Old library bundled identity + authorization in one client SDK.
- GIS separates them: **Sign in with Google** for identity (returns ID token), and **OAuth 2.0 Authorization Code flow with PKCE** for authorization (server-side; returns access + refresh tokens).
- Old SDK initialized with `gapi.auth2.init()`. GIS initializes with `google.accounts.id.initialize()` and `google.accounts.oauth2.initCodeClient()` separately.
- Old library: implicit flow common (`response_type=token`). GIS: authorization code flow with PKCE is the default.

## Migration shape

- Client-side sign-in button → migrate to `<div id="g_id_onload">` with `data-callback`.
- Client-side OAuth → migrate to authorization code flow on the server.
- One Tap UX (passive prompt on page load) → `google.accounts.id.prompt()`.

## Why it matters

- New Google OAuth clients should not adopt deprecated library; the migration cost grows.
- For server-side OAuth, the Web Server flow remains the canonical pick (authorization code + PKCE).
- For client-side identity, GIS One Tap or Sign In With Google button is the modern shape.

## Relevance

- `guides/06-google-oauth.md` §"Google Identity Services (GIS): for client-side sign-in".
- `guides/00-principles.md` Principle 8.

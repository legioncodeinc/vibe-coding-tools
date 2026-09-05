# The OAuth Flows of HighLevel (Sean Kerr / cbnsndwch)

- URL: https://seankerr.dev/posts/the-oauth-flows-of-highlevel/
- Fetched: 2026-08-14
- Source type: Community/developer blog (secondary), guest post referencing RFC 6749
- Component: auth - token lifetimes, public vs private app flow variants

## Key facts

- "HighLevel's API v2 uses the OAuth 2.0 Authorization Code flow for authentication. This means that in order for your app or integration to make API calls, you'll need to implement an OAuth client that can receive Authorization Codes, exchange them for a pair of Access Token + Refresh Token, and save them both to persistent storage for continued use."
- Two flow variants: "For verified, approved, public Marketplace Apps, the HighLevel web app takes care of most of the heavy lifting. It provides discovery and a UI for installing apps into agencies and/or locations." vs "For private Marketplace Apps -- that is, apps that have not been reviewed by HighLevel and will therefore not be listed inside the HighLevel web app -- you are responsible for initiating the OAuth flow on your end. You will need to prepare an Authorization URL containing your app's Client ID and any scopes your app needs, and send the user to it."

## Token lifetimes (author states these are clarified answers to HighLevel's own FAQ)

- "How long are Access Tokens valid for? Access Tokens are valid for a day. After that, you can use the Refresh Token to get a new Access Token which will be valid for another day."
- "How long are Refresh Tokens valid for? Refresh Tokens are valid for a year or until they are used once, whichever comes first. When you call the /token endpoint with a Refresh Token instead of an Authorization Code, that refresh Token will become invalid and you'll get a new one in the response. Save the new token in your database or storage service in place of the original one."

## Notes for the distillation

This is a community source, not official documentation, and the post is dated 2024 (unclear if still current for 2026 v2/v3). Treat the "1 day access token / 1 year-or-single-use refresh token" figures as **likely but unconfirmed against a first-party source in this archive** -- no official marketplace.gohighlevel.com page in this research set states exact token TTLs in numeric form. Flag this as a gap: an integration should read `expires_in` from the actual token response rather than hard-coding "24 hours." The refresh-token-rotates-on-use behavior (old refresh token invalidated, new one issued) is a load-bearing operational detail for anything persisting tokens.

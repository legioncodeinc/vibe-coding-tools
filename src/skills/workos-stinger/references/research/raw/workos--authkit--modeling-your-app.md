# Modeling Your App - AuthKit

- URL: https://workos.com/docs/authkit/modeling-your-app
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: AuthKit / architecture decision

## Content

Two ways to integrate AuthKit:

- **AuthKit hosted login solution** - provides a customizable UI and supports a wide range of authentication methods. In the majority of cases WorkOS recommends using the hosted AuthKit solution.
- **AuthKit APIs directly** - for teams that prefer to craft their own UI in their own stack.

On successful completion, AuthKit returns an authentication code to the application via the specified redirect URI. This code is exchanged for the user object and used to create a session.

### AuthKit vs. standalone SSO

The AuthKit and SSO products can be used independently, with SSO acting as authentication middleware which intentionally does not handle user database management for your application. If unsure which is best, WorkOS recommends sticking with AuthKit, since it gives the flexibility to add and/or remove features (SSO, MFA, Magic Auth, etc.) as needs grow, without re-architecting the auth layer.

# Hosted UI - AuthKit

- URL: https://workos.com/docs/authkit/hosted-ui
- Fetched: 2026-08-14
- Source type: Official docs (workos.com/docs)
- Component: AuthKit / Hosted UI

## Content

Implementing authentication flows that handle every possible error state and edge case across multiple identity providers can be a daunting task. AuthKit makes this easy by providing a hosted, pre-built, customizable authentication UI with automatic handling of:

- Sign up, sign in, password reset, and email verification flows.
- Enterprise SSO routing and MFA enrollment.
- Automatic bot detection and blocking, to protect against brute force attacks.
- Customizable domain and branding.

### Authentication flow

AuthKit is conceptually similar to a Social Login (OAuth) experience, but with the added benefit of being able to authenticate users with any identity provider.

AuthKit sits outside of your application code. When a user initiates a sign-in request, your application redirects them to the AuthKit URL. The user then completes the authentication process with WorkOS before being returned to the application.

Your application exchanges the resulting authorization code to retrieve an authenticated User object and handle the session.

> The AuthKit flow abstracts away many of the UX and WorkOS API calling concerns automatically. For more guidance on integrating with AuthKit, see the Quick Start guide.

AuthKit also provides a signup flow for creating users. Available options are determined by the configured authentication methods. If a user's email address is associated with an SSO connection, they are automatically redirected to sign up via their IdP.

### Authentication methods

AuthKit's hosted UI supports all of the authentication methods available and automatically adjusts the available options depending on the configured methods in the *Authentication* section of the WorkOS Dashboard.

Email + Password authentication is enabled by default, though setup may be required to enable additional methods:

- Single Sign-On
- Email + Password
- Social Login
- Multi-Factor Auth
- Magic Auth

### Two integration routes

**(A) Integrate with AuthKit's Hosted UI** - In just a few lines of code, add AuthKit to your app and start authenticating users. Fastest way to integrate.

**(B) Build your own authentication flows** - If you'd prefer to build and manage your own authentication UI, do so via the AuthKit API directly (headless mode).

# 01. Choose your AuthKit mode

## Decision

For a SvelteKit app on Vercel, default to **AuthKit's hosted UI**. Only drop to the headless Authentication API for one specific screen that genuinely can't be reached through hints, branding, or custom CSS.

## Why

AuthKit's hosted UI handles sign up, sign in, password reset, email verification, enterprise SSO routing, MFA enrollment, and automatic bot detection for you [raw/workos--authkit--hosted-ui-overview.md]. Building and maintaining all of that yourself is the real cost of going headless - not just the login form.

WorkOS's own decision framework, restated directly: if the ask is "change how a screen looks" or "change which screen someone lands on," reach for a `screen_hint`, `organization_id` hint, dashboard branding, or custom CSS first. Reserve the full Authentication API for the case where the hosted UI's customization ceiling has genuinely been hit - typically one narrow in-app screen (e.g. an "add a teammate" flow), not a wholesale replacement. Reaching for the API before trying hints/branding/CSS is called out as the most common overcorrection [raw/workos--authkit--branding-customization.md].

## The three integration routes

| Route | What it is | Use when |
| --- | --- | --- |
| AuthKit hosted UI | Redirect to a WorkOS-hosted (or custom-domain) login page; exchange the returned code for a session | Default for essentially every app - this is what the guides in this skill assume from guide 02 onward |
| AuthKit headless / Authentication API | Call `authenticateWithPassword`, `authenticateWithMagicAuth`, etc. directly, build your own forms | Only for the one screen that survived the branding/CSS ceiling test above |
| Standalone SSO (no AuthKit) | SSO as pure auth middleware, no WorkOS-managed user database | Rare - even SSO-only apps are usually better served starting on AuthKit, since it preserves the option to add MFA, Magic Auth, or password auth later without re-architecting the session layer [raw/workos--authkit--modeling-your-app.md] |

## What this means for a SvelteKit/Vercel stack specifically

- Guide 02 (`02-authkit-integration-sveltekit.md`) wires the hosted UI via the SvelteKit SDK.
- If a specific screen later needs the headless API, that screen alone calls the Authentication API endpoints directly (e.g. `authenticateWithPassword`, `authenticateWithMagicAuth` - see `references/research/raw/workos--authkit--mfa-passkeys-magic-auth.md` for the Magic Auth call shape as a worked example) while every other screen stays on the hosted UI. Don't rebuild the whole auth surface just because one screen needs custom UI.

## Next

See `02-authkit-integration-sveltekit.md` for the concrete SvelteKit wiring.

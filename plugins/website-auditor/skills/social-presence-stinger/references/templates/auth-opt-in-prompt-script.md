# Per-platform authentication opt-in prompt script

Copy-ready prompt text for the harness-browser authentication flow this Drone owns (build plan Q7, PRD-012's sibling pair PRD-017 AC-1). Ask once per platform where a profile was found (found-active or found-dormant, never for not-found platforms, since a not-found platform has nothing to authenticate into). Never ask before confirming the harness's browser tool actually supports interactive authentication (see guide 03 step 1).

```markdown
This audit found a {platform} presence for {domain}: {profile URL}.

Some data on {platform} (follower growth rate, reach trend, impressions-vs-reach ratio,
and audience demographics) is only visible to someone logged into that account's own
analytics, not from the public profile view.

Would you like to log into {platform} yourself, through this session's browser, so this
audit can include that data? Nothing is sent anywhere else and no credentials are seen
or stored by this Drone.

- Yes: {harness instruction for how the user hands control to the browser tool for
  the login step, then hands it back}
- No / skip: this platform's login-gated checks will be marked not-applicable and
  excluded from the score entirely. This is never scored as a failure.
```

## Rules this script encodes

- Ask per platform, not once for all three. A user may want to authenticate LinkedIn but not Instagram.
- Never present a decline as a negative outcome in the prompt's own wording ("skip" is neutral, not "give up" or "miss out").
- If the harness has no browser-authentication capability at all, do not show this prompt; go straight to the silent no-op path (guide 03).

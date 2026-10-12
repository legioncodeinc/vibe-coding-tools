## Device facts: macdev (always-on agent plane)

- Fabric bearer key: ~/fabric/secrets/master.key (or fabric.key), or the
  FABRIC_MASTER_KEY env var. Referenced by path only, never inlined or
  committed.
- Any device change lands in docs/status.md in the macdev control repo the
  same session, with verification output. Device changes follow the phases
  and gates in docs/plan.md.
- MagicDNS names only (macdevs-macbook-pro.tail8264da.ts.net), never raw
  Tailscale IPs, they drift.
- Secrets stay on device (keychain or device-local env files), referenced by
  name only.

## jev gate verdicts (PreToolUse tool gate)

Agent sessions here run behind the jevengineeringgate PreToolUse hook.

- An "ask" verdict is an in-session confirmation prompt Chris answers.
  Once approved, execute that exact call; do not reformulate it to dodge
  the prompt. Chris approving the prompt satisfies the hard-stop
  confirmation for that call, no second ask in chat.
- A "deny" verdict is a stop-and-ask, never a wall and never a retry
  target. Do not reshape the command and try again. Quote the exact
  denied command, tell Chris he can run it himself with `! <command>`,
  and continue every part of the task the deny does not cover.
- Never bypass a denial: no JEV_HOOKS_DISABLE, no threshold edits, no
  gate cache deletion, and no routing the command through another tool,
  session, or worker.

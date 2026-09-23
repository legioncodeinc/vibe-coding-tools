# 08: Companion Agent Handoff

Once the seven-artifact folder is populated, this Drone's job is done.
The companion Drone (`ux-ui-svelte-wasp-drone`) takes ownership and enforces
the system over time.

## The clean-handoff principle

- `design-system-wasp-drone` **creates**. It bootstraps from scratch for
  new products.
- `ux-ui-svelte-wasp-drone` **maintains**. It reviews PRs, flags drift, authors
  incremental updates, archives superseded sections.

The Drones are paired but strictly separated. After bootstrap, the
builder never looks at the system again unless a major overhaul is
commissioned.

## Handoff mechanics

### 1. Populate the README with ownership

`README.md` names the owning Drone explicitly:

```markdown
## Change control

The [`ux-ui-svelte-wasp-drone`](../../../.claude/agents/ux-ui-svelte-wasp-drone.md) subagent
owns this folder. A PR that changes UI in a way not already described
here must either (a) land an update to this folder as part of the same
PR, or (b) be rejected by `quality-wasp-drone` with a pointer back here.
```

This paragraph is what keeps the system from drifting.

### 2. Status table

Include a status table so future readers can see what's authored, what
was aligned, and when.

```markdown
| Item               | Status                          |
|--------------------|---------------------------------|
| Design brief       | Authored YYYY-MM-DD             |
| Tokens / CSS layer | Authored YYYY-MM-DD             |
| Component briefs   | Authored YYYY-MM-DD             |
| Screen briefs      | Authored YYYY-MM-DD             |
| HTML examples      | Authored YYYY-MM-DD             |
| Code alignment     | Pending / In progress / Aligned |
```

### 3. Commit message convention

Both Drones inherit:
`<drone-name>: <section>: <change>`

So the git log reads:
- `design-system-wasp-drone: initial: bootstrap ux-ui folder`
- `ux-ui-svelte-wasp-drone: cards-and-surfaces: add subtle hover lift`
- `ux-ui-svelte-wasp-drone: tokens: add --dur-xslow for modal entry`

### 4. Optional: stub the companion Drone

If the consumer product doesn't yet have `ux-ui-svelte-wasp-drone`, emit a stub
at `.claude/agents/ux-ui-svelte-wasp-drone.md` with:

- A pointer to the new folder.
- The list of guardrails (from `00-principles.md`).
- The change-control paragraph.

Leave the stub at "draft" status; `drone-creator` finishes it in Phase
3 of the Legendary Drone Factory pipeline.

## What this Drone does NOT do after handoff

- It does not review PRs.
- It does not approve design changes.
- It does not enforce tokens in component code.
- It does not author PRDs that reference the system.
- It does not touch the system again unless commissioned for a major
  overhaul (e.g., rebrand, aesthetic shift, v2).

## Triggering this Drone again (rare)

Re-invoke `design-system-wasp-drone` only when:

1. **Major rebrand.** The product is changing its aesthetic wholesale
   (new palette, new typography, new depth language). Treat as a fresh
   bootstrap; new timestamps, new principles section.
2. **Product split.** One product spins off into two, and the second
   needs its own design system.
3. **Platform expansion.** The product adds a surface (e.g., adds an
   iOS native app) that needs its own dedicated spec layer.

For anything less than that (a new component, a new screen, a token
addition, a dark-mode rollout), `ux-ui-svelte-wasp-drone` handles it.

## The clean-ownership test

After handoff, if a reader cannot answer the question "who owns this
folder?" in under 10 seconds, the README is broken. The answer should
be unmissable in the first paragraph of `README.md` and in the
`## Change control` section.

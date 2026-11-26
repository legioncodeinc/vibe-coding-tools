# Product Studio

Turn an idea into a buildable plan: product strategy, Claude-Design-grade UX, a PRD map, a wave plan and a Definition of Done. Run `/product-studio:plan-product` to go through strategy, design and planning in order, approving each stage. New feature ideas that arrive mid-build go to KIPP in the TARS desk instead.

Requires `wasp-nest-core`. Running the build afterwards with `/tars` also needs `data-and-ai-tools` and Claude Code Desktop (see the prerequisites below); without them, use `/smoke-it` from Core once the PRDs and contracts exist. See the [How We Build](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/learn/guides/HOW-WE-BUILD.md) guide in `wasp-nest-core` for where this fits in the full workflow.

<!-- wasp-pack-guide:start -->
## Choose a capability

This pack contains 3 skills, 3 agents and 1 source command. The table explains each source skill; open its linked instructions for exact inputs, outputs and limits.

| Skill | What it does and when to use it |
| --- | --- |
| [product-design-stinger](skills/product-design-stinger/SKILL.md) | Turn a product strategy into a UX package: journeys, IA, flows, screen states, WCAG 2.2 AA, HTML prototypes, critique, Claude Design round trip. |
| [product-planning-stinger](skills/product-planning-stinger/SKILL.md) | Turn an approved strategy and UX package into a PRD map, saved wave plan, project Definition of Done and handoff packet. Use to plan the build order. |
| [product-strategy-stinger](skills/product-strategy-stinger/SKILL.md) | Turn a product idea or existing repo into a one-page Product Strategy by interviewing the owner: customer, positioning, bets, north star, v1 scope, riskiest assumption. |

## Start one task

Required packs: `wasp-nest-core`

Install the selected pack and its prerequisites through the marketplace. For the version 3 layout, purge the previous installation first. Select the skill shown by your client, or paste this request with real paths and scope:

After adding the Wasp Nest marketplace, Claude Code uses these installation instructions:

```text
/plugin install wasp-nest-core@wasp-nest
/plugin install product-studio@wasp-nest
```

Other clients use their plugin selection UI or discovered skill selector. Installing a package and invoking a task are separate steps.

```text
Run /product-studio:plan-product for [product idea or repository]. Interview me for the strategy first, then design, then the build plan, and wait for my approval at each stage.
```

Expected result: An owner-approved Product Strategy, UX package with prototypes, PRD map, saved wave plan, project Definition of Done and a handoff packet. After your approval the packet goes to Library to write the PRDs and to Contract Writing to draft the contracts; this command writes no application code.



Claude Code plugin command names:

| Command | What it does |
| --- | --- |
| `/product-studio:plan-product` ([procedure](commands/plan-product.md)) | Plan a product before building it: strategy, then UX design, then the build plan (PRD map, wave plan, Definition of Done), with owner approval at each gate and handoffs to Library and Contract Writing. |

## Agent responsibilities

| Agent | Responsibility | Paired skill |
| --- | --- | --- |
| [product-design-wasp-drone](agents/product-design-wasp-drone.md) | Turn a product strategy into a UX package: journeys, IA, Mermaid flows, screen states, WCAG 2.2 AA baseline, light and dark HTML prototypes, scored critique, Claude Design brief and import. | [product-design-stinger](skills/product-design-stinger/SKILL.md) |
| [product-planning-wasp-drone](agents/product-planning-wasp-drone.md) | Plans the build from an approved strategy and UX package: PRD map, saved wave plan with Mermaid graph, project Definition of Done and handoff packet. | [product-planning-stinger](skills/product-planning-stinger/SKILL.md) |
| [product-strategy-wasp-drone](agents/product-strategy-wasp-drone.md) | Interview the owner and write a one-page Product Strategy to library/knowledge/private/product/: customer, job, positioning, 2 to 4 bets, north star plus 3 inputs, v1 and NOT-in-v1, riskiest assumption. | [product-strategy-stinger](skills/product-strategy-stinger/SKILL.md) |

Codex can use the named skill or its generated `source-command-<name>` wrapper where a source command exists. Home installations may expose flat commands. Use the actual selector offered by the host. A pack with no paired agents runs its standalone skills directly; a skill name does not prove that a native agent was launched.

## Prerequisites and boundaries

- `deeper-customer-and-market-research` also needs `growth-and-customer-tools`, `business-and-product-tools`.
- `design-system-and-polish` also needs `web-development-tools`.
- `live-app-capture-for-claude-design` also needs `browser-and-app-testing-tools`.
- `pricing` also needs `software-economics-tools`.
- `plan-product (build handoff to /tars and KIPP)` also needs `data-and-ai-tools`.

Core supplies shared routing and review methods. Native Codex role registration requires the explicit installed-plugin registry and trusted Core hook; a marketplace selection alone is not proof of registration. Read the linked skill before work. Missing source, browser, connector, renderer or account access is a reported gap. Installation does not authorize sending, publishing, paid work or live settings changes.
<!-- wasp-pack-guide:end -->

# ux-ui-wasp-drone

**Plugin owner:** `web-development-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain
This Drone is the steady-state design-system owner and enforcer for the deploying product. It opens the product's source-of-truth design-system folder (tokens, utilities, components, screens) on every UI question, cites the governing section, and specifies pixel-perfect deltas in token-named terms. It governs integration with four reference libraries: shadcn/ui, Mantine, Lucide-react, and Framer Motion, always through wrapper components rather than direct consumption.

If the design-system folder does not yet cover a question, this Drone updates the folder first, then answers, so the system stays the source of truth rather than drifting from what actually gets enforced.

## Paired Stinger
[ux-ui-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/web-development-tools/skills/ux-ui-stinger) - the enforcement procedure, token and utility rules, motion rules, and per-library integration guides for shadcn/ui, Mantine, Lucide-react, and Framer Motion.

## Trigger phrases
- "review this UI"
- "is this on-brief?"
- "which component library for X?"
- "wrap this shadcn primitive"
- "motion spec for this transition"
- "update the design brief"
- "token drift audit"

## Do NOT route when
- The task is back-end, data, or asset-registry work: route to `library-wasp-drone`, `react-wasp-drone`, or `asset-wasp-drone`.
- The task is building a design system from scratch: route to `design-system-wasp-drone`.
- The task is a system-level change, such as a new aesthetic, a library migration, or a major token restructure: route to `design-system-wasp-drone`.
- The task is a React component's implementation logic with no visual delta at stake: route to `react-wasp-drone`.

## Inputs the Drone needs
- The product's design-system folder path and which section governs the question at hand
- The exact file and line range of the code under review
- Which of the four reference libraries, shadcn/ui, Mantine, Lucide-react, or Framer Motion, is in play
- Any product-specific non-negotiables documented in that product's own knowledge-base folder
- Whether the change is a component-level delta or a system-level change, to route the latter correctly

## Outputs
- A cited review with `path:startLine-endLine` references and a proposed delta in token-named terms, using `templates/review-output.md`
- A new or updated component or screen spec in `03-components/` or `04-screens/`
- A library-wrapper component (Button, Icon, Motion) mapping the library's API to the product's tokens
- A UX review report filed under the relevant feature, issue, or standalone accessibility audit path

## Commonly sequenced with
- `design-system-wasp-drone`: receives system-level changes, such as a new aesthetic or token restructure, this Drone will not rebuild itself
- `react-wasp-drone`: implements the component code this Drone specifies
- `asset-wasp-drone`: registers new assets this Drone's specs reference
- `react-to-svelte-wasp-drone`: consulted when a ported surface needs to move from matching legacy styling to the current design-system tokens

Ambiguous invocations (unclear product, folder, or library) get one clarifying question rather than a silent guess.


## Product-system React primitives and mobile flow contracts

O219 uses paired guide14 and O222 uses guide15. Intake requires actual product-system/context/token/user-task/layout sources; missing inputs stay unknown. Source family/provenance, ref/event/semantic behavior and state acceptance precede a primitive recommendation. Mobile acceptance includes task priority, navigation, density, touch, keyboard, safe areas, reflow and focus/state continuity with actual device/manual/automation proof. These contracts route actual UI design/build/refinement through Impeccable and relevant framework/native owners. A worksheet or screenshot is not proof of task completion or accessibility.

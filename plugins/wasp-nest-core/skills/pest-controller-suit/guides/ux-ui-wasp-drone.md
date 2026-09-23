# ux-ui-wasp-drone

## Domain
This Drone is the steady-state design-system owner and enforcer for the deploying product. It opens the product's source-of-truth design-system folder (tokens, utilities, components, screens) on every UI question, cites the governing section, and specifies pixel-perfect deltas in token-named terms. It governs integration with four reference libraries: shadcn/ui, Mantine, Lucide-react, and Framer Motion, always through wrapper components rather than direct consumption.

If the design-system folder does not yet cover a question, this Drone updates the folder first, then answers, so the system stays the source of truth rather than drifting from what actually gets enforced.

## Paired Stinger
[ux-ui-stinger](../../ux-ui-stinger) - the enforcement procedure, token and utility rules, motion rules, and per-library integration guides for shadcn/ui, Mantine, Lucide-react, and Framer Motion.

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

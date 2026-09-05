# Bulletproof-React: Components and Styling

**Source:** https://github.com/alan2207/bulletproof-react/blob/master/docs/components-and-styling.md
**Retrieved:** 2026-04-24

## Summary

Component best practices center on colocation, composition, and small APIs.

## Key rules

1. **Colocate.** Keep components, functions, styles, state close to where used. Reduces re-renders + aids readability.
2. **Avoid nested rendering functions.** Extract sub-UI into separate components.
3. **Stay consistent.** Linters + formatters enforce it.
4. **Limit props.** If a component takes many props, split it or use composition (children/slots).
5. **Abstract shared components.** Wrap 3rd-party components so future swaps don't ripple.

## Recommended libraries

- **Fully-featured:** Chakra UI, MUI, AntD, Mantine.
- **Headless:** Radix UI, Headless UI, react-aria, Ark UI.
- **Code-shipped (copy-paste):** ShadCN UI, Park UI.

## Styling

- Runtime CSS-in-JS (emotion, styled-components) → avoid under heavy re-render load.
- **Prefer zero-runtime:** Tailwind, vanilla-extract, Panda CSS, CSS Modules.
- **Note:** Server Components require zero-runtime styling.

## Relevance to this stinger

Spine of `guides/02-components-and-composition.md`. Composition via children is reused in `guides/07-performance.md` as the canonical no-memo optimization.

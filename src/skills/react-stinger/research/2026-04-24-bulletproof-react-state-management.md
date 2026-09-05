# Bulletproof-React: State Management

**Source:** https://github.com/alan2207/bulletproof-react/blob/master/docs/state-management.md
**Retrieved:** 2026-04-24

## Summary

Bulletproof-react divides state into five layered categories and recommends a dedicated solution per layer rather than a one-store-rules-all approach.

## The five layers

1. **Component state**: `useState`, `useReducer`. Start here. Lift only when needed.
2. **Application (global UI) state**: Context+hooks for low-velocity; Zustand / Jotai / Redux Toolkit / MobX / XState when it gets heavier.
3. **Server cache state**: TanStack Query (REST+GraphQL), SWR, Apollo, urql, RTK Query.
4. **Form state**: React Hook Form, Formik, Final Form. Wrap in an abstracted `Form` component. Pair with Zod/Yup for validation.
5. **URL state**: route params and query params via react-router-dom / Next.js router / nuqs.

## Key rules

- **Do not store server data in Redux/Zustand.** Use a server cache library.
- **Keep state as close as possible to where it's used.** Don't globalize by default.
- **Forms deserve a dedicated library.** Rolling your own quickly gets messy.

## Relevance to this stinger

Spine of `guides/03-state-management.md`. The 5-layer model becomes the decision tree: "Is this UI state, global state, server state, URL state, or form state?" Each gets a different tool.

# Drag-and-Drop & Animation: research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/18-dnd-and-animation.md`

## Sources

From `cursor-subagent-research-combined.md` (Drag-and-Drop & Animation, ~line 789):

- [dnd-kit](https://dndkit.com/)
- [SortableJS](https://sortablejs.github.io/Sortable/)
- [Motion (Framer Motion)](https://motion.dev/)
- [GSAP](https://gsap.com/)
- [Lottie](https://airbnb.io/lottie/)
- [Theatre.js](https://www.theatrejs.com/)
- [auto-animate](https://auto-animate.formkit.com/)

## Adjacent references

- dnd-kit accessibility (Announcements API, KeyboardSensor): https://docs.dndkit.com/api-documentation/context-provider/accessibility
- WAI-ARIA Authoring Practices on drag-and-drop (`aria-grabbed` deprecated; use focus management + live regions): https://www.w3.org/WAI/ARIA/apg/patterns/
- Motion `useReducedMotion` (respecting `prefers-reduced-motion`): https://motion.dev/docs/react-use-reduced-motion
- GSAP licensing change (now free / MIT-style for commercial use as of 2024): https://gsap.com/licensing/
- dotLottie format (modern Lottie): https://dotlottie.io/

## Cross-references

- `guides/13-ecosystem-catalog.md` already lists Framer Motion as the animation default. This guide expands to dnd-kit / SortableJS / GSAP / Lottie / Theatre.js / auto-animate and codifies the a11y floor.
- Motion tokens (durations, easings, distances) are owned by `ux-ui-svelte-worker-bee`: explicitly handed off.

## Notes

The guide's central new contribution beyond the source doc is the **a11y floor for DnD**: keyboard sensor, Announcements provider, deprecated `aria-grabbed`, reduced-motion respect, and 44×44 touch targets. These are non-negotiable because DnD is the most common a11y-regression source in product UIs.

No new web_search_exa expansions performed.

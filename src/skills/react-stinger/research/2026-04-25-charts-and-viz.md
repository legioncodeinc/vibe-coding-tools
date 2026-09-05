# Charts & Data Visualization: research notes

**Retrieved:** 2026-04-25
**For guide:** `guides/17-charts-and-viz.md`

## Sources

From `cursor-subagent-research-combined.md` (Charts & Data Visualization, ~line 770):

- [Recharts](https://recharts.org/)
- [Apache ECharts](https://echarts.apache.org/)
- [Chart.js](https://www.chartjs.org/)
- [Nivo](https://nivo.rocks/)
- [Tremor](https://tremor.so/)
- [Observable Plot](https://observablehq.com/plot)
- [Visx](https://airbnb.io/visx/)
- [shadcn Charts](https://ui.shadcn.com/charts)

## Adjacent references

- echarts-for-react (React wrapper for Apache ECharts): https://github.com/hustcc/echarts-for-react
- Recharts theming via CSS variables (used in guide starter): https://recharts.org/en-US/guide/customize
- WCAG accessible chart guidance (titles, descriptions, color + shape): https://www.w3.org/WAI/tutorials/images/complex/

## Cross-references

- `guides/13-ecosystem-catalog.md` lists Recharts and Visx as defaults. This guide expands to shadcn Charts / Nivo / ECharts / Tremor / Observable Plot with a chart-shape and customization-depth decision tree.
- Color and contrast tokens are owned by `ux-ui-svelte-worker-bee`: explicitly handed off in the guide.

## Notes

The chart starter in the guide deliberately uses CSS variable references (`var(--color-accent)`, `var(--color-fg-muted)`) rather than hex colors so charts inherit the design system's tokens without per-chart edits. This pattern matches how shadcn Charts is built and is the canonical approach for 2026.

No new web_search_exa expansions: source doc URLs cover the canonical references.

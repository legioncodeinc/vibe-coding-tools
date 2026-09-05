# 17: Charts & Data Visualization

Source: `research/2026-04-25-charts-and-viz.md`. Charts are the visible tip of a long pipeline (data layer, color tokens, accessibility). Pick by *chart shape* and *customization depth*, not by what looks coolest in a marketing site.

## TL;DR pick

| Use case | Pick | Why |
|---|---|---|
| Dashboard KPIs, simple charts, fast | **shadcn Charts** (Recharts under the hood) | Owned code, themed via tokens |
| Common product charts (line, bar, area) | **Recharts** | React-native, easy, ubiquitous |
| Beautiful out-of-the-box, broad chart catalog | **Nivo** | D3-based, batteries included |
| Most powerful, large datasets, advanced viz | **Apache ECharts** | Best-in-class for analytics dashboards |
| Dashboard system with KPI primitives | **Tremor** | Dashboard-first; cards + charts unified |
| Bespoke / publication-grade D3 work | **Visx** (Airbnb) or **Observable Plot** | D3 primitives, full control |
| You're stuck with Chart.js | **Chart.js** + `react-chartjs-2` | Works, but not React-native |

For most product teams in 2026: **shadcn Charts** for in-app dashboards, **Recharts** for general charts, **ECharts** when shadcn/Recharts hits a ceiling, **Visx** when you're authoring custom visualizations.

---

## When to choose each

### shadcn Charts (the default for new dashboards)
- Built on Recharts; you copy the components into your repo and own them.
- Themed via your CSS variables (the same OKLCH tokens `ux-ui-svelte-worker-bee` defines).
- Pairs trivially with Tailwind v4 + shadcn/ui.
- Trade-off: chart shape catalog is what shadcn ships. For exotic charts, drop down to Recharts directly or step up to ECharts/Visx.

### Recharts (the React default)
- React-native components (`<LineChart>`, `<BarChart>`, `<AreaChart>`).
- Wide adoption; nearly every blog post about React charts uses it.
- Trade-off: not as fast as Canvas-based libs at >10k points; theming is OK, not great.

### Nivo (D3 + beauty out of the box)
- Largest catalog of "interesting" chart types (sankey, sunburst, network, calendar heatmap).
- D3 under the hood, server-side rendering supported.
- Trade-off: bigger bundle; aesthetic is opinionated (charming, but escape hatches require effort).

### Apache ECharts (the power tool)
- Used by the analytics dashboards of huge consumer apps (Alibaba, Baidu, ZenML).
- Canvas-rendered with a declarative `option` object. Handles 100k+ points.
- Trade-off: not React-idiomatic; you'll wrap it (`echarts-for-react`) and the API style won't match the rest of your codebase.

### Tremor (dashboards as components)
- Pre-built React dashboard primitives (KPI cards, sparklines, tables, charts) that compose into an analytics page in an afternoon.
- Built on Tailwind. Best when the whole product is a dashboard (Linear-style admin).
- Trade-off: opinionated layout. Outside its niche it's overkill.

### Observable Plot (D3's modern successor)
- Grammar-of-graphics layer over D3 from the Observable team.
- Best when you think in marks and channels (`Plot.line`, `Plot.dot`, `Plot.frame`).
- Use for static or near-static data exploration views; less idiomatic for highly interactive product UIs.

### Visx (Airbnb's primitives)
- "If D3 had React-native primitives." You compose `Group`, `Axis`, `Scale`, `Bar`.
- Use when Recharts is too high-level and ECharts is too imperative. Bespoke charts where you control every pixel.
- Trade-off: you write more code.

### Chart.js (legacy default)
- Big install base (mostly because it predates React).
- Use it if it's already there and the migration cost isn't justified. New projects: pick from above.

---

## Decision axes

1. **Chart shape.** Standard (line/bar/area/pie): Recharts, shadcn Charts, ECharts. Exotic (sankey, sunburst, treemap, calendar heatmap): Nivo, ECharts. Bespoke / publication-grade: Visx, Observable Plot.
2. **Data scale.** <1k points: anything. 1k to 10k: Recharts works. 10k+: ECharts or Canvas-based custom.
3. **Theming depth.** Token-driven theming is best in shadcn Charts and Visx (you write the colors). Recharts is fine with effort. Nivo and ECharts have their own theming systems: bridge them to your tokens.
4. **Interactivity.** Tooltips/legends/zoom: Recharts, Nivo, ECharts all handle. Brushing, linked views, custom interactions: Visx, ECharts.

---

## Starter (Recharts, the React default)

```tsx
'use client';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

type Point = { date: string; revenue: number };

export function RevenueLine({ data }: { data: Point[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" stroke="var(--color-fg-muted)" />
        <YAxis stroke="var(--color-fg-muted)" />
        <Tooltip
          contentStyle={{
            background: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
          }}
        />
        <Line type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
```

Note the CSS variable references: that's how you keep the chart in lockstep with `ux-ui-svelte-worker-bee`'s tokens.

## Starter (shadcn Charts)

Use the CLI: `npx shadcn@latest add chart`. The generated component is yours; theme via `--chart-1`…`--chart-5` CSS variables.

---

## Accessibility floor

- Every chart has a `<title>` (describing what's measured) and a `<desc>` summary, or an `aria-label` on the SVG root.
- Colors must pass WCAG contrast against the background: no relying on hue alone to encode categories. Pair color with shape, dash, or label.
- Provide a tabular fallback (`<table>` rendering the same data) for screen readers. shadcn Charts ships this pattern.
- Tooltips must be reachable by keyboard, not just on hover.

---

## Choice tree

1. **shadcn / Tailwind shop, want owned code** → shadcn Charts.
2. **Standard product charts, fast** → Recharts.
3. **Exotic chart types out of the box** → Nivo.
4. **>10k points, advanced interactions** → Apache ECharts.
5. **Whole product is a dashboard** → Tremor.
6. **Bespoke, every pixel matters** → Visx (or Observable Plot for D3-grammar).
7. **Already on Chart.js** → leave it; migrate when you change another part of the chart anyway.

---

## Common findings

> **[Should-refactor]** `src/features/dashboard/Revenue.tsx:1`: Chart.js wrapped through `react-chartjs-2` for a single line chart. Migrate to Recharts to match the rest of the React codebase.

> **[Must-fix]** `src/features/dashboard/Pie.tsx:12`: colors are hex literals (`#ff6b6b`). Replace with `var(--chart-1)` etc. to inherit dark/light mode and brand changes. Hand off to `ux-ui-svelte-worker-bee` for token mapping.

> **[Must-fix]** `src/charts/Bar.tsx:1`: no `<title>` / `<desc>` on the SVG; tooltips are mouse-only. Add a tabular fallback. See `guides/17-charts-and-viz.md §accessibility-floor`.

---

## Handoffs

- **Color, gradient, and contrast token decisions** → `ux-ui-svelte-worker-bee`. Every chart color is a token, never a literal.
- **Data layer (cursor pagination, downsampling, server-side aggregations)** → `db-worker-bee` for the API; this guide assumes data already lives in the component.
- **Chart performance budgets at extreme scale** → `guides/07-performance.md` plus a Profiler trace.

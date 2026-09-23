# Guide 03: Size, validate, and view

## The ceiling that actually binds

Mermaid's `maxTextSize` default is **50,000 characters** and `maxEdges` is **500**. These bind
before any file-size limit. Target under 45,000 characters per chart.

```bash
python3 scripts/lint.py <outdir>
```

`lint.py` checks, per chart: undefined node references, unbalanced label quotes, the lowercase
`end` collision, subgraph balance, the character ceiling, and the edge ceiling. Per JSON file
it checks parseability and the file-size ceiling.

## Splitting

Split on edge boundaries and repeat the header in each part. For JSON, split the heavy arrays
and repeat the scalar metadata so each part stands alone.

**Verify the split against real serialized size and retry.** Estimating item size compactly
while writing indented output undershoots badly; the first implementation of this produced
parts 25% over the ceiling. Build, measure, shrink the budget, rebuild.

## Validate by rendering, not by reading

Linting catches structure. Only a render catches the rest.

```javascript
const { svg } = await mermaid.render('id', code);   // resolves => syntax is valid
```

Confirm grouping took by counting `.cluster` elements. Confirm a chart's proportions by
reading `svg.viewBox.baseVal` — this is how the column formula was derived and how you check
a chart is not 35,000px tall.

## Viewing

`scripts/viewer.py` builds a self-contained HTML viewer with every chart embedded, so it works
from `file://` with no server. It needs internet once to load Mermaid from a CDN.

Controls: wheel/pinch zoom at pointer, drag pan, `+` `-` step, `0` fit-width, `9` fit-all, `1`
actual size, SVG export.

**Default to fit-width, not fit-all.** Several chart families are legitimately tall and narrow;
fitting both axes on one measured chart landed at 4% zoom, which is unusable. Fit-width on the
same chart gave 150%.

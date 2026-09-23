<!-- Template. inventory/shadcn-prepare.mjs fills {{APP_NAME}}, {{APP_CONTEXT}}, {{THEME}}, {{SHADCN_DIR}}, {{INVENTORY_DIR}}, {{CATALOG}} and saves it as <SHADCN_DIR>/THEME-INSTRUCTIONS.md. -->

# shadcn/ui theme mapping task

Map {{APP_NAME}}'s observed design values ({{APP_CONTEXT}}, captured in the **{{THEME}}** theme) onto shadcn/ui theme tokens, so a shadcn/ui install immediately looks like the captured app.

## Inputs (read all)

- `{{INVENTORY_DIR}}/tokens-raw.json`: observed colors, radii, shadows, fonts with use counts and route counts, plus the app's resolved CSS variables (`cssVariables.resolvedByPrefix`).
- `{{INVENTORY_DIR}}/candidate.tokens.json`: candidate tokens named after the app's CSS variables.
- `{{INVENTORY_DIR}}/ledger.json`: components and `inconsistencies[]` (read the inconsistencies; they tell you which near-duplicates to collapse).
- A few component files for context: the components with the most instances in `ledger.json` (open their `component.md`).
- The shadcn/ui catalog (valid theme tokens):

```json
{{CATALOG}}
```

## Task

1. For every token in `themeTokens` except `radius`, choose a value for the captured theme from observed colors, as a hex color (`#rrggbb` or `#rrggbbaa`). Pick by role and usage: `background` is the dominant page surface, `card` the raised surface, `muted-foreground` the secondary text color, `primary` the main call-to-action color, `destructive` the danger color, `border` and `input` the dominant border colors, `ring` the focus color, `sidebar-*` from the sidebar region. Prefer the app's own CSS variable when one exists for the role, and name it in `source`.
2. For `radius`, choose the base value (a px value from observed radii; shadcn derives sm to 4xl from it). Explain the choice.
3. `chart-1` to `chart-5`: five distinguishable observed accent colors, most used first.
4. Propose custom tokens for roles shadcn lacks but the app clearly uses (for example `success`, `warning`, `info`, a brand gradient pair, a surface overlay). Include a `-foreground` pair when text sits on them.
5. Fonts: the sans and mono stacks and the icon font.
6. Only the {{THEME}} theme was captured. Put captured values under that theme. For the other theme, either leave it null or, if you propose values, mark `proposed: true`.

## Output

Write ONE file: `{{SHADCN_DIR}}/theme.json`

```json
{
  "capturedTheme": "{{THEME}}",
  "themes": {
    "dark": { "background": { "value": "#0b0e14", "source": "--color-bg (1076 uses, 87 routes)", "reason": "dominant page surface" } },
    "light": null
  },
  "radius": { "value": "8px", "reason": "most used radius (1189 uses)" },
  "customTokens": [ { "name": "success", "dark": "#00c950", "foregroundDark": "#04170d", "reason": "status badges and switches on 12 routes" } ],
  "fonts": { "sans": "system-ui stack as observed", "mono": "...", "icons": "Material Symbols Outlined" },
  "decisions": [ "collapsed #ffffff0d, #ffffff0a, #ffffff08 into one overlay token (audit finding 4)" ],
  "gaps": [ "no light theme captured" ]
}
```

Every theme token must be present under the captured theme. Values must be hex. Validate with `python3 -m json.tool`. Do not create or modify any other file. Never use em dashes or en dashes.

Final reply: the chosen primary, background, card, border, and radius, and the custom tokens you proposed.

# Template: Canonical `@font-face` Block

Copy this template and replace all `{{...}}` placeholders. Do not omit any property: each one affects the font's rendering behavior.

---

## Variable font with optional (body copy)

```css
@font-face {
  font-family: '{{FontName}}';
  src: url('{{/path/to/font-name-variable-latin.woff2}}') format('woff2-variations');
  font-weight: {{100 900}};     /* Variable font weight range (e.g., 100 900) */
  font-style: normal;
  font-display: optional;       /* Body copy: zero CLS; system font on cold first-load */
  unicode-range: {{U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                  U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}};
}
```

## Variable font with swap + metric-matched fallback (headings/LCP)

```css
/* Web font */
@font-face {
  font-family: '{{FontName}}';
  src: url('{{/path/to/font-name-variable-latin.woff2}}') format('woff2-variations');
  font-weight: {{100 900}};
  font-style: normal;
  font-display: swap;           /* Heading: immediate visibility; pair with fallback below */
  unicode-range: {{U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                  U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                  U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD}};
}

/* Metric-matched fallback — run fontpie to calculate override values */
/* See guides/05-cls-elimination.md */
@font-face {
  font-family: '{{FontName}} Fallback';
  src: local('{{Arial}}');      /* System font (Arial = most universal) */
  size-adjust: {{100%}};        /* Replace with fontpie output */
  ascent-override: {{90%}};     /* Replace with fontpie output */
  descent-override: {{22%}};    /* Replace with fontpie output */
  line-gap-override: {{0%}};    /* Replace with fontpie output */
}
```

## Static font (multiple weight files)

```css
/* Regular weight */
@font-face {
  font-family: '{{FontName}}';
  src: url('{{/path/to/font-name-400.woff2}}') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: optional;
  unicode-range: {{U+0000-00FF}};
}

/* Bold weight */
@font-face {
  font-family: '{{FontName}}';
  src: url('{{/path/to/font-name-700.woff2}}') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: optional;
  unicode-range: {{U+0000-00FF}};
}
```

---

## Descriptor reference

| Descriptor | Required | Notes |
|---|---|---|
| `font-family` | Yes | Must match the name used in `font-family:` CSS rules exactly |
| `src` | Yes | WOFF2 first; include `format()` hint |
| `font-weight` | Yes | Range for variable (`100 900`); single value for static (`400`) |
| `font-style` | Yes | `normal` or `italic` |
| `font-display` | Yes | **Never omit.** See `guides/01-font-display-decision-matrix.md` |
| `unicode-range` | Recommended | Required for multi-subset splits; omit only for single-script products |

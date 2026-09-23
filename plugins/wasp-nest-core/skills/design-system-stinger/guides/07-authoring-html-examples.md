# 07: Authoring HTML Examples

`05-html-examples/` is the "photograph gallery" of the design system.
Each file is a static HTML render that can be opened by double-click:
no server, no bundler, no build step.

> Template: `../templates/html-example.html`.
> Shared CSS: `../templates/shared-css.css`.

## Purpose

- **Visual regression-proofing.** Reviewers eyeball these to confirm
  the target look before any production code lands.
- **Independent verification.** A frontend engineer can pixel-match
  their output against these HTMLs.
- **Living documentation.** Far more effective than a Figma link for
  anyone reading the spec six months later.

## File list per product

Match the component briefs + screens:

- `index.html`: the gallery landing page, links to the others.
- `buttons-and-pills.html`: the button+badge showcase.
- `cards-and-badges.html`: card variants + badge variants.
- `nav-glass.html`: top+bottom+left nav shells.
- `dashboard-engagement.html`: the dashboard screen assembled.
- `messaging.html`: the messaging screen.
- `profile-readonly.html`: the profile screen.
- `_shared.css`: the token + utility layer, inlined.

Typically 5 to 8 HTML files + `_shared.css`.

## The `_shared.css` trick

HTML examples must work when opened directly (file://). That means:
- No `@import "tailwindcss"`: that's a build-time construct.
- No external stylesheets except `_shared.css`.
- Fonts via Google Fonts `@import` inside `_shared.css` is OK.

Copy the token layer + utility layer into `_shared.css` as a flat
`:root` block (strip `@theme` wrappers since they're Tailwind-specific).
Example opening:

```css
:root {
  --color-primary: #1B2B4B;
  --color-accent:  #C5A44E;
  --color-background: #FAF8F5;
  --color-card: #FFFFFF;
  /* ... all tokens inlined ... */
}

.glass-surface { /* ... */ }
.depth-1 { /* ... */ }
/* ... utility layer ... */
```

## HTML file shape

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Buttons & Pills — <Product> Design System</title>
  <link rel="stylesheet" href="_shared.css" />
  <style>
    /* page-local styles only */
    body {
      background: var(--color-background);
      font-family: var(--font-sans);
      color: var(--color-text-primary);
      padding: var(--space-6);
    }
    .gallery { display: grid; gap: var(--space-6); max-width: 480px; margin: 0 auto; }
  </style>
</head>
<body>
  <main class="gallery">
    <h1>Buttons & Pills</h1>

    <section class="glass-surface depth-1" style="padding: var(--space-4);">
      <h2>Primary + Secondary pair</h2>
      <div style="display: flex; gap: var(--space-2);">
        <button class="btn btn--secondary">Send DM</button>
        <button class="btn btn--primary">Send Referral</button>
      </div>
    </section>

    <!-- more sections -->
  </main>
</body>
</html>
```

## Mobile-first by default

Set `max-width: 480px` on the gallery container. Mobile is where touch
targets matter most and where glass+depth is most tested. Desktop
renders get their own HTML file if/when they diverge.

## Visual accuracy rules

1. **HTML examples are photographs.** If the HTML diverges from the
   brief, the BRIEF wins and the HTML is a bug.
2. **Never ship an HTML example that uses a hex value.** Every color,
   radius, and shadow references a token from `_shared.css`.
3. **Keep page-local styles tiny.** If a page needs a dozen local
   styles, the utility layer is missing something: promote the
   common recipe.
4. **No JavaScript unless genuinely required.** These are static
   renders. An accordion can be CSS-only with `<details>`.

## What an HTML example is NOT

- Production code. Don't build features here.
- A component library. If you find yourself reinventing a button in
  every HTML, the `_shared.css` utility layer is missing.
- A responsive app. Most examples are mobile-only; add a second file
  for desktop rather than try to cram both.

## Index.html pattern

The gallery landing page:

```html
<main class="gallery">
  <h1><Product> Design System — Examples</h1>
  <ul>
    <li><a href="buttons-and-pills.html">Buttons & Pills</a></li>
    <li><a href="cards-and-badges.html">Cards & Badges</a></li>
    <li><a href="nav-glass.html">Nav — Top / Bottom / Left</a></li>
    <li><a href="dashboard-engagement.html">Dashboard</a></li>
    <li><a href="messaging.html">Messaging</a></li>
    <li><a href="profile-readonly.html">Profile</a></li>
  </ul>
</main>
```

## Double-click test

Before considering the HTML example done: close your editor, find
the file in the OS file browser, double-click it. If it doesn't render
pixel-correct in the default browser, it's not done. Common failures:

- Relative path to `_shared.css` wrong.
- Google Font not imported in `_shared.css`.
- A CSS custom property referenced but not defined in `_shared.css`.
- Tailwind arbitrary-value syntax like `bg-[#C5A44E]` that only works
  in a Tailwind build.

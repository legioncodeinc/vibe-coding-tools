# registry-item.json - shadcn-svelte

- URL: https://shadcn-svelte.com/docs/registry/registry-item-json
- Fetched: 2026-08-14
- Source type: official docs
- Component: registry

Specification for registry items. The `registry-item.json` schema is used to define your custom registry items.

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A simple hello world component.",
  "files": [
    {
      "path": "registry/hello-world/hello-world.svelte",
      "type": "registry:component"
    },
    {
      "path": "registry/hello-world/use-hello-world.svelte.ts",
      "type": "registry:hook"
    }
  ],
  "cssVars": {
    "theme": {
      "font-heading": "Poppins, sans-serif"
    },
    "light": {
      "brand": "20 14.3% 4.1%"
    },
    "dark": {
      "brand": "20 14.3% 4.1%"
    }
  }
}
```

## Fields

- `$schema` - schema URL for the file.
- `name` - identifies the item in the registry; must be unique for your registry.
- `title` - human-readable title, kept short and descriptive.
- `description` - longer, more detailed than title.
- `type` - determines the type and target path of the item when resolved for a project. Supported types:

| Type | Description |
| --- | --- |
| `registry:block` | Use for complex components with multiple files. |
| `registry:component` | Use for simple components. |
| `registry:lib` | Use for lib and utils. |
| `registry:hook` | Use for hooks. |
| `registry:ui` | Use for UI components and single-file primitives |
| `registry:page` | Use for page or file-based routes. |
| `registry:file` | Use for miscellaneous files. |
| `registry:style` | Use for registry styles, e.g. `new-york`. |
| `registry:theme` | Use for themes. |

- `author` - author of the registry item, e.g. `"John Doe <john@doe.com>"`.
- `dependencies` - npm package dependencies of the registry item. Use `@version` to pin, e.g. `["bits-ui", "zod", "@lucide/svelte", "name@1.0.2"]`.
- `registryDependencies` - other registry items this item depends on. Each entry may be:
  - A shadcn-svelte registry item name (e.g. `'button'`, `'input'`, `'select'`) resolved against the shadcn-svelte registry.
  - A full remote URL, e.g. `https://example.com/r/hello-world.json`.
  - A `local:` prefixed alias (e.g. `local:stepper`) when building with the CLI, which the CLI converts to a relative path (`./stepper.json`) in the output file.
  - A relative path (e.g. `./stepper.json`) when not using the CLI.
- `files` - array of `{ path, type, target? }`. `target` is required for `registry:page` and `registry:file` types; for other types the CLI reads the consuming project's `components.json` to determine the target path. Use `~` to refer to project root, e.g. `~/foo.config.js`.
- `cssVars` - CSS variables for the registry item, keyed under `theme`, `light`, `dark`.
- `css` - add new rules to the project's CSS file, e.g. `@layer base`, `@layer components`, `@utility`, `@keyframes`:

```json
{
  "css": {
    "@layer base": {
      "body": { "font-size": "var(--text-base)", "line-height": "1.5" }
    },
    "@layer components": {
      "button": { "background-color": "var(--color-primary)", "color": "var(--color-white)" }
    },
    "@utility text-magic": { "font-size": "var(--text-base)", "line-height": "1.5" },
    "@keyframes wiggle": {
      "0%, 100%": { "transform": "rotate(-3deg)" },
      "50%": { "transform": "rotate(3deg)" }
    }
  }
}
```

- `docs` - custom documentation or message shown when installing the item via the CLI.
- `categories` - array to organize the item, e.g. `["sidebar", "dashboard"]`.
- `meta` - arbitrary key/value metadata.

---

## Examples

- URL: https://shadcn-svelte.com/docs/registry/examples
- Fetched: 2026-08-14
- Source type: official docs
- Component: registry

### registry:style - custom style that extends shadcn-svelte

On `npx shadcn-svelte@latest init`, the following will: install `phosphor-svelte` icons as a dependency; add the `login-01` block and `calendar` component; add `editor` from a remote registry; set `font-sans` to `Inter, sans-serif`; install a `brand` color in light and dark mode.

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "example-style",
  "type": "registry:style",
  "dependencies": ["phosphor-svelte"],
  "registryDependencies": [
    "login-01",
    "calendar",
    "https://example.com/r/editor.json"
  ],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "brand": "oklch(0.145 0 0)" },
    "dark": { "brand": "oklch(0.145 0 0)" }
  }
}
```

### registry:style - custom style from scratch (extends: none)

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "extends": "none",
  "name": "new-style",
  "type": "registry:style",
  "dependencies": ["tailwind-merge", "clsx"],
  "registryDependencies": [
    "utils",
    "https://example.com/r/button.json",
    "https://example.com/r/input.json",
    "https://example.com/r/label.json",
    "https://example.com/r/select.json"
  ],
  "cssVars": {
    "theme": { "font-sans": "Inter, sans-serif" },
    "light": { "main": "#88aaee", "bg": "#dfe5f2", "border": "#000", "text": "#000", "ring": "#000" },
    "dark": { "main": "#88aaee", "bg": "#272933", "border": "#000", "text": "#e6e6e6", "ring": "#fff" }
  }
}
```

### registry:theme - custom colors

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "light": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.546 0.245 262.881)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      "ring": "oklch(0.746 0.16 232.661)"
    },
    "dark": {
      "background": "oklch(1 0 0)",
      "foreground": "oklch(0.141 0.005 285.823)",
      "primary": "oklch(0.707 0.165 254.624)",
      "primary-foreground": "oklch(0.97 0.014 254.604)",
      "ring": "oklch(0.707 0.165 254.624)"
    }
  }
}
```

### registry:theme - override Tailwind theme variables (spacing, breakpoints)

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "custom-theme",
  "type": "registry:theme",
  "cssVars": {
    "theme": {
      "spacing": "0.2rem",
      "breakpoint-sm": "640px",
      "breakpoint-md": "768px",
      "breakpoint-lg": "1024px",
      "breakpoint-xl": "1280px",
      "breakpoint-2xl": "1536px"
    }
  }
}
```

### registry:block - custom block (login-01)

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "login-01",
  "type": "registry:block",
  "description": "A simple login form.",
  "registryDependencies": ["button", "card", "input", "label"],
  "files": [
    {
      "path": "blocks/login-01/page.svelte",
      "content": "import { LoginForm } ...",
      "type": "registry:page",
      "target": "src/routes/login/+page.svelte"
    },
    {
      "path": "blocks/login-01/components/login-form.svelte",
      "content": "...",
      "type": "registry:component"
    }
  ]
}
```

### registry:block - install a block and override primitives

On `npx shadcn-svelte@latest add`, this adds the `login-01` block from the shadcn-svelte registry and overrides the `button`, `input`, and `label` primitives with ones from a remote registry:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "custom-login",
  "type": "registry:block",
  "registryDependencies": [
    "login-01",
    "https://example.com/r/button.json",
    "https://example.com/r/input.json",
    "https://example.com/r/label.json"
  ]
}
```

---

## FAQ - shadcn-svelte registry

- URL: https://shadcn-svelte.com/docs/registry/faq
- Fetched: 2026-08-14
- Source type: official docs
- Component: registry

### How do I add a new Tailwind color?

Add it to `cssVars` under `light` and `dark` keys:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [],
  "cssVars": {
    "light": { "brand-background": "20 14.3% 4.1%", "brand-accent": "20 14.3% 4.1%" },
    "dark": { "brand-background": "20 14.3% 4.1%", "brand-accent": "20 14.3% 4.1%" }
  }
}
```

The CLI will update the project CSS file. Once updated, the new colors are usable as utility classes: `bg-brand` and `text-brand-accent`.

### How do I add or override a Tailwind theme variable?

Add it to `cssVars.theme` under the key to add or override:

```json
{
  "$schema": "https://shadcn-svelte.com/schema/registry-item.json",
  "name": "hello-world",
  "title": "Hello World",
  "type": "registry:block",
  "description": "A complex hello world component",
  "files": [],
  "cssVars": {
    "theme": {
      "text-base": "3rem",
      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      "font-heading": "Poppins, sans-serif"
    }
  }
}
```

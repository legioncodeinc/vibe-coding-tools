# 04 — shadcn/ui Integration

shadcn/ui is source you own, not an npm dependency. The CLI copies a primitive into `components/ui/`; from that point it's your code. That makes wrapping simultaneously easier (you can edit the primitive) and riskier (the primitive now drifts from upstream).

Research: `research/2026-04-24-shadcn-ui-wrapping.md`.

## Decision tree

When a UI need arises:

```
Does an existing product wrapper cover it?
├── Yes → use the product wrapper. Done.
└── No
    ├── Is shadcn's primitive a close fit?
    │   ├── Yes → install via CLI, then wrap (go to "Wrapping rules")
    │   └── No → is Mantine a close fit?
    │       ├── Yes → see `guides/05-mantine-integration.md`
    │       └── No → build system-native. Cite the brief section that declares the aesthetic.
```

**Never** pick a library primitive because "it's there" — pick it because the product needs an accessible primitive with behavior the team will not re-implement well (dialog, dropdown, popover, tabs, combobox, date picker, etc.).

## Folder discipline

```
components/
├── ui/                         <- shadcn CLI-generated. Treat as read-mostly.
│   ├── button.tsx
│   ├── dialog.tsx
│   └── ...
└── <product>/                  <- your wrappers live here.
    ├── Button.tsx              <- wraps ui/button with product variants + tokens
    ├── Dialog.tsx              <- wraps ui/dialog with product motion + shadow
    └── ...
```

Feature code imports `@/components/<product>/Button`, never `@/components/ui/button`. Enforce via code review or an ESLint `no-restricted-imports` rule.

## Wrapping rules

1. **Use `forwardRef` and spread `...props`.** Radix often needs to attach refs and pass event handlers through. A wrapper that drops either breaks accessibility. See `research/2026-04-24-radix-primitives-composition.md`.

2. **Use CVA for variants.** Export a `<component>Variants` CVA factory. Match shadcn's convention so upstream updates re-merge cleanly. See `research/2026-04-24-cva-variant-architecture.md`.

3. **Map to product tokens via Tailwind v4 `@theme`.** shadcn's default Tailwind config uses CSS variables for every color — point those at product tokens in `globals.css`:

   ```css
   @theme {
     --color-primary: var(--color-brand);
     --color-primary-foreground: var(--color-brand-ink);
     --color-secondary: var(--color-surface-secondary);
     /* ... */
   }
   ```

   The shadcn primitive keeps its `bg-primary text-primary-foreground` classes; the tokens resolve to product values. See `research/2026-04-24-tailwind-v4-theme-tokens.md`.

4. **Compose with `asChild`** when placing a product button inside a Radix Trigger, Menu Item, or similar:

   ```tsx
   <DropdownMenu.Trigger asChild>
     <Button variant="secondary">Open</Button>
   </DropdownMenu.Trigger>
   ```

   This works only if `<Button>` forwards ref and spreads props. See `research/2026-04-24-radix-primitives-composition.md`.

5. **Product variants, not shadcn variants.** shadcn's `variant="destructive"` is shadcn's opinion; your product's opinion might be `tone="danger"` or simply "don't expose a destructive variant". The wrapper translates: accept product-shaped props, emit shadcn-shaped classes.

6. **Keep `components/ui/*` edit-minimal.** Re-running the CLI must not blow up the wrappers. If you need a behavior change that requires editing `components/ui/button.tsx`, ask: could the wrapper express it? Usually yes.

## When to wrap vs. edit the primitive

- **Wrap** when the change is about variants, tokens, motion, composed behavior, or product-specific props. This is 90% of cases.
- **Edit the primitive** when the shadcn source has an upstream bug you're fixing for the product, or when a product-wide contract (like "every button must track analytics") is cleaner inline than in every wrapper.
- **Reject the primitive** when the product aesthetic materially conflicts with shadcn's composition model. Build system-native.

## Common violations

- Feature code imports `@/components/ui/*` directly. → Fix: import from `@/components/<product>/*`.
- Wrapper drops `forwardRef`. → Fix: restore ref forwarding so Radix composition works.
- Wrapper hard-codes Tailwind colors instead of referencing product token variables. → Fix: map in `@theme`.
- Product exposes shadcn's `destructive` variant when the brief doesn't authorize it. → Fix: remove variant from the wrapper's CVA.

---

*Worked example:* `examples/wrapper-spec-example.md` — a Button wrapper over a shadcn primitive.

*Template:* `templates/component-wrapper.tsx`.

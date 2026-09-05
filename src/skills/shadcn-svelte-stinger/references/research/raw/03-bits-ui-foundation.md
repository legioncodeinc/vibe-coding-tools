# Introduction - Bits UI

- URL: https://www.bits-ui.com/docs/introduction
- Fetched: 2026-08-14
- Source type: official docs
- Component: foundation

The headless components for Svelte.

Bits UI is a headless component library for Svelte focused on developer experience, accessibility, and full creative control. Use it to build high-quality, accessible UIs without giving up styling freedom or performance.

## Why Bits UI?

### Bring Your Own Styles

Most components ship completely unstyled, with the exception of those required for core functionality. No CSS resets, no design system assumptions. You bring the styles using standard `class` props or `data-*` attributes.

### Building for Developer Experience

Everything is designed to stay out of your way:

- Full TypeScript coverage
- Stable, predictable APIs
- Flexible event override system
- Great defaults, easily overridden
- Comprehensive documentation and examples

### Production-Ready Accessibility

Accessibility isn't just an afterthought - it's baked in:

- WAI-ARIA compliance
- Keyboard navigation by default
- Focus management handled for you
- Screen reader support built-in

### Composable by Design

Components are primitives, not black boxes. They compose cleanly and play well together:

- Render Delegation for total flexibility
- Chainable events and callbacks
- Override-friendly defaults
- Minimal dependencies

## Community

Bits UI was built and is maintained by Hunter Johnston (huntabyte) with design support from Pavel Stianko and his team at Bitworks Studio and tooling support from Adrian Gonz.

## Acknowledgments

Built on the shoulders of giants:

- Melt UI - inspired the internal architecture
- Radix UI - API design inspiration
- React Spectrum - inspiration for the date/time components and excellence in accessibility

---

## Getting Started (basic usage)

- URL: https://bits-ui.com/docs/getting-started
- Fetched: 2026-08-14
- Source type: official docs
- Component: foundation

Welcome to Bits UI, a collection of headless component primitives for Svelte 5 that prioritizes developer experience, accessibility, and flexibility.

Install bits using your preferred package manager:

```
npm install bits-ui
```

After installation, you can import and use Bits UI components in your Svelte files (e.g. the Accordion component).

### Adding Styles

Bits UI components are headless by design, meaning they ship with minimal styling. This gives you complete control over the appearance of your components. Each component that renders an HTML element exposes a `class` prop and `style` prop that you can use to apply styles to the element.

Each Bits UI component applies specific data attributes to the underlying HTML elements. You can use these attributes to target components in your global styles.

### TypeScript Support

Bits UI is built with TypeScript and provides comprehensive type definitions. When using TypeScript, you'll get full type checking and autocompletion.

---

## Migration Guide (v0 -> v1 -> v2)

- URL: https://bits-ui.com/docs/migration-guide
- Fetched: 2026-08-14
- Source type: official docs
- Component: foundation

## Bits UI v1

Bits UI v1 is a major update that introduces significant improvements, but it also comes with breaking changes. Since anything before v1.0 was a pre-release, backward compatibility was not guaranteed.

We highly recommend reviewing the documentation for each component you use, as their APIs may have changed.

Looking for the old documentation? You can still access Bits UI v0.x at v0.bits-ui.com. However, we encourage you to migrate as soon as possible to take advantage of the latest features and improvements.

Bits UI has been completely rewritten for Svelte 5, bringing several key benefits:

- Performance improvements: Faster rendering and reduced overhead.
- More flexible APIs: Easier customization and integration.
- Bug fixes and stability: Addressing every bug and issue from v0.x.
- Better developer experience: Improved consistency and documentation.

Note: the shadcn-svelte site (bits-ui.com homepage) advertises "Bits UI v2 Now Available" as of this research window, indicating the library has since progressed from v1 to v2. Gap: the raw archive does not contain a dedicated v1-to-v2 migration guide page; only the v0-to-v1 guide content was retrievable via this fetch.

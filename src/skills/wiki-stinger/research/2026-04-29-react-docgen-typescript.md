---
title: react-docgen-typescript component metadata extraction
date: 2026-04-29
sources:
  - https://github.com/styleguidist/react-docgen-typescript
  - https://www.jsdocs.io/package/react-docgen-typescript
  - https://react-docgen.dev/docs/reference/documentation/typescript
---

# react-docgen-typescript

## Summary
`react-docgen-typescript` is the standard library for extracting React component metadata (display name, description, props with types/defaults/JSDoc, methods) from TypeScript files. It builds on `typescript`'s compiler API and returns `ComponentDoc[]` per file. Wiki-worker-bee uses it as the secondary parser for any `.tsx` file detected as a React component, then renders props as a single body subsection (per brief recommendation), not as per-prop entity pages, which would explode the wiki for nothing.

## Key facts
- Install: `npm i react-docgen-typescript` (peer: `typescript`).
- Three constructors:
  - `parse(filePath, options?)`: default config.
  - `withDefaultConfig(options).parse(filePath)`: preset compiler options + override docgen options.
  - `withCustomConfig("./tsconfig.json", options).parse(filePath)`: pass repo's tsconfig (use this in wiki-worker-bee).
  - `withCompilerOptions({ esModuleInterop: true }, options).parse(filePath)`: programmatic compiler options.
- Returns `ComponentDoc[]`: each item is `{ displayName, description, filePath, props, methods, tags, expression, rootExpression }`.
- `props` is `{ [propName]: PropItem }` with `{ name, type: { name }, required, defaultValue, description, parent, declarations }`.
- Useful options:
  - `propFilter`: `(prop, component) => boolean` to skip noise (e.g., props inherited from `HTMLAttributes`).
  - `componentNameResolver`: `(exp: ts.Symbol, source: ts.SourceFile) => string | null` for styled-components / `forwardRef` / `memo` wrapper unwrapping.
  - `shouldExtractLiteralValuesFromEnum: true`: converts string-literal unions to enum format (Storybook-friendly, AND wiki-friendly because it makes choices explicit).
  - `shouldExtractValuesFromUnion: true`: same idea for type unions.
  - `savePropValueAsString: true`: keeps default values as readable strings instead of AST nodes.
  - `skipChildrenPropWithoutDoc: true` (default): skips noise.
- Companion `getDefaultExportForFile(source)` is exported for resolving the file's default export name when `componentNameResolver` is needed.
- Alternative: `react-docgen` (v6+) supports TypeScript natively and ships with handlers like `componentMethods`, `displayName`, `defaultProps`, `propDocblock`, `propType`, `propTypeComposition`: heavier API but more powerful for non-standard patterns.

## Recommended approach for wiki-worker-bee

For any `.tsx`/`.jsx` file where ts-morph detects a function declaration or arrow function whose name is PascalCase AND whose return type involves `JSX.Element` / `ReactElement` / `ReactNode` (or a `<...>` JSX expression in body), promote it to `react-component` entity sub-type. Run `react-docgen-typescript` in parallel using `withCustomConfig(repoTsconfigPath, { propFilter, shouldExtractLiteralValuesFromEnum: true, savePropValueAsString: true, skipChildrenPropWithoutDoc: true })` and merge the props metadata into the entity page body as a single `## Props` markdown table:

```md
## Props
| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `variant` | `'primary' \| 'secondary'` | yes | — | Visual style |
```

Do NOT create per-prop entity pages: props are not callable units; they're component-internal contract surface. If `react-docgen-typescript` returns `[]` (parser couldn't identify a component), fall back to ts-morph's bare entity extraction and tag `entity_type: function` instead. For the gotcha class (`forwardRef`/`memo`/`styled` wrappers), set `componentNameResolver` to unwrap; otherwise the displayName comes back as `"ForwardRef"` and the entity page filename will collide.

## Sources
- [styleguidist/react-docgen-typescript](https://github.com/styleguidist/react-docgen-typescript): date retrieved 2026-04-29, README with parse API, options, examples.
- [react-docgen-typescript@2.4.0, jsDocs.io](https://www.jsdocs.io/package/react-docgen-typescript): date retrieved 2026-04-29, full API surface including helpers like `getComponentInfo`, `extractDefaultPropsFromComponent`.
- [react-docgen TypeScript reference](https://react-docgen.dev/docs/reference/documentation/typescript): date retrieved 2026-04-29, alternative parser with native TS support.

## Quotes worth preserving
> "If you want to customize the typescript configuration or docgen options, this package exports a variety of ways to create custom parsers.", react-docgen-typescript README
> "The parser exports `getDefaultExportForFile` helper through its public API.", react-docgen-typescript README

## Open questions / gaps
- For projects using `react-docgen` v6+ instead of `react-docgen-typescript`, does the API differ enough to matter? Pragma: pick one (recommend `react-docgen-typescript` because narrower and more stable for TS-only projects), and mention `react-docgen` as fallback only if the parse fails.
- Should wiki-worker-bee render JSDoc `@example` blocks for components? Recommend yes (under a `## Examples` body subsection), but only if `description` includes them; do not synthesize.

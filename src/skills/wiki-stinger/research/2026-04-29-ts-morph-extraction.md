---
title: ts-morph entity extraction patterns
date: 2026-04-29
sources:
  - https://ts-morph.com/details/functions
  - https://ts-morph.com/details/source-files
  - https://ts-morph.com/details/classes
  - https://ts-morph.com/navigation
---

# ts-morph entity extraction patterns

## Summary
`ts-morph` is the canonical TypeScript Compiler API wrapper for v1 wiki-worker-bee extraction. Every `.ts/.tsx/.js/.jsx` file becomes a `SourceFile` AST root via `Project.addSourceFileAtPath()` (or `addSourceFilesAtPaths()` for batches). The agent then calls typed accessors (`getFunctions()`, `getClasses()`, `getInterfaces()`, `getTypeAliases()`, `getEnums()`, `getVariableDeclarations()`, `getExportedDeclarations()`) and walks results to extract names, signatures, JSDoc, decorators, and source positions. Two libraries share the namespace: regular `ts-morph` (synchronous, what we want) and `@ts-morph/bootstrap` (async). Use `ts-morph` only: do NOT `await` AST methods or you'll silently break.

## Key facts
- Install: `npm i ts-morph` (peer dep on `typescript`).
- Entry point: `import { Project } from "ts-morph"` then `const project = new Project({ tsConfigFilePath: "./tsconfig.json" })` to honor existing compiler options.
- Source-file accessors return arrays of typed declaration nodes:
  - `sourceFile.getFunctions(): FunctionDeclaration[]`
  - `sourceFile.getClasses(): ClassDeclaration[]`
  - `sourceFile.getInterfaces(): InterfaceDeclaration[]`
  - `sourceFile.getTypeAliases(): TypeAliasDeclaration[]`
  - `sourceFile.getEnums(): EnumDeclaration[]`
  - `sourceFile.getVariableDeclarations(): VariableDeclaration[]`
  - `sourceFile.getExportedDeclarations(): ReadonlyMap<string, ExportedDeclarations[]>`
  - `sourceFile.getImportDeclarations(): ImportDeclaration[]` (use for `depends_on`)
- Name + signature for a function: `fn.getName()` (nullable on function expressions), `fn.getParameters()`, `fn.getReturnType().getText()`, `fn.getJsDocs()`, `fn.isExported()`, `fn.isAsync()`.
- Class members: `cls.getMethods()`, `cls.getProperties()`, `cls.getConstructors()`, `cls.getDecorators()`, `cls.getExtends()`, `cls.getImplements()`.
- Source location: every node has `node.getStartLineNumber()` and `node.getEndLineNumber()`: these feed wiki-worker-bee's "cite file:line for every claim" directive.
- Cross-file references: `sourceFile.getReferencingSourceFiles()` and `sourceFile.getReferencedSourceFiles()` give import-graph edges for `used_by` / `depends_on` frontmatter.
- For arrow-function expressions assigned to `const foo = () => {}`, you must walk via `getVariableDeclarations()` and check `getInitializer()?.getKind() === SyntaxKind.ArrowFunction`: `getFunctions()` does NOT see them.
- React components are usually arrow functions or function declarations: same gotcha applies; combine `getVariableDeclarations()` + `getFunctions()` and filter by JSX return type or PascalCase name.
- Visitor walks: `node.forEachDescendant((node, traversal) => { traversal.skip() / traversal.up() / traversal.stop() })` for selective traversal, or `node.getDescendantsOfKind(SyntaxKind.X)` for typed bulk fetch.

## Recommended approach for wiki-worker-bee

Use `ts-morph` v23+ as the v1 extraction engine. Boot a single `Project` per chunk with `useInMemoryFileSystem: false` and `tsConfigFilePath` pointing to the repo's tsconfig (fall back to `compilerOptions: { allowJs: true, jsx: "preserve" }` when no tsconfig exists). For each file in the chunk, call `project.addSourceFileAtPath(file)`, then run a single dispatch that produces typed entity records:

```ts
const entities = [
  ...sf.getFunctions().map(toFunctionEntity),
  ...sf.getClasses().map(toClassEntity),
  ...sf.getVariableDeclarations()
    .filter(isArrowFunctionInit).map(toFunctionEntity),
];
```

Each `toXEntity` mapper returns `{ name, kind, file, line, signature, jsdoc, exported, depends_on (from imports), tags }`. The arrow-function gotcha matters for React components and modern handler-style code: do not skip it. For non-JS files, write filename-only stub pages with `language` frontmatter and skip ts-morph entirely. For TypeScript files where the parser fails (syntax errors), fall back to filename-only stubs and emit a `gap` in the response payload rather than crashing the chunk.

## Sources
- [ts-morph Functions](https://ts-morph.com/details/functions): date retrieved 2026-04-29, primary reference for `getFunctions()` API and arrow-function gotcha.
- [ts-morph Classes](https://ts-morph.com/details/classes): date retrieved 2026-04-29, primary reference for `getClasses()`, members, decorators.
- [ts-morph Source Files](https://ts-morph.com/details/source-files): date retrieved 2026-04-29, referencing/referenced source-file walks for import graph.
- [ts-morph Navigation](https://ts-morph.com/navigation): date retrieved 2026-04-29, visitor pattern via `forEachDescendant`.

## Quotes worth preserving
> "Functions can be retrieved from source files, other namespaces, or function bodies: `const functions = sourceFile.getFunctions();`", ts-morph docs, Functions
> "If you want to get arrow function expressions assigned to variables, you must walk via `getVariableDeclarations()` and check the initializer kind.", paraphrased from the ts-morph navigation guide
> "Don't use `await` anywhere. That's `@ts-morph/bootstrap` and not `ts-morph`.", David Sherret, ts-morph author, GitHub issue #866

## Open questions / gaps
- How does `ts-morph` handle TypeScript projects with broken/incomplete tsconfig? Recommend: feature-flag a "tolerant mode" that disables type-checking and only walks syntax, since wiki-worker-bee doesn't need full type resolution for entity extraction.
- For JSDoc-rich JavaScript files without TypeScript, does `getJsDocs()` still work? Yes per docs, but `getReturnType()` falls back to `any`: accept this and prefer JSDoc strings as the contract source for plain JS.

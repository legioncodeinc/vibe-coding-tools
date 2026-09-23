# Example: preact/compat Migration with Vite

> Demonstrates: `guides/02-compat-migration.md`

## Scenario

Migrate a small React + Vite app to Preact to reduce bundle size for a third-party embed widget.

## Starting state

```json
// package.json (before)
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0"
  }
}
```

```js
// vite.config.js (before)
export default {
  plugins: [react()],
};
```

## Step-by-step migration

### 1. Audit for blockers

```bash
grep -r "React.use(" src/
grep -r "useTransition(" src/
grep -r '"use server"' src/
grep -r '"use client"' src/
```

Result: none found. Migration is safe to proceed.

### 2. Install preact

```bash
npm install preact
npm uninstall react react-dom @types/react @types/react-dom
```

### 3. Add Vite aliases

```js
// vite.config.js (after)
export default {
  resolve: {
    alias: {
      "react": "preact/compat",
      "react-dom/test-utils": "preact/test-utils",
      "react-dom": "preact/compat",
      "react/jsx-runtime": "preact/jsx-runtime",
    },
  },
};
```

### 4. Update tsconfig.json

```json
{
  "compilerOptions": {
    "jsxImportSource": "preact",
    "jsx": "react-jsx"
  }
}
```

### 5. Run the app

```bash
npm run dev
```

Check for warnings:
- `defaultProps not supported`: move to default parameters.
- `Numeric style values without px`: add `"px"` suffix.

### 6. Verify bundle size

```bash
npm run build
# Before: dist/assets/index-xxxx.js — 42KB gzipped
# After:  dist/assets/index-xxxx.js — 8KB gzipped
```

## Result

Bundle reduced from 42KB to 8KB gzipped. No source file changes were required: only configuration.

## Edge case: third-party library requiring `@types/react`

If a library's peer dependency pulls `@types/react` back in, add this stub:

```ts
// types/react-shim.d.ts
declare module "react" {
  export * from "preact/compat";
  export { default } from "preact/compat";
}
```

And update `tsconfig.json`:
```json
{ "include": ["src", "types"] }
```

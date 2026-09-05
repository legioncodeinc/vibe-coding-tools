---
source_url: https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md
retrieved_on: 2026-05-20
source_type: official-docs
authority: official
relevance: high
topic: custom-plugins
stinger: lighthouse-pagespeed-stinger
---

# Lighthouse Plugin Authoring - Official Docs

## Summary

The official Lighthouse plugin handbook. A plugin is a Node module that adds a new custom
category to the Lighthouse report. Plugins have a stable semver API (unlike custom configs),
are shareable on npm, and must have a name starting with `lighthouse-plugin-`. The key
constraint: plugins can only access a limited set of existing artifacts (like `ImageElements`,
`MetaElements`, `MainDocumentContent`, etc.) - they CANNOT use custom Gatherers. To collect
custom page data, a full custom Lighthouse configuration (not a plugin) is required.

## Plugin vs Custom Config comparison

| Capability | Plugin | Custom Config |
|---|---|---|
| Include custom audits | ✅ | ✅ |
| Add a custom category | ✅ | ✅ |
| Easily shareable via npm | ✅ | ❌ |
| Semver-stable API | ✅ | ❌ |
| Gather custom data from page (artifacts) | ❌ | ✅ |

## Plugin structure

A plugin requires three files:
1. `package.json` - name must start with `lighthouse-plugin-`, use `peerDependencies` for lighthouse
2. `plugin.js` - declares audits array and category definition
3. `audits/<audit-name>.js` - individual audit class files

## Audit class API

```javascript
// audits/has-cat-images.js (official example, updated for ESM)
import {Audit} from 'lighthouse';

class CatAudit extends Audit {
  static get meta() {
    return {
      id: 'has-cat-images-id',          // kebab-case, matches filename
      title: 'Page has at least one cat image',  // shown when passing
      failureTitle: 'Page does not have at least one cat image',  // shown when failing
      description: 'Why this matters. Markdown links supported.',
      requiredArtifacts: ['ImageElements'],  // must list all artifacts used
      scoreDisplayMode: 'binary',  // 'numeric' | 'binary' | 'manual' | 'informative'
    };
  }

  static audit(artifacts) {
    const images = artifacts.ImageElements;
    const catImages = images.filter(img => img.src.toLowerCase().includes('cat'));
    return {
      score: catImages.length > 0 ? 1 : 0,
      numericValue: catImages.length,  // optional raw value in JSON output
    };
  }
}

export default CatAudit;
```

```javascript
// plugin.js
export default {
  audits: [{path: 'lighthouse-plugin-example/audits/has-cat-images.js'}],
  category: {
    title: 'Cats',
    description: 'Domain-specific checks.',
    auditRefs: [{id: 'has-cat-images-id', weight: 1}],
  },
};
```

## Available artifacts for plugins

Limited set includes: `ImageElements`, `MetaElements`, `MainDocumentContent`, `AnchorElements`,
`ScriptElements`, `LinkElements`, `IFrameElements`, `BenchmarkIndex`, `fetchTime`,
`devtoolsLogs` (for network requests). Full list in official docs.

## Running during development

```bash
NODE_PATH=.. npx lighthouse https://example.com \
  --plugins=lighthouse-plugin-example \
  --only-categories=lighthouse-plugin-example \
  --view
```

## Annotations for stinger-forge

- Primary source for `guides/05-custom-plugins.md` and `templates/custom-plugin-starter.js`.
- Critical constraint to document: plugins CANNOT access custom Gatherers. If you need to run
  custom JavaScript in the page context (e.g., check a DOM element, read window properties),
  you need a full custom config with a Gatherer - not a plugin.
- The semver-stable API means plugins won't break between Lighthouse minor versions. This is a
  key selling point for distributing plugins on npm.
- Note the ESM syntax in Lighthouse 12+ (`import {Audit} from 'lighthouse'`). Older examples
  use `const {Audit} = require('lighthouse')` (CommonJS). Both work but ESM is preferred.
- For the `templates/custom-plugin-starter.js`, include a real-world example: CSP header presence
  check (uses `devtoolsLogs` artifact to inspect network responses) or third-party script
  allowlist check (uses `ScriptElements` artifact).
- Contradiction with command brief: the brief asks about "GatherContext" and `getGatherMode` -
  these are internal custom config APIs, NOT available to plugins. Stinger-forge should clarify
  this scope in the plugin guide.

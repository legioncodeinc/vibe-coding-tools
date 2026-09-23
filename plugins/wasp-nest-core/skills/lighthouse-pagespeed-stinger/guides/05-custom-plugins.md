# Guide 05: Custom Lighthouse Plugins

> Research source: `research/external/2026-05-20-lighthouse-plugin-api.md`
> Template: `templates/custom-plugin-starter.js`

A Lighthouse plugin adds a new custom category to the Lighthouse report. Plugins have a stable semver API, are shareable on npm, and are the correct extension point when existing audits don't cover a domain-specific requirement.

---

## Plugin vs custom config: when to use which

| Capability | Plugin | Custom Config |
|------------|--------|---------------|
| Add custom audits | Yes | Yes |
| Add a custom category | Yes | Yes |
| Shareable on npm | Yes | No |
| Semver-stable API | Yes | No |
| Access existing page artifacts (ScriptElements, ImageElements, etc.) | Yes | Yes |
| Gather NEW custom data from the page (custom Gatherers) | **No** | Yes |

**Critical boundary:** Plugins CANNOT access custom Gatherers. If you need to run custom JavaScript in the page context or read non-standard page data, you need a full custom Lighthouse config, not a plugin.

> "Plugins can only access a limited set of existing artifacts — they CANNOT use custom Gatherers. To collect custom page data, a full custom Lighthouse configuration (not a plugin) is required." (`research/external/2026-05-20-lighthouse-plugin-api.md`)

Common audits achievable via plugin (using existing artifacts):
- **CSP header presence**: uses `devtoolsLogs` to inspect response headers
- **Third-party script allowlist**: uses `ScriptElements` to check `src` against an allowlist
- **Missing alt text patterns**: uses `ImageElements` beyond what Lighthouse's built-in a11y audits cover
- **Custom meta tag presence**: uses `MetaElements`

---

## Plugin file structure

```
lighthouse-plugin-my-checks/
├── package.json
├── plugin.js         (declares audits array and category)
└── audits/
    └── my-audit.js   (individual audit class)
```

`package.json` requirements:
- Name must start with `lighthouse-plugin-`
- Use `peerDependencies` for `lighthouse` (not `dependencies`)

---

## Audit class API (ESM, Lighthouse 12)

```javascript
// audits/third-party-script-allowlist.js
import {Audit} from 'lighthouse';

const ALLOWED_DOMAINS = ['cdn.example.com', 'analytics.example.com'];

class ThirdPartyAllowlistAudit extends Audit {
  static get meta() {
    return {
      id: 'third-party-script-allowlist',
      title: 'Third-party scripts are from the approved allowlist',
      failureTitle: 'Third-party scripts from unapproved domains detected',
      description: 'Scripts from unapproved domains may introduce security risk or performance overhead.',
      requiredArtifacts: ['ScriptElements'],
      scoreDisplayMode: 'binary',
    };
  }

  static audit(artifacts) {
    const scripts = artifacts.ScriptElements;
    const violations = scripts.filter(script => {
      if (!script.src) return false; // inline scripts
      try {
        const hostname = new URL(script.src).hostname;
        return !ALLOWED_DOMAINS.some(allowed => hostname.endsWith(allowed));
      } catch { return false; }
    });

    return {
      score: violations.length === 0 ? 1 : 0,
      details: Audit.makeTableDetails(
        [{key: 'url', itemType: 'url', text: 'Script URL'}],
        violations.map(s => ({url: s.src}))
      ),
    };
  }
}

export default ThirdPartyAllowlistAudit;
```

---

## Plugin entry point (plugin.js)

```javascript
// plugin.js
export default {
  audits: [
    {path: 'lighthouse-plugin-my-checks/audits/third-party-script-allowlist.js'},
  ],
  category: {
    title: 'Security Checks',
    description: 'Custom security-focused audits for this project.',
    auditRefs: [
      {id: 'third-party-script-allowlist', weight: 1},
    ],
  },
};
```

---

## Running the plugin during development

```bash
NODE_PATH=.. npx lighthouse https://example.com \
  --plugins=lighthouse-plugin-my-checks \
  --only-categories=lighthouse-plugin-my-checks \
  --view
```

---

## Using the plugin in LHCI

In `lighthouserc.json`:
```json
"collect": {
  "settings": {
    "plugins": ["lighthouse-plugin-my-checks"]
  }
}
```

---

## Available artifacts for plugins

Plugins can only use pre-existing Lighthouse artifacts. The most useful for custom audits:

| Artifact | Contains |
|----------|----------|
| `ScriptElements` | `src`, `content`, `type` for all scripts |
| `ImageElements` | `src`, `alt`, `displayedWidth/Height` for all images |
| `MetaElements` | `name`, `property`, `content` for all `<meta>` tags |
| `AnchorElements` | `href`, `rel`, `text` for all links |
| `LinkElements` | `rel`, `href` for all `<link>` tags |
| `MainDocumentContent` | Raw HTML of the main document |
| `devtoolsLogs` | Network requests (response headers, initiators, etc.) |

Full list: https://github.com/GoogleChrome/lighthouse/blob/main/core/gather/gatherers/

---

## ESM vs CommonJS note

Lighthouse 12 prefers ESM (`import {Audit} from 'lighthouse'`). Both ESM and CommonJS (`const {Audit} = require('lighthouse')`) work in Lighthouse 12, but prefer ESM in new plugins. Lighthouse 13 (unreleased as of May 2026, requires Node 22.19+) may require ESM.

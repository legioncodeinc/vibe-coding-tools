/**
 * custom-plugin-starter.js
 *
 * Scaffold for a Lighthouse plugin with a third-party script allowlist audit.
 * Guide: guides/05-custom-plugins.md
 *
 * IMPORTANT: Plugins can ONLY use existing Lighthouse artifacts.
 * They CANNOT collect custom data from the page (no custom Gatherers).
 * If you need to run custom JS in page context, use a full custom config instead.
 *
 * Setup:
 *   1. Copy this folder to `lighthouse-plugin-<your-name>/`
 *   2. Update package.json name to `lighthouse-plugin-<your-name>`
 *   3. Edit ALLOWED_DOMAINS and adjust the audit logic
 *   4. Test: NODE_PATH=.. npx lighthouse <url> --plugins=lighthouse-plugin-<your-name> --only-categories=lighthouse-plugin-<your-name> --view
 *   5. Reference in lighthouserc.yaml: settings.plugins: ['lighthouse-plugin-<your-name>']
 */

// ============================================================
// package.json (create separately)
// ============================================================
// {
//   "name": "lighthouse-plugin-my-checks",
//   "version": "1.0.0",
//   "peerDependencies": {
//     "lighthouse": ">=12.0.0"
//   },
//   "type": "module"
// }

// ============================================================
// audits/third-party-script-allowlist.js
// ============================================================

import {Audit} from 'lighthouse';

/**
 * Domains that are approved to serve scripts on this site.
 * Add your CDN, analytics, and approved vendor domains here.
 */
const ALLOWED_DOMAINS = [
  'cdn.yoursite.com',
  'cdn.jsdelivr.net',
  // Add your approved domains:
  // 'analytics.google.com',
  // 'static.cloudflareinsights.com',
];

export class ThirdPartyScriptAllowlistAudit extends Audit {
  static get meta() {
    return {
      id: 'third-party-script-allowlist',
      title: 'Third-party scripts are from approved domains',
      failureTitle: 'Third-party scripts from unapproved domains detected',
      description:
        'Scripts from unapproved domains may introduce security risk, ' +
        'performance overhead, or GDPR liability. Maintain an explicit allowlist.',
      requiredArtifacts: ['ScriptElements'],
      scoreDisplayMode: 'binary',
    };
  }

  static audit(artifacts) {
    const scripts = artifacts.ScriptElements;

    const violations = scripts.filter(script => {
      if (!script.src) return false; // inline scripts — skip
      try {
        const hostname = new URL(script.src).hostname;
        const isAllowed = ALLOWED_DOMAINS.some(
          allowed => hostname === allowed || hostname.endsWith(`.${allowed}`)
        );
        return !isAllowed;
      } catch {
        return false;
      }
    });

    return {
      score: violations.length === 0 ? 1 : 0,
      numericValue: violations.length,
      displayValue: violations.length > 0 ? `${violations.length} unapproved script(s)` : '',
      details: Audit.makeTableDetails(
        [{key: 'url', itemType: 'url', text: 'Script URL'}],
        violations.map(s => ({url: s.src}))
      ),
    };
  }
}

// ============================================================
// plugin.js (the plugin entry point)
// ============================================================

export default {
  // List all audit files. Use relative paths from this plugin's root.
  audits: [
    {path: 'lighthouse-plugin-my-checks/audits/third-party-script-allowlist.js'},
  ],
  // The custom category that appears in the Lighthouse report
  category: {
    title: 'Custom Security Checks',
    description: 'Domain-specific security and compliance checks for this project.',
    auditRefs: [
      // id must match the `id` in the audit's meta()
      {id: 'third-party-script-allowlist', weight: 1},
      // Add more audits here as needed
    ],
  },
};

// ============================================================
// Available artifacts for your audits (partial list)
// ============================================================
// ScriptElements        — { src, content, type } for all <script> elements
// ImageElements         — { src, alt, displayedWidth, displayedHeight, ... }
// MetaElements          — { name, property, content } for all <meta> tags
// AnchorElements        — { href, rel, text } for all <a> tags
// LinkElements          — { rel, href } for all <link> tags
// MainDocumentContent   — raw HTML of the main document
// devtoolsLogs          — network requests, response headers, initiators
//
// Full list: https://github.com/GoogleChrome/lighthouse/tree/main/core/gather/gatherers

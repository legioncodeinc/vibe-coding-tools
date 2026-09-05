---
source_type: github
url: https://github.com/wooorm/starry-night
fetched: 2026-05-20
authority: high
relevance: medium
topic: syntax_highlighting
---

# wooorm/starry-night: GitHub-Fidelity Syntax Highlighting

## Summary
starry-night is an open-source JavaScript package providing GitHub-exact syntax highlighting. Uses TextMate grammars (same as VS Code, SublimeText, Atom). Produces AST objects (not just HTML) enabling flexible rendering. Latest: v3.9.0 (January 19, 2026). 600+ grammars, WASM-based. Best suited for docs sites requiring GitHub-exact rendering; too heavy for browser-only use cases.

## Key quotations / statistics
- "Supports 600+ grammars with extremely high quality"
- "Uses TextMate grammars also employed by SublimeText, Atom, and VS Code"
- "Produces AST objects rather than just HTML, enabling flexible rendering across different contexts"
- "Works with CSS-based theming for accessibility features around color blindness and contrast"
- v3.9.0 released January 19, 2026
- 1,780 GitHub stars; ~46.9K weekly npm downloads
- "Potentially too heavy for browser environments where lighter alternatives like lowlight or refractor might be preferable"
- Companion: `markdown-tm-language` for Markdown/MDX grammars (CommonMark + GFM + frontmatter + directives + MDX syntax)

## Annotations for stinger-forge
- Informs `guides/03-syntax-highlighting.md`: starry-night section
- Use case: "when you need GitHub-exact rendering": narrow use case vs Shiki's broader applicability
- The WASM + large grammars constraint means it's a server-side-only choice (not for browser bundles)
- The companion `markdown-tm-language` package is notable for MDX-specific Markdown highlighting
- Contrast with Shiki: Shiki is more versatile and lighter; starry-night is GitHub-exact but heavier

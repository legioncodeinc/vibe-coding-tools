---
source_type: github
url: https://github.com/hashicorp/next-mdx-remote
fetched: 2026-05-20
authority: high
relevance: high
topic: mdx_compiler
---

# hashicorp/next-mdx-remote (Archived)

## Summary
The GitHub repository for next-mdx-remote, now archived by Hashicorp. Latest release is v6.0.0 (February 12, 2026). Important 2026 status: the project is archived and no longer supported, but v6 still works. Documents RSC mode (next-mdx-remote/rsc import), Turbopack compatibility workaround, and known breaking issues with Next.js 15.2.x.

## Key quotations / statistics
- "Project is archived and no longer supported as of 2026"
- v6.0.0 released February 12, 2026
- v5 released May 22, 2024: first version with MDX v3 support and RSC mode
- RSC mode: import from `next-mdx-remote/rsc`
- "When using with Turbopack, you need to add `transpilePackages: ['next-mdx-remote']` to your next.config.js"
- Next.js 15.2.x RSC mode bug: "Cannot read properties of undefined (reading 'stack')"; workaround: downgrade to Next.js 15.1.7

## Known Issues
- Fatal RSC error with Next.js 15.2.1+: breaking compatibility between rehype/remark plugins and next-mdx-remote RSC implementation
- GitHub issue #488 documents the 15.2.x breakage

## Annotations for stinger-forge
- **CRITICAL for guides/01-compiler-selection.md**: next-mdx-remote is archived; recommend Velite for new projects; note v6 works but no future updates
- The 15.2.x RSC bug must be documented as a "known gotcha" with workaround
- The Turbopack transpilePackages workaround belongs in the Next.js integration section
- This source directly informs the "compiler selection decision matrix": next-mdx-remote should be classified as "legacy/maintenance mode" for 2026

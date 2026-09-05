# markdown-mdx-content-pipeline-worker-bee

## Domain
This Bee owns the full pipeline from raw .md/.mdx source to HTML/JSX output: compiler selection (Velite, @next/mdx, @mdx-js/mdx, with next-mdx-remote flagged as archived and Contentlayer as abandoned), the remark/rehype plugin chain and its ordering, syntax highlighting via Shiki v4, GFM, AST manipulation, custom directive plugins, math (KaTeX) and Mermaid/D2 diagram embedding, and XSS sanitization via rehype-sanitize and DOMPurify.

## Paired Stinger
[markdown-mdx-content-pipeline-stinger](../../markdown-mdx-content-pipeline-stinger) - the 2026 compiler decision matrix, canonical plugin-chain ordering, Shiki v4 migration notes, plugin-authoring boilerplate, and sanitization schema guidance.

## Trigger phrases
- "set up MDX for this project"
- "configure Shiki syntax highlighting"
- "write a remark plugin"
- "audit our rehype plugin chain"
- "sanitize user-authored markdown"
- "embed Mermaid diagrams in MDX"
- "migrate off next-mdx-remote"
- "add math rendering to markdown"

## Do NOT route when
- The ask is choosing a docs platform (Starlight, Docusaurus, Mintlify) rather than the compile pipeline; that belongs to docs-site-worker-bee.
- The ask is designing the mdx-components.tsx React component map; that belongs to react-worker-bee.
- The sanitization audit reveals a broader XSS concern beyond rehype-sanitize/DOMPurify config, such as CSP headers or stored XSS; that belongs to security-worker-bee.
- The ask is generating SDKs or enriching an OpenAPI spec from MDX docs; that belongs to api-docs-worker-bee.

## Inputs the Bee needs
- The current or intended compiler and whether the content source is trusted (docs) or user-generated (chat, comments).
- The existing remark/rehype plugin chain, if any, and its ordering.
- Whether math, diagrams, or custom directives are in scope for this request.

## Outputs
- A configuration diff or working plugin chain with pinned versions.
- A sanitization schema (docs allowlist vs. user-generated strict allowlist).
- A vitest fixture set for representative inputs and XSS sanitization tests, when setting up a new pipeline.

## Commonly sequenced with
- docs-site-worker-bee: decides the platform before this Bee configures the pipeline on top of it.
- react-worker-bee: builds the component map this Bee's compiled output renders through.
- security-worker-bee: takes broader XSS findings beyond sanitizer configuration.

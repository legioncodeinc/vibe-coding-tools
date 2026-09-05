---
name: "api-docs-stinger"
description: "'API documentation authority: Swagger UI / Redoc / Scalar / Mintlify / Stoplight / Bump.sh tool selection, OpenAPI spec enrichment with JSON examples, self-hosted and managed hosting, SDK generation (TypeScript / Python / Go via openapi-generator-cli and Fern/Speakeasy), and changelog discipline. Invoke when the user says \\\\\\\"set up API docs\\\\\\\", \\\\\\\"which docs renderer should I use\\\\\\\", \\\\\\\"generate an SDK from my spec\\\\\\\", \\\\\\\"deploy my OpenAPI docs\\\\\\\", \\\\\\\"write an API changelog\\\\\\\", \\\\\\\"compare Redoc vs Scalar\\\\\\\", or \\\\\\\"publish API reference to GitHub Pages\\\\\\\". Do NOT invoke for general documentation sites (library-worker-bee), API security scheme audits (security-worker-bee), or backend route design (python-worker-bee / react-worker-bee).'"
---

# api-docs-stinger

Procedural arsenal for `api-docs-worker-bee`, the Hive's API documentation specialist. This stinger encodes the tool comparison matrix, the example-authoring discipline, the deployment playbooks for all major hosting targets, the SDK generation pipelines, and the changelog discipline that keeps API consumers informed without breaking them.

## When this stinger applies

Load this stinger when `api-docs-worker-bee` is invoked. Typical triggers:

- "Set up API docs for this project."
- "Which renderer should I use: Redoc or Scalar?"
- "Deploy my OpenAPI spec to GitHub Pages."
- "Generate a TypeScript SDK from my spec."
- "Write a changelog entry for this breaking API change."
- "Audit our existing API docs."
- "Add examples to every endpoint."

Do NOT load it for:

- Full documentation sites beyond the API reference (route to `library-worker-bee`).
- OpenAPI security scheme audits (route to `security-worker-bee`).
- REST/GraphQL route design (route to `python-worker-bee` or `react-worker-bee`).
- CI/CD pipeline design for the docs deployment (route to `devops-worker-bee`; this stinger provides the workflow file template but does not architect the full pipeline).

## First action when this stinger is loaded

Read these in order before doing anything else:

1. **`guides/00-principles.md`**: the spec-first mindset, the five quality gates, when to route elsewhere, and the core invariants.
2. **`guides/01-tool-selection.md`**: the full tool comparison matrix and decision tree. Read this before recommending any renderer.
3. **`research/research-summary.md`**: the intelligence gathered by `scripture-historian` covering Scalar, Redoc, Mintlify, SDK generators, and changelog tooling.

Then walk the remaining guides in task order. Each guide is short; the substantive intelligence comes from the research notes under `research/external/`.

## Folder layout

```text
api-docs-stinger/
├── SKILL.md                          (this file)
├── README.md                         (one-page human overview)
├── guides/
│   ├── 00-principles.md              (spec-first mindset, five quality gates, scope boundary)
│   ├── 01-tool-selection.md          (comparison matrix: Scalar / Redoc / Swagger UI / Mintlify / Stoplight / Bump.sh)
│   ├── 02-examples.md                (JSON example authoring; x-examples; overlay files)
│   ├── 03-deployment.md              (GitHub Pages / Netlify / Vercel / self-hosted Docker)
│   ├── 04-sdk-generation.md          (openapi-generator-cli / Fern / Speakeasy; TypeScript / Python / Go)
│   ├── 05-changelog.md               ([BREAKING] convention; impact-first format; Bump.sh CI gate)
│   └── 06-done-checklist.md          (10-point validation before docs go live)
├── examples/
│   ├── scalar-github-pages-setup.md  (end-to-end Scalar + GitHub Pages for a TypeScript API)
│   ├── redoc-self-hosted-docker.md   (Redoc in multi-stage Dockerfile)
│   ├── fern-typescript-sdk.md        (Fern SDK generation from an existing OpenAPI spec)
│   └── api-changelog-entry.md        (before/after changelog entry for a breaking endpoint rename)
├── templates/
│   ├── redoc-config.yaml             (minimal Redoc config)
│   ├── scalar-config.ts              (Scalar config with theming)
│   ├── mint-json.md                  (Mintlify mint.json template)
│   ├── github-pages-workflow.yml     (GitHub Actions workflow for docs deployment)
│   ├── makefile-sdk-targets.md       (Makefile targets for SDK regeneration)
│   └── changelog-entry.md            (changelog entry with [BREAKING] annotation)
├── reports/
│   └── README.md                     (how past audit summaries accumulate)
└── research/                         (authored by scripture-historian — DO NOT MODIFY)
    ├── research-plan.md
    ├── research-summary.md
    ├── index.md
    └── external/                     (10 source notes from the normal-depth research pass)
```

## Tool selection at a glance

| Renderer | Best for | Hosting | Price |
|---|---|---|---|
| **Scalar** | New projects, 2026 default, rich theming, interactive console | Self-hosted, Scalar Cloud | Free / Cloud paid |
| **Redoc** | Enterprise; proven three-panel layout; Redocly platform | Self-hosted, Redocly | Free (OSS) / Pro |
| **Swagger UI** | Widest ecosystem; legacy compatibility | Self-hosted | Free (OSS) |
| **Mintlify** | Managed; beautiful defaults; MDX narrative + reference | Managed only | Paid ($150+/mo) |
| **Stoplight** | Design-first teams; strong mock server; collaboration | Managed | Paid |
| **Bump.sh** | API changelog as primary value; CI diff gate | Managed | Free tier / paid |

**2026 default recommendation:** Scalar for new greenfield projects. See `guides/01-tool-selection.md` for the full decision tree.

## SDK generation at a glance

| Tool | Quality | Languages | Price | Notes |
|---|---|---|---|---|
| **openapi-generator-cli** | Good (v7+) | 50+ | Free | Best for Go; Python quality improved |
| **Fern** | Excellent | TS, Python, Go, Java | Free OSS; $250/SDK/mo cloud | Acquired by Postman Jan 2026 |
| **Speakeasy** | Excellent | TS, Python, Go, Java | Free tier; paid | Strong TypeScript quality |

See `guides/04-sdk-generation.md` for generation commands and Makefile targets.

## Critical directives (lifted from the Command Brief)

These are non-negotiables. Full justification in `guides/00-principles.md`.

- **Start with the OpenAPI spec, not the tool.** Renderer choice is secondary to spec completeness.
- **Never recommend a tool without citing concrete trade-offs.** Use the comparison matrix in `guides/01-tool-selection.md`.
- **Enrich examples before publishing.** Every endpoint needs at least one JSON request example and one response example.
- **Break changes must be flagged `[BREAKING]` in the changelog.** No exception.
- **Self-hosted setups must include a one-command rebuild.** `make docs`, `just docs`, or a `package.json` script.
- **Do not scope-creep into general product docs.** Route to `library-worker-bee` when docs exceed the API reference.

---

*Command Brief: [`ai-tools/command-briefs/api-docs-worker-bee-command-brief.md`](../../command-briefs/api-docs-worker-bee-command-brief.md)*
*Forged by `stinger-forge` from `api-docs-worker-bee-command-brief.md` and `research/`. Part of The Hive by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*

---
name: "api-docs-stinger"
license: AGPL-3.0-or-later
description: "Build and maintain API docs. Use for OpenAPI examples, renderer choice, hosting, SDK consumer compatibility, or changelogs. Read README.md for the guide map."
---

# api-docs-stinger

Procedural arsenal for `api-docs-wasp-drone`, the Wasp Nest's API documentation specialist. This stinger encodes the tool comparison matrix, the example-authoring discipline, the deployment playbooks for all major hosting targets, the SDK generation pipelines, and the changelog discipline that keeps API consumers informed without breaking them.

## When this stinger applies

Load this stinger when `api-docs-wasp-drone` is invoked. Typical triggers:

- "Set up API docs for this project."
- "Which renderer should I use: Redoc or Scalar?"
- "Deploy my OpenAPI spec to GitHub Pages."
- "Generate a TypeScript SDK from my spec."
- "Qualify a reusable SDK against our stable API and existing consumers."
- "Write a changelog entry for this breaking API change."
- "Audit our existing API docs."
- "Add examples to every endpoint."

Do NOT load it for:

- Full documentation sites beyond the API reference (route to `library-wasp-drone`).
- OpenAPI security scheme audits (route to `security-wasp-drone`).
- REST/GraphQL route design (route to `python-wasp-drone` or `react-wasp-drone`).
- CI/CD pipeline design for the docs deployment (route to `devops-wasp-drone`; this stinger provides the workflow file template but does not architect the full pipeline).

## First action when this stinger is loaded

Read these in order before doing anything else:

1. **`guides/00-principles.md`**: the spec-first mindset, the five quality gates, when to route elsewhere, and the core invariants.
2. **`guides/01-tool-selection.md`**: the full tool comparison matrix and decision tree. Read this before recommending any renderer.
3. **`research/research-summary.md`**: the intelligence gathered by `scripture-historian` covering Scalar, Redoc, Mintlify, SDK generators, and changelog tooling.

Then walk the remaining guides in task order. Each guide is short; the substantive intelligence comes from the research notes under `research/external/` (source-repository research, not shipped with the plugin).

## Reusable SDK first action

For SDK requests, first read [guide 07](guides/07-qualify-reusable-sdk.md), fill the [contract qualification packet](templates/sdk-contract-qualification.md), and read the [worked cases](examples/sdk-consumer-contracts.md). Preserve existing acceptance and distinguish spec, generator, SDK package and observed server versions. Missing support or evidence stays unverified. Historical comparison tables and installation examples below do not authorize installs, credentials or publication and do not prove current pricing or runtime behavior. Fresh SDK domain grounding is in the source digest.

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
└── research/                         (authored by scripture-historian  -  DO NOT MODIFY)
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
- **Enrich examples before publishing.** Every endpoint needs examples for its actual request parameters/body and response status/media; bodyless, binary and streaming operations do not require invented JSON.
- **Break changes must be flagged `[BREAKING]` in the changelog.** No exception.
- **Self-hosted setups must include a one-command rebuild.** `make docs`, `just docs`, or a `package.json` script.
- **Do not scope-creep into general product docs.** Route to `library-wasp-drone` when docs exceed the API reference.

---

*Procedure: [skill procedure](SKILL.md)*
*Forged by `stinger-forge` from `api-docs-wasp-drone-command-brief.md` and `research/`. Part of The Wasp Nest by [Mario Aldayuz a.k.a @thenotoriousllama](https://github.com/thenotoriousllama).*

## Critical Directive

- You must read all files and context contained within your skill.
- In the event your core knowledge does not provide sufficient guidance you must make every attempt to search the internet, related knowledge base documentation files, and other available resources to supplement your knowledge prior to proceeding with your task.
- Additional related skills can be found here:
  - [mcp-tool-docs-stinger](../mcp-tool-docs-stinger) - Exported TypeScript reference and tool documentation.
  - [library-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/wasp-nest-core/skills/library-stinger) - Narrative documentation and contract context.

## Ship Gate

Prior to committing any code to the repository you must utilize in order the security-stinger, quality-stinger, and github-repo-health-stinger. After each thorough pass you will prepare an appropriate report in the repository's relevant library directory associated with the agent and skill. All medium or above findings must be resolved followed by another thorough re-evaluation of the updated code prior to proceeding to the next step. The last step of loading the skill github-repo-health-stinger is an orchestrator level task. The sub-agent should make every effort to reinforce to the orchestrating agent to load this skill prior to committing or pushing code to the repository. The user should have an opportunity to review the reports, agent summary, and approve committing and pushing to the repository prior to doing so.

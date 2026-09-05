# Content Pyramid: Diátaxis Model

Docs that work treat documentation as four distinct kinds of content: each with a different purpose, different audience state, and different authoring pattern. Confusing the kinds produces the "one big guide" anti-pattern: a document that is 40% tutorial, 30% reference, and 30% conceptual explanation that serves none of its readers well.

> Source: `research/external/2026-05-20-diataxis-framework.md`

---

## The four kinds

| Kind | Purpose | User state | Typical heading style |
|---|---|---|---|
| **Tutorial** | Learning-oriented; guides through a concrete task to build competence | Beginner, learning | "Build your first X" |
| **How-to guide** | Task-oriented; addresses a specific, real-world problem | Competent practitioner, working | "How to configure Y" |
| **Reference** | Information-oriented; describes the system precisely | Practitioner consulting specific fact | "API reference / Config options" |
| **Explanation** | Understanding-oriented; illuminates background, concepts, design choices | Practitioner seeking understanding | "Why Z works this way" |

The Diátaxis two-dimensional map:
- **Acquisition axis** (tutorials/explanations): content that helps users develop competence they don't yet have.
- **Application axis** (how-to guides/reference): content that helps users accomplish goals they already know they want to achieve.

---

## Mapping kinds to navigation structure

### For most developer-facing docs sites:

```
/docs
├── getting-started/       <- Tutorial zone
│   ├── quickstart.md
│   └── first-integration.md
├── guides/                <- How-to zone
│   ├── authentication.md
│   ├── error-handling.md
│   └── performance.md
├── reference/             <- Reference zone
│   ├── api/               <- OpenAPI rendered here (route to api-docs-worker-bee)
│   ├── configuration.md
│   └── cli.md
└── concepts/              <- Explanation zone
    ├── architecture.md
    └── data-model.md
```

### For API-first products (Fern, Mintlify OpenAPI):

```
/docs
├── quickstart.md          <- Tutorial
├── guides/                <- How-to
├── api-reference/         <- Reference (auto-generated from OpenAPI)
└── concepts/              <- Explanation
```

---

## Common anti-patterns to flag

| Anti-pattern | Fix |
|---|---|
| **One big guide**: tutorial + how-to + reference in a single page | Split into kind-specific pages; link between them |
| **Reference masquerading as a guide**: "Here's what each field does" as a guide | Move field descriptions to reference; guides should have a clear task goal |
| **Tutorial that never reaches a working artifact** | A tutorial must end with something the user built and can run |
| **Explanation section that's just a FAQ** | FAQs are anti-pattern in Diátaxis; convert questions to either how-to guides or explanation prose |
| **No explanation section**: most common omission | Build the "concepts" or "architecture" section; it answers the "why does this work this way?" question that reference and guides can't |

---

## Applying the model per platform

- **Docusaurus:** sidebar categories map naturally to the four kinds. Use `category.json` to group pages. See `guides/04-docusaurus.md`.
- **Mintlify:** `mint.json` `navigation` array. Group pages under "Getting Started", "Guides", "API Reference", "Concepts" tabs. See `guides/05-mintlify.md`.
- **Starlight:** `astro.config.mjs` `sidebar` array. Nest items into top-level groups matching the four kinds. See `guides/07-starlight.md`.
- **MkDocs Material:** `mkdocs.yml` `nav` section. Prefix with kind labels. See `guides/06-mkdocs-material.md`.

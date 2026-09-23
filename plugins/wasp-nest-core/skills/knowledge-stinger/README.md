# knowledge-stinger

Companion skill to `library-stinger` for authoring **narrative knowledge documentation** - the technically deep, human-readable domain docs under `library/knowledge/private/<domain>/`.

## Purpose

`library-stinger` + `library-wasp-drone` own PRDs, IRDs, and the documentation lifecycle.  
`knowledge-stinger` + `knowledge-wasp-drone` own the knowledge/ domain - everything from system overviews to SQL schema references to coding standards.

## Directory map

```
knowledge-stinger/
  SKILL.md                          ← skill entry point (read this first)
  README.md                         ← this file
  guides/
    01-domain-taxonomy.md           <- what belongs in each domain this repo uses
    02-document-format.md           <- exact document format spec with annotated examples
    03-analysis-workflow.md         <- step-by-step workflow for building a full knowledge base
  templates/
    knowledge-doc-template.md       ← blank template (copy this to start a new doc)
  examples/
    example-system-overview.md      ← target quality example (architecture domain)
    example-auth-architecture.md    ← target quality example (auth domain with sequence diagram)
```

## Quick reference

| I want to... | Read this |
|---|---|
| Understand what goes in each domain folder | `guides/01-domain-taxonomy.md` |
| See the exact format every doc must follow | `guides/02-document-format.md` |
| Build a full knowledge base from scratch | `guides/03-analysis-workflow.md` |
| Start a new doc | Copy `templates/knowledge-doc-template.md` |
| See a target quality example | `examples/example-system-overview.md` |

## Relationship to library-stinger

| Artifact type | Skill | Agent |
|---|---|---|
| PRDs | `library-stinger` | `library-wasp-drone` |
| IRDs | `library-stinger` | `library-wasp-drone` |
| Knowledge docs | `knowledge-stinger` | `knowledge-wasp-drone` |
| QA reports | `quality-stinger` | `quality-wasp-drone` |
| ADRs | `adr-writing-stinger` | `adr-writing-wasp-drone` |

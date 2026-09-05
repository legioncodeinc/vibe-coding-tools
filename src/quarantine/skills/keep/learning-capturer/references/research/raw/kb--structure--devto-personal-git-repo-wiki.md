# A Personal Git Repo as a Knowledge Base Wiki

- **URL:** https://dev.to/adam_b/a-personal-git-repo-as-a-knowledge-base-wiki-j51
- **Fetched:** 2026-08-17
- **Source type:** community (practitioner write-up, DEV Community)
- **Why archived:** The only source in this archive describing a concrete on-disk layout
  for a personal technical knowledge base, and the argument for plain markdown in version
  control over a hosted tool.

## Structure described

- Root level `index.md` as the entry point
- One directory per major topic, each with its own `index.md`
- Individual `.md` files for articles inside topic directories
- Optional further nesting for large topics, with the stated goal of being "just organised
  enough without having a crazy directory tree structure"

## Format convention

Everything is markdown. Quoted rationale: "Markdown is familiar to a large proportion of
developers, is easy to write, and widely-supported."

## Reading and browsing

No dedicated search tool is described. The author renders the repo with MDwiki: drop an
HTML file into the repo root, rename it `index.html`, point a web server at the folder.

## Why plain files in git over a hosted tool

- **Portability.** Quoted: "This approach removes the reliance on proprietary sites."
- **Durability.** Even if the git hosting account is lost, "each copy of the repo is just
  the same as any other."
- **Flexibility.** You are "not beholden to any particular standard" and can "write in the
  way that works for you."
- **Formatting.** Code snippets, links, tables, and lists take "minimal effort."

## Named gap

The author does not solve search. The layout is browsable, not indexed, and the piece
offers no answer to finding an entry by a remembered error string months later. That gap
is where this skill's index and the greppable symptom line come in, and it is a design
decision, not a researched practice.

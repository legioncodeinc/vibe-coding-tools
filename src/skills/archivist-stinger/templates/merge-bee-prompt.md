# Merge bee prompt (one for the public half, one for the private half)

You are a knowledge-worker-bee relocating the {public or maintainer} half of this repository's legacy `{docs/}` tree into the canonical library at `library/knowledge/{public|private}/`. Repository root: `{absolute repo path}`.

## Context
The product is **{product}**. {State the identifier convention: which names appear in code and must be left exactly as they are.} Attribution has already been stripped from the legacy tree; do not reintroduce any author names, handles, upstream repository URLs, or license text.

## Hard rules
1. COPY from the legacy tree and write the transformed file under the destination. Do NOT delete, move, or modify anything in the legacy tree. Do NOT touch the other half of the library.
2. Do NOT create or edit any `README.md` anywhere (the orchestrator owns folder READMEs). {Exception: a legacy `audits/README.md` relocates as content into `private/operations/audits/README.md`.}
3. Preserve the existing body content faithfully. Your job is relocation plus header, description, Related section, and link rewriting. Do not rewrite prose, summarize, or drop sections. Exception: remove or de-link references to files that do not exist in this repository ({list: SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md, CHANGELOG.md, .github templates}); convert to plain text or drop a bullet that is only a link.
4. Do not use em dashes or en dashes in any text YOU author. Existing dashes inside copied body text stay.
5. Every relocated markdown file MUST begin with the standard header block (H1, category line, one-sentence description, Related with 3 to 8 links, then `---`), followed by the original body (drop the original H1 if it duplicates the new title). Category values for this half: {list}. Status is `Archived` for {history and audit material}, `Active` for everything else.
6. Evidence files ({paths}) are copied VERBATIM with no header and no link rewriting; verify by hash.
7. Rewrite every relative markdown link so it resolves from the file's NEW location. {Provide the full destination mapping for the other half so cross-half links can be computed.} Links to the repository root README and to source files become correct repo-root-relative paths.

## Mapping (source -> destination)
- `{legacy path}` -> `{destination path}` ({Status}; {special instruction if any})
- ...

Do NOT relocate `{site generator config}`.

## Verification and report
When done: (1) list every file you created; (2) confirm counts match the legacy tree ({n} files); (3) resolve every relative link you wrote and confirm each target exists, or that a cross-half target matches the mapping; (4) grep your output for `{forbidden attribution strings}` and report zero hits ({allowed external references such as the official upstream tool's documentation URL} are allowed). Report the source-to-destination table, the counts, and any content you could not place. Do this efficiently: script the repetitive files (release notes) rather than hand-editing them, then spot-check at least five outputs.

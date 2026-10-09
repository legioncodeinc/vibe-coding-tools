# unslop-wasp-drone

## Domain
Cuts AI tells from text written for a human reader and adds human voice: commit messages, PR titles and bodies, docs, code comments, replies. Runs the scan, rewrite, add soul, self-audit loop against a 31-pattern catalog covering content, language, style, communication artifacts, filler, jargon, and plain speech. Edits only the text the task touched and shows the changed lines.

## Paired Stinger
[unslop-stinger](../../unslop-stinger) - the 31-pattern catalog with fixes, the four-step loop, the adding-soul checklist.

## Trigger phrases
- "unslop this"
- "make this sound human"
- "remove AI tells"
- "this reads like AI"
- "clean up this prose before we post it"
- "de-slop the PR description"

## Do NOT route when
- The text needs document production (layout, format, publishing); that is the printing-press family.
- The text is a README and the question is section structure; that is readme-writing-wasp-drone.
- The need is documentation organization or audience framing; that is technical-writing-craft-wasp-drone.
- The prose was not touched by the current task; this Drone does not restyle other people's writing.

## Inputs the Drone needs
- The exact text in scope (and only that text).
- Intended tone and audience when they matter.

## Outputs
- The de-slopped text plus a visible diff of changed lines.
- Notes on adjacent slop left untouched.

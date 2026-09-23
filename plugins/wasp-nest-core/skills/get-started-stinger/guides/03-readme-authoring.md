# 03. README authoring

How to fill `templates/README.md` so an AI or a human can complete it cleanly, and why the section order is fixed.

## Why this order

The canonical order is decreasing urgency: name and one-liner, badges, what it is, why it exists, quick start, install, usage, configuration, architecture, development, testing, deployment, contributing, license. Readers scan top to bottom and bail once they lose the thread, so the answers a first-time visitor needs to decide "is this worth my next five minutes" sit at the top, and reference material a returning user needs sits lower [raw/get-started--readme--how-to-write-a-github-readme-repoclip.md]. Do not reorder sections even if a later one feels more important to you: reordering forces every reader to hunt for the answer they came for.

## Filling it out

- **One-liner**: lead with the verb. "Converts CSV files to Markdown tables," not "This is a CSV project." State what it does and for whom.
- **Badges**: 3-5 maximum, each carrying real information (CI status, version, license, coverage). The template ships CI/license/release badges wired to `{org}`/`{repo}`/`{default_branch}` placeholders: fill those from the actual git remote, don't invent an org name. Drop any badge that would always read the same value; a badge that never changes conveys nothing.
- **Quick start vs Install vs Usage**: these are three different jobs, not one. Quick start is the smallest possible "install, run one command, see output": seconds, not a tour. Install is the full prerequisite list plus the exact copy-paste command, stated in that order (prerequisites first, so the reader isn't three lines into a failing command before learning they needed Node 20). Usage is where real value gets demonstrated: lead with the most common case, add one or two advanced examples after, keep each self-contained enough to copy and run without extra context [raw/get-started--readme--how-to-write-a-github-readme-repoclip.md].
- **Configuration**: a table, not prose. Every environment variable this project reads belongs here, cross-referenced with `.env.example` (guide `04`) so the two files never drift out of sync: the table's `{ENV_VAR_NAME}` rows should match `.env.example`'s keys exactly.
- **Architecture**: optional for a single-purpose utility, expected for anything with more than one moving part. GitHub renders ` ```mermaid ` fenced code blocks natively, so prefer a Mermaid diagram over an external image file that will go stale.
- **Contributing / License**: keep these short in the README itself and link out to `CONTRIBUTING.md` and the `LICENSE` file rather than duplicating their full content. A missing or ambiguous license legally defaults to "all rights reserved," which blocks corporate adoption even for genuinely open code: never leave the License section unfilled.

## Placeholder discipline

Every `{placeholder}` in the template exists so an AI filling this out has an explicit slot rather than a blank canvas to improvise on. Resolve as many as possible from observable repo state (package.json, git remote, LICENSE file, lockfile) before asking the user anything. For anything you can't observe (why the project exists, what the architecture diagram should show), leave the placeholder in place and flag it in the verification report rather than inventing plausible-sounding filler: a README that states something false is worse than one with a visible gap.

## Failure modes to avoid when filling this in

Named directly in the research: burying the value proposition under a table of contents or badge wall; a wall of text with no visual; an install command that only works because of local state on the machine that wrote it (test on a clean checkout mentally, or actually); describing a feature instead of showing a runnable example of it; and a README that references a version or API two releases old [raw/get-started--readme--how-to-write-a-github-readme-repoclip.md].

# Guide 01: Provenance intake

Phase 1 of the archivist procedure. Nothing is removed from the repository until this phase ends with a signed intake manifest, because the manifest is what tells the scrub which notices the acquirer owns and which it does not.

Grounding: `../references/research/distilled-archival-sanitization.md`, sections 1, 2, 3, and 6. Template: `../templates/intake-manifest.md`. Tool: `../scripts/attribution_sweep.py`.

## Why intake comes first

An acquisition transfers the seller's copyright. It transfers nothing about a vendored library, a copied snippet under someone else's notice, or a contributor who never assigned their rights. Maven's own manifest guidance already draws this line: a project lists the licenses that apply directly to it, "not licenses that apply to the project's dependencies" [distilled, section 2]. The intake exists to draw that line for the whole repository before any file changes.

The manifest is also the "additional information" that turns the sanitized archive into pseudonymised data rather than anonymous data [distilled, section 3]. It records who the placeholders stand for, so it stays outside the repository and outside the archive bundle.

## Procedure

1. **Record the ownership basis.** Fill section 1 of the intake manifest from the acquisition instrument: parties, scope (whole repository, named components, or specific tags), and contributor coverage. Reference the instrument; never paste it.
2. **Run the sweep with the git census.** From the repository root:

   ```bash
   python <stinger>/scripts/attribution_sweep.py . --git --json intake-sweep.json --max-hits 8
   ```

   Read the category table first. The `first-party` column is the removal candidate list; `third-party` and `generated` columns are preserve-or-leave decisions. The `git identities` block is the contributor census; compare its count with the coverage stated in the instrument.
3. **Census the credits that git does not show.** Release notes, changelogs, README acknowledgments, and audit evidence often credit people who never committed. The `credit` and `handle` categories catch the common phrasings ("reported by", "thanks to", `@handle`). Add any names or handles found to section 2 of the manifest with a count, never with the names themselves in the repository copy of any report.
4. **Inventory every notice location.** Check, in this order, and record each as an SPDX identifier or a `LicenseRef-` id:
   - root files matching `LICENSE*`, `LICENCE*`, `COPYING*`, `NOTICE*`, `AUTHORS*`, `CONTRIBUTORS*`, `MAINTAINERS*`, `CODEOWNERS`, `PATENTS`;
   - a `LICENSES/` directory (REUSE layout; one file per license, frequently including dependency licenses);
   - per-file headers (`SPDX-License-Identifier`, `SPDX-FileCopyrightText`, `Copyright`, `©`), `.license` sidecars, `REUSE.toml`, `.reuse/dep5`;
   - README license statements;
   - manifest fields per ecosystem (the table in distilled section 2): people fields, license fields, origin links, and deprecated fields that still ship (`authors` in Cargo, `owners` in nuspec).
5. **Classify every notice by owner.** First-party (the seller's own notice, covered by the acquisition), third-party (a dependency's or contributor's notice, not covered), or generated (lockfile and build-output metadata that mirrors upstream). Fill section 3 of the manifest. When in doubt, third-party.
6. **Scan for secrets separately.** Attribution and PII are not secrets. If a scanner is available, run it over history as well as the tree (`gitleaks git .` or `trufflehog git <path> --results=verified`) and record counts by type in section 2. A live secret is rotated before anything is deleted [distilled, sections 3 and 4]. If no scanner is installed, say so in the manifest rather than implying the sweep covered it.
7. **Record the reach of the scrub.** If the seller's repository was ever public, forks and cached views may hold the original content and are not reachable by any change to this copy [distilled, sections 1 and 4]. Note that in section 5 so the report does not overclaim.
8. **Decide the later phases now.** Section 5 of the manifest fixes: history rewrite (yes, no, defer), legacy documentation retirement, identifier rename scope, priority domains for the knowledge base, and whether public documents are produced.
9. **Sign off.** Section 6. Phase 2 does not start on an unsigned manifest.

## Risk flags to raise before proceeding

| Flag | Why it matters | What to write |
| --- | --- | --- |
| More distinct git identities than the instrument covers | Uncovered contributors retain their rights; their code is not the acquirer's to relicense | List the count and ask for confirmation of coverage or assignment |
| Copyleft license in a vendored or copied component | The component's terms survive the acquisition regardless of the seller's license | Preserve its notice; note the obligation |
| `LICENSES/` entries or NOTICE files naming dependencies | These are third-party by construction | Preserve |
| Generated files carrying upstream metadata (lockfiles, snapshots, bundled distributions) | Regenerating them is safer than editing them | Leave, note, regenerate after the rename if needed |
| Distributable artifacts built from the source (wheels, jars, packages) | Built metadata copies manifest fields (PEP 639 `License-File`, `License-Expression`) | Rebuild after the scrub or exclude from the archive |
| `noreply` forge addresses in commit metadata or fixtures | They embed the username or account id | Count as PII |

## Output

- The intake manifest, completed and signed, stored outside the repository.
- `intake-sweep.json`, kept with the manifest, not in the repository.
- A one-paragraph provenance summary for section 2 of the final report (`../templates/archivist-report.md`), written without names.

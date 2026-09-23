# Guide 05: Renaming the product identifier

Phase 5, optional. When the acquirer names the archived product, every spelling of the old identifier that presents the package to the outside world is renamed, consistently across code, tests, manifests, and documentation, without breaking the repository.

Grounding: `../references/worked-example.md` (2,536 occurrences, 295 files). Tools: `../scripts/identifier_forms.py`, `../scripts/apply_replacements.py`.

## Decide the scope from the acquirer's own README first

The README the acquirer wrote is the specification of intent. In the worked run it renamed the package and command family but kept the storage root and environment-variable family, and following it avoided a rename that would have contradicted their own document. Ask the README before asking the user; ask the user only where the README is silent.

| Form | Usually in scope | Usually out of scope unless asked |
| --- | --- | --- |
| Package name in manifests and lockfile root | yes | |
| Command and binary names, script filenames | yes | |
| Plugin or extension manifests | yes | |
| Display names, launcher names, bundle identifiers, provider ids | yes | |
| Legacy scoped package names in uninstall and migration hints | yes, to the acquirer's stated legacy name | |
| Environment variable family (`OLD_NAME_*`) | | keep unless the README renames it |
| Storage root and on-disk paths | | keep: renaming moves user data |
| Internal symbol names (`OldNameConfig`, `getOldNameDir`) | | keep: refactor, not rename |
| Go module path | | keep unless asked: it is an import-path change |

## Procedure

1. **Inventory every form**:

   ```bash
   python <stinger>/scripts/identifier_forms.py old-name . --new new-name --json rename.json
   ```

   The forms are kebab, snake, screaming snake, Pascal, camel, Title Case, Hyphenated-Title, dotted, and upper-kebab. The output lists counts per form per file, file and directory names carrying the identifier, and an ordered replacement map (most specific spelling first).
2. **Prune the map to the decided scope.** Remove the screaming form if env vars stay; remove Pascal and camel if internal symbols stay. Add path filters so vendored trees and evidence stay untouched where the acquirer wants history preserved verbatim.
3. **Handle the derived strings the forms miss**: HTTP header names built from the identifier (`X-Old-Name-*`), probe or lock file names, temp-directory prefixes, reverse-DNS ids (`com.old-name.*`), schema `$id` hosts, and split path segments (`"@scope", "old-name"`). Grep for each after the main pass.
4. **Dry-run, then apply**, excluding dependency roots:

   ```bash
   python <stinger>/scripts/apply_replacements.py rename.json . --exclude-dir vendor
   python <stinger>/scripts/apply_replacements.py rename.json . --exclude-dir vendor --apply
   ```

5. **Rename files and directories** listed by the inventory, then confirm every reference to the old filename was rewritten by the map (manifest `bin` and `files` entries, tsconfig or build includes, test imports, documentation).
6. **Keep tests aligned with code.** Fixtures that pin a display name, header name, or bundle id are renamed with the code; a test that now asserts an old string is a leftover, not a test to delete.
7. **Rewrite the prose that explained the old naming.** Knowledge docs written before the rename may say the code "still carries" the old identifier; after the rename those sentences are false. Grep for `still carr`, `identifier`, `spelling`, and the old name in prose, and rewrite to the new convention, naming what deliberately kept an older spelling.
8. **Check what can be checked without installing dependencies**: `node --check` on scripts, `python -m py_compile` on Python, JSON parse on manifests, TOML or YAML load where a parser is available. Running the test suite is a separate decision the acquirer makes.
9. **Sweep for leftovers** with the inventory script again (all forms) and a plain grep of the old name; expect zero outside intentionally preserved history and evidence.

## Output

- The applied rename map and the list of renamed files.
- The list of forms deliberately left unchanged, with the reason, for section 6 of the report.
- The leftover count (zero) and the syntax-check results.

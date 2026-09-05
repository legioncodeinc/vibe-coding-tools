# PEP 639 - Improving License Clarity with Better Package Metadata
- URL: https://peps.python.org/pep-0639/
- Fetched: 2026-09-05
- Source type: official-spec

Author: Philippe Ombredanne <pombredanne at nexb.com>, C.A.M. Gerlach <CAM.Gerlach at Gerlach.CAM>, Karolina Surma <karolina.surma at gazeta.pl>
PEP-Delegate: Brett Cannon <brett at python.org>
Status: Final
Type: Standards Track
Topic: Packaging
Created: 15-Aug-2019
Post-History: 15-Aug-2019, 17-Dec-2021, 10-May-2024

Note (page banner): This PEP is a historical document. The up-to-date, canonical spec, Core metadata specifications, is maintained on the PyPA specs page.

## Abstract

This PEP defines a specification how licenses are documented in the Python projects.

To achieve that, it:

- Adopts the SPDX license expression syntax as a means of expressing the license for a Python project.
- Defines how to include license files within the projects, source and built distributions.
- Specifies the necessary changes to Core Metadata and the corresponding Pyproject Metadata keys
- Describes the necessary changes to the source distribution (sdist), built distribution (wheel) and installed project standards.

This will make license declaration simpler and less ambiguous for package authors to create, end users to understand, and tools to programmatically process.

The changes will update the Core Metadata specification to version 2.4.

## Goals

This PEP's scope is limited to covering new mechanisms for documenting the license of a distribution package, specifically defining:

- A means of specifying a SPDX license expression.
- A method of including license texts in distribution packages and installed Projects.

The changes that this PEP requires have been designed to minimize impact and maximize backward compatibility.

## Non-Goals

This PEP doesn't recommend any particular license to be chosen by any particular package author. If projects decide not to use the new fields, no additional restrictions are imposed by this PEP when uploading to PyPI. This PEP also is not about license documentation for individual files, though this is a surveyed topic in an appendix, nor does it intend to cover cases where the source distribution and binary distribution packages don't have the same licenses.

## Motivation (summary)

Software must be licensed for anyone other than its creator to download, use, share and modify it. Multiple fields document licenses in Core Metadata today, each with limitations, causing confusion for authors and end users/re-packagers. Python packages tend to have more ambiguous and missing license information than other ecosystems (per statistics from the ClearlyDefined project covering PyPI, Maven, npm and Rubygems). Extending the license classifiers to cover the full SPDX identifier range was considered and rejected for several reasons: duplicating and syncing the SPDX list is effortful; it is a hard backward-compatibility break; it doesn't handle multi-license/vendored/relicensed cases; it requires understanding a PyPI-specific classifier system; and it gives no clear signal that a package adopted the new system.

## Rationale

A survey of existing license metadata across the Python ecosystem, other packaging systems, Linux distributions, language ecosystems and applications found: SPDX and SPDX-like syntaxes are the most popular license expressions in many modern package systems, and most FOSS licenses require the full license text to be included in a Distribution Package. Therefore this PEP introduces two new Core Metadata fields:

- `License-Expression` that provides an unambiguous way to express the license of a package using SPDX license expressions.
- `License-File` that offers a standardized way to include the full text of the license(s) with the package when distributed, and allows other tools consuming the Core Metadata to locate a distribution archive's license files.

This builds on existing practice in Setuptools and Wheel; an up-to-date draft is implemented in Hatch, and an earlier draft of the license-files portion is implemented in Setuptools.

## Terminology

Keywords MUST/MUST NOT/REQUIRED/SHOULD/SHOULD NOT/RECOMMENDED/MAY/OPTIONAL are interpreted per RFC 2119.

- **license classifier**: A PyPI Trove classifier which begins with `License ::`.
- **license expression / SPDX expression**: A string with valid SPDX license expression syntax including one or more SPDX license identifier(s), which describes a Project's license(s) and how they inter-relate. Examples: `GPL-3.0-or-later`, `MIT AND (Apache-2.0 OR BSD-2-clause)`
- **license identifier / SPDX identifier**: A valid SPDX short-form license identifier, including all valid SPDX identifiers and custom `LicenseRef-[idstring]` strings conforming to SPDX specification clause 10.1. Examples: `MIT`, `GPL-3.0-only`, `LicenseRef-My-Custom-License`
- **root license directory / license directory**: The directory under which license files are stored in a project source tree, distribution archive or installed project; also the root that License-File paths are relative to. Defined as the project root directory for a project source tree or sdist, and a subdirectory named `licenses` of the directory containing the built metadata (i.e. the `.dist-info/licenses` directory) for a Built Distribution or installed project.

## Specification

Changes necessary to implement this PEP: additions to Core Metadata; additions to author-provided project source metadata; additions to sdist/wheel/installed-project specs; and a guide for tools converting legacy license metadata to license expressions.

### SPDX license expression syntax

This PEP adopts the SPDX license expression syntax as documented in the SPDX specification, Version 2.2 or a later compatible version.

A license expression can use:

- Any SPDX-listed license short-form identifiers published in the SPDX License List, version 3.17 or any later compatible version (the SPDX working group never removes identifiers; it may mark one "deprecated").
- Custom `LicenseRef-[idstring]` strings, where `[idstring]` is a unique string of letters, numbers, `.` and/or `-`, for licenses not in the SPDX list; these must follow SPDX specification clause 10.1.

Examples of valid SPDX expressions:

```
MIT
BSD-3-Clause
MIT AND (Apache-2.0 OR BSD-2-Clause)
MIT OR GPL-2.0-or-later OR (FSFUL AND BSD-2-Clause)
GPL-3.0-only WITH Classpath-Exception-2.0 OR BSD-3-Clause
LicenseRef-Special-License OR CC0-1.0 OR Unlicense
LicenseRef-Proprietary
```

Examples of invalid SPDX expressions:

```
Use-it-after-midnight
Apache-2.0 OR 2-BSD-Clause
LicenseRef-License with spaces
LicenseRef-License_with_underscores
```

### Core Metadata

The error/warning guidance applies to build and publishing tools; end-user install tools MAY be less strict. This PEP updates Core Metadata version to 2.4.

#### Add License-Expression field

`License-Expression` is an optional Core Metadata field containing a text string that is a valid SPDX license expression.

Build and publishing tools SHOULD check validity (including identifier validity). Tools MAY halt and error on an invalid expression. If validating, tools SHOULD also store a case-normalized version using reference case for each SPDX identifier and uppercase for AND/OR/WITH keywords. Tools SHOULD warn (publishing tools MAY error) if any identifier is marked deprecated in the SPDX License List.

For all newly-uploaded distribution archives with a License-Expression field, PyPI MUST validate a valid, case-normalized expression with valid identifiers and MUST reject uploads that don't validate. Custom identifiers conforming to the SPDX spec are valid. PyPI MAY reject an upload using a deprecated identifier (as of the referenced SPDX List version).

#### Add License-File field

`License-File` is an optional, multi-use Core Metadata field; each instance is the string path of a license-related file, located within the project source tree relative to the project root directory. Files under this field could include license text, author/attribution information, or other legal notices distributed with the package. Its value is also that file's path relative to the root license directory in installed projects and standardized Distribution Package types.

If a License-File is listed in a Source Distribution or Built Distribution's Core Metadata:

- That file MUST be included in the distribution archive at the specified path relative to the root license directory.
- That file MUST be installed with the project at that same relative path.
- The specified relative path MUST be consistent between project source trees, sdists, wheels and installed projects.
- Inside the root license directory, packaging tools MUST reproduce the directory structure under which the source license files are located relative to the project root.
- Path delimiters MUST be the forward slash character (/), and parent directory indicators (..) MUST NOT be used.
- License file content MUST be UTF-8 encoded text.

Build tools MAY, and publishing tools SHOULD, warn if a built distribution's metadata contains no License-File entries; publishing tools MAY (build tools MUST NOT) raise an error.

For newly-uploaded distribution archives with one or more License-File fields and Metadata-Version 2.4+, PyPI SHOULD validate that all specified files are present, and MUST reject uploads that don't validate.

#### Deprecate License field

The legacy unstructured-text `License` Core Metadata field is deprecated and replaced by `License-Expression`. The fields are mutually exclusive: tools generating Core Metadata MUST NOT create both. Tools reading Core Metadata, when both are present, MUST read `License-Expression` and MUST disregard `License`.

If only `License` is present, tools MAY warn that it is deprecated and recommend `License-Expression`.

For newly-uploaded archives with a `License-Expression` field, PyPI MUST reject any that also specify `License`.

The `License` field may be removed from a new version of the specification in a future PEP.

#### Deprecate license classifiers

Using license classifiers in the `Classifier` Core Metadata field is deprecated and replaced by the more precise `License-Expression` field.

If `License-Expression` is present, build tools MAY error if one or more license classifiers is included in a `Classifier` field, and MUST NOT add such classifiers themselves.

Otherwise, if a license classifier is present, tools MAY warn that it is deprecated and recommend `License-Expression`. Presence of license classifiers alone SHOULD NOT raise an error unless `License-Expression` is also provided.

New license classifiers MUST NOT be added to PyPI; users needing them SHOULD use `License-Expression` instead. License classifiers may be removed from a future spec version.

### Project source metadata (pyproject.toml)

Changes to the project's source metadata under the `[project]` table in pyproject.toml.

#### Add string value to license key

The `license` key in `[project]` is defined to contain a top-level string value: a valid SPDX license expression as defined in this PEP. It maps to the `License-Expression` Core Metadata field.

Build tools SHOULD validate and case-normalize the expression as in "Add License-Expression field".

Examples:

```toml
[project]
license = "MIT"

[project]
license = "MIT AND (Apache-2.0 OR BSD-2-clause)"

[project]
license = "MIT OR GPL-2.0-or-later OR (FSFUL AND BSD-2-Clause)"

[project]
license = "LicenseRef-Proprietary"
```

#### Add license-files key

A new `license-files` key is added to `[project]` for specifying paths (relative to pyproject.toml) to file(s) containing licenses and other legal notices to distribute with the package. Corresponds to `License-File` in Core Metadata.

Its value is an array of strings that MUST be valid glob patterns:

- Alphanumeric characters, underscores (_), hyphens (-) and dots (.) MUST be matched verbatim.
- Special glob characters `*`, `?`, `**` and character ranges `[]` (containing only verbatim-matched characters) MUST be supported. Within `[...]`, a hyphen indicates a locale-agnostic range (e.g. a-z); hyphens at the start/end match literally.
- Path delimiters MUST be `/`. Patterns are relative to the pyproject.toml directory; a leading `/` MUST NOT be used.
- Parent directory indicators (`..`) MUST NOT be used.

Values not covered by this spec are invalid; projects MUST NOT use them; consuming tools SHOULD reject invalid values with an error. Tools MUST assume license file content is valid UTF-8 text and SHOULD validate and error if not. Literal paths (e.g. `LICENSE`) are valid globs.

Build tools:

- MUST treat each value as a glob pattern, and MUST error on invalid glob syntax.
- MUST include all files matched by a listed pattern in all distribution archives.
- MUST list each matched file path under a `License-File` field in Core Metadata.
- MUST error if any individual user-specified pattern does not match at least one file.

If `license-files` is present and set to an empty array, tools MUST NOT include any license files and MUST NOT error.

Examples of valid declarations:

```toml
[project]
license-files = ["LICEN[CS]E*", "AUTHORS*"]

[project]
license-files = ["licenses/LICENSE.MIT", "licenses/LICENSE.CC0"]

[project]
license-files = ["LICENSE.txt", "licenses/*"]

[project]
license-files = []
```

Examples of invalid declarations:

```toml
[project]
license-files = ["..\LICENSE.MIT"]
```
Reason: `..` must not be used; `\` is an invalid path delimiter (`/` must be used).

```toml
[project]
license-files = ["LICEN{CSE*"]
```
Reason: "LICEN{CSE*" is not a valid glob.

#### Deprecate license key table subkeys

Table values for the `license` key (including `text` and `file` subkeys) are now deprecated. If `license-files` is present, build tools MUST error if `license` is defined with a value other than a single top-level string.

If `license-files` is absent and the `text` subkey is present in a license table, tools SHOULD warn that it is deprecated and recommend a license expression string instead. Likewise for the `file` subkey, recommending `license-files` instead.

If the specified license file exists in the source tree, build tools SHOULD use it to fill `License-File` and MUST include the file as if specified via `license-files`. If the file does not exist at the specified path, tools MUST raise an informative error.

Table values for `license` MAY be removed from a future spec version.

### License files in project formats

- **Project source trees**: license file paths MUST be relative to the project root directory (the directory containing pyproject.toml or legacy setup.py/setup.cfg).
- **Source distributions (sdists)**: if Metadata-Version is 2.4+, the sdist MUST contain any license files specified by `License-File` in PKG-INFO at their respective paths relative to the sdist root.
- **Built distributions (wheels)**: if Metadata-Version is 2.4+ and one or more `License-File` fields are specified, the `.dist-info` directory MUST contain a `licenses` subdirectory containing the listed files at their respective relative paths.
- **Installed projects**: same requirement -- `.dist-info/licenses` MUST contain the listed files, copied from wheels by install tools.

### Converting legacy metadata

Tools MUST NOT use the contents of the `license.text` key (or equivalent), license classifiers, or the Core Metadata `License` field to fill the top-level `license` string or `License-Expression` without informing the user and requiring unambiguous, affirmative user action to confirm the desired license expression. Tool authors needing to convert license classifiers to SPDX identifiers can use the recommendation prepared by the PEP authors (see appendices).

## Backwards Compatibility

Adding `License-Expression` and a top-level string `license` value unambiguously signals support for this PEP's spec, avoiding misinterpretation as free-form description. The legacy deprecated `License` field, `license` table subkeys (`text`/`file`), and license classifiers retain backward compatibility; removal is left to a future PEP. `License-File` and its file-inclusion behavior is designed to be largely backward-compatible with existing tool usage; the new `license-files` key only takes effect once adopted. License files are placed in a dedicated `licenses` subdir of `.dist-info`, which is new and differs from prior installer-specific behavior (gated behind the new metadata version), and resolves prior issues where same-named license files were accidentally overwritten. PyPI validation of the new fields has no effect on packages that don't opt in.

## Security Implications

None foreseen: `License-Expression` is a plain string and `License-File` entries are file paths; neither introduces new security concerns.

## How to Teach This

A single-license package needs just one identifier as a valid expression. Tool error/warning messages guide users toward valid expressions; invalid expressions block PyPI publication, an error message points to SPDX identifiers. Tools may suggest conversions from legacy classifiers/License field per the appendix mapping.

## Reference Implementation

Tools need to parse/validate license expressions if implementing this part of the spec, either with their own validation (e.g. Hatch) or a library (e.g. license-expression). No specific library is mandated.

## Rejected Ideas

Many alternatives were proposed and rejected after consideration; the exhaustive list with rationale is in a separate linked page (not reproduced here).

## Appendices (linked, not reproduced in full)

Detailed Licensing Examples; User Scenarios; License Documentation in Python and Other Projects; Mapping License Classifiers to SPDX Identifiers; Rejected Ideas in detail.

## Acknowledgments

Alyssa Coghlan, Kevin P. Fleming, Pradyun Gedam, Oleg Grenrus, Dustin Ingram, Chris Jerdonek, Cyril Roelandt, Luis Villa, Seth M. Larson, Ofek Lev

## Copyright

This document is placed in the public domain or under the CC0-1.0-Universal license, whichever is more permissive.

## Omitted sections

The linked appendix sub-pages (Detailed Licensing Examples, User Scenarios, License Documentation in Python and Other Projects, Mapping License Classifiers to SPDX Identifiers, and Rejected Ideas in detail) are separate pages and were not fetched or reproduced here; only their listing on the main PEP page is captured. The page's table-of-contents sidebar and PyPA-spec-update-process callout link were omitted as navigation and boilerplate.

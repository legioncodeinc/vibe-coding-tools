# REUSE Specification 3.3
- URL: https://reuse.software/spec-3.3/
- Fetched: 2026-09-05
- Source type: official-spec
- Extraction: HTML to text by script; navigation, scripts, and styles dropped; tables flattened with pipes

REUSE Specification – Version 3.3 | REUSE

-

-

-

-

-

-

-

 All versions of the specification can be found at https://reuse.software/specifications/.

# REUSE Specification – Version 3.3

## 2024-11-14

This specification defines a standardised method for declaring copyright and
licensing for software projects. The goal of the specification is to have
comprehensive, unambiguous, human- and machine-readable copyright and licensing
information for each individual file in a project. Ideally this information is
embedded into every file, so that the information is preserved when the file is
copied and reused by third parties.

This specification implements IETF RFC 2119: Key words for use in RFCs to
Indicate Requirement Levels.

For the revision history of this specification, please see the change
log.

## Definitions

These are the definitions for some of the terms used in this specification:

- REUSE Tool — helper tool for compliance with this specification; available
at https://codeberg.org/fsfe/reuse-tool.

- Project — any unit of content that can be associated with a distribution of
software. Typically, a Project is composed of one or more files. Also
sometimes called a package.

- License File — a file containing the text of a license, as defined in
License Files.

- Licensing Information — the information that lists the copyright holders of
a file or work, and describes under which licenses the file or work is made
available.

- Copyright Notice — a line of text that conveys copyright of a copyright
holder. Its format is defined in the Format of Copyright
Notices section.

- Covered File — a file which must contain Licensing Information, as defined
in Covered and ignored Files.

- Commentable File — a plain text file that can contain comments.

- Snippet — a portion of text in a Commentable File to which different
Licensing Information applies.

- Uncommentable File — either a plain text file that cannot contain comments
or a file that is not a plain text file.

- SPDX Specification — SPDX specification, version 2.3; as available at
https://spdx.org/specifications.

- SPDX License Identifier — SPDX short-form identifier, as defined in SPDX
Specification. See also https://spdx.org/ids for a short introduction and
examples.

- SPDX License Expression — as defined in SPDX Specification, Annex D, at
https://spdx.github.io/spdx-spec/v2.3/SPDX-license-expressions/.

- SPDX License List — a list of commonly found licenses and exceptions; as
available on https://spdx.org/licenses/.

- DEP5 — Machine-readable `debian/copyright` file, Version 1.0; as available
at https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/ and
further defined in DEP5 (deprecated). Where the REUSE
Specification and DEP5 state different things, the REUSE Specification takes
precedence.

- TOML — A configuration file format as available at
https://toml.io/en/v1.0.0.

## Covered and ignored Files

Covered Files are any file which must contain Licensing Information. This is
equal to all files in a project, with the exception of:

- The License Files stored in the `LICENSES/` directory.

- `COPYING`, `LICENSE`, and `LICENCE`. These MAY also contain a dash or dot
separator followed by additional metadata, like `LICENSE-MIT`, `COPYING.GPL`,
or `LICENCE.md`. These files SHOULD be in the root of the Project.

- The files belonging to the Project’s version control system (example:
`.git/`).

- The files ignored by the version control system (example: files listed in
`.gitignore`).

- Submodules of the Project’s version control system and Meson subprojects. Each
submodule and Meson subproject is understood as a separate Project.

- `REUSE.toml` files.

- The files in the `.reuse/` directory in the root of the Project. This
directory MUST contain only files relevant for the operation of the REUSE
Tool.

- Symlinks and files with no data (zero-byte).

- SPDX documents in their various formats as defined in the SPDX Specification,
Clause
4.4
(example: `sbom.spdx.json`).

## License Files

A Project MUST include a License File for every license under which Covered
Files are licensed.

Each License File MUST be placed in the `LICENSES/` directory in the root of the
Project. The name of the License File MUST be the SPDX License Identifier of the
license followed by an appropriate file extension (example:
`LICENSES/GPL-3.0-or-later.txt`). The License File MUST be in plain text format.

If a license does not exist in the SPDX License List, its SPDX License
Identifier MUST be `LicenseRef-[idstring]` as defined by the SPDX Specification,
Clause 10 available at
https://spdx.github.io/spdx-spec/v2.3/other-licensing-information-detected/.

A Project MUST NOT include License Files for licenses under which none of the
files in the Project are licensed. The `LICENSES/` directory MUST NOT include
any other files.

Everything that applies to licenses in this section also applies to license
exceptions, with the exception that it is NOT possible to have a license
exception that does not exist in the SPDX License List.

For avoidance of doubt, in practice this means that for every license and
exception that is part of any SPDX License Expression in any Licensing
Information associated with any Covered File, there MUST exist a License File as
defined in this section.

You MAY include `COPYING` or `LICENSE` files in your project for compliance with
other standards, conventions, or tools. These files MAY contain a copy of the
license text, a summary of your licensing, or anything else. These files are
ignored by the REUSE Tool.

## Licensing Information

Each Covered File MUST have Licensing Information associated with it. You can
associate Licensing Information with a file in the following ways:

- Comment headers

- REUSE.toml

- DEP5 (deprecated)

REUSE.toml and DEP5 are mutually exclusive. You MUST NOT use both
simultaneously.

Comment headers are the RECOMMENDED method.

Additionally, you can associate Licensing Information with Snippets inside of
files.

### Comment headers

Wherever possible, you SHOULD attempt to use comment headers to convey a file’s
Licensing Information. Compared to other methods, comment headers are more
explicit and their associated Licensing Information is more resistant to being
moved or copied.

To implement this method, a Commentable File MUST declare the file’s Licensing
Information in a comment header. The Licensing Information SHOULD be as close to
the top of the top of the file as possible in a comment header. The Commentable
File SHOULD use UTF-8 encoding.

For Uncommentable Files, the comment header that declares the file’s Licensing
Information MUST be in an adjacent text file of the same name with the
additional extension `.license` (example: `cat.jpg.license` if the original file
is `cat.jpg`). The adjacent file SHOULD use UTF-8 encoding.

`.license` files MAY be used with Commentable Files, but it is still RECOMMENDED
that comment headers be put inside Commentable Files.

The comment header MUST contain one or more Copyright Notices and one or more
`SPDX-License-Identifier` tag-value pairs. A tag is followed by a colon,
followed by a text value, and terminated by a newline.

The `SPDX-License-Identifier` tag MUST be followed by a valid SPDX License
Expression describing the licensing of the file (example:
`SPDX-License-Identifier: GPL-3.0-or-later OR Apache-2.0`).

An example of a comment header:

`# SPDX-FileCopyrightText: 2016, 2018-2019 Jane Doe <jane@example.com>
# SPDX-FileCopyrightText: 2019 Example Organisation
#
# SPDX-License-Identifier: GPL-3.0-or-later
`

#### In-line Snippet comments

Sometimes Licensing Information only applies to a certain Snippet instead of the
whole Commentable File. You SHOULD use SPDX snippets to license these Snippets.
When implementing SPDX snippets, you MUST use SPDX snippet tags (as defined in
SPDX Specification, Annex
H).
This means that Copyright Notices inside of Snippets MUST be prefixed with
`SPDX-SnippetCopyrightText`.

Each SPDX snippet that is opened MUST be closed with `SPDX-SnippetEnd`.

Like with comment headers, the SPDX snippet tags SHOULD be commented.

A Snippet SHOULD contain both a Copyright Notice and an SPDX License Expression.

Example:

`# SPDX-SnippetBegin
# SPDX-SnippetCopyrightText: 2022 Jane Doe <jane@example.com>
# SPDX-License-Identifier: MIT

print("Hello, world!")

# SPDX-SnippetEnd
`

#### Ignore block

If Licensing Information is declared in a file without describing the file’s or
Snippet’s actual license or copyright (for example: as part of an output command
or documentation), these occurrences SHOULD be put between two comments:
`REUSE-IgnoreStart` and `REUSE-IgnoreEnd`. The REUSE Tool then ignores all
Licensing Information between these comments. This technique MUST NOT be used to
ignore valid Licensing Information.

An example for an ignored block:

`# SPDX-FileCopyrightText: 2021 Jane Doe
#
# SPDX-License-Identifier: GPL-3.0-or-later

# REUSE-IgnoreStart
echo "SPDX-FileCopyrightText: $(date +'%Y') John Doe" > file.txt
echo "SPDX-License-Identifier: MIT" > file.txt
# REUSE-IgnoreEnd
`

### REUSE.toml

Licensing Information MAY be associated with a file through a `REUSE.toml` file,
which MUST be a valid TOML file. The intended use case of this method is large
directories where including a comment header in each file (or in `.license`
companion files) is impossible or undesirable.

A `REUSE.toml` file MAY be located in any directory, and can cover files that are
within its directory or deeper. You MAY have multiple `REUSE.toml` files in
different directories.

Any `REUSE.toml` file ignored by VCS is not searched for Licensing Information.

The `version` key (REQUIRED) MUST have an integer value representing the schema
version of the file. This specification describes version 1 of `REUSE.toml`.

Each `[[annotations]]` table represents an association of Licensing Information
to zero or more Covered Files. It has the following keys:

- `path` (REQUIRED), a string or list of strings representing paths. A path MUST
use forward slashes as path separators. A path SHOULD resolve to one or more
Covered Files relative to the `REUSE.toml` file’s directory. A path that
resolves to a non-existent or non-Covered File is ignored. A path MUST point
to a location in the `REUSE.toml` file’s directory or deeper. A path MAY use
globbing to match several Covered Files in a single expression. These are the
globbing and matching rules:

- `*` matches everything except forward slashes (i.e. path separators).

- `**` and `**/` match everything including forward slashes (i.e. path
separators).

- In order to escape an asterisk and include it verbatim, prefix it with `\\`.
You cannot prefix it with `\` because that is invalid TOML. In order to
include a backslash verbatim, use `\\\\`. `\\` followed by any other
character is functionally equal to just typing that character.

- `precedence` (OPTIONAL), a literal string. It determines the order of
precedence for Licensing Information between the `REUSE.toml` file and Covered
Files in the table, and between multiple `REUSE.toml` files if they both
contain Licensing Information for the same Covered File. Available values are:

- `closest`, the default value when `precedence` is not defined. This is an
instruction to associate the Licensing Information inside of the Covered
Files (or its adjacent `.license` file), if available. If no such Licensing
Information is found, then the Licensing Information inside the table of the
closest `REUSE.toml` that covers the File is associated. This algorithm is
applied separately for copyright and for licensing. If a table for the same
File in a closer `REUSE.toml` file has the `override` precedence, then that
precedence is applied, and `closest` is ignored. This is effectively a
fallback.

- `aggregate`. This is an instruction to always associate the Licensing
Information defined in the table with the table’s Covered Files.
Subsequently, the `closest` logic is also applied.

- `override`. This is an instruction to associate the Licensing Information
defined in the table with the table’s Covered Files, and to ignore any other
Licensing Information that is closer to the Files. The table in the
`REUSE.toml` that is the closest to the root of the Project is
authoritative.

- `SPDX-FileCopyrightText` (OPTIONAL), a string or list of strings. Each string
MUST be a Copyright Notice to be associated with the table’s Covered Files.
The prefix of the Copyright Notice MAY be omitted.

- `SPDX-License-Identifier` (OPTIONAL), a string or list of strings. Each string
MUST be a valid SPDX License Expression describing the licensing of the
table’s Covered Files.

You MAY include other keys and tables to convey additional information. Their
semantics are not defined by this specification. If you wish to include other
keys, you are RECOMMENDED to use existing SPDX tags. For example, you could use
`SPDX-FileComment` in an `[[annotations]]` table to add context to what you’re
doing, or `SPDX-FileContributor` to credit additional contributors.

Although the keys to associate Licensing Information with the Covered File are
OPTIONAL, the complete Licensing Information MUST still be associated with the
File in some fashion.

If a Covered File is covered by multiple `[[annotations]]` tables in the same
`REUSE.toml` file, then exclusively the last matching table in the file is used
for that Covered File.

An example of a `REUSE.toml` file:

`version = 1

[[annotations]]
path = ["po/*.po", "po/*.pot"]
precedence = "aggregate"
SPDX-FileCopyrightText = "2019 Translation Company"
SPDX-License-Identifier = "GPL-3.0-or-later"

[[annotations]]
path = "tests/resources/**"
precedence = "override"
SPDX-FileCopyrightText = "2019 Jane Doe"
SPDX-License-Identifier = "CC0-1.0"
`

A JSON schema of version 1 of `REUSE.toml` is provided at
https://reuse.software/reuse-toml-v1.schema.json for your convenience.

### DEP5 (deprecated)

Licensing Information MAY be associated with a file through a DEP5 file, but you
SHOULD create a `REUSE.toml` file instead. The DEP5 file is deprecated, meaning
that it is expected to disappear from a future iteration of this specification.

The DEP5 file MUST be named `dep5` and stored in the `.reuse/` directory in the
root of the Project (i.e. `.reuse/dep5`).

The `Files` tag MUST be followed by one or more paths to which the paragraph’s
Licensing Information is applied.

The `License` tag MUST be followed by a valid SPDX License Expression describing
the licensing of the associated files.

The `Copyright` tag MUST be followed by one or more Copyright Notices. The
prefixes of the Copyright Notices MAY be omitted.

An example of a DEP5 file:

`Format: https://www.debian.org/doc/packaging-manuals/copyright-format/1.0/

Files: po/*.po po/*.pot
Copyright: 2019 Translation Company
License: GPL-3.0-or-later

Files: tests/resources/*
Copyright: 2019 Jane Doe
License: CC0-1.0
`

## Order of precedence

If a Commentable File contains Licensing Information but also has an adjacent
`.license` file, then the Licensing Information defined in the `.license` file
takes precedence, and the Commentable File’s contents are ignored. For all
intents and purposes, this counts as the `.license` file’s Licensing Information
being inside the Commentable File.

Licensing Information defined in `.reuse/dep5` is aggregated with the Licensing
Information found in the Covered Files. For clarity, this means that if the SPDX
License Expressions in a file’s comment header and in the section for that file
in `.reuse/dep5` do not agree with each other, then both SPDX License
Expressions will apply to the file.

The order of precedence for `REUSE.toml` files is described in the respective
section, and is managed using the `precedence` key.

## Format of Copyright Notices

A Copyright Notice MUST start with a tag, word or symbol (collectively:
prefixes) from the following list:

- `SPDX-FileCopyrightText` (or `SPDX-SnippetCopyrightText` in Snippets)

- Copyright

- ©

It is RECOMMENDED to use the `SPDX-FileCopyrightText` tag. You MAY add ‘(C)’,
‘(c)’ or ‘©’ after the prefix.

In Commentable Files, a Copyright Notice is terminated by a newline.

The Copyright Notice MUST contain the name of the copyright holder. The
copyright notice SHOULD contain the year of publication and the contact address
of the copyright holder. The order of these items SHOULD be: year, name, contact
address.

The year of publication MAY be a single year, multiple years, or a span of
years.

The copyright holder SHOULD be an individual, list of individuals, group, legal
entity, or any other descriptor by which one can easily identify the copyright
holder(s).

Any contact address SHOULD be in between angle brackets.

You MAY add any further information to the Copyright Notice.

Examples of valid Copyright Notices:

`SPDX-FileCopyrightText: 2019 Jane Doe <jane@example.com>
SPDX-FileCopyrightText: © 2019 John Doe <john@example.com>
SPDX-FileCopyrightText: Contributors to Example Project <https://project.example.com>
SPDX-FileCopyrightText: 2023 Alice Hack and (other) contributors to Project X <https://git.example.com/alicehack/projectx/CONTRIBUTORS.md>
SPDX-SnippetCopyrightText: (C) Example Cooperative <info@coop.example.com>
© Example Corporation <https://corp.example.com>
Copyright 2016, 2018-2019 Joe Anybody
Copyright (c) Alice, some rights reserved
`

-

-

-

-

-

-

-

-

-

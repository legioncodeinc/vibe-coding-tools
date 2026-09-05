# Writing your pyproject.toml - Python Packaging User Guide
- URL: https://packaging.python.org/en/latest/guides/writing-pyproject-toml/
- Fetched: 2026-09-05
- Source type: official-docs

## Overview

pyproject.toml is a configuration file used by packaging tools, as well as other tools such as linters, type checkers, etc. There are three possible TOML tables in this file.

The [build-system] table is strongly recommended. It allows you to declare which build backend you use and which other dependencies are needed to build your project.

The [project] table is the format that most build backends use to specify your project's basic metadata, such as the dependencies, your name, etc.

The [tool] table has tool-specific subtables, e.g., [tool.hatch], [tool.black], [tool.mypy]. Only touched upon briefly; contents are defined by each tool.

Note: The [build-system] table should always be present, regardless of which build backend you use. The [project] table is understood by most build backends, but some build backends use a different format (e.g. Poetry before version 2.0 used [tool.poetry] instead; version 2.0+ supports both). The setuptools build backend supports both the [project] table and the older setup.cfg / setup.py format.

## Static vs. dynamic metadata

Most of the time, you will directly write the value of a [project] field, e.g. `requires-python = ">= 3.8"`, or `version = "1.0"`.

In some cases it is useful to let your build backend compute metadata for you (e.g. reading version from a `__version__` attribute or a Git tag). Mark the field as dynamic:

```toml
[project]
dynamic = ["version"]
```

When a field is dynamic, it is the build backend's responsibility to fill it.

## Basic information

### name

Put the name of your project on PyPI. This field is required and is the only field that cannot be marked as dynamic.

```toml
[project]
name = "spam-eggs"
```

The project name must consist of ASCII letters, digits, underscores "_", hyphens "-" and periods ".". It must not start or end with an underscore, hyphen or period.

Comparison of project names is case insensitive and treats arbitrarily long runs of underscores, hyphens, and/or periods as equal. For example, if you register a project named cool-stuff, users will be able to download it or declare a dependency on it using any of the following spellings: Cool-Stuff, cool.stuff, COOL_STUFF, CoOl__-.-__sTuFF.

### version

```toml
[project]
version = "2020.0.0"
```

Some more complicated version specifiers like 2020.0.0a1 (for an alpha release) are possible. This field is required, although it is often marked as dynamic.

## Dependencies and requirements

### dependencies/optional-dependencies

```toml
[project]
dependencies = [
  "httpx",
  "gidgethub[httpx]>4.0.0",
  "django>2.1; os_name != 'nt'",
  "django>2.0; os_name == 'nt'",
]
```

Optional dependencies go under a named "packaging extra":

```toml
[project.optional-dependencies]
gui = ["PyQt5"]
cli = [
  "rich",
  "click",
]
```

An extra can refer back to the current project with other extras (e.g. an `all` extra combining `gui` and `cli`):

```toml
all = ["your-project-name[gui, cli]"]
```

### requires-python

```toml
[project]
requires-python = ">= 3.8"
```

## Creating executable scripts

```toml
[project.scripts]
spam-cli = "spam:main_cli"
```

For GUI scripts (relevant on Windows to avoid popping up a terminal), use `[project.gui-scripts]` instead:

```toml
[project.gui-scripts]
spam-gui = "spam:main_gui"
```

## About your project

### authors/maintainers

Both of these fields contain lists of people identified by a name and/or an email address.

```toml
[project]
authors = [
  {name = "Pradyun Gedam", email = "pradyun@example.com"},
  {name = "Tzu-Ping Chung", email = "tzu-ping@example.com"},
  {name = "Another person"},
  {email = "different.person@example.com"},
]
maintainers = [
  {name = "Brett Cannon", email = "brett@example.com"}
]
```

### description

```toml
[project]
description = "Lovely Spam! Wonderful Spam!"
```

### readme

```toml
[project]
readme = "README.md"
```

The README's format is auto-detected from the extension: README.md -> GitHub-flavored Markdown; README.rst -> reStructuredText (without Sphinx extensions). Can also be specified explicitly:

```toml
[project]
readme = {file = "README.txt", content-type = "text/markdown"}
# or
readme = {file = "README.txt", content-type = "text/x-rst"}
```

### license and license-files

As per PEP 639, licenses should be declared with two fields:

- `license` is an SPDX license expression consisting of one or more license identifiers.
- `license-files` is a list of license file glob patterns.

A previous PEP had specified `license` to be a table with a `file` or a `text` key; this format is now deprecated. Most build backends now support the new format (build backend versions that introduced PEP 639 support, as listed on the page: hatchling 1.27.0, setuptools 77.0.3, flit-core 3.12, pdm-backend 2.4.0, poetry-core 2.2.0, uv-build 0.7.19).

#### license

The new format for `license` is a valid SPDX license expression consisting of one or more license identifiers. The full license list is available at the SPDX license list page. The supported list version is 3.17 or any later compatible one.

```toml
[project]
license = "GPL-3.0-or-later"
# or
license = "MIT AND (Apache-2.0 OR BSD-2-Clause)"
```

Note: If you get a build error that license should be a dict/table, your build backend doesn't yet support the new format. The now-deprecated table format is described in PEP 621.

As a general rule, it is a good idea to use a standard, well-known license, both to avoid confusion and because some organizations avoid software whose license is unapproved.

If your Distribution Archive is licensed with a license that doesn't have an existing SPDX identifier, you can create a custom one in format `LicenseRef-[idstring]`. The custom identifiers must follow the SPDX specification, clause 10.1 of version 2.2 or any later compatible one.

```toml
[project]
license = "LicenseRef-My-Custom-License"
```

#### license-files

This is a list of license files and files containing other legal information you want to distribute with your package.

```toml
[project]
license-files = ["LICEN[CS]E*", "vendored/licenses/*.txt", "AUTHORS.md"]
```

The glob patterns must follow the specification:

- Alphanumeric characters, underscores (_), hyphens (-) and dots (.) will be matched verbatim.
- Special characters: *, ?, ** and character ranges: [] are supported.
- Path delimiters must be the forward slash character (/).
- Patterns are relative to the directory containing pyproject.toml, and thus may not start with a slash character.
- Parent directory indicators (..) must not be used.
- Each glob must match at least one file.
- Literal paths are valid globs. Any characters or character sequences not covered by this specification are invalid.

### keywords

```toml
[project]
keywords = ["egg", "bacon", "sausage", "tomatoes", "Lobster Thermidor"]
```

### classifiers

A list of PyPI classifiers that apply to your project.

```toml
[project]
classifiers = [
  # How mature is this project? Common values are
  #   3 - Alpha
  #   4 - Beta
  #   5 - Production/Stable
  "Development Status :: 4 - Beta",

  # Indicate who your project is intended for
  "Intended Audience :: Developers",
  "Topic :: Software Development :: Build Tools",

  # Specify the Python versions you support here.
  "Programming Language :: Python :: 3",
  "Programming Language :: Python :: 3.6",
  "Programming Language :: Python :: 3.7",
  "Programming Language :: Python :: 3.8",
  "Programming Language :: Python :: 3.9",
]
```

Although the list of classifiers is often used to declare what Python versions a project supports, this information is only used for searching and browsing projects on PyPI, not for installing projects. To actually restrict what Python versions a project can be installed on, use the requires-python argument.

To prevent a package from being uploaded to PyPI, use the special `Private :: Do Not Upload` classifier. PyPI will always reject packages with classifiers beginning with `Private ::`.

### urls

A list of URLs associated with your project, displayed on the left sidebar of your PyPI project page.

```toml
[project.urls]
Homepage = "https://example.com"
Documentation = "https://readthedocs.org"
Repository = "https://github.com/me/spam.git"
Issues = "https://github.com/me/spam/issues"
Changelog = "https://github.com/me/spam/blob/master/CHANGELOG.md"
```

Note that if the label contains spaces, it needs to be quoted, e.g., `Website = "https://example.com"` but `"Official Website" = "https://example.com"`.

Users are advised to use Well-known labels for their project URLs where appropriate, since consumers of metadata (like package indices) can specialize their presentation.

Example where neither label is well-known, so both render verbatim:

```toml
[project.urls]
MyHomepage = "https://example.com"
"Download Link" = "https://example.com/abc.tar.gz"
```

Example where HomePage and DOWNLOAD both have well-known equivalents (homepage and download):

```toml
[project.urls]
HomePage = "https://example.com"
DOWNLOAD = "https://example.com/abc.tar.gz"
```

## Advanced plugins

Some packages can be extended through plugins (e.g. Pytest, Pygments). Declared in a subtable of [project.entry-points]:

```toml
[project.entry-points."spam.magical"]
tomatoes = "spam:main_tomatoes"
```

## A full example

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "spam-eggs"
version = "2020.0.0"
dependencies = [
  "httpx",
  "gidgethub[httpx]>4.0.0",
  "django>2.1; os_name != 'nt'",
  "django>2.0; os_name == 'nt'",
]
requires-python = ">=3.8"
authors = [
  {name = "Pradyun Gedam", email = "pradyun@example.com"},
  {name = "Tzu-Ping Chung", email = "tzu-ping@example.com"},
  {name = "Another person"},
  {email = "different.person@example.com"},
]
maintainers = [
  {name = "Brett Cannon", email = "brett@example.com"}
]
description = "Lovely Spam! Wonderful Spam!"
readme = "README.rst"
license = "MIT"
license-files = ["LICEN[CS]E.*"]
keywords = ["egg", "bacon", "sausage", "tomatoes", "Lobster Thermidor"]
classifiers = [
  "Development Status :: 4 - Beta",
  "Programming Language :: Python"
]

[project.optional-dependencies]
gui = ["PyQt5"]
cli = [
  "rich",
  "click",
]
all = ["spam-eggs[gui, cli]"]

[project.urls]
Homepage = "https://example.com"
Documentation = "https://readthedocs.org"
Repository = "https://github.com/me/spam.git"
"Bug Tracker" = "https://github.com/me/spam/issues"
Changelog = "https://github.com/me/spam/blob/master/CHANGELOG.md"

[project.scripts]
spam-cli = "spam:main_cli"

[project.gui-scripts]
spam-gui = "spam:main_gui"

[project.entry-points."spam.magical"]
tomatoes = "spam:main_tomatoes"
```

Footnotes on the page: [1] warns against an upper bound like `requires-python = "<= 3.10"`, linking to a blog post about problems this causes. [2] notes flit-core does not yet support WITH in SPDX license expressions.

## Other top-level fields covered on the page (names only)

dynamic, dependencies, optional-dependencies, requires-python, scripts, gui-scripts, description, readme, keywords, classifiers, urls, entry-points. (build-backend and requires under [build-system] are also covered, as is the [tool] table concept.)

## Omitted sections

None of substance -- this capture includes the full body content of the page (all prose sections and code examples), since the page is entirely about pyproject.toml fields relevant to identity/attribution/license/homepage/repository metadata or their immediate context. Only the page's left/right navigation chrome and "previous/next" footer links were dropped as boilerplate.

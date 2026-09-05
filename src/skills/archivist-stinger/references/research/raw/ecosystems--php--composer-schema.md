# The composer.json schema - Composer
- URL: https://getcomposer.org/doc/04-schema.md
- Fetched: 2026-09-05
- Source type: official-docs

## Overview

This chapter explains all of the fields available in composer.json.

### JSON schema

Composer has a JSON schema that documents the format and can also be used to validate your composer.json (used by the `validate` command). Found at: https://getcomposer.org/schema.json

### Root Package

The root package is the package defined by the composer.json at the root of your project -- the main composer.json that defines your project requirements. Certain fields only apply in the root package context (e.g. `config` is root-only; config of dependencies is ignored). Note: a package can be the root package or not depending on context -- e.g. your project depending on monolog makes your project the root package, but if you clone monolog from GitHub to fix a bug, monolog becomes the root package.

## Properties

### name

The name of the package. It consists of vendor name and project name, separated by /. Examples:

```
monolog/monolog
igorw/event-source
```

The name must be lowercase and consist of words separated by -, . or _. The complete name should match `^[a-z0-9]([_.-]?[a-z0-9]+)*/[a-z0-9](([_.]|-{1,2})?[a-z0-9]+)*$`.

The name property is required for published packages (libraries).

Note: Before Composer version 2.0, a name could contain any character, including white spaces.

### homepage

A URL to the website of the project.

Optional.

### license

The license of the package. This can be either a string or an array of strings.

The recommended notation for the most common licenses is (alphabetical):

- Apache-2.0
- BSD-2-Clause
- BSD-3-Clause
- BSD-4-Clause
- GPL-2.0-only / GPL-2.0-or-later
- GPL-3.0-only / GPL-3.0-or-later
- LGPL-2.1-only / LGPL-2.1-or-later
- LGPL-3.0-only / LGPL-3.0-or-later
- MIT

Optional, but it is highly recommended to supply this. More identifiers are listed at the SPDX Open Source License Registry.

Note: For closed-source software, you may use "proprietary" as the license identifier.

An Example:

```json
{
    "license": "MIT"
}
```

For a package, when there is a choice between licenses ("disjunctive license"), multiple can be specified as an array.

An Example for disjunctive licenses:

```json
{
    "license": [
        "LGPL-2.1-only",
        "GPL-3.0-or-later"
    ]
}
```

Alternatively they can be separated with "or" and enclosed in parentheses:

```json
{
    "license": "(LGPL-2.1-only or GPL-3.0-or-later)"
}
```

Similarly, when multiple licenses need to be applied ("conjunctive license"), they should be separated with "and" and enclosed in parentheses.

### authors

The authors of the package. This is an array of objects.

Each author object can have the following properties:

- `name`: The author's name. Usually their real name.
- `email`: The author's email address.
- `homepage`: URL to the author's website.
- `role`: The author's role in the project (e.g. developer or translator)

An example:

```json
{
    "authors": [
        {
            "name": "Nils Adermann",
            "email": "naderman@naderman.de",
            "homepage": "https://www.naderman.de",
            "role": "Developer"
        },
        {
            "name": "Jordi Boggiano",
            "email": "j.boggiano@seld.be",
            "homepage": "https://seld.be",
            "role": "Developer"
        }
    ]
}
```

Optional, but highly recommended.

### support

Various information to get support about the project.

Support information includes the following:

- `email`: Email address for support.
- `issues`: URL to the issue tracker.
- `forum`: URL to the forum.
- `wiki`: URL to the wiki.
- `irc`: IRC channel for support, as irc://server/channel.
- `source`: URL to browse or download the sources.
- `docs`: URL to the documentation.
- `rss`: URL to the RSS feed.
- `chat`: URL to the chat channel.
- `security`: URL to the vulnerability disclosure policy (VDP).

An example:

```json
{
    "support": {
        "email": "support@example.org",
        "irc": "irc://irc.freenode.org/composer"
    }
}
```

Optional.

### funding

A list of URLs to provide funding to the package authors for maintenance and development of new functionality.

Each entry consists of the following:

- `type`: The type of funding, or the platform through which funding can be provided, e.g. patreon, opencollective, tidelift or github.
- `url`: URL to a website with details, and a way to fund the package.

An example:

```json
{
    "funding": [
        {
            "type": "patreon",
            "url": "https://www.patreon.com/phpdoctrine"
        },
        {
            "type": "tidelift",
            "url": "https://tidelift.com/subscription/pkg/packagist-doctrine_doctrine-bundle"
        },
        {
            "type": "other",
            "url": "https://www.doctrine-project.org/sponsorship.html"
        }
    ]
}
```

Optional.

## Other top-level composer.json fields documented on the page (names only)

description, version, type, keywords, readme, time, source, dist, Package links (require, require-dev [root-only], conflict, replace, provide, suggest), autoload (PSR-4, PSR-0, Classmap, Files, Exclude files from classmaps, Optimizing the autoloader), autoload-dev [root-only], include-path, target-dir, minimum-stability [root-only], prefer-stable [root-only], repositories [root-only], config [root-only], scripts [root-only], scripts-descriptions [root-only], scripts-aliases [root-only], extra, bin, archive, php-ext, abandoned, _comment, default-branch, non-feature-branches.

## Omitted sections

The full prose and examples for description, version, type, keywords, readme, time, source, dist, the Package links sub-fields (require, require-dev, conflict, replace, provide, suggest), autoload and its sub-formats, autoload-dev, include-path, target-dir, minimum-stability, prefer-stable, repositories, config, scripts, scripts-descriptions, scripts-aliases, extra, bin, archive, php-ext, abandoned, _comment, default-branch, and non-feature-branches were omitted from this capture because they are dependency/autoloading/build/script mechanics unrelated to identity, attribution, license, homepage, funding, bug-tracker, or contact fields. Their names are listed above for completeness. The page's left sidebar table of contents was traversed programmatically to identify section headings but is not itself reproduced as prose.

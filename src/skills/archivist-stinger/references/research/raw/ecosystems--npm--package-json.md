# package.json | npm Docs
- URL: https://docs.npmjs.com/cli/v11/configuring-npm/package-json
- Fetched: 2026-09-05
- Source type: official-docs

## Description

This document is all you need to know about what's required in your package.json file. It must be actual JSON, not just a JavaScript object literal.

A lot of the behavior described in this document is affected by the config settings described in config.

## name

If you plan to publish your package, the most important things in your package.json are the name and version fields as they will be required. The name and version together form an identifier that is assumed to be completely unique. Changes to the package should come along with changes to the version. If you don't plan to publish your package, the name and version fields are optional.

The name is what your thing is called.

Some rules:

- The name must be less than or equal to 214 characters. This includes the scope for scoped packages.
- The names of scoped packages can begin with a dot or an underscore. This is not permitted without a scope.
- New packages must not have uppercase letters in the name.
- The name ends up being part of a URL, an argument on the command line, and a folder name. Therefore, the name can't contain any non-URL-safe characters.

Some tips:

- Don't use the same name as a core Node module.
- Don't put "js" or "node" in the name. It's assumed that it's js, since you're writing a package.json file, and you can specify the engine using the "engines" field. (See below.)
- The name will probably be passed as an argument to require(), so it should be something short, but also reasonably descriptive.
- You may want to check the npm registry to see if there's something by that name already, before you get too attached to it. https://www.npmjs.com/

A name can be optionally prefixed by a scope, e.g. @npm/example. See scope for more detail.

## homepage

The URL to the project homepage.

Example:

```json
"homepage": "https://github.com/npm/example#readme"
```

## bugs

The URL to your project's issue tracker and / or the email address to which issues should be reported. These are helpful for people who encounter issues with your package.

It should look like this:

```json
{
  "bugs": {
    "url": "https://github.com/npm/example/issues",
    "email": "example@npmjs.com"
  }
}
```

You can specify either one or both values. If you want to provide only a URL, you can specify the value for "bugs" as a simple string instead of an object.

If a URL is provided, it will be used by the npm bugs command.

## license

You should specify a license for your package so that people know how they are permitted to use it, and any restrictions you're placing on it.

If you're using a common license such as BSD-2-Clause or MIT, add a current SPDX license identifier for the license you're using, like this:

```json
{
  "license": "BSD-3-Clause"
}
```

You can check the full list of SPDX license IDs. Ideally, you should pick one that is OSI approved.

If your package is licensed under multiple common licenses, use an SPDX license expression syntax version 2.0 string, like this:

```json
{
  "license": "(ISC OR GPL-3.0)"
}
```

If you are using a license that hasn't been assigned an SPDX identifier, or if you are using a custom license, use a string value like this one:

```json
{
  "license": "SEE LICENSE IN <filename>"
}
```

Then include a file named <filename> at the top level of the package.

Some old packages used license objects or a "licenses" property containing an array of license objects:

```json
// Not valid metadata
{
  "license" : {
    "type" : "ISC",
    "url" : "https://opensource.org/licenses/ISC"
  }
}

// Not valid metadata
{
  "licenses" : [
    {
      "type": "MIT",
      "url": "https://www.opensource.org/licenses/mit-license.php"
    },
    {
      "type": "Apache-2.0",
      "url": "https://opensource.org/licenses/apache2.0.php"
    }
  ]
}
```

Those styles are now deprecated. Instead, use SPDX expressions, like this:

```json
{
  "license": "ISC"
}
{
  "license": "(MIT OR Apache-2.0)"
}
```

Finally, if you do not wish to grant others the right to use a private or unpublished package under any terms:

```json
{
  "license": "UNLICENSED"
}
```

Consider also setting "private": true to prevent accidental publication.

## people fields: author, contributors

The "author" is one person. "contributors" is an array of people. A "person" is an object with a "name" field and optionally "url" and "email", like this:

```json
{
  "name": "Barney Rubble",
  "email": "barney@npmjs.com",
  "url": "http://barnyrubble.npmjs.com/"
}
```

Or you can shorten that all into a single string, and npm will parse it for you:

```json
{
  "author": "Barney Rubble <barney@npmjs.com> (http://barnyrubble.npmjs.com/)"
}
```

Both email and url are optional either way.

npm also sets a top-level "maintainers" field with your npm user info.

(Note: this is the only mention of "maintainers" on this page. It is not separately documented as an author-settable field; npm populates it automatically from npm user account info at publish time.)

## funding

You can specify an object containing a URL that provides up-to-date information about ways to help fund development of your package, a string URL, or an array of objects and string URLs:

```json
{
  "funding": {
    "type": "individual",
    "url": "http://npmjs.com/donate"
  }
}
{
  "funding": {
    "type": "patreon",
    "url": "https://www.patreon.com/user"
  }
}
{
  "funding": "http://npmjs.com/donate"
}
{
  "funding": [
    {
      "type": "individual",
      "url": "http://npmjs.com/donate"
    },
    "http://npmjs.com/donate-also",
    {
      "type": "patreon",
      "url": "https://www.patreon.com/user"
    }
  ]
}
```

Users can use the npm fund subcommand to list the funding URLs of all dependencies of their project, direct and indirect. A shortcut to visit each funding URL is also available when providing the project name such as: npm fund <projectname> (when there are multiple URLs, the first one will be visited)

## repository

Specify the place where your code lives. This is helpful for people who want to contribute. If the git repo is on GitHub, then the npm repo command will be able to find you.

Do it like this:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/npm/cli.git"
  }
}
```

The URL should be a publicly available (perhaps read-only) URL that can be handed directly to a VCS program without any modification. It should not be a URL to an html project page that you put in your browser. It's for computers.

For GitHub, GitHub gist, Bitbucket, or GitLab repositories you can use the same shortcut syntax you use for npm install:

```json
{
  "repository": "npm/example",

  "repository": "github:npm/example",

  "repository": "gist:11081aaa281",

  "repository": "bitbucket:user/repo",

  "repository": "gitlab:user/repo"
}
```

Note on normalization: When you publish a package, npm normalizes the repository field to the full object format with a url property. If you use a shorthand format (like "npm/example"), you'll see a warning during npm publish indicating that the field was auto-corrected. While the shorthand format currently works, it's recommended to use the full object format in your package.json to avoid warnings and ensure future compatibility:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/npm/example.git"
  }
}
```

You can run npm pkg fix to automatically convert shorthand formats to the normalized object format.

If the package.json for your package is not in the root directory (for example if it is part of a monorepo), you can specify the directory in which it lives:

```json
{
  "repository": {
    "type": "git",
    "url": "git+https://github.com/npm/cli.git",
    "directory": "workspaces/libnpmpublish"
  }
}
```

## DEFAULT VALUES section, relevant excerpt

npm will default some values based on package contents.

"contributors": [...]

If there is an AUTHORS file in the root of your package, npm will treat each line as a Name <email> (url) format, where email and url are optional. Lines which start with a # or are blank, will be ignored.

## Other top-level fields documented on this page (names only, not detailed above)

version, description, keywords, files, exports, main, type, browser, bin, man, directories (directories.bin, directories.man), scripts, gypfile, config, dependencies (plus URLs as Dependencies, Git URLs as Dependencies, GitHub URLs, Local Paths), devDependencies, peerDependencies, peerDependenciesMeta, bundleDependencies, optionalDependencies, overrides (plus "Replacing a dependency with a fork"), engines, os, cpu, libc, devEngines, private, publishConfig, workspaces.

## Omitted sections

The full prose and examples for version, description, keywords, files, exports, main, type, browser, bin, man, directories, scripts, gypfile, config, dependencies and its sub-forms, devDependencies, peerDependencies, peerDependenciesMeta, bundleDependencies, optionalDependencies, overrides, engines, os, cpu, libc, devEngines, private, publishConfig, and workspaces were omitted from this capture because they are not identity, attribution, license, repository, homepage, funding, bug-tracker, or contact fields, and do not name a person or organization (per the capture brief for this file). The "DEFAULT VALUES" subsections for scripts.start and scripts.install were also omitted for the same reason; only the contributors/AUTHORS-file default was kept. The "SEE ALSO" link list was omitted as navigation and boilerplate.

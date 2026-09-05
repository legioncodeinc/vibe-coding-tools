# Create and distribute a plugin marketplace
- URL: https://code.claude.com/docs/en/plugin-marketplaces
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins

# Create and distribute a plugin marketplace

> Build and host plugin marketplaces to distribute Claude Code extensions across teams and communities.

A **plugin marketplace** is a catalog that lets you distribute plugins to others. Marketplaces provide centralized discovery, version tracking, automatic updates, and support for multiple source types, including git repositories and local paths. This guide shows you how to create your own marketplace to share plugins with your team or community.

Looking to install plugins from an existing marketplace? See [Discover and install prebuilt plugins](/docs/en/discover-plugins).

## Overview

Creating and distributing a marketplace involves:

1. **Create plugins**: build one or more plugins with skills, agents, hooks, MCP servers, or LSP servers. This guide assumes you already have plugins to distribute; see [Create plugins](/docs/en/plugins) for details on how to create them.
2. **Create the marketplace file**: define a `marketplace.json` that lists your plugins and where to find them. See [Create the marketplace file](#create-the-marketplace-file).
3. **Host the marketplace**: push to GitHub, GitLab, or another git host. See [Host and distribute marketplaces](#host-and-distribute-marketplaces).
4. **Share with users**: users add your marketplace with `/plugin marketplace add` and install individual plugins. See [Discover and install plugins](/docs/en/discover-plugins).

Once your marketplace is live, you can update it by pushing changes to your repository. Users refresh their local copy with `/plugin marketplace update`.

## Walkthrough: create a local marketplace

This example creates a marketplace with one plugin: a `quality-review` skill for code reviews. You'll create the directory structure, add a skill, create the plugin manifest and marketplace catalog, then install and test it.



    ```bash theme={null}
    mkdir -p my-marketplace/.claude-plugin
    mkdir -p my-marketplace/plugins/quality-review-plugin/.claude-plugin
    mkdir -p my-marketplace/plugins/quality-review-plugin/skills/quality-review
    ```



 Create a `SKILL.md` file that defines what the `quality-review` skill does.

    ```markdown my-marketplace/plugins/quality-review-plugin/skills/quality-review/SKILL.md theme={null}
    ---
    description: Review code for bugs, security, and performance
    ---

    Review the code I've selected or the recent changes for:
    - Potential bugs or edge cases
    - Security concerns
    - Performance issues
    - Readability improvements

    Be concise and actionable.
    ```



 Create a `plugin.json` file that describes the plugin. The manifest goes in the `.claude-plugin/` directory.

    ```json my-marketplace/plugins/quality-review-plugin/.claude-plugin/plugin.json theme={null}
    {
      "name": "quality-review-plugin",
      "description": "Adds a quality-review skill for quick code reviews",
      "version": "1.0.0",
      "author": {
        "name": "Your Name"
      }
    }
    ```


 Setting `version` means users only receive updates when you change this field, so bump it on every release. A plugin with a [`command` source](#command-sources) isn't pinned by this field. If you omit `version`, the version comes from the next source in [version management](/docs/en/plugins-reference#version-management).




 Create the marketplace catalog that lists your plugin.

    ```json my-marketplace/.claude-plugin/marketplace.json theme={null}
    {
      "name": "my-plugins",
      "owner": {
        "name": "Your Name"
      },
      "plugins": [
        {
          "name": "quality-review-plugin",
          "source": "./plugins/quality-review-plugin",
          "description": "Adds a quality-review skill for quick code reviews"
        }
      ]
    }
    ```



 From the directory that contains `my-marketplace`, start Claude Code and run the following commands. The install command opens a plugin details view where you select an installation scope to confirm the install. Check the install summary: if it reports `Run /reload-plugins to activate.`, run that command.

    ```shell theme={null}
    /plugin marketplace add ./my-marketplace
    /plugin install quality-review-plugin@my-plugins
    ```



 Select some code in your editor and run your new skill. Plugin skills are namespaced with the plugin name.

    ```shell theme={null}
    /quality-review-plugin:quality-review
    ```



To learn more about what plugins can do, including hooks, agents, MCP servers, and LSP servers, see [Plugins](/docs/en/plugins).


 **How plugins are installed**: when users install a plugin, Claude Code copies the plugin directory to a cache location, except for a [`command` source in link mode](#copy-mode-and-link-mode), which is used in place. Copied plugins can't reference files outside their directory using paths like `../shared-utils`, because those files won't be copied.

 If you need to share files across plugins, use symlinks. See [Plugin caching and file resolution](/docs/en/plugins-reference#plugin-caching-and-file-resolution) for details.


## Create the marketplace file

Create `.claude-plugin/marketplace.json` in your repository root. This file defines your marketplace's name, owner information, and a list of plugins with their sources.

Each plugin entry needs at minimum a `name` and a `source` that tells Claude Code where to fetch it from. See the [full schema](#marketplace-schema) below for all available fields.

```json theme={null}
{
  "name": "company-tools",
  "owner": {
    "name": "DevTools Team",
    "email": "devtools@example.com"
  },
  "plugins": [
    {
      "name": "code-formatter",
      "source": "./plugins/formatter",
      "description": "Automatic code formatting on save",
      "version": "2.1.0",
      "author": {
        "name": "DevTools Team"
      }
    },
    {
      "name": "deployment-tools",
      "source": {
        "source": "github",
        "repo": "company/deploy-plugin"
      },
      "description": "Deployment automation tools"
    }
  ]
}
```

## Marketplace schema

### Required fields

| Field | Type | Description | Example |
| :-------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------------- |
| `name` | string | Marketplace identifier (kebab-case, no spaces). This is public-facing: users see it when installing plugins (for example, `/plugin install my-tool@your-marketplace`). Each user can register only one marketplace per name: adding a second marketplace with the same name replaces the first. To publish multiple plugins under one marketplace name, list them all in a [single `marketplace.json`](#create-the-marketplace-file). | `"acme-tools"` |
| `owner` | object | Marketplace maintainer information ([see fields below](#owner-fields)) | |
| `plugins` | array | List of available plugins | See below |


 **Reserved names**: the following marketplace names are reserved for official Anthropic use and can't be used by third-party marketplaces: `claude-code-marketplace`, `claude-code-plugins`, `claude-plugins-official`, `claude-plugins-community`, `claude-community`, `anthropic-marketplace`, `anthropic-plugins`, `agent-skills`, `anthropic-agent-skills`, `knowledge-work-plugins`, `life-sciences`, `claude-for-legal`, `claude-for-financial-services`, `financial-services-plugins`, `first-party-plugins`, `healthcare`. Names that impersonate official marketplaces, such as `official-claude-plugins` or `anthropic-plugins-v2`, are also blocked. Reserving these names prevents a third-party marketplace from presenting itself as an Anthropic-published source.

 Claude Code re-checks reserved names every time it loads a marketplace, not only when you add one. A marketplace that was registered under one of these names before the name became reserved stops loading and reports that it is [registered from an untrusted source](/docs/en/errors#marketplace-is-registered-from-an-untrusted-source). Remove that marketplace and re-add it from the official Anthropic source. A third-party marketplace affected by a newly reserved name loads again as soon as you re-add it under a different name. Before v2.1.205, `first-party-plugins` and `healthcare` weren't reserved, and a marketplace already registered under a reserved name kept loading.


### Owner fields

| Field | Type | Required | Description |
| :------ | :----- | :------- | :------------------------------------------- |
| `name` | string | Yes | Name of the maintainer or team |
| `email` | string | No | Contact email for the maintainer |
| `url` | string | No | Website, GitHub profile, or organization URL |

### Optional fields

| Field | Type | Description |
| :------------------------------------ | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `$schema` | string | JSON Schema URL for editor autocomplete and validation. Claude Code ignores this field at load time. |
| `description` | string | Brief marketplace description |
| `version` | string | Marketplace manifest version |
| `metadata.pluginRoot` | string | Base directory prepended to relative plugin source paths (for example, `"./plugins"` lets you write `"source": "formatter"` instead of `"source": "./plugins/formatter"`) |
| `allowCrossMarketplaceDependenciesOn` | array | Other marketplaces that plugins in this marketplace may depend on. Dependencies from a marketplace not listed here are blocked at install. See [Depend on a plugin from another marketplace](/docs/en/plugin-dependencies#depend-on-a-plugin-from-another-marketplace). |
| `renames` | object | Map from a former plugin `name` to its current name, or to `null` if the plugin was removed. Lets existing users migrate automatically when you rename or remove an entry in `plugins`. See [Rename or remove a plugin](#rename-or-remove-a-plugin). Requires Claude Code v2.1.193 or later. |

`description` and `version` are also accepted under `metadata` for backward compatibility.

## Plugin entries

Each plugin entry in the `plugins` array describes a plugin and where to find it. You can include any field from the [plugin manifest schema](/docs/en/plugins-reference#plugin-manifest-schema), such as `description`, `version`, `author`, `commands`, and `hooks`, plus these marketplace-specific fields: `source`, `category`, `tags`, `strict`, and `relevance`.

### Required fields

| Field | Type | Description |
| :------- | :------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name` | string | Plugin identifier (kebab-case, no spaces). This is public-facing: users see it when installing (for example, `/plugin install my-plugin@marketplace`). |
| `source` | string\|object | Where to fetch the plugin from (see [Plugin sources](#plugin-sources) below) |

### Optional plugin fields

**Standard metadata fields:**

| Field | Type | Description |
| :--------------- | :------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `displayName` | string | Human-readable name shown in UI surfaces. Falls back to `name` when omitted. May contain spaces and any casing. Not used for namespacing or lookup. Requires Claude Code v2.1.143 or later. |
| `description` | string | Brief plugin description |
| `version` | string | Plugin version. If set (here or in `plugin.json`), the plugin is pinned to this string and users only receive updates when it changes. A plugin with a [`command` source](#command-sources) isn't pinned by either field. If set in neither place, the version comes from the next source in [version management](/docs/en/plugins-reference#version-management). |
| `author` | object | Plugin author information (`name` required; `email` and `url` optional) |
| `homepage` | string | Plugin homepage or documentation URL |
| `repository` | string | Source code repository URL |
| `license` | string | SPDX license identifier (for example, MIT, Apache-2.0) |
| `keywords` | array | Tags for plugin discovery and categorization |
| `metadata` | object | Free-form object for your own fields, such as entitlement or catalog data. Claude Code doesn't read it. Before v2.1.222, `claude plugin validate` reported the key as an unrecognized field. |
| `category` | string | Plugin category for organization |
| `tags` | array | Tags for searchability |
| `strict` | boolean | Controls whether `plugin.json` is the authority for component definitions (default: true). See [Strict mode](#strict-mode) below. |
| `relevance` | object | Signals that tell Claude Code when to suggest this plugin to users. Takes effect only for marketplaces an administrator allowlists in managed settings. See [Recommend plugins for your org](/docs/en/plugin-relevance). Requires Claude Code v2.1.152 or later. |
| `defaultEnabled` | boolean | Whether the plugin is enabled after install (default: true). Set to `false` to install the plugin disabled until the user opts in. Takes precedence over the same field in the plugin's `plugin.json`. See [Default enablement](/docs/en/plugins-reference#default-enablement). Requires Claude Code v2.1.154 or later. |

**Component configuration fields:**

| Field | Type | Description |
| :----------- | :------------- | :------------------------------------------------------------- |
| `skills` | string\|array | Custom paths to skill directories containing ` /SKILL.md` |
| `commands` | string\|array | Custom paths to flat `.md` skill files or directories |
| `agents` | string\|array | Custom paths to agent files |
| `hooks` | string\|object | Custom hooks configuration or path to hooks file |
| `mcpServers` | string\|object | MCP server configurations or path to MCP config |
| `lspServers` | string\|object | LSP server configurations or path to LSP config |

## Plugin sources

Plugin sources tell Claude Code where to get each individual plugin listed in your marketplace. These are set in the `source` field of each plugin entry in `marketplace.json`.

Claude Code copies each installed plugin into the local versioned plugin cache at `~/.claude/plugins/cache`, except for a [`command` source in link mode](#copy-mode-and-link-mode), which Claude Code uses in place. Claude Code also [installs the plugin's eligible Node.js package dependencies](/docs/en/plugins-reference#node-js-package-dependencies) into the cached copy.

| Source | Type | Fields | Notes |
| ------------- | ------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Relative path | `string` (e.g. `"./my-plugin"`) | none | Local directory within the marketplace repo. Must start with `./`. Resolved relative to the marketplace root, not the `.claude-plugin/` directory |
| `github` | object | `repo`, `ref?`, `sha?` | |
| `url` | object | `url`, `ref?`, `sha?` | Git URL source |
| `git-subdir` | object | `url`, `path`, `ref?`, `sha?` | Subdirectory within a git repo. Clones sparsely to minimize bandwidth for monorepos |
| `npm` | object | `package`, `version?`, `registry?` | Installed via `npm install` |
| `archive` | object | `url`, `sha256?` | Zip archive downloaded over HTTPS. Works without git or npm on the user's machine. Requires Claude Code v2.1.224 or later |
| `command` | object | `command`, `timeout?`, `mode?` | Plugin directory produced by running a local command, re-run once per session to pick up changes. Requires Claude Code v2.1.229 or later |


 **Marketplace sources vs plugin sources**: These are different concepts that control different things.

 * **Marketplace source**: where to fetch the `marketplace.json` catalog itself. Set when users run `/plugin marketplace add` or in `extraKnownMarketplaces` settings. Git-based marketplace sources support `ref` (branch/tag) but not `sha`.
 * **Plugin source**: where to fetch an individual plugin listed in the marketplace. Set in the `source` field of each plugin entry inside `marketplace.json`. Git-based plugin sources support both `ref` (branch/tag) and `sha` (exact commit).

 For example, a marketplace hosted at `acme-corp/plugin-catalog` (marketplace source) can list a plugin fetched from `acme-corp/code-formatter` (plugin source). The marketplace source and plugin source point to different repositories and are pinned independently.


The git-based source types below are `github`, `url`, and `git-subdir`. When both `ref` and `sha` are set on any of them, the `sha` is the effective pin. Claude Code fetches and checks out the pinned commit directly.

On most git hosts, including GitHub, GitLab, and Bitbucket, this means installation succeeds even if the branch or tag named by `ref` has since been deleted upstream, as long as the commit is still reachable from the repository. Some servers, such as AWS CodeCommit, don't support fetching commits by SHA. On those servers the `ref` must still exist and the pinned commit must be reachable from it.


 If you distribute this marketplace through [Organization settings > Plugins](https://claude.ai/admin-settings/plugins) on a Team or Enterprise plan, different source rules apply:

 * The marketplace repository must be private or internal. Organization sync reads it through the Claude GitHub App or your organization's GitHub Enterprise App.
 * Each plugin source must be of type `github`, `url`, or `git-subdir`, or a [relative path](#relative-paths) within the marketplace repository.
 * A plugin source can be private in two cases: a github.com source that shares the marketplace repository's owner, or a source on your organization's GitHub Enterprise host with the GHE App installed on the repository. Organization sync fetches every other source without credentials, so github.com repositories under a different owner and repositories on other hosts, such as GitLab or Bitbucket, must be public.

 To include private plugins, place the plugin folders inside the marketplace repository and reference them with a [relative path](#relative-paths). Organization sync packages each plugin during distribution, so users never need access to a separate source repository. See [Manage plugins for your organization](https://support.claude.com/en/articles/13837433) for the admin workflow.


### Relative paths

For plugins in the same repository, use a path starting with `./`:

```json theme={null}
{
  "name": "my-plugin",
  "source": "./plugins/my-plugin"
}
```

Paths resolve relative to the marketplace root, which is the directory containing `.claude-plugin/`. In the example above, `./plugins/my-plugin` points to ` /plugins/my-plugin`, even though `marketplace.json` lives at ` /.claude-plugin/marketplace.json`. Don't use `../` to reference paths outside the marketplace root.


 Claude Code resolves relative paths against a local copy of the marketplace, so they work when users add your marketplace from a git source or a local directory. If users add your marketplace via a direct URL to the `marketplace.json` file, relative paths won't resolve, because Claude Code downloads only that file. For URL-based distribution, use any other [plugin source](#plugin-sources) instead. See [Troubleshooting](#plugins-with-relative-paths-fail-in-url-based-marketplaces) for details.


### GitHub repositories

```json theme={null}
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo"
  }
}
```

You can pin to a specific branch, tag, or commit:

```json theme={null}
{
  "name": "github-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

| Field | Type | Description |
| :----- | :----- | :-------------------------------------------------------------------- |
| `repo` | string | Required. GitHub repository in `owner/repo` format |
| `ref` | string | Optional. Git branch or tag (defaults to repository default branch) |
| `sha` | string | Optional. Full 40-character git commit SHA to pin to an exact version |

### Git repositories

```json theme={null}
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git"
  }
}
```

You can pin to a specific branch, tag, or commit:

```json theme={null}
{
  "name": "git-plugin",
  "source": {
    "source": "url",
    "url": "https://gitlab.com/team/plugin.git",
    "ref": "main",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

| Field | Type | Description |
| :---- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url` | string | Required. Full git repository URL (`https://` or `git@`). The `.git` suffix is optional, so Azure DevOps and AWS CodeCommit URLs without the suffix work |
| `ref` | string | Optional. Git branch or tag (defaults to repository default branch) |
| `sha` | string | Optional. Full 40-character git commit SHA to pin to an exact version |

### Git subdirectories

Use `git-subdir` to point to a plugin that lives inside a subdirectory of a git repository. Claude Code uses a sparse, partial clone to fetch only the subdirectory, minimizing bandwidth for large monorepos.

```json theme={null}
{
  "name": "my-plugin",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/acme-corp/monorepo.git",
    "path": "tools/claude-plugin"
  }
}
```

You can pin to a specific branch, tag, or commit:

```json theme={null}
{
  "name": "my-plugin",
  "source": {
    "source": "git-subdir",
    "url": "https://github.com/acme-corp/monorepo.git",
    "path": "tools/claude-plugin",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

The `url` field also accepts a GitHub shorthand (`owner/repo`) or SSH URLs (`git@github.com:owner/repo.git`).

| Field | Type | Description |
| :----- | :----- | :------------------------------------------------------------------------------------------------------- |
| `url` | string | Required. Git repository URL, GitHub `owner/repo` shorthand, or SSH URL |
| `path` | string | Required. Subdirectory path within the repo containing the plugin (for example, `"tools/claude-plugin"`) |
| `ref` | string | Optional. Git branch or tag (defaults to repository default branch) |
| `sha` | string | Optional. Full 40-character git commit SHA to pin to an exact version |

### npm packages

Plugins distributed as npm packages are installed using `npm install`. This works with any package on the public npm registry or a private registry your team hosts.

```json theme={null}
{
  "name": "my-npm-plugin",
  "source": {
    "source": "npm",
    "package": "@acme/claude-plugin"
  }
}
```

To pin to a specific version, add the `version` field:

```json theme={null}
{
  "name": "my-npm-plugin",
  "source": {
    "source": "npm",
    "package": "@acme/claude-plugin",
    "version": "2.1.0"
  }
}
```

To install from a private or internal registry, add the `registry` field:

```json theme={null}
{
  "name": "my-npm-plugin",
  "source": {
    "source": "npm",
    "package": "@acme/claude-plugin",
    "version": "^2.0.0",
    "registry": "https://npm.example.com"
  }
}
```

| Field | Type | Description |
| :--------- | :----- | :------------------------------------------------------------------------------------------- |
| `package` | string | Required. Package name or scoped package (for example, `@org/plugin`) |
| `version` | string | Optional. Version or version range (for example, `2.1.0`, `^2.0.0`, `~1.5.0`) |
| `registry` | string | Optional. Custom npm registry URL. Defaults to the system npm registry (typically npmjs.org) |

### Zip archives

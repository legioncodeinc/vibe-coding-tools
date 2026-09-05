# Install plugins (Cowork guide) | Claude Docs
- URL: https://claude.com/docs/cowork/guide/plugins
- Fetched: 2026-08-14
- Source type: official-docs
- Component: plugins

> Add packaged skills, connectors, and agents to Cowork from the plugin marketplace or a file.

A plugin is a package that extends what Claude can do in Cowork. Installing one can add skills, MCP connectors, subagents, slash commands, or hooks in a single step. Plugins come from the marketplace, from your organization, or from a file you upload.

Plugins are available in Cowork and Code. They aren't used in Chat.

## What a plugin can contain

A plugin's manifest declares any combination of the following.

| Component | What it adds |
| ---------- | ---------------------------------------------------------- |
| Skills | Reusable instructions that teach Claude a workflow |
| Connectors | MCP servers that give Claude access to an external service |
| Agents | Specialized subagents Claude can delegate to |
| Hooks | Scripts that run at defined points in a session |

After installing, open the plugin to see what it provides. Skills and agents appear as tabs; connectors and hooks have their own pages.

## Install a plugin

Open **Customize** in the sidebar, then **Plugins**.

1. Select **Browse plugins** to see available plugins. The default marketplace is Anthropic's official catalog; you can add other marketplaces by URL.
2. Select a plugin and click **Install**. If the plugin includes a connector that needs authentication, you're prompted to sign in.
3. Open the installed plugin to see its skills, connectors, agents, and hooks. Enable or disable individual components as needed.

To install from a file instead, select the upload option on the Plugins page and select the plugin package.

## Use a Git repository as a marketplace

A Git repository that contains plugin packages can serve as a marketplace. This is the typical way teams distribute their own plugins without publishing to the public catalog. Repositories on GitHub (including GitHub Enterprise) are supported; public repositories on GitLab and Bitbucket also work.

1. On the Plugins page, select **Add marketplace** and enter the repository's URL. Cowork accepts the standard `https://github.com/owner/repo` form and the `owner/repo` shorthand for GitHub.
2. Plugins defined in the repository appear alongside plugins from other marketplaces. Install them the same way.

Click **Update** on a marketplace to pull the latest plugins from its repository.

For administrator-managed marketplaces, see "MCP, plugins, skills, and hooks" in the deployment guide (/docs/cowork/3p/extensions).

## Limits

The following are the default limits for plugin packages and marketplaces.

| Limit | Value |
| ---------------------------------- | ------ |
| Plugin package size (uncompressed) | 200 MB |
| Files per plugin package | 5,000 |
| Marketplace repository archive | 512 MB |
| Plugins per marketplace | 500 |
| Marketplaces you can add | 25 |

The in-app skill viewer previews individual files up to 1 MB. Larger files appear in the file list as "too large to preview" but are still available to Claude at runtime.

## Plugins managed by your organization

On Team and Enterprise plans, administrators can require certain plugins for everyone in the organization. Required plugins install automatically and show **This plugin is required by your organization**; you can't remove them.

For how administrators provision plugins, see "MCP, plugins, skills, and hooks" in the deployment guide.

## Update and remove plugins

Cowork checks for plugin updates from the marketplace they came from. If you've edited a plugin's files locally, Cowork detects the change and warns you before an update would overwrite it.

To remove a plugin you installed, open it under **Customize → Plugins** and click **Uninstall**. Organization-managed plugins can only be removed by an administrator.

## Related

* Plugins overview (/docs/plugins/overview) for how plugins work across Claude products
* Submit a plugin (/docs/plugins/submit) to publish your own to the marketplace
* MCP, plugins, skills, and hooks (/docs/cowork/3p/extensions) for administrator provisioning

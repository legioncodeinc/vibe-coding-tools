# Configure permissions
- URL: https://code.claude.com/docs/en/permissions
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

# Configure permissions

> Control what Claude Code can access and do with fine-grained permission rules, modes, and managed policies.

Claude Code supports fine-grained permissions so that you can specify exactly what the agent is allowed to do and what it can't. You can check permission settings into version control to share them with every developer in your organization, and each developer can customize their own.

## Permission system

Claude Code uses a tiered permission system to balance power and safety:

| Tool type | Example | Approval required | "Yes, don't ask again" behavior |
| :---------------- | :--------------- | :---------------------------------------------------------------------------------- | :------------------------------------- |
| Read-only | File reads, Grep | No, within the [working directory and additional directories](#working-directories) | N/A |
| Bash commands | Shell execution | Yes, except a built-in set of [read-only commands](#read-only-commands) | Permanently per repository and command |
| File modification | Edit/write files | Yes | Until session end |

When you choose "Yes, don't ask again" and the approval saves permanently, such as for a Bash command, Claude Code saves the rule to `.claude/settings.local.json` at the root of the git repository, resolved through [worktrees](/docs/en/worktrees) to the main checkout. The rule applies to future sessions anywhere in that repository, including sessions started in subdirectories and in worktrees. A file-modification approval isn't saved to the file: as the table shows, it lasts until the session ends. Outside a git repository, and when the repository root is your home directory, Claude Code saves the rule in the directory you started it from.

Before v2.1.211, Claude Code always saved the rule in the starting directory, so an approval granted in a worktree or subdirectory didn't apply to the rest of the repository. Rules that earlier versions saved in a subdirectory or worktree still apply to sessions started there.

On a Bash or PowerShell permission prompt, press `Ctrl+E` to show an explanation of the command: what it does, why Claude is running it, and what could go wrong, labeled **Low risk**, **Med risk**, or **High risk**. Claude Code sends the command and Claude's own description of the call to the model to generate the explanation only when you press `Ctrl+E`, not on every prompt. Showing the explanation doesn't run the command; press `Ctrl+E` again to hide it.

To turn the shortcut off, set [`permissionExplainerEnabled`](/docs/en/settings#global-config-settings) to `false` in `~/.claude.json`.

## Manage permissions

You can view and manage Claude Code's tool permissions with `/permissions`. This UI lists all permission rules and the `settings.json` file each rule comes from.

* **Allow** rules let Claude Code use the specified tool without manual approval.
* **Ask** rules prompt for confirmation whenever Claude Code tries to use the specified tool.
* **Deny** rules prevent Claude Code from using the specified tool.

Rules are evaluated in order: deny, then ask, then allow. The first match in that order determines the outcome, and rule specificity doesn't change the order.

A broad deny rule like `Bash(aws *)` blocks every matching call, including calls that also match a narrower allow rule like `Bash(aws s3 ls)`, so a deny rule can't carry allowlist exceptions. The same precedence applies between ask and allow: a matching ask rule prompts even when a more specific allow rule also matches the same call.

Deny rules behave differently depending on whether they name a tool or scope a pattern within one. A bare tool name like `Bash` removes the tool from Claude's context entirely, so Claude never sees it. Bare-name removal applies to every tool except [`EndConversation`](/docs/en/tools-reference#endconversation-tool-behavior): a deny rule can't remove it while any other tool remains, and an ask rule never prompts for it. A scoped rule like `Bash(rm *)` leaves the tool available and blocks matching calls when Claude attempts them.


 Permission rules are enforced by Claude Code, not by the model. Instructions in your prompt or `CLAUDE.md` shape what Claude tries to do, but they don't change what Claude Code allows. To grant or revoke access, use `/permissions`, the rules described here, a [permission mode](/docs/en/permission-modes), or a [PreToolUse hook](#extend-permissions-with-hooks).


## Permission modes

Claude Code supports several permission modes that control how it approves tool calls. See [Permission modes](/docs/en/permission-modes) for when to use each one. Set the `defaultMode` in your [settings files](/docs/en/settings#settings-files). In sessions the VS Code extension starts, the extension resolves the starting mode instead. See [Switch permission modes](/docs/en/permission-modes#switch-permission-modes).

| Mode | Description |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `default` | Standard behavior: prompts for permission on first use of each tool. Labeled Manual in the CLI, the VS Code and JetBrains extensions, and the desktop app, and Claude Code accepts `manual` as an alias. The label and alias require Claude Code v2.1.200 or later. The desktop app's label doesn't depend on your CLI version |
| `acceptEdits` | Automatically accepts file edits and common filesystem commands such as `mkdir`, `touch`, `mv`, and `cp` for paths in the working directory or `additionalDirectories` |
| `plan` | Claude reads files and runs read-only shell commands to explore but doesn't edit your source files; with [auto mode](/docs/en/permission-modes#eliminate-prompts-with-auto-mode) available, classifier-approved commands also run. Labeled Plan in the CLI and the VS Code extension |
| `auto` | Auto-approves tool calls with background safety checks that verify actions align with your request |
| `dontAsk` | Auto-denies tools unless pre-approved via `/permissions` or `permissions.allow` rules. `AskUserQuestion`, connector tools [your organization set to `ask`](/docs/en/mcp#organization-controls-on-connector-tools), and MCP tools marked [`requiresUserInteraction`](/docs/en/mcp#require-approval-for-a-specific-tool) are denied even if you've allowed them |
| `bypassPermissions` | Skips permission prompts, except those forced by explicit `ask` rules, connector tools [your organization set to `ask`](/docs/en/mcp#organization-controls-on-connector-tools), and MCP tools marked [`requiresUserInteraction`](/docs/en/mcp#require-approval-for-a-specific-tool). Root and home directory removals such as `rm -rf /` also still prompt as a circuit breaker, and the [cross-session messaging safeguards](/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode) still apply |


 `bypassPermissions` mode skips permission prompts, including for writes to [protected paths](/docs/en/permission-modes#protected-paths) such as `.git` and `.claude`. The [cross-session messaging safeguards](/docs/en/permission-modes#skip-all-checks-with-bypasspermissions-mode) still apply. Only use this mode in isolated environments like containers or VMs where Claude Code can't cause damage.

 A few prompts still fire in this mode. Explicit `ask` rules, connector tools [your organization set to `ask`](/docs/en/mcp#organization-controls-on-connector-tools), and MCP tools marked [`requiresUserInteraction`](/docs/en/mcp#require-approval-for-a-specific-tool) still prompt. Removals targeting the filesystem root or home directory, such as `rm -rf /` and `rm -rf ~`, also prompt as a circuit breaker against model error, including when the command contains command substitution with `$(...)` or backticks, or process substitution with `<(...)`.


To prevent `bypassPermissions` or `auto` mode from being used, set `permissions.disableBypassPermissionsMode` or `permissions.disableAutoMode` to `"disable"` in any [settings file](/docs/en/settings#settings-files). These are most useful in [managed settings](#managed-settings) where they can't be overridden.

## Permission rule syntax

Permission rules follow the format `Tool` or `Tool(specifier)`.

### Match all uses of a tool

To match all uses of a tool, use only the tool name without parentheses:

| Rule | Effect |
| :--------- | :----------------------------- |
| `Bash` | Matches all Bash commands |
| `WebFetch` | Matches all web fetch requests |
| `Read` | Matches all file reads |

`Bash(*)` is equivalent to `Bash` and matches all Bash commands. As a deny rule, both forms remove the tool from Claude's context.

### Use specifiers for fine-grained control

Add a specifier in parentheses to match specific tool uses:

| Rule | Effect |
| :----------------------------- | :------------------------------------------------------- |
| `Bash(npm run build)` | Matches the exact command `npm run build` |
| `Read(./.env)` | Matches reading the `.env` file in the current directory |
| `WebFetch(domain:example.com)` | Matches fetch requests to example.com |

### Match by input parameter

Deny and ask rules can match a top-level input parameter on any tool with `Tool(param:value)`. The rule matches when Claude calls the tool with that parameter set to that exact value. An allow rule for one parameter value wouldn't establish that the call is safe overall, so allow rules continue to use each tool's own specifier syntax. This works for any scalar parameter the tool accepts:

| Rule | Matches |
| :----------------------------- | :------------------------------------------- |
| `Agent(model:opus)` | Agent calls that request the Opus model tier |
| `Agent(isolation:worktree)` | Agent calls that request a git worktree |
| `Bash(run_in_background:true)` | Bash calls that run in the background |

Parameter matching follows these rules:

* The parameter name must be a direct field of the tool's input, such as `model` on the Agent tool. Fields nested inside an object or array are not matchable
* Each rule names one parameter. To gate on both `model` and `isolation`, write two rules, `Agent(model:opus)` and `Agent(isolation:worktree)`, rather than combining them in one rule
* The value supports `*` as a wildcard that matches any sequence of characters, so `Agent(isolation:*)` matches any explicit isolation value. Without `*` the match is exact
* A parameter the model omits is never matched, so `Agent(model:*)` doesn't match a call that leaves `model` unset
* The value is compared against the literal input Claude sends, before any normalization. `Agent(model:opus)` matches the alias `opus` but not a full model ID. Run with [`--verbose`](/docs/en/cli-reference) to see the exact parameter names and values in each tool call
* Whitespace around the colon is ignored

You can't match a tool's primary content field this way: `command` for Bash and PowerShell, `file_path` for Read, Edit, and Write, `path` for Grep and Glob, `notebook_path` for NotebookEdit, and `url` for WebFetch. A rule like `Bash(command:rm *)` would be bypassable by a compound command, so Claude Code ignores it and emits a startup warning. Use `Bash(rm *)`, `Read(./path)`, or `WebFetch(domain:host)` instead.

### Wildcard patterns

Bash rules support glob patterns with `*`. This configuration allows npm and git commit commands while blocking git push:

```json theme={null}
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)",
      "Bash(git * main)",
      "Bash(* --version)",
      "Bash(* --help *)"
    ],
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

The `:*` suffix is an equivalent way to write a trailing wildcard, so `Bash(ls:*)` matches the same commands as `Bash(ls *)`.

The permission dialog writes the space-separated form when you select "Yes, don't ask again" for a command prefix. The `:*` form is only recognized at the end of a pattern. In a pattern like `Bash(git:* push)`, the colon is treated as a literal character and won't match git commands.

### Tool name wildcards

Deny and ask rules also accept glob patterns in the tool-name position. The pattern must match the full tool name: `"*"` matches every tool, and `"mcp__*"` matches every MCP tool across all servers. A tool matched by a bare-name glob deny rule is removed from Claude's context, the same as a bare tool name, including the [`EndConversation`](/docs/en/tools-reference#endconversation-tool-behavior) exception: a glob deny can't remove it while any other tool remains, and a glob ask never prompts for it. This configuration denies every MCP tool:

```json theme={null}
{
  "permissions": {
    "deny": [
      "mcp__*"
    ]
  }
}
```

Allow rules accept tool-name globs only after a literal `mcp__ __` prefix. The server segment must be glob-free so the rule names a specific server you configured. `mcp__puppeteer__*` matches every tool from the `puppeteer` server, and `mcp__github__get_*` matches its `get_` tools. An unanchored allow glob such as `"*"`, `"B*"`, or `"mcp__*"` is skipped with a warning and doesn't auto-approve anything.

A deny or ask rule whose tool name matches no known tool produces a startup warning to catch typos. Tool names containing `_` or `*` are exempt from the check.

The label shown for a tool in the transcript and permission dialog can differ from its canonical name. For example, the tool labeled `Stop Task` in the transcript has the canonical name `TaskStop`. Permission rules and [hook matchers](/docs/en/hooks) match the canonical name only, so a rule written as `Stop Task` doesn't match. For deny and ask rules, the startup warning above catches the mismatch. Use the canonical names listed in the [tools reference](/docs/en/tools-reference).

## Tool-specific permission rules

### Bash

Bash permission rules support wildcard matching with `*`. Wildcards can appear at any position in the command, including at the beginning, middle, or end:

* `Bash(npm run build)` matches the exact Bash command `npm run build`
* `Bash(npm run test *)` matches Bash commands starting with `npm run test`
* `Bash(npm *)` matches any command starting with `npm `
* `Bash(* install)` matches any command ending with ` install`
* `Bash(git * main)` matches commands like `git checkout main` and `git log --oneline main`

A single `*` matches any sequence of characters including spaces, so one wildcard can span multiple arguments. `Bash(git *)` matches `git log --oneline --all`, and `Bash(git * main)` matches `git push origin main` as well as `git merge main`.

When `*` appears at the end with a space before it (like `Bash(ls *)`), it enforces a word boundary, requiring the prefix to be followed by a space or end-of-string. For example, `Bash(ls *)` matches `ls -la` but not `lsof`. In contrast, `Bash(ls*)` without a space matches both `ls -la` and `lsof` because there's no word boundary constraint.

#### Compound commands


 Claude Code is aware of shell operators, so a rule like `Bash(safe-cmd *)` won't give it permission to run the command `safe-cmd && other-cmd`. The recognized command separators are `&&`, `||`, `;`, `|`, `|&`, `&`, and newlines. A rule must match each subcommand independently.


When you approve a compound command with "Yes, don't ask again", Claude Code saves a separate rule for each subcommand that requires approval, rather than a single rule for the full compound string. For example, approving `git status && npm test` saves a rule for `npm test`, so future `npm test` invocations are recognized regardless of what precedes the `&&`. Subcommands like `cd` into a subdirectory generate their own Read rule for that path. Up to 5 rules may be saved for a single compound command.


 Wrappers


Before matching Bash rules, Claude Code strips a fixed set of wrappers, so a rule like `Bash(npm test *)` also matches `timeout 30 npm test`. The stripped wrappers are `timeout`, `time`, `nice`, `nohup`, and `stdbuf`, plus the shell builtins `command` and `builtin`, and zsh's `noglob`. Each runs its argument as the actual command. Two related forms aren't stripped: the query form `command -v`, which looks up a command rather than running one, and zsh's `nocorrect`.

Claude Code also strips a leading assignment of certain known-safe environment variables, so `Bash(npm test *)` matches `NODE_ENV=test npm test`. An allow rule won't match past an assignment of any other variable. A deny or ask rule matches past any leading assignment, so `Bash(rm *)` in deny still matches `FOO=bar rm -rf tmp/`.

Bare `xargs` is also stripped, so `Bash(grep *)` matches `xargs grep pattern`. Stripping applies only when `xargs` has no flags: an invocation like `xargs -n1 grep pattern` is matched as an `xargs` command, so rules written for the inner command do not cover it.

This wrapper list is built in and is not configurable. Development environment runners such as `direnv exec`, `devbox run`, `mise exec`, `npx`, and `docker exec` are not in the list. Because these tools execute their arguments as a command, a rule like `Bash(devbox run *)` matches whatever comes after `run`, including `devbox run rm -rf .`. To approve work inside an environment runner, write a specific rule that includes both the runner and the inner command, such as `Bash(devbox run npm test)`. Add one rule per inner command you want to allow.

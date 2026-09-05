# Agent approvals & security – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/agent-approvals-security
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

Codex helps protect your code and data and reduces the risk of misuse.

This page covers how to operate Codex safely, including sandboxing, approvals, and network access. If you are looking for Codex Security, the product for scanning connected GitHub repositories, see Codex Security.

By default, the agent runs with network access turned off. Locally, Codex uses an OS-enforced sandbox that limits what it can touch (typically to the current workspace), plus an approval policy that controls when it must stop and ask you before acting.

## Sandbox and approvals

Codex security controls come from two layers that work together:

- Sandbox mode: What Codex can do technically (for example, where it can write and whether it can reach the network) when it executes model-generated commands.
- Approval policy: When Codex must ask you before it executes an action (for example, leaving the sandbox, using the network, or running commands outside a trusted set).

Codex uses different sandbox modes depending on where you run it:

- Codex cloud: Runs in isolated OpenAI-managed containers, preventing access to your host system or unrelated data. Uses a two-phase runtime model: setup runs before the agent phase and can access the network to install specified dependencies, then the agent phase runs offline by default unless you enable internet access for that environment. Secrets configured for cloud environments are available only during setup and are removed before the agent phase starts.
- Codex CLI / IDE extension: OS-level mechanisms enforce sandbox policies. Defaults include no network access and write permissions limited to the active workspace. You can configure the sandbox, approval policy, and network settings based on your risk tolerance.

In the `Auto` preset (for example, `--sandbox workspace-write --ask-for-approval on-request`), Codex can read files, make edits, and run commands in the working directory automatically.

Codex asks for approval to edit files outside the workspace or to run commands that require network access. If you want to chat or plan without making changes, switch to `read-only` mode with the `/permissions` command.

Codex can also elicit approval for app (connector) tool calls that advertise side effects, even when the action isn't a shell command or file change. Destructive app/MCP tool calls always require approval when the tool advertises a destructive annotation, even if it also advertises other hints (for example, read-only hints).

## Network access

For Codex cloud, see agent internet access to enable full internet access or a domain allow list.

For the ChatGPT desktop app, Codex CLI, or IDE extension, the default `workspace-write` sandbox mode keeps network access turned off unless you enable it:

```toml
[sandbox_workspace_write]
network_access = true
```

### Network isolation

Network access is controlled through destination rules that apply to scripts, programs, and subprocesses spawned by commands. When command network access is already enabled, turn on the `network_proxy` feature to constrain that traffic to the network policy you configure.

```toml
[features.network_proxy]
enabled = true
domains = { "api.openai.com" = "allow", "example.com" = "deny" }
```

For a one-off CLI session:

```bash
codex \
  -c 'features.network_proxy=true' \
  -c 'sandbox_workspace_write.network_access=true'

codex \
  -c 'features.network_proxy.enabled=true' \
  -c 'features.network_proxy.domains={ "api.openai.com" = "allow", "example.com" = "deny" }' \
  -c 'sandbox_workspace_write.network_access=true'
```

The feature changes how enabled network access is enforced; it does not grant network access by itself:

- Network off + `network_proxy` on: network stays off, and the feature does nothing.
- Network on + `network_proxy` off: network stays on with unrestricted direct outbound access.
- Network on + `network_proxy` on: network stays on, and outbound traffic is constrained by the configured network policy.

#### Network policy

Domain rules are allowlist-first:

- Exact hosts match only themselves.
- `*.example.com` matches subdomains such as `api.example.com`, but not `example.com`.
- `**.example.com` matches both the apex and subdomains.
- A global `*` allow rule matches any public host that is not denied. Treat `*` as broad network access and prefer scoped rules when you can.
- `deny` always wins over `allow`, and global `*` is only valid for allow rules.

#### Local and private destinations

By default, `allow_local_binding = false` blocks loopback, link-local, and private destinations. Specific exceptions require an exact local IP literal or `localhost` allow rule. Wildcards do not count as explicit local exceptions. Hostnames that resolve to local/private IPs stay blocked even if they match the allowlist.

#### DNS rebinding protections

Codex performs a best-effort DNS and IP classification check before allowing a hostname. Lookups that fail or time out are blocked; hostnames resolving to non-public addresses are blocked. This reduces (but does not eliminate) DNS rebinding risk.

#### Dangerous settings

- `dangerously_allow_non_loopback_proxy = true` can expose proxy listeners beyond loopback.
- `dangerously_allow_all_unix_sockets = true` bypasses the Unix socket allowlist.

`network_proxy` settings table (defaults): `enabled` (false), `domains` (unset/allowlist), `unix_sockets` (unset), `allow_local_binding` (false), `enable_socks5` (true), `enable_socks5_udp` (true), `allow_upstream_proxy` (true), `dangerously_allow_non_loopback_proxy` (false), `dangerously_allow_all_unix_sockets` (false).

Codex defaults to a web search cache (OpenAI-maintained index). Use `--search` or `web_search = "live"` for live browsing, or `"disabled"` to turn it off.

## Defaults and recommendations

- On launch, Codex detects whether the folder is version-controlled and recommends: version-controlled → `Auto` (workspace write + on-request approvals); non-version-controlled → `read-only`.
- Codex may also start in `read-only` until you explicitly trust the working directory.
- The workspace includes the current directory and temporary directories like `/tmp`. Use `/status` to see which directories are in the workspace.
- `codex --sandbox workspace-write --ask-for-approval on-request`
- `codex --sandbox read-only --ask-for-approval on-request`

### Protected paths in writable roots

In the default `workspace-write` sandbox policy, writable roots still include protected paths:

- `<writable_root>/.git` is protected as read-only whether it appears as a directory or file.
- If `<writable_root>/.git` is a pointer file (`gitdir: ...`), the resolved Git directory path is also protected as read-only.
- `<writable_root>/.agents` is protected as read-only when it exists as a directory.
- `<writable_root>/.codex` is protected as read-only when it exists as a directory.
- Protection is recursive.

### Run without approval prompts

`--ask-for-approval never` (or `-a never`) disables approval prompts and works with all `--sandbox` modes.

For full autonomy with network access, use `--sandbox danger-full-access` (or `--dangerously-bypass-approvals-and-sandbox`, alias `--yolo`). Use caution.

For a middle ground, `approval_policy = { granular = { ... } }` lets you keep specific approval prompt categories interactive while automatically rejecting others: `sandbox_approval`, `rules` (execpolicy-rule prompts), `mcp_elicitations`, `request_permissions`, and `skill_approval`.

### Automatic approval reviews

```toml
approvals_reviewer = "user"   # default
```

Set `approvals_reviewer = "auto_review"` to route eligible approval requests (on-request or granular policy) through a reviewer agent before Codex runs the request:

```toml
approval_policy = "on-request"
approvals_reviewer = "auto_review"
```

The reviewer evaluates only actions that already need approval (sandbox escalations, blocked network requests, `request_permissions` prompts, side-effecting app/MCP tool calls). The reviewer policy checks for data exfiltration, credential probing, persistent security weakening, and destructive actions. Low/medium-risk actions can proceed when policy allows; critical-risk actions are denied; high-risk actions require enough user authorization and no matching deny rule. Prompt-build, review-session, and parse failures fail closed.

The default reviewer policy is in the open-source Codex repository. Enterprises can replace its tenant-specific section with `guardian_policy_config` in managed requirements; local `[auto_review].policy` text is also supported but managed requirements take precedence.

### Common sandbox and approval combinations

| Intent | Flags / config | Effect |
| --- | --- | --- |
| Auto (preset) | no flags or `--sandbox workspace-write --ask-for-approval on-request` | Codex can read/edit/run in workspace; asks for outside-workspace edits or network. |
| Safe read-only browsing | `--sandbox read-only --ask-for-approval on-request` | Read only; asks before edits, commands, or network. |
| Read-only non-interactive (CI) | `--sandbox read-only --ask-for-approval never` | Read only; never asks. |
| Auto-edit, ask for untrusted commands | `--sandbox workspace-write --ask-for-approval untrusted` | Reads/edits automatically; asks before untrusted commands. |
| Auto-review mode | `--sandbox workspace-write --ask-for-approval on-request -c approvals_reviewer=auto_review` | Same sandbox boundary as on-request, but eligible approvals reviewed by Auto-review instead of the user. |
| Dangerous full access | `--dangerously-bypass-approvals-and-sandbox` (alias `--yolo`) | No sandbox, no approvals (not recommended). |

For non-interactive runs, use `codex exec --sandbox workspace-write`; `codex exec --full-auto` is a deprecated compatibility path.

#### Configuration in `config.toml`

```toml
# Always ask for approval mode
approval_policy = "untrusted"
sandbox_mode    = "read-only"
allow_login_shell = false # optional hardening: disallow login shells for shell-based tools

# Optional: Allow network in workspace-write mode
[sandbox_workspace_write]
network_access = true

# Optional: granular approval policy
# approval_policy = { granular = {
#   sandbox_approval = true,
#   rules = true,
#   mcp_elicitations = true,
#   request_permissions = false,
#   skill_approval = false
# } }
```

Save presets as profile files, select with `codex --profile profile-name`:

```toml
# ~/.codex/full_auto.config.toml
approval_policy = "on-request"
sandbox_mode    = "workspace-write"
```

```toml
# ~/.codex/readonly_quiet.config.toml
approval_policy = "never"
sandbox_mode    = "read-only"
```

### Test the sandbox locally

```bash
# macOS
codex sandbox macos [--permissions-profile <name>] [--log-denials] [COMMAND]...
# Linux
codex sandbox linux [--permissions-profile <name>] [COMMAND]...
# Windows
codex sandbox windows [--permissions-profile <name>] [COMMAND]...
```

`codex sandbox` is also available as `codex debug`, with platform aliases (`codex sandbox seatbelt`, `codex sandbox landlock`).

## OS-level sandbox

- macOS: Seatbelt (`sandbox-exec` with a `-p` profile matching the `--sandbox` mode).
- Linux: `bwrap` plus `seccomp` by default (Landlock as fallback).
- Windows: uses the Linux sandbox when running under WSL2 (WSL1 supported through Codex 0.114 only; from 0.115 the Linux sandbox moved to `bwrap`). Native Windows uses a dedicated Windows sandbox implementation.

IDE extension on Windows can inherit WSL2 semantics via:

```json
{
  "chatgpt.runCodexInWindowsSubsystemForLinux": true
}
```

Native Windows config:

```toml
[windows]
sandbox = "unelevated" # or "elevated"
# sandbox_private_desktop = true  # default; set false only for compatibility
```

In containerized Linux environments (Docker) that block the namespace/seccomp operations Codex needs, configure the container for isolation and run `codex --sandbox danger-full-access` inside it.

### Run Codex in Dev Containers

Use the Codex secure devcontainer example as a reference implementation: Ubuntu 24.04 base image with Codex and dev tools, allowlist-driven firewall profile, VS Code settings/extensions, persistent mounts, and `bubblewrap` so Codex can still sandbox inside the container.

```bash
devcontainer up --workspace-folder . --config .devcontainer/devcontainer.secure.json
```

Pieces: `.devcontainer/devcontainer.secure.json`, `.devcontainer/Dockerfile.secure`, `.devcontainer/init-firewall.sh`.

## Version control

- Work on a feature branch and keep `git status` clean before delegating.
- Prefer patch-based workflows (`git diff`/`git apply`) over editing tracked files directly; commit frequently.
- Treat Codex suggestions like any other PR: run targeted verification, review diffs, document decisions in commit messages.

## Monitoring and telemetry

Codex supports opt-in OpenTelemetry (OTel) monitoring, off by default.

```toml
[otel]
environment = "staging"   # dev | staging | prod
exporter = "none"          # none | otlp-http | otlp-grpc
log_user_prompt = false     # redact prompt text unless policy allows
```

Event types include `codex.conversation_starts`, `codex.api_request`, `codex.sse_event`, `codex.websocket_request`/`codex.websocket_event`, `codex.user_prompt` (redacted by default), `codex.tool_decision`, `codex.tool_result`.

Security guidance: keep `log_user_prompt = false` unless policy explicitly permits storing prompt contents; route telemetry only to controlled collectors; treat tool arguments/outputs as sensitive; review local data retention settings (`history.persistence` / `history.max_bytes`).

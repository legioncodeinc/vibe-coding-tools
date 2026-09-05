# Permissions – Codex | OpenAI Developers
- URL: https://developers.openai.com/codex/permissions
- Fetched: 2026-08-14
- Source type: official-docs
- Component: rules

Beta. Permission profiles are under active development and may change.

Permission profiles do not compose with the older sandbox settings. Configure either `default_permissions` and `[permissions]`, or `sandbox_mode` / `sandbox_workspace_write`, but not both. If `sandbox_mode` appears in any loaded config file, you pass `--sandbox`, or the selected config profile sets `sandbox_mode`, Codex uses those older sandbox settings instead of `default_permissions`.

Managed `allowed_permission_profiles` is the exception: it makes Codex use permission profiles. Remove older settings such as `sandbox_mode` and `[sandbox_workspace_write]` before deploying a managed profile allowlist. For a mixed-version enterprise rollout, you can keep the managed `allowed_sandbox_modes` requirement as a temporary compatibility constraint until every client runs Codex 0.138.0 or later.

Permission profiles let you apply least-privilege boundaries to local commands Codex runs on your behalf. A profile is a named policy that combines filesystem rules (what commands can read/write) with network rules (which destinations commands can reach).

Local permission profiles are supported on macOS, Linux, WSL, and native Windows.

## Define and select a profile

Three built-in permission profiles:

- `:read-only` keeps local command execution read-only.
- `:workspace` allows writes inside the active workspace roots and system temp directories.
- `:danger-full-access` removes local sandbox restrictions.

Create a named profile under `[permissions.<name>]`, then set the top-level `default_permissions` key to that profile name or a built-in.

Custom profiles use two related concepts:

- `[permissions.<name>.workspace_roots]` adds concrete directories that count as workspace roots for that profile.
- `[permissions.<name>.filesystem.":workspace_roots"]` defines the filesystem rules Codex applies inside every effective workspace root (session runtime roots plus profile-defined roots).

Profiles use the normal config-layer model: higher-precedence layers can add/replace entries under the same profile name.

```toml
# /etc/codex/config.toml
[permissions.server.workspace_roots]
"~/code/server" = true
```

```toml
# ~/.codex/config.toml
[permissions.server.workspace_roots]
"~/code/mobile-app" = true
```

Full example:

```toml
default_permissions = "project-edit"

[permissions.project-edit.workspace_roots]
"~/code/app" = true
"~/code/shared-lib" = true

[permissions.project-edit.filesystem]
":minimal" = "read"

[permissions.project-edit.filesystem.":workspace_roots"]
"." = "write"
".devcontainer" = "read"
"**/*.env" = "deny"

[permissions.project-edit.network]
enabled = true

[permissions.project-edit.network.domains]
"api.openai.com" = "allow"
"objects.githubusercontent.com" = "allow"
"*.github.com" = "allow"
"tracking.example.com" = "deny"
```

Narrower deny rules stay in force even when a broader path is readable/writable.

## Extend a profile

```toml
default_permissions = "project-edit"

[permissions.project-edit]
description = "Project editing with OpenAI API access."
extends = ":workspace"

[permissions.project-edit.filesystem.":workspace_roots"]
"**/*.env" = "deny"

[permissions.project-edit.network]
enabled = true

[permissions.project-edit.network.domains]
"api.openai.com" = "allow"
```

A profile can extend `:read-only`, `:workspace`, or another named profile. It cannot extend `:danger-full-access`; Codex rejects unknown parents and inheritance cycles.

## Configuration spec (key entries)

| Entry | Type / values | Default | Details |
| --- | --- | --- | --- |
| `default_permissions` | String profile name | None | Names the applied profile. Must match `[permissions]` or a built-in. |
| `[permissions.<name>]` | Table | None | Defines a named profile. |
| `permissions.<name>.description` | String | None | Human-readable description (not inherited via `extends`). |
| `permissions.<name>.extends` | String profile name | None | Starts from another profile or `:read-only`/`:workspace`. |
| `[permissions.<name>.workspace_roots]` | Table | None | Adds profile-defined workspace roots. |
| `permissions.<name>.workspace_roots."<path>"` | Boolean | false | Adds path to workspace root set when true. |
| `[permissions.<name>.filesystem]` | Table | None | Maps filesystem paths to access values. Missing/empty tables keep access restricted + startup warning. |
| `permissions.<name>.filesystem.glob_scan_max_depth` | Number | None | Limits deny-read glob expansion (Linux/WSL/native Windows). |
| `[permissions.<name>.filesystem]."<path>"` | read/write/deny | None | Grants direct access; `deny` wins over equally specific write/read. |
| `[permissions.<name>.filesystem."<path>"]."<subpath>"` | read/write/deny | None | Grants access to a descendant. |
| `[permissions.<name>.network]` | Table | None | Configures network sandbox proxy and policy. |
| `permissions.<name>.network.enabled` | Boolean | false | Enables network access for the profile. |
| `[permissions.<name>.network.domains]` | Table | None | Maps host patterns to allow/deny. No allow entries = blocked. |
| `permissions.<name>.network.domains."<host>"` | allow/deny | None | Exact hosts, `*.example.com`, `**.example.com`, or `*` global allow. |
| `[permissions.<name>.network.unix_sockets]` | Table | None | Unix socket allowlist overrides (e.g., Docker). |
| `permissions.<name>.network.proxy_url` | URL | http://127.0.0.1:3128 | HTTP proxy listener. |
| `permissions.<name>.network.enable_socks5` | Boolean | true | SOCKS5 listener for ALL_PROXY/FTP. |
| `permissions.<name>.network.socks_url` | URL | http://127.0.0.1:8081 | SOCKS5 listener address. |
| `permissions.<name>.network.allow_local_binding` | Boolean | false | Disables local/private-network guard when true. |
| `permissions.<name>.network.dangerously_allow_non_loopback_proxy` | Boolean | false | Allows proxy listeners to bind non-loopback addresses. |
| `permissions.<name>.network.dangerously_allow_all_unix_sockets` | Boolean | false | Bypasses Unix socket allowlist. |

## Filesystem permissions

| Access | Meaning |
| --- | --- |
| `read` | Read files/list directories; no create/modify/rename/delete. |
| `write` | Read and modify, including create/rename/delete when OS allows. |
| `deny` | Denies reads and writes; carves out a subpath from a broader grant. |

More specific entries override broader ones. Same-path conflicts: `deny` > `write` > `read`.

```toml
[permissions.project-edit.filesystem]
":minimal" = "read"

[permissions.project-edit.filesystem.":workspace_roots"]
"." = "write"
".devcontainer" = "read"
"**/*.env" = "deny"
```

A more specific path can reopen a narrower subtree inside a broader deny:

```toml
[permissions.project-edit.filesystem]
"~/Documents" = "deny"
"~/Documents/codex" = "write"
```

Supported path forms:

| Path | Meaning | Scoped subpaths |
| --- | --- | --- |
| `:root` | Filesystem root | `.` only |
| `:minimal` | Platform/runtime paths needed by common tools | `.` only |
| `:workspace_roots` | Current session's workspace roots + enabled profile-defined roots | Yes |
| `:tmpdir` | `$TMPDIR` location | `.` only |
| `:slash_tmp` | `/tmp` folder | `.` only |
| `/absolute/path` | Platform absolute path | Yes |
| `~/path` | Path under home directory | Yes |

Native Windows home-relative paths can use backslashes (`~\work`); drive-letter and UNC paths supported.

### Deny reads with exact paths or globs

```toml
[permissions.project-edit.filesystem.":workspace_roots"]
"**/*.env" = "deny"
```

On Linux/WSL/native Windows, unbounded `**` deny-read patterns may need bounded pre-expansion:

```toml
[permissions.project-edit.filesystem]
glob_scan_max_depth = 3

[permissions.project-edit.filesystem.":workspace_roots"]
"**/*.env" = "deny"
```

`glob_scan_max_depth` must be ≥ 1.

## Network permissions

```toml
[permissions.project-edit.network]
enabled = true
```

```toml
[permissions.project-edit.network.domains]
"example.com" = "allow"      # exact host
"*.example.com" = "allow"    # subdomains only
"**.example.com" = "allow"   # apex and subdomains
"ads.example.com" = "deny"   # deny wins over allow
```

```toml
[permissions.project-edit.network]
enabled = true
proxy_url = "http://127.0.0.1:3128"
enable_socks5 = true
socks_url = "http://127.0.0.1:8081"
enable_socks5_udp = true
```

### Local and private networks

```toml
[permissions.project-edit.network.domains]
"localhost" = "allow"
"127.0.0.1" = "allow"
```

```toml
[permissions.project-edit.network]
enabled = true
allow_local_binding = true

[permissions.project-edit.network.domains]
"localhost" = "allow"
```

### Unix sockets

```toml
[permissions.project-edit.network.unix_sockets]
"/var/run/docker.sock" = "allow"
"/tmp/old.sock" = "deny"
```

## Migrate from older sandbox settings

Suggested starting points: `:read-only` for read-only workflows, `:workspace` for editing, `:danger-full-access` only for intentional broad access.

## Scope and enforcement

- What profiles control: local sandboxed command execution (filesystem writes, outbound destinations, local services). Connectors, MCP servers, browser/computer-use surfaces, and Codex cloud use their own controls.
- Enforcement: macOS uses Seatbelt (refuses to run unenforceable policies rather than running unsandboxed). Linux/WSL uses bubblewrap + seccomp with Landlock fallback. Native Windows: `elevated` sandboxing is strongest (dedicated low-privilege sandbox users, filesystem boundaries, firewall rules); `unelevated` is a weaker fallback.

## Common profiles

### Read-only with network allowlist

```toml
default_permissions = "readonly-net"

[permissions.readonly-net.filesystem]
":minimal" = "read"

[permissions.readonly-net.filesystem.":workspace_roots"]
"." = "read"

[permissions.readonly-net.network]
enabled = true

[permissions.readonly-net.network.domains]
"api.openai.com" = "allow"
```

### File access limited to workspace

```toml
default_permissions = "workspace-only"

[permissions.workspace-only]
extends = ":workspace"

[permissions.workspace-only.filesystem]
":root" = "deny"
":minimal" = "read"
":tmpdir" = "deny"
":slash_tmp" = "deny"
```

### Workspace write without network

```toml
default_permissions = "project-edit"

[permissions.project-edit.filesystem]
":minimal" = "read"

[permissions.project-edit.filesystem.":workspace_roots"]
"." = "write"

[permissions.project-edit.network]
enabled = false
```

### Workspace write with public web access

```toml
default_permissions = "workspace-net"

[permissions.workspace-net.filesystem]
":minimal" = "read"

[permissions.workspace-net.filesystem.":workspace_roots"]
"." = "write"

[permissions.workspace-net.network]
enabled = true

[permissions.workspace-net.network.domains]
"*" = "allow"
```

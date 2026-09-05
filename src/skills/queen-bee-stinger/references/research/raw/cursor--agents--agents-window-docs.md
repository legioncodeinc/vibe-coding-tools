# Agents Window | Cursor Docs
- URL: https://cursor.com/docs/agent/agents-window
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents

# Agents Window

The Agents Window is Cursor's agent-first interface. It provides a unified workspace to build with agents across repos and environments, including local, cloud, remote SSH, and more. It combines the power of parallel agents with the depth and control of a development environment.

You can switch back to the editor anytime, or have both open simultaneously.

## Open the Agents Window

If you're in the editor, type Cmd+Shift+P → Open Agents Window to open the Agents Window.

## Switch Back to the IDE

To return to the classic Cursor IDE, type Cmd+Shift+P → Open IDE. This opens the current workspace in the editor.

If you want to view or edit files without leaving the Agents Window, you can type Cmd+P to search files, or Cmd+Shift+F to search all files.

## Features Available Only in the Agents Window

The following features are available in the Agents Window:

- **Multi-workspace:** work with agents across all your projects from one place.
- **New diffs view:** review and commit changes, and manage PRs without leaving Cursor.
- **Parallel agents:** run many parallel agents in the cloud (and work with them from your phone, web, Slack, GitHub, and Linear).
- **Easier handoff between local and cloud:** quickly move an agent from cloud to local to iterate quickly, and move it back to the cloud so it keeps working on its own.
- **Cloud subagents:** hand off a task to a cloud subagent with `/in-cloud`, or `/babysit` a PR, so long-running work runs on its own VM and branch while you keep working locally.
- **Worktrees:** run agents in isolated Git checkouts so each task has its own files and changes.

## Choosing Between Agents Window and Editor

The Agents Window works well when you want to run and manage many agents in parallel. If you are using agents to write most of your code, the Agents Window helps pull you up to a higher level of abstraction.

The editor works well when you want the classic IDE with VS Code extensions and flexible screen splitting to see many files at once.

You can move between the two interfaces, and we will continue to support and improve both experiences.

## Enterprise access

Agents Window is generally available with Cursor 3, released on April 2, 2026. For the two weeks following launch, Enterprise Admins can control rollout within their organizations by giving access to their entire team or to specific users via Team settings. After the rollout period, all users will have access by default.

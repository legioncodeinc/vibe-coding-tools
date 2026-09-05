# Get started with Claude Cowork | Claude Help Center
- URL: https://support.claude.com/en/articles/13345190-get-started-with-claude-cowork
- Fetched: 2026-08-14
- Source type: official-docs
- Component: agents (also covers rules: global/folder instructions, and plugins overview)

This article explains how to use Claude Cowork, which brings Claude Code's agentic capabilities to knowledge work beyond coding.

## Availability

Claude Cowork is available on paid plans (Pro, Max, Team, Enterprise). Availability varies by surface:

Claude Desktop for macOS — Available on all paid plans.

Claude Desktop for Windows — Available on all paid plans. Cowork requires the latest version of Claude for Windows.

Web, at claude.ai — Available on Pro, Max, and Team plans. On Enterprise plans, available where an admin has enabled it.

Claude Mobile — Available on Pro, Max, and Team plans, in the latest version of Claude for iOS and Claude for Android. On Enterprise plans, available where an admin has enabled it.

Claude in Chrome side panel — Available on Max and Team plans, and rolling out to Pro plans. On Enterprise plans, available where an admin has enabled it.

On desktop, web, and mobile, chat and Cowork share one home, so you start both from the same place. Find the message box and select "Cowork," then describe your task. To go back to a regular conversation, select "Chat." In the Chrome side panel, opening the panel starts a Cowork session directly.

---

## What is Claude Cowork?

Claude Cowork uses the same agentic architecture that powers Claude Code, with no terminal required. Instead of responding to prompts one at a time, Claude can take on complex, multi-step tasks and execute them on your behalf.

With Cowork, you can describe an outcome, step away, and come back to finished work — formatted documents, organized files, synthesized research, and more. Cowork runs your sessions remotely in the cloud (in beta), so your sessions and files live with your Claude account and follow you across desktop, web, and mobile. Chat and Cowork now share one home, so handing Claude a task starts from the same message box as a conversation. With scheduled tasks, Claude can complete work for you automatically. With projects, you can organize related tasks into persistent, self-contained workspaces with their own files, links, instructions, and memory.

Important:

Cowork has unique risks due to its agentic nature and internet access.

Cowork respects your current network egress permissions.

Important: Network egress permissions don't apply to the web fetch or web search tools or MCPs, including Claude in Chrome. Web fetch runs server-side and is limited to search results and URLs you've shared.

Team or Enterprise plan owners can turn off web search for Cowork and Chat in Organization settings > Capabilities, or Claude in Chrome via Organization settings > Claude in Chrome.

You control your Cowork tasks and can delete a task at any time using the "Delete" option. Your Cowork task will be removed from your task history immediately, and deleted from our backend storage systems within 30 days, in accordance with our data retention periods.

Cowork via mobile and web is captured in the Compliance API.

If you're a Team or Enterprise plan admin, you can use OpenTelemetry (OTel) to monitor Claude Cowork activity across your organization.

### Key capabilities

Work from anywhere: Sessions in the cloud follow your Claude account. Start a task on one surface, steer it from another, and pick up the finished output wherever you are.

Work that continues without you: In sessions in the cloud, Claude keeps working when you close your laptop or step away.

Direct local file access: On desktop, Claude can read from and write to your local files without manual uploads or downloads.

Sub-agent coordination: Claude breaks complex work into smaller tasks and coordinates parallel workstreams to complete them.

Professional outputs: Generate polished deliverables like Excel spreadsheets with working formulas, PowerPoint presentations, and formatted documents.

Edit drafts in place: When Claude drafts a Markdown document, highlight the text you want changed, click "Edit with Claude," and type your request. Claude makes the edit right where you marked it, with no need to describe the section in your task thread.

Long-running tasks: Work on complex tasks for extended periods without conversation timeouts or context limits interrupting your progress.

Scheduled tasks: Create and save tasks that you can have Claude run on-demand or automatically on a cadence of your choosing. Scheduled tasks run in the cloud, with no device online.

Spreadsheets and presentations: Cowork can produce spreadsheets and slides that can be further edited with Claude for Excel and Powerpoint.

Projects: Group related tasks into separate workspaces with their own files, context, instructions, and memory.

Browser actions: Claude can open Chrome and work on websites — clicking, typing, navigating, and filling forms — for tasks that touch websites. On Max and Team plans, Pro plans as it rolls out, and Enterprise plans where an admin has enabled it, you can also run a Cowork session directly in the Chrome side panel.

---

## How Claude Cowork runs your tasks

Cowork runs your tasks in the cloud (in beta). Claude's work runs on Anthropic's servers, in an isolated environment, and your sessions and files are saved to your Claude account. Work continues if you close your laptop, and you can open the same session from any surface.

When a task needs something on your computer, like a local file or your browser, Claude reaches it through the Claude Desktop app on that computer. When you start a task in Cowork, Claude:

Analyzes your request and creates a plan.

Breaks complex work into subtasks when needed.

Runs code and shell commands in an isolated environment on Anthropic's servers.

Coordinates multiple workstreams in parallel if appropriate.

Delivers finished outputs to your session, where you can preview and download them.

You maintain visibility into what Claude is planning and doing throughout the process so you can steer when it matters, or let Claude run independently.

---

## Get started

### Requirements

Paid Claude subscription: Cowork is available to paid Claude plans (Pro, Max, Team, Enterprise) only.

For local file access, browser use, and computer use: The Claude Desktop app for macOS or Windows, open and connected. These capabilities reach things on your computer, so they need the app even though your session runs in the cloud.

Active internet connection: Required throughout the session.

## Start a Cowork session

Chat and Cowork share one home. To start a session on any surface:

Open Claude on the web at claude.ai, in the Claude Desktop app, or in the Claude mobile app.

In the message box, select "Cowork."

Describe the task you want Claude to complete.

Review Claude's approach, then let it run.

Note: Sessions keep running even when the desktop app is closed or your computer is asleep. If your task uses local files, your browser, or your computer, keep the desktop app open so Claude can reach them.

## What to expect during a task

When Claude is working on a task in Cowork:

Progress indicators show what Claude is doing at each step.

Transparency: Claude surfaces its reasoning and approach so you can follow along.

Steering: You can jump in to course-correct or provide additional direction mid-task.

Check in from anywhere: Open the same session on another surface to monitor progress, answer Claude's questions, or redirect the work.

Parallel work: For complex tasks, Claude may coordinate multiple sub-agents working simultaneously.

Deletion protection: When using Cowork, Claude requires your explicit permission before permanently deleting any files. You will see a permission prompt and will need to select "Allow" before Claude is allowed to perform deletion tasks.

Tasks can run for extended periods depending on complexity. You can monitor progress or step away and return when Claude finishes.

---

## Choose how Claude checks with you

Cowork has three modes that control when Claude asks your permission before taking an action, like using your connectors. You can change the mode at any time from the mode selector in the chat box.

| | Connector tool permission: "Always allow" | Connector tool permission: "Needs approval" | Connector tool permission: "Blocked" |
| --- | --- | --- | --- |
| "Manual" mode | Approved | Asks for permission | Denied |
| "Auto" mode* | Read-only tools are approved. For write/delete tools, Claude decides | Claude decides | Denied |
| "Skip" mode | Approved | Approved | Denied |

*Currently available for Pro and Max plans only.

Manually approve (Manual), formerly "Ask before acting." Claude pauses and asks for approval for actions. You review each request and choose Allow or Deny.

Automatically approve (Auto). Claude keeps working without stopping to ask about every step. Instead, Claude reviews each action for safety (such as checking for data exfiltration or prompt injection) and automatically blocks anything it determines to be unsafe. When an action is blocked, Claude looks for a safer way to finish the task or pauses and asks you directly.

Skip all approvals (Skip), formerly "Act without asking." Claude doesn't pause to ask and nothing checks its actions automatically. Only use this when you completely trust every action, connector, file, app, etc. involved in the task.

---

## Add global and folder instructions

### Global instructions

You can give Claude standing instructions that apply to every Cowork session. Use this to specify your preferred tone, output format, or background on your role.

To set global instructions:

Navigate to Settings > Cowork.

Click "Edit" next to Global instructions.

Type your instructions in the text box and click "Save."

### Folder instructions

Folder instructions add project-specific context to Cowork when you select a local folder on desktop. Claude can also update these on its own during a session.

---

## Claude Cowork plugins

Plugins customize how Claude works for your role, team, and company in Cowork. Each one bundles skills, connectors, and sub-agents into a single package. For details on finding, installing, and customizing plugins, see "Use plugins in Cowork."

---

## Schedule recurring tasks

You can set up tasks that Claude runs automatically or on demand. To schedule a task, type `/schedule` in any Cowork task. You can also click "Scheduled" in the left sidebar to view, create, and manage your scheduled tasks.

Scheduled tasks run in the cloud, so they don't need your computer to be awake or the desktop app open.

---

## Usage limits

Working on tasks with Cowork consumes more of your usage allocation than chatting with Claude. This is because complex, multi-step tasks are compute-intensive and require more tokens to execute.

---

## Permissions and security

Cowork runs with layered protections:

Session isolation: Claude's work runs in an isolated environment on Anthropic's servers, separate from your computer and your network. Shell commands and code Claude writes run inside that environment. Isolation protects your computer; it doesn't change what Claude can read or do through the access you've granted.

Controlled file and network access: Claude can only read and write files in folders you've connected, and network access follows the egress settings you've configured.

Important: Claude has access to the local files you grant it permission to access, and can take real actions on your behalf. Review Claude's planned actions before allowing it to proceed, especially when working with sensitive files.

Permissions work the same as for chat. You control which MCPs you connect to Claude and how often they ask for permission.

---

## Current limitations

Some Cowork capabilities are not yet available:

Memory: What Claude remembers about you in chat doesn't carry into Cowork sessions yet. Within Cowork, memory is supported in projects only.

No session sharing: Sessions can't be shared with others. On Team and Enterprise plans, you can share live artifacts within your organization.

Some features are desktop-only: Live artifacts and plugins that include local MCP servers work through the desktop app only.

## Related Articles

- Use Claude Cowork safely
- Use Claude Cowork on Team and Enterprise plans
- Assign tasks from anywhere in Claude Cowork
- Claude Cowork architecture overview
- Use Claude Cowork on web, desktop, and mobile

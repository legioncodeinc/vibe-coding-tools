# Primary-source capture: Electron security

- URL: https://www.electronjs.org/docs/latest/tutorial/security
- Fetch date: 2026-09-05
- Source type: official Electron documentation

Selected primary-source capture:

> It is paramount that you do not enable Node.js integration in any renderer that loads remote content.

The page says preload scripts can access Node features and expose a custom API to remote content through `contextBridge`. It connects disabling Node integration to limiting XSS escalation into code execution.

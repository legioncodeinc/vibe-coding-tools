# Secure Electron process boundary

Electron's official security guidance says not to enable Node.js integration for renderers that load remote content. It explains that a preload can instead expose a custom API with `contextBridge`. [raw/electron-security.md]

The official IPC tutorial demonstrates `ipcMain.handle` paired with a preload method that calls one defined `ipcRenderer.invoke` operation. It also warns against exposing the whole `ipcRenderer` API or forwarding an event object, because that leaks a more powerful object to renderer code. [raw/electron-ipc.md]

Use this review order:

1. List every renderer origin and decide whether it is local, trusted remote, or untrusted remote.
2. Define one narrow method per allowed native action in preload.
3. Re-validate parameters and authorization in the main process.
4. Deny unexpected navigation, window-open, permission, and shell-launch requests.
5. Exercise allow and deny paths in a native Electron run, then repeat against a packaged build if it is a release claim.

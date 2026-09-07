# Electron application reference

| Layer | Allowed responsibility | Never expose directly to untrusted renderer code |
|---|---|---|
| Main | Native privileges, validation, policy, IPC handlers | Broad filesystem, shell, or process primitives without authorization checks |
| Preload | Small context-bridge capability interface | Entire `ipcRenderer` object or event sender |
| Renderer | UI and request of approved capabilities | Node process privileges for remote content |

Source basis: [distilled-electron-app.md](research/distilled-electron-app.md).

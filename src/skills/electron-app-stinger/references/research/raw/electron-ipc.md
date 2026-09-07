# Primary-source capture: Electron IPC

- URL: https://www.electronjs.org/docs/latest/tutorial/ipc
- Fetch date: 2026-09-05
- Source type: official Electron documentation

The official example pairs `ipcMain.handle('dialog:openFile', ...)` with a preload `contextBridge.exposeInMainWorld` method that invokes that one channel. The page warns not to expose the whole `ipcRenderer.invoke` or `ipcRenderer.on` API and not to pass an event object through to renderer code.

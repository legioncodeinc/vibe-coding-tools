# electron-app-wasp-drone

**Plugin owner:** `backend-and-desktop-tools`. **Required selection:** wasp-nest-core. Resolve the selected installed owner before dispatch; use the source link for the canonical procedure.


## Domain

This Drone owns Electron application engineering: main, preload, renderer, typed IPC, sandboxing, navigation and permission policy, packaging integration, and native desktop verification. It does not claim reverse-engineering ownership for third-party Electron binaries.

## Paired Stinger

[electron-app-stinger](https://github.com/legioncodeinc/vibe-coding-tools/blob/v3.1.0/plugins/backend-and-desktop-tools/skills/electron-app-stinger) - current primary-source security and IPC patterns plus native evidence guidance.

## Trigger phrases

- "build an Electron app"
- "Electron IPC"
- "Electron preload"
- "Electron contextBridge"
- "package Electron"

## Do NOT route when

- The task is Tauri-specific, which belongs to tauri-wasp-drone.
- The task reverse engineers an external Electron app, which belongs to the separately scoped Electron dissection material when available.
- The task is a final security acceptance review, which belongs to security-wasp-drone.

## Inputs the Drone needs

- Electron version, target operating systems, loaded origins, privileged actions, preload and IPC files, packaging path, and required native evidence.

## Outputs

- Narrow process-boundary implementation, native and packaged test evidence, security handoff notes, and a report under `library/`.

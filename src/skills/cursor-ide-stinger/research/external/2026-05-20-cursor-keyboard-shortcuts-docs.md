---
source_type: official-docs
authority: high
relevance: high
topic: keybindings
url: https://cursor.com/help/customization/keyboard-shortcuts
fetched: 2026-05-20
---

# Keyboard Shortcuts - Cursor Official Documentation

## Summary

The official keyboard shortcuts reference. Cursor uses the same defaults as VS Code plus its own AI-specific shortcuts. Customization via `Cmd+R then Cmd+S` (Mac) or `Ctrl+R then Ctrl+S` (Windows/Linux), or search in the keyboard shortcuts editor.

**AI-specific shortcuts:**

| Action | Mac | Windows/Linux |
|--------|-----|---------------|
| Toggle Sidepanel | Cmd+I or Cmd+L | Ctrl+I or Ctrl+L |
| Inline edit | Cmd+K | Ctrl+K |
| Mode Menu | Cmd+. | Ctrl+. |
| Rotate between Agent modes | Shift+Tab | Shift+Tab |
| Loop between AI models | Cmd+/ | Ctrl+/ |
| Accept Tab suggestion | Tab | Tab |

**Additional AI shortcuts from community sources (authoritative):**
- Cmd+Shift+L / Ctrl+Shift+L: Add selected code as context to current chat
- Cmd+Enter / Ctrl+Enter: Accept all AI-suggested changes
- Cmd+Backspace / Ctrl+Backspace: Reject all AI-suggested changes
- Cmd+Right / Ctrl+Right: Accept next word of suggestion (partial accept)
- Cmd+N / Ctrl+N: Start new chat (fresh context)
- Cmd+Shift+P / Ctrl+Shift+P: Command palette
- Cmd+P / Ctrl+P: Quick file open
- Cmd+J / Ctrl+J: Toggle terminal
- Cmd+K in terminal: Generate terminal command with natural language
- Cmd+Shift+J / Ctrl+Shift+J: Cursor Settings

**Customization location:** `~/.cursor/User/keybindings.json` (same path as VS Code).

## Key quotations

- "Cursor uses the same default shortcuts as VS Code, plus shortcuts for AI features."
- "Rotate between Agent modes: Shift+Tab (all platforms)"
- "Loop between AI models: Cmd+/ / Ctrl+/"

## Annotations for stinger-forge

- This is the PRIMARY source for the shortcuts reference table in `guides/05-modes-and-productivity.md`.
- The `Cmd+.` / `Ctrl+.` Mode Menu shortcut is the least-known but most useful for switching between Agent/Ask/Plan/Debug - emphasize it.
- `Shift+Tab` for rotating modes and `Cmd+/` for model switching are the two shortcuts most power users are unaware of.
- The terminal `Cmd+K` shortcut (natural language terminal commands) is a high-value productivity tip to feature prominently.
- Keybindings file path `~/.cursor/User/keybindings.json` should be in the guide for users who want to customize.

---
source_url: https://docs.discord.com/developers/platform/components
retrieved_on: 2026-05-20
source_type: official_docs
authority: high
relevance: high
topic: components-modals
url: https://docs.discord.com/developers/platform/components
fetched: 2026-05-20
---

# Discord Developer Docs: Components & Modals (March 2026)

## Summary

Updated March 2026 documentation covering Discord's component system. Components are divided into Layout (organizing content), Content (text/media display), and Interactive (buttons, select menus, text inputs). Modals are form-like overlays triggered by interactions (commands or component clicks). Modals cannot be sent unprompted: they must be a response to an interaction. Modals only support text input components (not buttons or select menus).

## Key quotations / statistics

- "Message components are interactive and layout elements attached to messages your app sends."
- "Modals are form-like overlays that your app can present to users in response to an interaction, such as a button click, slash command, or select menu selection."
- "Unlike message components, modals aren't attached to a message. They're sent as an interaction response and appear as a focused overlay in the client."
- "The user fills in the fields and submits, which triggers a new interaction your app can handle."

## Component categories (2026)

- **Layout components**: Section, Container, Separator (organize content)
- **Content components**: Text Display, Thumbnail, Media Gallery, File Upload
- **Interactive components**: Buttons (up to 5 per row, 5 rows per message = 25 max), Select Menus (5 slots = 1 full row), Text Inputs (modal only), Radio Group, Checkbox Group

## Slots table (per action row)

| Component | Slots |
|-----------|-------|
| Button | 1 |
| Select Menu | 5 (full row) |
| Text Modal (input) | 1 (opened via button, in modal) |

Maximum: 25 buttons (no selects) OR 5 select menus (no buttons) per message.

## Annotations for stinger-forge

- **guides/03-components-modals.md**: The `custom_id` namespacing convention is critical: up to 100 chars, use `<command>:<userId>:<action>` pattern to avoid collision across users in same channel.
- Modals cannot contain buttons or select menus: only text inputs. This is a common beginner mistake.
- Modals must respond within the standard interaction timeout window (3 seconds for the initial response, 15 minutes for deferred).
- Ephemeral responses (`ephemeral: true`) are important for private workflows: the interaction token lasts 15 minutes for followup webhooks.
- "Radio Group" and "Checkbox Group" are new (2026) component types: worth documenting in templates as these are likely new to existing bot developers migrating from older SDKs.

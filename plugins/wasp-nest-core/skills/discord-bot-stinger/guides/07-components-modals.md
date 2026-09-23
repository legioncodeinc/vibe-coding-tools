# 07: Components & Modals

Buttons, select menus, modals: how to author, namespace, and handle interactive component flows.

*Sources: `research/external/2026-05-20-discord-components-modals.md`, `research/external/2026-05-20-discord-interactions-official.md`*

---

## Component constraints (Discord API v10)

| Component | Limit |
|-----------|-------|
| Action rows per message | 5 max |
| Buttons per action row | 5 max (so 25 buttons per message total) |
| Select menus per action row | 1 (select menu takes the full row) |
| Modal text inputs | 1-5 per modal |
| Button label length | 80 chars max |
| Select menu option label | 100 chars max |
| Modal custom_id | 100 chars max |
| Component custom_id | 100 chars max |
| Modal can contain | Text inputs only (no buttons, selects, or other interactive components) |

---

## custom_id namespacing convention

A `custom_id` uniquely identifies which component was pressed. Namespace them to avoid collisions between commands:

```
{command}:{userId}:{action}:{extra}
```

Examples:
- `confirm:1234567890:delete`: delete confirmation button for user 1234567890
- `queue:0987654321:skip:track-abc`: skip button in a music queue flow

Why include `userId`: without it, any user can click a button meant only for the person who triggered the command.

---

## discord.js: button + collector pattern

```ts
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

// Send message with button
const button = new ButtonBuilder()
  .setCustomId(`confirm:${interaction.user.id}:delete`)
  .setLabel("Confirm Delete")
  .setStyle(ButtonStyle.Danger);

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(button);
const reply = await interaction.reply({ content: "Are you sure?", components: [row], fetchReply: true });

// Collect the response
const collector = reply.createMessageComponentCollector({
  componentType: ComponentType.Button,
  time: 30_000, // 30 second timeout
  filter: i => i.customId.startsWith(`confirm:${interaction.user.id}`),
});

collector.on("collect", async i => {
  await i.update({ content: "Deleted.", components: [] });
});

collector.on("end", async (collected, reason) => {
  if (reason === "time") {
    await reply.edit({ content: "Timed out.", components: [] });
  }
});
```

**Key points:**
- Always remove components after the interaction is resolved (`components: []`).
- Always handle the `"time"` end reason to clean up orphaned buttons.
- The `filter` function prevents other users from clicking a button meant for one person.

---

## Modals

Modals are Discord's form-dialog primitive. They accept text inputs only.

```ts
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const modal = new ModalBuilder()
  .setCustomId(`feedback:${interaction.user.id}`)
  .setTitle("Submit Feedback");

const input = new TextInputBuilder()
  .setCustomId("feedback_text")
  .setLabel("Your feedback")
  .setStyle(TextInputStyle.Paragraph)
  .setRequired(true)
  .setMaxLength(1000);

modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
await interaction.showModal(modal);

// Collect modal submission
const submitted = await interaction.awaitModalSubmit({
  time: 120_000, // 2 minute timeout
  filter: i => i.customId === `feedback:${interaction.user.id}`,
}).catch(() => null); // null if timed out

if (!submitted) return;
const text = submitted.fields.getTextInputValue("feedback_text");
await submitted.reply({ content: "Feedback received!", ephemeral: true });
```

**Modal rules:**
- `custom_id` max 100 characters.
- Can only be shown from a command or component interaction (not a bare message).
- `TextInputStyle.Short` = single line; `TextInputStyle.Paragraph` = multi-line.
- Only text inputs allowed inside modals: no buttons, selects, etc.

---

## Ephemeral responses

Use `ephemeral: true` to make a reply visible only to the user who triggered the interaction:

```ts
await interaction.reply({ content: "Only you see this.", ephemeral: true });
```

Ephemeral messages **cannot be edited by the bot after 15 minutes** from the original interaction token expiry.

---

## Select menus

```ts
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

const menu = new StringSelectMenuBuilder()
  .setCustomId(`role:${interaction.user.id}`)
  .setPlaceholder("Pick a role")
  .addOptions(
    new StringSelectMenuOptionBuilder().setLabel("Developer").setValue("dev"),
    new StringSelectMenuOptionBuilder().setLabel("Designer").setValue("design"),
  );
```

Other select menu types: `UserSelectMenuBuilder`, `RoleSelectMenuBuilder`, `ChannelSelectMenuBuilder`, `MentionableSelectMenuBuilder`.

---

*See `examples/edge-case-modal-timeout.md` for a worked modal flow with timeout handling.*
